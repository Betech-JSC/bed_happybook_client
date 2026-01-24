"use client";

import { useState, useRef, useEffect } from "react";
import { allCountries } from "country-telephone-data";

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const countries: Country[] = allCountries.map((c) => ({
  code: c.iso2.toUpperCase(),
  name: c.name,
  dialCode: `+${c.dialCode}`,
  flag: getFlagEmoji(c.iso2),
}));

function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
  defaultCountry?: string;
  placeholder?: string;
  id?: string;
  showLabel?: boolean;
}

export default function PhoneInput({
  value = "",
  onChange,
  error,
  label = "Số điện thoại",
  required = false,
  defaultCountry = "VN",
  placeholder = "Nhập số điện thoại",
  id,
  showLabel = true,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find((c) => c.code === defaultCountry) || countries[0]
  );
  const [phone, setPhone] = useState("");
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value) {
      if (phone) setPhone("");
      return;
    }
    const match = countries
      .sort((a, b) => b.dialCode.length - a.dialCode.length)
      .find((c) => value.startsWith(c.dialCode));

    if (match) {
      if (match.code !== selectedCountry.code) {
        setSelectedCountry(match);
      }
      const newPhone = value.replace(match.dialCode, "");
      if (newPhone !== phone) {
        setPhone(newPhone);
      }
    } else {
      if (value !== phone) {
        setPhone(value);
      }
    }
  }, [value]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setPhone(val);
    onChange?.(`${selectedCountry.dialCode}${val}`);
  };

  const handleCountrySelect = (c: Country) => {
    setSelectedCountry(c);
    setOpen(false);
    setSearchQuery("");
    onChange?.(`${c.dialCode}${phone}`);
  };

  // Filter countries based on search
  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative">
      {/* Label */}
      {showLabel && <label
        htmlFor={id}
        className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs z-10"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>}

      {/* Input wrapper */}
      <div className="relative flex items-center">
        {/* Flag dropdown */}
        <div ref={dropdownRef} className={`absolute left-4 ${showLabel ? 'top-[40%]' : 'top-1/2 -translate-y-1/2'}`}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-sm"
          >
            <span className="text-base">{selectedCountry.flag}</span>
            <span className="text-xs">{selectedCountry.dialCode}</span>
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.5 7.5L10 12l4.5-4.5" />
            </svg>
          </button>

          {open && (
            <div className="absolute z-50 mt-2 w-72 max-h-80 overflow-hidden rounded-md border bg-white shadow-lg">
              {/* Search input */}
              <div className="p-2 border-b border-gray-200">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm quốc gia..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {/* Countries list */}
              <div className="max-h-64 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleCountrySelect(c)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${selectedCountry.code === c.code
                        ? "bg-primary/10 font-medium"
                        : ""
                        }`}
                    >
                      <span className="text-base flex-shrink-0">{c.flag}</span>
                      <span className="flex-1 text-left truncate">{c.name}</span>
                      <span className="text-gray-600 flex-shrink-0">{c.dialCode}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-sm text-gray-500 text-center">
                    Không tìm thấy quốc gia
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Phone input */}
        <input
          id={id}
          type="text"
          value={phone}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          className={`text-sm w-full border border-gray-300 rounded-md pl-24 pr-3 placeholder-gray-400 focus:outline-none focus:border-primary ${showLabel ? 'pt-6 pb-2' : 'py-3'}`}
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
