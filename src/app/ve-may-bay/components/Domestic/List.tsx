"use client";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { format, isSameDay } from "date-fns";
import Image from "next/image";
import { pareseDateFromString } from "@/lib/formatters";
import {
  getCurrentLanguage,
  handleScrollSmooth,
  handleSessionStorage,
} from "@/utils/Helper";
import FlightDomesticDetail from "./Detail";
import { filtersFlightDomestic, ListFlight } from "@/types/flight";
import { useRouter } from "next/navigation";
import SignUpReceiveCheapTickets from "../SignUpReceiveCheapTickets";
import FlightDetailPopup from "../FlightDetailPopup";
import { FlightApi } from "@/api/Flight";
import { useTranslation } from "@/app/hooks/useTranslation";
import { translateText } from "@/utils/translateApi";

const defaultFilers: filtersFlightDomestic = {
  priceWithoutTax: "0",
  timeDepart: "",
  sortAirLine: "",
  sortPrice: "",
  airlines: [],
  stopNum: [],
};

export default function FilghtDomesticList({
  airportsData,
  flights,
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
  displayType,
  isRoundTrip,
  totalFlightLeg,
  totalPassengers,
  flightType,
  flightStopNum,
  translatedStaticText,
}: ListFlight) {
  const router = useRouter();
  const { t } = useTranslation(translatedStaticText);
  const departFlightRef = useRef<HTMLDivElement>(null);
  const returnFlightRef = useRef<HTMLDivElement>(null);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [flightDetail, setFlightDetail] = useState<any[]>([]);
  const [isLoadingRules, setIsLoadingRules] = useState<boolean>(false);
  const [tabsFlightDetail, setTabsFlightDetail] = useState<
    { id: number; name: string }[]
  >([]);
  const [isCheckOut, setIsCheckOut] = useState<boolean>(false);
  const [selectedDepartFlight, setSelectedDepartFlight] = useState<any>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<any>(null);
  const [filters, setFilters] = useState({
    priceWithoutTax: "0",
    timeDepart: "",
    sortAirLine: "",
    sortPrice: "",
    airlines: [] as string[],
    stopNum: [] as string[],
  });
  const scrollToRef = (ref: any) => {
    if (ref.current) {
      handleScrollSmooth(ref.current);
    }
  };
  const resetFilters = () => {
    setFilters(defaultFilers);
  };

  // Group Flights
  const groupFlights = (flights: any[]) => {
    if (flights.length < 1) {
      if (isRoundTrip) return [{ 0: [] }, { 1: [] }];
      else return [{ 0: [] }];
    }
    const listFlights = flights.reduce((acc, flight) => {
      const leg = flight.Leg;
      if (!acc[leg]) {
        acc[leg] = [];
      }
      acc[leg].push(flight);
      return acc;
    }, {} as { [key: string]: any[] });

    if (isRoundTrip && !listFlights[1]) {
      listFlights[1] = [];
    }

    totalFlightLeg.map((_: number, index: number) => {
      if (!listFlights[index]) {
        listFlights[index] = [];
      }
    });
    return Object.values(listFlights);
  };

  // Filter data
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    if (flights.length > 0) {
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
    async (FareData: any, flight: any) => {
      try {
        setIsLoadingRules(true);
        const params = {
          ListFareData: [
            {
              Session: flightSession,
              FareDataId: FareData.FareDataId,
              ListFlight: [
                {
                  FlightValue: flight.FlightValue,
                },
              ],
            },
          ],
        };

        const response = await FlightApi.getFareRules(
          "flights/getfarerules",
          params
        );

        const fareRules = await translateText([
          response?.payload.data.ListFareRules[0].ListRulesGroup[0]
            .ListRulesText[0] ??
            `Xin vui lòng liên hệ với Happy Book để nhận thông tin chi tiết.`,
        ]);
        return fareRules?.[0];
      } catch (error: any) {
        const fareRules = await translateText([
          "Xin vui lòng liên hệ với Happy Book để nhận thông tin chi tiết.",
        ]);
        return fareRules?.[0];
      } finally {
        setIsLoadingRules(false);
      }
    },
    [flightSession]
  );

  const toggleShowRuleTicket = useCallback(
    async (flightClass: any) => {
      const response = await fetchFareRules(
        flightClass,
        flightClass.ListFlight[0]
      );
      return response;
    },
    [fetchFareRules]
  );

  const handleShowPopupFlightDetail = (
    flight: any,
    tabs: { id: number; name: string }[],
    showRuleTicket = false
  ) => {
    if (showRuleTicket) {
      const fareData = flight;
      flight = fareData.ListFlight[0];
      const response = toggleShowRuleTicket(fareData);
      response.then((response) => {
        flight.ListRuleTicket = response;
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
    let filtered = flights.map((flight: any) => ({ ...flight }));
    if (filtered.length > 0) {
      if (filters.airlines.length > 0) {
        filtered = filtered.filter((flight: any) => {
          const match = filters.airlines.some(
            (airline) =>
              airline.trim().toLowerCase() ===
              flight.Airline.trim().toLowerCase()
          );
          return match;
        });
      }

      if (filters.stopNum.length > 0) {
        filtered = filtered.filter((flight: any) => {
          const match = filters.stopNum.some((stopNumber) => {
            const intStopNum = parseInt(stopNumber) ?? 0;
            return intStopNum === flight.ListFlight[0].StopNum;
          });
          return match;
        });
      }

      if (filters.timeDepart === "asc") {
        filtered = [...filtered].sort(
          (a, b) =>
            new Date(a.ListFlight[0].StartDate).getTime() -
            new Date(b.ListFlight[0].StartDate).getTime()
        );
      }

      if (filters.sortAirLine === "asc") {
        filtered = [...filtered].sort((a, b) =>
          a.Airline.localeCompare(b.Airline)
        );
      }
    }
    if (isRoundTrip) {
      if (selectedDepartFlight && !selectedReturnFlight) {
        const departureTimeGo = new Date(
          selectedDepartFlight.ListFlight[0].EndDate
        ).getTime();
        filtered = filtered.filter((flight: any) => {
          if (flight.Leg) {
            const departureTimeReturn = new Date(
              flight.ListFlight[0].StartDate
            ).getTime();
            return departureTimeReturn >= departureTimeGo + 2 * 60 * 60 * 1000;
          }
        });
      } else if (!selectedDepartFlight && selectedReturnFlight) {
        const departureTimeReturn = new Date(
          selectedReturnFlight.ListFlight[0].StartDate
        ).getTime();
        filtered = filtered.filter((flight: any) => {
          if (flight.Leg === 0) {
            const departureTimeGo = new Date(
              flight.ListFlight[0].EndDate
            ).getTime();
            return departureTimeGo <= departureTimeReturn - 2 * 60 * 60 * 1000;
          }
        });
      }
    }

    setFilteredData(filtered);
  }, [
    filters,
    flights,
    selectedDepartFlight,
    selectedReturnFlight,
    isRoundTrip,
  ]);

  const CalculateTotalPriceWithoutTax = (flight: any) => {
    if (!flight) return 0;
    const priceAtdWithoutTax = flight.TaxAdt * flight.Adt;
    const priceChdWithoutTax = flight.TaxChd * flight.Chd;
    const priceInfWithoutTax = flight.TaxInf * flight.Inf;
    const totalPriceWithOutTax =
      flight.TotalPrice -
      (priceAtdWithoutTax + priceChdWithoutTax + priceInfWithoutTax);
    return totalPriceWithOutTax;
  };

  // Select Depart and Return Flight
  const handleSelectDepartFlight = (flight: any) => {
    if (selectedDepartFlight?.FareDataId === flight.FareDataId) {
      setSelectedDepartFlight(null);
    } else {
      flight.TotalPriceWithOutTax = CalculateTotalPriceWithoutTax(flight);
      setSelectedDepartFlight(flight);
      if (isRoundTrip && !selectedReturnFlight) {
        setTimeout(() => {
          scrollToRef(returnFlightRef);
        }, 100);
      }
    }
  };

  const handleSelectReturnFlight = (flight: any) => {
    if (selectedReturnFlight?.FareDataId === flight.FareDataId) {
      setSelectedReturnFlight(null);
    } else {
      flight.TotalPriceWithOutTax = CalculateTotalPriceWithoutTax(flight);
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

  let flightsGroup: any = groupFlights(filteredData);
  if (selectedDepartFlight) {
    flightsGroup[0] = [selectedDepartFlight]; // Depart Flight
  }
  if (selectedReturnFlight) {
    flightsGroup[1] = [selectedReturnFlight]; // Return flight
  }

  return (
    <Fragment>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6 pb-12">
        <aside className="lg:col-span-3 bg-white p-4 rounded-2xl">
          {/* <div className="pb-3 border-b border-gray-200">
            <h2 className="font-semibold">{t("chi_tiet")}</h2>
            <select
              name=""
              id=""
              className="w-full p-3 mt-3 border border-gray-300 rounded-lg"
            >
              <option value="">{t("de_xuat")}</option>
            </select>
          </div> */}
          {Array.isArray(flightStopNum) && flightStopNum.length > 1 && (
            <div className="pb-3 border-b border-gray-200">
              <h2 className="font-semibold">{t("so_diem_dung")}</h2>
              {flightStopNum.map((stopNum: number, index: number) => (
                <div key={index} className="flex space-x-2 mt-3">
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
            {/* <div className="flex space-x-2 mt-3">
              <input type="checkbox" name="price" id="price_1" />
              <label htmlFor="price_1">Giá bao gồm thuế phí</label>
            </div> */}
            <div className="flex space-x-2 mt-3">
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
            {/* <div className="flex space-x-2 mt-3">
              <input
                type="checkbox"
                name="sortPrice"
                id="sortPrice"
                value="asc"
                onChange={handleCheckboxChange}
                checked={filters.sortPrice === "asc"}
              />
              <label htmlFor="sortPrice">Giá thấp tới cao</label>
            </div> */}
            <div className="flex space-x-2 mt-3">
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
            <div className="flex space-x-2 mt-3">
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
          <div className="mt-3 pb-3 border-b border-gray-200">
            <h2 className="font-semibold">{t("hang_hang_khong")}</h2>
            <div className="flex space-x-2 mt-3">
              <input
                type="checkbox"
                name="airLine"
                value="QH"
                id="airline_1"
                onChange={handleCheckboxChange}
                checked={filters.airlines.includes("QH")}
              />
              <label htmlFor="airline_1">Bamboo Airways</label>
            </div>
            <div className="flex space-x-2 mt-3">
              <input
                type="checkbox"
                name="airLine"
                value="VJ"
                id="airline_2"
                onChange={handleCheckboxChange}
                checked={filters.airlines.includes("VJ")}
              />
              <label htmlFor="airline_2">Vietjet Air</label>
            </div>
            <div className="flex space-x-2 mt-3">
              <input
                type="checkbox"
                name="airLine"
                value="VN"
                id="airline_3"
                onChange={handleCheckboxChange}
                checked={filters.airlines.includes("VN")}
              />
              <label htmlFor="airline_3">Vietnam Airlines</label>
            </div>
            <div className="flex space-x-2 mt-3">
              <input
                type="checkbox"
                name="airLine"
                value="VU"
                id="airline_4"
                onChange={handleCheckboxChange}
                checked={filters.airlines.includes("VU")}
              />
              <label htmlFor="airline_4">Vietravel Airlines</label>
            </div>
          </div>
          <button
            className="w-full mt-3 py-3 bg-blue-600 text-white rounded-lg font-medium"
            onClick={resetFilters}
          >
            {t("xoa_bo_loc")}
          </button>
        </aside>
        <div className="lg:col-span-9">
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
                {flightsGroup[0].length > 0 ? (
                  <div className="my-6">
                    {flightsGroup[0].map((item: any, index: number) => (
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
              {flightsGroup.length > 1 && (
                <div ref={returnFlightRef}>
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
                  {Array.isArray(flightsGroup) &&
                  Array.isArray(flightsGroup[1]) &&
                  flightsGroup[1].length > 0 ? (
                    <div className="my-6">
                      {flightsGroup[1].map((item: any, index: number) => (
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
                    </div>
                  ) : (
                    <div className="w-full mt-12 text-center text-2xl font-semibold">
                      <p>{t("khong_co_chuyen_bay_nao_trong_ngay_hom_nay")}</p>
                      <p className="mt-1">
                        {t(
                          "quy_khach_vui_long_chuyen_sang_ngay_khac_de_dat_ve_xin_cam_on"
                        )}
                      </p>
                    </div>
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
        />
      </div>
    </Fragment>
  );
}
