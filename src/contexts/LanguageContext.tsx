"use client";
import { arrLanguages, totalLanguages } from "@/constants/language";
import { useParams, useSearchParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

function setLocaleCookie(lang: string) {
  document.cookie = `locale=${encodeURIComponent(lang)}; path=/; max-age=${
    60 * 60 * 24 * 7
  }`;
}
function getLocaleFromCookie(): string {
  const match = document.cookie.match(/(^| )locale=([^;]+)/);
  return match ? decodeURIComponent(match[2]) : "vi";
}

export const useLanguage = () => {
  return (
    useContext(LanguageContext) ?? { language: "vi", setLanguage: () => {} }
  );
};

export const LanguageProvider = ({
  children,
  serverLang,
}: {
  children: React.ReactNode;
  serverLang: string;
}) => {
  const [language, setLanguage] = useState(serverLang);
  const searchParams = useSearchParams();

  useEffect(() => {
    localStorage.setItem("language", serverLang);
  }, [serverLang]);

  const changeLanguage = useCallback(
    async (lang: string) => {
      if (language !== lang) {
        setLanguage(lang);
        setLocaleCookie(lang);
        await fetch("/api/set-language", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: lang }),
        });
        location.reload();
      }
    },
    [language]
  );

  useEffect(() => {
    if (searchParams.has("lang")) {
      const lang = searchParams.get("lang");
      if (lang !== serverLang && arrLanguages.includes(lang!)) {
        changeLanguage(lang!);
      }
    }
  }, [searchParams, serverLang, changeLanguage]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
