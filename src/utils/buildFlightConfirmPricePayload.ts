import { format } from "date-fns";
import type {
  ConfirmPaxType,
  ConfirmPriceFareBreakdown,
  ConfirmPriceItinerary,
  ConfirmPricePaxApiItem,
  ConfirmPricePaxListItem,
  ConfirmPriceRequest,
  FlightTripType,
} from "@/types/flightConfirmPrice";
import { getTripClientId } from "@/utils/normalizeFlightTrip";
import {
  mapSegmentsForConfirm,
  resolveBookingKey,
} from "@/utils/mapSegmentForConfirm";
import type { SelectedFlight } from "@/types/selectedFlight";

const PAX_TYPE_MAP: Record<string, ConfirmPaxType> = {
  ADT: "ADULT",
  ADULT: "ADULT",
  CHD: "CHILD",
  CHILD: "CHILD",
  INF: "INFANT",
  INFANT: "INFANT",
};

/**
 * Copy field from selected trip (search response) as-is.
 * null/undefined → "" (never the literal strings "null" / "undefined").
 */
function copyTripField(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

const FARE_BREAKDOWN_CONFIG: Array<{
  paxType: ConfirmPaxType;
  countKey: "numberAdt" | "numberChd" | "numberInf";
  netKeys: string[];
  discountKeys: string[];
  taxKeys: string[];
  totalKeys: string[];
  fareValueKeys: string[];
}> = [
  {
    paxType: "ADULT",
    countKey: "numberAdt",
    netKeys: ["fareAdult", "fareAdultFinal"],
    discountKeys: ["discountAdult", "discountAmountAdult"],
    taxKeys: ["taxAdult", "totalTaxAdt"],
    totalKeys: ["totalAdult"],
    fareValueKeys: ["fareValueAdult", "adultFareValue", "fareValueADT"],
  },
  {
    paxType: "CHILD",
    countKey: "numberChd",
    netKeys: ["fareChild", "fareChildFinal"],
    discountKeys: ["discountChild", "discountAmountChild"],
    taxKeys: ["taxChild", "totalTaxChd"],
    totalKeys: ["totalChild"],
    fareValueKeys: ["fareValueChild", "childFareValue", "fareValueCHD"],
  },
  {
    paxType: "INFANT",
    countKey: "numberInf",
    netKeys: ["fareInfant", "fareInfantFinal"],
    discountKeys: ["discountInfant", "discountAmountInfant"],
    taxKeys: ["taxInfant", "totalTaxInf"],
    totalKeys: ["totalInfant"],
    fareValueKeys: ["fareValueInfant", "infantFareValue", "fareValueINF"],
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

function pickString(source: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

/** Decode fareOptions.fareValue → bookingKey (VJ Base64 JSON, 9G FLN token, …). */
export function decodeFareValueBookingKey(fareValue: unknown): string {
  return resolveBookingKey(fareValue);
}

function resolveBreakdownFareValue(
  fare: Record<string, unknown>,
  config: (typeof FARE_BREAKDOWN_CONFIG)[number]
): string {
  const typed = pickString(fare, config.fareValueKeys);
  if (typed) return typed;

  const raw = fare.fareValue;
  if (typeof raw === "string" && raw.trim()) {
    return raw.trim();
  }

  return "";
}

export function buildFareBreakdowns(
  flight: Record<string, unknown>
): ConfirmPriceFareBreakdown[] {
  const fare =
    (flight.selectedTicketClass as Record<string, unknown>) ??
    (flight.fareOptions as Record<string, unknown>[])?.[0] ??
    {};

  const breakdowns: ConfirmPriceFareBreakdown[] = [];

  for (const config of FARE_BREAKDOWN_CONFIG) {
    const count = Number(flight[config.countKey]) || 0;
    if (count <= 0) continue;

    const netFare = pickNumber(fare, config.netKeys, 0);
    const tax = pickNumber(fare, config.taxKeys, 0);
    const total =
      pickNumber(fare, config.totalKeys, 0) || netFare + tax;

    breakdowns.push({
      paxType: config.paxType,
      netFare,
      discountAmount: pickNumber(fare, config.discountKeys, 0),
      discountAmountParent: 0,
      tax,
      total,
      fareValue: resolveBreakdownFareValue(fare, config),
    });
  }

  return breakdowns;
}

function resolvePaxTitle(gender?: boolean): string {
  return gender === false ? "MS" : "MR";
}

/** ADT → CHD → INF; paxId = "1", "2", …; INF links to first ADULT via childPaxId. */
export function buildPaxLists(
  passengers: ConfirmPricePaxListItem[]
): ConfirmPricePaxApiItem[] {
  const adults = passengers.filter((p) => PAX_TYPE_MAP[p.type] === "ADULT");
  const children = passengers.filter((p) => PAX_TYPE_MAP[p.type] === "CHILD");
  const infants = passengers.filter((p) => PAX_TYPE_MAP[p.type] === "INFANT");
  const ordered = [...adults, ...children, ...infants];

  let nextId = 1;
  const apiPax: ConfirmPricePaxApiItem[] = ordered.map((pax) => {
    const paxType = PAX_TYPE_MAP[pax.type] ?? "ADULT";
    return {
      paxId: String(nextId++),
      paxType,
      firstName: pax.firstName ?? "",
      lastName: pax.lastName ?? "",
      title: resolvePaxTitle(pax.gender),
      PaxDocuments: [],
    };
  });

  const firstAdult = apiPax.find((p) => p.paxType === "ADULT");
  const firstInfant = apiPax.find((p) => p.paxType === "INFANT");
  if (firstAdult && firstInfant) {
    firstAdult.childPaxId = firstInfant.paxId;
  }

  return apiPax;
}

function buildConfirmSegments(flight: Record<string, unknown>): unknown[] {
  const ticketClass = flight.selectedTicketClass as
    | Record<string, unknown>
    | undefined;
  const airline =
    copyTripField(flight.airline) || copyTripField(flight.airLineCode);
  const defaultFareType = String(
    ticketClass?.fareType ?? ticketClass?.groupClass ?? ""
  );

  return mapSegmentsForConfirm(flight.segments, {
    airline,
    fareType: defaultFareType,
    fareBasisCode: copyTripField(ticketClass?.fareBasisCode),
    bookingClass: copyTripField(ticketClass?.bookingClass),
    groupClass: copyTripField(ticketClass?.groupClass),
  });
}

function buildItineraries(flights: Record<string, unknown>[]): ConfirmPriceItinerary[] {
  return flights.map((flight) => {
    const ticketClass =
      (flight.selectedTicketClass as Record<string, unknown>) ?? {};
    const bookingKey = decodeFareValueBookingKey(ticketClass.fareValue);

    const airline = copyTripField(flight.airline) || copyTripField(flight.airLineCode);

    return {
      domestic: Boolean(flight.domestic),
      source: copyTripField(flight.source),
      airline,
      clientId: getTripClientId(flight),
      bookingKey,
      itineraryId: flight.itineraryId ? String(flight.itineraryId) : "1",
      fareBreakdowns: buildFareBreakdowns(flight),
      segments: buildConfirmSegments(flight),
      paxssr: [],
      paxSeat: [],
    };
  });
}

function collectPaxSsr(passengers: ConfirmPricePaxListItem[]): unknown[] {
  const ssr: unknown[] = [];
  passengers.forEach((pax) => {
    if (!Array.isArray(pax.baggages)) return;
    pax.baggages.forEach((bag) => {
      if (bag && typeof bag === "object") ssr.push(bag);
    });
  });
  return ssr;
}

export function buildFlightConfirmPricePayload(input: {
  flights: Record<string, unknown>[];
  passengers: ConfirmPricePaxListItem[];
  contact: {
    phone?: string;
    email?: string;
    full_name?: string;
  };
  flightSession?: string | null;
}): ConfirmPriceRequest {
  const { flights, passengers, contact, flightSession } = input;
  const primaryFlight = flights[0] ?? {};
  const flightType: FlightTripType = flights.length > 1 ? "RT" : "OW";
  const sourceType = String(primaryFlight.source ?? "VN1A");

  const paxLists = buildPaxLists(passengers);
  const itineraries = buildItineraries(flights);
  const allSsr = collectPaxSsr(passengers);

  if (allSsr.length) {
    itineraries.forEach((itinerary) => {
      itinerary.paxssr = allSsr;
    });
  }

  const payload: ConfirmPriceRequest = {
    type: sourceType,
    flightType,
    airlineContact: {
      phoneNumber: contact.phone ?? "",
      email: contact.email ?? "",
    },
    paxLists,
    itineraries,
    splitItineraries: false,
  };

  if (flightSession) {
    payload.session = flightSession;
  }

  return payload;
}

export function buildFlightConfirmPricePayloadFromSelections(input: {
  selections: SelectedFlight[];
  passengers: ConfirmPricePaxListItem[];
  contact: {
    phone?: string;
    email?: string;
    full_name?: string;
  };
}): ConfirmPriceRequest {
  const flights = input.selections.map((sel) => ({
    ...(sel.trip as Record<string, unknown>),
    selectedTicketClass: sel.fareOption,
    itineraryId: sel.itineraryId,
    numberAdt: sel.paxCounts.adult,
    numberChd: sel.paxCounts.child,
    numberInf: sel.paxCounts.infant,
  }));

  return buildFlightConfirmPricePayload({
    flights,
    passengers: input.passengers,
    contact: input.contact,
  });
}

export function buildPassengersFromForm(
  data: {
    atd: Array<Record<string, unknown>>;
    chd?: Array<Record<string, unknown>>;
    inf?: Array<Record<string, unknown>>;
  },
  listBaggagePassenger: Record<string, unknown[][]>
): ConfirmPricePaxListItem[] {
  const mapPassenger = (
    items: Array<{ value: Record<string, unknown>; Type: string }>,
    typeKey: string
  ) =>
    items.map((item, index) => {
      const baggages =
        listBaggagePassenger[typeKey]?.[index] &&
        Array.isArray(listBaggagePassenger[typeKey][index])
          ? listBaggagePassenger[typeKey][index]
          : undefined;

      return {
        index,
        type: item.Type,
        firstName: item.value.firstName as string,
        lastName: item.value.lastName as string,
        gender: item.value.gender === "male",
        birthday: item.value.birthday
          ? format(new Date(item.value.birthday as string | Date), "yyyy-MM-dd")
          : "",
        baggages,
      };
    });

  const adtArr = data.atd.map((item) => ({ value: item, Type: "ADT" }));
  const chdArr = data.chd
    ? data.chd.map((item) => ({ value: item, Type: "CHD" }))
    : [];
  const infArr = data.inf
    ? data.inf.map((item) => ({ value: item, Type: "INF" }))
    : [];

  return [
    ...mapPassenger(adtArr, "atd"),
    ...mapPassenger(chdArr, "chd"),
    ...mapPassenger(infArr, "inf"),
  ];
}

export function normalizeConfirmPriceResponse(
  raw: Record<string, unknown> | null | undefined
): {
  bookingId: string;
  orderCode: string;
  bookingFlightRequestId?: number;
  bookingDeadline: string | null;
  totalPrice: number | null;
  totalTax: number | null;
  breakdown: Record<string, number | undefined>;
} {
  const data = (raw?.data as Record<string, unknown>) ?? raw ?? {};
  const bookingId =
    (data.bookingId as string) ||
    (data.booking_id as string) ||
    (data.airdata_booking_id as string) ||
    "";

  const orderCode =
    (data.order_code as string) ||
    (data.orderCode as string) ||
    ((data.orderInfo as Record<string, unknown>)?.sku as string) ||
    "";

  const bookingDeadline =
    (data.booking_deadline as string) ||
    (data.bookingDeadline as string) ||
    ((data.orderInfo as Record<string, unknown>)?.booking_deadline as string) ||
    null;

  const breakdown =
    (data.price_breakdown as Record<string, number>) ?? data;

  const pricing = (data.pricing as Record<string, number>) ?? {};

  return {
    bookingId,
    orderCode,
    bookingFlightRequestId: data.booking_flight_request_id as number | undefined,
    bookingDeadline,
    totalPrice:
      (data.total_price as number) ??
      (pricing.total as number) ??
      (breakdown.total_price as number) ??
      null,
    totalTax:
      (data.total_tax as number) ??
      (pricing.total_tax as number) ??
      (breakdown.total_tax as number) ??
      null,
    breakdown: {
      total_price: breakdown.total_price as number | undefined,
      total_tax: breakdown.total_tax as number | undefined,
      total_price_net: breakdown.total_price_net as number | undefined,
      total_fee_service: breakdown.total_fee_service as number | undefined,
    },
  };
}
