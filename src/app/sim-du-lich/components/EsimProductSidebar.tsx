"use client";

import { BadgeCheck, ChevronDown, Headset, Info, Shield } from "lucide-react";
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
  quantity: number;
  total: number;
  onBookNow: () => void;
  detailSections: DetailSection[];
  openDetailSection: DetailAccordionKey | null;
  setOpenDetailSection: Dispatch<SetStateAction<DetailAccordionKey | null>>;
};

export default function EsimProductSidebar({
  selectedPackage,
  selectedVariant,
  selectedVariantMoney,
  activeRegionLabel,
  serviceTypeLabel,
  quantity,
  total,
  onBookNow,
  detailSections,
  openDetailSection,
  setOpenDetailSection,
}: Props) {
  const { language } = useLanguage();
  const t = useSimDuLichStaticText(language === "en" ? "en" : "vi");

  return (
    <aside className="space-y-6 sticky top-32 lg:top-40 h-fit">
      <div className="bg-white rounded-12px p-6 shadow-lg border border-slate-100">
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <span className="text-steel-secondary text-sm font-medium">{t("Tổng cộng:")}</span>
            <span className="text-3xl font-bold text-hb-coral">
              {formatEsimMoney(total, selectedVariantMoney.currency)}
            </span>
          </div>
          <p className="text-[10px] text-right text-steel-secondary">
            {selectedVariantMoney.price > 0 ? t("Đã bao gồm thuế và phí xử lý") : t("Đã bao gồm thuế, Miễn phí xử lý")}
          </p>

          <button
            type="button"
            onClick={onBookNow}
            disabled={!selectedPackage || !selectedVariant}
            className="w-full bg-hb-coral hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold h-12 rounded-xl active:scale-[0.98] transition-all shadow-md"
          >
            {t("Đặt ngay")}
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
        </div>

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
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {isOpen ? section.content : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-12px p-4 border border-blue-100 flex gap-3">
        <Info className="w-10 h-6 -translate-y-1 text-hb-navy" />
        <p className="text-xs text-hb-navy leading-relaxed font-medium">
          {t("Dữ liệu sẽ được kích hoạt ngay khi bạn kết nối với mạng di động tại")}{" "}
          <strong>{selectedPackage?.destination || activeRegionLabel}</strong>. Thời hạn sử dụng tính theo
          {t("chu kỳ")} {selectedPackage?.activation ? selectedPackage.activation.toLowerCase() : t("gói dịch vụ")}.
          <br />
          <br />
          <span className="opacity-80 block text-[11px] italic">
            {selectedPackage?.note || t("Đang tải dữ liệu gói eSIM.")}
          </span>
        </p>
      </div>
    </aside>
  );
}
