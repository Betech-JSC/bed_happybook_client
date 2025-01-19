import http from "@/lib/http";

const path = "product/rating";

const ProductRating = {
  send: (data: any) => http.post<any>(`${path}/send`, data),
  list: (url: string) => http.get<any>(`${url}`),
};

export { ProductRating };
