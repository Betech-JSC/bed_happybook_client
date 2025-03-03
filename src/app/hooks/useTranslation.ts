import { getCurrentLanguage } from "@/utils/Helper";

export function useTranslation(pageTranslations: Record<string, string>) {
  const lang = getCurrentLanguage();
  const t = (key: keyof typeof pageTranslations) => pageTranslations[key];
  return { t, lang };
}
