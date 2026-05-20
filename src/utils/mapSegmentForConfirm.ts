/**
 * Airdata confirm-price expects flat segments (IATA strings + departureTime/arrivalTime),
 * not nested departure/arrival objects from search / flight-resource.
 */

import { fixDomesticSegmentKeys } from "@/utils/domesticConfirmFields";
import {
  copyAirdataTokenRaw,
  copySegmentField,
  isInternationalConfirmTrip,
  normalizeIntlFareBasisCode,
  normalizeIntlFareType,
} from "@/utils/internationalConfirmPrice";

export type MapSegmentDefaults = {
  fareType?: string;
  airline?: string;
  source?: string;
  fareBasisCode?: string;
  bookingClass?: string;
  groupClass?: string;
};

function resolveOperatingForConfirm(
  operatingRaw: string,
  airline: string,
  source?: string
): string {
  const src = String(source ?? "").toUpperCase();
  if (src === "1G" || src === "VJ" || src.includes("VIETJET")) {
    return "";
  }
  return operatingRaw || airline;
}

function airportCode(departureOrArrival: unknown): string {
  if (typeof departureOrArrival === "string") return departureOrArrival;
  if (departureOrArrival && typeof departureOrArrival === "object") {
    const obj = departureOrArrival as { IATACode?: string; code?: string };
    return obj.IATACode ?? obj.code ?? "";
  }
  return "";
}

const VN_OFFSET = "+07:00";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Format UTC instant as Vietnam local time with +07:00 suffix. */
function formatAsVietnamOffset(date: Date): string {
  const vnMs = date.getTime() + 7 * 60 * 60 * 1000;
  const vn = new Date(vnMs);
  return `${vn.getUTCFullYear()}-${pad2(vn.getUTCMonth() + 1)}-${pad2(vn.getUTCDate())}T${pad2(vn.getUTCHours())}:${pad2(vn.getUTCMinutes())}:${pad2(vn.getUTCSeconds())}${VN_OFFSET}`;
}

/** Airdata confirm-price: YYYY-MM-DDTHH:mm:ss+07:00 (prefer VN local, not Z). */
export function normalizeConfirmDateTime(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  let value = trimmed.replace(
    /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}(?:\.\d+)?)(Z|[+-]\d{2}:\d{2})$/,
    "$1T$2$3"
  );

  value = value.replace(/(\d{2}:\d{2}:\d{2})\.\d+(Z|[+-]\d{2}:\d{2})$/, "$1$2");

  if (/Z$/i.test(value)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return formatAsVietnamOffset(parsed);
    }
  }

  if (/[+-]\d{2}:\d{2}$/.test(value) && !value.endsWith(VN_OFFSET)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return formatAsVietnamOffset(parsed);
    }
  }

  if (/[+-]\d{2}:\d{2}$/.test(value)) {
    return value;
  }

  return value;
}

/** Quốc tế: giữ nguyên offset từ search (+08:00), không đổi sang +07:00. */
function segmentDateTime(
  flatField: unknown,
  nestedPoint: unknown,
  passthrough = false
): string {
  let raw = "";
  if (typeof flatField === "string" && flatField.trim()) {
    raw = flatField.trim();
  } else if (nestedPoint && typeof nestedPoint === "object") {
    const at = (nestedPoint as { at?: string }).at;
    if (typeof at === "string" && at.trim()) raw = at.trim();
  }
  if (passthrough && raw) {
    return raw.replace(
      /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/,
      "$1T$2"
    );
  }
  return normalizeConfirmDateTime(raw);
}

