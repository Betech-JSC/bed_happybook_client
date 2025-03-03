import { arrLanguages } from "@/constants/language";
import http from "@/lib/http";

const FaqApi = {
  list: (attribute_id: number = 2, locale?: string) => {
    locale = locale && arrLanguages.includes(locale) ? locale : "vi";
    return http.get<any>(`/faqs?attribute_id=${attribute_id}&locale=${locale}`);
  },
};

export { FaqApi };
