import { unifiedStaticText } from "@/constants/staticText";
import { translateText } from "@/utils/translateApi";
import { formatTranslationMap } from "@/utils/translateDom";
import { unstable_cache } from "next/cache";

const cachedTranslate = unstable_cache(
  async (texts: string[], lang: string) => {
    console.log("🔁 Gọi API dịch:", lang);
    const translated = await translateText(texts, lang);
    return formatTranslationMap(texts, translated);
  },
  ["static-text-translations"]
  // { revalidate: 60 * 60 * 24 }
);

export async function getServerTranslations(
  lang: string
): Promise<Record<string, string>> {
  const texts = unifiedStaticText;

  if (lang === "vi") {
    return formatTranslationMap(texts);
  }
  return cachedTranslate(texts, lang);
}
