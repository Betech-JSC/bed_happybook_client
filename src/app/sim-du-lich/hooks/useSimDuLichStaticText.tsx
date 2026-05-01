"use client";

import { useEffect, useMemo, useState } from "react";
import { getStaticTextTranslationMap } from "@/constants/staticText";
import { toSnakeCase } from "@/utils/Helper";

type Locale = "vi" | "en";

type StaticTextTranslator = (text: string, fallback?: string) => string;

export function useSimDuLichStaticText(locale: Locale): StaticTextTranslator {
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;

    if (locale === "vi") {
      setTranslations({});
      return () => {
        active = false;
      };
    }

    void getStaticTextTranslationMap(locale).then((map) => {
      if (active) {
        setTranslations(map);
      }
    });

    return () => {
      active = false;
    };
  }, [locale]);

  return useMemo<StaticTextTranslator>(() => {
    return (text: string, fallback?: string) => {
      if (locale === "vi") {
        return fallback ?? text;
      }

      return translations[toSnakeCase(text)] ?? fallback ?? text;
    };
  }, [locale, translations]);
}
