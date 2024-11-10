"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  generateMonth,
  getDaysInMonth,
  handleScrollSmooth,
} from "@/utils/Helper";
import { FlightApi } from "@/api/Flight";
import FlightSearchPopup from "./FlightSearchPopup";
import { getDay, isValid, parse, format } from "date-fns";
import { AirportOption, FlightCalendarProps } from "@/types/flight";

const airLines = [
  {
    label: "Vietjet Air",
    value: "VJ",
  },
  {
    label: "Vietnam Airlines",
    value: "VN",
  },
  {
    label: "Bamboo Airways",
    value: "QH",
  },
  {
    label: "Vietravel Airlines",
    value: "VU",
  },
];

const mapDataByDay = (data: any[]) => {
  const mappedData: Record<number, { flights: any[] } | undefined> = {};
  data.forEach((item) => {
    const date = new Date(item.DepartDate);
    const day = date.getDate();
    mappedData[day] = { flights: item.ListFareData };
  });
  return mappedData;
};
const getLowestPrice = (flights: any[], airlineFilter: string | null) => {
  const allFlights = flights.flat();

  const filteredFlights = airlineFilter
    ? allFlights.filter((flight) => flight.Airline === airlineFilter)
    : allFlights;
  if (filteredFlights.length === 0) return null;
  return filteredFlights.reduce((lowest, flight) =>
    flight.FareAdt < lowest.FareAdt ? flight : lowest
  );
};
const listNextMonth = generateMonth(12);

