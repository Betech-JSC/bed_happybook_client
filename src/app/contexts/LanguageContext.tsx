"use client";
import { arrLanguages, totalLanguages } from "@/constants/language";
import { useParams, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

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

  const changeLanguage = async (lang: string) => {
    if (language !== lang) {
      setLanguage(lang);
      localStorage.setItem("language", lang);

      await fetch("/api/set-language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang }),
      });
      location.reload();
    }
  };

  useEffect(() => {
    if (searchParams.has("lang")) {
      const lang = searchParams.get("lang");
      if (lang !== serverLang && arrLanguages.includes(lang!)) {
        changeLanguage(lang!);
      }
    }
  }, [searchParams, serverLang]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
