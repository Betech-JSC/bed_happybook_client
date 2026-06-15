"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  formatEsimMoney,
  getEsimVariantMoney,
  isEsimVariantSelectable,
  type EsimPackageView,
  type EsimVariantView,
} from "../lib/esim";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";
import s from "@/styles/esim.module.scss";

interface Props {
  pkg: EsimPackageView;
  currentSku: string;
  locale?: string;
  onSelect: (variant: EsimVariantView) => void;
  onClose: () => void;
}

export default function PackageSelectorModal({
  pkg,
  currentSku,
  locale = "vi",
  onSelect,
  onClose,
}: Props) {
  const { language } = useLanguage();
  const t = useSimDuLichStaticText(language === "en" ? "en" : "vi");

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className={s.modalOverlay} onClick={onClose}>
      <div className={s.modalPanel} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h2>{t("Chọn gói dịch vụ —")} {pkg.destination}</h2>
          <button type="button" onClick={onClose} aria-label={t("Đóng")}>
            <X size={20} />
          </button>
        </div>

        <div className={s.modalBody}>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "#64748b",
              marginBottom: 16,
              lineHeight: 1.5,
            }}
          >
            {t("Nhà mạng:")} {pkg.network || "N/A"} — {pkg.activation || "N/A"}
          </p>

          {pkg.variants.map((variant) => {
            const isActive = variant.sku === currentSku;
            const money = getEsimVariantMoney(variant, locale);
            const isSelectable = isEsimVariantSelectable(variant, locale);
            return (
              <button
                key={variant.sku}
                type="button"
                className={`${s.radioCard} ${isActive ? s.radioCardActive : ""}`}
                onClick={() => {
                  if (!isSelectable) return;
                  onSelect(variant);
                }}
                disabled={!isSelectable}
                style={{
                  width: "100%",
                  textAlign: "left",
                  opacity: isSelectable ? 1 : 0.45,
                  cursor: isSelectable ? "pointer" : "not-allowed",
                }}
              >
                <div className={s.radioCardDot} />
                <div className={s.radioCardContent}>
                  <div className={s.radioCardTitle}>{variant.desc}</div>
                </div>
                <div className={s.radioCardPrice}>
                  {isSelectable ? (
                    <div className="flex flex-col items-end">
                      {money.originalPrice > money.price && (
                        <span className="text-xs font-normal text-slate-400 line-through">
                          {formatEsimMoney(money.originalPrice, money.currency)}
                        </span>
                      )}
                      <span className="font-semibold text-hb-coral">
                        {formatEsimMoney(money.price, money.currency)}
                      </span>
                    </div>
                  ) : (
                    t("Chưa khả dụng")
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className={s.modalFooter}>
          <button type="button" className={s.btnPrimary} onClick={onClose}>
            {t("Xác nhận")}
          </button>
        </div>
      </div>
    </div>
  );
}
