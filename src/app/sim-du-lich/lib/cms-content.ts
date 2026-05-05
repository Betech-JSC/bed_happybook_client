export type EsimCmsFaqItem = {
  question: string;
  answer: string;
};

export type EsimCmsAccordionSection = {
  title?: string;
  content?: string;
  items?: EsimCmsFaqItem[];
};

export type EsimCmsPageContent = {
  page_name?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_robots?: string;
  canonical_link?: string;
  meta_image?: string;
  content?: string;
  extras?: unknown;
  locale_vi?: unknown;
  locale_en?: unknown;
  [key: string]: unknown;
};

export type EsimCmsSections = {
  compatibility?: EsimCmsAccordionSection;
  refund?: EsimCmsAccordionSection;
  faq?: EsimCmsAccordionSection;
};

const toObject = (value: unknown): Record<string, any> => {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  if (typeof value === "object") {
    return value as Record<string, any>;
  }

  return {};
};

const pickFirstNonEmptyObject = (...values: unknown[]): Record<string, any> => {
  for (const value of values) {
    const objectValue = toObject(value);
    if (Object.keys(objectValue).length > 0) {
      return objectValue;
    }
  }

  return {};
};

const normalizeFaqItems = (value: unknown): EsimCmsFaqItem[] => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const typed = item as Record<string, any>;

        const question = String(typed.question || typed.q || typed.title || "").trim();
        const answer = String(typed.answer || typed.a || typed.content || "").trim();

        if (!question || !answer) return null;

        return { question, answer };
      })
      .filter(Boolean) as EsimCmsFaqItem[];
  }

  if (typeof value === "object") {
    const typed = value as Record<string, any>;
    if (Array.isArray(typed.items)) {
      return normalizeFaqItems(typed.items);
    }
    if (Array.isArray(typed.questions)) {
      return normalizeFaqItems(typed.questions);
    }
  }

  return [];
};

const normalizeSection = (value: unknown): EsimCmsAccordionSection | undefined => {
  if (!value) return undefined;

  if (typeof value === "string") {
    const content = value.trim();
    return content ? { content } : undefined;
  }

  if (typeof value !== "object") return undefined;

  const typed = value as Record<string, any>;
  const title = String(typed.title || typed.name || typed.label || "").trim() || undefined;
  const content =
    String(typed.content || typed.description || typed.html || typed.body || "").trim() || undefined;
  const items = normalizeFaqItems(typed.items || typed.questions || typed.faqs);

  if (!title && !content && items.length === 0) return undefined;

  return {
    title,
    content,
    items: items.length ? items : undefined,
  };
};

export const parseEsimCmsSections = (pageContent?: EsimCmsPageContent | null): EsimCmsSections => {
  const extras = toObject(pageContent?.extras);
  const root = pickFirstNonEmptyObject(
    extras.esim_accordions,
    extras.esim_sections,
    extras.sections,
    extras.sim_du_lich,
    extras
  );

  const compatibility = normalizeSection(
    root.compatibility ||
      root.device_compatibility ||
      root.deviceCompatibility ||
      root.compatible_device ||
      root.compatibleDevice
  );

  const refund = normalizeSection(
    root.refund || root.refund_policy || root.refundPolicy || root.return_policy || root.returnPolicy
  );

  const faq = normalizeSection(root.faq || root.faqs || root.questions || root.frequent_questions);

  return { compatibility, refund, faq };
};
