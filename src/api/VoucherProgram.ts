import http from "@/lib/http";

const path = "/voucher-program";

const VoucherProgramApi = {
  search: (productType: string, code: string) =>
    http.get<any>(`${path}/search?type=${productType}&code=${code}`),
  list: (productType: string) =>
    http.get<any>(`${path}/list?type=${productType}`),
};

export { VoucherProgramApi };
