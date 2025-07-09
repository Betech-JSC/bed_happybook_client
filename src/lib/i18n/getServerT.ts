import { toSnakeCase } from "@/utils/Helper";
import { getServerTranslations } from "./serverTranslations";
import { getServerLang } from "../session";

/**
 * Trả về hàm t(key) cho Server Component
 * @param texts: mảng text tiếng Việt
 * @param lang: ngôn ngữ đích
 */
export async function getServerT(): Promise<(key: string) => string> {
  const language = await getServerLang();
  const translations = await getServerTranslations(language);
  const t = (key: string) => {
    return translations[key] ?? "";
  };

  return t;
}
