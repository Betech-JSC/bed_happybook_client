/**
 * VU (Vietravel) confirm-price — Postman domestic OW/RT.
 * fareValue: ưu tiên fareOptions[].fareValue token từ resource; nếu rỗng -> "".
 * bookingKey: "string". Không gửi field search thừa (status) trên segment.
 */
import type { ConfirmPaxType, ConfirmPriceFareBreakdown } from "@/types/flightConfirmPrice";
import { isPlaceholderLegItineraryId } from "@/utils/confirmPriceIdentifiers";
import { copyFareValueRaw } from "@/utils/fareValueToken";

export function isVuSource(source: unknown): boolean {
  return String(source ?? "").trim().toUpperCase() === "VU";
}

function copyField(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

function isNumericString(value: string): boolean {
  return /^\d+$/.test(value);
}

export function isVuFareValueMirroringItineraryId(
  fareValue: unknown,
  trip?: Record<string, unknown>
): boolean {
  const raw = copyFareValueRaw(fareValue);
  if (!raw || !isNumericString(raw)) return false;
  const pricingId = resolveVuItineraryPricingId(trip);
  return Boolean(pricingId) && isNumericString(pricingId) && raw === pricingId;
}

/** Postman VU: fareValue chỉ lấy token từ search/resource, không fallback itineraryId. */
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

  return "";
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
  const fare = assertVuFareConsistency(flight, "confirm");

  const fareValue =
    resolveVuFareValueFromSearch(fare, flight);

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

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function hasFiniteNumber(value: unknown): boolean {
  return toFiniteNumber(value) != null;
}

function trimString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function resolveVuFareOptionFromFlight(
  flight: Record<string, unknown>
): Record<string, unknown> {
  const fareIndex =
    typeof flight.fareOptionIndex === "number" ? flight.fareOptionIndex : 0;
  const fareOptions = Array.isArray(flight.fareOptions)
    ? (flight.fareOptions as Record<string, unknown>[])
    : [];
  const selected =
    (flight.selectedTicketClass as Record<string, unknown> | undefined) ?? {};
  const indexed = fareOptions[fareIndex] ?? {};

  // VU must keep one chosen fare option across all mapped fields.
  return { ...selected, ...indexed };
}

export function assertVuFareConsistency(
  flight: Record<string, unknown>,
  stage: "confirm" | "hold"
): Record<string, unknown> {
  const fare = resolveVuFareOptionFromFlight(flight);
  if (!Object.keys(fare).length) {
    throw new Error("VU_FARE_OPTION_REQUIRED");
  }

  if (
    !trimString(fare.bookingClass) ||
    !trimString(fare.groupClass) ||
    !trimString(fare.fareBasisCode)
  ) {
    throw new Error("VU_FARE_OPTION_INCOMPLETE");
  }

  const segments = Array.isArray(flight.segments)
    ? (flight.segments as Record<string, unknown>[])
    : [];
  if (
    segments.some(
      (seg) => !trimString(seg.segmentId) || !trimString(seg.segmentValue)
    )
  ) {
    throw new Error("VU_SEGMENT_TOKEN_REQUIRED");
  }

  if (!hasFiniteNumber(fare.taxAdult) || !hasFiniteNumber(fare.totalAdult)) {
    throw new Error("VU_FARE_BREAKDOWN_INCOMPLETE");
  }

  if (stage === "hold") {
    const totalPrice = toFiniteNumber(fare.totalPrice);
    if (totalPrice == null || totalPrice <= 0) {
      throw new Error("VU_HOLD_TOTAL_REQUIRED");
    }
  }

  return fare;
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

  return normalizeConfirmPricePayload(next);
}

type AnyObj = Record<string, unknown>;

const toSafeString = (v: unknown): string => (v == null ? "" : String(v));

const normalizeFareBreakdowns = (
  fareBreakdowns: AnyObj[] | undefined,
  itinerary?: AnyObj
): AnyObj[] => {
  if (!Array.isArray(fareBreakdowns)) return [];
  return fareBreakdowns.map((row) => {
    const fb = row && typeof row === "object" ? row : {};
    return {
    ...fb,
    // Airdata không nhận null/undefined cho fareValue
    fareValue: isVuFareValueMirroringItineraryId(fb?.fareValue, itinerary)
      ? ""
      : toSafeString(fb?.fareValue),
    paxType: toSafeString(fb?.paxType),
  };
  });
};

const normalizeSegments = (segments: AnyObj[] | undefined): AnyObj[] => {
  if (!Array.isArray(segments)) return [];
  return segments.map((rawSeg) => {
    const seg = stripConfirmSegmentFields(rawSeg);
    return {
      ...seg,
      // giữ nguyên token từ resource, chỉ ép kiểu string để tránh null
      segmentValue: toSafeString(seg?.segmentValue),
      segmentId: toSafeString(seg?.segmentId),
      bookingClassId: toSafeString(seg?.bookingClassId),
      airline: toSafeString(seg?.airline),
      operating: toSafeString(seg?.operating),
      departure: toSafeString(seg?.departure),
      arrival: toSafeString(seg?.arrival),
      flightNumber: toSafeString(seg?.flightNumber),
      fareType: toSafeString(seg?.fareType),
      fareBasisCode: toSafeString(seg?.fareBasisCode),
      bookingClass: toSafeString(seg?.bookingClass),
      groupClass: toSafeString(seg?.groupClass),
      marriageGrp: toSafeString(seg?.marriageGrp),
    };
  });
};

const normalizeItinerariesForAirdata = (
  itineraries: AnyObj[] | undefined
): AnyObj[] => {
  if (!Array.isArray(itineraries)) return [];
  return itineraries.map((it) => {
    const source = toSafeString(it?.source).toUpperCase();
    const normalizedFareBreakdowns = normalizeFareBreakdowns(
      it?.fareBreakdowns as AnyObj[] | undefined,
      it
    );
    return {
      ...it,
      source,
      airline: toSafeString(it?.airline),
      clientId: toSafeString(it?.clientId),
      itineraryId: toSafeString(it?.itineraryId),
      bookingKey: toSafeString(it?.bookingKey || "string"),
      fareBreakdowns: normalizedFareBreakdowns,
      segments: normalizeSegments(it?.segments as AnyObj[] | undefined),
      paxssr: Array.isArray(it?.paxssr) ? it.paxssr : [],
      paxSeat: Array.isArray(it?.paxSeat) ? it.paxSeat : [],
    };
  });
};

export const normalizeConfirmPricePayload = (payload: AnyObj): AnyObj => {
  return {
    ...payload,
    type: toSafeString(payload?.type).toUpperCase(),
    flightType: toSafeString(payload?.flightType || "OW"),
    airlineContact: {
      phoneNumber: toSafeString(
        (payload?.airlineContact as AnyObj | undefined)?.phoneNumber
      ),
      email: toSafeString((payload?.airlineContact as AnyObj | undefined)?.email),
    },
    paxLists: Array.isArray(payload?.paxLists) ? payload.paxLists : [],
    itineraries: normalizeItinerariesForAirdata(
      payload?.itineraries as AnyObj[] | undefined
    ),
    splitItineraries: Boolean(payload?.splitItineraries),
  };
};
