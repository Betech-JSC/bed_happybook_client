import { isBookingDeadlineExpired } from "@/utils/flightBookingFlow";
import { normalizeConfirmPriceResponse } from "@/utils/buildFlightConfirmPricePayload";
import { getFlightDraftMeta } from "@/utils/flightDraftSession";

export const PRICE_HOLD_STARTED_AT_KEY = "price_hold_started_at";

/** Absolute hold end time from confirm-price (not book-flight payment deadline). */
export function resolvePriceHoldExpiresAt(
  session: Record<string, unknown> | null | undefined
): string | null {
  if (!session) return null;

  const orderInfo =
    typeof session.orderInfo === "object" && session.orderInfo
      ? (session.orderInfo as Record<string, unknown>)
      : undefined;

  // Nếu vé đã được giữ (held === true) hoặc đơn hàng khôi phục từ DB đã qua bước giữ giá (status khác draft/price_confirmed)
  // thì sử dụng thời hạn thanh toán giữ chỗ thực tế (booking_deadline/bookingDeadline) từ API hãng bay.
  const isHeld =
    session.held === true ||
    (orderInfo &&
      orderInfo.status !== "price_confirmed" &&
      orderInfo.status !== "draft");

  const bookingDeadline = orderInfo?.booking_deadline ?? orderInfo?.bookingDeadline;

  if (isHeld && typeof bookingDeadline === "string" && bookingDeadline.length > 0) {
    return bookingDeadline;
  }

  const confirmPrice = session.confirmPrice as Record<string, unknown> | undefined;
  if (confirmPrice) {
    const { holdExpiresAt } = normalizeConfirmPriceResponse(confirmPrice);
    if (holdExpiresAt) return holdExpiresAt;
  }

  const fromOrder = orderInfo?.hold_expires_at ?? orderInfo?.holdExpiresAt;
  if (typeof fromOrder === "string" && fromOrder.length > 0) {
    return fromOrder;
  }

  if (typeof bookingDeadline === "string" && bookingDeadline.length > 0) {
    return bookingDeadline;
  }

  return null;
}

export function resolvePriceHoldStartedAt(
  session: Record<string, unknown> | null | undefined
): string | null {
  if (!session) return null;
  const raw = session[PRICE_HOLD_STARTED_AT_KEY];
  return typeof raw === "string" && raw.length > 0 ? raw : null;
}

export function getPriceHoldRemainingMs(
  holdExpiresAt: string | null | undefined,
  nowMs: number = Date.now()
): number {
  if (!holdExpiresAt) return 0;

  // Normalize YYYY-MM-DD HH:mm:ss to YYYY-MM-DDTHH:mm:ss for cross-browser parsing (Safari, iOS, etc.)
  let normalized = holdExpiresAt.trim();
  if (normalized.includes(" ") && !normalized.includes("T")) {
    normalized = normalized.replace(" ", "T");
  }

  const end = new Date(normalized).getTime();
  if (Number.isNaN(end)) return 0;
  return Math.max(0, end - nowMs);
}

export function isPriceHoldExpired(
  holdExpiresAt: string | null | undefined
): boolean {
  if (!holdExpiresAt) return false;
  return getPriceHoldRemainingMs(holdExpiresAt) <= 0;
}

/**
 * @deprecated Use resolvePriceHoldExpiresAt on full booking session (includes confirmPrice).
 */
export function resolveHoldExpiresAt(
  source: Record<string, unknown> | null | undefined
): string | null {
  return resolvePriceHoldExpiresAt(source);
}

export function isHoldExpired(
  deadline: string | Date | null | undefined
): boolean {
  return isPriceHoldExpired(
    deadline instanceof Date ? deadline.toISOString() : deadline
  );
}

export function buildFlightSearchUrlFromDraft(): string {
  const meta = getFlightDraftMeta();
  if (!meta?.startPoint || !meta?.endPoint || !meta?.departDate) {
    return "/ve-may-bay/tim-kiem-ve";
  }
  const params = new URLSearchParams({
    StartPoint: meta.startPoint,
    EndPoint: meta.endPoint,
    tripType: meta.tripType,
    DepartDate: meta.departDate,
    ReturnDate: meta.returnDate,
    Adt: "1",
    Chd: "0",
    Inf: "0",
  });
  return `/ve-may-bay/tim-kiem-ve?${params.toString()}`;
}
