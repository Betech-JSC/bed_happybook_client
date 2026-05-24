import http from "@/lib/http";

const HomeApi = {
  index: (productType: string) => http.get<any>(`home?product=${productType}`),
};

export { HomeApi };
