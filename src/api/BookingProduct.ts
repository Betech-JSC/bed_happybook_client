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
  Tour: (data: any) => http.post<any>(`${path}/tour`, data, undefined, 60000),
  Hotel: (data: any) => http.post<any>(`${path}/hotel`, data, undefined, 60000),
  Visa: (data: any) => http.post<any>(`${path}/visa`, data, undefined, 60000),
  DinhCu: (data: any) => http.post<any>(`${path}/dinhcu`, data, undefined, 60000),
  Combo: (data: any) => http.post<any>(`${path}/combo`, data, undefined, 60000),
  Ticket: (data: any) => http.post<any>(`${path}/ticket`, data, undefined, 60000),
  Yacht: (data: any) => http.post<any>(`${path}/yacht`, data, undefined, 60000),
  FastTrack: (data: any) => http.post<any>(`${path}/fast-track`, data, undefined, 60000),
  BusinessLounge: (data: any) => http.post<any>(`${path}/business-lounge`, data, undefined, 60000),
  updatePaymentMethod: (data: any) =>
    http.post<any>(`${path}/update-payment-method`, data, undefined, 60000),
  paypalCreateOrder: (body: { order_code: string }) =>
    http.post<any>(`${path}/paypal/create-order`, body),
  paypalCaptureOrder: (body: { order_code?: string; paypal_order_id?: string }) =>
    http.post<any>(`${path}/paypal/capture-order`, body),
  paymentInfo: (orderCode: string) =>
    http.get<any>(`${path}/payment-info/${encodeURIComponent(orderCode)}`, {}, 10000, 0),
  getByCode: (orderCode: string) =>
    http.get<any>(`${path}/${encodeURIComponent(orderCode)}`, undefined, 10000, 0),
  History: (token: string | undefined, productType: string, page: number) =>
    http.get<any>(`${path}/${productType}/history?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  paypalCreateTicketOrder: (body: { order_code: string }) =>
    http.post<any>(`product/amusement-ticket/paypal/create-order`, body),
  paypalCaptureTicketOrder: (body: { paypal_order_id?: string; order_code?: string }) =>
    http.post<any>(`product/amusement-ticket/paypal/capture-order`, body),
  HistoryAll: (token: string | undefined, page: number, pageSize: number = 10) =>
    http.get<any>(`${path}/history/all?page=${page}&page_size=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }, 10000, 0),
};

export { BookingProductApi, EsimApi };
