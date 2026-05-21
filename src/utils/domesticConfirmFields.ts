import type { ConfirmPaxType } from "@/types/flightConfirmPrice";
import { copyFareValueRaw } from "@/utils/fareValueToken";

function copySegmentField(value: unknown): string {
  if (typeof value === "string") return value.trim();
  return "";
}

const FARE_VALUE_KEYS_BY_PAX: Record<ConfirmPaxType, string[]> = {
  ADULT: ["fareValue", "fareValueAdult", "fare_value", "fare_value_adult"],
  CHILD: ["fareValueChild", "fare_value_child", "fareValue", "fare_value"],
  INFANT: ["fareValueInfant", "fare_value_infant", "fareValue", "fare_value"],
};

function readFareValueFromRecord(
  source: Record<string, unknown>,
  keys: string[]
): string {
  for (const key of keys) {
    const v = copyFareValueRaw(source[key]);
    if (v) return v;
  }
  return "";
}

/** fareValue string theo paxType — từ fare đã chọn hoặc fareOptions của đúng trip/chiều. */
export function pickFareValueForPaxBreakdown(
  fare: Record<string, unknown>,
  flight: Record<string, unknown>,
  paxType: ConfirmPaxType
): string {
  const keys = FARE_VALUE_KEYS_BY_PAX[paxType];
  const fromFare = readFareValueFromRecord(fare, keys);
  if (fromFare) return fromFare;

  const fareOptions = flight.fareOptions as Record<string, unknown>[] | undefined;
  const selected = flight.selectedTicketClass as Record<string, unknown> | undefined;
  if (fareOptions?.length) {
    const selectedIdx =
      selected != null
        ? fareOptions.findIndex(
            (opt) =>
              opt === selected ||
              readFareValueFromRecord(opt, keys) ===
                readFareValueFromRecord(selected, keys)
          )
        : -1;
    const ordered =
      selectedIdx >= 0
        ? [fareOptions[selectedIdx], ...fareOptions.filter((_, i) => i !== selectedIdx)]
        : fareOptions;
    for (const opt of ordered) {
      const v = readFareValueFromRecord(opt, keys);
      if (v) return v;
    }
  }

  const fromTrip = readFareValueFromRecord(flight, keys);
  if (fromTrip) return fromTrip;

  if (paxType !== "ADULT") {
    return pickFareValueForPaxBreakdown(fare, flight, "ADULT");
  }
  return "";
}

/**
 * 9G/VN1A đôi khi lưu segmentValue="1" và segmentId=token dài — đổi lại đúng search.
 */
export function fixDomesticSegmentKeys(
  segmentValue: string,
  segmentId: string,
  legKey: string
): { segmentValue: string; segmentId: string } {
  const sv = segmentValue.trim();
  const sid = segmentId.trim();
  const valueLooksLikeLeg = !sv || (/^\d+$/.test(sv) && sv.length <= 4);
  const idLooksLikeSearchToken =
    sid.length > 10 && /[A-Za-z]/.test(sid) && !/^\d+$/.test(sid);

  if (valueLooksLikeLeg && idLooksLikeSearchToken) {
    return { segmentValue: sid, segmentId: sv || legKey };
  }

  return {
    segmentValue: sv || sid || legKey,
    segmentId: sid || legKey,
  };
}

/**
 * Airdata confirm-price nội địa: mỗi phần tử itineraries[] là một chiều;
 * Postman VN1A RT dùng itineraryId "1" cho cả đi và về (không phải "2" theo leg).
 */
export function resolveDomesticConfirmItineraryId(
  _trip?: Record<string, unknown>
): string {
  return "1";
}

export function normalizeDomesticSegmentRow(
  seg: Record<string, unknown>,
  leg: number
): Record<string, unknown> {
  const legKey = String(leg);
  const rawValue = copySegmentField(seg.segmentValue ?? seg.segment_value);
  const rawId = copySegmentField(seg.segmentId ?? seg.segment_id) || legKey;
  const fixed = fixDomesticSegmentKeys(rawValue, rawId, legKey);
  return {
    ...seg,
    leg,
    segmentValue: fixed.segmentValue,
    segmentId: fixed.segmentId,
  };
}
