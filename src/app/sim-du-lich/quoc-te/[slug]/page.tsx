import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EsimProductPage from "../../components/EsimProductPage";
import SimDuLichFooter from "../../components/SimDuLichFooter";
import { getServerLang } from "@/lib/session";
import { loadSimDuLichPageData } from "../../lib/page-data";
import { buildSimDuLichMetadata } from "../../lib/metadata";
import { loadEsimPackageBySlug } from "../../lib/esim-loader";
import SimDuLichBreadcrumbSchema from "../../components/SimDuLichBreadcrumbSchema";
import { getServerTranslations } from "@/lib/i18n/serverTranslations";
import { siteUrl } from "@/constants";
import { toSnakeCase } from "@/utils/Helper";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const language = await getServerLang();
  const { slug } = params;
  const detail = await loadEsimPackageBySlug(slug, language);
  if (!detail) notFound();

  return buildSimDuLichMetadata(
    language,
    "quoc-te",
    detail?.title || detail?.destination || undefined,
    `/sim-du-lich/quoc-te/${slug}`,
    detail
  );
}

export default async function SimDuLichQuocTeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const language = await getServerLang();
  const { slug } = params;
  const detail = await loadEsimPackageBySlug(slug, language);
  if (!detail) notFound();
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
          {
            url: `${siteUrl}/sim-du-lich/quoc-te/${slug}`,
            name: detail?.title || detail?.destination || slug,
          },
        ]}
      />
      <EsimProductPage
        footerContent={<SimDuLichFooter />}
        cmsPageContent={contentPage}
        faqItems={faqItems}
        initialCategory="quoc-te"
        initialPackageSlug={slug}
        initialSelectedPackage={detail}
      />
    </>
  );
}
