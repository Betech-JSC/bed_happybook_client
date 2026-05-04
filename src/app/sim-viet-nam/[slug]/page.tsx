import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EsimProductPage from "../../sim-du-lich/components/EsimProductPage";
import SimDuLichFooter from "../../sim-du-lich/components/SimDuLichFooter";
import { getServerLang } from "@/lib/session";
import { loadSimDuLichPageData } from "../../sim-du-lich/lib/page-data";
import { buildSimDuLichMetadata } from "../../sim-du-lich/lib/metadata";
import { loadEsimPackageBySlug } from "../../sim-du-lich/lib/esim-loader";
import SimDuLichBreadcrumbSchema from "../../sim-du-lich/components/SimDuLichBreadcrumbSchema";
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
    "viet-nam",
    detail?.title || detail?.destination || undefined,
    `/sim-viet-nam/${slug}`,
    detail as any
  );
}

export default async function SimVietNamDetailPage({
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
            url: `${siteUrl}/sim-viet-nam`,
            name: t("Sim du lịch Việt Nam", "Sim du lịch Việt Nam"),
          },
          {
            url: `${siteUrl}/sim-viet-nam/${slug}`,
            name: detail?.title || detail?.destination || slug,
          },
        ]}
      />
      <EsimProductPage
        footerContent={<SimDuLichFooter />}
        cmsPageContent={contentPage}
        faqItems={faqItems}
        initialCategory="viet-nam"
        initialPackageSlug={slug}
      />
    </>
  );
}
