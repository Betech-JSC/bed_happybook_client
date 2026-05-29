import { FaqApi } from "@/api/Faq";
import { PageApi } from "@/api/Page";
import { cache } from "react";
import type { EsimCmsPageContent } from "./cms-content";
import { measureSimDuLichServerTiming } from "./serverTiming";

const getSimDuLichContentPage = cache(async (language: string): Promise<EsimCmsPageContent | null> => {
  return (await PageApi.getContent("sim-du-lich", language))?.payload?.data as EsimCmsPageContent | null;
});

const getSimDuLichFaqItems = cache(async (language: string) => {
  const faqResponse = await FaqApi.list(2, language, "esim");
  return (faqResponse?.payload?.data as any[]) || [];
});

export async function loadSimDuLichContentPage(language: string): Promise<EsimCmsPageContent | null> {
  return measureSimDuLichServerTiming(`PageApi.getContent(sim-du-lich, ${language})`, async () => {
    return getSimDuLichContentPage(language);
  });
}

export async function loadSimDuLichPageData(language: string) {
  return measureSimDuLichServerTiming(`loadSimDuLichPageData(${language})`, async () => {
    const [contentPage, faqItems] = await Promise.all([
      loadSimDuLichContentPage(language),
      getSimDuLichFaqItems(language),
    ]);

    return { contentPage, faqItems };
  });
}
