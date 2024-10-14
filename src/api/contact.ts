import http from "@/lib/http";

const contactApi = {
  send: (data: any) => http.post<any>(`api/v1/contact/save`, data),
};

export { contactApi };
