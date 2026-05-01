import { ProductEsimApi } from "@/api/ProductEsim";
import type { ApiEsimPackage, EsimFilterOptions, EsimPackageView } from "./esim";
import { normalizeEsimPackages, normalizeFilterOptions } from "./esim";

const unwrapResponseData = (payload: unknown): any => {
  if (!payload || typeof payload !== "object") return {};

  const data = (payload as { data?: unknown }).data;
  if (data && typeof data === "object") return data;

  return payload;
};

export const loadAllEsimPackages = async (params?: {
  q?: string;
  region_id?: string;
  destination_id?: string;
  operator?: string;
  locale?: string;
}) => {
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

  const payload = unwrapResponseData(firstPage?.payload);
  const items = [...((payload.items ?? []) as ApiEsimPackage[])];
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
      const nextPayload = unwrapResponseData(nextPage?.payload);
      items.push(...((nextPayload.items ?? []) as ApiEsimPackage[]));
    }
  }

  return normalizeEsimPackages(items);
};

export const loadEsimOptions = async (locale?: string): Promise<EsimFilterOptions> => {
  const response = await ProductEsimApi.getOptionsFilter(locale);
  return normalizeFilterOptions(unwrapResponseData(response?.payload), locale === "en" ? "en" : "vi");
};

export const loadEsimPackageBySlug = async (slug: string, locale?: string): Promise<EsimPackageView | null> => {
  const response = await ProductEsimApi.detailBySlug(slug, locale);
  const detail = unwrapResponseData(response?.payload) as ApiEsimPackage | null;

  if (!detail) return null;

  return normalizeEsimPackages([detail])[0] ?? null;
};
