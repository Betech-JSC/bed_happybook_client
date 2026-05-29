import {
  getStaticTextTranslationMap,
  unifiedStaticText,
} from "@/constants/staticText";
import { formatTranslationMap } from "@/utils/translateDom";

const applyAmusementTicketAliases = (translations: Record<string, string>) => {
  const amusementLabel =
    translations["ve_vui_choi_hoat_dong"] ??
    translations["ve_vui_choi"] ??
    "Vé vui chơi & hoạt động";
  const searchLabel =
    translations["tim_ve_vui_choi_hoat_dong"] ??
    translations["tim_ve_vui_choi"] ??
    "Tìm vé vui chơi & hoạt động";

  return {
    ...translations,
    ve_vui_choi: amusementLabel,
    ve_vui_choi_hoat_dong: amusementLabel,
    tim_ve_vui_choi: searchLabel,
    tim_ve_vui_choi_hoat_dong: searchLabel,
  };
};

export async function getServerTranslations(
  lang: string
): Promise<Record<string, string>> {
  if (lang === "vi") {
    return applyAmusementTicketAliases(formatTranslationMap(unifiedStaticText));
  }

  return getStaticTextTranslationMap(lang);
}
