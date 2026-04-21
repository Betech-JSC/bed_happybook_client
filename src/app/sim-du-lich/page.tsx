import type { Metadata } from "next";
import EsimProductPage from "./components/EsimProductPage";
import FAQ from "@/components/content-page/FAQ";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";

export const metadata: Metadata = {
  title: "Sim du lịch quốc tế eSIM | HappyBook Travel",
  description:
    "Mua eSIM du lịch quốc tế giá tốt, nhận QR qua email tức thì. Phủ sóng Nhật Bản, Hàn Quốc, Thái Lan, Trung Quốc, Châu Âu, Mỹ và hơn 30 quốc gia.",
  openGraph: {
    title: "Sim du lịch quốc tế eSIM | HappyBook Travel",
    description:
      "Mua eSIM du lịch quốc tế giá tốt, nhận QR qua email tức thì.",
  },
};

export default function SimDuLichPage() {
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

  return <EsimProductPage footerContent={footerContent} />;
}
