import Search from "@/components/home/search";
import http from "@/lib/http";

const path = "/products/visa";

const VisaApi = {
  detail: (alias: string) =>
    http.get<any>(`product-visa/get-by-slug?slug=${alias}`),
  getCategory: (alias: string, data: any = null) =>
    http.get<any>(`${path}/categories/${alias}`, data),
  getAll: () => http.get<any>("/product/visa/all"),
  search: (url: string) => http.get<any>(url),
  getOptionsFilter: () => http.get<any>("product/visa/options-filter"),
};

export { VisaApi };
