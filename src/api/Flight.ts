import http from "@/lib/http";
import { buildSearch } from "@/utils/Helper";
import { unstable_cache } from "next/cache";

const path = "/flights-v2";

const getCachedAirports = unstable_cache(
  async () => {
    const response = await http.get<any>("danh-sach-diem-di-den-ve-may-bay");
    return response?.payload?.data ?? [];
  },
  ["cached-flight-airports"],
  {
    revalidate: 60 * 60,
  }
);

const FlightApi = {
  search: (data: any) => http.post<any>(`${path}/search`, data),
  searchOperation: (data: any) =>
    http.post<any>(`${path}/search-flight-operation`, data),
  getFlightResource: (data: any) =>
    http.post<any>(`${path}/flight-resource`, data),
  searchCheapestFare: (data: any) => {
    const querySearch = buildSearch(data);
    return http.get<any>(`${path}/search-cheapest-fare${querySearch}`);
  },
  getFareRules: (data: any) => http.post<any>(`${path}/fare-rules`, data),
  getBaggage: (data: any) => http.post<any>(`${path}/list-ancillary`, data),
  getAirlines: (data: any) => http.post<any>(`${path}/airlines`, data),
  bookFlight: (url: string, data: any) => http.post<any>(url, data),
  airPorts: () => http.get<any>("danh-sach-diem-di-den-ve-may-bay"),
  getCachedAirports: getCachedAirports,
  searchAirPorts: (searchParams: string) =>
    http.get<any>(`airport/search?keyword=${searchParams}`),
  updatePaymentMethod: (data: any) =>
    http.post<any>(`update-payment-booking-flight`, data),
  getPopularFlights: () => http.get<any>("home/lay-chuyen-bay-pho-bien"),
  bookingHistory: (token: string | undefined, page: number) =>
    http.get<any>(`${path}/booking-history?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  bookingDetail: (token: string | undefined, orderCode: string) =>
    http.get<any>(`${path}/booking-detail/${orderCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export { FlightApi };
