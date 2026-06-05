import { isVietJetSource, isVietnamAirlinesSource } from "@/utils/fareValueToken";
import { resolveVjSegmentSearchToken } from "@/utils/vjSegmentToken";
import { stripConfirmSegmentFields } from "@/utils/vuConfirmPrice";

/**
 * Airdata confirm-price expects flat segments (IATA strings + departureTime/arrivalTime),
 * not nested departure/arrival objects from search / flight-resource.
 */

export type MapSegmentDefaults = {
  fareType?: string;
  airline?: string;
  source?: string;
  fareBasisCode?: string;
  bookingClass?: string;
  groupClass?: string;
  /** Quốc tế / 1G: giữ nguyên `departure.at` / `arrival.at` từ search (không convert +07:00). */
  passthroughDateTime?: boolean;
};

function isInternationalSegmentMapping(defaults?: MapSegmentDefaults): boolean {
  if (defaults?.passthroughDateTime) return true;
  return String(defaults?.source ?? "").toUpperCase() === "1G";
}

function resolveOperatingForConfirm(
  operatingRaw: string,
  airline: string,
  source?: string
): string {
  if (String(source ?? "").toUpperCase() === "1G") return "";
  if (isVietJetSource(source)) return "";
  return operatingRaw || airline;
}

function firstPipeSegment(value: unknown): string {
  const s = stringField(value);
  if (!s) return "";
  return s.split("|")[0]?.trim() ?? "";
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

/**
 * Quốc tế: ưu tiên `departure.at` / `arrival.at` từ search, passthrough không format.
 * Nội địa: flat field hoặc `.at`, rồi normalize (+07:00).
 */
export function resolveSegmentDateTime(
  seg: Record<string, unknown>,
  kind: "departure" | "arrival",
  options?: { international?: boolean }
): string {
  const nested = seg[kind];
  const flatKey = kind === "departure" ? "departureTime" : "arrivalTime";
  const flat = seg[flatKey];
  const international = options?.international === true;

  if (international) {
    if (nested && typeof nested === "object") {
      const at = (nested as { at?: string }).at;
      if (typeof at === "string" && at.trim()) return at.trim();
    }
    if (typeof flat === "string" && flat.trim()) return flat.trim();
    return "";
  }

  let raw = "";
  if (typeof flat === "string" && flat.trim()) {
    raw = flat.trim();
  } else if (nested && typeof nested === "object") {
    const at = (nested as { at?: string }).at;
    if (typeof at === "string" && at.trim()) raw = at.trim();
  }
  return normalizeConfirmDateTime(raw);
}

function segmentDateTime(
  flatField: unknown,
  nestedPoint: unknown,
  international: boolean
): string {
  if (international) {
    if (nestedPoint && typeof nestedPoint === "object") {
      const at = (nestedPoint as { at?: string }).at;
      if (typeof at === "string" && at.trim()) return at.trim();
    }
    if (typeof flatField === "string" && flatField.trim()) return flatField.trim();
    return "";
  }

  let raw = "";
  if (typeof flatField === "string" && flatField.trim()) {
    raw = flatField.trim();
  } else if (nestedPoint && typeof nestedPoint === "object") {
    const at = (nestedPoint as { at?: string }).at;
    if (typeof at === "string" && at.trim()) raw = at.trim();
  }
  return normalizeConfirmDateTime(raw);
}

function stringField(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

/**
 * segmentValue/segmentId: ưu tiên token từ search resource (Base64 hoặc mã "SQs10").
 * Chỉ fallback về số leg khi search không trả về field này.
 */
function resolveSegmentKeys(
  seg: Record<string, unknown>,
  leg: number,
  isGds?: boolean,
  source?: string
): { segmentId: string; segmentValue: string } {
  const legKey = String(leg);
  const fromValue = stringField(seg.segmentValue);
  const fromId = stringField(seg.segmentId);

  if (isGds) {
    return {
      segmentValue: fromValue || fromId || legKey,
      segmentId: legKey,
    };
  }

  /** VJ Postman: segmentValue "" to prevent GDS token lookup crash. */
  if (isVietJetSource(source)) {
    return {
      segmentValue: "",
      segmentId: resolveVjSegmentSearchToken(seg),
    };
  }

  /** VN1A Postman: segmentValue/segmentId = leg index ("1"). */
  if (isVietnamAirlinesSource(source)) {
    return { segmentId: legKey, segmentValue: legKey };
  }

  if (fromValue && fromId) {
    return { segmentId: fromId, segmentValue: fromValue };
  }
  if (fromValue) {
    return { segmentId: fromValue, segmentValue: fromValue };
  }
  if (fromId) {
    return { segmentId: fromId, segmentValue: fromId };
  }
  return { segmentId: legKey, segmentValue: legKey };
}

export function mapSegmentForConfirm(
  seg: Record<string, unknown>,
  defaults?: MapSegmentDefaults,
  legOverride?: number
): Record<string, unknown> {
  const airline =
    stringField(seg.airline) || defaults?.airline || "";
  const leg =
    typeof legOverride === "number"
      ? legOverride
      : typeof seg.leg === "number"
        ? seg.leg
        : 1;
  const isGds = String(defaults?.source ?? "").toUpperCase() === "1G";
  const international = isInternationalSegmentMapping(defaults);
  const { segmentId, segmentValue } = resolveSegmentKeys(
    seg,
    leg,
    isGds,
    defaults?.source
  );
  const operatingRaw = stringField(seg.operating);
  const isVj = isVietJetSource(defaults?.source);

  return stripConfirmSegmentFields({
    leg,
    airline,
    operating: resolveOperatingForConfirm(operatingRaw, airline, defaults?.source),
    departure: airportCode(seg.departure),
    arrival: airportCode(seg.arrival),
    departureTime: segmentDateTime(seg.departureTime, seg.departure, international),
    arrivalTime: segmentDateTime(seg.arrivalTime, seg.arrival, international),
    flightNumber: String(seg.flightNumber ?? ""),
    fareType:
      firstPipeSegment(seg.fareType) ||
      defaults?.fareType ||
      firstPipeSegment(seg.groupClass) ||
      defaults?.groupClass ||
      "",
    fareBasisCode:
      firstPipeSegment(seg.fareBasisCode) ||
      defaults?.fareBasisCode ||
      stringField(seg.bookingClass) ||
      defaults?.bookingClass ||
      "",
    bookingClass:
      stringField(seg.bookingClass) || defaults?.bookingClass || "",
    groupClass:
      stringField(seg.groupClass) || defaults?.groupClass || "",
    marriageGrp: isVj ? "" : stringField(seg.marriageGrp),
    segmentValue,
    segmentId,
    bookingClassId: stringField(seg.bookingClassId),
  });
}

export function mapSegmentsForConfirm(
  segments: unknown,
  defaults?: MapSegmentDefaults
): Record<string, unknown>[] {
  if (!Array.isArray(segments)) return [];
  return segments.map((seg, index) =>
    mapSegmentForConfirm(
      seg as Record<string, unknown>,
      defaults,
      typeof (seg as Record<string, unknown>).leg === "number"
        ? ((seg as Record<string, unknown>).leg as number)
        : index + 1
    )
  );
}

/** Confirm-price uses full itineraries + flat segments for all sources (Postman). */
export function usesFullConfirmItinerariesPayload(_source?: unknown): boolean {
  return true;
}
