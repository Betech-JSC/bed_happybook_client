/** fareOption.fareValue from search — pass through to confirm-price as-is. */

import { resolveVjSegmentSearchToken } from "@/utils/vjSegmentToken";
import { resolveVn1aFareValueFromSearch } from "@/utils/vn1aConfirmPrice";
import {
  isVuFareValueMirroringItineraryId,
  isVuSource,
  resolveVuFareValueFromSearch,
} from "@/utils/vuConfirmPrice";

export function isVietJetSource(source: unknown): boolean {
  const s = String(source ?? "").toUpperCase();
  return s === "VJ" || s.includes("VIETJET");
}

/** Vietnam Airlines (Airdata VN1A). Khác VJ — search thường trả fareOptions[].fareValue = "". */
export function isVietnamAirlinesSource(source: unknown): boolean {
  const s = String(source ?? "").toUpperCase();
  return s === "VN1A" || s === "VN";
}

/** Non-VJ: trim đầu/cuối. */
export function copyFareValueRaw(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

/** Các key BE/Airdata có thể trả token giá (ưu tiên fareValue). */
function vjFareValueCandidates(fareOption: Record<string, unknown>): unknown[] {
  return [
    fareOption.fareValue,
    fareOption.fare_value,
    fareOption.FareValue,
  ];
}

/**
 * VJ (BE): copy nguyên fareOptions[j].fareValue — không trim, không JSON.stringify lại.
 */
export function copyVjFareValueForConfirm(fareOption: Record<string, unknown>): string {
  for (const v of vjFareValueCandidates(fareOption)) {
    if (typeof v === "string" && v.length > 0) return v;
  }
  return "";
}

/** Khôi phục fareValue từ hạng vé đã chọn / trip / kết quả search gốc. */
export function repairVjFareOption(
  fareOption: Record<string, unknown>,
  options?: {
    fareOptionIndex?: number;
    trip?: Record<string, unknown>;
    searchFlight?: Record<string, unknown>;
  }
): Record<string, unknown> {
  const existing = copyVjFareValueForConfirm(fareOption);
  if (existing) return { ...fareOption, fareValue: existing };

  const index = options?.fareOptionIndex ?? 0;
  const candidates: Record<string, unknown>[] = [fareOption];

  for (const container of [options?.trip, options?.searchFlight]) {
    if (!container) continue;
    const list = container.fareOptions as Record<string, unknown>[] | undefined;
    if (list?.[index]) candidates.push(list[index]);
    const stc = container.selectedTicketClass as Record<string, unknown> | undefined;
    if (stc) candidates.push(stc);
  }

  for (const row of candidates) {
    const fv = copyVjFareValueForConfirm(row);
    if (fv) return { ...fareOption, ...row, fareValue: fv };
  }

  return fareOption;
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
  // FE không chặn flow theo fareValue cho bất kỳ hãng nào.
  // BE sẽ là nguồn quyết định cuối cùng khi xử lý confirm-price/book.
  return { ok: true };
}

export function resolveFareValueFromFareOption(
  source: unknown,
  fareOption: Record<string, unknown>,
  trip?: Record<string, unknown>
): string {
  if (isVietJetSource(source)) {
    return copyVjFareValueForConfirm(fareOption);
  }
  if (isVietnamAirlinesSource(source)) {
    return resolveVn1aFareValueFromSearch(fareOption, trip);
  }
  if (isVuSource(source)) {
    return resolveVuFareValueFromSearch(fareOption, trip);
  }
  return copyFareValueRaw(fareOption.fareValue);
}

/** Khôi phục fareValue từ fareOptions[j] khi selectedTicketClass thiếu token (VU RT/OW). */
export function repairFareOptionFromTrip(
  fareOption: Record<string, unknown>,
  options?: {
    fareOptionIndex?: number;
    trip?: Record<string, unknown>;
    source?: unknown;
  }
): Record<string, unknown> {
  const source = options?.source;
  if (isVietJetSource(source)) {
    return repairVjFareOption(fareOption, options);
  }

  const trip = options?.trip;

  if (isVietnamAirlinesSource(source)) {
    const existing = resolveVn1aFareValueFromSearch(fareOption, trip);
    if (existing) return { ...fareOption, fareValue: existing };

    const index = options?.fareOptionIndex ?? 0;
    const list = trip?.fareOptions as Record<string, unknown>[] | undefined;
    const fromList = list?.[index];
    if (fromList) {
      const fv = resolveVn1aFareValueFromSearch(fromList, trip);
      if (fv) return { ...fareOption, ...fromList, fareValue: fv };
    }

    const stc = trip?.selectedTicketClass as Record<string, unknown> | undefined;
    if (stc) {
      const fv = resolveVn1aFareValueFromSearch(stc, trip);
      if (fv) return { ...fareOption, ...stc, fareValue: fv };
    }

    return { ...fareOption, fareValue: "" };
  }

  if (isVuSource(source) && trip) {
    const index = options?.fareOptionIndex ?? 0;
    const list = trip.fareOptions as Record<string, unknown>[] | undefined;
    const fromList = list?.[index];
    if (fromList) {
      const fromListFv = resolveVuFareValueFromSearch(fromList, trip);
      if (fromListFv) {
        return {
          ...fareOption,
          ...fromList,
          fareValue: isVuFareValueMirroringItineraryId(fromListFv, trip)
            ? ""
            : fromListFv,
        };
      }
    }

    const stc = trip.selectedTicketClass as Record<string, unknown> | undefined;
    if (stc) {
      const stcFv = resolveVuFareValueFromSearch(stc, trip);
      if (stcFv) {
        return {
          ...fareOption,
          ...stc,
          fareValue: isVuFareValueMirroringItineraryId(stcFv, trip)
            ? ""
            : stcFv,
        };
      }
    }

    const ownFv = resolveVuFareValueFromSearch(fareOption, trip);
    return {
      ...fareOption,
      fareValue: isVuFareValueMirroringItineraryId(ownFv, trip) ? "" : ownFv,
    };
  }

  const existing = resolveFareValueFromFareOption(source, fareOption, trip);
  if (existing) return { ...fareOption, fareValue: existing };

  const index = options?.fareOptionIndex ?? 0;
  if (!trip) return { ...fareOption, fareValue: "" };

  const list = trip.fareOptions as Record<string, unknown>[] | undefined;
  const fromList = list?.[index];
  if (fromList) {
    const fv = resolveFareValueFromFareOption(source, fromList, trip);
    if (fv) return { ...fareOption, ...fromList, fareValue: fv };
  }

  const stc = trip.selectedTicketClass as Record<string, unknown> | undefined;
  if (stc) {
    const fv = resolveFareValueFromFareOption(source, stc, trip);
    if (fv) return { ...fareOption, ...stc, fareValue: fv };
  }

  return { ...fareOption, fareValue: "" };
}

function linkVjInfantToAdult(paxLists: Record<string, unknown>[]): void {
  const firstAdult = paxLists.find((p) => p.paxType === "ADULT");
  const firstInfant = paxLists.find((p) => p.paxType === "INFANT");
  if (!firstAdult || !firstInfant) return;
  if (!firstAdult.childPaxId) {
    firstAdult.childPaxId = firstInfant.paxId;
  }
  if (!firstInfant.parentPaxId) {
    firstInfant.parentPaxId = firstAdult.paxId;
  }
}

/** VJ: giữ bookingKey itinerary (Postman placeholder), fareValue raw trên fareBreakdowns. */
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

  if (Array.isArray(payload.paxLists)) {
    const paxLists = (payload.paxLists as Record<string, unknown>[]).map((pax) => {
      const paxType = String(pax.paxType ?? "");
      const title = String(pax.title ?? "");
      if (paxType === "CHILD" || paxType === "INFANT") {
        if (title === "MR") return { ...pax, title: "MSTR" };
        if (title === "MS") return { ...pax, title: "MISS" };
      }
      return pax;
    });
    linkVjInfantToAdult(paxLists);
    next.paxLists = paxLists;
  }

  if (!Array.isArray(payload.itineraries)) return next;

  next.itineraries = (payload.itineraries as Record<string, unknown>[]).map(
    (itinerary) => {
      const fareBreakdowns = Array.isArray(itinerary.fareBreakdowns)
        ? (itinerary.fareBreakdowns as Record<string, unknown>[]).map((row) => ({
            ...row,
            fareValue:
              typeof row.fareValue === "string"
                ? row.fareValue
                : copyVjFareValueForConfirm(row as Record<string, unknown>),
          }))
        : itinerary.fareBreakdowns;

      const segments = Array.isArray(itinerary.segments)
        ? (itinerary.segments as Record<string, unknown>[]).map((seg) => {
            const operating = String(seg.operating ?? "").trim();
            const op =
              operating.toUpperCase() === "VJ" ? "" : operating;
            return {
              ...seg,
              operating: op,
              segmentValue: "",
              segmentId: resolveVjSegmentSearchToken(seg),
            };
          })
        : itinerary.segments;

      return {
        ...itinerary,
        bookingKey:
          typeof itinerary.bookingKey === "string" && itinerary.bookingKey
            ? itinerary.bookingKey
            : "string",
        fareBreakdowns,
        segments,
      };
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
    missing:
      "Thiếu mã giá hạng vé (fareValue). Vui lòng chọn lại hạng vé hoặc tìm chuyến mới.",
    invalid:
      "Mã giá hạng vé không hợp lệ hoặc đã hết hạn. Vui lòng tìm chuyến bay lại và chọn hạng vé mới.",
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
