"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import type { FlightDraftMatch } from "@/utils/flightDraftSession";
import {
  clearFlightDraftSession,
  formatDraftDateLabel,
} from "@/utils/flightDraftSession";
import { isHoldExpired } from "@/utils/flightHoldExpiry";
import { refreshConfirmPriceFromBookingSession } from "@/utils/refreshConfirmPriceFromBookingSession";
import { formatCurrency } from "@/lib/formatters";

interface ResumeFlightDraftModalProps {
  match: FlightDraftMatch;
  fromLabel?: string;
  toLabel?: string;
  onClose: () => void;
}

function displayPlace(label: string | undefined, code: string): string {
  if (!label?.trim()) return code;
  const name = label
    .trim()
    .replace(/\s*\([A-Z]{3}\)\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return name ? `${name} (${code})` : code;
}

export default function ResumeFlightDraftModal({
  match,
  fromLabel,
  toLabel,
  onClose,
}: ResumeFlightDraftModalProps) {
  const router = useRouter();
  const { meta } = match;
  const routeLabel = `${displayPlace(fromLabel, meta.startPoint)} → ${displayPlace(toLabel, meta.endPoint)}`;
  const departLabel = formatDraftDateLabel(meta.departDate);
  const dateLabel =
    meta.tripType === "roundTrip"
      ? `${departLabel} – ${formatDraftDateLabel(meta.returnDate)}`
      : departLabel;
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (meta.bookingDeadline && isHoldExpired(meta.bookingDeadline)) {
      toast.error("Phiên đặt vé đã hết hạn");
      clearFlightDraftSession();
      onClose();
      return;
    }

    if (meta.stage !== "pending_payment") {
      router.push(meta.resumeUrl);
      onClose();
      return;
    }

    setLoading(true);
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
      onClose();
    } catch {
      toast.error("Không thể cập nhật giá. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    clearFlightDraftSession();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-draft-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2
          id="resume-draft-title"
          className="text-lg font-bold text-[#0C4089]"
        >
          Bạn có đơn đặt vé chưa hoàn thành. Tiếp tục?
        </h2>
        <p className="mt-2 font-medium text-gray-800">{routeLabel}</p>
        <p className="mt-1 text-sm text-gray-600">{dateLabel}</p>
        {meta.orderCode && (
          <p className="mt-1 text-sm text-gray-500">Mã đơn: {meta.orderCode}</p>
        )}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Bắt đầu mới
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={loading}
            className="rounded-lg bg-[#1570EF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0C4089] disabled:opacity-60"
          >
            {loading ? "Đang tải..." : "Tiếp tục"}
          </button>
        </div>
      </div>
    </div>
  );
}
