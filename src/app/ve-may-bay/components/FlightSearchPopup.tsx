"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import SelectMenu from "./Passenger/Menu";
import DatePicker from "react-datepicker";
import {
  AirportOption,
  FlightSearchPopupProps,
  FormData,
} from "@/types/flight";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datePicker.scss";
import { vi } from "date-fns/locale";
import Select, { SingleValue } from "react-select";

export default function FlightSearchPopup({
  isOpen,
  onClose,
  airportsData,
  selectedDate,
  onDateChange,
  fromOption,
  toOption,
  flightType,
}: FlightSearchPopupProps) {
  const today = new Date();
  const tripType: string = "oneWay";
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    from: null,
    fromPlace: null,
    toPlace: null,
    to: null,
    departureDate: null,
    returnDate: null,
    Adt: 1,
    Chd: 0,
    Inf: 0,
    tripType: "oneway",
    cheapest: 0,
  });
  const router = useRouter();
  const [totalGuests, setTotalGuests] = useState<number>(1);
  const [from, setFrom] = useState<AirportOption | undefined>(fromOption);
  const [to, setTo] = useState<AirportOption | undefined>(toOption);
  const [fromPlace, setFromPlace] = useState<string | null>("");
  const [toPlace, setToPlace] = useState<string | null>("");
  const fromRef = useRef<any>(null);
  const toRef = useRef<any>(null);

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

  const handleSwitch = () => {
    setFrom((prevFrom) => {
      setTo(prevFrom);
      return to;
    });

    setFromPlace((prevFromPlace) => {
      setToPlace(prevFromPlace);
      return toPlace;
    });
  };

  useEffect(() => {
    setTotalGuests(formData.Adt + formData.Chd + formData.Inf);
  }, [formData, tripType]);

  useEffect(() => {
    handleLocationChange({
      from: from?.code || null,
      to: to?.code || null,
    });
    if (from || to) {
      if (!from) {
        fromRef.current?.focus();
        fromRef.current?.openMenu();
      }
      if (!to) {
        toRef.current?.focus();
        toRef.current?.openMenu();
      }
    }
  }, [from, to, handleLocationChange]);

  useEffect(() => {
    handleLocationPlaceChange({
      fromPlace: from?.city || null,
      toPlace: to?.city || null,
    });
  }, [from, to, handleLocationPlaceChange]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      departureDate: selectedDate,
    }));
  }, [selectedDate]);

  const handleSearch = () => {
    const totalPassengers = formData.Adt + formData.Chd + formData.Inf;
    const { from, to, fromPlace, toPlace, departureDate, Adt, Chd, Inf } =
      formData;
    if (from && to && departureDate && totalPassengers) {
      const formattedDate = departureDate
        ? format(departureDate, "ddMMyyyy")
        : "";
      router.push(
        `/ve-may-bay/tim-kiem-ve?tripType=oneWay&StartPoint=${from}&EndPoint=${to}&DepartDate=${formattedDate}&Adt=${Adt}&Chd=${Chd}&Inf=${Inf}&from=${fromPlace}&to=${toPlace}`
      );
    } else {
      toast.dismiss();
      toast.error("Vui lòng chọn đầy đủ thông tin");
    }
  };
  return (
    <div
      className={`fixed transition-opacity visible duration-300 px-3 md:px-0 inset-0  bg-black bg-opacity-50 flex justify-center items-center ${
        isOpen ? "visible z-[9999]" : "invisible z-[-1]"
      }`}
      style={{
        opacity: isOpen ? "100" : "0",
      }}
    >
      <div className="bg-white h-max p-6 md:w-[526px] rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tìm Vé Máy Bay</h2>
          <button className="text-xl" onClick={onClose}>
            <Image
              src="/icon/close.svg"
              alt="Icon"
              className="h-10"
              width={20}
              height={20}
            />
          </button>
        </div>
        <div className="flex flex-wrap space-y-2">
          <div className="w-full flex flex-wrap space-y-2 relative">
            <div className="w-full relative">
              <label className="block text-gray-700 mb-1">Từ</label>
              <div className="flex h-12 items-center border rounded-lg px-2">
                <Image
                  src="/icon/AirplaneTakeoff.svg"
                  alt="Icon"
                  className="h-10"
                  width={18}
                  height={18}
                />
                <div className="w-full ml-3 overflow-x-hidden">
                  <input
                    className="w-full"
                    type="text"
                    value={from?.city}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-[60%] md:top-[55%] -translate-y-3/4 md:-translate-y-1/2">
              <button className="border border-gray-300 p-2 rounded-full bg-white">
                <Image
                  src="/icon/switch-horizontal.svg"
                  alt="Icon"
                  className="h-5"
                  width={20}
                  height={20}
                  onClick={handleSwitch}
                ></Image>
              </button>
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
                <div className="w-full ml-3 overflow-x-hidden">
                  <input
                    type="text"
                    className="w-full"
                    value={to?.city}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <label className="block text-gray-700 mb-1">Ngày đi</label>
            <div className="flex justify-between mt-2 h-12 space-x-2 items-center border rounded-lg px-2 text-black">
              <div className="flex items-center	w-full">
                <Image
                  src="/icon/calendar.svg"
                  alt="Icon"
                  className="h-10"
                  width={18}
                  height={18}
                ></Image>
                <div className="w-full [&>div]:w-full border-none datepicker-search-flight">
                  <DatePicker
                    id="start_date"
                    selected={selectedDate}
                    onChange={onDateChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn ngày"
                    locale={vi}
                    popperPlacement="bottom-start"
                    portalId="datepicker-search-flight-popup"
                    minDate={today}
                    onFocus={(e) => e.target.blur()}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    calendarClassName="custom-calendar-datepicker"
                    className="z-20 text-sm pl-4 w-full pt-6 pb-2 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`w-full`}>
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

          <div className="w-full" onClick={handleSearch}>
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
    </div>
  );
}
