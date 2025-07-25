import { arrLanguages } from "@/constants/language";
import http from "@/lib/http";

const path = "product/flight";

const ProductFlightApi = {
  categoryDetail: (alias: string, locale?: string) => {
    locale = locale && arrLanguages.includes(locale) ? locale : "vi";
    return http.get<any>(`${path}/category/${alias}?locale=${locale}`);
  },
  getFlights: (flightType: string, categoryId?: number) =>
    http.get<any>(`${path}/${flightType}?category=${categoryId ?? 0}`),
};

export { ProductFlightApi };
