import http from "@/lib/http";

const path = "product/insurance";
const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;

const ProductInsurance = {
  search: (queryString: string) => http.get<any>(queryString),
  detail: (slug: string) => http.get<any>(`${path}/detail/${slug}`),
  options: () => http.get<any>(`${path}/options`),
  downLoadSampleExcel: () =>
    fetch(`${baseUrl}/${path}/export-sample-excel`, {
      method: "GET",
    }),
};

export { ProductInsurance };
