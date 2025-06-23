import http from "@/lib/http";

const path = "/voucher-program";

const VoucherProgramApi = {
  list: () => http.get<any>(`${path}/list`),
};

export { VoucherProgramApi };
