import type { Metadata } from "next";
import EsimProductPage from "../components/EsimProductPage";
import SimDuLichFooter from "../components/SimDuLichFooter";
import { getServerLang } from "@/lib/session";
import { loadSimDuLichPageData } from "../lib/page-data";
import { buildSimDuLichMetadata } from "../lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLang();
  return buildSimDuLichMetadata(language, "quoc-te");
}

export default async function SimDuLichQuocTePage() {
  const language = await getServerLang();
  const { contentPage, faqItems } = await loadSimDuLichPageData(language);

  return (
    <EsimProductPage
      footerContent={<SimDuLichFooter />}
      cmsPageContent={contentPage}
      faqItems={faqItems}
      initialCategory="quoc-te"
    />
  );
}
