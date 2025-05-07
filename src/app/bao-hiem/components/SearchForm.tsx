"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, isValid } from "date-fns";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { datePickerLocale } from "@/constants/language";

interface SearchForm {
  productId: number | null;
  departureDate: Date | null;
  returnDate: Date | null;
}
export default function SearchFormInsurance() {
  const today = new Date();
  const { language } = useLanguage();
  const departDateRef = useRef<DatePicker | null>(null);
  const returnDateRef = useRef<DatePicker | null>(null);
  const handleFocusNextDate = (nextRef: React.RefObject<DatePicker | null>) => {
    if (nextRef.current) {
      nextRef.current.setFocus();
    }
  };
  const [formData, setFormData] = useState<SearchForm>({
    productId: null,
    departureDate: null,
    returnDate: null,
  });
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

  useEffect(() => {
    if (datePickerLocale[language]) {
      registerLocale(language, datePickerLocale[language]);
    }
  }, [language]);

  return (
    <div className="flex lg:space-x-1 xl:space-x-2">
      <div className="w-[42.5%]">
        <label className="block text-gray-700 mb-1" data-translate="true">
          Bảo hiểm
        </label>
        <div className="flex h-12 items-center border rounded-lg px-2">
          <Image
            src="/icon/umbrella-blue.svg"
            alt="Icon"
            width={18}
            height={18}
          ></Image>
          <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
            <option data-translate="true">Gói ABCD</option>
          </select>
        </div>
      </div>

      <div className="w-[42.5%]">
        <label className="block text-gray-700 mb-1" data-translate="true">
          Ngày đi - ngày về
        </label>
        <div className="flex justify-between h-12 items-center border rounded-lg px-2 text-black">
          <div className="w-1/4 flex justify-between items-center	">
            <Image
              src="/icon/calendar.svg"
              alt="Phone icon"
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
                placeholderText="Ngày đi"
                popperPlacement="bottom-start"
                minDate={today}
                locale={language}
                onFocus={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                className="z-20 pl-3 w-full outline-none"
              />
            </div>
          </div>
          <div className="w-1/2">
            <Image
              src="/icon/line.png"
              alt="Icon"
              className="h-[1px] max-w-[280px]"
              width={280}
              height={1}
            ></Image>
          </div>
          <div className="w-1/4 [&>div]:w-full border-none">
            <DatePicker
              id="start_date"
              ref={returnDateRef}
              selected={formData.returnDate}
              onChange={handleReturnDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Ngày về"
              popperPlacement="bottom-start"
              locale={language}
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
              className="z-20 pl-3 w-full outline-none"
            />
          </div>
        </div>
      </div>

      <div className="w-[15%]">
        <label className="block text-gray-700 mb-1 h-6"></label>
        <div className="text-center cursor-pointer w-full items-center border rounded-lg px-2 h-12 bg-orange-500 hover:bg-orange-600  ">
          <Image
            src="/icon/search.svg"
            alt="Phone icon"
            className="h-10 inline-block"
            width={18}
            height={18}
            style={{ width: 18, height: 18 }}
          ></Image>
          <button
            className="ml-2 inline-block h-12 text-white rounded-lg focus:outline-none"
            data-translate="true"
          >
            Tra cứu
          </button>
        </div>
      </div>
    </div>
  );
}
