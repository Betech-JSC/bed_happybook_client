"use client";

import { useMemo, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Select, { components, type SingleValue } from "react-select";
import { allCountries } from "country-telephone-data";
import { ChevronDown, Clock3, Globe, MapPin, Search, Wifi } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  formatEsimMoney,
  findCheapestVariant,
  getEsimVariantMoney,
  getSelectableEsimVariants,
  type EsimFilterOption,
  type EsimPackageView,
} from "../lib/esim";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";

type DestinationSelectOption = EsimFilterOption & {
  flag: string;
  displayLabel: string;
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

const COUNTRY_LABEL_ALIASES: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\busa\b|\bunited states\b|\bunited states of america\b/, label: "USA" },
  { pattern: /\buk\b|\bunited kingdom\b|\bgreat britain\b/, label: "UK" },
  { pattern: /\buae\b|\bunited arab emirates\b/, label: "UAE" },
  { pattern: /\bkorea\b|\bsouth korea\b|\brepublic of korea\b/, label: "Korea" },
  { pattern: /\bhong kong\b/, label: "Hong Kong" },
  { pattern: /\btaiwan\b/, label: "Taiwan" },
  { pattern: /\bmacau\b|\bmacao\b/, label: "Macau" },
];

const COUNTRY_FILTER_BLACKLIST = [
  "local",
  "mobifone",
  "wintel",
  "skyfi",
  "countries",
  "country",
  "asia",
  "europe",
  "world",
  "global",
  "package",
  "packages",
  "sim",
];

const getCountryDisplayLabel = (option: EsimFilterOption) => {
  const normalizedLabel = normalizeText(option.label);
  const normalizedValue = normalizeText(option.value);
  const alias = COUNTRY_LABEL_ALIASES.find((item) => item.pattern.test(normalizedLabel) || item.pattern.test(normalizedValue));

  if (alias) return alias.label;

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

  return matchedCountry?.name || option.label;
};

