"use client";
import { FlightApi } from "@/api/Fligt";
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
import { useSearchParams, usePathname } from "next/navigation";

interface Day {
  label: string;
  date: Date;
  disabled: boolean;
}
export default function ListFilght() {
  const searchParams = useSearchParams();
  const params = useMemo(() => {
    let ListFlightSearch = [
      {
        StartPoint: searchParams.get("StartPoint") ?? "",
        EndPoint: searchParams.get("EndPoint") ?? "",
        DepartDate: searchParams.get("DepartDate"),
        Airline: "",
      },
    ];
    if (
      searchParams.get("tripType") === "roundTrip" &&
      searchParams.get("ReturnDate")
    ) {
      ListFlightSearch.push({
        StartPoint: searchParams.get("EndPoint") ?? "",
        EndPoint: searchParams.get("StartPoint") ?? "",
        DepartDate:
          searchParams.get("ReturnDate") ?? format(new Date(), "ddMMyyy"),
        Airline: "",
      });
    }
    return {
      TripType: searchParams.get("tripType") ?? "oneWay",
      Adt: searchParams.get("Adt") ?? "1",
      Chd: searchParams.get("Chd") ?? "0",
      Inf: searchParams.get("Inf") ?? "0",
      ViewMode: "",
      ListFlight: ListFlightSearch,
    };
  }, [searchParams]);
  const pathName: string = usePathname();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    price: string[];
    sort: string[];
    airLine: string[];
  }>({
    price: [],
    sort: [],
    airLine: [],
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  // Handle Tabs Days
  const today = useMemo(() => {
    const departDate = searchParams.get("DepartDate");
    if (departDate) {
      const parsedDate = parse(departDate, "ddMMyyyy", new Date());
      return isValid(parsedDate) ? parsedDate : new Date();
    }
    return new Date();
  }, [searchParams]);
  const [currentDate, setCurrentDate] = useState(today);
  const [days, setDays] = useState<Day[]>([]);

  useEffect(() => {
    setCurrentDate(today);
  }, [today]);

  const generateDays = useCallback(
    (baseDate: Date) => {
      const newDays: Day[] = [];

      for (let i = -3; i <= 3; i++) {
        const date = addDays(baseDate, i);
        const isDisabled =
          isBefore(date, new Date()) && !isSameDay(date, today);
        newDays.push({
          label: getDayLabel(date.getDay()),
          date,
          disabled: isDisabled,
        });
      }

      setDays(newDays);
    },
    [today]
  );

  useEffect(() => {
    generateDays(currentDate);
  }, [currentDate, generateDays]);
  const handleClickDate = (date: Date, typeDate: number) => {
    setCurrentDate(date);
    const formattedDate = format(date, "ddMMyyyy");
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (typeDate) params.set("ReturnDate", formattedDate);
    else params.set("DepartDate", formattedDate);
    history.replaceState(null, "", `${pathName}?${params.toString()}`);
  };
  const getDayLabel = (dayIndex: number) => {
    const daysOfWeek = [
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
      "Chủ nhật",
    ];
    return daysOfWeek[dayIndex] || "Không xác định";
  };
  // End Tabs Day
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (resultsRef.current) {
          const topOffset =
            resultsRef.current.getBoundingClientRect().top +
            window.scrollY -
            200;
          window.scrollTo({ top: topOffset, behavior: "smooth" });
        }
        const response = await FlightApi.search("flights/search", params);
        setData(response?.payload.data.ListFareData ?? []);
        setError(null);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);
  const groupFlightsByDate = (tickets: any[], dateKey: string) => {
    const listFlights = tickets.reduce((acc, ticket) => {
      const date = format(ticket.ListFlight[0][dateKey], "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(ticket);
      return acc;
    }, {} as { [key: string]: any[] });
    return Object.values(listFlights);
  };

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

  const flights = groupFlightsByDate(data, "StartDate");

  return (
    <Fragment>
      {flights.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6 pb-12">
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
              <div className="flex space-x-2 mt-3">
                <input type="checkbox" name="price" id="price_1" />
                <label htmlFor="price_1">Giá bao gồm thuế phí</label>
              </div>
              <div className="flex space-x-2 mt-3">
                <input type="checkbox" name="price" id="price_2" />
                <label htmlFor="price_2">Giá chưa bao gồm thuế phí</label>
              </div>
            </div>
            <div className="mt-3 pb-3 border-b border-gray-200">
              <h2 className="font-semibold">Sắp xếp</h2>
              <div className="flex space-x-2 mt-3">
                <input
                  type="checkbox"
                  name="price"
                  id="priceAsc"
                  value="priceAsc"
                />
                <label htmlFor="priceAsc">Giá thấp tới cao</label>
              </div>
              <div className="flex space-x-2 mt-3">
                <input type="checkbox" name="price" id="sort_price_2" />
                <label htmlFor="sort_price_2">Thời gian khởi hành</label>
              </div>
              <div className="flex space-x-2 mt-3">
                <input type="checkbox" name="price" id="sort_price_3" />
                <label htmlFor="sort_price_3">Hãng hàng không</label>
              </div>
            </div>
            <div className="mt-3 pb-3 border-b border-gray-200">
              <h2 className="font-semibold">Hãng hàng không</h2>
              <div className="flex space-x-2 mt-3">
                <input
                  type="checkbox"
                  name="airLine"
                  value="VJ"
                  id="airline_1"
                />
                <label htmlFor="airline_1">Bamboo Airline</label>
              </div>
              <div className="flex space-x-2 mt-3">
                <input type="checkbox" name="price" id="airline_2" />
                <label htmlFor="airline_2">Vietjet Air</label>
              </div>
              <div className="flex space-x-2 mt-3">
                <input type="checkbox" name="price" id="airline_3" />
                <label htmlFor="airline_3">Vietnam Airlines</label>
              </div>
            </div>
            <button className="w-full mt-3 py-3 bg-blue-600 text-white rounded-lg font-medium">
              Xóa bộ lọc
            </button>
          </aside>
          <div className="lg:col-span-9">
            <div className="max-w-5xl mx-auto">
              <div ref={resultsRef}>
                {flights.map((flights: any, key: number) => (
                  <Fragment key={key}>
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
                          {params.ListFlight[key] &&
                            params.ListFlight[key].StartPoint}{" "}
                          -{" "}
                          {params.ListFlight[key] &&
                            params.ListFlight[key].EndPoint}
                        </h3>
                        <p className="text-sm">
                          {parseInt(params.Adt) +
                            parseInt(params.Chd) +
                            parseInt(params.Inf)}{" "}
                          Khách -{" "}
                          {params.ListFlight[key] &&
                          params.ListFlight[key].DepartDate
                            ? pareseDateFromString(
                                params.ListFlight[key].DepartDate,
                                "ddMMyyyy",
                                "dd/MM"
                              )
                            : ""}
                        </p>
                      </div>
                    </div>
                    {/* Tabs day */}
                    <div className="grid grid-cols-7 items-center bg-white px-3 rounded-b-2xl">
                      {days.map((day, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            !day.disabled && handleClickDate(day.date, key)
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
                          <div className="font-semibold">{day.label}</div>
                          <div className="text-sm mt-2">
                            {format(day.date, "dd/MM")}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="my-6">
                      {flights.map((item: any, index: number) => (
                        <div key={index}>
                          <FlightDetails FareData={item} />
                        </div>
                      ))}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
}
