import http from "@/lib/http";

const path = "product/insurance";

const ProductInsurance = {
  search: (queryString: string) => http.get<any>(queryString),
  detail: (slug: string) => http.get<any>(`${path}/detail/${slug}`),
};

export { ProductInsurance };
