import http from "@/lib/http";

const HomeApi = {
  index: () => http.get<any>("home"),
};

export { HomeApi };
