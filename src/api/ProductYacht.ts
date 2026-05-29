import http from "@/lib/http";

const path = "product/yacht";

const langHeader = (locale?: string) =>
  locale ? { headers: { language: locale } } : undefined;

const ProductYachtApi = {
  search: (query: string) => http.get<any>(`${path}/search${query}`),
  location: (query: string) => http.get<any>(`${path}/location${query}`),
  detail: (slug: string, departDate?: string, locale?: string) =>
    http.get<any>(
      `${path}/detail/${slug}?departDate=${departDate ?? ""}`,
      langHeader(locale)
    ),
  detailBySlug: (slug: string, locale?: string) =>
    http.get<any>(`${path}/detail-by-slug/${slug}`, langHeader(locale)),
  getOptionsFilter: (locale?: string) =>
    http.get<any>(`${path}/options-filter`, langHeader(locale)),
};

export { ProductYachtApi };
