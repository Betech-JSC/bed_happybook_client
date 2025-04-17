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
import { formatTranslationMap, translatePage } from "@/utils/translateDom";
import { flightStaticText } from "@/constants/staticText";
import { translateText } from "@/utils/translateApi";
import { toastMessages } from "@/lib/messages";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useTranslation } from "@/app/hooks/useTranslation";
import ListFlights from "./SearchFlights/List";

export default function SearchFlightsResult({ airportsData }: ListFilghtProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const pathName: string = usePathname();
  const [translatedStaticText, setTranslatedStaticText] = useState<{}>({});
  const { t } = useTranslation(translatedStaticText);
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
  const [flightsData, setFlightsData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [stopNumFilters, setStopNumFilters] = useState<number[]>([]);
  const [flightType, setFlightType] = useState<string>("");

  const [searchId, setSearchId] = useState<string | null>(null);
  const [flightItineraryResource, setFlightItineraryResource] = useState<
    Array<{ key: string; value: number }>
  >([]);
  const [isFullFlightResource, setIsFullFlightResource] =
    useState<boolean>(false);
  const [isReady, setIsReady] = useState(false);

  const params = useMemo(() => {
    let flightType: string = "OW";
    let ListFlightSearch = [
      {
        startPoint: StartPoint,
        endPoint: EndPoint,
        departDate: DepartDate,
        returnDate: "",
      },
    ];
    if (tripType === "roundTrip" && ReturnDate) {
      ListFlightSearch[0].returnDate = ReturnDate;
      flightType = "RT";
      setIsRoundTrip(true);
    } else {
      setIsRoundTrip(false);
    }
    return {
      TripType: tripType,
      adult: passengerAdt,
      child: passengerChd,
      infant: passengerInf,
      type: flightType,
      flights: ListFlightSearch,
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
    const fetchFlightOperation = async () => {
      try {
        const response = await FlightApi.searchOperation({
          search_id: searchId,
        });
        if (
          response?.payload?.data?.completedJobs ===
          response?.payload?.data?.numberOfJobs
        ) {
          setIsFullFlightResource(true);
        }
        const resources: string[] = response?.payload?.data?.resources ?? [];
        if (resources.length > 0) {
          setFlightItineraryResource((prev) => {
            const existingKeys = prev.map((item) => item.key);
            const newItems = resources
              .filter((k) => !existingKeys.includes(k))
              .map((k) => ({ key: k, value: 0 }));

            return [...prev, ...newItems];
          });
        }
      } catch (error: any) {
        setIsFullFlightResource(true);
        setError(toaStrMsg.errorConnectApiFlight);
      }
    };
    let timer: NodeJS.Timeout;
    const fetchAndRepeat = async () => {
      if (!isFullFlightResource) {
        await fetchFlightOperation();
        timer = setTimeout(fetchAndRepeat, 1000);
      } else {
        clearTimeout(timer);
      }
    };

    if (searchId && !isFullFlightResource) {
      fetchAndRepeat();
    }

    return () => clearTimeout(timer);
  }, [searchId, toaStrMsg.errorConnectApiFlight, isFullFlightResource]);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      const unprocessed = flightItineraryResource.filter((r) => r.value === 0);
      if (unprocessed.length === 0) return;

      setFlightItineraryResource((prev) =>
        prev.map((r) =>
          unprocessed.some((u) => u.key === r.key) ? { ...r, value: 1 } : r
        )
      );

      try {
        const promises = unprocessed.map((r) =>
          FlightApi.getFlightResource({
            resource_id: r.key,
            passengers: {
              adt: passengerAdt,
              chd: passengerChd,
              inf: passengerInf,
            },
          })
        );
        const results = await Promise.all(promises);

        const flightsData: any[] = [];

        results.forEach((res) => {
          const flightTrips = res?.payload?.data?.trips ?? [];
          if (flightTrips.length) {
            flightsData.push(...flightTrips);
          }
        });

        if (flightsData.length) {
          const listStopNum: number[] = [];
          for (const item of flightsData) {
            if (!listStopNum[item.legs]) {
              listStopNum[item.legs] = item.legs;
            }
          }
          setStopNumFilters(
            listStopNum.filter(
              (item: any) => item !== undefined && item !== null
            )
          );
          setFlightsData((prev: any) => [...prev, ...flightsData]);
        }
      } catch (err) {
        setIsFullFlightResource(true);
        setError(toaStrMsg.errorConnectApiFlight);
      }
    };
    fetchFlightDetails();
  }, [
    flightItineraryResource,
    passengerAdt,
    passengerChd,
    passengerInf,
    stopNumFilters,
    toaStrMsg.errorConnectApiFlight,
  ]);

  useEffect(() => {
    const fetchFlightSearch = async () => {
      scrollToRef(resultsRef);
      try {
        setLoading(true);
        setFlightsData([]);
        setSearchId(null);
        setFlightItineraryResource([]);
        setIsFullFlightResource(false);
        setIsReady(false);
        const checkTripType =
          (tripType === "roundTrip" && ReturnDate) || tripType === "oneWay"
            ? true
            : false;
        if (StartPoint && EndPoint && DepartDate && checkTripType) {
          const response = await FlightApi.search(params);
          if (response?.payload?.data) {
            setSearchId(response?.payload?.data);
          }
        } else {
          router.push("/ve-may-bay");
          setSearchId(null);
          toast.dismiss();
          toast.error(toaStrMsg.missingInfoSearchFlight);
        }
      } catch (error: any) {
        setSearchId(null);
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

    fetchFlightSearch();
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

  useEffect(() => {
    if (!loading && flightsData.length > 0) {
      setIsReady(true);
    }
  }, [loading, flightsData]);

  if (!isReady) {
    return (
      <div
        ref={resultsRef}
        className={`flex mt-6 py-12 mb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
      >
        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
        <span className="text-18">{t("dang_tai_du_lieu_chuyen_bay")}...</span>
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
        <ListFlights
          from={from}
          to={to}
          airportsData={airportsData}
          flightsData={flightsData}
          isFullFlightResource={isFullFlightResource}
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
          totalPassengers={totalPassengers}
          flightType={flightType}
          flightStopNum={stopNumFilters}
          translatedStaticText={translatedStaticText}
          isLoading={loading}
          isReady={isReady}
        />
      </div>
    </Fragment>
  );
}
