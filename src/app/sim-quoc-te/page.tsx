import type { Metadata } from "next";
import EsimProductPage from "../sim-du-lich/components/EsimProductPage";
import SimDuLichFooter from "../sim-du-lich/components/SimDuLichFooter";
import { getServerLang } from "@/lib/session";
import { loadSimDuLichPageData } from "../sim-du-lich/lib/page-data";
import { buildSimDuLichMetadata } from "../sim-du-lich/lib/metadata";
import SimDuLichBreadcrumbSchema from "../sim-du-lich/components/SimDuLichBreadcrumbSchema";
import { getServerTranslations } from "@/lib/i18n/serverTranslations";
import { siteUrl } from "@/constants";
import { toSnakeCase } from "@/utils/Helper";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLang();
  return buildSimDuLichMetadata(language, "quoc-te");
}

export default async function SimQuocTePage() {
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
            url: `${siteUrl}/sim-quoc-te`,
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
