/** VJ segmentId token từ search — tách file tránh circular import. */

import type { SelectedFlight } from "@/types/selectedFlight";

function isVjTripSource(source: unknown): boolean {
  const s = String(source ?? "").toUpperCase();
  return s === "VJ" || s.includes("VIETJET");
}

export function isNumericSegmentKey(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * Token từ search: ưu tiên segments[].segmentId.
 * Không dùng "1" / leg index; không copy sang segmentValue.
 */
export function resolveVjSegmentSearchToken(
  seg: Record<string, unknown>
): string {
  const fromId = String(seg.segmentId ?? "").trim();
  if (fromId && !isNumericSegmentKey(fromId)) return fromId;
  const fromValue = String(seg.segmentValue ?? "").trim();
  if (fromValue && !isNumericSegmentKey(fromValue)) return fromValue;
  return "";
}

/** Gắn token search vào segmentId khi lưu session (API đôi khi chỉ có token ở segmentValue). */
export function mergeVjSegmentsFromSearchFlight(
  trip: Record<string, unknown>,
  searchFlight?: Record<string, unknown>
): Record<string, unknown>[] {
  const searchSegs = searchFlight?.segments ?? trip.segments;
  if (!Array.isArray(searchSegs)) return [];

  return (searchSegs as Record<string, unknown>[]).map((seg) => {
    const token = resolveVjSegmentSearchToken(seg);
    return {
      ...seg,
      ...(token ? { segmentId: token } : {}),
    };
  });
}

export function assertVjTripHasSegmentTokens(trip: Record<string, unknown>): void {
  const segments = trip.segments;
  if (!Array.isArray(segments) || segments.length === 0) {
    throw new Error("VJ_SEGMENT_TOKEN_REQUIRED");
  }
  for (const seg of segments) {
    if (!resolveVjSegmentSearchToken(seg as Record<string, unknown>)) {
      throw new Error("VJ_SEGMENT_TOKEN_REQUIRED");
    }
  }
}

/** Gắn segmentId token khi đọc session / legacy (không đổi flow 1 người nếu token đã có). */
export function normalizeVjSelectedFlight(
  selection: SelectedFlight,
  searchFlight?: Record<string, unknown>
): SelectedFlight {
  const source = String(
    selection.trip?.source ?? selection.fareOption?.source ?? ""
  );
  if (!isVjTripSource(source)) return selection;

  const trip = selection.trip as Record<string, unknown>;
  const segments = mergeVjSegmentsFromSearchFlight(trip, searchFlight ?? trip);
  return {
    ...selection,
    trip: { ...trip, segments },
  };
}
