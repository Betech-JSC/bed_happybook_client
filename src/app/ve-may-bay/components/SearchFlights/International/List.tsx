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
import { filtersFlight, ListFlight } from "@/types/flight";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { useLanguage } from "@/contexts/LanguageContext";
import FlightInternational1GDetail from "./1G/Detail";
import { useTranslation } from "@/hooks/useTranslation";
import Flight1GDetailPopup from "./1G/FlightDetailPopup";
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

export default function ListFlightsInternaltion({
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
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedDepartFlight, setSelectedDepartFlight] = useState<any>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<any>(null);
  const [selectedFareDataId, setSelectedFareDataId] = useState<string | null>(
    null
  );
  const [isCheckOut, setIsCheckOut] = useState<boolean>(false);
  const [filters, setFilters] = useState(defaultFilers);
  const wrapperResultRef = useRef<HTMLDivElement>(null);

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
            selectedDepartFlight?.source === "1G" &&
            selectedReturnFlight?.source === "1G"
              ? "1G"
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
    if (FareId !== selectedFareDataId) {
      handleUncheck(e);
      setSelectedReturnFlight(null);
      setIsCheckOut(false);
    }
    setSelectedDepartFlight(flight);
    setSelectedFareDataId(FareId);
  };

  const handleSelectReturnFlight = (
    flight: any,
    FareId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (FareId !== selectedFareDataId) {
      handleUncheck(e);
      setSelectedDepartFlight(null);
      setIsCheckOut(false);
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
                    <span>{totalPassengers} Khách - </span>
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
              </div>
            </Fragment>
            {isReady && flightsData?.length ? (
              <Fragment>
                <ListFlights1GInternaltion
                  from={from}
                  to={to}
                  airportsData={airportsData}
                  flightsData={flightsData.filter(
                    (item: any) => item.source === "1G"
                  )}
                  airlineData={airlineData}
                  returnDate={returnDate}
                  departDate={departDate}
                  flightSession={flightSession}
                  isRoundTrip={isRoundTrip}
                  totalPassengers={totalPassengers}
                  filters={filters}
                  handleSelectDepartFlight={handleSelectDepartFlight}
                  handleSelectReturnFlight={handleSelectReturnFlight}
                  selectedFareDataId={selectedFareDataId}
                  handleCheckout={handleCheckout}
                  isCheckOut={isCheckOut}
                />

                <ListFlightsInternationalNormal
                  from={from}
                  to={to}
                  airportsData={airportsData}
                  flightsData={flightsData.filter(
                    (item: any) => item.source !== "1G"
                  )}
                  airlineData={airlineData}
                  returnDate={returnDate}
                  departDate={departDate}
                  flightSession={flightSession}
                  isRoundTrip={isRoundTrip}
                  totalPassengers={totalPassengers}
                  filters={filters}
                  handleSelectDepartFlight={handleSelectDepartFlight}
                  handleSelectReturnFlight={handleSelectReturnFlight}
                  selectedDepartFlight={selectedDepartFlight}
                  selectedReturnFlight={selectedReturnFlight}
                  selectedFareDataId={selectedFareDataId}
                  handleCheckout={handleCheckout}
                  isCheckOut={isCheckOut}
                />
              </Fragment>
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
    </Fragment>
  );
}
