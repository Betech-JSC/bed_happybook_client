/**
 * VJ domestic / confirm-price & hold-flight payload (Postman template).
 * segmentValue = ""; segmentId = search token; fareValue shared across pax types.
 */

import type {
  ConfirmPaxType,
  ConfirmPriceFareBreakdown,
  ConfirmPriceItinerary,
  ConfirmPricePaxApiItem,
  ConfirmPricePaxListItem,
  ConfirmPriceRequest,
  FlightTripType,
} from "@/types/flightConfirmPrice";
import {
  buildPaxDocumentsForPassenger,
  isInternationalItineraries,
  toAirdataBirthdayIso,
} from "@/utils/buildPaxDocuments";
import {
  copyVjFareValueForConfirm,
  isVietJetSource,
  normalizeAirdataPhoneNumber,
  sanitizeVjConfirmPriceRequest,
} from "@/utils/fareValueToken";
import { resolveSegmentDateTime } from "@/utils/mapSegmentForConfirm";

import {
  assertVjTripHasSegmentTokens,
  resolveVjSegmentSearchToken,
} from "@/utils/vjSegmentToken";

export { resolveVjSegmentSearchToken } from "@/utils/vjSegmentToken";

const PAX_TYPE_MAP: Record<string, ConfirmPaxType> = {
  ADT: "ADULT",
  ADULT: "ADULT",
  CHD: "CHILD",
  CHILD: "CHILD",
  INF: "INFANT",
  INFANT: "INFANT",
};

