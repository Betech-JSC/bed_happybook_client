import http from "@/lib/http";

const FlightApi = {
  search: (url: string, data: any) => http.post<any>(url, data),
  searchMonth: (url: string, data: any) => http.post<any>(url, data),
  getFareRules: (url: string, data: any) => http.post<any>(url, data),
  getBaggage: (url: string, data: any) => http.post<any>(url, data),
  bookFlight: (url: string, data: any) => http.post<any>(url, data),
};

export { FlightApi };
