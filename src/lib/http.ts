import { HttpError } from "./error";

type httpMethod = "GET" | "POST" | "PUT" | "DELETE";

// Default cache time for GET requests (5 minutes)
// This is the key fix for "Document request latency" Lighthouse issue
const DEFAULT_GET_CACHE = 60 * 5;

/** Next.js warns if both `cache: no-store` and `revalidate: 0` are set. */
function resolveFetchCache(
  timeCache: number,
  options?: RequestInit
): { cache?: RequestCache; next?: { revalidate: number } } {
  if (options?.cache === "no-store" || timeCache === 0) {
    return { cache: "no-store" };
  }
  return { next: { revalidate: timeCache } };
}

/** PHP display_errors may prepend HTML before JSON in local dev. */
function parseResponseJson<Response>(raw: string): Response {
  const trimmed = raw.trim();
  if (!trimmed) return {} as Response;

  try {
    return JSON.parse(trimmed) as Response;
  } catch {
    const jsonStart = trimmed.search(/[{[]/);
    if (jsonStart > 0) {
      try {
        return JSON.parse(trimmed.slice(jsonStart)) as Response;
      } catch {
        /* fall through */
      }
    }
    throw new SyntaxError("Response is not valid JSON");
  }
}

function defaultHttpTimeoutMs(): number {
  const fromEnv = Number(process.env.NEXT_PUBLIC_HTTP_TIMEOUT_MS);
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv;
  return 10000;
}

const request = async <Response>(
  method: httpMethod,
  url: string,
  options?: RequestInit | undefined,
  timeout: number = defaultHttpTimeoutMs(),
  timeCache: number = 0
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const language =
    typeof window !== "undefined"
      ? localStorage.getItem("language") || "vi"
      : "vi";
  const baseHeader = {
    "Content-type": "application/json",
    language: language,
  };

  const baseUrl =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_API_INTERNAL_ENDPOINT
      : process.env.NEXT_PUBLIC_API_ENDPOINT;
  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  console.log("Making fetch request to:", fullUrl);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const cacheOptions = resolveFetchCache(timeCache, options);
  const { cache: _cache, next: _next, ...restOptions } = options ?? {};

  try {
    const response = await fetch(fullUrl, {
      ...restOptions,
      headers: {
        ...baseHeader,
        ...options?.headers,
      },
      body,
      method,
      signal: controller.signal,
      ...cacheOptions,
    });
    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type") || "";
    const raw = await response.text();
    let payload: Response;

    try {
      payload = parseResponseJson<Response>(raw);
    } catch {
      const preview = raw.replace(/\s+/g, " ").slice(0, 280);
      console.error("[http] Response is not valid JSON", {
        url: fullUrl,
        status: response.status,
        contentType,
        preview,
      });
      throw new HttpError({
        status: response.ok ? 502 : response.status,
        payload: {
          code: "INVALID_JSON_RESPONSE",
          message:
            "API returned a non-JSON body (often HTML). Backend should return application/json for this route.",
          url: fullUrl,
          httpStatus: response.status,
        },
      });
    }

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
      const isAbort =
        error.name === "AbortError" ||
        ("code" in error && (error as DOMException).code === DOMException.ABORT_ERR);
      if (isAbort) {
        console.error("fetch AbortError:", error);
        throw new HttpError({ status: 408, payload: "Request timeout" });
      }
      console.error("fetch Error:", error.message, error, "url:", fullUrl);
      throw new HttpError({ status: 500, payload: "Server Error" });
    } else {
      console.error("Unknown Error:", error, "url:", fullUrl);
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
    timeout: number = defaultHttpTimeoutMs(),
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
    timeout: number = defaultHttpTimeoutMs(),
    timeCache: number = 0 // POST: never cache
  ) {
    return request<Response>("POST", url, { ...options, body }, timeout, timeCache);
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<RequestInit, "body"> | undefined,
    timeout: number = defaultHttpTimeoutMs(),
    timeCache: number = 0
  ) {
    return request<Response>("PUT", url, { ...options, body }, timeout, timeCache);
  },
  delete<Response>(
    url: string,
    body: any,
    options?: Omit<RequestInit, "body"> | undefined,
    timeout: number = defaultHttpTimeoutMs(),
    timeCache: number = 0
  ) {
    return request<Response>("DELETE", url, { ...options, body }, timeout, timeCache);
  },
};

export default http;
