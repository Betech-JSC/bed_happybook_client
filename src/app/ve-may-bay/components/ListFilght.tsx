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
import FlightDetails from "./FlightDetails";
import { addDays, parse, format, isValid, isBefore, isSameDay } from "date-fns";
import Image from "next/image";
import { pareseDateFromString } from "@/lib/formatters";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { handleScrollSmooth } from "@/utils/Helper";
import SignUpReceiveCheapTickets from "./SignUpReceiveCheapTickets";
import { HttpError } from "@/lib/error";
import { ListFilghtProps } from "@/types/flight";
import Link from "next/link";

interface Day {
  label: string;
  date: Date;
  disabled: boolean;
}

const defaultFilers = {
  priceWithoutTax: "0",
  timeDepart: "",
  sortAirLine: "",
  sortPrice: "",
  airlines: [],
};
export default function ListFilght({ airports }: ListFilghtProps) {
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
  const [selectedDepartFlight, setSelectedDepartFlight] = useState<any>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<any>(null);
  const [displayType, setDisplayType] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const [apiFlightSession, setApiFlightSession] = useState<string>("");
  const router = useRouter();
  // Handle Params
  const searchParams = useSearchParams();
  const StartPoint = searchParams.get("StartPoint") ?? "";
  const EndPoint = searchParams.get("EndPoint") ?? "";
  const fromPlace = airports.reduce<string | null>(
    (acc, air) => (air.value === StartPoint ? air.label : acc),
    null
  );
  const toPlace = airports.reduce<string | null>(
    (acc, air) => (air.value === EndPoint ? air.label : acc),
    null
  );
  const DepartDate =
    searchParams.get("DepartDate") ?? format(new Date(), "ddMMyyy");
  const ReturnDate = searchParams.get("ReturnDate") ?? DepartDate;
  const tripType = searchParams.get("tripType") ?? "oneWay";
  const passengerAdt = parseInt(searchParams.get("Adt") ?? "1");
  const passengerChd = parseInt(searchParams.get("Chd") ?? "0");
  const passengerInf = parseInt(searchParams.get("Inf") ?? "0");

  const params = useMemo(() => {
    let ListFlightSearch = [
      {
        StartPoint: StartPoint,
        EndPoint: EndPoint,
        DepartDate: DepartDate,
        Airline: "",
      },
    ];
    if (tripType === "roundTrip" && ReturnDate) {
      ListFlightSearch.push({
        StartPoint: EndPoint,
        EndPoint: StartPoint,
        DepartDate: ReturnDate,
        Airline: "",
      });
      setIsRoundTrip(true);
    } else {
      setIsRoundTrip(false);
    }
    return {
      TripType: tripType,
      Adt: passengerAdt,
      Chd: passengerChd,
      Inf: passengerInf,
      ViewMode: "",
      ListFlight: ListFlightSearch,
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
  const pathName: string = usePathname();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [totalFlightLeg, setTotalFlightLeg] = useState<any[]>([]);

  const scrollToResultContainer = () => {
    if (resultsRef.current) {
      handleScrollSmooth(resultsRef.current);
    }
  };
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
  const [days, setDays] = useState<Day[]>([]);
  const [returnDays, setReturnDays] = useState<Day[]>([]);

  useEffect(() => {
    setCurrentDate(today);
    setCurrentReturnDay(currentReturnDate);
  }, [today, currentReturnDate]);

  const generateDays = useCallback(
    (baseDate: Date, type: string, displayType: "desktop" | "mobile") => {
      const newDays: Day[] = [];

      for (let i = -3; i <= 3; i++) {
        const date = addDays(baseDate, i);
        const isDisabled =
          isBefore(date, new Date()) && !isSameDay(date, new Date());
        newDays.push({
          label: getDayLabel(date.getDay(), displayType),
          date,
          disabled: isDisabled,
        });
      }
      if (type === "depart") setDays(newDays);
      else setReturnDays(newDays);
    },
    []
  );
  useEffect(() => {
    generateDays(currentDate, "depart", displayType);
    if (isRoundTrip) generateDays(currentReturnDay, "return", displayType);
  }, [currentDate, currentReturnDay, isRoundTrip, displayType, generateDays]);

  const handleClickDate = (date: Date, typeDate: number) => {
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

  const getDayLabel = (dayIndex: number, displayType: "desktop" | "mobile") => {
    const daysOfWeek =
      displayType === "desktop"
        ? ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]
        : ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

    return daysOfWeek[dayIndex] || "Không xác định";
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

  // Fetch and Handle Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setData([]);
        setSelectedDepartFlight(null);
        setSelectedReturnFlight(null);
        setLoading(true);
        const checkTripType =
          (tripType === "roundTrip" && ReturnDate) || tripType === "oneWay"
            ? true
            : false;
        if (StartPoint && EndPoint && DepartDate && checkTripType) {
          scrollToResultContainer();
          const response = await FlightApi.search("flights/search", params);
          const listFareData = response?.payload.data.ListFareData ?? [];
          const flightFleg: any = [];
          if (listFareData.length) {
            listFareData.forEach((flight: any) => {
              const priceAtdWithoutTax = flight.TaxAdt * flight.Adt;
              const priceChdWithoutTax = flight.TaxChd * flight.Chd;
              const priceInfWithoutTax = flight.TaxInf - flight.Inf;
              flight.TotalPriceWithOutTax =
                flight.TotalPrice -
                (priceAtdWithoutTax + priceChdWithoutTax + priceInfWithoutTax);
              const leg = flight.Leg;
              if (!flightFleg[leg]) {
                flightFleg[leg] = [];
              }
            });
            setApiFlightSession(response?.payload.data.Session);
          }
          setTotalFlightLeg(flightFleg);
          setData(listFareData);
          setFilteredData(listFareData);
          resetFilters();
          setError(null);
        } else {
          router.push("/ve-may-bay");
          setData([]);
          toast.dismiss();
          toast.error("Vui lòng chọn đầy đủ thông tin");
        }
      } catch (error: any) {
        if (error instanceof HttpError) {
          if (error.payload.code === 400) {
            setError(
              "Không có chuyến bay nào trong ngày hôm nay, quý khách vui lòng chuyển sang ngày khác để đặt vé. Xin cám ơn!"
            );
          }
        } else {
          setError(
            `Hiện tại chúng tôi đang không kết nối được với hãng bay, quý khách vui lòng thực hiện tìm lại chuyến bay sau ít phút nữa. Xin cám ơn`
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params, StartPoint, EndPoint, DepartDate, ReturnDate, tripType, router]);

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
    totalFlightLeg.map((_, index) => {
      if (!listFlights[index]) {
        listFlights[index] = [];
      }
    });
    return Object.values(listFlights);
  };

  // Filter data
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    if (data.length > 0) {
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
    if (isRoundTrip) {
      if (selectedDepartFlight && selectedReturnFlight) return;
    } else if (selectedDepartFlight) return;
    let filtered = data.map((flight: any) => ({ ...flight }));
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

      // if (filters.sortPrice === "asc") {
      //   filtered = [...filtered].sort((a, b) => {
      //     const timeDiff =
      //       new Date(a.ListFlight[0].StartDate).getTime() -
      //       new Date(b.ListFlight[0].StartDate).getTime();

      //     if (timeDiff === 0) {
      //       return a.TotalPrice - b.TotalPrice;
      //     }
      //     return timeDiff;
      //   });
      // }

      if (filters.sortAirLine === "asc") {
        filtered = [...filtered].sort((a, b) =>
          a.Airline.localeCompare(b.Airline)
        );
      }
    }
    setFilteredData(filtered);
  }, [filters, data, selectedDepartFlight, selectedReturnFlight, isRoundTrip]);

  // Select Depart and Retrun Flight
  const handleSelectDepartFlight = (flight: any) => {
    if (selectedDepartFlight?.FareDataId === flight.FareDataId) {
      setSelectedDepartFlight(null);
    } else {
      setSelectedDepartFlight(flight);
      scrollToResultContainer();
    }
  };
  const handleSelectReturnFlight = (flight: any) => {
    if (selectedReturnFlight?.FareDataId === flight.FareDataId) {
      setSelectedReturnFlight(null);
    } else {
      setSelectedReturnFlight(flight);
      scrollToResultContainer();
    }
  };

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
        <p className="text-18 font-semibold">{error}</p>
      </div>
    );
  }
  let flights: any = [];
  let checkOut = false;
  let totalPriceCheckout = 0;
  flights = groupFlights(filteredData);
  if (selectedDepartFlight) {
    flights[0] = [selectedDepartFlight];
  }
  if (selectedReturnFlight) {
    flights[1] = [selectedReturnFlight];
  }
  if (isRoundTrip) {
    if (selectedDepartFlight && selectedReturnFlight) {
      checkOut = true;
      totalPriceCheckout = (
        selectedDepartFlight.TotalPrice + selectedReturnFlight.TotalPrice
      ).toLocaleString("vi-VN");
    }
  } else if (selectedDepartFlight) {
    checkOut = true;
    totalPriceCheckout =
      selectedDepartFlight.TotalPrice.toLocaleString("vi-VN");
  }
  return (
    <Fragment>
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6 pb-12"
        ref={resultsRef}
      >
        <aside className="lg:col-span-3 bg-white p-4 rounded-2xl">
          <div className="pb-3 border-b border-gray-200">
            <h2 className="font-semibold">Sắp xếp</h2>
            <select
              name=""
              id=""
              className="w-full p-3 mt-3 border border-gray-300 rounded-lg"
            >
              <option value="">Đề xuất</option>
            </select>
          </div>
          <div className="mt-3 pb-3 border-b border-gray-200">
            <h2 className="font-semibold">Hiển thị giá</h2>
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
              <label htmlFor="priceWithoutTax">Giá chưa bao gồm thuế phí</label>
            </div>
          </div>
          <div className="mt-3 pb-3 border-b border-gray-200">
            <h2 className="font-semibold">Sắp xếp</h2>
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
              <label htmlFor="sortTimeDepart">Thời gian khởi hành</label>
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
              <label htmlFor="sortAirLine">Hãng hàng không</label>
            </div>
          </div>
          <div className="mt-3 pb-3 border-b border-gray-200">
            <h2 className="font-semibold">Hãng hàng không</h2>
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
            Xóa bộ lọc
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
                    <h3 className="font-semibold">
                      {fromPlace} ({StartPoint} ) - {toPlace} ({EndPoint})
                    </h3>
                    <p className="text-sm">
                      {passengerAdt + passengerChd + passengerInf} Khách -{" "}
                      {DepartDate
                        ? pareseDateFromString(DepartDate, "ddMMyyyy", "dd/MM")
                        : ""}
                    </p>
                  </div>
                </div>
                {/* Tabs day */}
                <div className="grid grid-cols-7 items-center bg-white rounded-b-2xl">
                  {days.map((day, index) => (
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
                      <div className="text-sm md:text-base font-semibold">
                        {day.label}
                      </div>
                      <div className="text-xs md:text-sm mt-2">
                        {format(day.date, "dd/MM")}
                      </div>
                    </button>
                  ))}
                </div>
                {flights[0].length > 0 ? (
                  <div className="my-6">
                    {flights[0].map((item: any, index: number) => (
                      <div key={index}>
                        <FlightDetails
                          session={apiFlightSession}
                          FareData={item}
                          fromPlace={fromPlace}
                          toPlace={toPlace}
                          onSelectFlight={handleSelectDepartFlight}
                          selectedFlight={selectedDepartFlight}
                          filters={filters}
                          airports={airports}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full my-12 text-center text-2xl font-semibold">
                    Không tìm thấy chuyến bay phù hợp...
                  </div>
                )}
              </div>
              {flights.length > 1 && (
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
                      <h3 className="font-semibold">
                        {toPlace} ({EndPoint} ) - {fromPlace} ({StartPoint})
                      </h3>
                      <p className="text-sm">
                        {passengerAdt + passengerChd + passengerInf} Khách -{" "}
                        {ReturnDate
                          ? pareseDateFromString(
                              ReturnDate,
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
                        <div className="font-semibold">{day.label}</div>
                        <div className="text-sm mt-2">
                          {format(day.date, "dd/MM")}
                        </div>
                      </button>
                    ))}
                  </div>
                  {Array.isArray(flights) &&
                  Array.isArray(flights[1]) &&
                  flights[1].length > 0 ? (
                    <div className="my-6">
                      {flights[1].map((item: any, index: number) => (
                        <div key={index}>
                          <FlightDetails
                            session={apiFlightSession}
                            FareData={item}
                            fromPlace={toPlace}
                            toPlace={fromPlace}
                            onSelectFlight={handleSelectReturnFlight}
                            selectedFlight={selectedReturnFlight}
                            filters={filters}
                            airports={airports}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full mt-12 text-center text-2xl font-semibold">
                      Không tìm thấy chuyến bay phù hợp...
                    </div>
                  )}
                </div>
              )}
            </div>
            {checkOut && (
              <div className="flex items-center justify-between flex-wrap md:flex-nowrap mt-8 rounded-lg bg-white py-4 px-6">
                <div className="w-full md:w-1/2 text-right md:text-left">
                  <p className="font-normal">Tổng tiền thanh toán:</p>
                  <p className="text-2xl text-primary font-bold mt-1">
                    {totalPriceCheckout} VND
                  </p>
                </div>
                <Link
                  href="/ve-may-bay/thong-tin-hanh-khach"
                  className="w-full md:w-fit mt-3 md:mt-0 text-center py-3 px-10 bg-blue-600 border text-white rounded-lg hover:text-primary duration-300"
                >
                  Tiếp tục
                </Link>
              </div>
            )}
            <SignUpReceiveCheapTickets />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
