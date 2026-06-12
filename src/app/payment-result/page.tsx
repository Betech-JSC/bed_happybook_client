"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const status = searchParams.get("status");
  const paymentMethod = (searchParams.get("payment_method") || "").toLowerCase();
  const orderCode = searchParams.get("id") || searchParams.get("order_code") || "";

  const isSuccess = status === "success";
  const isEnglish = paymentMethod === "paypal";

  const successTitle = isEnglish ? "Payment successful!" : "Thanh toán thành công!";
  const successBodyTop = isEnglish
    ? "Thank you for your order."
    : "Cảm ơn bạn đã đặt hàng.";

  const isAmusementTicket = orderCode.startsWith("EVT");
  const successBodyBottom = isEnglish
    ? (isAmusementTicket
        ? "Your ticket order will be processed shortly."
        : orderCode.startsWith("YACHT")
        ? "Your yacht charter booking will be processed shortly."
        : orderCode.startsWith("VISA")
        ? "Your visa service order will be processed shortly."
        : orderCode.startsWith("COMBO")
        ? "Your combo package booking will be processed shortly."
        : orderCode.startsWith("HAP")
        ? "Your booking will be processed shortly."
        : "Your eSIM order will be processed shortly.")
    : "Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất.";

  const errorTitle = isEnglish ? "Payment failed" : "Thanh toán thất bại";
  const errorBodyTop = isEnglish
    ? "An error occurred during payment."
    : "Đã xảy ra lỗi trong quá trình thanh toán.";
  const errorBodyBottom = isEnglish
    ? "Please try again or contact support for assistance."
    : "Vui lòng thử lại hoặc liên hệ CSKH để được hỗ trợ.";
  const homeLabel = isEnglish ? "Back to home" : "Quay về trang chủ";

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
        <div className="w-full max-w-2xl rounded-[28px] bg-white px-6 py-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.12)] flex items-center justify-center min-h-[300px]">
          <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-2xl rounded-[28px] bg-white px-6 py-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
        {isSuccess ? (
          <>
            <CheckCircle className="mx-auto h-20 w-20 text-green-500" strokeWidth={1.8} />
            <h2 className="mt-6 text-3xl font-semibold text-green-700">
              {successTitle}
            </h2>
            <p className="mt-4 text-xl text-slate-600 leading-relaxed">
              {successBodyTop}
              <br />
              {successBodyBottom}
            </p>
            {orderCode ? (
              <p className="mt-6 text-lg text-slate-500">
                {isEnglish ? "Order code: " : "Mã đơn: "}
                <span className="font-medium text-slate-700">{orderCode}</span>
              </p>
            ) : null}
          </>
        ) : (
          <>
            <XCircle className="mx-auto h-20 w-20 text-red-500" strokeWidth={1.8} />
            <h2 className="mt-6 text-3xl font-semibold text-red-700">
              {errorTitle}
            </h2>
            <p className="mt-4 text-xl text-slate-600 leading-relaxed">
              {errorBodyTop}
              <br />
              {errorBodyBottom}
            </p>
          </>
        )}

        <Link
          href="/"
          className="mt-8 inline-flex min-w-[260px] items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-xl font-medium text-white shadow-lg transition hover:bg-blue-700"
        >
          {homeLabel}
        </Link>
      </div>
    </div>
  );
}
