import { cmsUrl } from "@/constants";

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
  stock_status?: string;
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
  avatar?: string;
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
  destination_model?: ApiEsimDestination;
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
  stockStatus: string;
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
  avatar?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_robots?: string;
  canonical_link?: string;
  meta_image?: string;
  isFeatured: boolean;
  variants: EsimVariantView[];
  translations?: ApiEsimTranslation[];
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

const resolveImageUrl = (value?: string | null): string => {
  const image = toString(value).trim();
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${cmsUrl}${image.startsWith("/") ? "" : "/"}${image}`;
};

const pickTranslatedValue = (
  translations: ApiEsimTranslation[] | undefined,
  locale: Locale,
  fallback: string
): string => {
  if (!translations?.length) return fallback;

  const matched = translations.find((item) => item?.locale === locale && item?.value?.trim());
  return matched?.value?.trim() || fallback;
};

const pickAnyTranslatedValue = (
  translations: ApiEsimTranslation[] | undefined,
  field: string,
  fallback = ""
): string => {
  if (!translations?.length) return fallback;

  const matched = translations.find((item) => item?.field === field && item?.value?.trim());
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
    price: isEnglish
      ? (variant?.priceUsd ?? 0)
      : (variant?.price ?? 0),
    originalPrice: isEnglish
      ? (variant?.originalPriceUsd ?? variant?.originalPrice ?? 0)
      : (variant?.originalPrice ?? 0),
    serviceFeeAmount: isEnglish
      ? (variant?.serviceFeeAmountUsd ?? variant?.serviceFeeAmount ?? 0)
      : (variant?.serviceFeeAmount ?? 0),
    currency,
  };
};

export const isEsimVariantSelectable = (
  variant?: EsimVariantView | null,
  locale: string = "vi"
): boolean => {
  if (!variant) return false;
  if (getEsimVariantMoney(variant, locale).price <= 0) return false;
  if (variant.stockStatus && variant.stockStatus !== "in_stock") return false;
  return true;
};

export const getSelectableEsimVariants = (
  pkg?: EsimPackageView | null,
  locale: string = "vi"
): EsimVariantView[] =>
  (pkg?.variants ?? []).filter((variant) => isEsimVariantSelectable(variant, locale));

export const normalizeFilterOptions = (payload: any, locale: Locale = "vi"): EsimFilterOptions => {
  const isValidOperator = (label: string) => {
    if (!label) return false;
    if (label.length > 25) return false;
    if (label.includes(", ")) return false;
    return true;
  };

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

  const mapOperators = (items: any[] = []): EsimFilterOption[] =>
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
      .filter((item) => item.label !== "" && isValidOperator(item.label));

  return {
    regions: mapOptions(payload?.regions ?? []),
    destinations: mapOptions(payload?.destinations ?? []),
    operators: mapOperators(payload?.operators ?? []),
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
  stockStatus: toString(variant.stock_status || "in_stock"),
});

export const normalizeEsimPackage = (item: ApiEsimPackage): EsimPackageView => {
  const destinationModel = item.destination_model ?? item.destinationModel ?? {};
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
    regionId: toString(
      regionModel.id ??
        destinationModel.region_id ??
        item.destination_model?.region_id ??
        item.destinationModel?.region_id ??
        ""
    ),
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
    avatar: toString(item.avatar),
    meta_title: toString(item.meta_title),
    meta_description: toString(item.meta_description),
    meta_keywords: toString(item.meta_keywords),
    meta_robots: toString(item.meta_robots),
    canonical_link: toString(item.canonical_link),
    meta_image: toString(item.meta_image),
    isFeatured: toBoolean(item.is_featured),
    translations: item.translations ?? [],
    variants: variants.sort((a, b) => {
      if (a.validity !== b.validity) return a.validity - b.validity;
      if (a.price !== b.price) return a.price - b.price;
      return a.sku.localeCompare(b.sku);
    }),
  };
};

export const resolveEsimPackageAvatarUrl = (pkg?: Pick<EsimPackageView, "avatar" | "meta_image"> | null): string =>
  resolveImageUrl(
    pkg?.avatar ||
      pickAnyTranslatedValue((pkg as EsimPackageView | null | undefined)?.translations, "avatar", "") ||
      pkg?.meta_image ||
      pickAnyTranslatedValue((pkg as EsimPackageView | null | undefined)?.translations, "meta_image", "") ||
      ""
  );

export const normalizeEsimPackages = (items: ApiEsimPackage[] = []): EsimPackageView[] =>
  items.map(normalizeEsimPackage).filter((item) => item.id !== "");

export const findCheapestVariant = (
  pkg?: EsimPackageView | null,
  locale: string = "vi"
): EsimVariantView | undefined =>
  getSelectableEsimVariants(pkg, locale)
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
  const findExactLabelMatch = (aliases: string[]) =>
    normalizedOptions.find((option) => aliases.includes(option.normalizedLabel));
  const findIncludesLabelMatch = (aliases: string[]) =>
    normalizedOptions.find((option) =>
      aliases.some((alias) => option.normalizedLabel.includes(alias))
    );

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
    const domesticAliases = ["viet-nam", "vietnam", "domestic", "noi-dia"];
    const domesticExactMatch = findExactLabelMatch(domesticAliases);
    if (domesticExactMatch) return domesticExactMatch.value;

    const domesticMatch = findIncludesLabelMatch(domesticAliases);
    if (domesticMatch) return domesticMatch.value;
  }

  if (
    normalizedPreset.includes("quoc-te") ||
    normalizedPreset.includes("international") ||
    normalizedPreset.includes("nuoc-ngoai")
  ) {
    const internationalAliases = ["quoc-te", "international", "nuoc-ngoai"];
    const internationalExactMatch = findExactLabelMatch(internationalAliases);
    if (internationalExactMatch) return internationalExactMatch.value;

    const internationalMatch = findIncludesLabelMatch(internationalAliases);
    if (internationalMatch) return internationalMatch.value;
  }

  return "";
};
