import http from "@/lib/http";

const BannerApi = {
  getBannerPage: (page: string) => http.get<any>(`/banner?page=${page}`),
};

export { BannerApi };
