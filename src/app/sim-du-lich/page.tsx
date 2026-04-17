import type { Metadata } from "next";
import EsimProductPage from "./components/EsimProductPage";

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
  return <EsimProductPage />;
}
