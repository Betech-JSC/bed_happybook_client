import { arrLanguages } from "@/constants/language";
import { HttpError } from "./error";

type httpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function getLocaleForHttp(): Promise<string> {
  let locale: string | undefined;

  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    locale = cookies().get("locale")?.value;
  } else {
    const match = document.cookie.match(/(^| )locale=([^;]+)/);
    locale = match ? decodeURIComponent(match[2]) : undefined;
  }

  if (locale && arrLanguages.includes(locale)) {
    return locale;
  }

  return "vi";
}

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
  // const locale = await getLocaleForHttp();

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
        // language: locale,
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
      if (data?.status === 401) {
        return data;
      } else {
        throw new HttpError({ status: response.status, payload: payload });
      }
    }
    return data;
  } catch (error) {
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