export default function FlightCalendar({
  airports,
  fromOption,
  toOption,
  flightType,
}: FlightCalendarProps) {
  const searchParams = useSearchParams();
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const [daysInMonth, setDaysInMonth] = useState<Array<number | null>>([]);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [dataFlightDepart, setDataFlightDepart] = useState<
    Record<number, { flights: any[] } | undefined>
  >({});
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [airlineFilter, setAirlineFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tripType, setTripType] = useState<string>("oneWay");
  const [from, setFrom] = useState<AirportOption | undefined>(undefined);
  const [to, setTo] = useState<AirportOption | undefined>(undefined);
  const keyDateParams = flightType === "return" ? "ReturnDate" : "DepartDate";
  const scrollToResultContainer = () => {
    if (resultsRef.current) {
      handleScrollSmooth(resultsRef.current);
    }
  };

  useEffect(() => {
    const totalDays = getDaysInMonth(year, month);
    const firstDayOfMonth = getDay(new Date(year, month - 1, 1));
    const daysArray: Array<number | null> = Array(firstDayOfMonth).fill(null);
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push(i);
    }
    setDaysInMonth(daysArray);

    if (month === currentMonth && year === currentYear) {
      setActiveDay(currentDay);
    } else {
      setActiveDay(1);
    }
  }, [month, year, currentMonth, currentYear, currentDay]);

  useEffect(() => {
    const departDateParam = searchParams.get(keyDateParams) ?? "";
    setFrom(fromOption);
    setTo(toOption);
    const parsedDate = parse(departDateParam, "ddMMyyyy", new Date());
    const month = isValid(parsedDate)
      ? parseInt(format(parsedDate, "MM"))
      : currentMonth;
    const year = isValid(parsedDate)
      ? parseInt(format(parsedDate, "yyyy"))
      : currentYear;
    const tripType = searchParams.get("tripType") ?? "oneWay";
    setTripType(tripType);
    setMonth(month);
    setYear(year);
  }, [
    searchParams,
    keyDateParams,
    airports,
    fromOption,
    toOption,
    currentMonth,
    currentYear,
  ]);
  //   Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        scrollToResultContainer();
        const StartPoint = fromOption?.code ?? "SGN";
        const EndPoint = toOption?.code ?? "HAN";

        if (year && month) {
          setAirlineFilter(null);
          const response = await FlightApi.search("flights/searchmonth", {
            StartPoint: StartPoint,
            EndPoint: EndPoint,
            Airline: "",
            Month: month,
            Year: year,
          });
          const ListMinPrice = response?.payload.data.ListMinPrice ?? [];
          const mappedData = mapDataByDay(ListMinPrice);
          setDataFlightDepart(mappedData);
          setError(null);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, fromOption, toOption, month, year]);

  if (!month) return null;
  // Loading
  if (loading) {
    return (
      <div
        ref={flightType === "depart" ? resultsRef : null}
        className={`flex my-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
      >
        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
        <span className="text-18">Đang tải dữ liệu chuyến bay...</span>
      </div>
    );
  }

  // Error Connect api
  if (error) {
    return (
      <div
        ref={flightType === "depart" ? resultsRef : null}
        className="px-4 w-full mx-auto my-20 text-center"
      >
        <p className="text-18 font-semibold">
          Hiện tại chúng tôi đang không kết nối được với hãng bay, quý khách vui
          lòng thực hiện tìm lại chuyến bay sau ít phút nữa. Xin cám ơn.
        </p>
      </div>
    );
  }
  const isDisabled = (day: number) => {
    if (year < currentYear) return true;
    if (year === currentYear && month < currentMonth) return true;
    if (year === currentYear && month === currentMonth && day < currentDay)
      return true;
    return false;
  };

  const handleDayClick = (day: number) => {
    if (!isDisabled(day)) {
      setActiveDay(day);
      setPopupOpen(true);
      const selectedDate = new Date(year, month - 1, day);
      setSelectedDate(selectedDate);
    }
  };

  return (
    <Fragment>
      <h2 className="text-32 font-bold mt-6 px-3 md:px-0">
        Vé Máy Bay từ {from?.city ?? "Hồ Chí Minh"} tới {to?.city ?? "Hà Nội"}
      </h2>
      <div
        ref={flightType === "depart" ? resultsRef : null}
        className="bg-white pb-4 border border-b-0 border-gray-300 rounded-t-lg mt-6"
      >
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <div className="w-full">
            <label className="block text-gray-700 mb-1">Từ</label>
            <div className="flex h-12 items-center border rounded-lg px-2">
              <Image
                src="/icon/AirplaneTakeoff.svg"
                alt="Icon"
                className="h-10"
                width={18}
                height={18}
              ></Image>
              <div className="w-full cursor-pointer">
                <input
                  type="text"
                  value={from?.city ?? "Hồ Chí Minh"}
                  onFocus={(e) => e.target.blur()}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  readOnly
                  className="outline-none w-full pl-3"
                />
                {/* <Select
                options={airports}
                value={from}
                onChange={setFrom}
                placeholder={"Chọn điểm đi"}
                isClearable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "none",
                    boxShadow: "none",
                    cursor: "pointer",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    cursor: "pointer",
                    width: "260px",
                  }),
                  indicatorSeparator: () => ({
                    display: "none",
                  }),
                  dropdownIndicator: () => ({
                    display: "none",
                  }),
                }}
                components={{ Option: CustomOptionSelect, NoOptionsMessage }}
                menuPlacement="auto"
              /> */}
              </div>
            </div>
          </div>
          <div className="w-full">
            <label className="block text-gray-700 mb-1">Đến</label>
            <div className="flex h-12 items-center border rounded-lg px-2">
              <Image
                src="/icon/AirplaneLanding.svg"
                alt="Icon"
                className="h-10"
                width={18}
                height={18}
              />
              <div className="w-full cursor-pointer">
                <input
                  type="text"
                  value={to?.city ?? "Hà Nội"}
                  onFocus={(e) => e.target.blur()}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  readOnly
                  className="outline-none w-full pl-3"
                />
                {/* <Select
                options={airports}
                value={to}
                onChange={setTo}
                placeholder={"Chọn điểm đến"}
                isClearable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "none",
                    boxShadow: "none",
                    cursor: "pointer",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    cursor: "pointer",
                    width: "260px",
                  }),
                  indicatorSeparator: () => ({
                    display: "none",
                  }),
                  dropdownIndicator: () => ({
                    display: "none",
                  }),
                }}
                components={{ Option: CustomOptionSelect, NoOptionsMessage }}
                menuPlacement="auto"
              /> */}
              </div>
            </div>
          </div>
          <div className="w-full">
            <label className="block text-gray-700 mb-1">Tháng</label>
            <div className="flex h-12 items-center border rounded-lg px-2">
              <Image
                src="/icon/calendar.svg"
                alt="Icon"
                className="h-10"
                width={18}
                height={18}
              />
              <div className="w-full cursor-pointer">
                <select
                  className="border p-2 rounded-lg outline-none w-full border-none"
                  value={`${month}-${year}`}
                  onChange={(e) => {
                    const [selectedMonth, selectedYear] = e.target.value
                      .split("-")
                      .map(Number);
                    setMonth(selectedMonth);
                    setYear(selectedYear);
                  }}
                >
                  {listNextMonth.map(({ month, year }) => (
                    <option key={`${month}-${year}`} value={`${month}-${year}`}>
                      Tháng {month}/{year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="w-full">
            <label className="block text-gray-700 mb-1">Hãng</label>
            <div className="flex h-12 items-center border rounded-lg px-2">
              <div className="w-full cursor-pointer">
                <select
                  className="border p-2 rounded-lg outline-none w-full border-none"
                  onChange={(e) => setAirlineFilter(e.target.value || null)}
                >
                  <option value="">Chọn hãng</option>
                  {airLines.map((item: any, index: any) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border border-t-0 pb-6 border-gray-300 rounded-b-lg">
        <div className="px-0 md:px-6 pt-0 grid grid-cols-7 gap-[2px] md:gap-3 text-center">
          {[
            {
              label: "Chủ nhật",
              type: "full",
            },
            {
              label: "CN",
              type: "short",
            },
            {
              label: "Thứ 2",
              type: "full",
            },
            {
              label: "T2",
              type: "short",
            },
            {
              label: "Thứ 3",
              type: "full",
            },
            {
              label: "T3",
              type: "short",
            },
            {
              label: "Thứ 4",
              type: "full",
            },
            {
              label: "T4",
              type: "short",
            },
            {
              label: "Thứ 5",
              type: "full",
            },
            {
              label: "T5",
              type: "short",
            },
            {
              label: "Thứ 6",
              type: "full",
            },
            {
              label: "T6",
              type: "short",
            },
            {
              label: "Thứ 7",
              type: "full",
            },
            {
              label: "T7",
              type: "short",
            },
          ].map((dayName, index) => {
            return dayName.type === "full" ? (
              <div key={index} className="font-semibold mb-3 hidden lg:block">
                {dayName.label}
              </div>
            ) : (
              <div
                key={index}
                className="text-sm font-semibold mb-3 block lg:hidden"
              >
                {dayName.label}
              </div>
            );
          })}
          {daysInMonth.map((day, index) => {
            const flightData = dataFlightDepart[day ?? 0];
            const flightLowestPrice =
              flightData && getLowestPrice(flightData.flights, airlineFilter);
            const disabled = isDisabled(day ?? 0);
            const isActive = day === activeDay;

            return day ? (
              <div
                key={day !== null ? day : `empty-${index}`}
                className={`p-1 md:p-2 min-h-12 border rounded-lg md:rounded-xl lg:h-28 border-gray-200 transition-all duration-300 ${
                  disabled ? "opacity-50 cursor-not-allowed bg-gray-200" : ""
                } ${isActive ? "bg-primary text-white" : ""}`}
              >
                {!disabled && (
                  <div
                    className="flex flex-col space-y-1 justify-between h-full cursor-pointer"
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="flex justify-between w-full items-start">
                      <span className="text-xs font-semibold md:font-normal  md:text-base">
                        {day.toString().padStart(2, "0")}
                      </span>
                      {flightLowestPrice && (
                        <div className="">
                          <Image
                            src={`/airline/${flightLowestPrice.Airline}.svg`}
                            alt={"VN"}
                            width={40}
                            height={40}
                            className="w-4 h-4 md:w-6 md:h-6 lg:w-10 lg:h-10"
                          />
                        </div>
                      )}
                    </div>
                    <div className="font-semibold text-left">
                      {flightLowestPrice && (
                        <Fragment>
                          <div className="font-semibold hidden lg:block">
                            {flightLowestPrice.FareAdt.toLocaleString()} vnd
                          </div>
                          <div className="text-sm md:text-base md:text-left text-center font-semibold block lg:hidden">
                            {`${Math.floor(flightLowestPrice.FareAdt / 1000)}`}
                            <span className="text-xs font-semibold">K</span>
                          </div>
                        </Fragment>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                key={day !== null ? day : `empty-${index}`}
                className={`p-2 border rounded-xl lg:h-28 border-gray-200 transition-all duration-300 opacity-50 cursor-not-allowed bg-gray-200
              `}
              ></div>
            );
          })}
        </div>
        {/* Popup */}
        <FlightSearchPopup
          isOpen={isPopupOpen}
          onClose={() => setPopupOpen(false)}
          selectedDate={selectedDate}
          onDateChange={(date) => setSelectedDate(date)}
          fromOption={fromOption}
          toOption={toOption}
          airportsData={airports}
          flightType={flightType}
        />
      </div>
    </Fragment>
  );
}
