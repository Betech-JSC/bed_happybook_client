"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datePicker.scss";
import { vi } from "date-fns/locale";
import { format, parse, isValid } from "date-fns";
import SelectMenu from "./Passenger/Menu";
import { toast } from "react-hot-toast";
import { Suspense } from "react";
import { FormData, SearchFilghtProps } from "@/types/flight";
import AirportSelector from "./AirportSelector";

export default function Search({ airportsData }: SearchFilghtProps) {
  const today = new Date();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [totalGuests, setTotalGuests] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    from: null,
    fromPlace: null,
    toPlace: null,
    to: null,
    departureDate: today,
    returnDate: null,
    Adt: 1,
    Chd: 0,
    Inf: 0,
    tripType: "oneway",
    cheapest: 0,
  });

  useEffect(() => {
    const from = searchParams.get("StartPoint");
    const to = searchParams.get("EndPoint");
    const fromPlace = searchParams.get("from");
    const toPlace = searchParams.get("to");
    const departDate = parse(
      searchParams.get("DepartDate") ?? "",
      "ddMMyyyy",
      new Date()
    );
    const returnDate = parse(
      searchParams.get("ReturnDate") ?? "",
      "ddMMyyyy",
      new Date()
    );
    const passengerAdt = parseInt(searchParams.get("Adt") ?? "1");
    const passengerChd = parseInt(searchParams.get("Chd") ?? "0");
    const passengerInf = parseInt(searchParams.get("Inf") ?? "0");
    const cheapest = parseInt(searchParams.get("cheapest") ?? "0");
    const tripType = searchParams.get("tripType") || "oneWay";
    setFormData({
      from: from || null,
      to: to || null,
      fromPlace: fromPlace || null,
      toPlace: toPlace || null,
      departureDate: isValid(departDate) ? departDate : new Date(),
      returnDate: isValid(returnDate) ? returnDate : null,
      Adt: passengerAdt,
      Chd: passengerChd,
      Inf: passengerInf,
      tripType: tripType,
      cheapest: cheapest,
    });
  }, [searchParams]);

  const [cheapest, setCheapest] = useState<string>(
    searchParams.get("cheapest") || "0"
  );
  const [tripType, setTripType] = useState<string>(
    searchParams.get("tripType") || "oneWay"
  );
  useEffect(() => {
    setTotalGuests(formData.Adt + formData.Chd + formData.Inf);
    if (
      formData.from &&
      formData.to &&
      tripType === "roundTrip" &&
      !formData.returnDate
    ) {
      handleFocusNextDate(returnDateRef);
    }
  }, [formData, tripType]);

  const departDateRef = useRef<DatePicker | null>(null);
  const returnDateRef = useRef<DatePicker | null>(null);

  const handleFocusNextDate = (nextRef: React.RefObject<DatePicker | null>) => {
    if (nextRef.current) {
      nextRef.current.setFocus();
    }
  };

  const handleCheckboxCheapest = () => {
    setCheapest(cheapest === "1" ? "0" : "1");
  };

  const handleTripChange = (type: "oneWay" | "roundTrip") => {
    setTripType(type);
    if (type === "roundTrip") {
      if (formData.from && formData.to) {
        setTimeout(() => {
          handleFocusNextDate(returnDateRef);
        }, 300);
      }
    } else formData.returnDate = null;
  };

  const handleGuestChange = (key: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLocationChange = useCallback(
    (locations: { from: string | null; to: string | null }) => {
      setFormData((prev) => ({
        ...prev,
        ...locations,
      }));
    },
    []
  );

  const handleLocationPlaceChange = useCallback(
    (locations: { fromPlace: string | null; toPlace: string | null }) => {
      setFormData((prev) => ({
        ...prev,
        ...locations,
      }));
    },
    []
  );

  const handleDepartDateChange = (date: Date | null) => {
    if (!formData.returnDate) {
      handleFocusNextDate(returnDateRef);
    }
    if (formData.returnDate && date && date > formData.returnDate) {
      formData.returnDate = date;
    }
    setFormData((prev) => ({
      ...prev,
      departureDate: date,
    }));
  };

  const handleReturnDateChange = (date: Date | null) => {
    if (formData.departureDate && date && date < formData.departureDate) {
      date = formData.departureDate;
    }
    setFormData((prev) => ({
      ...prev,
      returnDate: date,
    }));
  };

  const handleSearch = () => {
    const totalPassengers = formData.Adt + formData.Chd + formData.Inf;
    const {
      from,
      to,
      fromPlace,
      toPlace,
      departureDate,
      returnDate,
      Adt,
      Chd,
      Inf,
    } = formData;
    const checkTripType =
      (tripType === "roundTrip" && returnDate) || tripType === "oneWay"
        ? true
        : false;
    if (from && to && departureDate && totalPassengers && checkTripType) {
      const formattedDate = departureDate
        ? format(departureDate, "ddMMyyyy")
        : "";
      const formattedReturndate = returnDate
        ? format(returnDate, "ddMMyyyy")
        : "";
      const queryString = `tripType=${tripType}&cheapest=${cheapest}&StartPoint=${from}&EndPoint=${to}&DepartDate=${formattedDate}&ReturnDate=${formattedReturndate}&Adt=${Adt}&Chd=${Chd}&Inf=${Inf}&from=${fromPlace}&to=${toPlace}`;
      if (cheapest === "1") {
        router.push(`/ve-may-bay/ve-may-bay-gia-re?${queryString}`);
      } else {
        router.push(`/ve-may-bay/tim-kiem-ve?${queryString}`);
      }
    } else {
      toast.dismiss();
      toast.error("Vui lòng chọn đầy đủ thông tin");
    }
  };

  return (
    <Suspense>
      <div>
        <div className="grid grid-cols-2 gap-4 lg:flex lg:space-x-12 mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              // name="tripType"
              className="form-radio"
              value="oneway"
              checked={tripType === "oneWay"}
              onChange={() => handleTripChange("oneWay")}
            />
            <span className="text-black">Một chiều</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              // name="tripType"
              className="form-radio"
              checked={tripType === "roundTrip"}
              onChange={() => handleTripChange("roundTrip")}
            />
            <span className="text-black">Khứ hồi</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={cheapest === "1"}
              onChange={handleCheckboxCheapest}
            />
            <span className="text-black">Tìm vé rẻ</span>
          </label>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap lg:space-x-1 xl:space-x-2 space-y-2 lg:space-y-0">
          <div className="w-full lg:w-[40%] flex flex-wrap md:flex-nowrap space-y-2 md:space-y-0 md:space-x-2 relative">
            <AirportSelector
              handleLocationPlaceChange={handleLocationPlaceChange}
              handleLocationChange={handleLocationChange}
              initialFrom={formData.from}
              initialTo={formData.to}
              initialFromPlace={formData.fromPlace}
              initialToPlace={formData.toPlace}
              airportsData={airportsData}
            />
          </div>
          <div
            className={`w-full ${
              tripType === "roundTrip" ? "lg:w-[13.75%]" : "lg:w-[22.5%]"
            }`}
          >
            <label className="block text-gray-700 mb-1">Ngày đi</label>
            <div className="flex justify-between h-12 space-x-2 items-center border rounded-lg px-2 text-black">
              <div className="flex items-center	w-full">
                <Image
                  src="/icon/calendar.svg"
                  alt="Icon"
                  className="h-10"
                  width={18}
                  height={18}
                ></Image>
                <div className="w-full [&>div]:w-full border-none">
                  <DatePicker
                    id="start_date"
                    ref={departDateRef}
                    selected={formData.departureDate}
                    onChange={handleDepartDateChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn ngày"
                    locale={vi}
                    popperPlacement="bottom-start"
                    portalId="datepicker-portal"
                    minDate={today}
                    onFocus={(e) => e.target.blur()}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    className="z-20 text-sm pl-4 w-full pt-6 pb-2 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          {tripType === "roundTrip" && (
            <div className="w-full lg:w-[13.75%]">
              <label className="block text-gray-700 mb-1">Ngày về</label>
              <div className="flex justify-between h-12 space-x-2 items-center border rounded-lg px-2 text-black">
                <div className="flex items-center	w-full">
                  <Image
                    src="/icon/calendar.svg"
                    alt="Icon"
                    className="h-10"
                    width={18}
                    height={18}
                  ></Image>
                  <div className="w-full [&>div]:w-full border-none">
                    <DatePicker
                      ref={returnDateRef}
                      id="return_date"
                      selected={formData.returnDate}
                      onChange={handleReturnDateChange}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày"
                      locale={vi}
                      popperPlacement="bottom-start"
                      portalId="datepicker-portal"
                      minDate={today}
                      onFocus={(e) => e.target.blur()}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      className="z-20 text-sm pl-4 w-full pt-6 pb-2 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div
            className={`w-full ${
              tripType === "roundTrip" ? "lg:w-[15%]" : "lg:w-[20%]"
            }`}
          >
            <label className="block text-gray-700 mb-1">Số lượng khách</label>
            <div className="flex items-center border rounded-lg px-2 h-12">
              <Image
                src="/icon/user-circle.svg"
                alt="Icon"
                className="h-10"
                width={18}
                height={18}
              ></Image>
              <SelectMenu
                formData={formData}
                totalGuests={totalGuests}
                onGuestsChange={handleGuestChange}
              />
            </div>
          </div>

          <div className="w-full lg:w-[15%]" onClick={handleSearch}>
            <label className="block text-gray-700 mb-1 h-6"></label>
            <div className="text-center cursor-pointer w-full items-center border rounded-lg px-2 h-12 bg-orange-500 hover:bg-orange-600">
              <Image
                src="/icon/search.svg"
                alt="Icon"
                className="h-10 inline-block"
                width={18}
                height={18}
                style={{ width: 18, height: 18 }}
              />
              <button className="ml-2 inline-block h-12 text-white rounded-lg focus:outline-none">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
