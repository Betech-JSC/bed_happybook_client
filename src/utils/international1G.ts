import {
  cloneSegmentsFromSearch,
  copyAirdataTokenRaw,
  isValidAirdataSegmentValue,
  pickFirstBookingClassId,
} from "@/utils/internationalConfirmPrice";

/** Mongo ObjectId — dùng cho URL GET resource, không gửi làm itineraryId. */
export function isMongoObjectId(value: string): boolean {
  return /^[a-f0-9]{24}$/i.test(value.trim());
}

/** Package 1G đã có segmentValue base64 từ search (không cần chờ GET resource). */
export function package1GHasSearchSegmentTokens(
  pkg: Record<string, unknown> | null | undefined
): boolean {
  if (!pkg) return false;
  const journeys = pkg.journeys as unknown;
  if (!Array.isArray(journeys)) return false;
  for (const leg of journeys) {
    if (!Array.isArray(leg)) continue;
    for (const row of leg) {
      const segs = (row as Record<string, unknown>).segments as unknown;
      if (!Array.isArray(segs)) continue;
      for (const seg of segs) {
        const sv = copyAirdataTokenRaw(
          (seg as Record<string, unknown>).segmentValue ??
            (seg as Record<string, unknown>).segment_value
        );
        if (isValidAirdataSegmentValue(sv)) return true;
      }
    }
  }
  return false;
}

/** ID gọi GET /search/resources/{id}. */
export function pick1GResourceFetchId(
  pkg: Record<string, unknown> | null | undefined
): string | undefined {
  if (!pkg) return undefined;
  const candidates = [
    pkg.resourceId,
    pkg.resource_id,
    pkg._resourceFetchId,
    pkg._resourceId,
    pkg.key,
    pkg.id,
    pkg._id,
  ];
  for (const raw of candidates) {
    const s = String(raw ?? "").trim();
    if (!s) continue;
    if (isMongoObjectId(s)) return s;
  }
  return undefined;
}

function padBase64(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  return pad ? padded + "=".repeat(4 - pad) : padded;
}

/** Decode Key trong segmentValue base64 (VD: seg_1, seg_2). */
export function decodeSegmentValueKey(segmentValue: string): string | null {
  if (!segmentValue) return null;
  try {
    const json = JSON.parse(atob(padBase64(segmentValue))) as {
      Key?: string;
      key?: string;
    };
    const key = json.Key ?? json.key;
    return typeof key === "string" ? key : null;
  } catch {
    return null;
  }
}

/** Key kiểu seg_TR_283 — token tự build, không phải search. */
export function isRebuiltAirlineSegmentKey(key: string): boolean {
  return /^seg_[A-Za-z0-9]{2,3}_\d+$/i.test(key);
}

/** Key hợp lệ từ resource search (seg_1, seg_2, …). */
export function isValidResourceSegmentKey(key: string | null): boolean {
  if (!key) return false;
  if (/^seg_\d+$/i.test(key)) return true;
  return !isRebuiltAirlineSegmentKey(key);
}

/**
 * itineraryId confirm-price: chỉ journeyId p0/p1 — KHÔNG dùng base64 segmentValue.
 */
export function resolve1GConfirmItineraryId(
  journeyRow: Record<string, unknown>,
  options?: { legIndex?: number; packageRow?: Record<string, unknown> }
): string {
  const pkg = options?.packageRow;
  const candidates = [
    journeyRow.journeyId,
    journeyRow.journey_id,
    journeyRow.itineraryId,
    journeyRow.itinerary_id,
    pkg?.journeyId,
    pkg?.journey_id,
  ];

  for (const raw of candidates) {
    const id = String(raw ?? "").trim();
    if (!id || isMongoObjectId(id)) continue;
    if (/^p\d/i.test(id)) return id;
  }

  const leg = options?.legIndex ?? 0;
  return `p${leg}`;
}

/** @deprecated Dùng resolve1GConfirmItineraryId cho confirm-price. */
export function resolve1GJourneyItineraryId(
  journeyRow: Record<string, unknown>,
  options?: { legIndex?: number; packageRow?: Record<string, unknown> }
): string {
  return resolve1GConfirmItineraryId(journeyRow, options);
}

function pickJourneyBookingClassId(
  pkg: Record<string, unknown>,
  journeyRow: Record<string, unknown>
): string {
  return pickFirstBookingClassId(journeyRow, pkg);
}

