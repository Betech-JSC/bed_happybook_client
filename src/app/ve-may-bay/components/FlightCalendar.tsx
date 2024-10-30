"use client"; // Đảm bảo rằng component này được xử lý như một client component

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AirportOption } from "@/types/flight";
import { generateMonth, getDaysInMonth } from "@/utils/Helper";
import { FlightApi } from "@/api/Fligt";
import FlightSearchPopup from "./FlightSearchPopup";
import { getDay, isValid, parse, format } from "date-fns";

const airports: AirportOption[] = [
  {
    label: "Hồ Chí Minh",
    value: "SGN",
  },
  {
    label: "Hà Nội",
    value: "HAN",
  },
  {
    label: "Nha Trang",
    value: "CXR",
  },
];
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
    flight.price < lowest.price ? flight : lowest
  );
};
const listNextMonth = generateMonth(12);

export default function FlightCalendar() {
  const searchParams = useSearchParams();
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const [daysInMonth, setDaysInMonth] = useState<Array<number | null>>([]);
  const [activeDay, setActiveDay] = useState<number>(currentDay);
  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);
  const [fromLabel, setFromLabel] = useState<string>("Hồ Chí Minh");
  const [toLabel, setToLabel] = useState<string>("Hà Nội");
  const resultsRef = useRef<HTMLDivElement>(null);
  const [flightDataByDay, setFlightDataByDay] = useState<
    Record<number, { flights: any[] } | undefined>
  >({});
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [airlineFilter, setAirlineFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const totalDays = getDaysInMonth(year, month);
    const firstDayOfMonth = getDay(new Date(year, month - 1, 1));
    const daysArray: Array<number | null> = Array(firstDayOfMonth).fill(null); // Khoảng trống cho ngày trước
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
    const fromParam = searchParams.get("StartPoint") ?? "SGN";
    const toParam = searchParams.get("EndPoint") ?? "HAN";
    const departDateParam = searchParams.get("DepartDate") ?? "";
    const fromOption = airports.find((loc) => loc.value === fromParam);
    const toOption = airports.find((loc) => loc.value === toParam);
    setFromLabel(fromOption?.label ?? "Hồ Chí Minh");
    setToLabel(toOption?.label ?? "Hà Nội");
    const parsedDate = parse(departDateParam, "ddMMyyyy", new Date());
    const month = isValid(parsedDate)
      ? parseInt(format(parsedDate, "MM"))
      : currentMonth;
    const year = isValid(parsedDate)
      ? parseInt(format(parsedDate, "yyyy"))
      : currentYear;
    setMonth(month);
    setYear(year);
  }, [searchParams, currentMonth, currentYear]);

  //   Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await FlightApi.search("flights/searchmonth", {
          StartPoint: searchParams.get("StartPoint") ?? "SGN",
          EndPoint: searchParams.get("EndPoint") ?? "HAN",
          Airline: "",
          Month: month,
          Year: year,
        });
        const ListMinPrice = response?.payload.data.ListMinPrice ?? [];
        const mappedData = mapDataByDay(ListMinPrice);
        setFlightDataByDay(mappedData);
        setError(null);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, month, year]);

  if (!month) return null;
  // Loading
  if (loading) {
    return (
      <div
        ref={resultsRef}
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
      <div ref={resultsRef} className="px-4 w-full mx-auto my-20 text-center">
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
      <h1 className="text-32 font-bold mt-6">
        Vé Máy Bay từ {fromLabel} tới {toLabel}
      </h1>
      <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg mt-6">
        <div className="grid grid-cols-4 gap-8">
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
                  value={fromLabel}
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
                  value={toLabel}
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

        <div className="mt-5 grid grid-cols-7 gap-3 text-center">
          {[
            "Chủ nhật",
            "Thứ 2",
            "Thứ 3",
            "Thứ 4",
            "Thứ 5",
            "Thứ 6",
            "Thứ 7",
          ].map((dayName) => (
            <div key={dayName} className="font-semibold mb-3">
              {dayName}
            </div>
          ))}

          {daysInMonth.map((day, index) => {
            const flightData = flightDataByDay[day ?? 0];
            const flightLowestPrice =
              flightData && getLowestPrice(flightData.flights, airlineFilter);
            const disabled = isDisabled(day ?? 0);
            const isActive = day === activeDay;

            return day ? (
              <div
                key={day !== null ? day : `empty-${index}`}
                className={`p-2 border rounded-xl lg:h-28 border-gray-200 transition-all duration-300 ${
                  disabled ? "opacity-50 cursor-not-allowed bg-gray-200" : ""
                } ${isActive ? "bg-primary text-white" : ""}`}
              >
                {!disabled && (
                  <div
                    className="flex flex-col justify-between h-full cursor-pointer"
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="flex justify-between w-full items-start">
                      <span className="font-normal">
                        {day.toString().padStart(2, "0")}
                      </span>
                      {flightLowestPrice && (
                        <div className="">
                          <Image
                            src={`/airline/${flightLowestPrice.Airline}.svg`}
                            alt={"VN"}
                            width={40}
                            height={40}
                            className="w-10 h-10"
                          />
                        </div>
                      )}
                    </div>
                    <div className="font-semibold text-left">
                      {flightLowestPrice && (
                        <div className="font-semibold">
                          {flightLowestPrice.TotalPrice.toLocaleString()} vnd
                        </div>
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
          airports={airports}
        />
      </div>
    </Fragment>
  );
}
