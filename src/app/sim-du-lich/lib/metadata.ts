import type { Metadata } from "next";
import { getServerTranslations } from "@/lib/i18n/serverTranslations";
import { cmsUrl, siteUrl } from "@/constants";
import { formatMetadata } from "@/lib/formatters";

type SimDuLichCategory = "root" | "quoc-te" | "viet-nam";

type SimDuLichSeoSource = {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  meta_robots?: string | null;
  canonical_link?: string | null;
  meta_image?: string | null;
  image_url?: string | null;
  image_location?: string | null;
  page_name?: string | null;
  title?: string | null;
  description?: string | null;
  subtitle?: string | null;
  note?: string | null;
};

const resolveImageUrl = (source?: SimDuLichSeoSource | null) => {
  if (!source) return "";
  const image = source.meta_image || "";
  if (image.trim()) {
    if (/^https?:\/\//i.test(image)) return image;
    return `${cmsUrl}${image.startsWith("/") ? "" : "/"}${image}`;
  }

  if (source.image_url && source.image_location) {
    return `${source.image_url.replace(/\/+$/, "")}/${source.image_location.replace(/^\/+/, "")}`;
  }

  return "";
};

const resolveCanonicalUrl = (value?: string | null) => {
  const canonical = value?.trim() || "";
  if (!canonical) return "";
  if (/^https?:\/\//i.test(canonical)) return canonical;
  return `${siteUrl}${canonical.startsWith("/") ? "" : "/"}${canonical}`;
};

const firstNonEmptyText = (...values: Array<string | null | undefined>) =>
  values.map((value) => value?.trim()).find((value) => Boolean(value)) || "";

export async function buildSimDuLichMetadata(
  language: string,
  category: SimDuLichCategory = "root",
  detailTitle?: string,
  canonicalPath?: string,
  seoSource?: SimDuLichSeoSource | null
): Promise<Metadata> {
  const translations = await getServerTranslations(language);
  const t = (key: string, fallback: string) => translations[key] || fallback;

  const defaultCanonical =
    category === "viet-nam"
      ? "/sim-viet-nam"
      : category === "quoc-te"
        ? "/sim-du-lich/quoc-te"
        : "/sim-du-lich";

  const title = firstNonEmptyText(
    seoSource?.meta_title,
    seoSource?.title,
    seoSource?.page_name,
    detailTitle,
    "HappyBook Travel"
  );
  const description = firstNonEmptyText(
    seoSource?.meta_description,
    seoSource?.description,
    seoSource?.subtitle,
    seoSource?.note,
    seoSource?.page_name,
    seoSource?.title,
    detailTitle,
    title
  );
  const canonical =
    resolveCanonicalUrl(seoSource?.canonical_link) ||
    resolveCanonicalUrl(canonicalPath) ||
    resolveCanonicalUrl(defaultCanonical);
  const image = resolveImageUrl(seoSource);

  return formatMetadata({
      title: t(title, title),
      description: t(description, description),
      keywords: seoSource?.meta_keywords?.trim() || undefined,
    robots: seoSource?.meta_robots?.trim() || "index, follow",
    alternates: {
      canonical,
    },
    openGraph: {
      title: t(title, title),
      description: t(description, description),
      images: image
        ? [
            {
              url: image,
              alt: t(title, title),
            },
          ]
        : undefined,
    },
  });
}
