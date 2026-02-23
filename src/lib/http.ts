import { HttpError } from "./error";

type httpMethod = "GET" | "POST" | "PUT" | "DELETE";

// Default cache time for GET requests (5 minutes)
// This is the key fix for "Document request latency" Lighthouse issue
const DEFAULT_GET_CACHE = 60 * 5;

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

  const baseUrl =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_API_INTERNAL_ENDPOINT
      : process.env.NEXT_PUBLIC_API_ENDPOINT;
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
      signal: controller.signal,
      next: { revalidate: timeCache },
    });
    clearTimeout(timeoutId);

    const payload: Response = await response.json();
    const data = {
      status: response.status,
      payload: payload,
    };

    if (!response.ok) {
      if (data?.status === 401) {
        return data;
      } else {
        throw new HttpError({ status: response.status, payload: payload });
      }
    }
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof HttpError) {
      throw error;
    } else if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new HttpError({ status: 408, payload: "Request timeout" });
      }
      throw new HttpError({ status: 500, payload: "Server Error" });
    } else {
      throw new HttpError({
        status: 500,
        payload: "Unknown server error",
      });
    }
  }
  return null;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<RequestInit, "body"> | undefined,
    timeout: number = 10000,
    // ✅ Fixed: was always 0 (no cache). Now defaults to 5 min.
    // This is the root cause of the 3,820ms document latency.
    timeCache: number = DEFAULT_GET_CACHE
  ) {
    return request<Response>("GET", url, options, timeout, timeCache);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<RequestInit, "body"> | undefined,
    timeout: number = 10000,
    timeCache: number = 0 // POST: never cache
  ) {
    return request<Response>("POST", url, { ...options, body }, timeout, timeCache);
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<RequestInit, "body"> | undefined,
    timeout: number = 10000,
    timeCache: number = 0
  ) {
    return request<Response>("PUT", url, { ...options, body }, timeout, timeCache);
  },
  delete<Response>(
    url: string,
    body: any,
    options?: Omit<RequestInit, "body"> | undefined,
    timeout: number = 10000,
    timeCache: number = 0
  ) {
    return request<Response>("DELETE", url, { ...options, body }, timeout, timeCache);
  },
};

export default http;
