"use client";
import Image from "next/image";
import { forwardRef, Fragment, useEffect, useRef, useState } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { useSearchParams } from "next/navigation";
import { NoOptionsMessage } from "@/utils/jsxUtils";
import { AirportOption } from "@/types/flight";

interface LocationSelectProps {
  options: AirportOption[];
  placeholder: string;
  value: SingleValue<AirportOption>;
  onSelect: (option: SingleValue<AirportOption>) => void;
}
interface LocationSwitcherProps {
  onLocationChange: (locations: {
    from: string | null;
    to: string | null;
  }) => void;
  airports: AirportOption[];
}

const customStyles: StylesConfig<AirportOption, false> = {
  control: (provided) => ({
    ...provided,
    border: "none",
    padding: "0.5rem",
    boxShadow: "none",
    background: "none",
    cursor: "pointer",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: window.innerWidth < 640 ? "260px" : "360px",
    cursor: "pointer",
    maxHeight: "600px",
    overflow: "auto",
  }),
  option: (provided, state) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    padding: "6px 12px",
    cursor: "pointer",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: () => ({
    display: "none",
  }),
};

const highlightText = (text: string, highlight: string) => {
  const sanitizedHighlight = highlight.trim();
  if (!sanitizedHighlight) return text;

  const parts = text.split(new RegExp(`(${sanitizedHighlight})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === sanitizedHighlight.toLowerCase() ? (
      <span key={index} className="text-blue-500 font-semibold">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const CustomOption = (props: any) => {
  const { data, innerRef, innerProps, selectProps } = props;
  const inputValue = selectProps.inputValue;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex items-center space-x-3 py-2 px-4 hover:bg-blue-100"
    >
      <Image
        src="/icon/AirplaneTilt-2.svg"
        alt="Icon"
        className="h-4 block"
        width={18}
        height={18}
      ></Image>
      <div>
        <div className="font-semibold">
          {highlightText(data.label, inputValue)}{" "}
          <span className="text-gray-500">({data.value})</span>
        </div>
      </div>
    </div>
  );
};

const LocationSelect = forwardRef<any, LocationSelectProps>(
  ({ options, placeholder, value, onSelect }, ref) => (
    <Fragment>
      <style>
        {`
      .custom-select__menu-list {
        scrollbar-width: thin;
        scrollbar-color: rgb(96 165 250) #f1f1f1;
      }
      .custom-select__menu-list::-webkit-scrollbar {
        width: 6px;
      }
      .custom-select__menu-list::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      .custom-select__menu-list::-webkit-scrollbar-thumb {
        background-color: #1570EF;
        border-radius: 12px;
        border: 2px solid #f1f1f1;
      }
      .custom-select__menu-list::-webkit-scrollbar-thumb:hover {
        background: #1570EF;
      }
    `}
      </style>
      <Select
        options={options}
        value={value}
        onChange={onSelect}
        placeholder={placeholder}
        styles={customStyles}
        isClearable
        ref={ref}
        components={{ Option: CustomOption, NoOptionsMessage }}
        menuPlacement="auto"
        classNamePrefix="custom-select"
      />
    </Fragment>
  )
);
LocationSelect.displayName = "LocationSelect";

export default function LocationSwitcher({
  onLocationChange,
  airports,
}: LocationSwitcherProps) {
  const searchParams = useSearchParams();
  const [from, setFrom] = useState<SingleValue<AirportOption> | null>(null);
  const [to, setTo] = useState<SingleValue<AirportOption> | null>(null);
  const fromRef = useRef<any>(null);
  const toRef = useRef<any>(null);
  useEffect(() => {
    onLocationChange({
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
  }, [from, to, onLocationChange]);

  const handleSwitch = () => {
    setFrom((prevFrom) => {
      setTo(prevFrom);
      return to;
    });
  };

  useEffect(() => {
    const fromParam = searchParams.get("StartPoint");
    const toParam = searchParams.get("EndPoint");
    const fromOption = airports.find((loc) => loc.value === fromParam) || null;
    const toOption = airports.find((loc) => loc.value === toParam) || null;
    setFrom(fromOption);
    setTo(toOption);
  }, [searchParams, airports]);

  const getFilteredOptions = (
    selected: SingleValue<AirportOption>
  ): AirportOption[] => {
    return airports.filter((airport) => {
      if (selected?.type === "international") {
        return airport.value !== selected?.value && airport.type === "domestic";
      }
      return airport.value !== selected?.value;
    });
  };

  return (
    <Fragment>
      <div className="w-full md:w-1/2">
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
            <LocationSelect
              options={getFilteredOptions(to)}
              placeholder="Chọn điểm đi"
              value={from}
              onSelect={setFrom}
              ref={fromRef}
            />
          </div>
        </div>
      </div>
      <div className="absolute right-0 md:right-[unset] top-[60%] md:top-3/4 md:left-[48%] md:-translate-x-[48%] -translate-y-3/4">
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
      <div className="w-full md:w-1/2">
        <label className="block text-gray-700 mb-1">Đến</label>
        <div className="flex h-12 items-center border rounded-lg px-2 md:pl-6">
          <Image
            src="/icon/AirplaneLanding.svg"
            alt="Icon"
            className="h-10"
            width={18}
            height={18}
          />
          <div className="w-full">
            <LocationSelect
              options={getFilteredOptions(from)}
              placeholder="Chọn điểm đến"
              value={to}
              onSelect={setTo}
              ref={toRef}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
