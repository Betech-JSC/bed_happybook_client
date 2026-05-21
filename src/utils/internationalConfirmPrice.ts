import type { ConfirmPricePaxListItem } from "@/types/flightConfirmPrice";
import { addMonths, startOfDay } from "date-fns";
import { normalizeDomesticSegmentRow } from "@/utils/domesticConfirmFields";
import {
  isMongoObjectId,
  resolve1GConfirmItineraryId,
} from "@/utils/international1G";

const ISO3_OVERRIDES: Record<string, string> = {
  VN: "VNM",
  US: "USA",
  GB: "GBR",
};

/** Quốc tế hoặc GDS 1G — cần segmentValue base64 từ search. */
export function isInternationalConfirmTrip(
  trip: Record<string, unknown>
): boolean {
  if (trip.domestic === false) return true;
  const source = String(trip.source ?? "").toUpperCase();
  return source === "1G";
}

export function isInternationalConfirmFlights(
  flights: Record<string, unknown>[]
): boolean {
  return flights.some((f) => isInternationalConfirmTrip(f));
}

/** segmentValue phải là token base64 từ search — không phải "1" / "2". */
export function isValidAirdataSegmentValue(value: unknown): boolean {
  const v = copyAirdataTokenRaw(value);
  if (!v) return false;
  if (/^\d+$/.test(v)) return false;
  return v.length >= 50;
}

/** Passthrough token base64 — không trim (tránh làm hỏng payload). */
export function copyAirdataTokenRaw(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) return "";
  return value;
}

export function copySegmentField(value: unknown): string {
  if (typeof value === "string") return value.trim();
  return "";
}

/**
 * itineraryId từ search/resource (VD: "p0") — không đổi thành "1"/"2" trừ khi API chỉ trả leg số.
 */
export function resolveItineraryIdFromTrip(
  trip: Record<string, unknown>,
  options?: {
    contextFallback?: string;
    allowLegFallback?: boolean;
    tripsSource?: "search" | "resource";
    legIndex?: number;
  }
): string {
  const source = String(trip.source ?? "").toUpperCase();

  if (source === "1G") {
    return resolve1GConfirmItineraryId(trip, {
      legIndex: options?.legIndex ?? (trip.selectedJourneyLeg as number | undefined),
    });
  }

  const candidates = [
    trip.journeyId,
    trip.journey_id,
    trip.itineraryId,
    trip.itinerary_id,
    trip.itineraryID,
  ];
  for (const raw of candidates) {
    if (raw !== undefined && raw !== null && String(raw).trim() !== "") {
      const id = String(raw).trim();
      if (isMongoObjectId(id)) continue;
      if (isInternationalConfirmTrip(trip) && /^p\d/i.test(id)) {
        return id;
      }
      if (!/^\d+$/.test(id) || !isInternationalConfirmTrip(trip)) {
        return id;
      }
    }
  }
  if (options?.contextFallback?.trim()) {
    return options.contextFallback.trim();
  }
  if (options?.allowLegFallback === false) {
    return "";
  }
  const leg = trip.flightLeg;
  if (leg === 2 || leg === "2") return "2";
  return "1";
}

/** fareType / fareBasisCode quốc tế: lấy phần đầu trước "|". */
export function normalizeIntlPipeField(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const first = raw.split("|")[0]?.trim();
  return first || raw;
}

export function normalizeIntlFareType(value: unknown): string {
  return normalizeIntlPipeField(value);
}

export function normalizeIntlFareBasisCode(value: unknown): string {
  return normalizeIntlPipeField(value);
}

function readSegmentToken(seg: Record<string, unknown>, camel: string, snake: string): string {
  return copyAirdataTokenRaw(seg[camel] ?? seg[snake]);
}

export function pickFirstBookingClassId(
  ...sources: (Record<string, unknown> | null | undefined)[]
): string {
  for (const src of sources) {
    if (!src) continue;
    const direct = readSegmentToken(src, "bookingClassId", "booking_class_id");
    if (direct.length >= 20) return direct;
    const segs = src.segments as unknown[] | undefined;
    if (Array.isArray(segs)) {
      for (const seg of segs) {
        const s = (seg ?? {}) as Record<string, unknown>;
        const fromSeg = readSegmentToken(s, "bookingClassId", "booking_class_id");
        if (fromSeg.length >= 20) return fromSeg;
      }
    }
  }
  return "";
}

