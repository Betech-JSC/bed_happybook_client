import { FaqApi } from "@/api/Faq";
import { PageApi } from "@/api/Page";

export async function loadSimDuLichPageData(language: string) {
  const contentPage = (await PageApi.getContent("sim-du-lich", language))?.payload?.data as any;
  const faqItems = ((await FaqApi.list(2, language, "esim"))?.payload?.data as any[]) || [];

  return { contentPage, faqItems };
}
