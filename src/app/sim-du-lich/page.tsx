import type { Metadata } from "next";
import EsimProductPage from "./components/EsimProductPage";
import FAQ from "@/components/content-page/FAQ";
import { FaqApi } from "@/api/Faq";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import { PageApi } from "@/api/Page";
import { getServerLang } from "@/lib/session";
import { getServerTranslations } from "@/lib/i18n/serverTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLang();
  const translations = await getServerTranslations(language);
  const t = (key: string, fallback: string) => translations[key] || fallback;

  return {
    title: t("Sim du lịch quốc tế eSIM | HappyBook Travel", "Sim du lịch quốc tế eSIM | HappyBook Travel"),
    description: t(
      "Mua eSIM du lịch quốc tế giá tốt, nhận QR qua email tức thì. Phủ sóng Nhật Bản, Hàn Quốc, Thái Lan, Trung Quốc, Châu Âu, Mỹ và hơn 30 quốc gia.",
      "Mua eSIM du lịch quốc tế giá tốt, nhận QR qua email tức thì. Phủ sóng Nhật Bản, Hàn Quốc, Thái Lan, Trung Quốc, Châu Âu, Mỹ và hơn 30 quốc gia."
    ),
    openGraph: {
      title: t("Sim du lịch quốc tế eSIM | HappyBook Travel", "Sim du lịch quốc tế eSIM | HappyBook Travel"),
      description: t(
        "Mua eSIM du lịch quốc tế giá tốt, nhận QR qua email tức thì.",
        "Mua eSIM du lịch quốc tế giá tốt, nhận QR qua email tức thì."
      ),
    },
  };
}

export default async function SimDuLichPage() {
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("sim-du-lich", language))?.payload?.data as any;
  const esimFaqItems = ((await FaqApi.list(2, language, "esim"))?.payload?.data as any[]) || [];
  const footerContent = (
    <div className="mt-16 sm:mt-24">
      <div className="mb-8 p-1 sm:p-8 bg-gray-50 rounded-3xl">
        <WhyChooseHappyBook />
      </div>
      <div className="bg-gray-50 rounded-3xl">
        <FAQ />
      </div>
    </div>
  );

  return (
    <EsimProductPage
      footerContent={footerContent}
      cmsPageContent={contentPage}
      faqItems={esimFaqItems}
    />
  );
}
