import http from "@/lib/http";

const path = "/voucher-program";

const VoucherProgramApi = {
  search: (productType: string, code: string, customerId?: number) =>
    http.get<any>(
      `${path}/search?type=${productType}&code=${code}${customerId ? `&customer_id=${customerId}` : ""}`,
      { cache: "no-store" },
      10000,
      0
    ),
  list: (productType: string, customerId?: number) =>
    http.get<any>(
      `${path}/list?type=${productType}${customerId ? `&customer_id=${customerId}` : ""}`,
      { cache: "no-store" },
      10000,
      0
    ),
};

export { VoucherProgramApi };
