"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const orderCode = searchParams.get("order_code") || searchParams.get("id") || "";

  return (
    <div className="pt-[90px] lg:min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <XCircle className="text-red-500 w-16 h-16 mx-auto" />
        <h2 className="text-2xl font-semibold text-red-700 mt-4">
          {t("Bạn đã hủy thanh toán") || "Payment Cancelled"}
        </h2>
        <p className="text-gray-600 mt-2">
          {orderCode
            ? `${t("Mã đơn:") || "Order Code:"} ${orderCode}`
            : t("Bạn có thể quay lại chọn phương thức thanh toán khác.") || "You can go back to select another payment method."}
        </p>

        <Link
          href="/ve-vui-choi"
          className="inline-block mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {t("Quay về Vé vui chơi") || "Back to Tickets"}
        </Link>
      </div>
    </div>
  );
}
