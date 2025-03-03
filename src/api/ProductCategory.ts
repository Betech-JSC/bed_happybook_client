import { arrLanguages } from "@/constants/language";
import http from "@/lib/http";

const path = "product-categories";

const ProductCategoryApi = {
  detail: (productType: string, alias: string, locale?: string) => {
    locale = locale && arrLanguages.includes(locale) ? locale : "vi";
    return http.get<any>(
      `${path}/detail/${productType}/${alias}?locale=${locale}`
    );
  },

  listByType: (productType: string, locale?: string) => {
    locale = locale && arrLanguages.includes(locale) ? locale : "vi";
    return http.get<any>(`${path}/list/${productType}?locale=${locale}`);
  },
};

export { ProductCategoryApi };
