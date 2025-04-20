import { arrLanguages } from "@/constants/language";
import http from "@/lib/http";

const path = "/products/tour";

const TourApi = {
  detail: (id: number, locale?: string) => {
    locale = locale && arrLanguages.includes(locale) ? locale : "vi";
    return http.get<any>(`/product/tours/detail/${id}?locale=${locale}`);
  },

  getDetailBySlug: (slug: string) =>
    http.get<any>(`/product/tours/tour-by-permalink?permalink=${slug}`),

  getCategory: (slug: string) => http.get<any>(`/product/tours/categories/${slug}`),

  getAll: () => http.get<any>("product/tours/all"),

  search: (url: string) => http.get<any>(url),
  getOptionsFilter: (typeTour: number | undefined) =>
    http.get<any>(`product/tours/options-filter?typeTour=${typeTour}`),

  getListCategoryTour: () => http.get<any>("/product/tours/categories"),
};

export { TourApi };
