"use client";

import Image from "next/image";
import { CheckCircle2, ChevronDown, Clock, Shield } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { isEmpty } from "lodash";
import { toast } from "react-hot-toast";
import QRCodeDisplay from "@/components/Payment/QRCodeDisplay";
import { PaymentApi } from "@/api/Payment";
import { useLanguage } from "@/contexts/LanguageContext";
import type { EsimCheckoutData, PaymentMethod } from "../types";
import { useSimDuLichStaticText } from "../../hooks/useSimDuLichStaticText";

type Props = {
  isEnglish: boolean;
  paymentMethod: PaymentMethod;
  setPaymentMethod: Dispatch<SetStateAction<PaymentMethod>>;
  checkoutData: EsimCheckoutData | null;
  isPaid: boolean;
  setIsPaid: Dispatch<SetStateAction<boolean>>;
  orderCode: string;
  summaryOpen: boolean;
  setSummaryOpen: Dispatch<SetStateAction<boolean>>;
  contactName: string;
  contactPhone: string;
  email: string;
  timeLeft: number;
  formatTime: (seconds: number) => string;
};

export default function CheckoutPaymentSection({
  isEnglish,
  paymentMethod,
  setPaymentMethod,
  checkoutData,
  isPaid,
  setIsPaid,
  orderCode,
  summaryOpen,
  setSummaryOpen,
  contactName,
  contactPhone,
  email,
  timeLeft,
  formatTime,
}: Props) {
  const { language } = useLanguage();
  const t = useSimDuLichStaticText(language === "en" ? "en" : "vi");
  const [vietQrData, setVietQrData] = useState<any>({});
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);

  useEffect(() => {
    if (paymentMethod !== "vietqr") {
      setVietQrData({});
      setQrCodeGenerated(false);
      return;
    }

    if (qrCodeGenerated) {
      return;
    }

    const totalAmount = checkoutData?.payable_amount ?? 0;
    if (!orderCode || totalAmount <= 0) {
      return;
    }

    let active = true;

    const createReceipt = async () => {
      try {
        const receiptResult = await PaymentApi.createReceipt({
          payment_method_id: 5,
          total_amount: totalAmount,
          description: "Thu đơn hàng",
          note: "KH chuyển khoản",
          allocations: [
            {
              ref_type: "order",
              ref_code: orderCode,
              amount: totalAmount,
            },
          ],
        });

        if (!active) return;

        if (receiptResult?.data) {
          setVietQrData(receiptResult.data);
          setQrCodeGenerated(true);
        } else {
          throw new Error("Không thể tạo receipt");
        }
      } catch (error) {
        if (!active) return;
        console.error("Error creating eSIM QR receipt:", error);
        toast.error(t("khong_the_tao_ma_qr_thanh_toan"));
      }
    };

    void createReceipt();

    return () => {
      active = false;
    };
  }, [checkoutData?.payable_amount, orderCode, paymentMethod, qrCodeGenerated, t]);

  return (
    <div className="space-y-6">
      <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-3">
          <Clock className="text-[#92400E] w-5 h-5" />
          <span className="text-[#92400E] font-medium text-sm">{t("Vui lòng hoàn tất thanh toán trong:")}</span>
        </div>
        <div className="font-mono text-[#F27145] text-xl font-bold tracking-wider">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <button
          onClick={() => setSummaryOpen((current) => !current)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-600 w-5 h-5" />
            <span className="font-bold text-slate-800 text-lg">{t("Thông tin khách hàng & Đơn hàng")}</span>
          </div>
          <ChevronDown
            className={`text-slate-400 transition-transform duration-300 ${summaryOpen ? "rotate-180" : ""}`}
          />
        </button>
        {summaryOpen && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-sm text-slate-700 bg-slate-50/50">
            <div className="space-y-3 mt-4">
              <div className="flex border-b border-slate-200 pb-2">
                <span className="w-1/3 text-slate-500">{t("Email nhận eSIM:")}</span>
                <span className="w-2/3 font-bold text-midnight-ink">{email}</span>
              </div>
              <div className="flex border-b border-slate-200 pb-2">
                <span className="w-1/3 text-slate-500">{t("Họ và tên:")}</span>
                <span className="w-2/3 font-semibold text-midnight-ink">{contactName || t("Không có")}</span>
              </div>
              <div className="flex border-b border-slate-200 pb-2">
                <span className="w-1/3 text-slate-500">{t("Số điện thoại:")}</span>
                <span className="w-2/3 font-semibold text-midnight-ink">{contactPhone || t("Không có")}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#EFF6FF] rounded-xl p-4 flex items-center gap-4 border border-[#DBEAFE]">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-[#1E40AF]">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-[#1E40AF] text-sm md:text-base">{t("Giao dịch an toàn & bảo mật")}</h4>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed mt-1">
            {t("Thông tin thanh toán của bạn được mã hóa 256-bit SSL để đảm bảo an toàn tuyệt đối.")}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-midnight-ink">{t("Phương thức thanh toán")}</h3>
        <div className="space-y-4">
          {!isEnglish && (
            <>
              <label
                htmlFor="payment_vietqr"
                className={`flex items-center p-4 bg-white border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === "vietqr"
                    ? "border-hb-coral bg-[#FFFBF7] shadow-[0_0_0_4px_rgba(242,113,69,0.1)]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                >
                <input
                  type="radio"
                  value="vietqr"
                  id="payment_vietqr"
                  checked={paymentMethod === "vietqr"}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-5 h-5 text-hb-coral focus:ring-hb-coral accent-hb-coral mr-4"
                />
                <Image
                  src="/payment-method/transfer.svg"
                  alt="Chuyển khoản"
                  width={32}
                  height={32}
                  className="mr-3"
                />
                <span className="font-bold text-slate-800 text-lg">{t("Thanh toán quét mã QR")}</span>
              </label>

              <label
                htmlFor="payment_onepay"
                className={`flex items-center p-4 bg-white border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === "onepay"
                    ? "border-hb-coral bg-[#FFFBF7] shadow-[0_0_0_4px_rgba(242,113,69,0.1)]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  value="onepay"
                  id="payment_onepay"
                  checked={paymentMethod === "onepay"}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-5 h-5 text-hb-coral focus:ring-hb-coral accent-hb-coral mr-4"
                />
                <Image
                  src="/payment-method/visa.svg"
                  alt="Visa/MasterCard"
                  width={54}
                  height={32}
                  className="mr-3 object-contain"
                />
                <span className="font-bold text-slate-800 text-lg">{t("Thẻ tín dụng / Ghi nợ quốc tế")}</span>
              </label>
            </>
          )}

          {isEnglish && (
            <label
              htmlFor="payment_paypal"
              className={`flex items-center gap-4 p-5 bg-white border-2 rounded-[22px] cursor-pointer transition-all ${
                paymentMethod === "paypal"
                  ? "border-[#F27145] bg-[#FFF8F4] shadow-[0_0_0_5px_rgba(242,113,69,0.12)]"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                value="paypal"
                id="payment_paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-5 h-5 text-hb-coral focus:ring-hb-coral accent-hb-coral shrink-0"
              />
              <div className="flex h-11 min-w-[92px] items-center justify-center rounded-2xl border border-[#D7E3FA] bg-[#F7FAFF] px-3 shadow-sm">
                <span
                  className="text-[17px] font-extrabold italic leading-none tracking-[-0.02em] text-[#003087]"
                  style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
                >
                  PayPal
                </span>
              </div>
              <div className="min-w-0">
                <span className="block text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                  {t("Thanh toán qua PayPal")}
                </span>
                <span className="block text-[22px] font-extrabold leading-tight text-slate-800">
                  PayPal
                </span>
              </div>
            </label>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-500 leading-relaxed">
            {t("Bằng việc nhấn \"Thanh toán ngay\", bạn đồng ý với")}{" "}
            <a className="text-[#1E40AF] font-semibold hover:underline" href="#">
              {t("Điều khoản dịch vụ")}
            </a>{" "}
            và{" "}
            <a className="text-[#1E40AF] font-semibold hover:underline" href="#">
              {t("Chính sách bảo mật")}
            </a>{" "}
            {t("của HappyBook.")}
          </p>
        </div>

        {paymentMethod === "vietqr" && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold text-midnight-ink">{t("Quét mã QR để thanh toán")}</h4>
                <p className="text-sm text-slate-500 mt-1">
                  {t("Sau khi chuyển khoản thành công, hệ thống sẽ tự động cập nhật trạng thái đơn hàng.")}
                </p>
              </div>
              <div
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  isPaid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {isPaid ? t("Đã thanh toán") : t("Chờ thanh toán")}
              </div>
            </div>

            {!isEmpty(vietQrData) ? (
              <QRCodeDisplay
                vietQrData={vietQrData}
                order={{ sku: orderCode }}
                isPaid={isPaid}
                setIsPaid={setIsPaid}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                {t("Đang tạo mã QR thanh toán...")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
