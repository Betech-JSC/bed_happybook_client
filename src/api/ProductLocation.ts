import http from "@/lib/http";

const path = "product/locations";

const ProductLocation = {
  list: () => http.get<any>(`${path}/all`),
};

export { ProductLocation };
