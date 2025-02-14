import http from "@/lib/http";

const API_PAYMENT_URL = process.env.NEXT_PUBLIC_PAYMENT_API_ENDPOINT;

const PaymentApi = {
  generateQrCodeAirlineTicket: async (orderCode: string) => {
    try {
      const response = await fetch(
        `${API_PAYMENT_URL}/api/generate-qr-code/airline-ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order_code: orderCode }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  },
  checkPaymentStatus: async (orderCode: string) =>
    http.get<any>(`/check-payment-status?order_code=${orderCode}`),
};

export { PaymentApi };
