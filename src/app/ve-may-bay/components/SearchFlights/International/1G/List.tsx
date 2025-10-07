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
import { format, isSameDay, parseISO } from "date-fns";
import Image from "next/image";
import { pareseDateFromString } from "@/lib/formatters";
import { handleSessionStorage } from "@/utils/Helper";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { useTranslation } from "@/hooks/useTranslation";
import FlightInternational1GDetail from "./Detail";
import Flight1GDetailPopup from "./FlightDetailPopup";

const INITIAL_LIMIT = 5;

export default function ListFlights1GInternaltion({
  airportsData,
  flightsData,
  from,
  to,
  returnDate,
  departDate,
  flightSession,
  isRoundTrip,
  totalPassengers,
  selectedFareDataId,
  handleSelectDepartFlight,
  handleSelectReturnFlight,
  handleCheckout,
  isCheckOut,
  filters,
}: any) {
  const { t } = useTranslation();
  const [filteredData, setFilteredData] = useState<any[]>(flightsData);
  const router = useRouter();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [flightDetail, setFlightDetail] = useState<any[]>([]);
  const [tabsFlightDetail, setTabsFlightDetail] = useState<
    { id: number; name: string }[]
  >([]);
  const [departLimit, setDepartLimit] = useState(INITIAL_LIMIT);

  useEffect(() => {
    let filtered = flightsData.map((flight: any) => ({ ...flight }));
    if (filtered.length > 0) {
      if (filters.airlines.length > 0) {
        filtered = filtered.filter((flight: any) => {
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
      filtered = filtered.map((item: any) => ({
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
      filtered = filtered.map((item: any) => ({
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
    filtered = [...filtered]
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
    setFilteredData(filtered);
  }, [filters, flightsData]);
  // Load more depart flights
  const visibleDepartData = filteredData.slice(0, departLimit);
  const loadMoreDepartRef = useRef<HTMLDivElement | null>(null);
  const timeoutDepartId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loadMoreDepartRef.current || departLimit >= filteredData.length)
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutDepartId.current = setTimeout(() => {
            setDepartLimit((prev) =>
              Math.min(prev + INITIAL_LIMIT, filteredData.length)
            );
            timeoutDepartId.current = null;
          }, 200);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreDepartRef.current);

    return () => {
      observer.disconnect();
      if (timeoutDepartId.current) clearTimeout(timeoutDepartId.current);
    };
  }, [departLimit, filteredData.length]);

  const handleShowPopupFlightDetail = (
    flight: any,
    indexFareOption: number,
    tabs: { id: number; name: string }[],
    showRuleTicket = false
  ) => {
    setShowDetail(true);
    setFlightDetail([flight]);
    setTabsFlightDetail(tabs);
  };

  const handleClosePopupFlightDetail = useCallback(() => {
    setShowDetail(false);
    setFlightDetail([]);
    setTabsFlightDetail([]);
  }, []);

  return (
    <Fragment>
      {filteredData.length > 0 && (
        <div className="my-6">
          <Fragment>
            {visibleDepartData.map((data: any, index: number) => (
              <div
                key={index}
                className={`bg-white rounded-2xl mb-8 border-2 ${
                  selectedFareDataId === data.hpb_id
                    ? "border-[#efad02]"
                    : "border-transparent"
                }`}
              >
                {data?.journeys?.map((journey: any, leg: number) => {
                  return (
                    <div
                      className={`pb-2 bg-[#FCFCFD] rounded-t-2xl ${
                        leg ? "mt-4" : ""
                      }`}
                      key={leg}
                    >
                      <div className="flex py-4 px-8 rounded-t-2xl space-x-4 items-center bg-blue-50">
                        <div className="inline-flex items-center justify-center">
                          <Image
                            src="/icon/AirplaneTiltBlue.svg"
                            width={32}
                            height={32}
                            alt="Icon"
                            className="w-8 h-8"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold">
                            {leg === 0 ? `${from} - ${to}` : `${to} - ${from}`}
                          </h3>

                          <div className="text-sm">
                            <span>
                              {totalPassengers} {t("khach")} -{" "}
                            </span>
                            {leg === 0
                              ? departDate
                                ? pareseDateFromString(
                                    departDate,
                                    "ddMMyyyy",
                                    "dd/MM"
                                  )
                                : ""
                              : returnDate
                              ? pareseDateFromString(
                                  returnDate,
                                  "ddMMyyyy",
                                  "dd/MM"
                                )
                              : ""}
                          </div>
                        </div>
                      </div>
                      <FlightInternational1GDetail
                        journey={journey}
                        onSelectFlight={
                          leg
                            ? handleSelectReturnFlight
                            : handleSelectDepartFlight
                        }
                        setFlightDetail={handleShowPopupFlightDetail}
                        fareData={data}
                        selectedFareDataId={selectedFareDataId}
                      />
                    </div>
                  );
                })}

                <div className="flex justify-between px-4 py-6 items-end">
                  <div>
                    {data?.numberAdt > 1 && (
                      <p className="text-sm text-gray-700 font-semibold mb-2">
                        {t("nguoi_lon")}:{" "}
                        {data?.totalAdult?.toLocaleString("vi-VN")}
                        {" VND "}x {data?.numberAdt}{" "}
                      </p>
                    )}
                    {data?.numberChd >= 1 && (
                      <p className="text-sm text-gray-700 font-semibold mb-2">
                        {t("tre_em")}:{" "}
                        {data?.totalChild?.toLocaleString("vi-VN")}
                        {" VND "}x {data?.numberChd}{" "}
                      </p>
                    )}
                    {data?.numberInf >= 1 && (
                      <p className="text-sm text-gray-700 font-semibold mb-2">
                        {t("em_be")}:{" "}
                        {data?.totalInfant?.toLocaleString("vi-VN")}
                        {" VND "}x {data?.numberInf}{" "}
                      </p>
                    )}
                    <div>
                      <span className="font-medium">
                        {t("tong_tien_thanh_toan")}:
                      </span>{" "}
                      <span className="text-2xl font-bold text-primary">
                        {data?.totalPrice?.toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                  <button
                    className={`text-center w-36 h-11 mt-5 md:mt-3 bg-blue-50 text-blue-700 font-medium py-2 rounded-lg hover:text-primary duration-300 ${
                      !isCheckOut
                        ? "disabled:bg-gray-200 disabled:cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => {
                      handleCheckout();
                    }}
                    disabled={isCheckOut ? false : true}
                  >
                    <span>{t("chon")}</span>
                  </button>
                </div>
              </div>
            ))}
            {departLimit < filteredData.length && (
              <div
                ref={loadMoreDepartRef}
                className="mt-4 h-10 text-center inline-flex justify-center items-center w-full gap-3"
              >
                <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
              </div>
            )}
          </Fragment>
        </div>
      )}
      <Flight1GDetailPopup
        airports={airportsData}
        tabs={tabsFlightDetail}
        flights={flightDetail}
        isOpen={showDetail}
        onClose={handleClosePopupFlightDetail}
        isLoadingFareRules={false}
      />
    </Fragment>
  );
}
