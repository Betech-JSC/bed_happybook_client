import type { Metadata } from "next";
import SimDuLichLandingPage from "./components/SimDuLichLandingPage";
import { getServerLang } from "@/lib/session";
import { loadSimDuLichPageData } from "./lib/page-data";
import { buildSimDuLichMetadata } from "./lib/metadata";
import SimDuLichBreadcrumbSchema from "./components/SimDuLichBreadcrumbSchema";
import { getServerTranslations } from "@/lib/i18n/serverTranslations";
import { siteUrl } from "@/constants";
import { toSnakeCase } from "@/utils/Helper";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLang();
  return buildSimDuLichMetadata(language, "root");
}

export default async function SimDuLichPage() {
  const language = await getServerLang();
  const { contentPage } = await loadSimDuLichPageData(language);
  const translations = await getServerTranslations(language);
  const t = (text: string, fallback?: string) =>
    translations[toSnakeCase(text)] || fallback || text;

  return (
    <>
      <SimDuLichBreadcrumbSchema
        items={[
          {
            url: `${siteUrl}/sim-du-lich`,
            name: t("Sim du lịch", "Sim du lịch"),
          },
        ]}
      />
      <SimDuLichLandingPage
        language={language}
        cmsPageContent={contentPage}
      />
    </>
  );
}
