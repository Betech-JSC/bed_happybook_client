import http from "@/lib/http";

const path = "product/amusement-ticket";

/**
 * Tạo options header với language cho SSR Server Components.
 * http.ts đọc language từ header khi window === undefined (SSR).
 */
const langHeader = (locale?: string) =>
  locale ? { headers: { language: locale } } : undefined;

const ProductTicket = {
  search: (query: string, locale?: string) =>
    http.get<any>(`${path}/search${query}`, langHeader(locale)),
  location: (query: string, locale?: string) =>
    http.get<any>(`${path}/location${query}`, langHeader(locale)),
  detail: (slug: string, departDate?: string, locale?: string) =>
    http.get<any>(
      `${path}/detail/${slug}?departDate=${departDate ?? ""}`,
      langHeader(locale)
    ),
  detailBySlug: (slug: string, locale?: string) =>
    http.get<any>(`${path}/detail-by-slug/${slug}`, langHeader(locale)),
  getOptionsFilter: () => http.get<any>(`${path}/options-filter`),
};

export { ProductTicket };
