"use client";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { differenceInHours, format, isSameDay, parseISO } from "date-fns";
import Image from "next/image";
import { pareseDateFromString } from "@/lib/formatters";
import { handleScrollSmooth } from "@/utils/Helper";
import { useRouter } from "next/navigation";
import { FlightApi } from "@/api/Flight";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import FlightInternationDetail from "./Detail";
import FlightInternationalDetailPopup from "./FlightDetailPopup";

const INITIAL_LIMIT = 5;

export default function ListFlightsInternationalNormal({
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
  selectedDepartFlight,
  selectedReturnFlight,
  handleCheckout,
  isCheckOut,
  filters,
}: any) {
  const { t } = useTranslation();
  const [filteredFlightsData, setFilteredFlightsData] = useState<any[]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [flightDetail, setFlightDetail] = useState<any[]>([]);
  const [tabsFlightDetail, setTabsFlightDetail] = useState<
    { id: number; name: string }[]
  >([]);
  const [flightsLimit, setFlightsLimit] = useState(INITIAL_LIMIT);

  const handleShowPopupFlightDetail = (
    flight: any,
    indexFareOption: number,
    tabs: { id: number; name: string }[],
    showRuleTicket = false
  ) => {
    flight.selectedTicketClass = flight.fareOptions[indexFareOption];
    setShowDetail(true);
    setFlightDetail([flight]);
    setTabsFlightDetail(tabs);
  };

  const handleClosePopupFlightDetail = useCallback(() => {
    setShowDetail(false);
    setFlightDetail([]);
    setTabsFlightDetail([]);
  }, []);

  useEffect(() => {
    let filtered = flightsData.map((flight: any) => ({ ...flight }));

    if (filtered.length > 0) {
      if (filters.airlines.length > 0) {
        filtered = filtered.filter((flight: any) => {
          const match = filters.airlines.some(
            (airline: string) =>
              airline.trim().toLowerCase() ===
              flight.airLineCode.trim().toLowerCase()
          );
          return match;
        });
      }

      if (
        filters?.departureTime?.[0] !== 0 ||
        filters?.departureTime?.[1] !== 24
      ) {
        const [startHour, endHour] = filters.departureTime;
        const fromMinute = startHour * 60;
        const toMinute = endHour * 60;
        filtered = filtered.filter((flight: any) => {
          const departure = parseISO(flight.departure.at);
          const departureMinutes =
            departure.getHours() * 60 + departure.getMinutes();
          return departureMinutes >= fromMinute && departureMinutes <= toMinute;
        });
      }

      if (filters?.arrivalTime?.[0] !== 0 || filters?.arrivalTime?.[1] !== 24) {
        const [startHour, endHour] = filters.arrivalTime;
        const fromMinute = startHour * 60;
        const toMinute = endHour * 60;
        filtered = filtered.filter((flight: any) => {
          const arrival = parseISO(flight.arrival.at);
          const arrivalMinutes = arrival.getHours() * 60 + arrival.getMinutes();
          return arrivalMinutes >= fromMinute && arrivalMinutes <= toMinute;
        });
      }

      filtered = [...filtered].sort((a, b) => {
        if (filters.sortAirLine === "asc") {
          const nameA = a.airline?.toLowerCase() ?? "";
          const nameB = b.airline?.toLowerCase() ?? "";
          const nameCompare = nameA.localeCompare(nameB);
          if (nameCompare !== 0) return nameCompare;
        }

        const priceA = a.fareOptions?.[0]?.totalPrice ?? 0;
        const priceB = b.fareOptions?.[0]?.totalPrice ?? 0;
        if (priceA !== priceB) return priceA - priceB;

        const stopNumA = a.legs ?? 0;
        const stopNumB = b.legs ?? 0;
        if (stopNumA !== stopNumB) return stopNumA - stopNumB;

        const timeA = parseISO(a.departure.at).getTime();
        const timeB = parseISO(b.departure.at).getTime();
        return timeA - timeB;
      });
    }
    if (
      selectedDepartFlight?.source !== "1G" &&
      selectedReturnFlight?.source !== "1G"
    ) {
      if (selectedDepartFlight && !selectedReturnFlight) {
        const arrivalTimeGo = parseISO(selectedDepartFlight.arrival.at);
        filtered = filtered.filter((flight: any) => {
          const departureTimeReturn = parseISO(flight.departure.at);
          const hoursDiff = differenceInHours(
            departureTimeReturn,
            arrivalTimeGo
          );
          return (
            flight.flightLeg === 0 || (flight.flightLeg === 1 && hoursDiff >= 2)
          );
        });
      } else if (!selectedDepartFlight && selectedReturnFlight) {
        const departureTimeReturn = parseISO(selectedReturnFlight.departure.at);
        filtered = filtered.filter((flight: any) => {
          const arrivalTimeGo = parseISO(flight.arrival.at);
          const hoursDiff = differenceInHours(
            departureTimeReturn,
            arrivalTimeGo
          );
          return (
            flight.flightLeg === 1 || (flight.flightLeg === 0 && hoursDiff >= 2)
          );
        });
      }
    }

    setFilteredFlightsData(filtered);
  }, [
    filters,
    flightsData,
    selectedDepartFlight,
    selectedReturnFlight,
    isRoundTrip,
  ]);

  // Group Flights
  const groupFlights = (flights: any[]): { [key: number]: any[] } => {
    const grouped: { [key: number]: any[] } = {
      0: [],
      1: [],
    };

    for (const flight of flights) {
      const leg = flight.flightLeg;
      if (grouped[leg]) {
        grouped[leg].push(flight);
      }
    }

    return grouped;
  };

  let flightsGroup: any = groupFlights([...filteredFlightsData]);
  return (
    <Fragment>
      <div
        className={`bg-white rounded-2xl my-6 border-2 ${
          selectedFareDataId === "flights-normal-rt"
            ? "border-[#efad02]"
            : "border-transparent"
        }`}
      >
        {Object.keys(flightsGroup).length > 1 &&
          Object.entries(flightsGroup).map(([leg, group]: [string, any]) => (
            <div
              className={`pb-2 bg-[#FCFCFD] rounded-t-2xl ${
                parseInt(leg) === 1 ? "mt-6" : ""
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
                    {parseInt(leg) === 0
                      ? `${from} - ${to}`
                      : `${to} - ${from}`}
                  </h3>

                  <div className="text-sm">
                    <span>
                      {totalPassengers} {t("khach")} -{" "}
                    </span>
                    {parseInt(leg) === 0
                      ? departDate
                        ? pareseDateFromString(departDate, "ddMMyyyy", "dd/MM")
                        : ""
                      : returnDate
                      ? pareseDateFromString(returnDate, "ddMMyyyy", "dd/MM")
                      : ""}
                  </div>
                </div>
              </div>
              {group.map((item: any, index: number) => (
                <div key={index}>
                  <FlightInternationDetail
                    FareData={item}
                    onSelectFlight={
                      parseInt(leg) === 0
                        ? handleSelectDepartFlight
                        : handleSelectReturnFlight
                    }
                    selectedFlight={null}
                    setFlightDetail={handleShowPopupFlightDetail}
                    filters={filters}
                    totalPassengers={totalPassengers}
                    flightLeg={leg}
                  />
                </div>
              ))}
            </div>
          ))}

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
      <FlightInternationalDetailPopup
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
