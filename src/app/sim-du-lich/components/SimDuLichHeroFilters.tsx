"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Select, { components, type SingleValue } from "react-select";
import { ChevronDown } from "lucide-react";
import { allCountries } from "country-telephone-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEsimCatalog } from "../hooks/useEsimCatalog";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";
import type { EsimFilterOption } from "../lib/esim";
import { resolveDefaultSimDuLichPackageHref } from "../lib/default-package";

type DestinationSelectOption = EsimFilterOption & {
  flag: string;
  displayLabel: string;
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
  const alias = COUNTRY_LABEL_ALIASES.find(
    (item) => item.pattern.test(normalizedLabel) || item.pattern.test(normalizedValue)
  );

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

export default function SimDuLichHeroFilters() {
  const router = useRouter();
  const { language } = useLanguage();
  const activeLocale = language === "en" ? "en" : "vi";
  const t = useSimDuLichStaticText(activeLocale);

  const {
    packages,
    filters,
    selectedDestinationLabels,
    handleSelectDestinationLabel,
  } = useEsimCatalog({
    cmsPageContent: null,
    faqItems: [],
    activeLocale,
  });

  const destinationSelectOptions = useMemo<DestinationSelectOption[]>(
    () => {
      const seen = new Set<string>();

      return filters.destinations
        .filter(isCountryOption)
        .map((option) => {
          const displayLabel = getCountryDisplayLabel(option);
          const key = normalizeText(displayLabel || option.value || option.label);
          if (!key || seen.has(key)) return null;
          seen.add(key);

          return {
            ...option,
            label: displayLabel,
            displayLabel,
            flag: resolveDestinationFlag({ ...option, label: displayLabel, value: option.value || displayLabel }),
          };
        })
        .filter((option): option is DestinationSelectOption => option !== null)
        .sort((a, b) => a.displayLabel.localeCompare(b.displayLabel, "vi"));
    },
    [filters.destinations]
  );

  const selectedDestinationOption =
    destinationSelectOptions.find((option) => selectedDestinationLabels.includes(String(option.value))) || null;

  const handleDestinationChange = (option: SingleValue<DestinationSelectOption>) => {
    const selectedLabel = option?.displayLabel ?? null;
    const selectedValue = option?.value ? String(option.value) : null;
    handleSelectDestinationLabel(selectedValue);

    if (!selectedLabel) return;

    const href = resolveDefaultSimDuLichPackageHref(
      { value: option?.value ?? "", label: selectedLabel },
      packages,
      activeLocale
    );
    if (href) {
      router.push(href);
    }
  };

  const formatDestinationOption = (option: DestinationSelectOption) => (
    <div className="flex items-center gap-3">
      <span className="text-base leading-none">{option.flag}</span>
      <span className="truncate">{option.label}</span>
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
    </div>
  );
}
