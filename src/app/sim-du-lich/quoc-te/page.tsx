import type { Metadata } from "next";
import EsimProductPage from "../components/EsimProductPage";
import SimDuLichFooter from "../components/SimDuLichFooter";
import { getServerLang } from "@/lib/session";
import { loadSimDuLichContentPage, loadSimDuLichPageData } from "../lib/page-data";
import { buildSimDuLichMetadata } from "../lib/metadata";
import SimDuLichBreadcrumbSchema from "../components/SimDuLichBreadcrumbSchema";
import { getServerTranslations } from "@/lib/i18n/serverTranslations";
import { siteUrl } from "@/constants";
import { toSnakeCase } from "@/utils/Helper";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLang();
  const contentPage = await loadSimDuLichContentPage(language);
  return buildSimDuLichMetadata(language, "quoc-te", undefined, "/sim-du-lich/quoc-te", contentPage);
}

export default async function SimDuLichQuocTePage() {
  const language = await getServerLang();
  const { contentPage, faqItems } = await loadSimDuLichPageData(language);
  const translations = await getServerTranslations(language);
  const t = (text: string, fallback?: string) =>
    translations[toSnakeCase(text)] || fallback || text;

  return (
    <>
      <SimDuLichBreadcrumbSchema
        items={[
          {
            url: `${siteUrl}/sim-du-lich/quoc-te`,
            name: t("Sim du lịch quốc tế", "Sim du lịch quốc tế"),
          },
        ]}
      />
      <EsimProductPage
        footerContent={<SimDuLichFooter />}
        cmsPageContent={contentPage}
        faqItems={faqItems}
        initialCategory="quoc-te"
      />
    </>
  );
}
