/**
 * Airdata confirm-price expects flat segments (IATA strings + departureTime/arrivalTime),
 * not nested departure/arrival objects from search / flight-resource.
 */

export type MapSegmentDefaults = {
  fareType?: string;
  airline?: string;
  fareBasisCode?: string;
  bookingClass?: string;
  groupClass?: string;
};

function airportCode(departureOrArrival: unknown): string {
  if (typeof departureOrArrival === "string") return departureOrArrival;
  if (departureOrArrival && typeof departureOrArrival === "object") {
    const obj = departureOrArrival as { IATACode?: string; code?: string };
    return obj.IATACode ?? obj.code ?? "";
  }
  return "";
}

/** Airdata confirm-price: YYYY-MM-DDTHH:mm:ssZ (or +07:00). */
export function normalizeConfirmDateTime(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  let value = trimmed.replace(
    /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}(?:\.\d+)?)(Z|[+-]\d{2}:\d{2})$/,
    "$1T$2$3"
  );

  value = value.replace(/(\d{2}:\d{2}:\d{2})\.\d+(Z|[+-]\d{2}:\d{2})$/, "$1$2");

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

export function mapSegmentForConfirm(
  seg: Record<string, unknown>,
  defaults?: MapSegmentDefaults
): Record<string, unknown> {
  const airline =
    stringField(seg.airline) || defaults?.airline || "";
  const legKey = String(typeof seg.leg === "number" ? seg.leg : 1);
  /** From search / flight-resource — passthrough, do not synthesize composite ids. */
  const segmentId = stringField(seg.segmentId) || legKey;
  const segmentValue = stringField(seg.segmentValue) || legKey;

  return {
    leg: seg.leg ?? 1,
    airline,
    operating: stringField(seg.operating, airline),
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
  return segments.map((seg) =>
    mapSegmentForConfirm(seg as Record<string, unknown>, defaults)
  );
}

/** Confirm-price uses full itineraries + flat segments for all sources (Postman). */
export function usesFullConfirmItinerariesPayload(_source?: unknown): boolean {
  return true;
}
