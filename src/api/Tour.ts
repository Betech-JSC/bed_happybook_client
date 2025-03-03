import { arrLanguages } from "@/constants/language";
import http from "@/lib/http";

const path = "/products/tour";

const TourApi = {
  detail: (slug: string, locale?: string) => {
    locale = locale && arrLanguages.includes(locale) ? locale : "vi";
    return http.get<any>(`/product/tours/detail/${slug}?locale=${locale}`);
  },

  getCategory: (alias: string, data: any = null) =>
    http.get<any>(`${path}/categories/${alias}`, data),

  getAll: () => http.get<any>("/product/tours/all"),

  search: (url: string) => http.get<any>(url),
  getOptionsFilter: (typeTour: number | undefined) =>
    http.get<any>(`product/tours/options-filter?typeTour=${typeTour}`),
};

export { TourApi };
