import http from "@/lib/http";

const path = "product";

const KeywordSearchApi = {
  products: (keyword: string) =>
    http.get<any>(`search-by-keyword?keyword=${keyword}`),
};

export { KeywordSearchApi };
