import http from "@/lib/http";

const path = "/products/hotel";

const HotelApi = {
  detail: (slug: string, data: any = null) =>
    http.get<any>(`${path}/${slug}`, data),
  getCategory: (alias: string, data: any = null) =>
    http.get<any>(`${path}/categories/${alias}`, data),
  getLocations: () => http.get<any>("product/hotel/locations"),
  getAll: () => http.get<any>("product/hotel/all"),
};

export { HotelApi };