const isCountryOption = (option: EsimFilterOption) => {
  const normalizedLabel = normalizeText(option.label);
  const normalizedValue = normalizeText(option.value);
  const normalizedCombined = `${normalizedLabel} ${normalizedValue}`.trim();

  if (COUNTRY_FILTER_BLACKLIST.some((term) => normalizedCombined.includes(term))) {
    return false;
  }

  if (COUNTRY_LABEL_ALIASES.some((item) => item.pattern.test(normalizedLabel) || item.pattern.test(normalizedValue))) {
    return true;
  }

  return allCountries.some((country) => {
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
  const [sortMode, setSortMode] = useState("newest");
  const countryDestinationOptions = useMemo(() => {
    const seen = new Set<string>();
    const next: DestinationSelectOption[] = [];

    destinationOptions
      .filter(isCountryOption)
      .forEach((option) => {
        const displayLabel = getCountryDisplayLabel(option);
        const normalizedKey = normalizeText(displayLabel);
        if (!displayLabel || seen.has(normalizedKey)) return;
        seen.add(normalizedKey);

        next.push({
          ...option,
          displayLabel,
          flag: resolveDestinationFlag({ ...option, label: displayLabel }),
        });
      });

    return next.sort((a, b) => a.displayLabel.localeCompare(b.displayLabel, "vi"));
  }, [destinationOptions]);
  const visibleDestinations = showAllDestinations
    ? countryDestinationOptions
    : countryDestinationOptions.slice(0, 5);
  const destinationSelectOptions = useMemo<DestinationSelectOption[]>(() => countryDestinationOptions, [countryDestinationOptions]);
  const selectedDestinationOption =
    destinationSelectOptions.find((option) => selectedDestinationLabels.includes(option.displayLabel)) || null;
  const packageSelectOptions = useMemo<PackageSelectOption[]>(() => {
    const seen = new Set<string>();
    const nextOptions: PackageSelectOption[] = [];

    packages.forEach((pkg) => {
      getSelectableEsimVariants(pkg, activeLocale).forEach((variant) => {
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
  }, [activeLocale, packages]);
  const selectedPackageOption =
    packageSelectOptions.find((option) => option.value === packageQuery) || null;
  const priceCurrency = activeLocale === "en" ? "USD" : "VND";
  const hasPriceBounds = priceBounds.max > priceBounds.min;
  const isPackageSearchDisabled = showInternationalFilters && selectedDestinationLabels.length === 0;
  const sortedPackages = useMemo(() => {
    const next = [...packages];
    if (!showInternationalFilters) return next;

    const getPrice = (pkg: EsimPackageView) => {
      const cheapest = findCheapestVariant(pkg, activeLocale);
      return cheapest ? getEsimVariantMoney(cheapest, activeLocale).price : Number.POSITIVE_INFINITY;
    };

    switch (sortMode) {
      case "price-asc":
        return next.sort((a, b) => getPrice(a) - getPrice(b));
      case "price-desc":
        return next.sort((a, b) => getPrice(b) - getPrice(a));
      case "newest":
      default:
        return next.sort((a, b) => String(b.slug || "").localeCompare(String(a.slug || "")));
    }
  }, [activeLocale, packages, showInternationalFilters, sortMode]);

  const handleDestinationChange = (option: SingleValue<DestinationSelectOption>) => {
    onSelectDestinationLabel?.(option?.displayLabel ?? null);
    onSelectPackageFilterSku?.(null);
  };

  const handlePackageChange = (option: SingleValue<PackageSelectOption>) => {
    onPackageQueryChange?.(option?.value ?? "");
    onSelectPackageFilterSku?.(option?.value ?? null);
  };

  const formatDestinationOption = (option: DestinationSelectOption) => (
    <div className="flex items-center gap-3">
      <span className="text-base leading-none">{option.flag}</span>
      <span className="truncate">{option.displayLabel}</span>
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
    if (loading && sortedPackages.length === 0) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-[220px] rounded-[28px] border border-slate-100 bg-slate-50 animate-pulse"
            />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      );
    }

    if (sortedPackages.length === 0) {
      return (
        <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
          {t("Không tìm thấy gói eSIM phù hợp.")}
        </div>
      );
    }

    if (showInternationalFilters) {
      return (
        <div className="space-y-5">
          {sortedPackages.map((pkg) => {
            const cheapest = findCheapestVariant(pkg, activeLocale);
            const cheapestMoney = getEsimVariantMoney(cheapest, activeLocale);
            const isSelectable = Boolean(cheapest && cheapestMoney.price > 0);
            const isActive = pkg.slug === selectedPackageSlug;

            return (
              <button
                key={pkg.slug}
                type="button"
                onClick={() => {
                  if (!isSelectable) return;
                  onSelectPackage(pkg);
                }}
                disabled={!isSelectable}
                className={`group block w-full text-left overflow-hidden rounded-[32px] border bg-white p-4 lg:p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.14)] ${
                  isActive ? "border-[#F27145] ring-2 ring-orange-100" : "border-slate-100"
                } ${!isSelectable ? "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]" : ""}`}
              >
                <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#2D49C7]">
                    <Image
                      src="/bg-image-2.webp"
                      alt={pkg.destination || "eSIM quốc tế"}
                      fill
                      className="object-cover opacity-[0.28] transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2147D8]/95 via-[#3157D8]/80 to-[#2D49C7]/95" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.16),_transparent_42%)]" />
                    <div className="absolute left-4 right-4 top-4 flex flex-nowrap gap-2 overflow-hidden">
                      <span className="inline-flex min-w-0 max-w-[58%] items-center gap-2 rounded-[20px] bg-white px-3 py-2 text-xs font-extrabold text-midnight-ink shadow-sm lg:px-4 lg:text-sm">
                        <Globe className="h-3.5 w-3.5 text-[#1D4ED8] lg:h-4 lg:w-4" />
                        <span className="block min-w-0 truncate whitespace-nowrap uppercase tracking-wide">
                          {pkg.destination || pkg.title}
                        </span>
                      </span>
                      <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-[20px] bg-[#1E3A8A] px-3 py-2 text-xs font-extrabold text-white shadow-sm lg:px-4 lg:text-sm">
                        eSIM
                      </span>
                      <span className="inline-flex min-w-0 max-w-[34%] items-center rounded-[20px] bg-white px-3 py-2 text-xs font-extrabold text-midnight-ink shadow-sm lg:px-4 lg:text-sm">
                        <span className="block min-w-0 truncate whitespace-nowrap">
                          {pkg.network || "Network"}
                        </span>
                      </span>
                    </div>
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-white lg:px-10">
                      <h3 className="max-w-[14ch] text-[28px] font-black leading-[0.95] tracking-tight drop-shadow-md lg:text-[44px]">
                        {pkg.destination || pkg.title}
                      </h3>
                      <p className="mt-3 max-w-[22ch] line-clamp-2 text-sm font-semibold leading-snug text-white/90 drop-shadow-sm lg:mt-4 lg:text-xl">
                        {pkg.subtitle || pkg.network || pkg.coverage}
                      </p>
                    </div>
                    <div
                      className="absolute bottom-4 left-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#4E6EB3] text-white shadow-md lg:h-10 lg:w-10"
                      aria-label="eSIM quốc tế"
                      title="eSIM quốc tế"
                    >
                      <Globe className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    </div>
                  </div>

                  <div className="min-w-0 flex flex-col justify-between gap-5 py-1 lg:py-2 lg:pr-1">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hb-coral">
                          eSIM
                        </p>
                        <h3 className="mt-2 line-clamp-2 text-[22px] font-extrabold leading-tight text-midnight-ink lg:text-[30px]">
                          {pkg.destination || pkg.title}
                        </h3>
                      </div>

                      <p className="line-clamp-2 text-sm leading-6 text-slate-500 lg:text-base">
                        {pkg.subtitle || pkg.network || pkg.coverage}
                      </p>

                      <div className="grid gap-3 text-[15px] text-midnight-ink lg:text-base">
                        <div className="flex items-center gap-3 text-slate-500">
                          <span className="text-lg leading-none">0</span>
                          <span>{t("đánh giá")}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock3 className="h-5 w-5 shrink-0 text-slate-500" />
                          <span className="line-clamp-1">{cheapest?.validity ? `${cheapest.validity} ngày` : pkg.coverage}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 shrink-0 text-slate-500" />
                          <span className="line-clamp-1">{pkg.regionLabel || pkg.destination}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Wifi className="h-5 w-5 shrink-0 text-slate-500" />
                          <span className="line-clamp-1">{pkg.network || pkg.coverage}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-4">
                      <div className="flex flex-wrap gap-2 max-w-full">
                        {cheapest?.data ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                            {cheapest.data}
                          </span>
                        ) : null}
                        {pkg.activation ? (
                          <span className="inline-flex max-w-full rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                            <span className="block max-w-[220px] truncate lg:max-w-[280px]">
                              {pkg.activation}
                            </span>
                          </span>
                        ) : null}
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[30px] font-extrabold tracking-tight text-[#F27145] lg:text-[32px]">
                          {isSelectable
                            ? formatEsimMoney(cheapestMoney.price, cheapestMoney.currency)
                            : t("Chưa có giá khả dụng")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sortedPackages.map((pkg) => {
          const cheapest = findCheapestVariant(pkg, activeLocale);
          const cheapestMoney = getEsimVariantMoney(cheapest, activeLocale);
          const isSelectable = Boolean(cheapest && cheapestMoney.price > 0);
          const isActive = pkg.slug === selectedPackageSlug;

          return (
            <button
              key={pkg.slug}
              onClick={() => {
                if (!isSelectable) return;
                onSelectPackage(pkg);
              }}
              disabled={!isSelectable}
              className={`text-left p-4 rounded-xl border transition-all ${
                isActive
                  ? "border-hb-navy bg-blue-50/50 shadow-sm"
                  : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm"
              } ${!isSelectable ? "opacity-50 cursor-not-allowed hover:shadow-none" : ""}`}
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
                    {isSelectable
                      ? `${t("Từ")} ${formatEsimMoney(cheapestMoney.price, cheapestMoney.currency)}`
                      : t("Chưa có giá khả dụng")}
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
              const checked = selectedDestinationLabels.includes(option.displayLabel);
              return (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleDestinationLabel?.(option.displayLabel)}
                    className="h-5 w-5 rounded border-slate-300 text-hb-coral focus:ring-hb-coral"
                  />
                  <span className="text-[15px] text-midnight-ink">{option.displayLabel}</span>
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
      {showInternationalFilters ? (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
          <div className="lg:sticky lg:top-32 h-fit">{renderSidebar()}</div>

          <div>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-midnight-ink">
                  {t("Sim du lịch quốc tế")}
                </h1>
              </div>
              <div className="hidden lg:flex items-center gap-3">
                <span className="text-lg text-midnight-ink">{t("Sắp xếp")}</span>
                <div className="w-60 bg-white border border-slate-200 rounded-xl">
                  <select
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl outline-none bg-white text-midnight-ink"
                  >
                    <option value="newest">{t("Mới nhất")}</option>
                    <option value="price-asc">{t("Giá từ thấp đến cao")}</option>
                    <option value="price-desc">{t("Giá từ cao xuống thấp")}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-6 lg:hidden flex items-center gap-3">
              <span className="text-sm text-midnight-ink">{t("Sắp xếp")}</span>
              <div className="flex-1 bg-white border border-slate-200 rounded-xl">
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none bg-white text-midnight-ink"
                >
                  <option value="newest">{t("Mới nhất")}</option>
                  <option value="price-asc">{t("Giá từ thấp đến cao")}</option>
                  <option value="price-desc">{t("Giá từ cao xuống thấp")}</option>
                </select>
              </div>
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
