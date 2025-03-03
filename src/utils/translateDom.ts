import { isEmpty } from "lodash";
import { translateText } from "./translateApi";
import { getCurrentLanguage, toSnakeCase } from "./Helper";

export async function translatePage(containerSelector?: string, delay = 200) {
  await new Promise((resolve) => setTimeout(resolve, delay));

  const targetLang = getCurrentLanguage();

  if (targetLang === "vi") return;

  const parentElement =
    containerSelector && document.querySelector(containerSelector)
      ? document.querySelector(containerSelector)
      : document;

  if (!parentElement) return;

  const elements = Array.from(
    parentElement.querySelectorAll("[data-translate]")
  );
  const elementsWithText = elements.filter(
    (el) => !isEmpty(el.textContent?.trim())
  );

  const texts = elementsWithText.map((el: any) => el.textContent);

  const inputElements = Array.from(
    parentElement.querySelectorAll("input[placeholder], textarea[placeholder]")
  );
  const inputElementsWithText = inputElements.filter(
    (el) => !isEmpty(el.getAttribute("placeholder")?.trim())
  );
  const placeholders = inputElementsWithText.map((el: any) =>
    el.getAttribute("placeholder")
  );
  const translationsText = await translateText(texts, targetLang);
  const translationsplaceholders = await translateText(
    placeholders,
    targetLang
  );

  if (translationsText.length === elementsWithText.length) {
    Array.from(elementsWithText).map((el, index: number) => {
      const doc = new DOMParser().parseFromString(
        translationsText[index],
        "text/html"
      );
      el.setAttribute("data-is-translated", "true");
      el.textContent = doc.documentElement.textContent;
    });
  }

  if (translationsplaceholders.length === inputElementsWithText.length) {
    Array.from(inputElements).map((el, index: number) => {
      const doc = new DOMParser().parseFromString(
        translationsplaceholders[index],
        "text/html"
      );
      el.setAttribute("placeholder", doc.documentElement.textContent ?? "");
      el.setAttribute("data-is-translated", "true");
    });
  }
}

export function formatTranslationMap(staticText: string[], data?: string[]) {
  const translationMap = staticText.reduce((acc, viText, index) => {
    const key = toSnakeCase(viText);
    acc[key] = data?.[index] || viText;
    return acc;
  }, {} as Record<string, string>);
  return translationMap;
}
