import http from "@/lib/http";

const FlightApi = {
  search: (url: string, data: any) => http.post<any>(url, data),
  searchMonth: (url: string, data: any) => http.post<any>(url, data),
  getFareRules: (url: string, data: any) => http.post<any>(url, data),
  getBaggage: (url: string, data: any) => http.post<any>(url, data),
  bookFlight: (url: string, data: any) => http.post<any>(url, data),
  airPorts: () => http.get<any>("danh-sach-diem-di-den-ve-may-bay"),
  searchAirPorts: (searchParams: string) =>
    http.get<any>(`airport/search?keyword=${searchParams}`),
  updatePaymentMethod: (data: any) =>
    http.post<any>(`update-payment-booking-flight`, data),
};

export { FlightApi };
