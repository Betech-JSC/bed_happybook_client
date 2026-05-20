import http from "@/lib/http";

const HomeApi = {
  /** no-store: home payloads can exceed Next.js 2MB data cache limit */
  index: (productType: string) =>
    http.get<any>(`home?product=${productType}`, undefined, undefined, 0),
};

export { HomeApi };
