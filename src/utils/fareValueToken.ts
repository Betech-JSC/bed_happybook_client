/** VJ / Airdata fare token in fareOption.fareValue (base64 JSON). */

export interface FareValueTokenPayload {
  bookingKey?: string;
  expiredAt?: number | string;
}

const BASE64_URL_SAFE = /^[A-Za-z0-9+/=_-]+$/;

/** Copy nguyên từ API — chỉ trim khoảng trắng đầu/cuối. */
export function copyFareValueRaw(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

export function parseFareValueToken(
  fareValue: string
): FareValueTokenPayload | null {
  const raw = copyFareValueRaw(fareValue);
  if (!raw || !BASE64_URL_SAFE.test(raw)) return null;

  try {
    const decoded = atob(raw.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(decoded) as FareValueTokenPayload;
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    return null;
  }
  return null;
}

export function fareValueExpiresAtMs(fareValue: string): number | null {
  const token = parseFareValueToken(fareValue);
  if (!token?.expiredAt) return null;
  const n =
    typeof token.expiredAt === "number"
      ? token.expiredAt
      : Date.parse(String(token.expiredAt));
  return Number.isNaN(n) ? null : n;
}

export function isFareValueExpired(fareValue: string): boolean {
  const expires = fareValueExpiresAtMs(fareValue);
  if (expires == null) return false;
  return Date.now() >= expires;
}

export type FareValueValidation =
  | { ok: true }
  | { ok: false; code: "missing" | "invalid_format" | "expired" | "decode_failed" };

/** Pre-flight check trước confirm-price (đặc biệt VJ). */
export function validateFareValueForConfirm(
  fareValue: unknown,
  source?: string
): FareValueValidation {
  const raw = copyFareValueRaw(fareValue);
  if (!raw) return { ok: false, code: "missing" };

  const src = String(source ?? "").toUpperCase();
  const isVj = src === "VJ" || src.includes("VIETJET");

  if (isVj) {
    if (!BASE64_URL_SAFE.test(raw)) {
      return { ok: false, code: "invalid_format" };
    }
    const token = parseFareValueToken(raw);
    if (!token?.bookingKey) {
      return { ok: false, code: "decode_failed" };
    }
    if (isFareValueExpired(raw)) {
      return { ok: false, code: "expired" };
    }
  }

  return { ok: true };
}

export function fareValueValidationMessage(
  result: Extract<FareValueValidation, { ok: false }>,
  language: "vi" | "en" = "vi"
): string {
  const vi: Record<string, string> = {
    missing: "Thiếu mã giá (fareValue). Vui lòng chọn lại hạng vé.",
    invalid_format:
      "Mã giá không hợp lệ (có thể bị hỏng khi lưu). Vui lòng tìm chuyến bay lại.",
    decode_failed:
      "Không đọc được token giá VietJet. Vui lòng tìm kiếm lại và chọn vé mới.",
    expired:
      "Token giá đã hết hạn. Vui lòng tìm chuyến bay lại và xác nhận giá ngay.",
  };
  const en: Record<string, string> = {
    missing: "Fare token missing. Please select a fare again.",
    invalid_format: "Invalid fare token. Please search again.",
    decode_failed: "Cannot read VietJet fare token. Please search again.",
    expired: "Fare token expired. Please search and confirm again.",
  };
  return (language === "vi" ? vi : en)[result.code] ?? vi.expired;
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
