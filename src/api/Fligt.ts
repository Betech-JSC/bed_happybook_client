import http from "@/lib/http";

const FlightApi = {
  search: (url: string, data: any) => http.post<any>(url, data),
  searchMonth: (url: string, data: any) => http.post<any>(url, data),
};

export { FlightApi };
