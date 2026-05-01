// hooks/useTranslation.ts
"use client";

import { useContext } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationContext } from "@/contexts/TranslationContext";

export function useTranslation() {
  const translations = useContext(TranslationContext);
  const { language: lang } = useLanguage();

  const t = (key: string) => {
    return translations[key] ?? key;
  };

  return { t, lang };
}
