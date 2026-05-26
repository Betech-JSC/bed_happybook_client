"use client";

import LoadingButton from "@/components/base/LoadingButton";
import { formatCurrency } from "@/lib/formatters";
import type { ConfirmPriceResponse } from "@/types/flightConfirmPrice";
import { normalizeConfirmPriceResponse } from "@/utils/buildFlightConfirmPricePayload";
import CountDownCheckOut from "./CountDownCheckOut";

interface FlightConfirmPriceReviewProps {
  confirmData: ConfirmPriceResponse;
  estimatedTotal: number;
  totalDiscount: number;
  onBack: () => void;
  onProceedPayment: () => void;
  isProceeding: boolean;
  isExpired: boolean;
  onExpired: () => void;
  isHeld?: boolean;
  pnrNumber?: string | null;
}

export default function FlightConfirmPriceReview({
  confirmData,
  estimatedTotal,
  totalDiscount,
  onBack,
  onProceedPayment,
  isProceeding,
  isExpired,
  onExpired,
  isHeld = false,
  pnrNumber = null,
}: FlightConfirmPriceReviewProps) {
  const normalized = normalizeConfirmPriceResponse(confirmData);
  const confirmedTotal = normalized.totalPrice ?? estimatedTotal - totalDiscount;
  const holdIso = normalized.holdExpiresAt ?? null;
  const deadline = holdIso ? new Date(holdIso) : null;
  const hasValidDeadline = deadline && !Number.isNaN(deadline.getTime());

  return (
    <section className="mt-6 space-y-4">
      <div className="rounded-2xl border border-[#B2DDFF] bg-[#EFF8FF] p-4 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-[#175CD3]" data-translate="true">
              {isHeld ? "Đã giữ chỗ thành công" : "Giá đã được xác nhận"}
            </p>
            <p className="mt-1 text-22 font-bold text-[#0C4089]" data-translate="true">
              {isHeld
                ? "Vui lòng thanh toán để xác nhận vé"
                : "Vui lòng kiểm tra trước khi thanh toán"}
            </p>
          </div>
          {hasValidDeadline && !isExpired && (
            <div className="flex flex-col items-start md:items-end">
              <span className="text-sm text-gray-600" data-translate="true">
                {isHeld ? "Thời gian giữ chỗ" : "Thời gian giữ giá"}
              </span>
              <CountDownCheckOut
                timeCountDown={deadline}
                handleTicketPaymentTimeout={onExpired}
              />
            </div>
          )}
        </div>
        {pnrNumber && isHeld && (
          <p className="mt-3 text-sm text-gray-600">
            Mã đặt chỗ (PNR):{" "}
            <span className="font-semibold text-gray-900">{pnrNumber}</span>
          </p>
        )}
        {normalized.bookingId && !isHeld && (
          <p className="mt-3 text-sm text-gray-600">
            Mã giữ chỗ:{" "}
            <span className="font-semibold text-gray-900">{normalized.bookingId}</span>
          </p>
        )}
      </div>

      <div className="rounded-2xl bg-white p-4 md:p-6 shadow-sm border border-gray-100">
        <p className="text-18 font-bold mb-4" data-translate="true">
          Giá cuối cùng
        </p>
        <div className="space-y-3 text-sm">
          {normalized.totalTax != null && (
            <div className="flex justify-between text-gray-600">
              <span data-translate="true">Thuế và phí</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(normalized.totalTax)}
              </span>
            </div>
          )}
          {normalized.breakdown.total_fee_service != null && (
            <div className="flex justify-between text-gray-600">
              <span data-translate="true">Phí dịch vụ</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(normalized.breakdown.total_fee_service)}
              </span>
            </div>
          )}
          {totalDiscount > 0 && (
            <div className="flex justify-between text-gray-600">
              <span data-translate="true">Giảm giá</span>
              <span className="font-medium text-green-700">
                -{formatCurrency(totalDiscount)}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
            <span className="font-bold text-gray-800" data-translate="true">
              Tổng thanh toán
            </span>
            <span className="font-bold text-primary text-xl">
              {formatCurrency(confirmedTotal)}
            </span>
          </div>
        </div>
        {estimatedTotal > 0 &&
          Math.abs(confirmedTotal - (estimatedTotal - totalDiscount)) > 1000 && (
            <p className="mt-3 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
              Giá đã được cập nhật so với lúc tìm kiếm. Vui lòng kiểm tra trước khi
              thanh toán.
            </p>
          )}
      </div>

      {isExpired && (
        <p className="text-sm text-red-600 font-medium" data-translate="true">
          Phiên đặt vé đã hết hạn. Vui lòng quay lại và tìm chuyến bay khác.
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          data-translate="true"
        >
          Quay lại chỉnh sửa
        </button>
        <LoadingButton
          type="button"
          style="mt-0"
          isLoading={isProceeding}
          text={isHeld ? "Thanh toán ngay" : "Xác nhận và thanh toán"}
          disabled={isExpired}
          onClick={onProceedPayment}
        />
      </div>
    </section>
  );
}
