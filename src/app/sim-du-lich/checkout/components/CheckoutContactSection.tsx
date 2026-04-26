"use client";

import { User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSimDuLichStaticText } from "../../hooks/useSimDuLichStaticText";

type Props = {
  email: string;
  emailError: string;
  contactName: string;
  contactPhone: string;
  onEmailChange: (value: string) => void;
  onOpenContact: () => void;
};

export default function CheckoutContactSection({
  email,
  emailError,
  contactName,
  contactPhone,
  onEmailChange,
  onOpenContact,
}: Props) {
  const { language } = useLanguage();
  const t = useSimDuLichStaticText(language === "en" ? "en" : "vi");

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-midnight-ink mb-2">{t("Thông tin liên lạc")}</h2>
      <p className="text-slate-500 mb-8">{t("Vui lòng cung cấp thông tin để chúng tôi gửi mã QR eSIM cho bạn.")}</p>

      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            {t("Địa chỉ email")} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="name@email.com"
            className={`w-full h-14 px-4 rounded-xl border ${
              emailError ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200"
            } focus:ring-2 focus:ring-hb-navy focus:border-transparent outline-none transition-all text-lg`}
          />
          {emailError ? (
            <p className="text-red-500 text-sm mt-2">{emailError}</p>
          ) : (
            <p className="text-slate-500 text-sm mt-2">{t("Mã kích hoạt eSIM sẽ được gửi qua email này, hãy kiểm tra kỹ nhé.")}</p>
          )}
        </div>

        {contactName ? (
          <div className="bg-blue-50 rounded-xl p-4 flex justify-between items-center border border-blue-100">
            <div>
              <div className="font-bold text-midnight-ink">{contactName}</div>
              <div className="text-slate-600 mt-1">{contactPhone}</div>
            </div>
            <button
              onClick={onOpenContact}
              className="text-hb-navy text-sm font-bold hover:underline px-4 py-2"
            >
              {t("Sửa thông tin")}
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenContact}
            className="flex items-center justify-center gap-2 w-full h-14 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 font-bold hover:border-hb-navy hover:text-hb-navy hover:bg-blue-50 transition-colors"
          >
            <User className="w-5 h-5" /> {t("Thêm Họ tên & Số điện thoại (Tùy chọn)")}
          </button>
        )}
      </div>
    </div>
  );
}
