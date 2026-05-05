export interface ApiEsimOption {
  value: string | number;
  label: string;
}

export interface ApiEsimTranslation {
  locale?: string;
  field?: string;
  value?: string;
}

export interface ApiEsimRegion {
  id?: number | string;
  code?: string;
  name?: string;
  search_terms?: string[];
  aliases?: string[];
  translations?: ApiEsimTranslation[];
}

export interface ApiEsimDestination {
  id?: number | string;
  region_id?: number | string;
  code?: string;
  name?: string;
  search_terms?: string[];
  aliases?: string[];
  region?: ApiEsimRegion;
  translations?: ApiEsimTranslation[];
}

export interface ApiEsimVariant {
  id?: number | string;
  sku?: string;
  data_label?: string;
  validity_days?: number | string;
  price?: number | string;
  price_usd?: number | string;
  currency?: string;
  original_price?: number | string;
  original_price_usd?: number | string;
  service_fee_amount?: number | string;
  service_fee_amount_usd?: number | string;
  destination?: string;
  description?: string;
  phone_number_included?: boolean | number | string;
  hotspot_supported?: boolean | number | string;
  wifi_supported?: boolean | number | string;
  unlimited?: boolean | number | string;
  voice_minutes_local?: number | string;
  voice_minutes_international?: number | string;
  sms_local?: number | string;
  sms_international?: number | string;
  fair_use_policy?: string;
  speed_throttle?: string;
  translations?: ApiEsimTranslation[];
}

export interface ApiEsimPackage {
  id?: number | string;
  slug?: string;
  operator?: string;
  package_type?: string;
  service_type?: string;
  destination?: string;
  title?: string;
  subtitle?: string;
  coverage?: string;
  network?: string;
  activation?: string;
  note?: string;
  device_compatibility?: string;
  refund_policy?: string;
  footer_content?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_robots?: string;
  canonical_link?: string;
  meta_image?: string;
  status?: string;
  is_featured?: boolean | number | string;
  sort_order?: number | string;
  destination_id?: number | string;
  destinationModel?: ApiEsimDestination;
  variants?: ApiEsimVariant[];
  translations?: ApiEsimTranslation[];
}

export interface EsimVariantView {
  id: string;
  sku: string;
  data: string;
  validity: number;
  price: number;
  priceUsd: number | null;
  currency: string;
  originalPrice: number;
  originalPriceUsd: number | null;
  serviceFeeAmount: number;
  serviceFeeAmountUsd: number | null;
  desc: string;
  phoneNumberIncluded: boolean;
  hotspotSupported: boolean;
  wifiSupported: boolean;
  unlimited: boolean;
  voiceMinutesLocal: number;
  voiceMinutesInternational: number;
  smsLocal: number;
  smsInternational: number;
  fairUsePolicy: string;
  speedThrottle: string;
}

export interface EsimPackageView {
  id: string;
  slug: string;
  operator: string;
  regionId: string;
  regionLabel: string;
  destinationId: string;
  destination: string;
  title: string;
  subtitle: string;
  coverage: string;
  network: string;
  activation: string;
  note: string;
  deviceCompatibility: string;
  refundPolicy: string;
  footerContent: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_robots?: string;
  canonical_link?: string;
  meta_image?: string;
  isFeatured: boolean;
  variants: EsimVariantView[];
}

export interface EsimFilterOption {
  value: string;
  label: string;
}

export interface EsimFilterOptions {
  regions: EsimFilterOption[];
  destinations: EsimFilterOption[];
  operators: EsimFilterOption[];
}

type Locale = "vi" | "en";

const toBoolean = (value: unknown): boolean =>
  value === true || value === 1 || value === "1" || value === "true";

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const toString = (value: unknown): string =>
  typeof value === "string" ? value : value === null || value === undefined ? "" : String(value);

const pickTranslatedValue = (
  translations: ApiEsimTranslation[] | undefined,
  locale: Locale,
  fallback: string
): string => {
  if (!translations?.length) return fallback;

  const matched = translations.find((item) => item?.locale === locale && item?.value?.trim());
  return matched?.value?.trim() || fallback;
};

