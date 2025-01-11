import http from "@/lib/http";

const path = "/products/visa";

const VisaApi = {
  detail: (url: string, data: any = null) => http.get<any>(url, data),
  getCategory: (alias: string, data: any = null) =>
    http.get<any>(`${path}/categories/${alias}`, data),
  getAll: () => http.get<any>("/product/visa/all"),
  getListByCategory: (url: string) => http.get<any>(url),
  getOptionsFilter: () => http.get<any>("product/visa/options-filter"),
};

export { VisaApi };
