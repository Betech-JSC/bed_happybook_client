import { arrLanguages } from "@/constants/language";
import http from "@/lib/http";

const path = "product/locations";

const ProductLocation = {
  list: (locale?: string) => {
    locale = locale && arrLanguages.includes(locale) ? locale : "vi";
    return http.get<any>(`${path}/all?locale=${locale}`);
  },
};

export { ProductLocation };
