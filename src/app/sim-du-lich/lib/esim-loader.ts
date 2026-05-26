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

export const loadAllEsimPackages = async (params?: {
  q?: string;
  region_id?: string;
  destination_id?: string;
  operator?: string;
  locale?: string;
}) => {
  try {
    const firstPage = await ProductEsimApi.search(
      {
        q: params?.q,
        region_id: params?.region_id,
        destination_id: params?.destination_id,
        operator: params?.operator,
        page: 1,
        page_size: 100,
      },
      params?.locale
    );

    const payload = safeGetPayload(firstPage);
    if (!payload) return [];

    const items = [...((payload.items ?? []) as any)];
    const lastPage = Number(payload.last_page ?? 1) || 1;

    if (lastPage > 1) {
      for (let page = 2; page <= lastPage; page += 1) {
        const nextPage = await ProductEsimApi.search(
          {
            q: params?.q,
            region_id: params?.region_id,
            destination_id: params?.destination_id,
            operator: params?.operator,
            page,
            page_size: 100,
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
    return [];
  }
};

export const loadEsimOptions = async (locale?: string): Promise<EsimFilterOptions> => {
  try {
    const response = await ProductEsimApi.getOptionsFilter(locale);
    const payload = safeGetPayload(response);
    if (!payload) return { regions: [], destinations: [], operators: [] };
    return normalizeFilterOptions(payload, locale === "en" ? "en" : "vi");
  } catch {
    return { regions: [], destinations: [], operators: [] };
  }
};

export const loadEsimPackageBySlug = async (slug: string, locale?: string): Promise<EsimPackageView | null> => {
  const response = await ProductEsimApi.detailBySlug(slug, locale);
  const detail = unwrapResponseData(response?.payload) as ApiEsimPackage | null;

  if (!detail) return null;

  return normalizeEsimPackages([detail])[0] ?? null;
};
