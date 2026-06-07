import { ProductEsimApi } from "@/api/ProductEsim";
import type { ApiEsimPackage, EsimFilterOptions, EsimPackageView } from "./esim";
import { normalizeEsimPackages, normalizeFilterOptions } from "./esim";

const unwrapResponseData = (payload: unknown): any => {
  if (!payload || typeof payload !== "object") return {};

  const data = (payload as { data?: unknown }).data;
  if (data && typeof data === "object") return data;

  return payload;
};

const safeGetPayload = (response: unknown): Record<string, unknown> | null => {
  if (!response || typeof response !== "object") return null;
  const resp = response as { payload?: { data?: Record<string, unknown> } };
  if (!resp.payload) return null;
  return resp.payload.data ?? null;
};

const createCacheKey = (scope: string, params?: Record<string, unknown>) =>
  `${scope}:${JSON.stringify(
    Object.entries(params ?? {})
      .filter(([, value]) => value !== undefined && value !== null && `${value}`.trim() !== "")
      .sort(([a], [b]) => a.localeCompare(b))
  )}`;

const CACHE_TTL_MS = 60_000;
const ESIM_SEARCH_PAGE_SIZE = 250;
const ESIM_CARD_PAGE_SIZE = 36;
const MAX_CACHE_ENTRIES = 50;

export type EsimSortMode = "newest" | "price-asc" | "price-desc";

export type EsimPackagePage = {
  items: EsimPackageView[];
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
};

type CacheEntry<T> = {
  value: Promise<T>;
  expiresAt: number;
};

const optionsCache = new Map<string, CacheEntry<EsimFilterOptions>>();
const packagePageCache = new Map<string, CacheEntry<EsimPackagePage>>();
const packageCache = new Map<string, CacheEntry<EsimPackageView[]>>();
const detailCache = new Map<string, CacheEntry<EsimPackageView | null>>();

const getCachedValue = <T>(cache: Map<string, CacheEntry<T>>, key: string): Promise<T> | null => {
  const entry = cache.get(key);
  if (!entry) return null;

  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.value;
};

const setCachedValue = <T>(cache: Map<string, CacheEntry<T>>, key: string, value: Promise<T>) => {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) cache.delete(oldestKey);
  }

  cache.set(key, {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
};

export const loadEsimPackagesPage = async (params?: {
  q?: string;
  region_id?: string;
  destination_ids?: string[];
  operators?: string[];
  page?: number;
  page_size?: number;
  sort?: EsimSortMode;
  locale?: string;
}): Promise<EsimPackagePage> => {
  const page = Math.max(1, Number(params?.page ?? 1) || 1);
  const pageSize = Math.max(1, Number(params?.page_size ?? ESIM_CARD_PAGE_SIZE) || ESIM_CARD_PAGE_SIZE);
  const cacheKey = createCacheKey("package-page", { ...params, page, page_size: pageSize });
  const cached = getCachedValue(packagePageCache, cacheKey);
  if (cached) return cached;

  const promise = (async () => {
    try {
      const response = await ProductEsimApi.search(
        {
          q: params?.q,
          region_id: params?.region_id,
          destination_ids: params?.destination_ids,
          operators: params?.operators,
          page,
          page_size: pageSize,
          sort: params?.sort,
          card: true,
        },
        params?.locale
      );

      const payload = safeGetPayload(response);
      const items = normalizeEsimPackages((payload?.items ?? []) as ApiEsimPackage[]);

      return {
        items,
        total: Number(payload?.total ?? items.length) || 0,
        perPage: Number(payload?.per_page ?? pageSize) || pageSize,
        currentPage: page,
        lastPage: Number(payload?.last_page ?? 1) || 1,
      };
    } catch {
      packagePageCache.delete(cacheKey);
      return {
        items: [],
        total: 0,
        perPage: pageSize,
        currentPage: page,
        lastPage: 1,
      };
    }
  })();

  setCachedValue(packagePageCache, cacheKey, promise);
  return promise;
};

export const loadAllEsimPackages = async (params?: {
  q?: string;
  region_id?: string;
  destination_id?: string;
  operator?: string;
  locale?: string;
}) => {
  const cacheKey = createCacheKey("packages", params);
  const cached = getCachedValue(packageCache, cacheKey);
  if (cached) return cached;

  const promise = (async () => {
    try {
      const firstPage = await ProductEsimApi.search(
        {
          q: params?.q,
          region_id: params?.region_id,
          destination_id: params?.destination_id,
          operator: params?.operator,
          page: 1,
          page_size: ESIM_SEARCH_PAGE_SIZE,
          card: true,
        },
        params?.locale
      );

      const payload = safeGetPayload(firstPage);
      if (!payload) return [];

      const items = [...((payload.items ?? []) as any)];
      const lastPage = Number(payload.last_page ?? 1) || 1;

      if (lastPage > 1) {
        for (let page = 2; page <= lastPage; page++) {
          const nextPage = await ProductEsimApi.search(
            {
              q: params?.q,
              region_id: params?.region_id,
              destination_id: params?.destination_id,
              operator: params?.operator,
              page,
              page_size: ESIM_SEARCH_PAGE_SIZE,
              card: true,
            },
            params?.locale
          );
          const nextPayload = safeGetPayload(nextPage);
          if (nextPayload) {
            items.push(...((nextPayload.items ?? []) as any));
          }
        }
      }

      return normalizeEsimPackages(items);
    } catch {
      packageCache.delete(cacheKey);
      return [];
    }
  })();

  setCachedValue(packageCache, cacheKey, promise);
  return promise;
};

export const loadEsimOptions = async (locale?: string): Promise<EsimFilterOptions> => {
  const cacheKey = createCacheKey("options", { locale });
  const cached = getCachedValue(optionsCache, cacheKey);
  if (cached) return cached;

  const promise = (async () => {
    try {
      const response = await ProductEsimApi.getOptionsFilter(locale);
      const payload = safeGetPayload(response);
      if (!payload) return { regions: [], destinations: [], operators: [] };
      return normalizeFilterOptions(payload, locale === "en" ? "en" : "vi");
    } catch {
      optionsCache.delete(cacheKey);
      return { regions: [], destinations: [], operators: [] };
    }
  })();

  setCachedValue(optionsCache, cacheKey, promise);
  return promise;
};

export const loadEsimPackageBySlug = async (slug: string, locale?: string): Promise<EsimPackageView | null> => {
  const cacheKey = createCacheKey("detail", { slug, locale });
  const cached = getCachedValue(detailCache, cacheKey);
  if (cached) return cached;

  const promise = (async () => {
    try {
      const response = await ProductEsimApi.detailBySlug(slug, locale, true);
      const detail = unwrapResponseData(response?.payload) as ApiEsimPackage | null;

      if (!detail) return null;

      return normalizeEsimPackages([detail])[0] ?? null;
    } catch {
      detailCache.delete(cacheKey);
      return null;
    }
  })();

  setCachedValue(detailCache, cacheKey, promise);
  return promise;
};
