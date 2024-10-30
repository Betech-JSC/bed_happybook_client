"use client";
import Image from "next/image";
import { forwardRef, Fragment, useEffect, useRef, useState } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { useSearchParams } from "next/navigation";
import { highlightText, NoOptionsMessage } from "@/utils/jsxUtils";

interface AirportOption {
  label: string;
  value: string;
}
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
}
const airports: AirportOption[] = [
  {
    label: "Hồ Chí Minh",
    value: "SGN",
  },
  {
    label: "Hà Nội",
    value: "HAN",
  },
  {
    label: "Nha Trang",
    value: "CXR",
  },
];

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
    width: window.innerWidth < 640 ? "260px" : "500px",
    cursor: "pointer",
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
    />
  )
);
LocationSelect.displayName = "LocationSelect";

export default function LocationSwitcher({
  onLocationChange,
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
  }, [searchParams]);

  const getFilteredOptions = (
    selected: SingleValue<AirportOption>
  ): AirportOption[] => {
    return airports.filter((airport) => airport.value !== selected?.value);
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
