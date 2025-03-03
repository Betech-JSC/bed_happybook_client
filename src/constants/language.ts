import { vi, enUS, Locale } from "date-fns/locale";

export const arrLanguages = ["en", "vi"];
export const totalLanguages = [
  {
    label: "Tiếng Việt",
    lang: "vi",
  },
  {
    label: "Tiếng Anh",
    lang: "en",
  },
];
export const datePickerLocale: Record<string, Locale> = {
  vi: vi,
  en: enUS,
};
