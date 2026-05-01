import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EsimProductPage from "../../components/EsimProductPage";
import SimDuLichFooter from "../../components/SimDuLichFooter";
import { getServerLang } from "@/lib/session";
import { loadSimDuLichPageData } from "../../lib/page-data";
import { buildSimDuLichMetadata } from "../../lib/metadata";
import { loadEsimPackageBySlug } from "../../lib/esim-loader";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const language = await getServerLang();
  const { slug } = params;
  const detail = await loadEsimPackageBySlug(slug, language);
  if (!detail) notFound();

  return buildSimDuLichMetadata(language, "quoc-te", detail?.title || detail?.destination || undefined);
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

  return (
    <EsimProductPage
      footerContent={<SimDuLichFooter />}
      cmsPageContent={contentPage}
      faqItems={faqItems}
      initialCategory="quoc-te"
      initialPackageSlug={slug}
    />
  );
}
