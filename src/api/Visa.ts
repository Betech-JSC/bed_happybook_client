import http from "@/lib/http";

const path = "/products/visa";

const langHeader = (
  language?: string
): Omit<RequestInit, "body"> | undefined =>
  language
    ? { headers: { language }, cache: "no-store" as RequestCache }
    : undefined;

const VisaApi = {
  detail: (alias: string, language?: string) =>
    http.get<any>(
      `product-visa/get-by-slug?slug=${alias}`,
      langHeader(language),
      10000,
      0 // no cache — ngôn ngữ khác nhau cần fetch fresh
    ),
  getCategory: (alias: string, data: any = null, language?: string) =>
    http.get<any>(`${path}/categories/${alias}`, { ...data, ...langHeader(language) }),
  getAll: (language?: string) =>
    http.get<any>("/product/visa/all", langHeader(language)),
  search: (url: string, language?: string) =>
    http.get<any>(url, langHeader(language)),
  getOptionsFilter: (params?: { text?: string; diem_den?: string }, language?: string) => {
    const searchParams = new URLSearchParams();
    if (params?.text?.trim()) searchParams.set("text", params.text.trim());
    if (params?.diem_den?.trim())
      searchParams.set("diem_den", params.diem_den.trim());
    const search = searchParams.toString()
      ? `?${searchParams.toString()}`
      : "";
    return http.get<any>(`product/visa/options-filter${search}`, langHeader(language));
  },
};

export { VisaApi };
