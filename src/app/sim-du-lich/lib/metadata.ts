import type { Metadata } from "next";
import { getServerTranslations } from "@/lib/i18n/serverTranslations";
import { siteUrl } from "@/constants";
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
};

const resolveImageUrl = (source?: SimDuLichSeoSource | null) => {
  if (!source) return "";
  const image = source.meta_image || "";
  if (image.trim()) {
    if (/^https?:\/\//i.test(image)) return image;
    return `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`;
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

export async function buildSimDuLichMetadata(
  language: string,
  category: SimDuLichCategory = "root",
  detailTitle?: string,
  canonicalPath?: string,
  seoSource?: SimDuLichSeoSource | null
): Promise<Metadata> {
  const translations = await getServerTranslations(language);
  const t = (key: string, fallback: string) => translations[key] || fallback;

  const defaultPageTitle =
    category === "viet-nam"
      ? "Sim du lịch Việt Nam eSIM | HappyBook Travel"
      : category === "quoc-te"
        ? "Sim du lịch quốc tế eSIM | HappyBook Travel"
        : "Sim du lịch eSIM | HappyBook Travel";

  const defaultPageDescription =
    category === "viet-nam"
      ? "Mua eSIM du lịch Việt Nam giá tốt, nhận QR qua email tức thì."
      : category === "quoc-te"
        ? "Mua eSIM du lịch quốc tế giá tốt, nhận QR qua email tức thì. Phủ sóng Nhật Bản, Hàn Quốc, Thái Lan, Trung Quốc, Châu Âu, Mỹ và hơn 30 quốc gia."
        : "Mua eSIM du lịch giá tốt, nhận QR qua email tức thì.";
  const defaultCanonical =
    category === "viet-nam"
      ? "/sim-viet-nam"
      : category === "quoc-te"
        ? "/sim-du-lich/quoc-te"
        : "/sim-du-lich";

  const title =
    seoSource?.meta_title?.trim() ||
    (detailTitle ? `${detailTitle} | ${defaultPageTitle}` : defaultPageTitle);
  const description =
    seoSource?.meta_description?.trim() ||
    seoSource?.description?.trim() ||
    defaultPageDescription;
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
