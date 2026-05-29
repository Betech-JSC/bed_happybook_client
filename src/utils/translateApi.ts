const TRANSLATE_CACHE_TTL_MS = 1000 * 60 * 30;
const translateCache = new Map<string, { expiresAt: number; value: string[] }>();
const translatePromiseCache = new Map<string, Promise<string[]>>();

const getCacheKey = (texts: string[], targetLang: string) =>
  `${targetLang}:${texts.join("\u0001")}`;

const getCachedTranslation = (cacheKey: string) => {
  const cached = translateCache.get(cacheKey);
  if (!cached) return null;
  if (cached.expiresAt < Date.now()) {
    translateCache.delete(cacheKey);
    return null;
  }
  return cached.value;
};

const fetchGoogleTranslation = async (
  arrTexts: string[],
  targetLang: string
): Promise<string[]> => {
  if (!arrTexts.length) return [];
  if (targetLang === "vi") return arrTexts;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) return [];

  const payload = [[arrTexts, "vi", targetLang], "te"];
  const response = await fetch(
    "https://translate-pa.googleapis.com/v1/translateHtml",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json+protobuf",
        "x-goog-api-key": `${apiKey}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data[0] ?? [];
};

const translateOnServer = async (
  arrTexts: string[],
  targetLang: string
): Promise<string[]> => {
  if (!arrTexts.length) return [];
  if (targetLang === "vi") return arrTexts;

  const cacheKey = getCacheKey(arrTexts, targetLang);
  const cached = getCachedTranslation(cacheKey);
  if (cached) return cached;

  const pending = translatePromiseCache.get(cacheKey);
  if (pending) return pending;

  const promise = (async () => {
    try {
      const value = await fetchGoogleTranslation(arrTexts, targetLang);
      translateCache.set(cacheKey, {
        value,
        expiresAt: Date.now() + TRANSLATE_CACHE_TTL_MS,
      });
      return value;
    } finally {
      translatePromiseCache.delete(cacheKey);
    }
  })();

  translatePromiseCache.set(cacheKey, promise);
  return promise;
};

export async function translateText(
  arrTexts: string[],
  targetLang: string = "en"
): Promise<string[]> {
  if (targetLang === "vi") {
    return arrTexts;
  }

  if (typeof window === "undefined") {
    return translateOnServer(arrTexts, targetLang);
  }

  const cacheKey = getCacheKey(arrTexts, targetLang);
  const cached = getCachedTranslation(cacheKey);
  if (cached) return cached;

  const pending = translatePromiseCache.get(cacheKey);
  if (pending) return pending;

  const payload = {
    texts: arrTexts,
    targetLang,
  };

  const promise = (async () => {
    const response = await fetch(`/api/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as string[];
    translateCache.set(cacheKey, {
      value: data,
      expiresAt: Date.now() + TRANSLATE_CACHE_TTL_MS,
    });
    return data;
  })();

  translatePromiseCache.set(cacheKey, promise);

  try {
    return await promise;
  } finally {
    translatePromiseCache.delete(cacheKey);
  }
}