/** Giữ nguyên segmentValue / segmentId / bookingClassId khi lưu selection. */
export function cloneSegmentsFromSearch(
  segments: unknown,
  defaults?: { bookingClassId?: string }
): Record<string, unknown>[] {
  if (!Array.isArray(segments)) return [];
  const fallbackBci = defaults?.bookingClassId ?? "";
  return segments.map((seg, index) => {
    const s = (seg ?? {}) as Record<string, unknown>;
    const leg =
      typeof s.leg === "number" && !Number.isNaN(s.leg) ? s.leg : index + 1;
    const bci =
      readSegmentToken(s, "bookingClassId", "booking_class_id") || fallbackBci;
    const row = normalizeDomesticSegmentRow(
      {
        ...s,
        bookingClassId: bci,
      },
      leg
    );
    if (bci) row.bookingClassId = bci;
    return row;
  });
}

export function verifyInternationalSegments(
  trip: Record<string, unknown>,
  legLabel = "Chuyến"
): string[] {
  if (!isInternationalConfirmTrip(trip)) return [];

  const errors: string[] = [];
  const segments = trip.segments as unknown[];
  if (!Array.isArray(segments) || segments.length === 0) {
    errors.push("session_expired");
    return errors;
  }

  const fareRow = trip.selectedTicketClass as Record<string, unknown> | undefined;
  const journeyBci = pickFirstBookingClassId(trip, fareRow);

  for (let index = 0; index < segments.length; index++) {
    const s = (segments[index] ?? {}) as Record<string, unknown>;
    const sv = readSegmentToken(s, "segmentValue", "segment_value");
    if (!isValidAirdataSegmentValue(sv)) {
      errors.push("session_expired");
      return errors;
    }
    const bci =
      readSegmentToken(s, "bookingClassId", "booking_class_id") || journeyBci;
    if (!bci || bci.length < 20) {
      errors.push("session_expired");
      return errors;
    }
  }

  return errors;
}

export function normalizeNationalityIso3(value: unknown): string {
  const raw = String(value ?? "")
    .trim()
    .toUpperCase();
  if (!raw) return "VNM";
  if (raw.length === 3) return raw;
  return ISO3_OVERRIDES[raw] ?? raw;
}

/** Hộ chiếu còn hiệu lực ≥ 6 tháng sau ngày về (ước lượng từ ngày bay sớm nhất + 1 năm nếu chưa có arrival). */
export function verifyInternationalPassengers(
  passengers: ConfirmPricePaxListItem[],
  flights: Record<string, unknown>[],
  options?: { minValidAfter?: Date }
): string[] {
  if (!isInternationalConfirmFlights(flights)) return [];

  const errors: string[] = [];
  const minAfter =
    options?.minValidAfter ??
    addMonths(startOfDay(findLatestArrivalDate(flights) ?? new Date()), 6);

  for (const pax of passengers) {
    const paxType = String(pax.type ?? "ADT").toUpperCase();
    if (paxType === "INF" || paxType === "INFANT") continue;

    if (!String(pax.passport ?? "").trim()) {
      errors.push("Thiếu số hộ chiếu (quốc tế)");
      continue;
    }
    if (!String(pax.nationality ?? "").trim()) {
      errors.push("Thiếu quốc tịch (mã 3 chữ, VD: VNM)");
    }
    const expiryRaw = pax.passport_expiry_date;
    if (!expiryRaw) {
      errors.push("Thiếu ngày hết hạn hộ chiếu");
      continue;
    }
    const expiry = startOfDay(
      expiryRaw instanceof Date ? expiryRaw : new Date(String(expiryRaw))
    );
    if (Number.isNaN(expiry.getTime())) {
      errors.push("Ngày hết hạn hộ chiếu không hợp lệ");
      continue;
    }
    if (expiry < minAfter) {
      errors.push(
        "Hộ chiếu phải còn hiệu lực ít nhất 6 tháng sau ngày về dự kiến"
      );
    }
  }

  return errors;
}

function findLatestArrivalDate(flights: Record<string, unknown>[]): Date | null {
  let latest: Date | null = null;
  for (const flight of flights) {
    const segments = flight.segments as unknown[];
    if (!Array.isArray(segments)) continue;
    for (const seg of segments) {
      const s = seg as Record<string, unknown>;
      const at =
        copySegmentField(s.arrivalTime) ||
        (s.arrival as { at?: string })?.at ||
        "";
      if (!at) continue;
      const d = new Date(at);
      if (!Number.isNaN(d.getTime()) && (!latest || d > latest)) {
        latest = d;
      }
    }
  }
  return latest;
}