/** Segments từ journey đã enrich trong package (có segmentValue gốc). */
export function resolve1GJourneySegments(
  pkg: Record<string, unknown>,
  journeyRow: Record<string, unknown>,
  legIndex: number
): Record<string, unknown>[] {
  const matched = findMatching1GJourneyRow(pkg, journeyRow, legIndex) ?? journeyRow;
  const bci = pickJourneyBookingClassId(pkg, matched);
  return cloneSegmentsFromSearch(matched.segments, { bookingClassId: bci });
}

/** Gắn journeyId p* + segments token từ resource khi user chọn chuyến 1G. */
export function enrich1GPackageSelection(
  pkg: Record<string, unknown>,
  journeyRow: Record<string, unknown>,
  legIndex: number
): Record<string, unknown> {
  const matched = findMatching1GJourneyRow(pkg, journeyRow, legIndex) ?? journeyRow;
  const journeyId = resolve1GConfirmItineraryId(matched, { legIndex, packageRow: pkg });
  const segments = resolve1GJourneySegments(pkg, journeyRow, legIndex);

  const enrichedJourney = {
    ...matched,
    journeyId,
    itineraryId: journeyId,
    segments,
    sequence: matched.sequence ?? legIndex + 1,
  };

  return {
    ...pkg,
    journeyId,
    selectedTicketClass: enrichedJourney,
    selectedJourneyLeg: legIndex,
  };
}

/** Sau GET /search/resources/{id} — gộp journeys (có segmentValue) vào package 1G. */
function extractJourneysFromResource(
  resourceData: Record<string, unknown>,
  pkg: Record<string, unknown>
): unknown {
  if (resourceData.journeys ?? resourceData.Journeys) {
    return resourceData.journeys ?? resourceData.Journeys;
  }
  const trips = resourceData.trips as Record<string, unknown>[] | undefined;
  if (Array.isArray(trips) && trips.length > 0) {
    const row =
      trips.find((t) => String(t.source ?? "").toUpperCase() === "1G") ??
      trips[0];
    if (row?.journeys ?? row?.Journeys) {
      return row.journeys ?? row.Journeys;
    }
  }
  const nested = resourceData.data as Record<string, unknown> | undefined;
  if (nested?.journeys ?? nested?.Journeys) {
    return nested.journeys ?? nested.Journeys;
  }
  return pkg.journeys;
}

export function merge1GPackageFromResourceResponse(
  pkg: Record<string, unknown>,
  resourceData: Record<string, unknown>,
  resourceFetchId: string
): Record<string, unknown> {
  const journeys = extractJourneysFromResource(resourceData, pkg);

  return {
    ...pkg,
    source: "1G",
    journeys,
    _resourceFetchId: resourceFetchId,
    _journeysEnriched: true,
  };
}

/** Gọi resource trước checkout nếu user chọn khi chưa enrich xong. */
export async function ensure1GPackageEnriched(
  pkg: Record<string, unknown>,
  fetchParams: {
    passengers: { adt: number; chd: number; inf: number };
    locations: { from: string; to: string };
    getFlightResource: (body: Record<string, unknown>) => Promise<{
      payload?: { data?: Record<string, unknown> };
    }>;
  }
): Promise<Record<string, unknown>> {
  if (pkg._journeysEnriched) return pkg;
  const rid = pick1GResourceFetchId(pkg);
  if (!rid) return pkg;
  try {
    const res = await fetchParams.getFlightResource({
      resource_id: rid,
      passengers: fetchParams.passengers,
      locations: fetchParams.locations,
    });
    const data = (res?.payload?.data ?? {}) as Record<string, unknown>;
    return merge1GPackageFromResourceResponse(pkg, data, rid);
  } catch {
    return pkg;
  }
}

/** Tìm journey option khớp selection trong package đã enrich. */
export function findMatching1GJourneyRow(
  pkg: Record<string, unknown>,
  selectedJourney: Record<string, unknown>,
  legIndex: number
): Record<string, unknown> | null {
  const journeys = pkg.journeys as unknown[][] | undefined;
  if (!Array.isArray(journeys) || !journeys[legIndex]) {
    return selectedJourney;
  }

  const legOptions = journeys[legIndex] as Record<string, unknown>[];
  const dep = (selectedJourney.departure as { IATACode?: string })?.IATACode;
  const arr = (selectedJourney.arrival as { IATACode?: string })?.IATACode;
  const fn = selectedJourney.flightNumber;

  const match = legOptions.find((row) => {
    const rowDep = (row.departure as { IATACode?: string })?.IATACode;
    const rowArr = (row.arrival as { IATACode?: string })?.IATACode;
    return (
      (!dep || rowDep === dep) &&
      (!arr || rowArr === arr) &&
      (!fn || String(row.flightNumber) === String(fn))
    );
  });

  return match ?? selectedJourney;
}
