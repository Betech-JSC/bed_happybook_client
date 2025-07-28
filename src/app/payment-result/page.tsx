"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const isSuccess = status === "success";

  return (
    <div className="pt-[90px] lg:min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {isSuccess ? (
          <>
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto" />
            <h2 className="text-2xl font-semibold text-green-700 mt-4">
              Thanh toán thành công!
            </h2>
            <p className="text-gray-600 mt-2">Cảm ơn bạn đã đặt hàng.</p>{" "}
            <p className="text-gray-600">
              Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất.
            </p>
          </>
        ) : (
          <>
            <XCircle className="text-red-500 w-16 h-16 mx-auto" />
            <h2 className="text-2xl font-semibold text-red-700 mt-4">
              Thanh toán thất bại
            </h2>
            <p className="text-gray-600 mt-2">
              Đã xảy ra lỗi trong quá trình thanh toán.
            </p>
            <p className="text-gray-600">
              Vui lòng thử lại hoặc liên hệ CSKH để được hỗ trợ.
            </p>
          </>
        )}

        <Link
          href="/"
          className="inline-block mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}
