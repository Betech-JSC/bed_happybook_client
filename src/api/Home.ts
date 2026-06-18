import http from "@/lib/http";

const HomeApi = {
  index: (productType: string, locale?: string) =>
    http.get<any>(
      `home?product=${productType}`,
      locale ? { headers: { language: locale } } : undefined
    ),
};

export { HomeApi };
