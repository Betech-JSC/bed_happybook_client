import { isBookingDeadlineExpired } from "@/utils/flightBookingFlow";
import { getFlightDraftMeta } from "@/utils/flightDraftSession";

function readHoldField(
  source: Record<string, unknown> | null | undefined,
  key: string
): string | undefined {
  if (!source) return undefined;
  const orderInfo =
    typeof source.orderInfo === "object" && source.orderInfo
      ? (source.orderInfo as Record<string, unknown>)
      : undefined;
  const camel =
    key === "hold_expires_at" ? "holdExpiresAt" : "bookingDeadline";
  const raw =
    source[key] ??
    source[camel] ??
    orderInfo?.[key] ??
    orderInfo?.[camel];
  return typeof raw === "string" && raw.length > 0 ? raw : undefined;
}

/** Prefer API hold_expires_at; fall back to booking_deadline for older responses. */
export function resolveHoldExpiresAt(
  source: Record<string, unknown> | null | undefined
): string | null {
  return (
    readHoldField(source, "hold_expires_at") ??
    readHoldField(source, "booking_deadline") ??
    null
  );
}

export function isHoldExpired(
  deadline: string | Date | null | undefined
): boolean {
  return isBookingDeadlineExpired(deadline);
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
