"use client";

interface PostPaymentSuccessBannerProps {
  orderCode?: string;
}

export default function PostPaymentSuccessBanner({
  orderCode,
}: PostPaymentSuccessBannerProps) {
  return (
    <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-base">
      <p className="text-lg font-bold text-green-800">Thanh toán thành công</p>
      <p className="mt-2 font-medium text-green-900">
        Chúng tôi đang xử lý vé và sẽ gửi vé cho bạn trong vòng 24h.
      </p>
      {orderCode && (
        <p className="mt-2 text-sm text-gray-700">
          Mã đơn hàng:{" "}
          <span className="font-semibold text-[#0C4089]">{orderCode}</span>
        </p>
      )}
    </div>
  );
}
