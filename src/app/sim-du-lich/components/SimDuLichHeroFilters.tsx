"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Select, { components, type SingleValue } from "react-select";
import { ChevronDown } from "lucide-react";
import { allCountries } from "country-telephone-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSimDuLichDetailHref } from "../lib/routes";
import { useEsimCatalog } from "../hooks/useEsimCatalog";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";
import type { EsimFilterOption } from "../lib/esim";

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
  routeCategory: "quoc-te" | "viet-nam";
  flag: string;
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

const resolveRouteCategory = (value: string) => {
  const normalized = normalizeText(value);
  if (normalized.includes("viet nam") || normalized.includes("vietnam") || normalized.includes("domestic")) {
    return "viet-nam";
  }

  return "quoc-te";
};

export default function SimDuLichHeroFilters() {
  const router = useRouter();
  const { language } = useLanguage();
  const activeLocale = language === "en" ? "en" : "vi";
  const t = useSimDuLichStaticText(activeLocale);

  const {
    visiblePackages,
    filters,
    selectedDestinationLabels,
    handleSelectDestinationLabel,
    handleSelectPackageFilterSku,
    packageQuery,
  } = useEsimCatalog({
    cmsPageContent: null,
    faqItems: [],
    activeLocale,
  });

  const destinationSelectOptions = useMemo<DestinationSelectOption[]>(
    () =>
      filters.destinations.map((option) => ({
        ...option,
        flag: resolveDestinationFlag(option),
      })),
    [filters.destinations]
  );

  const selectedDestinationOption =
    destinationSelectOptions.find((option) => selectedDestinationLabels.includes(option.label)) || null;

  const packageSelectOptions = useMemo<PackageSelectOption[]>(() => {
    const seen = new Set<string>();
    const nextOptions: PackageSelectOption[] = [];

    visiblePackages.forEach((pkg) => {
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
          routeCategory: resolveRouteCategory(pkg.regionLabel || pkg.destination || ""),
          flag: resolveDestinationFlag({ label: pkg.destination, value: pkg.destination }),
        });
      });
    });

    return nextOptions.sort((a, b) => {
      if (a.validity !== b.validity) return a.validity - b.validity;
      return a.label.localeCompare(b.label);
    });
  }, [visiblePackages]);

  const selectedPackageOption =
    packageSelectOptions.find((option) => option.value === packageQuery) || null;
  const isPackageSearchDisabled = selectedDestinationLabels.length === 0;

  const handleDestinationChange = (option: SingleValue<DestinationSelectOption>) => {
    handleSelectDestinationLabel(option?.label ?? null);
  };

  const handlePackageChange = (option: SingleValue<PackageSelectOption>) => {
    const sku = option?.value ?? "";
    handleSelectPackageFilterSku(sku || null);

    if (!option) return;

    const matchedPackage = visiblePackages.find((pkg) => pkg.variants.some((variant) => variant.sku === sku));
    const routeCategory = matchedPackage
      ? option.routeCategory || resolveRouteCategory(matchedPackage.regionLabel || matchedPackage.destination || "")
      : option.routeCategory;

    if (matchedPackage) {
      router.push(getSimDuLichDetailHref(routeCategory, matchedPackage.slug));
    }
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

  return (
    <div className="mt-6 grid gap-4">
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
            minHeight: 52,
            borderRadius: 14,
            borderColor: state.isFocused ? "#f97316" : "#cbd5e1",
            boxShadow: state.isFocused ? "0 0 0 2px rgba(249, 115, 22, 0.15)" : "none",
            "&:hover": {
              borderColor: state.isFocused ? "#f97316" : "#94a3b8",
            },
          }),
          valueContainer: (base) => ({
            ...base,
            paddingLeft: 18,
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
            zIndex: 40,
            overflow: "hidden",
            borderRadius: 14,
          }),
          menuList: (base) => ({
            ...base,
            paddingTop: 8,
            paddingBottom: 8,
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? "#eff6ff" : state.isFocused ? "#f8fafc" : "white",
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
            minHeight: 52,
            borderRadius: 14,
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
            paddingLeft: 18,
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
            zIndex: 40,
            overflow: "hidden",
            borderRadius: 14,
          }),
          menuList: (base) => ({
            ...base,
            paddingTop: 8,
            paddingBottom: 8,
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? "#eff6ff" : state.isFocused ? "#f8fafc" : "white",
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
  );
}
