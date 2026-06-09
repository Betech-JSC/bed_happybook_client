import http from "@/lib/http";

const path = "product/fast-track";

/**
 * Tạo options header với language cho SSR Server Components.
 * http.ts đọc language từ header khi window === undefined (SSR).
 */
const langHeader = (locale?: string) =>
  locale ? { headers: { language: locale } } : undefined;

const noStoreLangHeader = (locale?: string): RequestInit => ({
  cache: "no-store",
  ...(locale ? { headers: { language: locale } } : {}),
});

const ProductFastTrackApi = {
  search: (query: string) => http.get<any>(`${path}/search${query}`),
  location: (query: string) => http.get<any>(`${path}/location${query}`),
  detail: (slug: string, departDate?: string, locale?: string) =>
    http.get<any>(
      `${path}/detail/${slug}?departDate=${departDate ?? ""}`,
      noStoreLangHeader(locale),
      10000,
      0
    ),
  detailBySlug: (slug: string, locale?: string) =>
    http.get<any>(
      `${path}/detail-by-slug/${slug}`,
      noStoreLangHeader(locale),
      10000,
      0
    ),
  getOptionsFilter: () => http.get<any>(`${path}/options-filter`),
  getAdditionalFees: (locale?: string) =>
    http.get<any>(`${path}/additional-fees`, langHeader(locale)),
};

export { ProductFastTrackApi };
