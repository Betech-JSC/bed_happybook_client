import http from "@/lib/http";

const path = "booking";

const EsimApi = {
  History: (token: string | undefined, page: number) =>
    http.get<any>(`${path}/esim/history?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }, 10000, 0),
};

const BookingProductApi = {
  Tour: (data: any) => http.post<any>(`${path}/tour`, data),
  Hotel: (data: any) => http.post<any>(`${path}/hotel`, data),
  Visa: (data: any) => http.post<any>(`${path}/visa`, data),
  DinhCu: (data: any) => http.post<any>(`${path}/dinhcu`, data),
  Combo: (data: any) => http.post<any>(`${path}/combo`, data),
  Ticket: (data: any) => http.post<any>(`${path}/ticket`, data),
  Yacht: (data: any) => http.post<any>(`${path}/yacht`, data),
  FastTrack: (data: any) => http.post<any>(`${path}/fast-track`, data),
  BusinessLounge: (data: any) => http.post<any>(`${path}/business-lounge`, data),
  updatePaymentMethod: (data: any) =>
    http.post<any>(`${path}/update-payment-method`, data),
  getByCode: (orderCode: string) =>
    http.get<any>(`${path}/${encodeURIComponent(orderCode)}`, undefined, 10000, 0),
  History: (token: string | undefined, productType: string, page: number) =>
    http.get<any>(`${path}/${productType}/history?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export { BookingProductApi, EsimApi };
