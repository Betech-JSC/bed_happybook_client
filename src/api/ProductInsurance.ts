import http from "@/lib/http";

const path = "/insurance";
const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;

const ProductInsurance = {
  search: (queryString: string) => http.get<any>(queryString),
  location: () => http.get<any>(`${path}/location`),
  detail: (id: string | number) => http.get<any>(`${path}/${id}`),
  booking: (data: any) => http.post<any>(`${path}/booking`, data),
  downLoadSampleExcel: () =>
    fetch(`${baseUrl}/insurance/sample-execel`, {
      method: "GET",
    }),
  import: (data: any) =>
    fetch(`${baseUrl}/insurance/import`, {
      method: "POST",
      body: data,
    }),
};

export { ProductInsurance };
