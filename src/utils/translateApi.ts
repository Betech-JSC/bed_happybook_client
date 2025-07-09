export async function translateText(
  arrTexts: string[],
  targetLang: string = "en"
): Promise<string[]> {
  const payload = {
    texts: arrTexts,
    targetLang,
  };
  if (targetLang === "vi") {
    return arrTexts;
  }
  const baseUrl =
    typeof window !== "undefined"
      ? ""
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data as string[];
}
