import {
  getStaticTextTranslationMap,
  unifiedStaticText,
} from "@/constants/staticText";
import { formatTranslationMap } from "@/utils/translateDom";

export async function getServerTranslations(
  lang: string
): Promise<Record<string, string>> {
  if (lang === "vi") {
    return formatTranslationMap(unifiedStaticText);
  }

  return getStaticTextTranslationMap(lang);
}
