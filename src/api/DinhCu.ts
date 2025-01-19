import http from "@/lib/http";

const path = "/product/dinhcu";

const DinhCuApi = {
  detail: (alias: string) => http.get<any>(`${path}/detail/${alias}`),
  getCategory: (alias: string, data: any = null) =>
    http.get<any>(`${path}/categories/${alias}`, data),
  search: (url: string) => http.get<any>(url),
  getOptionsFilter: () => http.get<any>("product/visa/options-filter"),
};

export { DinhCuApi };
