import http from "@/lib/http";

const path = "/products/visa";

const VisaApi = {
  detail: (alias: string) =>
    http.get<any>(`product-visa/get-by-slug?slug=${alias}`),
  getCategory: (alias: string, data: any = null) =>
    http.get<any>(`${path}/categories/${alias}`, data),
  getAll: () => http.get<any>("/product/visa/all"),
  search: (url: string) => http.get<any>(url),
  getOptionsFilter: (params?: { text?: string; diem_den?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.text?.trim()) searchParams.set("text", params.text.trim());
    if (params?.diem_den?.trim())
      searchParams.set("diem_den", params.diem_den.trim());
    const search = searchParams.toString()
      ? `?${searchParams.toString()}`
      : "";
    return http.get<any>(`product/visa/options-filter${search}`);
  },
};

export { VisaApi };
