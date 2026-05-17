"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CountDownCheckOut from "./CountDownCheckOut";
import type { FlightDraftMatch } from "@/utils/flightDraftSession";
import {
  clearFlightDraftSession,
  dismissFlightDraft,
  formatDraftDateLabel,
} from "@/utils/flightDraftSession";
import type { FlightDraftStage } from "@/utils/flightDraftSession";
import { isBookingDeadlineExpired } from "@/utils/flightBookingFlow";
import { refreshConfirmPriceFromBookingSession } from "@/utils/refreshConfirmPriceFromBookingSession";
import { formatCurrency } from "@/lib/formatters";

const STAGE_COPY: Record<FlightDraftStage, { title: string; cta: string }> = {
  selecting: { title: "Đang chọn vé", cta: "Tiếp tục" },
  price_confirmed: { title: "Giá đã giữ", cta: "Tiếp tục đặt vé" },
  pending_payment: { title: "Chờ thanh toán", cta: "Thanh toán" },
};

function displayPlace(label: string | undefined, code: string): string {
  if (!label?.trim()) return code;
  const name = label
    .trim()
    .replace(/\s*\([A-Z]{3}\)\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return name ? `${name} (${code})` : code;
}

interface ResumeFlightDraftBannerProps {
  match: FlightDraftMatch;
  fromLabel?: string;
  toLabel?: string;
  onClose: () => void;
}

export default function ResumeFlightDraftBanner({
  match,
  fromLabel,
  toLabel,
  onClose,
}: ResumeFlightDraftBannerProps) {
  const router = useRouter();
  const { meta } = match;
  const copy = STAGE_COPY[meta.stage];
  const routeLabel = `${displayPlace(fromLabel, meta.startPoint)} → ${displayPlace(toLabel, meta.endPoint)}`;
  const departLabel = formatDraftDateLabel(meta.departDate);
  const dateLabel =
    meta.tripType === "roundTrip"
      ? `${departLabel} – ${formatDraftDateLabel(meta.returnDate)}`
      : departLabel;
  const deadline = meta.bookingDeadline
    ? new Date(meta.bookingDeadline)
    : null;
  const hasValidDeadline =
    deadline &&
    !Number.isNaN(deadline.getTime()) &&
    deadline.getTime() > Date.now();
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleContinue = async () => {
    if (meta.stage !== "pending_payment") {
      router.push(meta.resumeUrl);
      return;
    }

    if (meta.bookingDeadline && isBookingDeadlineExpired(meta.bookingDeadline)) {
      toast.error("Đã hết thời gian giữ giá / thanh toán.");
      return;
    }

    setPaymentLoading(true);
    try {
      const refreshed = await refreshConfirmPriceFromBookingSession();
      if (!refreshed) {
        toast.error(
          "Không thể lấy giá mới. Vui lòng mở lại đơn hoặc tìm chuyến khác."
        );
        return;
      }

      toast.success(
        `Tổng thanh toán: ${formatCurrency(refreshed.grandTotal)}. Vui lòng kiểm tra trước khi thanh toán.`
      );

      router.push(meta.resumeUrl);
    } catch {
      toast.error("Không thể cập nhật giá. Vui lòng thử lại.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDiscard = () => {
    clearFlightDraftSession();
    onClose();
  };
  const handleDismiss = () => {
    dismissFlightDraft(match.routeKey);
    onClose();
  };

  return (
    <div
      className="mb-4 flex flex-col gap-3 rounded-xl border border-[#B2DDFF] bg-[#EFF8FF] px-4 py-3 md:flex-row md:items-center md:justify-between"
      role="region"
      aria-label="Tiếp tục đặt vé trước đó"
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#175CD3]">{copy.title}</p>
        <p className="mt-0.5 truncate font-bold text-[#0C4089]">{routeLabel}</p>
        <p className="mt-0.5 text-sm text-gray-600">
          {dateLabel}
          {meta.stage === "pending_payment" && meta.orderCode && (
            <span className="text-gray-500"> · {meta.orderCode}</span>
          )}
        </p>
        {hasValidDeadline && (
          <div className="mt-1.5 flex items-center gap-2 text-sm text-gray-600">
            <span>Còn</span>
            <CountDownCheckOut
              timeCountDown={deadline}
              handleTicketPaymentTimeout={handleDiscard}
            />
          </div>
        )}
      </div>

      <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleContinue}
          disabled={paymentLoading}
          className="rounded-lg bg-[#1570EF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0C4089] disabled:opacity-60"
        >
          {paymentLoading ? "Đang lấy giá..." : copy.cta}
        </button>
        <button
          type="button"
          onClick={handleDiscard}
          disabled={paymentLoading}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          Tìm mới
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          disabled={paymentLoading}
          className="px-2 py-2 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-60"
        >
          Ẩn
        </button>
      </div>
    </div>
  );
}
