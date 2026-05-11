"use client";

import { useCallback, useMemo, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { type SingleValue } from "react-select";
import { allCountries } from "country-telephone-data";
import { Clock3, Globe, MapPin, Search, Wifi } from "lucide-react";
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

type PricePreset = {
  key: string;
  label: string;
  range: [number, number];
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
  pageTitle?: string;
  sidebarTitle?: string;
  sidebarMode?: "country" | "generic";
  destinationOptions?: EsimFilterOption[];
  selectedDestinationLabels?: string[];
  onToggleDestinationLabel?: (label: string) => void;
  onSelectDestinationLabel?: (label: string | null) => void;
  onSelectPackageFilterSku?: (sku: string | null) => void;
  priceRange?: [number, number];
  priceBounds?: { min: number; max: number };
  onPriceRangeChange?: (range: [number, number]) => void;
  showPriceFilters?: boolean;
  showPricePresetFilters?: boolean;
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

const isVietnamDomesticOption = (option: EsimFilterOption) => {
  const normalizedLabel = normalizeText(option.label);
  const normalizedValue = normalizeText(option.value);
  const normalizedCombined = `${normalizedLabel} ${normalizedValue}`.trim();

  return (
    normalizedCombined.includes("vietnam") ||
    normalizedCombined.includes("viet nam") ||
    normalizedCombined.includes("domestic")
  );
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
  pageTitle,
  sidebarTitle,
  sidebarMode = "country",
  destinationOptions = [],
  selectedDestinationLabels = [],
  onToggleDestinationLabel,
  onSelectDestinationLabel,
  onSelectPackageFilterSku,
  onPackageQueryChange,
  priceRange = [0, 0],
  priceBounds = { min: 0, max: 0 },
  onPriceRangeChange,
  showPriceFilters = true,
  showPricePresetFilters = true,
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
  const genericDestinationOptions = useMemo<DestinationSelectOption[]>(() => {
    const seen = new Set<string>();

    return destinationOptions
      .map((option) => {
        const displayLabel = option.label?.trim() || option.value?.trim() || "";
        return {
          ...option,
          displayLabel,
          flag: resolveDestinationFlag({ ...option, label: displayLabel, value: option.value || displayLabel }),
        };
      })
      .filter((option) => {
        const key = normalizeText(option.displayLabel || option.value || "");
        if (!key || seen.has(key)) return Boolean(option.displayLabel || option.value);
        seen.add(key);
        return true;
      });
  }, [destinationOptions]);
  const comboDestinationOptions = useMemo<DestinationSelectOption[]>(() => {
    const seen = new Set<string>();
    const comboOptions = destinationOptions
      .filter((option) => !isCountryOption(option) && !isVietnamDomesticOption(option))
      .map((option) => {
        const displayLabel = option.label?.trim() || option.value?.trim() || "";
        return {
          ...option,
          displayLabel,
          flag: resolveDestinationFlag({ ...option, label: displayLabel, value: option.value || displayLabel }),
        };
      })
      .filter((option) => {
        const key = normalizeText(option.displayLabel || option.value || "");
        if (!key || seen.has(key)) return Boolean(option.displayLabel || option.value);
        seen.add(key);
        return true;
      });

    if (comboOptions.length > 0) {
      return comboOptions.sort((a, b) => a.displayLabel.localeCompare(b.displayLabel, "vi"));
    }

    const looksLikeComboPackage = (pkg: EsimPackageView) => {
      const text = normalizeText([pkg.destination, pkg.title, pkg.coverage, pkg.regionLabel].filter(Boolean).join(" "));
      const rawText = `${pkg.coverage || ""} ${pkg.destination || ""}`.toLowerCase();

      if (!text) return false;
      if (/[,&]/.test(rawText) || /\band\b/.test(rawText)) return true;
      if (/\b\d+\s*countries?\b/.test(rawText)) return true;

      return /\b(regional|global|america|europe|asia|world)\b/.test(text);
    };

    packages.forEach((pkg) => {
      if (!looksLikeComboPackage(pkg)) return;

      const displayLabel =
        pkg.destination?.trim() ||
        pkg.title?.trim() ||
        pkg.coverage?.trim() ||
        pkg.regionLabel?.trim() ||
        "";
      const normalizedDisplayLabel = normalizeText(displayLabel);
      if (
        normalizedDisplayLabel.includes("vietnam") ||
        normalizedDisplayLabel.includes("viet nam") ||
        normalizedDisplayLabel.includes("domestic")
      ) {
        return;
      }
      const value = displayLabel;
      const key = normalizeText(displayLabel || value);

      if (!key || seen.has(key)) return;
      seen.add(key);
      comboOptions.push({
        value,
        label: displayLabel,
        displayLabel,
        flag: resolveDestinationFlag({ label: displayLabel, value }),
      });
    });

    return comboOptions.sort((a, b) => a.displayLabel.localeCompare(b.displayLabel, "vi"));
  }, [destinationOptions, packages]);
  const sidebarOptions = sidebarMode === "generic" ? genericDestinationOptions : countryDestinationOptions;
  const destinationSelectOptions = useMemo<DestinationSelectOption[]>(() => sidebarOptions, [sidebarOptions]);
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
  const priceStep = useMemo(() => {
    if (!hasPriceBounds) return 0;

    const span = priceBounds.max - priceBounds.min;
    if (span <= 200_000) return 10_000;
    if (span <= 750_000) return 25_000;
    return 50_000;
  }, [hasPriceBounds, priceBounds.max, priceBounds.min]);
  const pricePresets = useMemo<PricePreset[]>(() => {
    if (!hasPriceBounds) return [];

    const clamp = (value: number) => Math.max(priceBounds.min, Math.min(value, priceBounds.max));
    const presetRanges: Array<{ key: string; label: string; range: [number, number] }> = [
      {
        key: "all",
        label: t("Tất cả mức giá", "All prices"),
        range: [priceBounds.min, priceBounds.max],
      },
      {
        key: "under-100k",
        label: `${t("Dưới", "Under")} ${formatEsimMoney(100_000, priceCurrency)}`,
        range: [priceBounds.min, clamp(100_000)],
      },
      {
        key: "100k-300k",
        label: `${formatEsimMoney(100_000, priceCurrency)} - ${formatEsimMoney(300_000, priceCurrency)}`,
        range: [clamp(100_000), clamp(300_000)],
      },
      {
        key: "300k-500k",
        label: `${formatEsimMoney(300_000, priceCurrency)} - ${formatEsimMoney(500_000, priceCurrency)}`,
        range: [clamp(300_000), clamp(500_000)],
      },
      {
        key: "500k-1m",
        label: `${formatEsimMoney(500_000, priceCurrency)} - ${formatEsimMoney(1_000_000, priceCurrency)}`,
        range: [clamp(500_000), clamp(1_000_000)],
      },
      {
        key: "1m-plus",
        label: `${t("Từ", "From")} ${formatEsimMoney(1_000_000, priceCurrency)}`,
        range: [clamp(1_000_000), priceBounds.max],
      },
    ];

    return presetRanges
      .map((preset) => ({
        ...preset,
        range: [Math.min(preset.range[0], preset.range[1]), Math.max(preset.range[0], preset.range[1])] as [
          number,
          number,
        ],
      }))
      .filter((preset) => preset.range[1] > preset.range[0]);
  }, [hasPriceBounds, priceBounds.max, priceBounds.min, priceCurrency, t]);

  const isPricePresetActive = useCallback(
    (range: [number, number]) => priceRange[0] === range[0] && priceRange[1] === range[1],
    [priceRange]
  );
  const visibleSidebarOptions = showAllDestinations ? sidebarOptions : sidebarOptions.slice(0, 5);
  const visibleCountryDestinations = showAllDestinations
    ? countryDestinationOptions
    : countryDestinationOptions.slice(0, 5);
  const visibleComboDestinations = showAllDestinations
    ? comboDestinationOptions
    : comboDestinationOptions.slice(0, 5);
  const hasTruncatedDestinationOptions =
    sidebarMode === "generic"
      ? sidebarOptions.length > 5
      : countryDestinationOptions.length > 5 || comboDestinationOptions.length > 5;
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
              className="h-[280px] rounded-2xl border-2 border-[#EAECF0] bg-slate-50 animate-pulse lg:h-[220px]"
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
        <div className="space-y-0">
          {sortedPackages.map((pkg) => {
            const cheapest = findCheapestVariant(pkg, activeLocale);
            const cheapestMoney = getEsimVariantMoney(cheapest, activeLocale);
            const isSelectable = Boolean(cheapest && cheapestMoney.price > 0);
            const isActive = pkg.slug === selectedPackageSlug;
            const title = pkg.destination || pkg.title || pkg.regionLabel || "eSIM";
            const subtitle = pkg.subtitle || pkg.coverage || pkg.network || pkg.regionLabel || title;
            const validityLabel = cheapest?.validity
              ? `${cheapest.validity} ngày`
              : pkg.coverage || pkg.subtitle || pkg.network || title;

            return (
              <button
                key={pkg.slug}
                type="button"
                onClick={() => {
                  if (!isSelectable) return;
                  onSelectPackage(pkg);
                }}
                disabled={!isSelectable}
                className={`w-full text-left ${
                  !isSelectable ? "opacity-50 cursor-not-allowed" : ""
                }`}
                >
                <div
                  className={`flex flex-col lg:flex-row lg:space-x-6 rounded-3xl bg-white p-5 mt-4 transition-opacity duration-700 ${
                    isActive ? "ring-2 ring-orange-100" : ""
                  } ${!isSelectable ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="w-full lg:w-5/12 relative overflow-hidden rounded-xl">
                    <div className="relative aspect-[4/3] min-h-40 w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#2147D8] via-[#3157D8] to-[#2D49C7] lg:aspect-auto lg:h-full">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.24),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.12),_transparent_34%)]" />
                      <div className="absolute left-3 right-3 top-3 flex flex-nowrap items-center gap-2 overflow-hidden">
                        <span className="inline-flex min-w-0 max-w-[46%] flex-[1_1_46%] items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-midnight-ink shadow-sm lg:px-3 lg:text-xs">
                          <Globe className="h-3.5 w-3.5 shrink-0 text-[#1D4ED8]" />
                          <span className="min-w-0 truncate whitespace-nowrap">
                            {title || pkg.regionLabel || "eSIM"}
                          </span>
                        </span>
                        <span className="inline-flex shrink-0 items-center rounded-full bg-[#1E3A8A] px-3 py-1.5 text-[11px] font-extrabold text-white shadow-sm lg:text-xs">
                          eSIM
                        </span>
                        <span className="inline-flex min-w-0 flex-1 items-center rounded-full bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-midnight-ink shadow-sm lg:px-3 lg:text-xs">
                          <span className="min-w-0 truncate whitespace-nowrap">
                            {pkg.network || "Network"}
                          </span>
                        </span>
                      </div>

                      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white lg:px-8">
                        <h3 className="max-w-[14ch] text-[24px] font-black leading-[0.94] tracking-tight drop-shadow-md lg:text-[34px]">
                          {title}
                        </h3>
                        <p className="mt-2 max-w-[20ch] text-xs font-semibold leading-snug text-white/90 drop-shadow-sm lg:mt-3 lg:text-base">
                          {subtitle}
                        </p>
                      </div>

                      <div className="absolute bottom-0 left-0 rounded-tr-3xl bg-[#4E6EB3] px-3 py-1 text-white">
                        <span className="block max-w-[14rem] truncate whitespace-nowrap text-sm" data-translate="true">
                          {pkg.regionLabel || pkg.coverage || pkg.destination}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-7/12 mt-4 lg:mt-0 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hb-coral">
                          eSIM
                        </p>
                        <h3 className="text-18 font-semibold leading-tight hover:text-primary duration-300 transition-colors">
                          <span data-translate="true">{title}</span>
                        </h3>
                      </div>

                      <div className="flex items-center gap-2.5 text-gray-500">
                        <span data-translate="true">0 đánh giá</span>
                      </div>

                      <div className="space-y-2.5 text-midnight-ink">
                        <div className="flex items-center gap-2.5 leading-6">
                          <Clock3 className="w-4 h-4 shrink-0 text-slate-500" />
                          <span data-translate="true">{validityLabel}</span>
                        </div>

                        <div className="flex items-center gap-2.5 leading-6">
                          <MapPin className="w-4 h-4 shrink-0 text-slate-500" />
                          <span data-translate="true">{pkg.regionLabel || pkg.destination}</span>
                        </div>

                        <div className="flex items-center gap-2.5 leading-6">
                          <Wifi className="w-4 h-4 shrink-0 text-slate-500" />
                          <span data-translate="true">{pkg.network || pkg.coverage}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-2xl text-primary font-bold text-end mt-3">
                      {isSelectable ? (
                        <span>
                          {formatEsimMoney(cheapestMoney.price, cheapestMoney.currency)}
                        </span>
                      ) : (
                        <span data-translate="true">Chưa có giá khả dụng</span>
                      )}
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
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:overscroll-contain">
      <div className="space-y-6 lg:pr-2">
        {sidebarMode === "generic" ? (
          <div>
            <h4 className="mb-4 text-2xl font-bold text-midnight-ink">{sidebarTitle || t("Nhà mạng")}</h4>
            <div className="space-y-3">
              {visibleSidebarOptions.map((option) => {
                const checked = selectedDestinationLabels.includes(option.displayLabel);
                return (
                  <label key={option.value} className="flex cursor-pointer items-center gap-3">
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

            {hasTruncatedDestinationOptions ? (
              <button
                type="button"
                onClick={() => setShowAllDestinations((current) => !current)}
                className="mt-4 text-sm font-medium text-hb-navy hover:text-hb-coral transition-colors"
              >
                {showAllDestinations ? t("Thu gọn") : t("Xem thêm")}
              </button>
            ) : null}
          </div>
        ) : (
          <>
            {showInternationalFilters && comboDestinationOptions.length > 0 ? (
              <div>
                <h4 className="mb-4 text-2xl font-bold text-midnight-ink">{t("Cụm quốc gia")}</h4>
                <div className="space-y-3">
                  {visibleComboDestinations.map((option) => {
                    const checked = selectedDestinationLabels.includes(option.displayLabel);
                    return (
                      <label key={option.value} className="flex cursor-pointer items-center gap-3">
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
              </div>
            ) : null}

            <div>
              <h4 className="mb-4 text-2xl font-bold text-midnight-ink">{sidebarTitle || t("Quốc gia")}</h4>
              <div className="space-y-3">
                {visibleCountryDestinations.map((option) => {
                  const checked = selectedDestinationLabels.includes(option.displayLabel);
                  return (
                    <label key={option.value} className="flex cursor-pointer items-center gap-3">
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

              {hasTruncatedDestinationOptions ? (
                <button
                  type="button"
                  onClick={() => setShowAllDestinations((current) => !current)}
                  className="mt-4 text-sm font-medium text-hb-navy hover:text-hb-coral transition-colors"
                >
                  {showAllDestinations ? t("Thu gọn") : t("Xem thêm")}
                </button>
              ) : null}
            </div>
          </>
        )}

        {showPriceFilters ? (
          <div className="border-t border-slate-100 pt-6">
            {showPricePresetFilters ? (
              <>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h4 className="text-2xl font-bold text-midnight-ink">{t("Mức giá")}</h4>
                  {hasPriceBounds ? (
                    <button
                      type="button"
                      onClick={() => onPriceRangeChange?.([priceBounds.min, priceBounds.max])}
                      className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-hb-navy transition-colors hover:border-hb-coral hover:text-hb-coral"
                    >
                      {t("Đặt lại")}
                    </button>
                  ) : null}
                </div>

                {hasPriceBounds && pricePresets.length ? (
                  <div className="mb-4">
                    <div className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                      {t("Chọn nhanh", "Quick ranges")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pricePresets.map((preset) => {
                        const active = isPricePresetActive(preset.range);

                        return (
                          <button
                            key={preset.key}
                            type="button"
                            onClick={() => onPriceRangeChange?.(preset.range)}
                            className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
                              active
                                ? "border-hb-coral bg-orange-50 text-hb-coral"
                                : "border-slate-200 bg-white text-midnight-ink hover:border-hb-coral hover:text-hb-coral"
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}

            {hasPriceBounds ? (
              <>
                <div className="px-2 py-4">
                  <Slider
                    range
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={priceStep || undefined}
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
          </div>
        ) : null}
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
                  {pageTitle || t("Sim du lịch quốc tế")}
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
