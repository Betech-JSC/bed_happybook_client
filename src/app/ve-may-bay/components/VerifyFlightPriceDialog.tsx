"use client";

import React from "react";

interface VerifyFlightPriceDialogProps {
  open: boolean;
  loading: boolean;
  error: string | null;
  language?: string;
  onClose: () => void;
}

export default function VerifyFlightPriceDialog({
  open,
  loading,
  error,
  language = "vi",
  onClose,
}: VerifyFlightPriceDialogProps) {
  if (!open) return null;

  const isVi = language === "vi";

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verify-flight-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 transform transition-all duration-300 scale-100 flex flex-col items-center text-center">
        {loading ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <span className="loader_spiner !w-14 !h-14 !border-4 !border-blue-500 !border-t-blue-200 animate-spin mb-4"></span>
            <h2
              id="verify-flight-title"
              className="text-lg font-bold text-gray-900 mb-2"
            >
              {isVi ? "Đang xác thực hành trình" : "Verifying itinerary"}
            </h2>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              {isVi
                ? "Đang kiểm tra tình trạng chỗ và giá vé từ hãng bay..."
                : "Verifying seat availability and ticket price from the airline..."}
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-500 animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2
              id="verify-flight-title"
              className="text-xl font-bold text-gray-900 mb-2"
            >
              {isVi ? "Thông tin thay đổi" : "Availability Changed"}
            </h2>
            <p className="text-sm text-gray-600 max-w-sm mb-6 leading-relaxed">
              {error ||
                (isVi
                  ? "Hạng vé hoặc chuyến bay bạn chọn hiện không còn khả dụng trên hệ thống hãng bay."
                  : "The selected flight or seat class is no longer available from the airline.")}
            </p>
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 text-sm font-semibold shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isVi ? "Đóng & Chọn chuyến khác" : "Close & Choose another"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
