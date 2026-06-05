import http from "@/lib/http";

const path = "product/business-lounge";

/**
 * Tạo options header với language cho SSR Server Components.
 * http.ts đọc language từ header khi window === undefined (SSR).
 */
const langHeader = (locale?: string) =>
  locale ? { headers: { language: locale } } : undefined;

const ProductBusinessLoungeApi = {
  search: (query: string) => http.get<any>(`${path}/search${query}`),
  location: (query: string) => http.get<any>(`${path}/location${query}`),
  detail: (slug: string, departDate?: string, locale?: string) =>
    http.get<any>(
      `${path}/detail/${slug}?departDate=${departDate ?? ""}`,
      langHeader(locale)
    ),
  detailBySlug: (slug: string, locale?: string) =>
    http.get<any>(`${path}/detail-by-slug/${slug}`, langHeader(locale)),
  getOptionsFilter: () => http.get<any>(`${path}/options-filter`),
};

export { ProductBusinessLoungeApi };
