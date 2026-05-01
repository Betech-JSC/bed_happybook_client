"use client";

import { useEffect, useMemo, useState } from "react";
import { loadEsimOptions } from "@/app/sim-du-lich/lib/esim-loader";
import type { EsimFilterOption } from "@/app/sim-du-lich/lib/esim";
import { getSimDuLichCategoryHref, normalizeSimDuLichCategory } from "@/app/sim-du-lich/lib/routes";

type SimDuLichRegionLink = {
  label: string;
  href: string;
};

export function useSimDuLichRegions(locale: string) {
  const [regions, setRegions] = useState<EsimFilterOption[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await loadEsimOptions(locale);
        if (!active) return;
        setRegions(data.regions || []);
      } catch (error) {
        console.error("Failed to load eSIM regions", error);
        if (active) setRegions([]);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [locale]);

  return useMemo<SimDuLichRegionLink[]>(
    () =>
      regions.map((region) => ({
        label: region.label,
        href: getSimDuLichCategoryHref(region.value, region.label),
      })),
    [regions]
  );
}

export { normalizeSimDuLichCategory };
