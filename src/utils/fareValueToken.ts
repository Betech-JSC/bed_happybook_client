/** fareOption.fareValue from search — pass through to confirm-price as-is. */

export function isVietJetSource(source: unknown): boolean {
  const s = String(source ?? "").toUpperCase();
  return s === "VJ" || s.includes("VIETJET");
}

/** Non-VJ: trim đầu/cuối. */
export function copyFareValueRaw(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

/**
 * VJ (BE): copy nguyên fareOptions[j].fareValue — không trim, không JSON.stringify lại.
 */
export function copyVjFareValueForConfirm(fareOption: Record<string, unknown>): string {
  const v = fareOption.fareValue;
  return typeof v === "string" ? v : "";
}

const VJ_BOOKING_KEY_RE = /^[A-Za-z0-9+/=]+$/;
const VJ_FARE_VALUE_MOJIBAKE_RE = /[\u00A5\u0192]|Â¥|ƒ/;

function base64DecodeToUtf8(b64: string): string {
  const normalized = b64
    .padEnd(Math.ceil(b64.length / 4) * 4, "=")
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  if (typeof Buffer !== "undefined") {
    return Buffer.from(normalized, "base64").toString("utf8");
  }

  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

function pickBookingKey(parsed: Record<string, unknown>): string {
  const raw = parsed.bookingKey ?? parsed.booking_key;
  return typeof raw === "string" ? raw : "";
}

/**
 * VJ pre-confirm (BE): atob → JSON.parse; bookingKey ∈ /^[A-Za-z0-9+/=]+$/ và có + hoặc /; cấm ¥/ƒ.
 * Chỉ validate — payload vẫn gửi fareValue raw, không re-encode.
 */
export function validateVjFareValueForConfirm(
  fareValue: unknown
): { ok: true } | { ok: false } {
  const raw = typeof fareValue === "string" ? fareValue : "";
  if (!raw) return { ok: false };

  if (VJ_FARE_VALUE_MOJIBAKE_RE.test(raw)) return { ok: false };

  try {
    const parsed = JSON.parse(base64DecodeToUtf8(raw)) as Record<string, unknown>;
    const bookingKey = pickBookingKey(parsed);
    if (!bookingKey) return { ok: false };
    if (VJ_FARE_VALUE_MOJIBAKE_RE.test(bookingKey)) return { ok: false };
    if (!VJ_BOOKING_KEY_RE.test(bookingKey)) return { ok: false };
    if (!bookingKey.includes("+") && !bookingKey.includes("/")) return { ok: false };
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export type FareValueValidation =
  | { ok: true }
  | { ok: false; code: "missing" | "invalid" };

export function validateFareValueForConfirm(
  fareValue: unknown,
  options?: { source?: unknown }
): FareValueValidation {
  if (isVietJetSource(options?.source)) {
    const raw = typeof fareValue === "string" ? fareValue : "";
    if (!raw) return { ok: false, code: "missing" };
    if (!validateVjFareValueForConfirm(fareValue).ok) {
      return { ok: false, code: "invalid" };
    }
    return { ok: true };
  }

  const raw = copyFareValueRaw(fareValue);
  if (!raw) return { ok: false, code: "missing" };
  return { ok: true };
}

export function resolveFareValueFromFareOption(
  source: unknown,
  fareOption: Record<string, unknown>
): string {
  if (isVietJetSource(source)) {
    return copyVjFareValueForConfirm(fareOption);
  }
  return copyFareValueRaw(fareOption.fareValue);
}

/** Gỡ bookingKey riêng; giữ fareValue raw trên fareBreakdowns. */
export function sanitizeVjConfirmPriceRequest(
  payload: Record<string, unknown>
): Record<string, unknown> {
  if (!isVietJetSource(payload.type)) return payload;

  const session =
    typeof payload.session === "string" ? payload.session : String(payload.session ?? "");

  const next: Record<string, unknown> = {
    ...payload,
    type: "VJ",
    ...(session ? { session } : {}),
  };

  if (!Array.isArray(payload.itineraries)) return next;

  next.itineraries = (payload.itineraries as Record<string, unknown>[]).map(
    (itinerary) => {
      const { bookingKey: _bk, ...rest } = itinerary;
      const fareBreakdowns = Array.isArray(rest.fareBreakdowns)
        ? (rest.fareBreakdowns as Record<string, unknown>[]).map((row) => ({
            ...row,
            fareValue:
              typeof row.fareValue === "string"
                ? row.fareValue
                : copyVjFareValueForConfirm(row as Record<string, unknown>),
          }))
        : rest.fareBreakdowns;
      return { ...rest, fareBreakdowns };
    }
  );

  return next;
}

export function normalizeAirdataPhoneNumber(phone: unknown): string {
  const raw = String(phone ?? "").trim();
  if (!raw) return "";
  const compact = raw.replace(/[\s-]/g, "");
  return compact.replace(/^\+84(0)(\d{8,})$/, "+84$2");
}

export function fareValueValidationMessage(
  result: Extract<FareValueValidation, { ok: false }>,
  language: "vi" | "en" = "vi"
): string {
  const vi: Record<string, string> = {
    missing: "Vui lòng chọn lại hạng vé trước khi tiếp tục.",
    invalid:
      "Giá vé không còn hiệu lực. Vui lòng tìm chuyến bay lại và chọn hạng vé mới.",
  };
  const en: Record<string, string> = {
    missing: "Please select a fare class before continuing.",
    invalid:
      "This fare is no longer valid. Please search again and select a fare class.",
  };
  return (language === "vi" ? vi : en)[result.code] ?? vi.missing;
}

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
