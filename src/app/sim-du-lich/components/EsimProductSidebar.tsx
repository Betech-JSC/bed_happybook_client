"use client";

import { BadgeCheck, ChevronDown, Headset, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { formatEsimMoney, type EsimPackageView, type EsimVariantView } from "../lib/esim";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";

type DetailAccordionKey = "compatibility" | "refund" | "faq";

type DetailSection = {
  key: DetailAccordionKey;
  title: string;
  content: ReactNode;
};

type Props = {
  selectedPackage: EsimPackageView | null;
  selectedVariant: EsimVariantView | null;
  selectedVariantMoney: { price: number; currency: string };
  activeRegionLabel: string;
  serviceTypeLabel: string;
  titleFallback: string;
  quantity: number;
  total: number;
  onBookNow: () => void;
  detailSections: DetailSection[];
  openDetailSection: DetailAccordionKey | null;
  setOpenDetailSection: Dispatch<SetStateAction<DetailAccordionKey | null>>;
  sticky?: boolean;
  showDetailHeader?: boolean;
  showDetailSections?: boolean;
  showActionBlock?: boolean;
  showInfoBlock?: boolean;
};

export default function EsimProductSidebar({
  selectedPackage,
  selectedVariant,
  selectedVariantMoney,
  activeRegionLabel,
  serviceTypeLabel,
  titleFallback,
  quantity,
  total,
  onBookNow,
  detailSections,
  openDetailSection,
  setOpenDetailSection,
  sticky = true,
  showDetailHeader = false,
  showDetailSections = true,
  showActionBlock = true,
  showInfoBlock = true,
}: Props) {
  const { language } = useLanguage();
  const t = useSimDuLichStaticText(language === "en" ? "en" : "vi");
  const canBook = Boolean(selectedPackage && selectedVariant && selectedVariantMoney.price > 0);

  return (
    <aside className={`${sticky ? "space-y-6 lg:sticky lg:top-40 lg:h-fit" : "space-y-6 h-fit"}`}>
      <div className="bg-white rounded-12px p-6 shadow-lg border border-slate-100">
        <div className="space-y-4">
          {showDetailHeader ? (
            <div className="space-y-3 pb-2 border-b border-slate-100">
              <div>
                <h1 className="text-[28px] lg:text-[32px] font-bold text-midnight-ink leading-tight">
                  {selectedPackage?.title || titleFallback}
                </h1>
                <p className="mt-2 text-sm text-steel-secondary">
                  {selectedPackage?.destination || activeRegionLabel}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-steel-secondary">0 {t("đánh giá")}</span>
                {selectedVariant?.validity ? (
                  <span className="flex items-center gap-1 text-midnight-ink">
                    <span>•</span>
                    <span>{selectedVariant.validity} {t("ngày")}</span>
                  </span>
                ) : null}
                {selectedPackage?.network ? (
                  <span className="flex items-center gap-1 text-midnight-ink">
                    <span>•</span>
                    <span>{selectedPackage.network}</span>
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {selectedPackage?.activation ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                    {selectedPackage.activation}
                  </span>
                ) : null}
                {selectedVariant?.data ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                    {selectedVariant.data}
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}

          {showActionBlock ? (
            <>
              <div className="flex items-end justify-between">
                <span className="text-steel-secondary text-sm font-medium">{t("Tổng cộng:")}</span>
                <span className="text-3xl font-bold text-hb-coral">
                  {selectedVariant ? formatEsimMoney(total, selectedVariantMoney.currency) : t("Chưa chọn gói")}
                </span>
              </div>
              <p className="text-[10px] text-right text-steel-secondary">
                {selectedVariant
                  ? selectedVariantMoney.price > 0
                    ? t("Đã bao gồm thuế và phí xử lý")
                    : t("Đã bao gồm thuế, Miễn phí xử lý")
                  : t("Hãy chọn gói để xem giá")}
              </p>

              <button
                type="button"
                onClick={onBookNow}
                disabled={!canBook}
                className="w-full bg-hb-coral hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold h-12 rounded-xl active:scale-[0.98] transition-all shadow-md"
              >
                {canBook ? t("Đặt ngay") : t("Chưa có giá khả dụng")}
              </button>

              <div className="pt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-steel-secondary">
                  <BadgeCheck className="w-4 h-4" />
                  <span>{t("Đảm bảo giá tốt nhất")}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-steel-secondary">
                  <Headset className="w-4 h-4" />
                  <span>{t("Hỗ trợ khách hàng 24/7")}</span>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {showDetailSections ? (
          <>
            <hr className="my-6 border-slate-100" />

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-midnight-ink">{t("Chi tiết gói dịch vụ")}</h3>
              <div className="space-y-3">
                <div className="group border border-slate-100 rounded-lg overflow-hidden">
                  <div className="w-full flex items-center justify-between p-3 text-left">
                    <span className="text-xs font-semibold">{t("Tóm tắt")}</span>
                  </div>
                  <div className="p-3 pt-0 text-xs text-steel-secondary leading-relaxed border-t border-slate-50 bg-slate-50/30">
                    <span className="font-semibold block mb-1">
                      {selectedVariant?.desc || t("Chưa chọn gói")}
                    </span>
                    {t("Đơn giá:")} {formatEsimMoney(selectedVariantMoney.price, selectedVariantMoney.currency)} x{" "}
                    {quantity}
                  </div>
                </div>

                {detailSections.map((section) => {
                  const isOpen = openDetailSection === section.key;

                  return (
                    <div key={section.key} className="border border-slate-100 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDetailSection((current) => (current === section.key ? null : section.key))
                        }
                        className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-xs font-semibold">{section.title}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {isOpen ? section.content : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : null}
      </div>

      {showInfoBlock ? (
        <div className="bg-blue-50 rounded-12px p-4 border border-blue-100 flex gap-3">
          <Info className="w-10 h-6 -translate-y-1 text-hb-navy" />
          <div className="text-xs text-hb-navy leading-relaxed font-medium space-y-2">
            <p>
              <span className="font-semibold">{t("Điểm đến:")}</span>{" "}
              <strong>{selectedPackage?.destination || activeRegionLabel}</strong>
            </p>
            {selectedPackage?.activation ? (
              <p>
                <span className="font-semibold">{t("Kích hoạt:")}</span> {selectedPackage.activation}
              </p>
            ) : null}
            {selectedPackage?.note ? (
              <p className="opacity-80 text-[11px]">{selectedPackage.note}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
