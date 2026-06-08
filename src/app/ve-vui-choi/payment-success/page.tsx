"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { BookingProductApi } from "@/api/BookingProduct";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

type CaptureState = "loading" | "success" | "error";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const orderCode = searchParams.get("order_code") || searchParams.get("id") || "";
  const paypalOrderId = searchParams.get("paypal_order_id") || searchParams.get("token") || "";

  const [state, setState] = useState<CaptureState>("loading");
  const [message, setMessage] = useState(t("Confirming PayPal payment...") || "Confirming PayPal payment...");

  useEffect(() => {
    let active = true;

    const capture = async () => {
      if (!orderCode && !paypalOrderId) {
        if (!active) return;
        setState("error");
        setMessage("Missing PayPal order reference.");
        return;
      }

      try {
        await BookingProductApi.paypalCaptureTicketOrder({
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
        console.error("Failed to capture Ticket PayPal payment", error);
        setState("error");
        setMessage(error?.payload?.message || "Unable to confirm PayPal payment.");
      }
    };

    void capture();

    return () => {
      active = false;
    };
  }, [orderCode, paypalOrderId, router, t]);

  return (
    <div className="pt-[90px] lg:min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {state === "loading" && (
          <>
            <Loader2 className="text-blue-500 w-16 h-16 mx-auto animate-spin" />
            <h2 className="text-2xl font-semibold text-slate-800 mt-4">
              Processing payment
            </h2>
            <p className="text-gray-600 mt-2">{message}</p>
          </>
        )}

        {state === "error" && (
          <>
            <XCircle className="text-red-500 w-16 h-16 mx-auto" />
            <h2 className="text-2xl font-semibold text-red-700 mt-4">
              PayPal payment not completed
            </h2>
            <p className="text-gray-600 mt-2">{message}</p>
            <button
              type="button"
              onClick={() => router.push("/ve-vui-choi")}
              className="inline-flex items-center justify-center mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Back to Amusement Tickets
            </button>
          </>
        )}

        {state === "success" && (
          <>
            <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto" />
            <h2 className="text-2xl font-semibold text-green-700 mt-4">
              Payment successful!
            </h2>
            <p className="text-gray-600 mt-2">Your ticket order is now being processed.</p>
          </>
        )}
      </div>
    </div>
  );
}
