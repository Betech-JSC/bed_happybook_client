import http from "@/lib/http";

const API_PAYMENT_URL = process.env.NEXT_PUBLIC_PAYMENT_API_ENDPOINT;
const PAYMENT_TW_API_ENDPOINT = process.env.NEXT_PUBLIC_PAYMENT_TW_API_ENDPOINT;
const PAYMENT_TW_BEARER_TOKEN = process.env.NEXT_PUBLIC_PAYMENT_TW_BEARER_TOKEN;

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
  onePay: async (orderCode: string) => {
    try {
      const response = await fetch(`${API_PAYMENT_URL}/onepay/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_code: orderCode }),
      });
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  },

  createReceipt: async (payload: {
    payment_method_id: number;
    total_amount: number;
    description: string;
    note: string;
    allocations: { ref_type: string; ref_code: string; amount: number }[];
  }) => {
    try {
      const response = await fetch(
        `${PAYMENT_TW_API_ENDPOINT}/api/v1/billings/receipts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PAYMENT_TW_BEARER_TOKEN}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  },
};

export { PaymentApi };
