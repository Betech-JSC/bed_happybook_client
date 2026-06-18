import http from "@/lib/http";

const langHeader = (locale?: string) =>
  locale ? { headers: { language: locale } } : undefined;

const BannerApi = {
  getBannerPage: (page: string, locale?: string) =>
    http.get<any>(`/banner?page=${page}`, langHeader(locale)),
};

export { BannerApi };
