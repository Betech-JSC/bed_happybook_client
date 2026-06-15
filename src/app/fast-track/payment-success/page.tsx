"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { BookingProductApi } from "@/api/BookingProduct";
import { useLanguage } from "@/contexts/LanguageContext";

type CaptureState = "loading" | "success" | "error";

export default function FastTrackPaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const isEn = language === "en";

  const orderCode = searchParams.get("order_code") || searchParams.get("id") || "";
  const paypalOrderId = searchParams.get("paypal_order_id") || searchParams.get("token") || "";

  const [state, setState] = useState<CaptureState>("loading");
  const [message, setMessage] = useState(
    isEn ? "Confirming PayPal payment..." : "Đang xác nhận thanh toán PayPal..."
  );

  useEffect(() => {
    let active = true;

    const capture = async () => {
      if (!orderCode && !paypalOrderId) {
        if (!active) return;
        setState("error");
        setMessage(isEn ? "Missing PayPal order reference." : "Thiếu thông tin đơn hàng PayPal.");
        return;
      }

      try {
        await BookingProductApi.paypalCaptureOrder({
          order_code: orderCode || undefined,
          paypal_order_id: paypalOrderId || undefined,
        });

        if (!active) return;
        setState("success");
        router.replace(
          `/payment-result?status=success&id=${encodeURIComponent(
            orderCode || paypalOrderId
          )}&payment_method=paypal`
        );
      } catch (error: any) {
        if (!active) return;
        console.error("Failed to capture FastTrack PayPal payment", error);
        setState("error");
        setMessage(
          error?.payload?.message ||
            (isEn ? "Unable to confirm PayPal payment." : "Không thể xác nhận thanh toán PayPal.")
        );
      }
    };

    void capture();

    return () => {
      active = false;
    };
  }, [orderCode, paypalOrderId, router, isEn]);

  return (
    <div className="pt-[90px] lg:min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {state === "loading" && (
          <>
            <Loader2 className="text-blue-500 w-16 h-16 mx-auto animate-spin" />
            <h2 className="text-2xl font-semibold text-slate-800 mt-4">
              {isEn ? "Processing payment" : "Đang xử lý thanh toán"}
            </h2>
            <p className="text-gray-600 mt-2">{message}</p>
          </>
        )}

        {state === "error" && (
          <>
            <XCircle className="text-red-500 w-16 h-16 mx-auto" />
            <h2 className="text-2xl font-semibold text-red-700 mt-4">
              {isEn ? "PayPal payment not completed" : "Thanh toán PayPal chưa hoàn tất"}
            </h2>
            <p className="text-gray-600 mt-2">{message}</p>
            <button
              type="button"
              onClick={() => router.push("/fast-track")}
              className="inline-flex items-center justify-center mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {isEn ? "Back to Fast Track" : "Quay lại Fast Track"}
            </button>
          </>
        )}

        {state === "success" && (
          <>
            <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto" />
            <h2 className="text-2xl font-semibold text-green-700 mt-4">
              {isEn ? "Payment successful!" : "Thanh toán thành công!"}
            </h2>
            <p className="text-gray-600 mt-2">
              {isEn
                ? "Your FastTrack booking is now being processed."
                : "Yêu cầu đặt FastTrack của bạn đang được xử lý."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
