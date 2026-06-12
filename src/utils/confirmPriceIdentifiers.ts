/**
 * Airdata domestic (VU, QH, …): itineraryId = trip/segment id from search,
 * not round-trip leg index ("1" / "2").
 */

function copyField(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

export function isPlaceholderLegItineraryId(id: string): boolean {
  return id === "1" || id === "2";
}

/** ID lưu khi chọn chuyến (SelectedFlight.itineraryId). */
export function resolveSelectedItineraryId(
  trip: Record<string, unknown>
): string {
  const segments = trip.segments as Record<string, unknown>[] | undefined;
  const segmentValue = copyField(segments?.[0]?.segmentValue);
  if (segmentValue) return segmentValue;

  const fromTrip = copyField(trip.itineraryId);
  if (fromTrip && !isPlaceholderLegItineraryId(fromTrip)) {
    return fromTrip;
  }

  const hpb = copyField(trip.hpb_id) || copyField(trip.flightId);
  if (hpb) return hpb;

  const segmentId = copyField(segments?.[0]?.segmentId);
  if (segmentId) return segmentId;

  if (fromTrip) return fromTrip;
  return trip.flightLeg === 1 ? "2" : "1";
}

/** itineraryId trên payload confirm-price (sau khi build segments). */
export function resolveConfirmItineraryId(
  flight: Record<string, unknown>,
  segments: Record<string, unknown>[],
  index: number,
  options?: { isGds?: boolean; isVj?: boolean; isVn1a?: boolean; isVu?: boolean }
): string {
  if (options?.isVn1a) {
    return "1";
  }

  if (options?.isVj) {
    return String(flight.itineraryId ?? index + 1);
  }

  if (options?.isVu) {
    const fromFlight = copyField(flight.itineraryId);
    if (fromFlight && !isPlaceholderLegItineraryId(fromFlight)) {
      return fromFlight;
    }
    const hpb = copyField(flight.hpb_id) || copyField(flight.flightId);
    if (hpb) return hpb;
    const firstSegmentValue = copyField(segments[0]?.segmentValue);
    if (firstSegmentValue) return firstSegmentValue;
    const firstSegmentId = copyField(segments[0]?.segmentId);
    if (firstSegmentId) return firstSegmentId;
    return "";
  }

  const firstSegmentValue = copyField(segments[0]?.segmentValue);
  const firstSegmentId = copyField(segments[0]?.segmentId);

  if (options?.isGds) {
    return firstSegmentValue || String(flight.itineraryId ?? index + 1);
  }

  if (firstSegmentValue) return firstSegmentValue;

  const fromFlight = copyField(flight.itineraryId);
  if (fromFlight && !isPlaceholderLegItineraryId(fromFlight)) {
    return fromFlight;
  }

  const hpb = copyField(flight.hpb_id) || copyField(flight.flightId);
  if (hpb) return hpb;

  if (firstSegmentId) return firstSegmentId;

  return fromFlight || String(index + 1);
}
