import { FaqApi } from "@/api/Faq";
import { PageApi } from "@/api/Page";
import type { EsimCmsPageContent } from "./cms-content";

export async function loadSimDuLichContentPage(language: string): Promise<EsimCmsPageContent | null> {
  return (await PageApi.getContent("sim-du-lich", language))?.payload?.data as EsimCmsPageContent | null;
}

export async function loadSimDuLichPageData(language: string) {
  const [contentPage, faqResponse] = await Promise.all([
    loadSimDuLichContentPage(language),
    FaqApi.list(2, language, "esim"),
  ]);
  const faqItems = (faqResponse?.payload?.data as any[]) || [];

  return { contentPage, faqItems };
}