function copyTripField(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

function firstPipeSegment(value: unknown): string {
  const raw = copyTripField(value);
  if (!raw) return "";
  return raw.split("|")[0]?.trim() ?? "";
}

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

const VJ_FARE_BREAKDOWN_CONFIG: Array<{
  paxType: ConfirmPaxType;
  countKey: "numberAdt" | "numberChd" | "numberInf";
  netKeys: string[];
  discountKeys: string[];
  confirmTaxKeys: string[];
  taxKeys: string[];
  surchargeKeys: string[];
  airdataTotalKeys: string[];
  totalKeys: string[];
}> = [
  {
    paxType: "ADULT",
    countKey: "numberAdt",
    netKeys: ["fareAdult"],
    discountKeys: ["discountAdult", "discountAmountAdult"],
    confirmTaxKeys: ["confirmTaxAdult"],
    taxKeys: ["taxAdult"],
    surchargeKeys: ["surchargeAdult"],
    airdataTotalKeys: ["airdataTotalAdult"],
    totalKeys: ["totalAdult"],
  },
  {
    paxType: "CHILD",
    countKey: "numberChd",
    netKeys: ["fareChild"],
    discountKeys: ["discountChild", "discountAmountChild"],
    confirmTaxKeys: ["confirmTaxChild"],
    taxKeys: ["taxChild"],
    surchargeKeys: ["surchargeChild"],
    airdataTotalKeys: ["airdataTotalChild"],
    totalKeys: ["totalChild"],
  },
  {
    paxType: "INFANT",
    countKey: "numberInf",
    netKeys: ["fareInfant"],
    discountKeys: ["discountInfant", "discountAmountInfant"],
    confirmTaxKeys: ["confirmTaxInfant"],
    taxKeys: ["taxInfant"],
    surchargeKeys: ["surchargeInfant"],
    airdataTotalKeys: ["airdataTotalInfant"],
    totalKeys: ["totalInfant"],
  },
];

function pickVjTax(fare: Record<string, unknown>, config: (typeof VJ_FARE_BREAKDOWN_CONFIG)[0]): number {
  const confirmTax = pickNumber(fare, config.confirmTaxKeys, -1);
  if (confirmTax >= 0) return confirmTax;
  return (
    pickNumber(fare, config.taxKeys, 0) + pickNumber(fare, config.surchargeKeys, 0)
  );
}

function pickVjTotal(fare: Record<string, unknown>, config: (typeof VJ_FARE_BREAKDOWN_CONFIG)[0]): number {
  const airdataTotal = pickNumber(fare, config.airdataTotalKeys, 0);
  if (airdataTotal > 0) return airdataTotal;
  return pickNumber(fare, config.totalKeys, 0);
}

/** Cùng fareOptions[j].fareValue cho ADULT / CHILD / INFANT. */
export function buildVjFareBreakdowns(
  fare: Record<string, unknown>,
  flight: Record<string, unknown>
): ConfirmPriceFareBreakdown[] {
  const fareValue = copyVjFareValueForConfirm(fare);
  const breakdowns: ConfirmPriceFareBreakdown[] = [];

  for (const config of VJ_FARE_BREAKDOWN_CONFIG) {
    const count = Number(flight[config.countKey]) || 0;
    if (count <= 0) continue;

    const netFare = pickNumber(fare, config.netKeys, 0);
    const tax = pickVjTax(fare, config);
    const totalFromSearch = pickVjTotal(fare, config);
    const total = totalFromSearch > 0 ? totalFromSearch : netFare + tax;

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

function resolveVjPaxTitle(paxType: ConfirmPaxType, gender?: boolean): string {
  if (paxType === "ADULT") {
    return gender === false ? "MS" : "MR";
  }
  return gender === false ? "MISS" : "MSTR";
}

export function buildVjPaxLists(
  passengers: ConfirmPricePaxListItem[],
  flights: Record<string, unknown>[]
): ConfirmPricePaxApiItem[] {
  const isInternational = isInternationalItineraries(flights);
  const adults = passengers.filter((p) => PAX_TYPE_MAP[p.type] === "ADULT");
  const children = passengers.filter((p) => PAX_TYPE_MAP[p.type] === "CHILD");
  const infants = passengers.filter((p) => PAX_TYPE_MAP[p.type] === "INFANT");
  const ordered = [...adults, ...children, ...infants];

  let nextId = 1;
  const apiPax: ConfirmPricePaxApiItem[] = ordered.map((pax) => {
    const paxType = PAX_TYPE_MAP[pax.type] ?? "ADULT";
    const paxId = String(nextId++);
    return {
      paxId,
      paxType,
      firstName: (pax.firstName ?? "").trim().toUpperCase(),
      lastName: (pax.lastName ?? "").trim().toUpperCase(),
      title: resolveVjPaxTitle(paxType, pax.gender),
      birthday: toAirdataBirthdayIso(pax.birthday),
      PaxDocuments: buildPaxDocumentsForPassenger(paxId, pax, isInternational),
    };
  });

  const firstAdult = apiPax.find((p) => p.paxType === "ADULT");
  const firstInfant = apiPax.find((p) => p.paxType === "INFANT");
  if (firstAdult && firstInfant) {
    firstAdult.childPaxId = firstInfant.paxId;
    firstInfant.parentPaxId = firstAdult.paxId;
  }

  return apiPax;
}

export function buildVjConfirmSegments(
  flight: Record<string, unknown>
): Record<string, unknown>[] {
  const ticketClass = flight.selectedTicketClass as
    | Record<string, unknown>
    | undefined;
  const airline =
    copyTripField(flight.airline) || copyTripField(flight.airLineCode);

  const fareType = firstPipeSegment(
    ticketClass?.fareType ?? ticketClass?.groupClass
  );
  const fareBasisCode = firstPipeSegment(ticketClass?.fareBasisCode);
  const bookingClass = copyTripField(ticketClass?.bookingClass);
  const groupClass = copyTripField(ticketClass?.groupClass);

  if (!Array.isArray(flight.segments)) return [];

  const defaultBookingClassId = copyTripField(ticketClass?.bookingClassId);

  return (flight.segments as Record<string, unknown>[]).map((seg, index) => {
    const legNum =
      typeof seg.leg === "number" ? seg.leg : index + 1;

    const segmentId = resolveVjSegmentSearchToken(seg);

    const segFareType =
      firstPipeSegment(seg.fareType) ||
      fareType ||
      firstPipeSegment(seg.groupClass) ||
      groupClass;

    const segFareBasisCode =
      firstPipeSegment(seg.fareBasisCode) ||
      fareBasisCode ||
      copyTripField(seg.bookingClass) ||
      bookingClass;

    return {
      leg: legNum,
      airline: copyTripField(seg.airline) || airline,
      operating: "",
      departure: airportFromPoint(seg.departure),
      arrival: airportFromPoint(seg.arrival),
      departureTime: resolveSegmentDateTime(seg, "departure", {
        international: false,
      }),
      arrivalTime: resolveSegmentDateTime(seg, "arrival", {
        international: false,
      }),
      flightNumber: copyTripField(seg.flightNumber),
      fareType: segFareType,
      fareBasisCode: segFareBasisCode,
      bookingClass: copyTripField(seg.bookingClass) || bookingClass,
      groupClass: copyTripField(seg.groupClass) || groupClass,
      marriageGrp: "",
      segmentValue: "",
      segmentId,
      bookingClassId:
        copyTripField(seg.bookingClassId) || defaultBookingClassId,
    };
  });
}

function airportFromPoint(point: unknown): string {
  if (typeof point === "string") return point;
  if (point && typeof point === "object") {
    const obj = point as { IATACode?: string; code?: string };
    return obj.IATACode ?? obj.code ?? "";
  }
  return "";
}

export function buildVjItineraries(
  flights: Record<string, unknown>[]
): ConfirmPriceItinerary[] {
  return flights.map((flight, index) => {
    const airline = copyTripField(flight.airline) || copyTripField(flight.airLineCode);
    const fare = (flight.selectedTicketClass as Record<string, unknown>) ?? {};

    return {
      domestic: Boolean(flight.domestic),
      source: "VJ",
      airline: airline || "VJ",
      clientId: copyTripField(flight.clientId ?? flight.client_id) || "",
      bookingKey: "string",
      itineraryId: String(flight.itineraryId ?? index + 1),
      fareBreakdowns: buildVjFareBreakdowns(fare, flight),
      segments: buildVjConfirmSegments(flight),
      paxssr: [] as unknown[],
      paxSeat: [] as unknown[],
    };
  });
}

export function assertVjSegmentsHaveSearchTokens(
  flights: Record<string, unknown>[]
): void {
  for (const flight of flights) {
    assertVjTripHasSegmentTokens(flight);
  }
}

export type BuildVjConfirmPriceInput = {
  flights: Record<string, unknown>[];
  passengers: ConfirmPricePaxListItem[];
  contact: {
    phone?: string;
    email?: string;
    full_name?: string;
    gender?: string;
    address?: string;
  };
  session: string;
  bookingFlightRequestId?: number | null;
  agentContact?: { phone?: string; email?: string } | null;
  update_phone_to_booking?: boolean;
  update_email_to_booking?: boolean;
};

/** Template Postman VJ — confirm-price / hold-flight. */
export function buildVjConfirmPricePayload(
  input: BuildVjConfirmPriceInput
): ConfirmPriceRequest {
  assertVjSegmentsHaveSearchTokens(input.flights);

  const flightType: FlightTripType =
    input.flights.length > 1 ? "RT" : "OW";

  const paxLists = buildVjPaxLists(input.passengers, input.flights);
  const itineraries = buildVjItineraries(input.flights);

  const finalPhone = input.update_phone_to_booking
    ? (input.contact.phone || "")
    : (input.agentContact?.phone || input.contact.phone || "");

  const finalEmail = input.update_email_to_booking
    ? (input.contact.email || "")
    : (input.agentContact?.email || input.contact.email || "");

  const payload: ConfirmPriceRequest = {
    type: "VJ",
    flightType,
    splitItineraries: false,
    session: input.session,
    airlineContact: {
      phoneNumber: normalizeAirdataPhoneNumber(finalPhone),
      email: finalEmail,
    },
    paxLists,
    itineraries,
    contact: {
      full_name: input.contact.full_name ?? "",
      gender: input.contact.gender ?? "male",
      phone: input.contact.phone ?? "",
      email: input.contact.email ?? "",
      address: input.contact.address ?? "",
    },
    update_phone_to_booking: !!input.update_phone_to_booking,
    update_email_to_booking: !!input.update_email_to_booking,
  };

  if (input.bookingFlightRequestId != null) {
    payload.booking_flight_request_id = input.bookingFlightRequestId;
  }

  return sanitizeVjConfirmPriceRequest(
    payload as unknown as Record<string, unknown>
  ) as unknown as ConfirmPriceRequest;
}

/** Alias theo tên flow Postman hold / paynow. */
export const buildVjHoldPayload = buildVjConfirmPricePayload;

export function isVjConfirmPriceFlight(flight: Record<string, unknown>): boolean {
  return isVietJetSource(flight.source ?? flight.airLineSource);
}
