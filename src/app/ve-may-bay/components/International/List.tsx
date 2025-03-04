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
import { format, isSameDay } from "date-fns";
import Image from "next/image";
import { pareseDateFromString } from "@/lib/formatters";
import { handleScrollSmooth, handleSessionStorage } from "@/utils/Helper";
import FlightInternationalDetail from "./Detail";
import { filtersFlight, ListFlight } from "@/types/flight";
import { useRouter } from "next/navigation";
import SignUpReceiveCheapTickets from "../SignUpReceiveCheapTickets";
import FlightDetailPopup from "../FlightDetailPopup";
import _ from "lodash";
import { translatePage } from "@/utils/translateDom";
import { useTranslation } from "@/app/hooks/useTranslation";
import { translateText } from "@/utils/translateApi";

const defaultFilers: filtersFlight = {
  priceWithoutTax: "0",
  timeDepart: "",
  sortAirLine: "",
  sortPrice: "",
  airlines: [],
};

export default function FlightInternationalList({
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
  totalPassengers,
  flightType,
  translatedStaticText,
}: ListFlight) {
  const { t } = useTranslation(translatedStaticText);
  const [filteredData, setFilteredData] = useState<any[]>(flights);
  const router = useRouter();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [flightDetail, setFlightDetail] = useState<any[]>([]);
  const [selectedDepartFlight, setSelectedDepartFlight] = useState<any>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<any>(null);
  const [selectedFareDataId, setSelectedFareDataId] = useState<number | null>(
    null
  );
  const [isCheckOut, setIsCheckOut] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    priceWithoutTax: "0",
    timeDepart: "",
    sortAirLine: "",
    sortPrice: "",
    airlines: [] as string[],
  });

  const resetFilters = () => {
    setFilters(defaultFilers);
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
        }
        return prev;
      });
    }
  };

  useEffect(() => {
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

      if (filters.priceWithoutTax === "1") {
        filtered = [...filtered].map((item: any) => {
          const priceAtdWithoutTax = item.TaxAdt * item.Adt;
          const priceChdWithoutTax = item.TaxChd * item.Chd;
          const priceInfWithoutTax = item.TaxInf * item.Inf;
          item.TotalPriceWithOutTax =
            item.TotalPrice -
            (priceAtdWithoutTax + priceChdWithoutTax + priceInfWithoutTax);
          return item;
        });
      }
      translatePage("#wrapper_search_flight", 10);
    }
    setFilteredData(filtered);
  }, [filters, flights]);

  const handleCheckout = () => {
    if (isCheckOut) {
      handleSessionStorage("save", "departFlight", selectedDepartFlight);
      handleSessionStorage("save", "returnFlight", selectedReturnFlight);
      handleSessionStorage("save", "flightSession", flightSession);
      handleSessionStorage("save", "flightType", flightType);
      router.push("/ve-may-bay/thong-tin-hanh-khach");
    }
  };

  useEffect(() => {
    if (
      selectedDepartFlight &&
      selectedReturnFlight &&
      selectedDepartFlight.FareDataId === selectedReturnFlight.FareDataId &&
      flightSession
    ) {
      setIsCheckOut(true);
      setSelectedFareDataId(selectedDepartFlight.FareDataId);
    } else setSelectedFareDataId(null);
  }, [selectedDepartFlight, selectedReturnFlight, flightSession]);

  const handleSelectFlight = (FareData: any) => {
    const flight = FareData.ListFlight[0];
    if (flight.Leg) {
      setSelectedReturnFlight(FareData);
    } else {
      setSelectedDepartFlight(FareData);
    }
  };

  const fetchFareRules = useCallback(
    async (FareData: any, flight: any) => {
      try {
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
      }
    },
    [flightSession]
  );

  const handleShowPopupFlightDetail = (
    FareDataFlight: any,
    indexFlight: number
  ) => {
    if (FareDataFlight && indexFlight >= 0) {
      let FareDataDetail = _.cloneDeep(FareDataFlight);
      const flightShowDetail = FareDataDetail.ListFlight[indexFlight];

      const response = fetchFareRules(FareDataDetail, flightShowDetail);
      response.then((response) => {
        flightShowDetail.ListRuleTicket = response;
      });

      setShowDetail(true);
      setFlightDetail([flightShowDetail]);
    }
  };

  const handleClosePopupFlightDetail = () => {
    setShowDetail(false);
    setFlightDetail([]);
  };

  return (
    <Fragment>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6 pb-12">
        <aside className="lg:col-span-3 bg-white p-4 rounded-2xl">
          {/* <div className="pb-3 border-b border-gray-200">
            <h2 className="font-semibold">{t("sap_xep")}</h2>
            <select
              name=""
              id=""
              className="w-full p-3 mt-3 border border-gray-300 rounded-lg"
            >
              <option value="">{t("de_xuat")}</option>
            </select>
          </div> */}
          <div className="pb-3 border-b border-gray-200">
            <h2 className="font-semibold">{t("hien_thi_gia")}</h2>
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
              <div>
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
                    <div className="text-sm">
                      <span>{totalPassengers} Khách - </span>
                      {departDate
                        ? pareseDateFromString(departDate, "ddMMyyyy", "dd/MM")
                        : ""}
                    </div>
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

                {filteredData.length > 0 ? (
                  <div className="my-6">
                    {filteredData.map((data: any, index: number) => (
                      <div key={index} className="bg-white rounded-2xl mb-4">
                        {Array.from({ length: 2 }, (_, leg) => (
                          <Fragment key={leg}>
                            <div className="pb-2 bg-[#FCFCFD]">
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
                                    {!leg
                                      ? `${from}  - ${to}`
                                      : `${to}- ${from}`}
                                  </h3>

                                  <div className="text-sm">
                                    <span>
                                      {totalPassengers} {t("khach")} -{" "}
                                    </span>
                                    {leg
                                      ? returnDate
                                        ? pareseDateFromString(
                                            returnDate,
                                            "ddMMyyyy",
                                            "dd/MM"
                                          )
                                        : ""
                                      : departDate
                                      ? pareseDateFromString(
                                          departDate,
                                          "ddMMyyyy",
                                          "dd/MM"
                                        )
                                      : ""}
                                  </div>
                                </div>
                              </div>
                              <FlightInternationalDetail
                                FareData={data}
                                onSelectFlight={handleSelectFlight}
                                setFlightDetail={handleShowPopupFlightDetail}
                                leg={leg}
                                filters={filters}
                                translatedStaticText={translatedStaticText}
                              />
                            </div>
                          </Fragment>
                        ))}
                        <div className="flex justify-between px-4 py-6 items-center">
                          <div>
                            <span className="font-medium">
                              {t("tong_tien_thanh_toan")}:
                            </span>{" "}
                            <span className="text-2xl font-bold text-primary">
                              {filters.priceWithoutTax === "1"
                                ? data.TotalPriceWithOutTax.toLocaleString(
                                    "vi-VN"
                                  )
                                : data.TotalPrice.toLocaleString("vi-VN")}{" "}
                              {data.Currency}
                            </span>
                          </div>
                          <button
                            className={`text-center w-36 h-11 mt-5 md:mt-3 bg-blue-50 text-blue-700 font-medium py-2 rounded-lg hover:text-primary duration-300 ${
                              !isCheckOut ||
                              selectedFareDataId !== data.FareDataId
                                ? "disabled:bg-gray-200 disabled:cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => {
                              handleCheckout();
                            }}
                            disabled={
                              isCheckOut &&
                              selectedFareDataId === data.FareDataId
                                ? false
                                : true
                            }
                          >
                            <span>{t("chon")}</span>
                          </button>
                        </div>
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
            </div>
          </div>
          <SignUpReceiveCheapTickets />
        </div>
      </div>
      <FlightDetailPopup
        airports={airportsData}
        flights={flightDetail}
        isOpen={showDetail}
        onClose={handleClosePopupFlightDetail}
        translatedStaticText={translatedStaticText}
      />
    </Fragment>
  );
}
