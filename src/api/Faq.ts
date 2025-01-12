import http from "@/lib/http";

const FaqApi = {
  list: (attribute_id: number = 2) =>
    http.get<any>(`/faqs?attribute_id=${attribute_id}`),
};

export { FaqApi };
