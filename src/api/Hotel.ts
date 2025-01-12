import http from "@/lib/http";

const path = "/products/hotel";

const HotelApi = {
  detail: (slug: string) => http.get<any>(`/product/hotel/detail/${slug}`),

  getCategory: (alias: string, data: any = null) =>
    http.get<any>(`${path}/categories/${alias}`, data),
  getLocations: () => http.get<any>("product/hotel/locations"),
  getAll: () => http.get<any>("product/hotel/all"),
  search: (url: string) => http.get<any>(url),
  getOptionsFilter: () => http.get<any>("product/hotel/options-filter"),
};

export { HotelApi };