const pickOptionLabel = (
  item: any,
  locale: Locale,
  fallbackKeys: (string | undefined)[]
): string => {
  const translationValue = pickTranslatedValue(item?.translations, locale, "");
  if (translationValue) return translationValue;

  for (const key of fallbackKeys) {
    const value = toString(key || "");
    if (value.trim()) return value.trim();
  }

  return "";
};

export const formatPrice = (value: number): string =>
  new Intl.NumberFormat("vi-VN").format(value) + "đ";

export const formatEsimMoney = (value: number, currency?: string): string => {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  }

  return formatPrice(Math.round(value));
};

export const getEsimVariantMoney = (
  variant?: EsimVariantView | null,
  locale: string = "vi"
) => {
  const isEnglish = locale === "en";
  const currency = isEnglish ? "USD" : (variant?.currency || "VND");

  return {
    price: isEnglish ? (variant?.priceUsd ?? variant?.price ?? 0) : (variant?.price ?? 0),
    originalPrice: isEnglish
      ? (variant?.originalPriceUsd ?? variant?.originalPrice ?? 0)
      : (variant?.originalPrice ?? 0),
    serviceFeeAmount: isEnglish
      ? (variant?.serviceFeeAmountUsd ?? variant?.serviceFeeAmount ?? 0)
      : (variant?.serviceFeeAmount ?? 0),
    currency,
  };
};

export const normalizeFilterOptions = (payload: any, locale: Locale = "vi"): EsimFilterOptions => {
  const mapOptions = (items: any[] = []): EsimFilterOption[] =>
    items
      .filter(Boolean)
      .map((item) => ({
        value: toString(item.code ?? item.slug ?? item.value ?? item.id ?? ""),
        label: pickOptionLabel(item, locale, [
          item.label,
          item.name,
          item.code,
          item.value,
          item.id,
        ]),
      }))
      .filter((item) => item.value !== "" || item.label !== "");

  return {
    regions: mapOptions(payload?.regions ?? []),
    destinations: mapOptions(payload?.destinations ?? []),
    operators: mapOptions(payload?.operators ?? []),
  };
};

export const normalizeEsimVariant = (variant: ApiEsimVariant): EsimVariantView => ({
  id: toString(variant.id ?? variant.sku),
  sku: toString(variant.sku),
  data: toString(variant.data_label || variant.description || variant.destination),
  validity: toNumber(variant.validity_days),
  price: toNumber(variant.price),
  priceUsd: variant.price_usd === null || variant.price_usd === undefined || variant.price_usd === ""
    ? null
    : toNumber(variant.price_usd),
  currency: toString(variant.currency || "VND"),
  originalPrice: toNumber(variant.original_price),
  originalPriceUsd:
    variant.original_price_usd === null ||
    variant.original_price_usd === undefined ||
    variant.original_price_usd === ""
      ? null
      : toNumber(variant.original_price_usd),
  serviceFeeAmount: toNumber(variant.service_fee_amount),
  serviceFeeAmountUsd:
    variant.service_fee_amount_usd === null ||
    variant.service_fee_amount_usd === undefined ||
    variant.service_fee_amount_usd === ""
      ? null
      : toNumber(variant.service_fee_amount_usd),
  desc: toString(variant.description || variant.data_label || variant.destination),
  phoneNumberIncluded: toBoolean(variant.phone_number_included),
  hotspotSupported: toBoolean(variant.hotspot_supported),
  wifiSupported: toBoolean(variant.wifi_supported),
  unlimited: toBoolean(variant.unlimited),
  voiceMinutesLocal: toNumber(variant.voice_minutes_local),
  voiceMinutesInternational: toNumber(variant.voice_minutes_international),
  smsLocal: toNumber(variant.sms_local),
  smsInternational: toNumber(variant.sms_international),
  fairUsePolicy: toString(variant.fair_use_policy),
  speedThrottle: toString(variant.speed_throttle),
});

