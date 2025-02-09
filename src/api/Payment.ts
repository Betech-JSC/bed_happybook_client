import http from "@/lib/http";

const path = "payment";

const PaymentApi = {
  generateQrCodeAirlineTicket: (orderCode: string) =>
    http.post<any>(`${path}/generate-qr-code/airline-ticket`, {
      order_code: orderCode,
    }),
};

export { PaymentApi };
