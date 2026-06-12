/**
 * VN1A (Vietnam Airlines) confirm-price — Postman domestic OW/RT template.
 */
import type { ConfirmPaxType, ConfirmPriceFareBreakdown } from "@/types/flightConfirmPrice";
import { getTripClientId } from "@/utils/normalizeFlightTrip";

const VN1A_PIPE_SUFFIX: Record<ConfirmPaxType, string> = {
  ADULT: " | 1 | 0 | 0",
  CHILD: " | 0 | 1 | 0",
  INFANT: " | 0 | 0 | 1",
};

const FARE_VALUE_KEYS = [
  "fareValue",
  "fare_value",
  "FareValue",
  "pricingValue",
  "pricingToken",
  "value",
  "token",
] as const;

function copyString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

export function looksLikeVn1aFareToken(value: string): boolean {
  if (!value) return false;
  if (value.includes(" | ") && value.includes("_")) return true;
  return /^[A-Z]{6}\d{8}_/.test(value);
}

export function stripVn1aPipeSuffix(value: string): string {
  const idx = value.indexOf(" | ");
  return idx >= 0 ? value.slice(0, idx).trim() : value.trim();
}

function fareValueFromBookingClassId(bookingClassId: string): string {
  if (!bookingClassId || !bookingClassId.includes(".")) return "";
  try {
    const payload = bookingClassId.split(".")[1];
    if (!payload) return "";
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = JSON.parse(
      typeof Buffer !== "undefined"
        ? Buffer.from(padded, "base64").toString("utf8")
        : atob(padded)
    ) as Record<string, unknown>;
    for (const key of FARE_VALUE_KEYS) {
      const v = copyString(json[key]);
      if (v) return v;
    }
  } catch {
    /* ignore */
  }
  return "";
}

function collectFareValueCandidates(
  fareOption: Record<string, unknown>,
  trip?: Record<string, unknown>
): string[] {
  const out: string[] = [];
  const push = (value: unknown) => {
    const s = copyString(value);
    if (s) out.push(s);
  };

  for (const key of FARE_VALUE_KEYS) {
    push(fareOption[key]);
  }
  push(trip?.fareValue);
  push(trip?.fare_value);

  const fareBreakdowns = fareOption.fareBreakdowns as
    | Record<string, unknown>[]
    | undefined;
  if (Array.isArray(fareBreakdowns)) {
    for (const row of fareBreakdowns) push(row.fareValue);
  }

  push(fareValueFromBookingClassId(copyString(fareOption.bookingClassId)));

  const segments = trip?.segments as Record<string, unknown>[] | undefined;
  if (Array.isArray(segments)) {
    for (const seg of segments) {
      for (const key of FARE_VALUE_KEYS) push(seg[key]);
      const sv = copyString(seg.segmentValue);
      if (looksLikeVn1aFareToken(sv)) push(sv);
    }
  }

  const list = trip?.fareOptions as Record<string, unknown>[] | undefined;
  if (Array.isArray(list)) {
    for (const row of list) {
      for (const key of FARE_VALUE_KEYS) push(row[key]);
    }
  }

  return out;
}

export function resolveVn1aFareValueFromSearch(
  fareOption: Record<string, unknown>,
  trip?: Record<string, unknown>
): string {
  const candidates = collectFareValueCandidates(fareOption, trip);
  for (const c of candidates) {
    if (looksLikeVn1aFareToken(c)) return c;
  }
  return candidates[0] ?? "";
}

function perPaxKey(paxType: ConfirmPaxType): string {
  if (paxType === "ADULT") return "fareValueAdult";
  if (paxType === "CHILD") return "fareValueChild";
  return "fareValueInfant";
}

export function resolveVn1aFareValueForPax(
  fareOption: Record<string, unknown>,
  trip: Record<string, unknown> | undefined,
  paxType: ConfirmPaxType
): string {
  const direct = copyString(fareOption[perPaxKey(paxType)]);
  if (direct) return direct;

  const breakdowns = fareOption.fareBreakdowns as
    | Record<string, unknown>[]
    | undefined;
  const fromBreakdown = breakdowns?.find(
    (row) => String(row.paxType ?? "").toUpperCase() === paxType
  );
  const breakdownFv = copyString(fromBreakdown?.fareValue);
  if (breakdownFv) return breakdownFv;

  const shared = resolveVn1aFareValueFromSearch(fareOption, trip);
  if (!shared) return "";

  if (shared.includes(" | ")) {
    if (paxType === "ADULT") return shared;
    const base = stripVn1aPipeSuffix(shared);
    return `${base}${VN1A_PIPE_SUFFIX[paxType]}`;
  }

  return `${shared}${VN1A_PIPE_SUFFIX[paxType]}`;
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

export function buildVn1aFareBreakdowns(
  flight: Record<string, unknown>
): ConfirmPriceFareBreakdown[] {
  const fareIndex =
    typeof flight.fareOptionIndex === "number" ? flight.fareOptionIndex : 0;
  const fare =
    (flight.selectedTicketClass as Record<string, unknown>) ??
    (flight.fareOptions as Record<string, unknown>[])?.[fareIndex] ??
    {};

  const breakdowns: ConfirmPriceFareBreakdown[] = [];

  for (const config of FARE_BREAKDOWN_CONFIG) {
    const count = Number(flight[config.countKey]) || 0;
    if (count <= 0) continue;

    const netFare = pickNumber(fare, config.netKeys, 0);
    const tax = pickNumber(fare, config.taxKeys, 0);
    const total = netFare + tax;
    const fareValue = resolveVn1aFareValueForPax(fare, flight, config.paxType);

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

export function resolveVn1aClientId(trip: Record<string, unknown>): string {
  const raw = getTripClientId(trip);
  if (raw.trim()) return raw.trim();
  return "VNA";
}

export function sanitizeVn1aConfirmPriceRequest(
  payload: Record<string, unknown>
): Record<string, unknown> {
  const session =
    typeof payload.session === "string"
      ? payload.session
      : String(payload.session ?? "");

  const next: Record<string, unknown> = {
    ...payload,
    type: "VN1A",
    ...(session ? { session } : {}),
  };

  if (!Array.isArray(payload.itineraries)) return next;

  next.itineraries = (payload.itineraries as Record<string, unknown>[]).map(
    (itinerary) => {
      const fareBreakdowns = Array.isArray(itinerary.fareBreakdowns)
        ? (itinerary.fareBreakdowns as Record<string, unknown>[]).map((row) => ({
            ...row,
            fareValue:
              typeof row.fareValue === "string" ? row.fareValue : "",
          }))
        : itinerary.fareBreakdowns;

      const segments = Array.isArray(itinerary.segments)
        ? (itinerary.segments as Record<string, unknown>[]).map((seg, idx) => {
            const leg =
              typeof seg.leg === "number" ? seg.leg : idx + 1;
            const legKey = String(leg);
            return {
              ...seg,
              segmentValue: legKey,
              segmentId: legKey,
            };
          })
        : itinerary.segments;

      return {
        ...itinerary,
        source: "VN1A",
        airline: String(itinerary.airline ?? "VN") || "VN",
        clientId: resolveVn1aClientId({
          clientId: itinerary.clientId,
          source: itinerary.source,
          airline: itinerary.airline,
        }),
        bookingKey: "string",
        itineraryId: "1",
        fareBreakdowns,
        segments,
      };
    }
  );

  return next;
}
