import { arrLanguages } from "@/constants/language";
import http from "@/lib/http";

const path = "/page";

const PageApi = {
  footerMenu: (page: string) => http.get<any>(`${path}/footer-menu/${page}`),
  getContent: (page: string, locale?: string) => {
    locale = locale && arrLanguages.includes(locale) ? locale : "vi";
    return http.get<any>(`${path}?slug=${page}&locale=${locale}`);
  },
};

export { PageApi };
