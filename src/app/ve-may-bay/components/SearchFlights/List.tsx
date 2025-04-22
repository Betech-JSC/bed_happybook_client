"use client";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import Image from "next/image";
import { pareseDateFromString } from "@/lib/formatters";
import {
  getCurrentLanguage,
  handleScrollSmooth,
  handleSessionStorage,
} from "@/utils/Helper";
import { filtersFlightDomestic, ListFlight } from "@/types/flight";
import { useRouter } from "next/navigation";
import SignUpReceiveCheapTickets from "../SignUpReceiveCheapTickets";
import FlightDetailPopup from "../FlightDetailPopup";
import { FlightApi } from "@/api/Flight";
import { useTranslation } from "@/app/hooks/useTranslation";
import { translateText } from "@/utils/translateApi";
import { useLanguage } from "@/app/contexts/LanguageContext";
import FlightDomesticDetail from "./Detail";
import AOS from "aos";
import "aos/dist/aos.css";

const defaultFilers: filtersFlightDomestic = {
  priceWithoutTax: "0",
  timeDepart: "",
  sortAirLine: "",
  sortPrice: "",
  airlines: [],
  stopNum: [],
};

export default function ListFlights({
  airportsData,
  flightsData,
  airlineData,
  isFullFlightResource,
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
  flightType,
  flightStopNum,
  translatedStaticText,
  isReady,
}: ListFlight) {
  const INITIAL_LIMIT = 5;
  const router = useRouter();
  const { t } = useTranslation(translatedStaticText);
  const { language } = useLanguage();
  const departFlightRef = useRef<HTMLDivElement>(null);
  const returnFlightRef = useRef<HTMLDivElement>(null);
  const [filteredFlightsData, setFilteredFlightsData] = useState<any[]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [flightDetail, setFlightDetail] = useState<any[]>([]);
  const [isLoadingFareRules, setIsLoadingFareRules] = useState<boolean>(false);
  const [tabsFlightDetail, setTabsFlightDetail] = useState<
    { id: number; name: string }[]
  >([]);
  const [isCheckOut, setIsCheckOut] = useState<boolean>(false);
  const [selectedDepartFlight, setSelectedDepartFlight] = useState<any>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<any>(null);
  const [departLimit, setDepartLimit] = useState(INITIAL_LIMIT);
  const [returnLimit, setReturnLimit] = useState(INITIAL_LIMIT);
  const [filters, setFilters] = useState({
    priceWithoutTax: "0",
    timeDepart: "",
    sortAirLine: "",
    sortPrice: "",
    airlines: [] as string[],
    stopNum: [] as string[],
  });
  useEffect(() => {
    AOS.init({
      duration: 400,
      easing: "ease-in",
      once: true,
    });
  }, []);
  const scrollToRef = (ref: any) => {
    if (ref.current) {
      handleScrollSmooth(ref.current);
    }
  };
  const resetFilters = () => {
    setFilters(defaultFilers);
  };
  const handleLoadMoreDepart = () => {
    setDepartLimit((prev) => prev + INITIAL_LIMIT);
  };

  const handleLoadMoreReturn = () => {
    setReturnLimit((prev) => prev + INITIAL_LIMIT);
  };
  // Filter data
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    if (isFullFlightResource) {
      setFilters((prev) => {
        if (name === "airLine") {
          return {
            ...prev,
            airlines: checked
              ? [...prev.airlines, value]
              : prev.airlines.filter((airline) => airline !== value),
          };
        } else if (name === "priceWithoutTax") {
          return {
            ...prev,
            priceWithoutTax: checked ? value : "0",
          };
        } else if (name === "timeDepart") {
          return {
            ...prev,
            timeDepart: checked ? value : "",
          };
        } else if (name === "sortPrice") {
          return {
            ...prev,
            sortPrice: checked ? value : "",
          };
        } else if (name === "sortAirLine") {
          return {
            ...prev,
            sortAirLine: checked ? value : "",
          };
        } else if (name === "stopNum") {
          return {
            ...prev,
            stopNum: checked
              ? [...prev.stopNum, value]
              : prev.stopNum.filter((itemStopNum) => itemStopNum !== value),
          };
        }
        return prev;
      });
    }
  };

  const fetchFareRules = useCallback(
    async (flight: any, indexFareOption: any) => {
      try {
        setIsLoadingFareRules(true);
        const params = {
          source: flight.source,
          clientId: flight.clientId,
          itinerary: {
            airline: flight.airline,
            departDate: format(parseISO(flight.departure.at), "yyyy-MM-dd"),
            departure: flight.departure.IATACode,
            arrival: flight.arrival.IATACode,
            fareBasisCode: flight.fareOptions[indexFareOption].fareBasisCode,
          },
          fareValue: flight.fareOptions[indexFareOption].fareValue,
        };
        const response = await FlightApi.getFareRules(params);
        return response?.payload?.data ?? [];
      } catch (error: any) {
        const fareRules = await translateText(
          ["Xin vui lòng liên hệ với Happy Book để nhận thông tin chi tiết."],
          language
        );
        return fareRules;
      } finally {
        setIsLoadingFareRules(false);
      }
    },
    [language]
  );

  const toggleShowRuleTicket = useCallback(
    async (flight: any, indexFareOption: number) => {
      const response = await fetchFareRules(flight, indexFareOption);
      return response;
    },
    [fetchFareRules]
  );

  const handleShowPopupFlightDetail = (
    flight: any,
    indexFareOption: number,
    tabs: { id: number; name: string }[],
    showRuleTicket = false
  ) => {
    if (showRuleTicket) {
      const response = toggleShowRuleTicket(flight, indexFareOption);
      response.then((rules) => {
        flight.listFareRules = rules;
      });
    }
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
    if (isRoundTrip) {
      if (selectedDepartFlight && selectedReturnFlight) return;
    } else if (selectedDepartFlight) return;
    let filtered = flightsData.map((flight: any) => ({ ...flight }));
    if (filtered.length > 0) {
      if (filters.airlines.length > 0) {
        filtered = filtered.filter((flight: any) => {
          const match = filters.airlines.some(
            (airline) =>
              airline.trim().toLowerCase() ===
              flight.airLineCode.trim().toLowerCase()
          );
          return match;
        });
      }
      if (filters.stopNum.length > 0) {
        filtered = filtered.filter((flight: any) => {
          const match = filters.stopNum.some((stopNumber) => {
            const intStopNum = parseInt(stopNumber) ?? 0;
            const flightStopNum = parseInt(flight.legs) ?? 1;
            return intStopNum === flightStopNum;
          });
          return match;
        });
      }

      if (filters.timeDepart === "asc") {
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(a.departure.at).getTime() -
            new Date(b.departure.at).getTime()
        );
      }

      if (filters.sortAirLine === "asc") {
        filtered = [...filtered].sort((a, b) =>
          a.airline.localeCompare(b.airline)
        );
      }
    }
    if (isRoundTrip) {
      if (selectedDepartFlight && !selectedReturnFlight) {
        const departureTimeGo = new Date(
          selectedDepartFlight.arrival.at
        ).getTime();
        filtered = filtered.filter((flight: any) => {
          const departureTimeReturn = new Date(flight.departure.at).getTime();
          return departureTimeReturn >= departureTimeGo + 2 * 60 * 60 * 1000;
        });
      } else if (!selectedDepartFlight && selectedReturnFlight) {
        const departureTimeReturn = new Date(
          selectedReturnFlight.departure.at
        ).getTime();
        filtered = filtered.filter((flight: any) => {
          const departureTimeGo = new Date(flight.arrival.at).getTime();
          return departureTimeGo <= departureTimeReturn - 2 * 60 * 60 * 1000;
        });
      }
    }
    setFilteredFlightsData(filtered);
  }, [
    filters,
    isFullFlightResource,
    flightsData,
    selectedDepartFlight,
    selectedReturnFlight,
    isRoundTrip,
  ]);
  // Group Flights
  const groupFlights = (flights: any[]) => {
    if (flights.length < 1) {
      if (isRoundTrip) return [{ 1: [] }, { 2: [] }];
      else return [{ 1: [] }];
    }
    const listFlights = flights.reduce((acc, flight) => {
      const leg = flight.flightLeg;
      if (!acc[leg]) {
        acc[leg] = [];
      }
      acc[leg].push(flight);
      return acc;
    }, {} as { [key: string]: any[] });

    if (isRoundTrip && !listFlights[1]) {
      listFlights[1] = [];
    }
    return Object.values(listFlights);
  };

  // Select Depart and Return Flight
  const handleSelectDepartFlight = (flight: any, fareOptionIndex: number) => {
    if (selectedDepartFlight?.flightCode === flight.flightCode) {
      setSelectedDepartFlight(null);
    } else {
      flight.selectedTicketClass = flight.fareOptions[fareOptionIndex];
      setSelectedDepartFlight(flight);
      if (isRoundTrip && !selectedReturnFlight) {
        setTimeout(() => {
          scrollToRef(returnFlightRef);
        }, 100);
      }
    }
  };
  const handleSelectReturnFlight = (flight: any, fareOptionIndex: number) => {
    if (selectedReturnFlight?.flightCode === flight.flightCode) {
      setSelectedReturnFlight(null);
    } else {
      flight.selectedTicketClass = flight.fareOptions[fareOptionIndex];
      setSelectedReturnFlight(flight);
      if (isRoundTrip && !selectedDepartFlight) {
        setTimeout(() => {
          scrollToRef(departFlightRef);
        }, 100);
      }
    }
  };

  useEffect(() => {
    if (isRoundTrip) {
      if (selectedDepartFlight && selectedReturnFlight) {
        setIsCheckOut(true);
      }
    } else if (selectedDepartFlight) {
      setIsCheckOut(true);
    }
  }, [isRoundTrip, selectedReturnFlight, selectedDepartFlight]);

  useEffect(() => {
    if (isCheckOut && typeof window !== "undefined") {
      if (selectedDepartFlight) {
        handleSessionStorage("save", "departFlight", selectedDepartFlight);
      }
      if (selectedReturnFlight) {
        handleSessionStorage("save", "returnFlight", selectedReturnFlight);
      } else {
        handleSessionStorage("remove", "returnFlight");
      }
      if (flightSession) {
        handleSessionStorage("save", "flightSession", flightSession);
      }
      if (flightType) {
        handleSessionStorage("save", "flightType", flightType);
      }
      router.push("/ve-may-bay/thong-tin-hanh-khach");
    }
  }, [
    router,
    isCheckOut,
    selectedDepartFlight,
    selectedReturnFlight,
    flightType,
    flightSession,
  ]);

  let flightsGroup: any = groupFlights(filteredFlightsData);
  let departFlightsData = flightsGroup[0] ?? [];
  let returnFlightsData = flightsGroup[1] ?? [];
  if (selectedDepartFlight) departFlightsData = [selectedDepartFlight];
  if (selectedReturnFlight) returnFlightsData = [selectedReturnFlight];
  return (
    <Fragment>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6 pb-12">
        <aside
          className="lg:col-span-3 bg-white p-4 rounded-2xl"
          style={{
            opacity: isReady ? 1 : 0.5,
          }}
        >
          {Array.isArray(flightStopNum) && flightStopNum.length > 1 && (
            <div className="pb-3 border-b border-gray-200">
              <h2 className="font-semibold">{t("so_diem_dung")}</h2>
              {flightStopNum.map((stopNum: number, index: number) => (
                <div key={index} className="flex space-x-2 mt-3 items-center">
                  <input
                    type="checkbox"
                    name="stopNum"
                    value={`${stopNum}`}
                    id={`stopNum_${index}`}
                    onChange={handleCheckboxChange}
                    checked={filters.stopNum.includes(`${stopNum}`)}
                  />
                  <label htmlFor={`${`stopNum_${index}`}`}>
                    {stopNum < 1
                      ? t("chuyen_bay_thang")
                      : `${stopNum} ${t("diem_dung")}`}
                  </label>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 pb-3 border-b border-gray-200">
            <h2 className="font-semibold">{t("hien_thi_gia")}</h2>

            <div className="flex space-x-2 mt-3 items-center">
              <input
                type="checkbox"
                name="priceWithoutTax"
                value="1"
                id="priceWithoutTax"
                onChange={handleCheckboxChange}
                checked={filters.priceWithoutTax === "1"}
              />
              <label htmlFor="priceWithoutTax">
                {t("gia_chua_bao_gom_thue_phi")}
              </label>
            </div>
          </div>
          <div className="mt-3 pb-3 border-b border-gray-200">
            <h2 className="font-semibold">{t("sap_xep")}</h2>

            <div className="flex space-x-2 mt-3 items-center">
              <input
                type="checkbox"
                name="timeDepart"
                value="asc"
                id="sortTimeDepart"
                onChange={handleCheckboxChange}
                checked={filters.timeDepart === "asc"}
              />
              <label htmlFor="sortTimeDepart">{t("thoi_gian_khoi_hanh")}</label>
            </div>
            <div className="flex space-x-2 mt-3 items-center">
              <input
                type="checkbox"
                name="sortAirLine"
                value="asc"
                id="sortAirLine"
                onChange={handleCheckboxChange}
                checked={filters.sortAirLine === "asc"}
              />
              <label htmlFor="sortAirLine">{t("hang_hang_khong")}</label>
            </div>
          </div>
          {airlineData.length > 0 && (
            <div className="mt-3 pb-3 border-b border-gray-200">
              <h2 className="font-semibold">{t("hang_hang_khong")}</h2>
              {airlineData.map((airline, index) => (
                <div key={index} className="flex space-x-2 mt-3 items-center">
                  <input
                    type="checkbox"
                    name="airLine"
                    value={airline.code}
                    id={`airline_${index}`}
                    onChange={handleCheckboxChange}
                    checked={filters.airlines.includes(airline.code)}
                  />
                  <label htmlFor={`airline_${index}`}>{airline.name}</label>
                </div>
              ))}
            </div>
          )}
          <button
            className="w-full mt-3 py-3 bg-blue-600 text-white rounded-lg font-medium"
            onClick={resetFilters}
          >
            {t("xoa_bo_loc")}
          </button>
        </aside>
        <div className="lg:col-span-9" data-aos="fade">
          <div className="max-w-5xl mx-auto">
            <div>
              <div ref={departFlightRef}>
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
                    <p className="text-sm">
                      {totalPassengers} Khách -{" "}
                      {departDate
                        ? pareseDateFromString(departDate, "ddMMyyyy", "dd/MM")
                        : ""}
                    </p>
                  </div>
                </div>
                {/* Tabs day */}
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
                {departFlightsData.length > 0 ? (
                  <div className="mt-6">
                    {departFlightsData
                      .slice(0, departLimit)
                      .map((item: any, index: number) => (
                        <div key={index}>
                          <FlightDomesticDetail
                            FareData={item}
                            onSelectFlight={handleSelectDepartFlight}
                            selectedFlight={selectedDepartFlight}
                            setFlightDetail={handleShowPopupFlightDetail}
                            filters={filters}
                            totalPassengers={totalPassengers}
                            translatedStaticText={translatedStaticText}
                          />
                        </div>
                      ))}
                    {departLimit < departFlightsData.length && (
                      <div
                        onClick={handleLoadMoreDepart}
                        className="group hover:border-primary duration-300 max-w-[250px] text-center 
                      flex gap-2 mt-6 mx-auto py-3 justify-center items-center border border-gray-300 bg-white
                       text-gray-700 rounded-lg"
                      >
                        <button
                          type="button"
                          className="group-hover:text-primary duration-300"
                        >
                          Xem thêm chuyến bay
                        </button>
                        <div>
                          <svg
                            className="group-hover:stroke-primary stroke-[#283448] duration-300"
                            width="22"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 7.5L10 12.5L15 7.5"
                              strokeWidth="1.66667"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
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
              </div>
              {isRoundTrip && (
                <div ref={returnFlightRef} className="mt-8">
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
                      <h3 className="font-semibold">{`${to} - ${from} `}</h3>
                      <p className="text-sm">
                        {totalPassengers} {t("khach")} -{" "}
                        {returnDate
                          ? pareseDateFromString(
                              returnDate,
                              "ddMMyyyy",
                              "dd/MM"
                            )
                          : ""}
                      </p>
                    </div>
                  </div>
                  {/* Tabs day */}
                  <div className="grid grid-cols-7 items-center bg-white px-3 rounded-b-2xl">
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
                        <div className="text-sm md:text-base font-semibold">
                          {day.label}
                        </div>
                        <div className="text-xs md:text-sm mt-2">
                          {format(day.date, "dd/MM")}
                        </div>
                      </button>
                    ))}
                  </div>
                  {returnFlightsData.length > 0 ? (
                    <div className="my-6">
                      {returnFlightsData
                        .slice(0, returnLimit)
                        .map((item: any, index: number) => (
                          <div key={index}>
                            <FlightDomesticDetail
                              FareData={item}
                              onSelectFlight={handleSelectReturnFlight}
                              selectedFlight={selectedReturnFlight}
                              setFlightDetail={handleShowPopupFlightDetail}
                              filters={filters}
                              totalPassengers={totalPassengers}
                              translatedStaticText={translatedStaticText}
                            />
                          </div>
                        ))}
                      {returnLimit < returnFlightsData.length && (
                        <div
                          onClick={handleLoadMoreReturn}
                          className="group hover:border-primary duration-300 max-w-[250px] text-center 
                      flex gap-2 mt-6 mx-auto py-3 justify-center items-center border border-gray-300 bg-white
                       text-gray-700 rounded-lg"
                        >
                          <button
                            type="button"
                            className="group-hover:text-primary duration-300"
                          >
                            Xem thêm chuyến bay
                          </button>
                          <div>
                            <svg
                              className="group-hover:stroke-primary stroke-[#283448] duration-300"
                              width="22"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5 7.5L10 12.5L15 7.5"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    isFullFlightResource && (
                      <div className="w-full mt-12 text-center text-2xl font-semibold">
                        <p>{t("khong_co_chuyen_bay_nao_trong_ngay_hom_nay")}</p>
                        <p className="mt-1">
                          {t(
                            "quy_khach_vui_long_chuyen_sang_ngay_khac_de_dat_ve_xin_cam_on"
                          )}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
          <SignUpReceiveCheapTickets />
        </div>
        <FlightDetailPopup
          airports={airportsData}
          tabs={tabsFlightDetail}
          flights={flightDetail}
          isOpen={showDetail}
          onClose={handleClosePopupFlightDetail}
          translatedStaticText={translatedStaticText}
          isLoadingFareRules={isLoadingFareRules}
        />
      </div>
    </Fragment>
  );
}
