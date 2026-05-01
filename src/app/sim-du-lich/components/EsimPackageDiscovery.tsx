"use client";

import { useMemo, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Select, { components, type SingleValue } from "react-select";
import { allCountries } from "country-telephone-data";
import { ChevronDown, Globe, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  formatEsimMoney,
  findCheapestVariant,
  getEsimVariantMoney,
  type EsimFilterOption,
  type EsimPackageView,
} from "../lib/esim";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";

type DestinationSelectOption = EsimFilterOption & {
  flag: string;
};

type PackageSelectOption = {
  value: string;
  label: string;
  validity: number;
  data: string;
  destination: string;
  network: string;
  flag: string;
};

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  packageQuery?: string;
  onPackageQueryChange?: (value: string) => void;
  loading: boolean;
  error: string;
  packages: EsimPackageView[];
  activeLocale: "vi" | "en";
  selectedPackageSlug: string;
  onSelectPackage: (pkg: EsimPackageView) => void;
  showInternationalFilters?: boolean;
  destinationOptions?: EsimFilterOption[];
  selectedDestinationLabels?: string[];
  onToggleDestinationLabel?: (label: string) => void;
  onSelectDestinationLabel?: (label: string | null) => void;
  onSelectPackageFilterSku?: (sku: string | null) => void;
  priceRange?: [number, number];
  priceBounds?: { min: number; max: number };
  onPriceRangeChange?: (range: [number, number]) => void;
};

const normalizeText = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getFlagEmoji = (countryCode: string) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const resolveDestinationFlag = (option: EsimFilterOption) => {
  const normalizedLabel = normalizeText(option.label);
  const normalizedValue = normalizeText(option.value);

  const matchedCountry = allCountries.find((country) => {
    const normalizedCountryName = normalizeText(country.name);
    return (
      normalizedCountryName === normalizedLabel ||
      normalizedCountryName === normalizedValue ||
      normalizedCountryName.includes(normalizedLabel) ||
      normalizedCountryName.includes(normalizedValue) ||
      normalizedLabel.includes(normalizedCountryName) ||
      normalizedValue.includes(normalizedCountryName)
    );
  });

  return matchedCountry ? getFlagEmoji(matchedCountry.iso2) : "🌐";
};

