import type { Metadata } from "next";
import CheckoutPage from "./CheckoutPage";
import { getServerLang } from "@/lib/session";
import { getServerTranslations } from "@/lib/i18n/serverTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLang();
  const translations = await getServerTranslations(language);
  const t = (key: string, fallback: string) => translations[key] || fallback;

  return {
    title: t("Thanh toán eSIM | HappyBook Travel", "Thanh toán eSIM | HappyBook Travel"),
    description: t(
      "Điền thông tin và hoàn tất thanh toán mua eSIM du lịch quốc tế.",
      "Điền thông tin và hoàn tất thanh toán mua eSIM du lịch quốc tế."
    ),
  };
}

export default function Page() {
  return <CheckoutPage />;
}
