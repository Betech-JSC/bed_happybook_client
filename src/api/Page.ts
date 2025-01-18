import http from "@/lib/http";

const path = "/page";

const PageApi = {
  footerMenu: (page: string) => http.get<any>(`${path}/footer-menu/${page}`),
  getContent: (page: string) => http.get<any>(`${path}?slug=${page}`),
};

export { PageApi };
