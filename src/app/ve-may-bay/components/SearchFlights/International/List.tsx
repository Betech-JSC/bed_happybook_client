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
import { differenceInHours, format, isSameDay, parseISO } from "date-fns";
import Image from "next/image";
import { pareseDateFromString } from "@/lib/formatters";
import { handleSessionStorage } from "@/utils/Helper";
import { filtersFlight, ListFlight } from "@/types/flight";
import _ from "lodash";
import { useTranslation } from "@/hooks/useTranslation";
import SideBarFilterFlights from "../../SideBarFilter";
import AOS from "aos";
import "aos/dist/aos.css";
import ListFlightsInternationalNormal from "./Normal/List";
import ListFlights1GInternaltion from "./1G/List";

const defaultFilers: filtersFlight = {
  priceWithoutTax: "0",
  timeDepart: "",
  sortAirLine: "",
  sortPrice: "",
  airlines: [],
  stopNum: [],
  departureTime: [0, 24],
  arrivalTime: [0, 24],
};
const INITIAL_LIMIT = 5;
const SOURCE_1G = "1G";

export default function ListFlightsInternaltion({
  airportsData,
  flightsData,
  airlineData,
  from,
  to,
  returnDate,
  departDate,
  currentDate,
  currentReturnDay,
  departDays,
  returnDays,
  handleClickDate,
  flightSession,
  isRoundTrip,
  totalPassengers,
  isReady,
}: ListFlight) {
  const { t } = useTranslation();
  const [selectedDepartFlight, setSelectedDepartFlight] = useState<any>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<any>(null);
  const [selectedFareDataId, setSelectedFareDataId] = useState<string | null>(
    null
  );
  const [isCheckOut, setIsCheckOut] = useState<boolean>(false);
  const [filters, setFilters] = useState(defaultFilers);
  const wrapperResultRef = useRef<HTMLDivElement>(null);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [dataLimit, setDataLimit] = useState(INITIAL_LIMIT);

  const resetFilters = () => {
    setFilters(defaultFilers);
    resetFormChooseFlight();
  };

  const resetFormChooseFlight = () => {
    handleUncheck();
    setSelectedDepartFlight(null);
    setSelectedReturnFlight(null);
    setSelectedFareDataId(null);
    setIsCheckOut(false);
  };

  useEffect(() => {
    AOS.init({
      duration: 400,
      easing: "ease-in",
      once: true,
    });
  }, []);

  // Filter data
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    if (flightsData.length > 0) {
      resetFormChooseFlight();
      setFilters((prev) => {
        if (name === "airLine") {
          return {
            ...prev,
            airlines: checked
              ? [...prev.airlines, value]
              : prev.airlines.filter((airline) => airline !== value),
          };
        } else if (name === "timeDepart") {
          return {
            ...prev,
            timeDepart: checked ? value : "",
          };
        } else if (name === "sortAirLine") {
          return {
            ...prev,
            sortAirLine: checked ? value : "",
          };
        }
        return prev;
      });
    }
  };

  const handleFilterFlight1G = useCallback(
    (flights: any) => {
      if (flights.length > 0) {
        if (filters.airlines.length > 0) {
          flights = flights.filter((flight: any) => {
            const match = filters.airlines.some(
              (airline: any) =>
                airline.trim().toLowerCase() ===
                flight.airline.trim().toLowerCase()
            );
            return match;
          });
        }
      }

      if (
        filters?.departureTime?.[0] !== 0 ||
        filters?.departureTime?.[1] !== 24
      ) {
        const [startHour, endHour] = filters.departureTime;
        const fromMinute = startHour * 60;
        const toMinute = endHour * 60;
        flights = flights.map((item: any) => ({
          ...item,
          journeys: [
            item.journeys?.[0]?.filter((flight: any) => {
              const departure = parseISO(flight.departure.at);
              const departureMinutes =
                departure.getHours() * 60 + departure.getMinutes();
              return (
                departureMinutes >= fromMinute && departureMinutes <= toMinute
              );
            }) ?? [],

            item.journeys?.[1] ?? [],
          ],
        }));
      }

      if (filters?.arrivalTime?.[0] !== 0 || filters?.arrivalTime?.[1] !== 24) {
        const [startHour, endHour] = filters.arrivalTime;
        const fromMinute = startHour * 60;
        const toMinute = endHour * 60;
        flights = flights.map((item: any) => ({
          ...item,
          journeys: [
            item.journeys?.[0] ?? [],
            item.journeys?.[1]?.filter((flight: any) => {
              const departure = parseISO(flight.arrival.at);
              const departureMinutes =
                departure.getHours() * 60 + departure.getMinutes();
              return (
                departureMinutes >= fromMinute && departureMinutes <= toMinute
              );
            }) ?? [],
          ],
        }));
      }
      flights = [...flights]
        .filter(
          (flight) =>
            flight?.journeys?.[0]?.length && flight?.journeys?.[1]?.length
        )
        .sort((a, b) => {
          if (filters.sortAirLine === "asc") {
            const nameA = a.airline?.toLowerCase() ?? "";
            const nameB = b.airline?.toLowerCase() ?? "";
            const nameCompare = nameA.localeCompare(nameB);
            if (nameCompare !== 0) return nameCompare;
          }

          const priceA = a?.totalPrice ?? 0;
          const priceB = b?.totalPrice ?? 0;
          return priceA - priceB;
        });
      return flights;
    },
    [filters]
  );
  const handleFilterFlightNormal = useCallback(
    (flights: any) => {
      if (!flights?.length) return [];
      if (filters.airlines.length > 0) {
        flights = flights.filter((flight: any) => {
          return flight.trips.some((trip: any) => {
            return filters.airlines.some(
              (airline: string) =>
                airline.trim().toLowerCase() ===
                trip.airLineCode.trim().toLowerCase()
            );
          });
        });
      }

      // --- Filter giờ khởi hành ---
      if (
        filters?.departureTime?.[0] !== 0 ||
        filters?.departureTime?.[1] !== 24
      ) {
        const [startHour, endHour] = filters.departureTime;
        const fromMinute = startHour * 60;
        const toMinute = endHour * 60;

        flights = flights
          .map((flight: any) => {
            const filteredTrips = flight.trips.filter((trip: any) => {
              const departure = parseISO(trip.departure.at);
              const departureMinutes =
                departure.getHours() * 60 + departure.getMinutes();
              return (
                departureMinutes >= fromMinute && departureMinutes <= toMinute
              );
            });

            return { ...flight, trips: filteredTrips };
          })
          .filter((flight: any) => {
            const hasDeparture = flight.trips.some(
              (trip: any) => trip.itineraryId === 1
            );
            const hasReturn = flight.trips.some(
              (trip: any) => trip.itineraryId === 2
            );
            return flight.trips.length > 0 && hasDeparture && hasReturn;
          });
      }

      // --- Filter giờ hạ cánh ---
      if (filters?.arrivalTime?.[0] !== 0 || filters?.arrivalTime?.[1] !== 24) {
        const [startHour, endHour] = filters.arrivalTime;
        const fromMinute = startHour * 60;
        const toMinute = endHour * 60;

        flights = flights
          .map((flight: any) => {
            const filteredTrips = flight.trips.filter((trip: any) => {
              const arrival = parseISO(trip.arrival.at);
              const arrivalMinutes =
                arrival.getHours() * 60 + arrival.getMinutes();
              return arrivalMinutes >= fromMinute && arrivalMinutes <= toMinute;
            });

            return { ...flight, trips: filteredTrips };
          })
          .filter((flight: any) => {
            const hasDeparture = flight.trips.some(
              (trip: any) => trip.itineraryId === 1
            );
            const hasReturn = flight.trips.some(
              (trip: any) => trip.itineraryId === 2
            );
            return flight.trips.length > 0 && hasDeparture && hasReturn;
          });
      }

      return flights;
    },
    [filters]
  );
  useEffect(() => {
    const cloneData = _.cloneDeep(flightsData);
    const filtered = [
      ...handleFilterFlight1G(
        cloneData.filter((item: any) => item.source === SOURCE_1G)
      ),
      ...handleFilterFlightNormal(
        cloneData.filter((item: any) => item.source !== SOURCE_1G)
      ),
    ].sort((a, b) => a.totalPrice - b.totalPrice);
    setFilteredData(filtered);
  }, [filters, flightsData, handleFilterFlightNormal, handleFilterFlight1G]);

  // Reset when filters
  useEffect(() => {
    setSelectedFareDataId(null);
    setSelectedDepartFlight(null);
    setSelectedReturnFlight(null);
    setIsCheckOut(false);
  }, [filters]);
  // End filter
  const handleCheckout = async () => {
    if (isCheckOut) {
      handleSessionStorage("save", "departFlight", selectedDepartFlight);
      handleSessionStorage("save", "returnFlight", selectedReturnFlight);
      handleSessionStorage("save", "flightSession", flightSession);
      const res = await fetch("/api/set-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightType:
            selectedDepartFlight?.source === SOURCE_1G &&
            selectedReturnFlight?.source === SOURCE_1G
              ? SOURCE_1G
              : "NORMAL",
        }),
      });

      const data = await res.json();
      if (data.ok) {
        window.location.href = "/ve-may-bay/thong-tin-hanh-khach";
      }
    }
  };

  const handleSelectDepartFlight = (
    flight: any,
    FareId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsCheckOut(false);
    if (FareId !== selectedFareDataId) {
      handleUncheck(e);
      setSelectedReturnFlight(null);
    }
    setSelectedDepartFlight(flight);
    setSelectedFareDataId(FareId);
  };

  const handleSelectReturnFlight = (
    flight: any,
    FareId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsCheckOut(false);
    if (FareId !== selectedFareDataId) {
      handleUncheck(e);
      setSelectedDepartFlight(null);
    }
    setSelectedReturnFlight(flight);
    setSelectedFareDataId(FareId);
  };

  useEffect(() => {
    if (selectedDepartFlight && selectedReturnFlight) {
      setIsCheckOut(true);
    }
  }, [isRoundTrip, selectedReturnFlight, selectedDepartFlight]);

  const handleUncheck = (e?: React.ChangeEvent<HTMLInputElement>) => {
    const currentInput = e?.currentTarget;
    wrapperResultRef?.current
      ?.querySelectorAll<HTMLInputElement>('input[type="radio"]')
      .forEach((radio) => {
        if (radio !== currentInput) {
          radio.checked = false;
        }
      });
  };

  const visibletData = filteredData.slice(0, dataLimit);
  const loadMoreDataRef = useRef<HTMLDivElement | null>(null);
  const timeouDataId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDataLimit(INITIAL_LIMIT);
  }, [filters, filteredData]);

  useEffect(() => {
    if (!loadMoreDataRef.current || dataLimit >= filteredData.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeouDataId.current = setTimeout(() => {
            setDataLimit((prev) =>
              Math.min(prev + INITIAL_LIMIT, filteredData.length)
            );
            timeouDataId.current = null;
          }, 200);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreDataRef.current);

    return () => {
      observer.disconnect();
      if (timeouDataId.current) clearTimeout(timeouDataId.current);
    };
  }, [dataLimit, filteredData]);
  return (
    <Fragment>
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6 pb-12 relative"
        data-aos="fade"
        ref={wrapperResultRef}
      >
        <SideBarFilterFlights
          flightStopNum={0}
          setFilters={setFilters}
          filters={{ ...filters, stopNum: [] }}
          handleCheckboxChange={handleCheckboxChange}
          airlineData={airlineData}
          resetFilters={resetFilters}
          t={t}
        />
        <div className="lg:col-span-9" data-aos="fade">
          <div>
            <Fragment>
              <div
                className="flex text-white p-4 rounded-t-2xl shadow-md space-x-4 items-center"
                style={{
                  background:
                    " linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                }}
              >
                <div className="w-10 h-10 p-2 bg-primary rounded-lg inline-flex items-center justify-center">
                  <Image
                    src="/icon/AirplaneTilt.svg"
                    width={20}
                    height={20}
                    alt="Icon"
                    className="w-5 h-5"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{`${from} - ${to} `}</h3>
                  <div className="mt-1 text-sm flex flex-col gap-1">
                    <div className="flex flex-col md:flex-row gap-1">
                      <span className="font-semibold">{t("ngay_di")}:</span>{" "}
                      {departDate
                        ? pareseDateFromString(
                            departDate,
                            "ddMMyyyy",
                            "dd/MM/yyyy"
                          )
                        : ""}
                      <span className="mx-2">{"-"}</span>
                      <span className="font-semibold">
                        {t("ngay_ve")}:
                      </span>{" "}
                      {returnDate
                        ? pareseDateFromString(
                            returnDate,
                            "ddMMyyyy",
                            "dd/MM/yyyy"
                          )
                        : ""}{" "}
                    </div>
                    <span>
                      {totalPassengers} {t("khach")}
                    </span>
                  </div>
                </div>
              </div>
              {/* <div
                className="flex text-white p-4 rounded-t-2xl shadow-md space-x-4 items-center"
                style={{
                  background:
                    " linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                }}
              >
                <div className="w-10 h-10 p-2 bg-primary rounded-lg inline-flex items-center justify-center">
                  <Image
                    src="/icon/AirplaneTilt.svg"
                    width={20}
                    height={20}
                    alt="Icon"
                    className="w-5 h-5"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{`${from} - ${to} `}</h3>
                  <div className="text-sm">
                    <span>
                      {totalPassengers} {t("khach")} -{" "}
                    </span>
                    {departDate
                      ? pareseDateFromString(departDate, "ddMMyyyy", "dd/MM")
                      : ""}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-7 items-center bg-white rounded-b-2xl">
                {departDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      !day.disabled && handleClickDate(day.date, 0)
                    }
                    className={`flex flex-col items-center p-3  border-r border-gray-200 last:border-r-0 ${
                      isSameDay(day.date, currentDate)
                        ? "border-b-2 border-b-primary text-primary"
                        : "text-gray-700"
                    } ${
                      day.disabled
                        ? "text-gray-700 opacity-50 cursor-not-allowed"
                        : "text-black"
                    }`}
                  >
                    <div
                      className="text-sm md:text-base font-semibold"
                      data-translate
                    >
                      {day.label}
                    </div>
                    <div className="text-xs md:text-sm mt-2">
                      {format(day.date, "dd/MM")}
                    </div>
                  </button>
                ))}
              </div>
              <div
                className="mt-6 flex text-white p-4 rounded-t-2xl shadow-md space-x-4 items-center"
                style={{
                  background:
                    " linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                }}
              >
                <div className="w-10 h-10 p-2 bg-primary rounded-lg inline-flex items-center justify-center">
                  <Image
                    src="/icon/AirplaneTilt.svg"
                    width={20}
                    height={20}
                    alt="Icon"
                    className="w-5 h-5"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{`${to} - ${from} `}</h3>
                  <div className="text-sm">
                    <span>
                      {totalPassengers} {t("khach")} -{" "}
                    </span>
                    {returnDate
                      ? pareseDateFromString(returnDate, "ddMMyyyy", "dd/MM")
                      : ""}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-7 items-center bg-white rounded-b-2xl">
                {returnDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      !day.disabled && handleClickDate(day.date, 1)
                    }
                    className={`flex flex-col items-center p-3  border-r border-gray-200 last:border-r-0 ${
                      isSameDay(day.date, currentReturnDay)
                        ? "border-b-2 border-b-primary text-primary"
                        : "text-gray-700"
                    } ${
                      day.disabled
                        ? "text-gray-700 opacity-50 cursor-not-allowed"
                        : "text-black"
                    }`}
                  >
                    <div
                      className="text-sm md:text-base font-semibold"
                      data-translate
                    >
                      {day.label}
                    </div>
                    <div className="text-xs md:text-sm mt-2">
                      {format(day.date, "dd/MM")}
                    </div>
                  </button>
                ))}
              </div> */}
            </Fragment>
            {filteredData?.length > 0 ? (
              visibletData.map((flightsItem: any, index: number) => {
                const is1G = flightsItem.source === SOURCE_1G;
                return (
                  <Fragment key={index}>
                    {is1G ? (
                      <ListFlights1GInternaltion
                        from={from}
                        to={to}
                        airportsData={airportsData}
                        flightsData={flightsItem}
                        airlineData={airlineData}
                        returnDate={returnDate}
                        departDate={departDate}
                        flightSession={flightSession}
                        isRoundTrip={isRoundTrip}
                        totalPassengers={totalPassengers}
                        handleSelectDepartFlight={handleSelectDepartFlight}
                        handleSelectReturnFlight={handleSelectReturnFlight}
                        selectedFareDataId={selectedFareDataId}
                        handleCheckout={handleCheckout}
                        isCheckOut={isCheckOut}
                      />
                    ) : (
                      <ListFlightsInternationalNormal
                        from={from}
                        to={to}
                        airportsData={airportsData}
                        flightsData={flightsItem}
                        airlineData={airlineData}
                        returnDate={returnDate}
                        departDate={departDate}
                        flightSession={flightSession}
                        isRoundTrip={isRoundTrip}
                        totalPassengers={totalPassengers}
                        handleSelectDepartFlight={handleSelectDepartFlight}
                        handleSelectReturnFlight={handleSelectReturnFlight}
                        selectedDepartFlight={selectedDepartFlight}
                        selectedReturnFlight={selectedReturnFlight}
                        selectedFareDataId={selectedFareDataId}
                        handleCheckout={handleCheckout}
                        isCheckOut={isCheckOut}
                      />
                    )}
                  </Fragment>
                );
              })
            ) : (
              <div className="w-full my-12 text-center text-2xl font-semibold">
                <p>{t("khong_co_chuyen_bay_nao_trong_ngay_hom_nay")}</p>
                <p className="mt-1">
                  {t(
                    "quy_khach_vui_long_chuyen_sang_ngay_khac_de_dat_ve_xin_cam_on"
                  )}
                </p>
              </div>
            )}
            {dataLimit < filteredData.length && (
              <div
                ref={loadMoreDataRef}
                className="mt-4 h-10 text-center inline-flex justify-center items-center w-full gap-3"
              >
                <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
