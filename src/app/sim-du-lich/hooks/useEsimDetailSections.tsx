"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { parseEsimCmsSections, type EsimCmsFaqItem, type EsimCmsPageContent } from "../lib/cms-content";
import type { EsimPackageView } from "../lib/esim";
import { useSimDuLichStaticText } from "./useSimDuLichStaticText";

type DetailAccordionKey = "compatibility" | "refund" | "faq";

type DetailSection = {
  key: DetailAccordionKey;
  title: string;
  content: ReactNode;
};

type Args = {
  cmsPageContent: EsimCmsPageContent | null | undefined;
  faqItems?: EsimCmsFaqItem[];
  selectedPackage: EsimPackageView | null;
  activeLocale: "vi" | "en";
};

export function useEsimDetailSections({
  cmsPageContent,
  faqItems,
  selectedPackage,
  activeLocale,
}: Args): DetailSection[] {
  const cmsSections = useMemo(() => parseEsimCmsSections(cmsPageContent), [cmsPageContent]);
  const t = useSimDuLichStaticText(activeLocale);

  return useMemo<DetailSection[]>(
    () => {
      const compatibilityTitle = cmsSections.compatibility?.title?.trim() || t("Khả năng tương thích thiết bị");
      const compatibilityHtml =
        selectedPackage?.deviceCompatibility?.trim() ||
        cmsSections.compatibility?.content?.trim() ||
        "";

      const sections: DetailSection[] = [];

      if (compatibilityTitle && compatibilityHtml) {
        sections.push({
          key: "compatibility",
          title: compatibilityTitle,
          content: (
            <div className="space-y-4 text-xs text-steel-secondary leading-relaxed border-t border-slate-50 bg-slate-50/30 p-4">
              <div
                className="space-y-3 text-xs text-steel-secondary leading-relaxed"
                dangerouslySetInnerHTML={{ __html: compatibilityHtml }}
              />
            </div>
          ),
        });
      }

      if (selectedPackage?.refundPolicy?.trim()) {
        sections.push({
          key: "refund",
          title: cmsSections.refund?.title?.trim() || t("Chính sách hoàn tiền"),
          content: (
            <div className="space-y-4 text-xs text-steel-secondary leading-relaxed border-t border-slate-50 bg-slate-50/30 p-4">
              <div
                className="space-y-3 text-xs text-steel-secondary leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedPackage.refundPolicy.trim() }}
              />
            </div>
          ),
        });
      }

      if (faqItems?.length) {
        sections.push({
          key: "faq",
          title: t("Câu hỏi thường gặp (FAQ)"),
          content: (
            <div className="space-y-3 text-xs text-steel-secondary leading-relaxed border-t border-slate-50 bg-slate-50/30 p-4">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="font-semibold text-midnight-ink">{item.question}</p>
                  <div
                    className="mt-1 space-y-2"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </div>
              ))}
            </div>
          ),
        });
      }

      return sections;
    },
    [
      t,
      cmsSections.compatibility?.content,
      cmsSections.compatibility?.title,
      selectedPackage?.deviceCompatibility,
      cmsSections.refund?.title,
      selectedPackage?.refundPolicy,
      faqItems,
    ]
  );
}
