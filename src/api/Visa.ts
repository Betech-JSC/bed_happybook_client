import http from "@/lib/http";

const VisaApi = {
  detail: (url: string, data: any) => http.get<any>(url, data),
};

export { VisaApi };
