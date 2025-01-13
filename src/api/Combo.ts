import http from "@/lib/http";

const path = "/product/combo";

const ComboApi = {
  detail: (slug: string) => http.get<any>(`${path}/detail/${slug}`),
  getAll: () => http.get<any>(`${path}/all`),
  search: (url: string) => http.get<any>(url),
  getOptionsFilter: () => http.get<any>(`${path}/options-filter`),
};

export { ComboApi };
