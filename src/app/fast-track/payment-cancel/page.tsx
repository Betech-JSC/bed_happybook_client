"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FastTrackPaymentCancelPage() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const isEn = language === "en";
  const orderCode = searchParams.get("order_code") || searchParams.get("id") || "";

  return (
    <div className="pt-[90px] lg:min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <XCircle className="text-red-500 w-16 h-16 mx-auto" />
        <h2 className="text-2xl font-semibold text-red-700 mt-4">
          {isEn ? "Payment cancelled" : "Bạn đã hủy thanh toán"}
        </h2>
        <p className="text-gray-600 mt-2">
          {orderCode
            ? `${isEn ? "Order code:" : "Mã đơn:"} ${orderCode}`
            : (isEn
                ? "You can return to select another payment method."
                : "Bạn có thể quay lại chọn phương thức thanh toán khác.")}
        </p>

        <Link
          href="/fast-track"
          className="inline-block mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isEn ? "Back to Fast Track" : "Quay về Fast Track"}
        </Link>
      </div>
    </div>
  );
}
