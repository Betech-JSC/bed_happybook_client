import http from "@/lib/http";

const path = "product/esim";

type EsimLanguage = string | undefined;

const langHeader = (locale?: EsimLanguage): Omit<RequestInit, "body"> | undefined =>
  locale ? { headers: { language: locale }, cache: "no-store" as RequestCache } : undefined;

const buildSearchQuery = (params?: {
  q?: string;
  keyword?: string;
  region_id?: string | number;
  destination_id?: string | number;
  operator?: string;
  operators?: Array<string | number> | string;
  page_size?: number;
  page?: number;
  compact?: boolean;
  card?: boolean;
  sort?: "newest" | "price-asc" | "price-desc";
  destination_ids?: Array<string | number> | string;
  is_featured?: number | boolean;
}) => {
  const searchParams = new URLSearchParams();

  if (params?.q?.trim()) searchParams.set("q", params.q.trim());
  if (params?.keyword?.trim()) searchParams.set("keyword", params.keyword.trim());
  if (params?.region_id !== undefined && params?.region_id !== null && `${params.region_id}`.trim() !== "") {
    searchParams.set("region_id", `${params.region_id}`);
  }
  if (params?.destination_id !== undefined && params?.destination_id !== null && `${params.destination_id}`.trim() !== "") {
    searchParams.set("destination_id", `${params.destination_id}`);
  }
  if (params?.operator?.trim()) searchParams.set("operator", params.operator.trim());
  if (params?.operators) {
    const value = Array.isArray(params.operators) ? params.operators.join(",") : params.operators;
    if (`${value}`.trim()) searchParams.set("operators", `${value}`.trim());
  }
  if (params?.destination_ids) {
    const value = Array.isArray(params.destination_ids) ? params.destination_ids.join(",") : params.destination_ids;
    if (`${value}`.trim()) searchParams.set("destination_ids", `${value}`.trim());
  }
  if (typeof params?.page_size === "number" && params.page_size > 0) {
    searchParams.set("page_size", `${params.page_size}`);
  }
  if (typeof params?.page === "number" && params.page > 0) {
    searchParams.set("page", `${params.page}`);
  }
  if (params?.compact) {
    searchParams.set("compact", "1");
  }
  if (params?.card) {
    searchParams.set("card", "1");
  }
  if (params?.sort) {
    searchParams.set("sort", params.sort);
  }
  if (params?.is_featured !== undefined && params?.is_featured !== null) {
    searchParams.set("is_featured", params.is_featured ? "1" : "0");
  }

  const search = searchParams.toString();
  return search ? `?${search}` : "";
};

const ProductEsimApi = {
  search: (params?: {
    q?: string;
    keyword?: string;
    region_id?: string | number;
    destination_id?: string | number;
    operator?: string;
    operators?: Array<string | number> | string;
    page_size?: number;
    page?: number;
    compact?: boolean;
    card?: boolean;
    sort?: "newest" | "price-asc" | "price-desc";
    destination_ids?: Array<string | number> | string;
    is_featured?: number | boolean;
  }, locale?: string) => http.get<any>(`${path}/search${buildSearchQuery(params)}`, langHeader(locale), 10000, 0),
  detail: (slug: string, locale?: string, compact?: boolean) =>
    http.get<any>(
      `${path}/detail/${slug}${compact ? "?compact=1" : ""}`,
      langHeader(locale),
      10000,
      0
    ),
  detailBySlug: (slug: string, locale?: string, compact?: boolean) =>
    http.get<any>(
      `${path}/detail-by-slug/${slug}${compact ? "?compact=1" : ""}`,
      langHeader(locale),
      10000,
      0
    ),
  getOptionsFilter: (locale?: string) =>
    http.get<any>(`${path}/options-filter`, langHeader(locale), 10000, 0),
  quote: (body: {
    variant_id: string | number;
    quantity?: number;
    payment_method?: "vietqr" | "onepay" | "paypal";
  }, locale?: string) => http.post<any>(`${path}/quote`, body, langHeader(locale)),
  checkout: (body: {
    variant_id: string | number;
    quantity?: number;
    contact_name?: string;
    contact_phone?: string;
    contact_email: string;
    delivery_method?: "email" | "sms" | "zalo";
    delivery_email?: string;
    delivery_phone?: string;
    payment_method: "vietqr" | "onepay" | "paypal";
    customer_id?: number;
    source?: string;
    notes?: string;
  }, locale?: string) => http.post<any>(`${path}/checkout`, body, langHeader(locale), 60000),
  paypalCaptureOrder: (body: {
    order_code?: string;
    paypal_order_id?: string;
  }, locale?: string) => http.post<any>(`${path}/paypal/capture-order`, body, langHeader(locale)),
};

export { ProductEsimApi };
