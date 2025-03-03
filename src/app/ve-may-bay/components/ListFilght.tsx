"use client";
import { FlightApi } from "@/api/Flight";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { addDays, parse, format, isValid, isBefore, isSameDay } from "date-fns";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  getCurrentLanguage,
  getDayLabel,
  handleScrollSmooth,
} from "@/utils/Helper";
import { HttpError } from "@/lib/error";
import { ListFilghtProps, TabDays } from "@/types/flight";
import FilghtDomesticList from "./Domestic/List";
import FlightInternationalList from "./International/List";
import { formatTranslationMap, translatePage } from "@/utils/translateDom";
import { flightStaticText } from "@/constants/staticText";
import { translateText } from "@/utils/translateApi";
import { toastMessages } from "@/lib/messages";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function ListFilght({ airportsData }: ListFilghtProps) {
  const router = useRouter();
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
  const [displayType, setDisplayType] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const [apiFlightSession, setApiFlightSession] = useState<string>("");
  // Handle Params
  const searchParams = useSearchParams();
  const StartPoint = searchParams.get("StartPoint") ?? "SGN";
  const EndPoint = searchParams.get("EndPoint") ?? "HAN";

  const from = searchParams.get("from") ?? "Sài Gòn";
  const to = searchParams.get("to") ?? "Hà Nội";

  const DepartDate =
    searchParams.get("DepartDate") ?? format(new Date(), "ddMMyyy");
  const ReturnDate = searchParams.get("ReturnDate") ?? DepartDate;
  const tripType = searchParams.get("tripType") ?? "oneWay";
  const passengerAdt = parseInt(searchParams.get("Adt") ?? "1");
  const passengerChd = parseInt(searchParams.get("Chd") ?? "0");
  const passengerInf = parseInt(searchParams.get("Inf") ?? "0");
  const totalPassengers = passengerAdt + passengerChd + passengerInf;
  const { language } = useLanguage();
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const params = useMemo(() => {
    let ListFlightSearch = [
      {
        StartPoint: StartPoint,
        EndPoint: EndPoint,
        DepartDate: DepartDate,
        Airline: "",
      },
    ];
    if (tripType === "roundTrip" && ReturnDate) {
      ListFlightSearch.push({
        StartPoint: EndPoint,
        EndPoint: StartPoint,
        DepartDate: ReturnDate,
        Airline: "",
      });
      setIsRoundTrip(true);
    } else {
      setIsRoundTrip(false);
    }
    return {
      TripType: tripType,
      Adt: passengerAdt,
      Chd: passengerChd,
      Inf: passengerInf,
      ViewMode: "",
      ListFlight: ListFlightSearch,
      Language: "vi",
    };
  }, [
    StartPoint,
    EndPoint,
    DepartDate,
    ReturnDate,
    tripType,
    passengerAdt,
    passengerChd,
    passengerInf,
  ]);
  // End
  const pathName: string = usePathname();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [totalFlightLeg, setTotalFlightLeg] = useState<any[]>([
    { 0: [], 1: [] },
  ]);
  const [stopNumFilters, setStopNumFilters] = useState<number[]>([]);
  const [flightType, setFlightType] = useState<string>("");
  const [translatedStaticText, setTranslatedStaticText] = useState<{}>({});
  const scrollToRef = (ref: any) => {
    if (ref.current) {
      handleScrollSmooth(ref.current);
    }
  };

  useEffect(() => {
    translateText(flightStaticText, getCurrentLanguage()).then((data) => {
      const translationMap = formatTranslationMap(flightStaticText, data);
      setTranslatedStaticText(translationMap);
    });
  }, []);
  // Handle Tabs Days
  const today = useMemo(() => {
    const departDate = searchParams.get("DepartDate");
    if (departDate) {
      const parsedDate = parse(departDate, "ddMMyyyy", new Date());
      return isValid(parsedDate) ? parsedDate : new Date();
    }
    return new Date();
  }, [searchParams]);

  const currentReturnDate = useMemo(() => {
    const currentReturnDate = searchParams.get("ReturnDate");
    if (currentReturnDate) {
      const parsedDate = parse(currentReturnDate, "ddMMyyyy", new Date());
      return isValid(parsedDate) ? parsedDate : new Date();
    }
    return new Date();
  }, [searchParams]);

  const [currentDate, setCurrentDate] = useState(today);
  const [currentReturnDay, setCurrentReturnDay] = useState(currentReturnDate);
  const [days, setDays] = useState<TabDays[]>([]);
  const [returnDays, setReturnDays] = useState<TabDays[]>([]);

  const generateDays = useCallback(
    (baseDate: Date, type: string, displayType: "desktop" | "mobile") => {
      const newDays: TabDays[] = [];

      for (let i = -3; i <= 3; i++) {
        const date = addDays(baseDate, i);
        const isDisabled =
          isBefore(date, new Date()) && !isSameDay(date, new Date());
        newDays.push({
          label: getDayLabel(date.getDay(), displayType),
          date,
          disabled: isDisabled,
        });
      }
      if (type === "depart") setDays(newDays);
      else setReturnDays(newDays);
    },
    []
  );

  useEffect(() => {
    setCurrentDate(today);
    setCurrentReturnDay(currentReturnDate);
  }, [today, currentReturnDate]);

  useEffect(() => {
    generateDays(currentDate, "depart", displayType);
    if (isRoundTrip) generateDays(currentReturnDay, "return", displayType);
  }, [currentDate, currentReturnDay, isRoundTrip, displayType, generateDays]);

  const handleClickDate = (date: Date, typeDate: number) => {
    const formattedDate = format(date, "ddMMyyyy");
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (typeDate) params.set("ReturnDate", formattedDate);
    else {
      setCurrentDate(date);
      params.set("DepartDate", formattedDate);
      if (date > currentReturnDate) {
        setCurrentReturnDay(date);
        params.set("ReturnDate", formattedDate);
      }
    }

    history.replaceState(null, "", `${pathName}?${params.toString()}`);
  };

  // Is desktop or Mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setDisplayType("desktop");
      } else {
        setDisplayType("mobile");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch and Handle Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setData([]);
        setLoading(true);
        const checkTripType =
          (tripType === "roundTrip" && ReturnDate) || tripType === "oneWay"
            ? true
            : false;
        if (StartPoint && EndPoint && DepartDate && checkTripType) {
          params.Language = getCurrentLanguage();
          const response = await FlightApi.search("flights/search", params);
          const dataRespon = response?.payload.data;
          const listFareData = dataRespon.ListFareData ?? [];
          const flightStopNum: number[] = [];

          if (listFareData.length) {
            listFareData.forEach((flight: any) => {
              const priceAtdWithoutTax = flight.TaxAdt * flight.Adt;
              const priceChdWithoutTax = flight.TaxChd * flight.Chd;
              const priceInfWithoutTax = flight.TaxInf * flight.Inf;
              flight.TotalPriceWithOutTax =
                flight.TotalPrice -
                (priceAtdWithoutTax + priceChdWithoutTax + priceInfWithoutTax);
              if (dataRespon.FlightType === "domestic" || !isRoundTrip) {
                const stopNum = flight.ListFlight[0].StopNum;
                if (!flightStopNum[stopNum]) {
                  flightStopNum[stopNum] = stopNum;
                }
              }
            });
            setApiFlightSession(response?.payload.data.Session);
            translatePage("#wrapper_search_flight", 10);
          }
          setFlightType(dataRespon.FlightType);
          setStopNumFilters(
            flightStopNum.filter(
              (item: any) => item !== undefined && item !== null
            )
          );
          setData(listFareData);
          setError(null);
        } else {
          router.push("/ve-may-bay");
          setData([]);
          toast.dismiss();
          toast.error(toaStrMsg.missingInfoSearchFlight);
        }
      } catch (error: any) {
        if (error instanceof HttpError) {
          if (error.payload.code === 400) {
            setError(toaStrMsg.notFoundFlight);
          }
        } else {
          setError(toaStrMsg.errorConnectApiFlight);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    params,
    StartPoint,
    EndPoint,
    DepartDate,
    ReturnDate,
    tripType,
    isRoundTrip,
    router,
    toaStrMsg,
  ]);

  // useEffect(() => {
  //   if (displayType === "mobile") {
  //     const scrollResultMobileTimeout = setTimeout(() => {
  //       scrollToRef(resultsRef);
  //     }, 100);
  //     return () => {
  //       clearTimeout(scrollResultMobileTimeout);
  //     };
  //   }
  // }, [displayType, data]);

  // Loading
  if (loading) {
    scrollToRef(resultsRef);
    return (
      <div
        ref={resultsRef}
        className={`flex mt-6 py-12 mb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
      >
        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
        <span className="text-18" data-translate>
          Đang tải dữ liệu chuyến bay...
        </span>
      </div>
    );
  }
  // Error Connect api
  if (error) {
    return (
      <div ref={resultsRef} className="px-4 w-full mx-auto my-20 text-center">
        <p className="text-18 font-semibold">{error}</p>
      </div>
    );
  }
  return (
    <Fragment>
      <div ref={resultsRef}>
        {flightType === "domestic" || !isRoundTrip ? (
          <FilghtDomesticList
            from={from}
            to={to}
            airportsData={airportsData}
            flights={data}
            returnDate={ReturnDate}
            departDate={DepartDate}
            currentDate={currentDate}
            currentReturnDay={currentReturnDay}
            returnDays={returnDays}
            departDays={days}
            handleClickDate={handleClickDate}
            flightSession={apiFlightSession}
            displayType={displayType}
            totalFlightLeg={totalFlightLeg}
            isRoundTrip={isRoundTrip}
            totalPassengers={totalPassengers}
            flightType={flightType}
            flightStopNum={stopNumFilters}
            translatedStaticText={translatedStaticText}
          />
        ) : (
          <FlightInternationalList
            from={from}
            to={to}
            airportsData={airportsData}
            flights={data}
            returnDate={ReturnDate}
            departDate={DepartDate}
            currentDate={currentDate}
            currentReturnDay={currentReturnDay}
            returnDays={returnDays}
            departDays={days}
            handleClickDate={handleClickDate}
            flightSession={apiFlightSession}
            displayType={displayType}
            isRoundTrip={isRoundTrip}
            totalFlightLeg={totalFlightLeg}
            totalPassengers={totalPassengers}
            flightType={flightType}
            translatedStaticText={translatedStaticText}
          />
        )}
      </div>
    </Fragment>
  );
}
