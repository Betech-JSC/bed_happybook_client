import http from "@/lib/http";

const path = "product/amusement-ticket";

const ProductTicket = {
  search: (query: string) => http.get<any>(`${path}/location${query}`),
  detail: (slug: string, departDate: string) =>
    http.get<any>(`${path}/detail/${slug}?departDate=${departDate}`),
  getOptionsFilter: () => http.get<any>(`${path}/options-filter`),
};

export { ProductTicket };
