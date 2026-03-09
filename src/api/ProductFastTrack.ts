import http from "@/lib/http";

const path = "product/fast-track";

const ProductFastTrackApi = {
  search: (query: string, locale?: string) =>
    http.get<any>(`${path}/search${query}&locale=${locale ?? ""}`),
  location: (query: string, locale?: string) =>
    http.get<any>(`${path}/location${query}&locale=${locale ?? ""}`),
  detail: (slug: string, departDate?: string, locale?: string) =>
    http.get<any>(
      `${path}/detail/${slug}?departDate=${departDate ?? ""}&locale=${locale ?? ""
      }`
    ),
  detailBySlug: (slug: string, locale?: string) =>
    http.get<any>(`${path}/detail-by-slug/${slug}?locale=${locale ?? ""}`),
  getOptionsFilter: (locale?: string) =>
    http.get<any>(`${path}/options-filter?locale=${locale ?? ""}`),
  getAdditionalFees: (locale?: string) =>
    http.get<any>(`${path}/additional-fees?locale=${locale ?? ""}`),
};

export { ProductFastTrackApi };
