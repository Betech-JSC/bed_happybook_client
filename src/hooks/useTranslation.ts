// hooks/useTranslation.ts
"use client";

import { useContext } from "react";
import { getCurrentLanguage } from "@/utils/Helper";
import { TranslationContext } from "@/contexts/TranslationContext";

export function useTranslation() {
  const translations = useContext(TranslationContext);
  const lang = getCurrentLanguage();

  const t = (key: string) => {
    return translations[key] ?? key;
  };

  return { t, lang };
}
