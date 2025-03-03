import http from "@/lib/http";

const path = "product/amusement-ticket";

const ProductTicket = {
  search: (query: string) => http.get<any>(`${path}/search${query}`),
  detail: (slug: string) => http.get<any>(`${path}/detail/${slug}`),
  getOptionsFilter: () => http.get<any>(`${path}/options-filter`),
};

export { ProductTicket };
