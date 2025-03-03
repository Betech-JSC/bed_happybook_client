export async function translateText(
  arrTexts: string[],
  targetLang: string = "en"
): Promise<string[]> {
  try {
    if (targetLang === "vi") {
      return arrTexts;
    }
    if (!arrTexts.length) {
      return [];
    }
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
    const payload = [[arrTexts, "vi", targetLang], "te"];
    const url = `https://translate-pa.googleapis.com/v1/translateHtml`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json+protobuf",
        "x-goog-api-key": `${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data[0] ?? [];
  } catch (error) {
    return [];
  }
}
