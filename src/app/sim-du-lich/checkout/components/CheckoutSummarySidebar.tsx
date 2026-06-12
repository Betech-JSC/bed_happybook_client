"use client";

import Image from "next/image";
import { ChevronRight, Headphones } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { EsimPackageView, EsimVariantView } from "../../lib/esim";
import { useSimDuLichStaticText } from "../../hooks/useSimDuLichStaticText";

type PaymentMethod = "vietqr" | "onepay" | "paypal";

type CheckoutData = {
  payment_fee_amount?: number;
  currency?: string;
};

type Props = {
  activePackageLabel: string;
  selectedVariant: EsimVariantView;
  packageData: EsimPackageView;
  qty: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  currency: string;
  paymentMethod: PaymentMethod;
  step: 2 | 3;
  submitting: boolean;
  quoteLoading: boolean;
  quoteIsAvailable: boolean;
  quoteError: string;
  checkoutData: CheckoutData | null;
  isPaid: boolean;
  orderCode: string;
  formatCheckoutAmount: (amount: number, currency?: string) => string;
  onPay: () => void;
  onContinue: () => void;
};

export default function CheckoutSummarySidebar({
  activePackageLabel,
  selectedVariant,
  packageData,
  qty,
  subtotal,
  serviceFee,
  total,
  currency,
  paymentMethod,
  step,
  submitting,
  quoteLoading,
  quoteIsAvailable,
  quoteError,
  checkoutData,
  isPaid,
  orderCode,
  formatCheckoutAmount,
  onPay,
  onContinue,
}: Props) {
  const { language } = useLanguage();
  const t = useSimDuLichStaticText(language === "en" ? "en" : "vi");

  return (
    <div className="lg:col-span-4 lg:sticky lg:top-[140px] space-y-6 h-fit">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <h3 className="text-xl font-bold text-midnight-ink">
            {t("Tóm tắt đơn hàng")}
          </h3>

          <div className="flex gap-4 pb-6 border-b border-slate-100">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-hb-navy to-blue-500 flex-shrink-0 flex items-center justify-center text-white shadow-inner">
              <span className="font-bold text-lg">eSIM</span>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 leading-tight">
                eSIM {activePackageLabel}
              </h4>
              <p className="text-sm text-slate-500 line-clamp-2">
                {selectedVariant.desc} - {packageData.network || "N/A"}
              </p>
              <p className="text-sm font-semibold text-slate-600 mt-2">
                {t("Số lượng:")} {qty < 10 ? `0${qty}` : qty}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>{t("Tạm tính")}</span>
              <span>{formatCheckoutAmount(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-slate-600 font-medium">
              <span
                className={
                  serviceFee === 0 ? "text-slate-400 italic font-normal" : ""
                }
              >
                {serviceFee === 0
                  ? t("Miễn phí")
                  : formatCheckoutAmount(serviceFee, currency)}
              </span>
            </div>
            {paymentMethod === "onepay" &&
            (checkoutData?.payment_fee_amount ?? 0) > 0 ? (
              <div className="flex justify-between text-slate-600 font-medium">
                <span>{t("Phí thanh toán OnePay")}</span>
                <span>
                  {formatCheckoutAmount(
                    checkoutData?.payment_fee_amount ?? 0,
                    checkoutData?.currency || currency,
                  )}
                </span>
              </div>
            ) : null}
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-slate-500 mb-1">
                {t("Số tiền thanh toán:")}
              </span>
              <span className="text-3xl font-bold text-[#F27145]">
                {formatCheckoutAmount(total, currency)}
              </span>
              <span className="text-xs text-slate-400 mt-1">{currency}</span>
            </div>

            {step === 3 ? (
              <button
                onClick={onPay}
                disabled={submitting || quoteLoading || !quoteIsAvailable}
                className="w-full bg-[#F27145] text-white h-14 rounded-xl font-bold text-lg hover:bg-[#E06138] active:scale-[0.98] transition-all shadow-lg shadow-[#F27145]/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? t("Đang tạo đơn hàng...")
                  : paymentMethod === "paypal"
                    ? t("Thanh toán qua PayPal")
                    : paymentMethod === "vietqr" && checkoutData && !isPaid
                      ? t("Tạo lại mã thanh toán")
                      : isPaid
                        ? t("Đã thanh toán")
                        : t("Thanh toán ngay")}{" "}
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onContinue}
                disabled={quoteLoading || !quoteIsAvailable}
                className="w-full bg-hb-navy text-white h-14 rounded-xl font-bold text-lg hover:bg-blue-900 active:scale-[0.98] transition-all shadow-lg shadow-hb-navy/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {t("Tới bước thanh toán")} <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {quoteError ? (
              <p className="text-sm text-red-500">{quoteError}</p>
            ) : null}

            {!quoteIsAvailable ? (
              <p className="text-sm text-red-500">
                {t(
                  "Gói eSIM này hiện chưa thể thanh toán. Vui lòng chọn gói khác.",
                )}
              </p>
            ) : null}

            {orderCode ? (
              <p className="text-xs text-slate-400 text-right">
                {t("Mã đơn hàng:")} {orderCode}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
        <Headphones className="w-5 h-5" />
        <span>
          {t("Cần hỗ trợ?")}{" "}
          <a className="text-[#1E40AF] font-bold hover:underline" href="#">
            {t("Chat với chúng tôi")}
          </a>
        </span>
      </div>
    </div>
  );
}