export default function EsimPackageDiscovery({
  query,
  onQueryChange,
  packageQuery = "",
  loading,
  error,
  packages,
  activeLocale,
  selectedPackageSlug,
  onSelectPackage,
  showInternationalFilters = false,
  destinationOptions = [],
  selectedDestinationLabels = [],
  onToggleDestinationLabel,
  onSelectDestinationLabel,
  onSelectPackageFilterSku,
  onPackageQueryChange,
  priceRange = [0, 0],
  priceBounds = { min: 0, max: 0 },
  onPriceRangeChange,
}: Props) {
  const { language } = useLanguage();
  const t = useSimDuLichStaticText(language === "en" ? "en" : "vi");
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const visibleDestinations = showAllDestinations ? destinationOptions : destinationOptions.slice(0, 5);
  const destinationSelectOptions = useMemo<DestinationSelectOption[]>(
    () =>
      destinationOptions.map((option) => ({
        ...option,
        flag: resolveDestinationFlag(option),
      })),
    [destinationOptions]
  );
  const selectedDestinationOption =
    destinationSelectOptions.find((option) => selectedDestinationLabels.includes(option.label)) || null;
  const packageSelectOptions = useMemo<PackageSelectOption[]>(() => {
    const seen = new Set<string>();
    const nextOptions: PackageSelectOption[] = [];

    packages.forEach((pkg) => {
      pkg.variants.forEach((variant) => {
        if (!variant.sku || seen.has(variant.sku)) return;
        seen.add(variant.sku);
        nextOptions.push({
          value: variant.sku,
          label: `${variant.validity ? `${variant.validity} ngày` : "Gói"} · ${variant.data || "Không rõ"}`,
          validity: variant.validity,
          data: variant.data,
          destination: pkg.destination,
          network: pkg.network,
          flag: resolveDestinationFlag({ label: pkg.destination, value: pkg.destination }),
        });
      });
    });

    return nextOptions.sort((a, b) => {
      if (a.validity !== b.validity) return a.validity - b.validity;
      return a.label.localeCompare(b.label);
    });
  }, [packages]);
  const selectedPackageOption =
    packageSelectOptions.find((option) => option.value === packageQuery) || null;
  const priceCurrency = activeLocale === "en" ? "USD" : "VND";
  const hasPriceBounds = priceBounds.max > priceBounds.min;
  const isPackageSearchDisabled = showInternationalFilters && selectedDestinationLabels.length === 0;

  const handleDestinationChange = (option: SingleValue<DestinationSelectOption>) => {
    onSelectDestinationLabel?.(option?.label ?? null);
    onSelectPackageFilterSku?.(null);
  };

  const handlePackageChange = (option: SingleValue<PackageSelectOption>) => {
    onPackageQueryChange?.(option?.value ?? "");
    onSelectPackageFilterSku?.(option?.value ?? null);
  };

  const formatDestinationOption = (option: DestinationSelectOption) => (
    <div className="flex items-center gap-3">
      <span className="text-base leading-none">{option.flag}</span>
      <span className="truncate">{option.label}</span>
    </div>
  );

  const formatPackageOption = (option: PackageSelectOption) => (
    <div className="flex items-start gap-3">
      <span className="text-base leading-none mt-0.5">{option.flag}</span>
      <div className="min-w-0">
        <div className="truncate font-medium text-slate-900">{option.label}</div>
        <div className="truncate text-xs text-slate-500">
          {option.destination}
          {option.network ? ` · ${option.network}` : ""}
        </div>
      </div>
    </div>
  );

  const renderPackageList = () => {
    if (loading && packages.length === 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 rounded-xl border border-slate-100 bg-slate-50 animate-pulse" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      );
    }

    if (packages.length === 0) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
          {t("Không tìm thấy gói eSIM phù hợp.")}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {packages.map((pkg) => {
          const cheapest = findCheapestVariant(pkg, activeLocale);
          const cheapestMoney = getEsimVariantMoney(cheapest, activeLocale);
          const isActive = pkg.slug === selectedPackageSlug;

          return (
            <button
              key={pkg.slug}
              onClick={() => onSelectPackage(pkg)}
              className={`text-left p-4 rounded-xl border transition-all ${
                isActive
                  ? "border-hb-navy bg-blue-50/50 shadow-sm"
                  : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 ${
                    isActive ? "bg-hb-coral" : "bg-slate-200"
                  }`}
                />
                <div>
                  <div className={`font-bold ${isActive ? "text-hb-navy" : "text-midnight-ink"}`}>
                    {pkg.destination}
                  </div>
                  <div className="text-sm text-steel-secondary mt-1 line-clamp-1">
                    {pkg.subtitle} — {pkg.network}
                  </div>
                  <div className="text-sm font-bold text-hb-coral mt-2">
                    {t("Từ")} {formatEsimMoney(cheapestMoney.price, cheapestMoney.currency)}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderSidebar = () => (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-6">
        <div>
          <h4 className="text-2xl font-bold text-midnight-ink mb-4">{t("Quốc gia")}</h4>
          <div className="space-y-3">
            {visibleDestinations.map((option) => {
              const checked = selectedDestinationLabels.includes(option.label);
              return (
                <label key={option.label} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleDestinationLabel?.(option.label)}
                    className="h-5 w-5 rounded border-slate-300 text-hb-coral focus:ring-hb-coral"
                  />
                  <span className="text-[15px] text-midnight-ink">{option.label}</span>
                </label>
              );
            })}
          </div>

          {destinationOptions.length > 5 ? (
            <button
              type="button"
              onClick={() => setShowAllDestinations((current) => !current)}
              className="mt-4 text-sm font-medium text-hb-navy hover:text-hb-coral transition-colors"
            >
              {showAllDestinations ? t("Thu gọn") : t("Xem thêm")}
            </button>
          ) : null}
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-2xl font-bold text-midnight-ink mb-4">{t("Mức giá")}</h4>
          {hasPriceBounds ? (
            <>
              <div className="px-2 py-4">
                <Slider
                  range
                  min={priceBounds.min}
                  max={priceBounds.max}
                  allowCross={false}
                  value={priceRange}
                  onChange={(value) => onPriceRangeChange?.(value as [number, number])}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-midnight-ink">
                  {formatEsimMoney(priceRange[0], priceCurrency)}
                </div>
                <span className="text-slate-400">-</span>
                <div className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-midnight-ink">
                  {formatEsimMoney(priceRange[1], priceCurrency)}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              {t("Chưa có dữ liệu mức giá.")}
            </div>
          )}

          {hasPriceBounds ? (
            <button
              type="button"
              onClick={() => onPriceRangeChange?.([priceBounds.min, priceBounds.max])}
              className="mt-4 text-sm font-medium text-hb-navy hover:text-hb-coral transition-colors"
            >
              {t("Đặt lại")}
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="pt-8">
      <h3 className="text-xl font-bold text-midnight-ink flex items-center gap-2 mb-4">
        <Globe size={24} className="text-hb-navy" /> {t("Chọn điểm đến khác")}
      </h3>

      {showInternationalFilters ? (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
          <div className="lg:sticky lg:top-32 h-fit">{renderSidebar()}</div>

          <div>
            <div className="mb-6">
              <Select<DestinationSelectOption, false>
                value={selectedDestinationOption}
                options={destinationSelectOptions}
                onChange={handleDestinationChange}
                isClearable
                isSearchable
                filterOption={(candidate, inputValue) => {
                  const normalizedInput = normalizeText(inputValue);
                  if (!normalizedInput) return true;

                  return (
                    normalizeText(candidate.label).includes(normalizedInput) ||
                    normalizeText(candidate.value).includes(normalizedInput)
                  );
                }}
                placeholder={t("Chọn quốc gia...")}
                noOptionsMessage={() => t("Không tìm thấy quốc gia")}
                formatOptionLabel={formatDestinationOption}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                components={{
                  IndicatorSeparator: () => null,
                  DropdownIndicator: (props) => (
                    <components.DropdownIndicator {...props}>
                      <ChevronDown size={16} className="text-slate-400" />
                    </components.DropdownIndicator>
                  ),
                  ClearIndicator: (props) => <components.ClearIndicator {...props} />,
                }}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: 48,
                    borderRadius: 12,
                    borderColor: state.isFocused ? "#f97316" : "#cbd5e1",
                    boxShadow: state.isFocused ? "0 0 0 2px rgba(249, 115, 22, 0.15)" : "none",
                    "&:hover": {
                      borderColor: state.isFocused ? "#f97316" : "#94a3b8",
                    },
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    paddingLeft: 16,
                    paddingRight: 8,
                    gap: 8,
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#94a3b8",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "#1e293b",
                    fontWeight: 600,
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 30,
                    overflow: "hidden",
                    borderRadius: 12,
                  }),
                  menuList: (base) => ({
                    ...base,
                    paddingTop: 8,
                    paddingBottom: 8,
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? "#eff6ff"
                      : state.isFocused
                        ? "#f8fafc"
                        : "white",
                    color: "#1e293b",
                    cursor: "pointer",
                  }),
                  input: (base) => ({
                    ...base,
                    margin: 0,
                    padding: 0,
                  }),
                }}
                className="w-full text-sm"
              />
            </div>

            <div className="mb-6">
              <Select<PackageSelectOption, false>
                value={selectedPackageOption}
                options={packageSelectOptions}
                onChange={handlePackageChange}
                isClearable
                isSearchable
                isDisabled={isPackageSearchDisabled}
                filterOption={(candidate, inputValue) => {
                  const normalizedInput = normalizeText(inputValue);
                  if (!normalizedInput) return true;

                  const optionData = candidate.data;
                  return (
                    normalizeText(candidate.label).includes(normalizedInput) ||
                    normalizeText(optionData.data).includes(normalizedInput) ||
                    normalizeText(String(optionData.validity)).includes(normalizedInput) ||
                    normalizeText(optionData.destination).includes(normalizedInput) ||
                    normalizeText(optionData.network).includes(normalizedInput)
                  );
                }}
                placeholder={t("Chọn hạn sử dụng, gói data...")}
                noOptionsMessage={() => t("Không tìm thấy gói eSIM phù hợp.")}
                formatOptionLabel={formatPackageOption}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                components={{
                  IndicatorSeparator: () => null,
                  DropdownIndicator: (props) => (
                    <components.DropdownIndicator {...props}>
                      <ChevronDown size={16} className="text-slate-400" />
                    </components.DropdownIndicator>
                  ),
                  ClearIndicator: (props) => <components.ClearIndicator {...props} />,
                }}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: 48,
                    borderRadius: 12,
                    borderColor: state.isFocused ? "#f97316" : "#cbd5e1",
                    boxShadow: state.isFocused ? "0 0 0 2px rgba(249, 115, 22, 0.15)" : "none",
                    opacity: isPackageSearchDisabled ? 0.7 : 1,
                    backgroundColor: isPackageSearchDisabled ? "#f8fafc" : base.backgroundColor,
                    "&:hover": {
                      borderColor: state.isFocused ? "#f97316" : "#94a3b8",
                    },
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    paddingLeft: 16,
                    paddingRight: 8,
                    gap: 8,
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#94a3b8",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "#1e293b",
                    fontWeight: 600,
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 30,
                    overflow: "hidden",
                    borderRadius: 12,
                  }),
                  menuList: (base) => ({
                    ...base,
                    paddingTop: 8,
                    paddingBottom: 8,
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? "#eff6ff"
                      : state.isFocused
                        ? "#f8fafc"
                        : "white",
                    color: "#1e293b",
                    cursor: "pointer",
                  }),
                  input: (base) => ({
                    ...base,
                    margin: 0,
                    padding: 0,
                  }),
                }}
                className="w-full text-sm"
              />
            </div>

            {renderPackageList()}
          </div>
        </div>
      ) : (
        <>
          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t("Tìm theo quốc gia, khu vực...")}
              className="w-full h-12 border border-slate-200 rounded-xl pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-hb-coral focus:border-transparent transition-all"
            />
          </div>

          {renderPackageList()}
        </>
      )}
    </div>
  );
}
