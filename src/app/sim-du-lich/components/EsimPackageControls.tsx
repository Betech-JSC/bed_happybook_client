"use client";

import { Globe, Minus, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { isEsimVariantSelectable, type EsimPackageView, type EsimVariantView } from "../lib/esim";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";

type Props = {
  selectedPackage: EsimPackageView | null;
  selectedVariant: EsimVariantView | null;
  serviceTypeLabel: string;
  quantity: number;
  locale: "vi" | "en";
  onOpenModal: () => void;
  onSelectSkuByValidity: (validity: number) => void;
  onSelectSkuByData: (data: string) => void;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
};

export default function EsimPackageControls({
  selectedPackage,
  selectedVariant,
  serviceTypeLabel,
  quantity,
  locale,
  onOpenModal,
  onSelectSkuByValidity,
  onSelectSkuByData,
  onDecreaseQuantity,
  onIncreaseQuantity,
}: Props) {
  const { language } = useLanguage();
  const t = useSimDuLichStaticText(language === "en" ? "en" : "vi");

  const variants = selectedPackage?.variants ?? [];
  const selectedValidity = selectedVariant?.validity ?? null;
  const selectedData = selectedVariant?.data ?? "";

  const validityOptions = selectedPackage
    ? Array.from(new Set(variants.map((variant) => variant.validity))).sort((a, b) => a - b)
    : [];

  const dataOptions = selectedPackage
    ? Array.from(new Set(variants.map((variant) => variant.data)))
    : [];

  const canSelectValidity = (validity: number) =>
    variants.some(
      (variant) =>
        variant.validity === validity &&
        isEsimVariantSelectable(variant, locale)
    );

  const canSelectData = (data: string) =>
    variants.some(
      (variant) =>
        variant.data === data &&
        isEsimVariantSelectable(variant, locale)
    );

  const optionClassName = (isActive: boolean, isDisabled: boolean) =>
    `px-4 py-2 rounded-lg text-sm transition-colors disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 ${
      isActive
        ? "bg-[#FFF7ED] border-2 border-hb-coral text-hb-coral font-bold"
        : isDisabled
          ? "border border-slate-200 font-medium"
          : "border border-slate-200 font-medium hover:border-hb-coral"
    }`;

  return (
    <section className="bg-white rounded-12px shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
      <div className="p-6 space-y-8">
        <div>
          <p className="text-sm font-bold text-midnight-ink mb-4">{t("Loại gói")}</p>
          <div className="flex border-b border-slate-100">
            <button className="px-6 py-2 border-b-2 border-hb-coral text-hb-coral font-semibold text-sm">
              {selectedPackage?.title || t("Chưa chọn")}
            </button>
            <button
              onClick={onOpenModal}
              className="px-6 py-2 text-steel-secondary hover:text-midnight-ink transition-colors font-medium text-sm flex items-center gap-1"
            >
              {t("Xem gói khác")}
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-midnight-ink mb-3">{t("Hạn sử dụng (Ngày)")}</p>
          <div className="flex flex-wrap gap-2">
            {validityOptions.map((validity) => {
              const isActive = selectedVariant?.validity === validity;
              const isDisabled = !canSelectValidity(validity);
              return (
                <button
                  key={validity}
                  type="button"
                  disabled={isDisabled}
                  aria-disabled={isDisabled}
                  onClick={() => onSelectSkuByValidity(validity)}
                  className={optionClassName(isActive, isDisabled)}
                >
                  {validity} {t("Ngày")}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-midnight-ink mb-3">{t("Gói Data")}</p>
          <div className="flex flex-wrap gap-2">
            {dataOptions.map((data) => {
              const isActive = selectedVariant?.data === data;
              const isDisabled = !canSelectData(data);
              return (
                <button
                  key={data}
                  type="button"
                  disabled={isDisabled}
                  aria-disabled={isDisabled}
                  onClick={() => onSelectSkuByData(data)}
                  className={optionClassName(isActive, isDisabled)}
                >
                  {data}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-slate-100">
          <div>
            <p className="text-sm font-bold text-midnight-ink mb-2">{t("Loại dịch vụ")}</p>
            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 inline-flex items-center gap-2">
              <Globe className="w-4 h-4 text-hb-navy" />
              <span className="text-sm font-semibold text-midnight-ink">{serviceTypeLabel}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-midnight-ink mb-2">{t("Số lượng")}</p>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden w-fit">
              <button
                className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-50"
                disabled={quantity <= 1}
                onClick={onDecreaseQuantity}
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="w-12 h-10 flex items-center justify-center font-bold text-midnight-ink border-x border-slate-200">
                {quantity}
              </div>
              <button
                className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 transition-colors"
                onClick={onIncreaseQuantity}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
