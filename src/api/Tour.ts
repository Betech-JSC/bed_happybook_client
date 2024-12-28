import http from "@/lib/http";

const path = "/products/tour";

const TourApi = {
  detail: (slug: string, data: any = null) => http.get<any>(`${path}/${slug}`, data),
  getCategory: (alias: string, data: any = null) =>
    http.get<any>(`${path}/categories/${alias}`, data),
};

export { TourApi };
