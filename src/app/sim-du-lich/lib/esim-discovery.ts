import { allCountries } from "country-telephone-data";
import { formatEsimMoney, findCheapestVariant, getEsimVariantMoney, type EsimFilterOption, type EsimPackageView } from "./esim";

export type DestinationSelectOption = EsimFilterOption & {
  flag: string;
  displayLabel: string;
};

export type PricePreset = {
  key: string;
  label: string;
  range: [number, number];
};

export type SortMode = "newest" | "price-asc" | "price-desc";

type TranslateFn = (text: string, fallback?: string) => string;

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

export const resolveDestinationFlag = (option: EsimFilterOption) => {
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

export const getCountryDisplayLabel = (option: EsimFilterOption) => {
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

export const isCountryOption = (option: EsimFilterOption) => {
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

export const isVietnamDomesticOption = (option: EsimFilterOption) => {
  const normalizedLabel = normalizeText(option.label);
  const normalizedValue = normalizeText(option.value);
  const normalizedCombined = `${normalizedLabel} ${normalizedValue}`.trim();

  return (
    normalizedCombined.includes("vietnam") ||
    normalizedCombined.includes("viet nam") ||
    normalizedCombined.includes("domestic")
  );
};

const toDisplayOption = (option: EsimFilterOption): DestinationSelectOption => {
  const displayLabel = option.label?.trim() || option.value?.trim() || "";

  return {
    ...option,
    displayLabel,
    flag: resolveDestinationFlag({ ...option, label: displayLabel, value: option.value || displayLabel }),
  };
};

const sortByDisplayLabel = (items: DestinationSelectOption[]) =>
  items.sort((a, b) => a.displayLabel.localeCompare(b.displayLabel, "vi"));

export const buildCountryDestinationOptions = (destinationOptions: EsimFilterOption[]) => {
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

  return sortByDisplayLabel(next);
};

export const buildGenericDestinationOptions = (destinationOptions: EsimFilterOption[]) => {
  const seen = new Set<string>();

  return destinationOptions
    .map(toDisplayOption)
    .filter((option) => {
      const key = normalizeText(option.displayLabel || option.value || "");
      if (!key || seen.has(key)) return Boolean(option.displayLabel || option.value);
      seen.add(key);
      return true;
    });
};

export const buildComboDestinationOptions = (destinationOptions: EsimFilterOption[]) => {
  const seen = new Set<string>();
  const comboOptions = destinationOptions
    .filter((option) => !isCountryOption(option) && !isVietnamDomesticOption(option))
    .map(toDisplayOption)
    .filter((option) => {
      const key = normalizeText(option.displayLabel || option.value || "");
      if (!key || seen.has(key)) return Boolean(option.displayLabel || option.value);
      seen.add(key);
      return true;
    });

  return sortByDisplayLabel(comboOptions);
};

export const buildPricePresets = (
  priceBounds: { min: number; max: number },
  priceCurrency: string,
  t: TranslateFn
) => {
  if (priceBounds.max <= priceBounds.min) return [];

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
};

export const getPriceSliderStep = (priceBounds: { min: number; max: number }) => {
  if (priceBounds.max <= priceBounds.min) return 0;

  const span = priceBounds.max - priceBounds.min;
  if (span <= 200_000) return 10_000;
  if (span <= 750_000) return 25_000;
  return 50_000;
};

export const sortEsimPackages = (
  packages: EsimPackageView[],
  activeLocale: "vi" | "en",
  sortMode: SortMode,
  showInternationalFilters: boolean
) => {
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
      return next;
  }
};
