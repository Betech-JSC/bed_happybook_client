import http from "@/lib/http";

const path = "product-categories";

const ProductCategoryApi = {
  detail: (productType: string, alias: string) =>
    http.get<any>(`${path}/detail/${productType}/${alias}`),
  listByType: (productType: string) =>
    http.get<any>(`${path}/list/${productType}`),
};

export { ProductCategoryApi };
