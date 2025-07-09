// contexts/TranslationContext.tsx
"use client";
import { createContext, useContext } from "react";

export const TranslationContext = createContext<Record<string, string>>({});

export function TranslationProvider({
  translations,
  children,
}: {
  translations: Record<string, string>;
  children: React.ReactNode;
}) {
  return (
    <TranslationContext.Provider value={translations}>
      {children}
    </TranslationContext.Provider>
  );
}
