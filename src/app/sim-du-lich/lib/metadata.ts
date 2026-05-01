import type { Metadata } from "next";
import { getServerTranslations } from "@/lib/i18n/serverTranslations";

type SimDuLichCategory = "root" | "quoc-te" | "viet-nam";

export async function buildSimDuLichMetadata(
  language: string,
  category: SimDuLichCategory = "root",
  detailTitle?: string
): Promise<Metadata> {
  const translations = await getServerTranslations(language);
  const t = (key: string, fallback: string) => translations[key] || fallback;

  const pageTitle =
    category === "viet-nam"
      ? "Sim du lịch Việt Nam eSIM | HappyBook Travel"
      : category === "quoc-te"
        ? "Sim du lịch quốc tế eSIM | HappyBook Travel"
        : "Sim du lịch eSIM | HappyBook Travel";

  const pageDescription =
    category === "viet-nam"
      ? "Mua eSIM du lịch Việt Nam giá tốt, nhận QR qua email tức thì."
      : category === "quoc-te"
        ? "Mua eSIM du lịch quốc tế giá tốt, nhận QR qua email tức thì. Phủ sóng Nhật Bản, Hàn Quốc, Thái Lan, Trung Quốc, Châu Âu, Mỹ và hơn 30 quốc gia."
        : "Mua eSIM du lịch giá tốt, nhận QR qua email tức thì.";

  const title = detailTitle ? `${detailTitle} | ${pageTitle}` : pageTitle;

  return {
    title: t(title, title),
    description: t(pageDescription, pageDescription),
    openGraph: {
      title: t(title, title),
      description: t(pageDescription, pageDescription),
    },
  };
}
