import { arrLanguages } from "@/constants/language";
import http from "@/lib/http";

const FaqApi = {
  list: (attribute_id: number = 2, locale?: string, site: string = 'happybook') => {
    locale = locale && arrLanguages.includes(locale) ? locale : "vi";
    return http.get<any>(`/faqs?attribute_id=${attribute_id}&locale=${locale}&site=${encodeURIComponent(site)}`);
  },
};

export { FaqApi };