export const normalizeEsimPackage = (item: ApiEsimPackage): EsimPackageView => {
  const destinationModel = item.destinationModel ?? {};
  const regionModel = destinationModel.region ?? {};
  const variants = (item.variants ?? []).map(normalizeEsimVariant);

  const destinationLabel =
    toString(destinationModel.name || destinationModel.code || item.destination || item.title || item.slug);
  const regionLabel =
    toString(regionModel.name || regionModel.code || destinationModel.name || item.destination || "Quốc tế");

  return {
    id: toString(item.slug || item.id),
    slug: toString(item.slug || item.id),
    operator: toString(item.operator),
    regionId: toString(regionModel.id ?? destinationModel.region_id ?? item.destinationModel?.region_id ?? ""),
    regionLabel,
    destinationId: toString(destinationModel.id ?? item.destination_id ?? ""),
    destination: destinationLabel,
    title: toString(item.title || destinationLabel),
    subtitle: toString(item.subtitle),
    coverage: toString(item.coverage || destinationLabel),
    network: toString(item.network),
    activation: toString(item.activation),
    note: toString(item.note),
    deviceCompatibility: toString(item.device_compatibility),
    refundPolicy: toString(item.refund_policy),
    footerContent: toString(item.footer_content),
    meta_title: toString(item.meta_title),
    meta_description: toString(item.meta_description),
    meta_keywords: toString(item.meta_keywords),
    meta_robots: toString(item.meta_robots),
    canonical_link: toString(item.canonical_link),
    meta_image: toString(item.meta_image),
    isFeatured: toBoolean(item.is_featured),
    variants: variants.sort((a, b) => {
      if (a.validity !== b.validity) return a.validity - b.validity;
      if (a.price !== b.price) return a.price - b.price;
      return a.sku.localeCompare(b.sku);
    }),
  };
};

export const normalizeEsimPackages = (items: ApiEsimPackage[] = []): EsimPackageView[] =>
  items.map(normalizeEsimPackage).filter((item) => item.id !== "");

export const findCheapestVariant = (
  pkg?: EsimPackageView | null,
  locale: string = "vi"
): EsimVariantView | undefined =>
  pkg?.variants
    ?.slice()
    .sort((a, b) => getEsimVariantMoney(a, locale).price - getEsimVariantMoney(b, locale).price)[0];

const normalizePreset = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const resolveEsimRegionPreset = (
  options: EsimFilterOption[] = [],
  preset?: string
): string => {
  const normalizedPreset = normalizePreset(preset ?? "");

  if (!normalizedPreset || normalizedPreset === "all" || normalizedPreset === "tat-ca") {
    return "";
  }

  const normalizedOptions = options.map((option) => ({
    ...option,
    normalizedValue: normalizePreset(option.value),
    normalizedLabel: normalizePreset(option.label),
  }));

  const directMatch = normalizedOptions.find(
    (option) =>
      option.normalizedValue === normalizedPreset ||
      option.normalizedLabel === normalizedPreset
  );
  if (directMatch) return directMatch.value;

  if (
    normalizedPreset.includes("viet-nam") ||
    normalizedPreset.includes("vietnam") ||
    normalizedPreset.includes("domestic") ||
    normalizedPreset.includes("noi-dia")
  ) {
    const domesticMatch = normalizedOptions.find((option) => {
      const label = option.normalizedLabel;
      return (
        label.includes("viet-nam") ||
        label.includes("vietnam") ||
        label.includes("domestic") ||
        label.includes("noi-dia")
      );
    });

    if (domesticMatch) return domesticMatch.value;
  }

  if (
    normalizedPreset.includes("quoc-te") ||
    normalizedPreset.includes("international") ||
    normalizedPreset.includes("nuoc-ngoai")
  ) {
    const internationalMatch = normalizedOptions.find((option) => {
      const label = option.normalizedLabel;
      return (
        label.includes("quoc-te") ||
        label.includes("international") ||
        label.includes("nuoc-ngoai")
      );
    });

    if (internationalMatch) return internationalMatch.value;
  }

  return "";
};
