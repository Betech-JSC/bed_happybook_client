import http from "@/lib/http";

const contactApi = {
  send: (data: any) => http.post<any>(`contact/save`, data),
};

export { contactApi };
