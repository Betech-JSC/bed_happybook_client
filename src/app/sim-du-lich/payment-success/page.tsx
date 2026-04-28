"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { ProductEsimApi } from "@/api/ProductEsim";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSimDuLichStaticText } from "../hooks/useSimDuLichStaticText";

type CaptureState = "loading" | "success" | "error";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const t = useSimDuLichStaticText(language === "en" ? "en" : "vi");
  const orderCode = searchParams.get("order_code") || searchParams.get("id") || "";
  const paypalOrderId = searchParams.get("paypal_order_id") || searchParams.get("token") || "";

  const [state, setState] = useState<CaptureState>("loading");
  const [message, setMessage] = useState(t("Confirming PayPal payment..."));

  useEffect(() => {
    let active = true;

    const capture = async () => {
        if (!orderCode && !paypalOrderId) {
          if (!active) return;
          setState("error");
          setMessage(t("Missing PayPal order reference."));
          return;
        }

      try {
        await ProductEsimApi.paypalCaptureOrder({
          order_code: orderCode || undefined,
          paypal_order_id: paypalOrderId || undefined,
        }, "en");

        if (!active) return;
        setState("success");
        router.replace(
          `/payment-result?status=success&id=${encodeURIComponent(
            orderCode || paypalOrderId
          )}&payment_method=paypal`
        );
      } catch (error: any) {
        if (!active) return;
        console.error("Failed to capture eSIM PayPal payment", error);
        setState("error");
        setMessage(error?.payload?.message || t("Unable to confirm PayPal payment."));
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
              {t("Processing payment")}
            </h2>
            <p className="text-gray-600 mt-2">{message}</p>
          </>
        )}

        {state === "error" && (
          <>
            <XCircle className="text-red-500 w-16 h-16 mx-auto" />
            <h2 className="text-2xl font-semibold text-red-700 mt-4">
              {t("PayPal payment not completed")}
            </h2>
            <p className="text-gray-600 mt-2">{message}</p>
            <button
              type="button"
              onClick={() => router.push("/sim-du-lich")}
              className="inline-flex items-center justify-center mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {t("Back to eSIM")}
            </button>
          </>
        )}

        {state === "success" && (
          <>
            <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto" />
            <h2 className="text-2xl font-semibold text-green-700 mt-4">
              {t("Payment successful!")}
            </h2>
            <p className="text-gray-600 mt-2">{t("Your eSIM order is now being processed.")}</p>
          </>
        )}
      </div>
    </div>
  );
}
