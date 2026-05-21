"use client";

import {
  Controller,
  type Control,
  type FieldErrors,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import DatePicker from "react-datepicker";
import { FLIGHT_NATIONALITIES } from "@/constants/countries";
import type { FlightBookingInforType } from "@/schemaValidations/flightBookingInfor.schema";

interface InternationalPassportFieldsProps {
  segment: "atd" | "chd";
  index: number;
  register: UseFormRegister<FlightBookingInforType>;
  control: Control<FlightBookingInforType>;
  errors: FieldErrors<FlightBookingInforType>;
  language: string;
}

export default function InternationalPassportFields({
  segment,
  index,
  register,
  control,
  errors,
  language,
}: InternationalPassportFieldsProps) {
  const base = `${segment}.${index}`;
  const passportName = `${base}.passport` as Path<FlightBookingInforType>;
  const nationalityName = `${base}.nationality` as Path<FlightBookingInforType>;
  const expiryName =
    `${base}.passport_expiry_date` as Path<FlightBookingInforType>;

  const fieldErrors =
    segment === "atd" ? errors.atd?.[index] : errors.chd?.[index];

  return (
    <>
      <div className="relative">
        <label
          htmlFor={passportName}
          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
        >
          <span data-translate="true">Số hộ chiếu</span>
          <span className="text-red-500">*</span>
        </label>
        <input
          id={passportName}
          type="text"
          {...register(passportName)}
          placeholder="Nhập số hộ chiếu"
          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
        />
        {fieldErrors?.passport && (
          <p className="text-red-600">{fieldErrors.passport.message}</p>
        )}
      </div>
      <div className="relative">
        <label
          htmlFor={nationalityName}
          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
        >
          <span data-translate="true">Quốc tịch</span>
          <span className="text-red-500">*</span>
        </label>
        <select
          id={nationalityName}
          {...register(nationalityName)}
          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 focus:outline-none focus:border-primary indent-3.5"
          defaultValue=""
        >
          <option value="" disabled>
            Chọn quốc tịch
          </option>
          {FLIGHT_NATIONALITIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
        {fieldErrors?.nationality && (
          <p className="text-red-600">{fieldErrors.nationality.message}</p>
        )}
      </div>
      <div className="relative">
        <label
          htmlFor={expiryName}
          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
        >
          <span data-translate="true">Ngày hết hạn hộ chiếu</span>
          <span className="text-red-500">*</span>
        </label>
        <div className="booking-form-birthday flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
          <Controller
            name={expiryName}
            control={control}
            render={({ field }) => (
              <DatePicker
                id={expiryName}
                selected={(field.value as Date) || null}
                onChange={(date: Date | null) => field.onChange(date)}
                placeholderText="Nhập ngày hết hạn"
                dateFormat="dd-MM-yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                locale={language}
                maxDate={
                  new Date(new Date().getFullYear() + 50, 11, 31)
                }
                minDate={
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate()
                  )
                }
                className="text-sm pl-4 w-full placeholder-gray-400 focus:outline-none focus:border-primary"
              />
            )}
          />
        </div>
        {fieldErrors?.passport_expiry_date && (
          <p className="text-red-600">
            {fieldErrors.passport_expiry_date.message}
          </p>
        )}
      </div>
    </>
  );
}
