/** fareOption.fareValue from search — pass through to confirm-price as-is. */

/** Copy nguyên từ API — chỉ trim khoảng trắng đầu/cuối. */
export function copyFareValueRaw(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

export type FareValueValidation =
  | { ok: true }
  | { ok: false; code: "missing" };

/** Pre-flight check trước confirm-price — mọi source dùng chung. */
export function validateFareValueForConfirm(fareValue: unknown): FareValueValidation {
  const raw = copyFareValueRaw(fareValue);
  if (!raw) return { ok: false, code: "missing" };
  return { ok: true };
}

export function fareValueValidationMessage(
  result: Extract<FareValueValidation, { ok: false }>,
  language: "vi" | "en" = "vi"
): string {
  const vi: Record<string, string> = {
    missing: "Thiếu mã giá (fareValue). Vui lòng chọn lại hạng vé.",
  };
  const en: Record<string, string> = {
    missing: "Fare token missing. Please select a fare again.",
  };
  return (language === "vi" ? vi : en)[result.code] ?? vi.missing;
}

/** Airdata 200 nhưng không có bookingId / request id (echo paxLists khi reject). */
export function isConfirmPriceSoftFailure(
  payload: Record<string, unknown> | null | undefined
): boolean {
  if (!payload) return true;
  const data = (payload.data as Record<string, unknown>) ?? payload;
  const hasRequest =
    data.booking_flight_request_id != null ||
    data.bookingFlightRequestId != null;
  const hasBooking =
    Boolean(data.bookingId) ||
    Boolean(data.booking_id) ||
    Boolean(data.airdata_booking_id);
  const hasOrder = Boolean(data.order_code) || Boolean(data.sku);
  if (hasRequest || hasBooking || hasOrder) return false;
  if (Array.isArray(data.paxLists) && data.paxLists.length > 0) return true;
  return true;
}
