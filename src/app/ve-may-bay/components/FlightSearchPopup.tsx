"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import SelectMenu from "./Passenger/Menu";
import DatePicker from "react-datepicker";
import { AirportOption, FormData } from "@/types/flight";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datePicker.scss";
import { vi } from "date-fns/locale";
import Select, { SingleValue } from "react-select";

interface FlightSearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  airports: {
    label: string;
    value: string;
  }[];
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

export default function FlightSearchPopup({
  isOpen,
  onClose,
  airports,
  selectedDate,
  onDateChange,
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
  const [from, setFrom] = useState<SingleValue<AirportOption> | null>(null);
  const [to, setTo] = useState<SingleValue<AirportOption> | null>(null);
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

  const handleSwitch = () => {
    setFrom((prevFrom) => {
      setTo(prevFrom);
      return to;
    });
  };

  const handleFocusNextDate = (nextRef: React.RefObject<DatePicker | null>) => {
    if (nextRef.current) {
      nextRef.current.setFocus();
    }
  };

  const handleDepartDateChange = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      departureDate: date,
    }));
  };

  useEffect(() => {
    setTotalGuests(formData.Adt + formData.Chd + formData.Inf);
    if (
      formData.from &&
      formData.to &&
      tripType === "roundTrip" &&
      !formData.returnDate
    ) {
    }
  }, [formData, tripType]);

  useEffect(() => {
    handleLocationChange({
      from: from?.value || null,
      to: to?.value || null,
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
    const fromParam = searchParams.get("StartPoint");
    const toParam = searchParams.get("EndPoint");

    const fromOption = airports.find((loc) => loc.value === fromParam) || null;
    const toOption = airports.find((loc) => loc.value === toParam) || null;
    setFrom(fromOption);
    setTo(toOption);
  }, [searchParams, airports]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      departureDate: selectedDate,
    }));
  }, [selectedDate]);

  const handleSearch = () => {
    const totalPassengers = formData.Adt + formData.Chd + formData.Inf;
    const { from, to, departureDate, Adt, Chd, Inf } = formData;
    if (from && to && departureDate && totalPassengers) {
      const formattedDate = departureDate
        ? format(departureDate, "ddMMyyyy")
        : "";
      router.push(
        `/ve-may-bay/tim-kiem-ve?StartPoint=${from}&EndPoint=${to}&DepartDate=${formattedDate}&Adt=${Adt}&Chd=${Chd}&Inf=${Inf}`
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
                <div className="w-full cursor-pointer">
                  <Select
                    options={airports}
                    value={from}
                    onChange={setFrom}
                    placeholder={"Chọn điểm đi"}
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
                    onFocus={(e) => e.target.blur()}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    menuPlacement="auto"
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
                <div className="w-full">
                  <div className="w-full cursor-pointer">
                    <Select
                      options={airports}
                      value={to}
                      onChange={setTo}
                      placeholder={"Chọn điểm đến"}
                      onFocus={(e) => e.target.blur()}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
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
                      menuPlacement="auto"
                    />
                  </div>
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
                <div className="w-full [&>div]:w-full border-none">
                  <DatePicker
                    id="start_date"
                    selected={selectedDate}
                    onChange={onDateChange}
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
