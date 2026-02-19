"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datePicker.scss";
import { format, parse, isValid } from "date-fns";
import SelectMenu from "./Passenger/Menu";
import { toast } from "react-hot-toast";
import { Suspense } from "react";
import { FormData, SearchFilghtProps } from "@/types/flight";
import AirportSelector from "./AirportSelector";
import { translatePage } from "@/utils/translateDom";
import {
  getCurrentLanguage,
  getDefaultFormDataSearchFlights,
} from "@/utils/Helper";
import { translateText } from "@/utils/translateApi";
import { datePickerLocale } from "@/constants/language";
import { useLanguage } from "@/contexts/LanguageContext";
import { vi, enUS } from "date-fns/locale";
import { useTranslation } from "@/hooks/useTranslation";

export default function Search({
  airportsData,
  airportDefault,
}: SearchFilghtProps) {
  const { t } = useTranslation();
  const today = new Date();
  const { language } = useLanguage();
  const pathname: string = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [totalGuests, setTotalGuests] = useState<number>(1);
  const [translatedAirportsData, setTranslatedAirportsData] =
    useState(airportsData);

  const [formData, setFormData] = useState(() =>
    getDefaultFormDataSearchFlights(searchParams, airportDefault)
  );

  useEffect(() => {
    setFormData(getDefaultFormDataSearchFlights(searchParams, airportDefault));
  }, [searchParams, airportDefault]);

  useEffect(() => {
    if (pathname !== "/") {
      translatePage("#wrapper-search-ticket-flight", 50);
    }
  }, [searchParams, pathname]);
  // useEffect(() => {
  //   if (datePickerLocale[language]) {
  //     registerLocale(language, datePickerLocale[language]);
  //   }
  // }, [language]);

  useEffect(() => {
    if (airportsData.length > 0 && getCurrentLanguage() !== "vi") {
      const uniqueCountries = Array.from(
        airportsData.map((item) => item.country)
      );
      const uniqueCities = Array.from(
        airportsData.flatMap((item) =>
          item.airports.map((airport) => airport.city)
        )
      );

      const allTextsToTranslate = [...uniqueCountries, ...uniqueCities];

      translateText(allTextsToTranslate).then((translatedTexts) => {
        if (translatedTexts?.[0]?.length > 0) {
          const translatedMap = Object.fromEntries(
            allTextsToTranslate.map((text, index) => [
              text,
              translatedTexts[index],
            ])
          );
          const airportsUpadted = airportsData.map((item) => ({
            ...item,
            country: translatedMap[item.country],
            airports: item.airports.map((airport) => ({
              ...airport,
              city: translatedMap[airport.city],
            })),
          }));
          setTranslatedAirportsData(airportsUpadted);
        }
      });
    }
  }, [airportsData]);

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

    setFormData((prev: any) => {
      const shouldUpdateReturnDate =
        prev.returnDate && date && date > prev.returnDate
          ? date
          : prev.returnDate;

      return {
        ...prev,
        departureDate: date,
        returnDate: shouldUpdateReturnDate,
      };
    });
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
      <div id="wrapper-search-ticket-flight">
        <div className="grid grid-cols-6 lg:flex lg:space-x-12 gap-4 mb-4">
          <label className="col-span-2 flex items-center space-x-2">
            <input
              type="radio"
              // name="tripType"
              className="form-radio w-4 h-4"
              value="oneway"
              checked={tripType === "oneWay"}
              onChange={() => handleTripChange("oneWay")}
            />
            <span className="text-black">{t("mot_chieu")}</span>
          </label>
          <label className="col-span-2 flex items-center space-x-2">
            <input
              type="radio"
              // name="tripType"
              className="form-radio w-4 h-4"
              checked={tripType === "roundTrip"}
              onChange={() => handleTripChange("roundTrip")}
            />
            <span className="text-black">{t("khu_hoi")}</span>
          </label>
          <label className="col-span-2 flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox w-4 h-4"
              checked={cheapest === "1"}
              onChange={handleCheckboxCheapest}
            />
            <span className="text-black">{t("tim_ve_re")}</span>
          </label>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap lg:space-x-1 xl:space-x-2 space-y-2 lg:space-y-0 datepicker-search-flight">
          <div className="w-full lg:w-[40%] flex flex-wrap md:flex-nowrap space-y-2 md:space-y-0 md:space-x-2 relative">
            <AirportSelector
              handleLocationPlaceChange={handleLocationPlaceChange}
              handleLocationChange={handleLocationChange}
              initialFrom={formData.from}
              initialTo={formData.to}
              initialFromPlace={formData.fromPlace}
              initialToPlace={formData.toPlace}
              airportsData={translatedAirportsData}
            />
          </div>
          <div
            className={`w-full ${tripType === "roundTrip" ? "lg:w-[13.75%]" : "lg:w-[22.5%]"
              }`}
          >
            <label className="block text-gray-700 mb-1">{t("ngay_di")}</label>
            <div className="flex justify-between h-12 space-x-2 items-center border rounded-lg px-2 text-black">
              <div className="flex items-center	w-full">
                <Image
                  src="/icon/calendar.svg"
                  alt="Lịch"
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
                    placeholderText={t("chon_ngay")}
                    locale={language === "vi" ? vi : enUS}
                    popperPlacement="bottom-start"
                    portalId="datepicker-search-flight"
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
          <div
            className={`${tripType === "roundTrip"
              ? "visible w-full lg:w-[13.75%]"
              : "invisible hidden"
              } `}
          >
            <label className="block text-gray-700 mb-1">{t("ngay_ve")}</label>
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
                    placeholderText={t("chon_ngay")}
                    locale={language === "vi" ? vi : enUS}
                    popperPlacement="bottom-start"
                    portalId="datepicker-search-flight"
                    minDate={
                      formData.departureDate && isValid(formData.departureDate)
                        ? formData.departureDate
                        : today
                    }
                    openToDate={
                      formData.departureDate && isValid(formData.departureDate)
                        ? formData.departureDate
                        : today
                    }
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

          <div
            className={`w-full ${tripType === "roundTrip" ? "lg:w-[15%]" : "lg:w-[20%]"
              }`}
          >
            <label className="block text-gray-700 mb-1">
              {t("so_luong_khach")}
            </label>
            <div className="flex items-center border rounded-lg px-2 h-12">
              <Image
                src="/icon/user-circle.svg"
                alt="Số lượng khách"
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
            <div className="text-center cursor-pointer w-full items-center border rounded-lg px-2 h-12 bg-orange-700 hover:bg-orange-800">
              <Image
                src="/icon/search.svg"
                alt="Phím tìm kiếm"
                className="h-10 inline-block"
                width={18}
                height={18}
                style={{ width: 18, height: 18 }}
              />
              <button className="ml-2 inline-block h-12 text-white rounded-lg focus:outline-none">
                {t("tim_kiem")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