function stringField(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

/**
 * segmentValue: bắt buộc copy từ search (base64).
 * segmentId: giữ từ search ("1", "2", …) — khác segmentValue.
 */
function resolveSegmentKeys(
  seg: Record<string, unknown>,
  leg: number,
  tripContext?: Record<string, unknown>
): { segmentId: string; segmentValue: string } {
  const legKey = String(leg);
  const intlTrip =
    tripContext && isInternationalConfirmTrip(tripContext);
  if (intlTrip) {
    const fromSearchValue = copyAirdataTokenRaw(
      seg.segmentValue ?? seg.segment_value
    );
    const segmentId =
      copyAirdataTokenRaw(seg.segmentId ?? seg.segment_id) || legKey;
    return {
      segmentId,
      segmentValue: fromSearchValue,
    };
  }

  const rawValue = copySegmentField(seg.segmentValue ?? seg.segment_value);
  const rawId =
    copySegmentField(seg.segmentId ?? seg.segment_id) || legKey;
  return fixDomesticSegmentKeys(rawValue, rawId, legKey);
}

export function mapSegmentForConfirm(
  seg: Record<string, unknown>,
  defaults?: MapSegmentDefaults,
  legOverride?: number,
  tripContext?: Record<string, unknown>
): Record<string, unknown> {
  const airline =
    stringField(seg.airline) || defaults?.airline || "";
  const leg =
    typeof legOverride === "number"
      ? legOverride
      : typeof seg.leg === "number"
        ? seg.leg
        : 1;
  const ctx =
    tripContext ??
    (defaults?.source
      ? ({ source: defaults.source, domestic: undefined } as Record<
          string,
          unknown
        >)
      : undefined);
  const { segmentId, segmentValue } = resolveSegmentKeys(seg, leg, ctx);
  const operatingRaw = stringField(seg.operating);
  const intlTrip = ctx && isInternationalConfirmTrip(ctx);

  const fareTypeRaw =
    stringField(seg.fareType) ||
    defaults?.fareType ||
    stringField(seg.groupClass) ||
    defaults?.groupClass ||
    "";

  return {
    leg,
    airline,
    operating: resolveOperatingForConfirm(
      operatingRaw,
      airline,
      defaults?.source
    ),
    departure: airportCode(seg.departure),
    arrival: airportCode(seg.arrival),
    departureTime: segmentDateTime(
      seg.departureTime,
      seg.departure,
      intlTrip
    ),
    arrivalTime: segmentDateTime(seg.arrivalTime, seg.arrival, intlTrip),
    flightNumber: String(seg.flightNumber ?? ""),
    fareType: intlTrip ? normalizeIntlFareType(fareTypeRaw) : fareTypeRaw,
    fareBasisCode: intlTrip
      ? normalizeIntlFareBasisCode(
          seg.fareBasisCode ??
            defaults?.fareBasisCode ??
            seg.bookingClass
        )
      : stringField(seg.fareBasisCode) ||
        defaults?.fareBasisCode ||
        stringField(seg.bookingClass) ||
        defaults?.bookingClass ||
        "",
    bookingClass:
      stringField(seg.bookingClass) || defaults?.bookingClass || "",
    groupClass:
      stringField(seg.groupClass) || defaults?.groupClass || "",
    marriageGrp: stringField(seg.marriageGrp),
    segmentValue,
    segmentId,
    bookingClassId: intlTrip
      ? copyAirdataTokenRaw(seg.bookingClassId ?? seg.booking_class_id)
      : copySegmentField(seg.bookingClassId),
  };
}

export function mapSegmentsForConfirm(
  segments: unknown,
  defaults?: MapSegmentDefaults,
  tripContext?: Record<string, unknown>
): Record<string, unknown>[] {
  if (!Array.isArray(segments)) return [];
  return segments.map((seg, index) =>
    mapSegmentForConfirm(
      seg as Record<string, unknown>,
      defaults,
      typeof (seg as Record<string, unknown>).leg === "number"
        ? ((seg as Record<string, unknown>).leg as number)
        : index + 1,
      tripContext
    )
  );
}

/** Confirm-price uses full itineraries + flat segments for all sources. */
export function usesFullConfirmItinerariesPayload(_source?: unknown): boolean {
  return true;
}
