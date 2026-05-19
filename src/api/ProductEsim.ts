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
  page_size?: number;
  page?: number;
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
  if (typeof params?.page_size === "number" && params.page_size > 0) {
    searchParams.set("page_size", `${params.page_size}`);
  }
  if (typeof params?.page === "number" && params.page > 0) {
    searchParams.set("page", `${params.page}`);
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
    page_size?: number;
    page?: number;
  }, locale?: string) => http.get<any>(`${path}/search${buildSearchQuery(params)}`, langHeader(locale), 10000, 0),
  detail: (slug: string, locale?: string) =>
    http.get<any>(`${path}/detail/${slug}`, langHeader(locale), 10000, 0),
  detailBySlug: (slug: string, locale?: string) =>
    http.get<any>(`${path}/detail-by-slug/${slug}`, langHeader(locale), 10000, 0),
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
  }, locale?: string) => http.post<any>(`${path}/checkout`, body, langHeader(locale)),
  paypalCaptureOrder: (body: {
    order_code?: string;
    paypal_order_id?: string;
  }, locale?: string) => http.post<any>(`${path}/paypal/capture-order`, body, langHeader(locale)),
};

export { ProductEsimApi };
