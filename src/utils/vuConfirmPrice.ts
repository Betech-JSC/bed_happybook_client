/**
 * VU (Vietravel) confirm-price — Postman domestic OW/RT.
 * fareValue: ưu tiên fareOptions[].fareValue; nếu rỗng → segmentValue / itineraryId.
 * bookingKey: "string". Không gửi field search thừa (status) trên segment.
 */
import type { ConfirmPaxType, ConfirmPriceFareBreakdown } from "@/types/flightConfirmPrice";
import { isPlaceholderLegItineraryId } from "@/utils/confirmPriceIdentifiers";
import { copyFareValueRaw } from "@/utils/fareValueToken";

export function isVuSource(source: unknown): boolean {
  return String(source ?? "").toUpperCase() === "VU";
}

function copyField(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

/** Postman VU: fareValue = token search hoặc cùng itineraryId / segmentValue. */
export function resolveVuFareValueFromSearch(
  fareOption: Record<string, unknown>,
  trip?: Record<string, unknown>
): string {
  const fromFare =
    copyFareValueRaw(fareOption.fareValue) ||
    copyFareValueRaw(fareOption.fare_value);
  if (fromFare) return fromFare;

  const index =
    typeof trip?.fareOptionIndex === "number" ? trip.fareOptionIndex : 0;
  const list = trip?.fareOptions as Record<string, unknown>[] | undefined;
  const fromList = list?.[index];
  if (fromList) {
    const fv =
      copyFareValueRaw(fromList.fareValue) ||
      copyFareValueRaw(fromList.fare_value);
    if (fv) return fv;
  }

  const stc = trip?.selectedTicketClass as Record<string, unknown> | undefined;
  if (stc) {
    const fv =
      copyFareValueRaw(stc.fareValue) || copyFareValueRaw(stc.fare_value);
    if (fv) return fv;
  }

  return resolveVuItineraryPricingId(trip);
}

/** segmentValue (= itineraryId) khi search không trả fareValue. */
export function resolveVuItineraryPricingId(
  trip?: Record<string, unknown>
): string {
  if (!trip) return "";

  const segments = trip.segments as Record<string, unknown>[] | undefined;
  const segmentValue = copyField(segments?.[0]?.segmentValue);
  if (segmentValue && !isPlaceholderLegItineraryId(segmentValue)) {
    return segmentValue;
  }

  const itineraryId = copyField(trip.itineraryId);
  if (itineraryId && !isPlaceholderLegItineraryId(itineraryId)) {
    return itineraryId;
  }

  const hpb = copyField(trip.hpb_id) || copyField(trip.flightId);
  if (hpb) return hpb;

  return "";
}

const CONFIRM_SEGMENT_KEYS = [
  "leg",
  "airline",
  "operating",
  "departure",
  "arrival",
  "departureTime",
  "arrivalTime",
  "flightNumber",
  "fareType",
  "fareBasisCode",
  "bookingClass",
  "groupClass",
  "marriageGrp",
  "segmentValue",
  "segmentId",
  "bookingClassId",
] as const;

export function stripConfirmSegmentFields(
  seg: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of CONFIRM_SEGMENT_KEYS) {
    if (key in seg) out[key] = seg[key];
  }
  return out;
}

const FARE_BREAKDOWN_CONFIG: Array<{
  paxType: ConfirmPaxType;
  countKey: "numberAdt" | "numberChd" | "numberInf";
  netKeys: string[];
  discountKeys: string[];
  taxKeys: string[];
}> = [
  {
    paxType: "ADULT",
    countKey: "numberAdt",
    netKeys: ["fareAdult"],
    discountKeys: ["discountAdult", "discountAmountAdult"],
    taxKeys: ["taxAdult"],
  },
  {
    paxType: "CHILD",
    countKey: "numberChd",
    netKeys: ["fareChild"],
    discountKeys: ["discountChild", "discountAmountChild"],
    taxKeys: ["taxChild"],
  },
  {
    paxType: "INFANT",
    countKey: "numberInf",
    netKeys: ["fareInfant"],
    discountKeys: ["discountInfant", "discountAmountInfant"],
    taxKeys: ["taxInfant"],
  },
];

function pickNumber(
  source: Record<string, unknown>,
  keys: string[],
  fallback = 0
): number {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value === "string" && value !== "" && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return fallback;
}

export function buildVuFareBreakdowns(
  flight: Record<string, unknown>
): ConfirmPriceFareBreakdown[] {
  const fareIndex =
    typeof flight.fareOptionIndex === "number" ? flight.fareOptionIndex : 0;
  const fare =
    (flight.selectedTicketClass as Record<string, unknown>) ??
    (flight.fareOptions as Record<string, unknown>[])?.[fareIndex] ??
    {};

  const fareValue =
    resolveVuFareValueFromSearch(fare, flight) ||
    resolveVuItineraryPricingId(flight);

  const breakdowns: ConfirmPriceFareBreakdown[] = [];

  for (const config of FARE_BREAKDOWN_CONFIG) {
    const count = Number(flight[config.countKey]) || 0;
    if (count <= 0) continue;

    const netFare = pickNumber(fare, config.netKeys, 0);
    const tax = pickNumber(fare, config.taxKeys, 0);
    const total = netFare + tax;

    breakdowns.push({
      paxType: config.paxType,
      netFare,
      discountAmount: pickNumber(fare, config.discountKeys, 0),
      discountAmountParent: 0,
      tax,
      total,
      fareValue,
    });
  }

  return breakdowns;
}

export function sanitizeVuConfirmPriceRequest(
  payload: Record<string, unknown>
): Record<string, unknown> {
  if (!isVuSource(payload.type)) return payload;

  const session =
    typeof payload.session === "string"
      ? payload.session
      : String(payload.session ?? "");

  const next: Record<string, unknown> = {
    ...payload,
    type: "VU",
    ...(session ? { session } : {}),
  };

  if (!Array.isArray(payload.itineraries)) return next;

  next.itineraries = (payload.itineraries as Record<string, unknown>[]).map(
    (itinerary) => {
      const pricingId =
        copyField(itinerary.itineraryId) ||
        copyField(
          (itinerary.segments as Record<string, unknown>[] | undefined)?.[0]
            ?.segmentValue
        );

      const fareBreakdowns = Array.isArray(itinerary.fareBreakdowns)
        ? (itinerary.fareBreakdowns as Record<string, unknown>[]).map(
            (row) => ({
              ...row,
              fareValue:
                copyField(row.fareValue) || pricingId,
            })
          )
        : itinerary.fareBreakdowns;

      const segments = Array.isArray(itinerary.segments)
        ? (itinerary.segments as Record<string, unknown>[]).map((seg) =>
            stripConfirmSegmentFields(seg)
          )
        : itinerary.segments;

      return {
        ...itinerary,
        bookingKey: "string",
        fareBreakdowns,
        segments,
      };
    }
  );

  return next;
}
