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
import {
  addDays,
  parse,
  format,
  isValid,
  isBefore,
  isSameDay,
  startOfDay,
} from "date-fns";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import ListFlightsInternaltion from "./List";

export default function SearchFlightsInternationalResult({
  airportsData,
  flightType,
}: ListFilghtProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { language } = useLanguage();
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const pathName: string = usePathname();
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(true);
  const [displayType, setDisplayType] = useState<"desktop" | "mobile">(
    "desktop"
  );
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
  const [searchId, setSearchId] = useState<string | null>(null);
  const [flightItineraryResource, setFlightItineraryResource] = useState<
    Array<{ key: string; value: number }>
  >([]);
  const [isFullFlightResource, setIsFullFlightResource] =
    useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [airlineData, setAirlineData] = useState<
    { id: number; name: string; code: string; logo: string }[]
  >([]);

  const params = useMemo(() => {
    let flightType: string = "RT";
    let ListFlightSearch = [
      {
        startPoint: StartPoint,
        endPoint: EndPoint,
        departDate: DepartDate,
        returnDate: ReturnDate,
      },
    ];
    // if (tripType === "roundTrip" && ReturnDate) {
    //   ListFlightSearch[0].returnDate = ReturnDate;
    //   flightType = "RT";
    //   setIsRoundTrip(true);
    // } else {
    //   setIsRoundTrip(false);
    // }
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
    (
      baseDate: Date,
      type: "depart" | "return",
      displayType: "desktop" | "mobile",
      departDateStr?: string
    ) => {
      const newDays: TabDays[] = [];
      const now = startOfDay(new Date());

      const departDate = departDateStr
        ? startOfDay(parse(departDateStr, "ddMMyyyy", new Date()))
        : now;

      for (let i = -3; i <= 3; i++) {
        const date = addDays(baseDate, i);
        const isToday = isSameDay(date, now);

        const isDisabled =
          type === "return"
            ? isBefore(date, departDate) && !isToday
            : isBefore(date, now) && !isToday;

        newDays.push({
          label: getDayLabel(date.getDay(), displayType, language),
          date,
          disabled: isDisabled,
        });
      }

      if (type === "depart") setDays(newDays);
      else setReturnDays(newDays);
    },
    [language]
  );

  useEffect(() => {
    setCurrentDate(today);
    setCurrentReturnDay(currentReturnDate);
  }, [today, currentReturnDate]);

  useEffect(() => {
    generateDays(currentDate, "depart", displayType);
    if (isRoundTrip)
      generateDays(currentReturnDay, "return", displayType, DepartDate);
  }, [
    currentDate,
    currentReturnDay,
    isRoundTrip,
    displayType,
    DepartDate,
    generateDays,
  ]);

  const handleClickDate = (date: Date, typeDate: number) => {
    setLoading(true);
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

  // Search flight
  useEffect(() => {
    const fetchFlightSearch = async () => {
      scrollToRef(resultsRef);
      try {
        setLoading(true);
        setIsReady(false);
        setSearchId(null);
        setFlightsData([]);
        setStopNumFilters([]);
        setIsFullFlightResource(false);
        setFlightItineraryResource([]);
        setAirlineData([]);
        setError("");
        if (StartPoint && EndPoint && DepartDate) {
          const response = await FlightApi.search({
            ...params,
            isGroupedItineraryResponse: true,
            locations: { from: StartPoint, to: EndPoint },
          });
          const responseData = response?.payload?.data;
          const resources: any = responseData?.resources ?? [];
          if (responseData?.searchId) {
            setSearchId(responseData?.searchId);
          } else {
            throw new Error("Search Error");
          }
          if (resources.length) setFlightItineraryResource(resources);

          const flightsData: any = responseData?.trips ?? [];
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
            setFlightsData(flightsData);
          }
          if (responseData?.isFullFlightResource) setIsFullFlightResource(true);
        } else {
          router.push("/ve-may-bay");
          setSearchId(null);
          toast.dismiss();
          toast.error(toaStrMsg.missingInfoSearchFlight);
        }
      } catch (error: any) {
        setSearchId(null);
        setIsReady(true);

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
    flightType,
  ]);

  // Fetch resources
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
            if (newItems.length === 0) return prev;
            return [...prev, ...newItems];
          });
        }
      } catch (error: any) {
        setIsFullFlightResource(true);
        setError(toaStrMsg.errorConnectApiFlight);
      }
    };

    let timer: NodeJS.Timeout;
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 10;

    const fetchAndRepeat = async () => {
      if (cancelled || isFullFlightResource) return;

      attempts++;
      await fetchFlightOperation();

      if (!cancelled && !isFullFlightResource && attempts < maxAttempts) {
        timer = setTimeout(fetchAndRepeat, 1000);
      }

      if (attempts >= maxAttempts) {
        setIsFullFlightResource(true);
      }
    };

    if (searchId && !isFullFlightResource) {
      fetchAndRepeat();
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchId, toaStrMsg.errorConnectApiFlight, isFullFlightResource]);

  // Fetch flights by resource
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
            locations: { from: StartPoint, to: EndPoint },
          })
        );
        const results = await Promise.allSettled(promises);

        const flightsData: any[] = [];

        results.forEach((res) => {
          if (res.status === "fulfilled") {
            const flightTrips = res?.value?.payload?.data?.trips ?? [];
            if (flightTrips.length) {
              flightsData.push(...flightTrips);
            }
          }
        });

        if (flightsData.length) {
          setStopNumFilters((prev) => {
            return Array.from(
              new Set([
                ...prev,
                ...flightsData
                  .map((f) => f.legs)
                  .filter((v) => v !== undefined && v !== null),
              ])
            ).sort((a, b) => a - b);
          });

          setFlightsData((prev: any) => [...prev, ...flightsData]);
        }
      } catch (err) {
        setIsFullFlightResource(true);
        setError(toaStrMsg.errorConnectApiFlight);
      }
    };
    if (flightItineraryResource.length) {
      fetchFlightDetails();
    }
  }, [
    flightItineraryResource,
    passengerAdt,
    passengerChd,
    passengerInf,
    stopNumFilters,
    toaStrMsg.errorConnectApiFlight,
    StartPoint,
    EndPoint,
  ]);

  // Fetch airline data
  useEffect(() => {
    const unprocessed = flightItineraryResource.filter((r) => r.value === 0);

    if (unprocessed.length > 0) return;

    const airlineSet = new Set<string>();
    flightsData.forEach((flight: any) => {
      if (flight.source === "1G") {
        airlineSet.add(flight.airline);
      } else if (flight.segments.length) {
        flight.segments.map((segment: any) => airlineSet.add(segment.airline));
      }
    });
    const uniqueAirlines = Array.from(airlineSet);
    const fetchAirlines = async () => {
      try {
        const response = await FlightApi.getAirlines({
          code: uniqueAirlines,
        });
        const responseData = response?.payload?.data ?? [];
        const airlineDataSorted = responseData.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        setAirlineData(airlineDataSorted);
      } catch (error: any) {
        setError(toaStrMsg.errorConnectApiFlight);
      }
    };
    if (uniqueAirlines.length) {
      fetchAirlines();
    }
  }, [flightItineraryResource, flightsData, toaStrMsg]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!flightsData || flightsData.length === 0) {
        setIsReady(true);
      }
    }, 12000);

    return () => clearTimeout(timeout);
  }, [flightsData]);

  const flights1G = flightsData.filter((item: any) => item.source === "1G");
  const flightsNormal = flightsData.filter((item: any) => item.source !== "1G");
  const flightsNormalGroupped = groupFlightsBySamePrice(flightsNormal);

  useEffect(() => {
    if (!loading && (flights1G.length || flightsNormalGroupped.length)) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [loading, flights1G, flightsNormalGroupped]);

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
    const partsErr = error.split(/\.(.+)/);
    const lineErr1 = partsErr?.[0]?.trim() || "";
    const lineErr2 = partsErr?.[1]?.trim() || "";

    return (
      <div ref={resultsRef} className="px-4 w-full mx-auto my-20 text-center">
        {lineErr1 && lineErr2 ? (
          <>
            <p className="text-18 font-semibold">{lineErr1}</p>
            <p className="text-18 font-semibold mt-1">{lineErr2}</p>
          </>
        ) : (
          <p className="text-18 font-semibold">{error}</p>
        )}
      </div>
    );
  }

  function groupFlightsBySamePrice(flights: any[]): any[] {
    const departures = flights.filter((f) => f.itineraryId === 1);
    const returns = flights.filter((f) => f.itineraryId === 2);

    // Gom chiều bay theo giá vé
    const groupByPrice = (legFlights: any[]) => {
      const map = new Map<number, any[]>();

      for (const flight of legFlights) {
        // Lấy giá rẻ nhất
        const fare = flight.fareOptions[0];
        if (!fare) continue;

        const price = fare.totalPrice;
        const arr = map.get(price) || [];

        // Check trùng (Mã code + hạng vé)
        const exists = arr.some(
          (x: any) =>
            x.flightCode === flight.flightCode &&
            x.selectedTicketClass?.groupClass === fare.groupClass
        );

        if (!exists) {
          const flightCopy: any = {
            ...flight,
            selectedTicketClass: fare,
            fareOptions: [fare],
          };
          map.set(price, [...arr, flightCopy]);
        }
      }

      return map;
    };

    const depGroups = groupByPrice(departures);
    const retGroups = groupByPrice(returns);
    const result = new Map<number, any>();

    const makeUUID = () =>
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

    // Ghép nhóm cùng tổng giá
    for (const [depPrice, depList] of Array.from(depGroups.entries())) {
      for (const [retPrice, retList] of Array.from(retGroups.entries())) {
        const total = depPrice + retPrice;

        // Số lượng hành khách (giống nhau)
        const sampleFlight = depList[0] || retList[0];
        const numberAdt = sampleFlight?.numberAdt ?? 0;
        const numberChd = sampleFlight?.numberChd ?? 0;
        const numberInf = sampleFlight?.numberInf ?? 0;

        if (!result.has(total)) {
          const key = [
            ...depList.map(
              (d: any) => `${d.flightCode}_${d.selectedTicketClass?.groupClass}`
            ),
            ...retList.map(
              (r: any) => `${r.flightCode}_${r.selectedTicketClass?.groupClass}`
            ),
          ]
            .sort()
            .join("|");

          result.set(total, {
            hpb_id: makeUUID(),
            key,
            source: "HPB",
            totalPrice: total,
            numberAdt,
            numberChd,
            numberInf,
            trips: [],
          });
        }

        const group = result.get(total)!;

        // Gộp chiều đi & về
        for (const f of [...depList, ...retList]) {
          const exists = group.trips.some(
            (x: any) =>
              x.flightCode === f.flightCode &&
              x.selectedTicketClass?.groupClass ===
                f.selectedTicketClass?.groupClass
          );
          if (!exists) group.trips.push(f);
        }
      }
    }

    return Array.from(result.values());
  }

  const finalFlightsData = [...flights1G, ...flightsNormalGroupped];
  return (
    <Fragment>
      <div ref={resultsRef}>
        <ListFlightsInternaltion
          from={from}
          to={to}
          airportsData={airportsData}
          flightsData={finalFlightsData}
          airlineData={airlineData}
          isFullFlightResource={isFullFlightResource}
          returnDate={ReturnDate}
          departDate={DepartDate}
          currentDate={currentDate}
          currentReturnDay={currentReturnDay}
          returnDays={returnDays}
          departDays={days}
          handleClickDate={handleClickDate}
          flightSession={searchId}
          isRoundTrip={isRoundTrip}
          totalPassengers={totalPassengers}
          flightType={flightType}
          flightStopNum={stopNumFilters.filter((item) => item > 0)}
          translatedStaticText={[]}
          isReady={isReady}
        />
      </div>
    </Fragment>
  );
}
