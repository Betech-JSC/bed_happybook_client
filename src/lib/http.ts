class HttpError extends Error {
  status: number;
  payload: any;
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

type httpMethod = "GET" | "POST" | "PUT" | "DELETE";

const request = async <Response>(
  method: httpMethod,
  url: string,
  options?: RequestInit | undefined,
  timeout: number = 10000,
  timeCache: number = 0
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const baseHeader = {
    "Content-type": "application/json",
  };

  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...baseHeader,
        ...options?.headers,
      },
      body,
      method,
      next: { revalidate: timeCache },
    });
    clearTimeout(timeoutId);

    const payload: Response = await response.json();
    const data = {
      status: response.status,
      payload: payload,
    };

    if (!response.ok) {
      const errorMessage = response.statusText || "Lỗi không xác định";
      throw new HttpError({ status: response.status, payload: errorMessage });
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new HttpError({ status: 408, payload: "Request timeout" });
      }
      throw new HttpError({ status: 500, payload: "Server Error" });
    } else {
      console.error("Unknown error:123123");
    }
  }
  return null;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<RequestInit, "body"> | undefined,
    timeout?: number,
    timeCache?: number
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<RequestInit, "body"> | undefined,
    timeout?: number,
    timeCache?: number
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<RequestInit, "body"> | undefined,
    timeout?: number,
    timeCache?: number
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    body: any,
    options?: Omit<RequestInit, "body"> | undefined,
    timeout?: number,
    timeCache?: number
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
