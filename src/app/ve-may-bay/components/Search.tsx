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
import { FormData, SearchFilghtProps, MultiCitySegment } from "@/types/flight";
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

  // Multi-city state: default 2 segments
  const [multiCitySegments, setMultiCitySegments] = useState<MultiCitySegment[]>([
    {
      from: null,
      to: null,
      fromPlace: null,
      toPlace: null,
      departureDate: null,
    },
    {
      from: null,
      to: null,
      fromPlace: null,
      toPlace: null,
      departureDate: null,
    },
  ]);
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

  const handleTripChange = (type: "oneWay" | "roundTrip" | "multiCity") => {
    setTripType(type);
    if (type === "roundTrip") {
      if (formData.from && formData.to) {
        setTimeout(() => {
          handleFocusNextDate(returnDateRef);
        }, 300);
      }
    } else if (type === "oneWay") {
      formData.returnDate = null;
    } else if (type === "multiCity") {
      // Reset to 2 segments when switching to multi-city
      setMultiCitySegments([
        {
          from: null,
          to: null,
          fromPlace: null,
          toPlace: null,
          departureDate: null,
        },
        {
          from: null,
          to: null,
          fromPlace: null,
          toPlace: null,
          departureDate: null,
        },
      ]);
    }
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

  // Multi-city handlers
  const handleAddSegment = () => {
    if (multiCitySegments.length < 5) {
      setMultiCitySegments([
        ...multiCitySegments,
        {
          from: null,
          to: null,
          fromPlace: null,
          toPlace: null,
          departureDate: null,
        },
      ]);
    }
  };

  const handleRemoveSegment = (index: number) => {
    if (multiCitySegments.length > 2) {
      const newSegments = multiCitySegments.filter((_, i) => i !== index);
      setMultiCitySegments(newSegments);
    }
  };

  const handleMultiCityLocationChange = (
    index: number,
    locations: { from: string | null; to: string | null }
  ) => {
    const newSegments = [...multiCitySegments];
    newSegments[index] = {
      ...newSegments[index],
      ...locations,
    };
    setMultiCitySegments(newSegments);
  };

  const handleMultiCityLocationPlaceChange = (
    index: number,
    locations: { fromPlace: string | null; toPlace: string | null }
  ) => {
    const newSegments = [...multiCitySegments];
    newSegments[index] = {
      ...newSegments[index],
      ...locations,
    };
    setMultiCitySegments(newSegments);
  };

  const handleMultiCityDateChange = (index: number, date: Date | null) => {
    const newSegments = [...multiCitySegments];
    newSegments[index] = {
      ...newSegments[index],
      departureDate: date,
    };
    setMultiCitySegments(newSegments);
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

    // Multi-city validation
    if (tripType === "multiCity") {
      const allSegmentsValid = multiCitySegments.every(
        (segment) =>
          segment.from &&
          segment.to &&
          segment.departureDate &&
          segment.fromPlace &&
          segment.toPlace
      );

      if (!allSegmentsValid || !totalPassengers) {
        toast.dismiss();
        toast.error("Vui lòng chọn đầy đủ thông tin cho tất cả các chặng");
        return;
      }

      // Build multi-city query string
      const segmentsQuery = multiCitySegments
        .map((segment, index) => {
          const formattedDate = segment.departureDate
            ? format(segment.departureDate, "ddMMyyyy")
            : "";
          return `segment${index + 1}_from=${segment.from}&segment${index + 1}_to=${segment.to}&segment${index + 1}_date=${formattedDate}&segment${index + 1}_fromPlace=${segment.fromPlace}&segment${index + 1}_toPlace=${segment.toPlace}`;
        })
        .join("&");

      const queryString = `tripType=MC&cheapest=${cheapest}&${segmentsQuery}&Adt=${Adt}&Chd=${Chd}&Inf=${Inf}`;

      if (cheapest === "1") {
        router.push(`/ve-may-bay/ve-may-bay-gia-re?${queryString}`);
      } else {
        router.push(`/ve-may-bay/tim-kiem-ve?${queryString}`);
      }
      return;
    }

    // Original validation for one-way and round-trip
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
      <div
        id="wrapper-search-ticket-flight"
        className={`transition-all duration-500 ease-in-out ${tripType === "multiCity"
          ? "bg-white rounded-xl shadow-lg p-6"
          : ""
          }`}
      >
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
              type="radio"
              className="form-radio w-4 h-4"
              checked={tripType === "multiCity"}
              onChange={() => handleTripChange("multiCity")}
            />
            <span className="text-black">Nhiều chặng</span>
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


        {/* Standard One-Way / Round-Trip Form */}
        {tripType !== "multiCity" && (
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
                  {t("tim_kiem")}
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Multi-City Form */}
        {tripType === "multiCity" && (
          <div className="space-y-6 animate-slideDown">
            {multiCitySegments.map((segment, index) => (
              <div
                key={index}
                className="relative animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Segment Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold shadow-md">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Chặng {index + 1}
                    </h3>
                  </div>

                  {/* Remove button - only show if more than 2 segments */}
                  {multiCitySegments.length > 2 && (
                    <button
                      onClick={() => handleRemoveSegment(index)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="font-medium">Xóa chặng</span>
                    </button>
                  )}
                </div>

                {/* Segment Form */}
                <div className="flex flex-wrap lg:flex-nowrap lg:space-x-3 space-y-3 lg:space-y-0 datepicker-search-flight bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="w-full lg:w-[55%] flex flex-wrap md:flex-nowrap space-y-2 md:space-y-0 md:space-x-2 relative">
                    <AirportSelector
                      handleLocationPlaceChange={(locations) =>
                        handleMultiCityLocationPlaceChange(index, locations)
                      }
                      handleLocationChange={(locations) =>
                        handleMultiCityLocationChange(index, locations)
                      }
                      initialFrom={segment.from}
                      initialTo={segment.to}
                      initialFromPlace={segment.fromPlace}
                      initialToPlace={segment.toPlace}
                      airportsData={translatedAirportsData}
                    />
                  </div>

                  <div className="w-full lg:w-[45%]">
                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                      📅 Ngày khởi hành
                    </label>
                    <div className="flex justify-between h-12 space-x-2 items-center border border-gray-300 bg-white rounded-lg px-3 text-black hover:border-orange-400 transition-colors duration-200">
                      <div className="flex items-center w-full">
                        <Image
                          src="/icon/calendar.svg"
                          alt="Icon"
                          className="h-5 w-5 opacity-60"
                          width={20}
                          height={20}
                        />
                        <div className="w-full [&>div]:w-full border-none">
                          <DatePicker
                            selected={segment.departureDate}
                            onChange={(date) =>
                              handleMultiCityDateChange(index, date)
                            }
                            dateFormat="dd/MM/yyyy"
                            placeholderText={t("chon_ngay")}
                            locale={language === "vi" ? vi : enUS}
                            popperPlacement="bottom-start"
                            portalId="datepicker-search-flight"
                            minDate={
                              (index > 0 && multiCitySegments[index - 1].departureDate) || today
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
                </div>
              </div>
            ))}

            {/* Add segment button */}
            {multiCitySegments.length < 5 && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleAddSegment}
                  className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl flex items-center space-x-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-semibold">Thêm chặng bay</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {multiCitySegments.length}/5
                  </span>
                </button>
              </div>
            )}

            {/* Passenger and Search section */}
            <div className="flex flex-wrap lg:flex-nowrap lg:space-x-4 space-y-3 lg:space-y-0 pt-6 border-t border-gray-200 mt-6">
              <div className="w-full lg:w-[35%]">
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  👥 Số lượng hành khách
                </label>
                <div className="flex items-center border border-gray-300 bg-white rounded-lg px-3 h-12 hover:border-orange-400 transition-colors duration-200">
                  <Image
                    src="/icon/user-circle.svg"
                    alt="Icon"
                    className="h-5 w-5 opacity-60"
                    width={20}
                    height={20}
                  />
                  <SelectMenu
                    formData={formData}
                    totalGuests={totalGuests}
                    onGuestsChange={handleGuestChange}
                  />
                </div>
              </div>

              <div className="w-full lg:w-[25%] lg:flex lg:items-end">
                <button
                  onClick={handleSearch}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>{t("tim_kiem")}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
}
