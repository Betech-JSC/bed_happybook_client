"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export function useTranslation(pageTranslations: Record<string, string>) {
  const { language: lang } = useLanguage();
  const t = (key: keyof typeof pageTranslations) => pageTranslations[key];
  return { t, lang };
}
