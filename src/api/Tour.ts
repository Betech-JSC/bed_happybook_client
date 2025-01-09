import http from "@/lib/http";

const path = "/products/tour";

const TourApi = {
  detail: (slug: string) => http.get<any>(`/product/tours/detail/${slug}`),

  getCategory: (alias: string, data: any = null) =>
    http.get<any>(`${path}/categories/${alias}`, data),

  getAll: () => http.get<any>("/product/tours/all"),

  getToursByType: (typeTour: number) =>
    http.get<any>(`/product/tours/list-by-type-tour/${typeTour}`),
};

export { TourApi };
