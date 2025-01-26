import http from "@/lib/http";

const path = "/products/tour";

const TourApi = {
  detail: (slug: string) => http.get<any>(`/product/tours/detail/${slug}`),

  getCategory: (alias: string, data: any = null) =>
    http.get<any>(`${path}/categories/${alias}`, data),

  getAll: () => http.get<any>("/product/tours/all"),

  search: (url: string) => http.get<any>(url),
  getOptionsFilter: (typeTour: number | undefined) =>
    http.get<any>(`product/tours/options-filter?typeTour=${typeTour}`),
};

export { TourApi };
