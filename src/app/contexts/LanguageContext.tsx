"use client";
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

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
