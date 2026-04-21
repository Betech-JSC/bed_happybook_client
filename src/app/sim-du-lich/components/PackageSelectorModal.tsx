"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { formatPrice, type EsimPackage, type EsimVariant } from "../data/esim-catalog";
import s from "@/styles/esim.module.scss";

interface Props {
  pkg: EsimPackage;
  currentSku: string;
  onSelect: (variant: EsimVariant) => void;
  onClose: () => void;
}

export default function PackageSelectorModal({
  pkg,
  currentSku,
  onSelect,
  onClose,
}: Props) {
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
          <h2>Chọn gói dịch vụ — {pkg.destination}</h2>
          <button type="button" onClick={onClose} aria-label="Đóng">
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
            Nhà mạng: {pkg.network} — {pkg.activation}
          </p>

          {pkg.variants.map((variant) => {
            const isActive = variant.sku === currentSku;
            return (
              <button
                key={variant.sku}
                type="button"
                className={`${s.radioCard} ${isActive ? s.radioCardActive : ""}`}
                onClick={() => onSelect(variant)}
                style={{ width: "100%", textAlign: "left" }}
              >
                <div className={s.radioCardDot} />
                <div className={s.radioCardContent}>
                  <div className={s.radioCardTitle}>{variant.desc}</div>
                  <div className={s.radioCardDesc}>SKU: {variant.sku}</div>
                </div>
                <div className={s.radioCardPrice}>
                  {formatPrice(variant.price)}
                </div>
              </button>
            );
          })}
        </div>

        <div className={s.modalFooter}>
          <button type="button" className={s.btnPrimary} onClick={onClose}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
