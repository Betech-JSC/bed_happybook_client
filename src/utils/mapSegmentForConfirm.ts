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
};

function resolveOperatingForConfirm(
  operatingRaw: string,
  airline: string,
  source?: string
): string {
  const src = String(source ?? "").toUpperCase();
  if (src === "VJ" || src.includes("VIETJET")) {
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

function segmentDateTime(
  flatField: unknown,
  nestedPoint: unknown
): string {
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

/** bookingKey from fareOption.fareValue — VJ Base64 JSON, 9G FLN token, etc. */
export function resolveBookingKey(fareValue: unknown): string {
  if (typeof fareValue !== "string" || !fareValue.trim()) return "";

  const trimmed = fareValue.trim();

  try {
    const decoded = atob(trimmed);
    const parsed = JSON.parse(decoded) as { bookingKey?: string };
    if (parsed?.bookingKey && typeof parsed.bookingKey === "string") {
      return parsed.bookingKey;
    }
  } catch {
    // not Base64 JSON
  }

  if (trimmed.startsWith("eyJ")) {
    return "";
  }

  return trimmed;
}

function isNumericSegmentKey(value: string): boolean {
  return /^\d+$/.test(value);
}

/** segmentId/segmentValue = "1","2"… — không dùng hash/token lạ từ search. */
function resolveSegmentKeys(
  seg: Record<string, unknown>,
  leg: number
): { segmentId: string; segmentValue: string } {
  const legKey = String(leg);
  const fromValue = stringField(seg.segmentValue);
  const fromId = stringField(seg.segmentId);
  if (isNumericSegmentKey(fromValue)) {
    return { segmentId: fromValue, segmentValue: fromValue };
  }
  if (isNumericSegmentKey(fromId)) {
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
  const { segmentId, segmentValue } = resolveSegmentKeys(seg, leg);
  const operatingRaw = stringField(seg.operating);

  return {
    leg,
    airline,
    operating: resolveOperatingForConfirm(operatingRaw, airline, defaults?.source),
    departure: airportCode(seg.departure),
    arrival: airportCode(seg.arrival),
    departureTime: segmentDateTime(seg.departureTime, seg.departure),
    arrivalTime: segmentDateTime(seg.arrivalTime, seg.arrival),
    flightNumber: String(seg.flightNumber ?? ""),
    fareType:
      stringField(seg.fareType) ||
      defaults?.fareType ||
      stringField(seg.groupClass) ||
      defaults?.groupClass ||
      "",
    fareBasisCode:
      stringField(seg.fareBasisCode) ||
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
    bookingClassId: stringField(seg.bookingClassId),
  };
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
