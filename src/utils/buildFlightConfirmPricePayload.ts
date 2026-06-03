import { format } from "date-fns";
import type {
  ConfirmPaxType,
  ConfirmPriceContact,
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
import { handleSessionStorage } from "@/utils/Helper";
import {
  copyVjFareValueForConfirm,
  isVietJetSource,
  isVietnamAirlinesSource,
  normalizeAirdataPhoneNumber,
  repairFareOptionFromTrip,
  resolveFareValueFromFareOption,
} from "@/utils/fareValueToken";
import { resolveConfirmItineraryId } from "@/utils/confirmPriceIdentifiers";
import { resolveSegmentDateTime } from "@/utils/mapSegmentForConfirm";
import type { SelectedFlight } from "@/types/selectedFlight";
import { is1GSource, isGdsSource } from "@/utils/internationalFlightSelection";
import {
  build1GConfirmPriceSelectionPayload,
  is1GConfirmSelection,
  merge1GSelectionsForConfirm,
} from "@/utils/oneGConfirmPrice";
import {
  buildVjConfirmPricePayload,
  buildVjFareBreakdowns,
} from "@/utils/vjConfirmPrice";
import {
  buildVn1aFareBreakdowns,
  resolveVn1aClientId,
  sanitizeVn1aConfirmPriceRequest,
} from "@/utils/vn1aConfirmPrice";
import {
  assertVuFareConsistency,
  buildVuFareBreakdowns,
  isVuSource,
  resolveVuFareValueFromSearch,
  sanitizeVuConfirmPriceRequest,
  stripConfirmSegmentFields,
} from "@/utils/vuConfirmPrice";
import { resolveVjSegmentSearchToken } from "@/utils/vjSegmentToken";

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

/** "XAP | XAP" → "XAP" (1G GDS). */
function firstPipeSegment(value: unknown): string {
  const raw = copyTripField(value);
  if (!raw) return "";
  return raw.split("|")[0]?.trim() ?? "";
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

function pickString(source: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function resolveBreakdownFareValue(
  fare: Record<string, unknown>,
  source?: unknown,
  flight?: Record<string, unknown>
): string {
  if (isVietJetSource(source)) {
    return copyVjFareValueForConfirm(fare);
  }

  if (isVuSource(source)) {
    const fromVu = resolveVuFareValueFromSearch(fare, flight);
    if (fromVu) return fromVu;
  }

  const fromFare = resolveFareValueFromFareOption(source, fare, flight);
  if (fromFare) return fromFare;

  if (!flight) return "";

  const idx =
    typeof flight.fareOptionIndex === "number" ? flight.fareOptionIndex : 0;
  const list = flight.fareOptions as Record<string, unknown>[] | undefined;
  if (list?.[idx]) {
    const fromList = resolveFareValueFromFareOption(source, list[idx], flight);
    if (fromList) return fromList;
  }

  const stc = flight.selectedTicketClass as Record<string, unknown> | undefined;
  if (stc && stc !== fare) {
    return resolveFareValueFromFareOption(source, stc, flight);
  }

  return "";
}

export function buildFareBreakdowns(
  flight: Record<string, unknown>
): ConfirmPriceFareBreakdown[] {
  const source = String(flight.source ?? "");
  const isVj = isVietJetSource(source);

  const fareIndex =
    typeof flight.fareOptionIndex === "number" ? flight.fareOptionIndex : 0;

  const fare = isVj
    ? ((flight.selectedTicketClass as Record<string, unknown>) ?? {})
    : repairFareOptionFromTrip(
      ((flight.selectedTicketClass as Record<string, unknown>) ??
        (flight.fareOptions as Record<string, unknown>[])?.[fareIndex] ??
        {}) as Record<string, unknown>,
      {
        fareOptionIndex: fareIndex,
        trip: flight,
        source,
      }
    );

  if (isVj) {
    return buildVjFareBreakdowns(fare, flight);
  }

  if (isVietnamAirlinesSource(source)) {
    return buildVn1aFareBreakdowns(flight);
  }

  if (isVuSource(source)) {
    return buildVuFareBreakdowns(flight);
  }

  const breakdowns: ConfirmPriceFareBreakdown[] = [];
  const fareValue = resolveBreakdownFareValue(fare, source, flight);

  for (const config of FARE_BREAKDOWN_CONFIG) {
    const count = Number(flight[config.countKey]) || 0;
    if (count <= 0) continue;

    const netFare = pickNumber(fare, config.netKeys, 0);
    const tax = pickNumber(fare, config.taxKeys, 0);
    /** Airdata (non-VJ): total = netFare + tax — không dùng totalAdult (đã cộng phí DV). */
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

function resolvePaxTitle(
  paxType: ConfirmPaxType,
  gender?: boolean
): string {
  if (paxType === "ADULT") {
    return gender === false ? "MS" : "MR";
  }
  return gender === false ? "MISS" : "MSTR";
}

function normalizePaxName(value: string | undefined): string {
  return (value ?? "").trim().toUpperCase();
}

/** Pass-through clientId from search trip; VN1A default "VNA". */
function itineraryClientIdField(
  trip: Record<string, unknown>
): Pick<ConfirmPriceItinerary, "clientId"> | Record<string, never> {
  if (isVietnamAirlinesSource(trip.source)) {
    return { clientId: resolveVn1aClientId(trip) };
  }
  const hasKey = "clientId" in trip || "client_id" in trip;
  if (!hasKey) return {};
  const raw = trip.clientId ?? trip.client_id;
  if (raw === null || raw === undefined) return { clientId: "" };
  return { clientId: String(raw) };
}

/** ADT → CHD → INF; paxId = "1", "2", …; INF ↔ first ADULT via childPaxId + parentPaxId (VJ Postman). */
export function buildPaxLists(
  passengers: ConfirmPricePaxListItem[],
  options?: { flights?: Record<string, unknown>[] }
): ConfirmPricePaxApiItem[] {
  const isInternational = options?.flights
    ? isInternationalItineraries(options.flights)
    : false;

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
      firstName: normalizePaxName(pax.firstName),
      lastName: normalizePaxName(pax.lastName),
      title: resolvePaxTitle(paxType, pax.gender),
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

function buildConfirmSegments(flight: Record<string, unknown>): unknown[] {
  const baseTicketClass = flight.selectedTicketClass as
    | Record<string, unknown>
    | undefined;
  const isGds = isGdsSource(flight.source);
  const isVj = isVietJetSource(flight.source);
  const isVn1a = isVietnamAirlinesSource(flight.source);
  const isVu = isVuSource(flight.source);
  const ticketClass = isVu
    ? assertVuFareConsistency(flight, "confirm")
    : baseTicketClass;
  const isInternational =
    isGds || flight.domestic === false;
  const airline =
    copyTripField(flight.airline) || copyTripField(flight.airLineCode);

  const fareType = firstPipeSegment(ticketClass?.fareType ?? ticketClass?.groupClass);
  const fareBasisCode = firstPipeSegment(ticketClass?.fareBasisCode);
  const bookingClass = copyTripField(ticketClass?.bookingClass);
  const groupClass = copyTripField(ticketClass?.groupClass);
  const bookingClassId = copyTripField(ticketClass?.bookingClassId);
  const source = copyTripField(flight.source);

  if (!Array.isArray(flight.segments)) return [];

  return (flight.segments as Record<string, unknown>[]).map((seg, index) => {
    const legNum =
      typeof seg.leg === "number"
        ? seg.leg
        : index + 1;

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

    const segBookingClass =
      copyTripField(seg.bookingClass) || bookingClass;

    const segGroupClass =
      copyTripField(seg.groupClass) || groupClass;

    const segBookingClassId =
      copyTripField(seg.bookingClassId) || bookingClassId;

    const segAirline =
      copyTripField(seg.airline) || airline;

    const operatingRaw = copyTripField(seg.operating);
    const operating = isGds || isVj ? "" : operatingRaw || segAirline;

    const departure = (() => {
      if (typeof seg.departure === "string") return seg.departure;
      if (seg.departure && typeof seg.departure === "object") {
        const d = seg.departure as { IATACode?: string; code?: string };
        return d.IATACode ?? d.code ?? "";
      }
      return "";
    })();

    const arrival = (() => {
      if (typeof seg.arrival === "string") return seg.arrival;
      if (seg.arrival && typeof seg.arrival === "object") {
        const a = seg.arrival as { IATACode?: string; code?: string };
        return a.IATACode ?? a.code ?? "";
      }
      return "";
    })();

    const departureTime = resolveSegmentDateTime(seg, "departure", {
      international: isInternational,
    });
    const arrivalTime = resolveSegmentDateTime(seg, "arrival", {
      international: isInternational,
    });

    if (isVj) {
      return stripConfirmSegmentFields({
        leg: legNum,
        airline: segAirline,
        operating: "",
        departure,
        arrival,
        departureTime,
        arrivalTime,
        flightNumber: copyTripField(seg.flightNumber),
        fareType: segFareType,
        fareBasisCode: segFareBasisCode,
        bookingClass: segBookingClass,
        groupClass: segGroupClass || groupClass,
        marriageGrp: "",
        segmentValue: "",
        segmentId: resolveVjSegmentSearchToken(seg),
        bookingClassId: segBookingClassId,
      });
    }

    if (isVn1a) {
      const legKey = String(legNum);
      return stripConfirmSegmentFields({
        leg: legNum,
        airline: segAirline,
        operating: operatingRaw || segAirline,
        departure,
        arrival,
        departureTime,
        arrivalTime,
        flightNumber: copyTripField(seg.flightNumber),
        fareType: segFareType,
        fareBasisCode: segFareBasisCode,
        bookingClass: segBookingClass,
        groupClass: segGroupClass || groupClass || "Economy",
        marriageGrp:
          copyTripField(seg.marriageGrp) || (legNum === 1 ? "O" : "I"),
        segmentValue: legKey,
        segmentId: legKey,
        bookingClassId: segBookingClassId,
      });
    }

    if (isVu) {
      return stripConfirmSegmentFields({
        leg: legNum,
        airline: segAirline,
        operating,
        departure,
        arrival,
        departureTime,
        arrivalTime,
        flightNumber: copyTripField(seg.flightNumber),
        // VU must map fare-class fields from chosen fare option only.
        fareType: fareType || segFareType,
        fareBasisCode,
        bookingClass,
        groupClass,
        marriageGrp:
          copyTripField(seg.marriageGrp) || (legNum === 1 ? "O" : "I"),
        // VU: giữ nguyên id/value từ selected resource, không fallback theo leg.
        segmentValue: copyTripField(seg.segmentValue),
        segmentId: copyTripField(seg.segmentId),
        bookingClassId: segBookingClassId,
      });
    }

    const segmentValue = copyTripField(seg.segmentValue);
    const segmentIdFromSearch = copyTripField(seg.segmentId);

    const resolvedValue = segmentValue || segmentIdFromSearch || String(legNum);
    const resolvedId = isGds
      ? String(legNum)
      : segmentIdFromSearch || segmentValue || String(legNum);

    return stripConfirmSegmentFields({
      leg: legNum,
      airline: segAirline,
      operating,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      flightNumber: copyTripField(seg.flightNumber),
      fareType: segFareType,
      fareBasisCode: segFareBasisCode,
      bookingClass: segBookingClass,
      groupClass: segGroupClass || "Economy",
      marriageGrp:
        copyTripField(seg.marriageGrp) || (legNum === 1 ? "O" : "I"),
      segmentValue: resolvedValue,
      segmentId: resolvedId,
      bookingClassId: segBookingClassId,
    });
  });
}

function buildItineraries(flights: Record<string, unknown>[]): ConfirmPriceItinerary[] {
  return flights.map((flight, index) => {
    const airline = copyTripField(flight.airline) || copyTripField(flight.airLineCode);
    const isGds = isGdsSource(flight.source);
    const isVj = isVietJetSource(flight.source);
    const isVn1a = isVietnamAirlinesSource(flight.source);
    const isVu = isVuSource(flight.source);
    const segments = buildConfirmSegments(flight) as Record<string, unknown>[];

    const itinerary: ConfirmPriceItinerary = {
      domestic: Boolean(flight.domestic),
      source: isVn1a ? "VN1A" : copyTripField(flight.source),
      airline: isVn1a ? airline || "VN" : airline,
      ...itineraryClientIdField(flight),
      itineraryId: resolveConfirmItineraryId(flight, segments, index, {
        isGds,
        isVj,
        isVn1a,
        isVu,
      }),
      fareBreakdowns: buildFareBreakdowns(flight),
      segments,
      paxssr: [],
      paxSeat: [],
    };

    if (isGds || isVj || isVn1a || isVu) {
      itinerary.bookingKey = "string";
    }

    return itinerary;
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

function buildConfirmContact(
  contact: Partial<ConfirmPriceContact> & {
    phone?: string;
    email?: string;
    full_name?: string;
    gender?: string;
    address?: string;
  }
): ConfirmPriceContact {
  return {
    full_name: contact.full_name ?? "",
    gender: contact.gender ?? "male",
    phone: contact.phone ?? "",
    email: contact.email ?? "",
    address: contact.address ?? "",
  };
}

export function buildFlightConfirmPricePayload(input: {
  flights: Record<string, unknown>[];
  passengers: ConfirmPricePaxListItem[];
  contact: Partial<ConfirmPriceContact> & {
    phone?: string;
    email?: string;
    full_name?: string;
    gender?: string;
    address?: string;
  };
  flightSession?: string | null;
  bookingFlightRequestId?: number | null;
  agentContact?: { phone?: string; email?: string } | null;
  update_phone_to_booking?: boolean;
  update_email_to_booking?: boolean;
}): ConfirmPriceRequest {
  const {
    flights,
    passengers,
    contact,
    flightSession,
    bookingFlightRequestId,
    agentContact,
    update_phone_to_booking,
    update_email_to_booking,
  } = input;
  const primaryFlight = flights[0] ?? {};
  const flightType: FlightTripType = flights.length > 1 ? "RT" : "OW";
  const sourceType = String(primaryFlight.source ?? "");

  const allVj = flights.every((f) => isVietJetSource(f.source));

  if (allVj) {
    if (!flightSession) {
      throw new Error("VJ_SESSION_REQUIRED");
    }
    const vjPayload = buildVjConfirmPricePayload({
      flights,
      passengers,
      contact: buildConfirmContact(contact),
      session: flightSession,
      bookingFlightRequestId,
    });
    const allSsr = collectPaxSsr(passengers);
    if (allSsr.length) {
      vjPayload.itineraries.forEach((itinerary) => {
        itinerary.paxssr = allSsr;
      });
    }
    return vjPayload;
  }

  if (isVietnamAirlinesSource(sourceType) && !flightSession) {
    throw new Error("VN1A_SESSION_REQUIRED");
  }

  const paxLists = buildPaxLists(passengers, { flights });
  const itineraries = buildItineraries(flights);
  const allSsr = collectPaxSsr(passengers);

  if (allSsr.length) {
    itineraries.forEach((itinerary) => {
      itinerary.paxssr = allSsr;
    });
  }

  const finalPhone = update_phone_to_booking
    ? (contact.phone || "")
    : (agentContact?.phone || contact.phone || "");

  const finalEmail = update_email_to_booking
    ? (contact.email || "")
    : (agentContact?.email || contact.email || "");

  const payload: ConfirmPriceRequest = {
    type: isVietnamAirlinesSource(sourceType) ? "VN1A" : sourceType,
    flightType,
    splitItineraries: false,
    airlineContact: {
      phoneNumber: normalizeAirdataPhoneNumber(finalPhone),
      email: finalEmail,
    },
    paxLists,
    itineraries,
    contact: buildConfirmContact(contact),
    update_phone_to_booking: !!update_phone_to_booking,
    update_email_to_booking: !!update_email_to_booking,
  };

  if (flightSession) {
    payload.session = flightSession;
  }
  if (bookingFlightRequestId != null) {
    payload.booking_flight_request_id = bookingFlightRequestId;
  }

  if (isVietnamAirlinesSource(sourceType)) {
    for (const itinerary of payload.itineraries) {
      for (const row of itinerary.fareBreakdowns) {
        if (!row.fareValue?.trim()) {
          throw new Error("VN1A_FARE_VALUE_REQUIRED");
        }
      }
    }
    return sanitizeVn1aConfirmPriceRequest(
      payload as unknown as Record<string, unknown>
    ) as unknown as ConfirmPriceRequest;
  }

  if (isVuSource(sourceType)) {
    return sanitizeVuConfirmPriceRequest(
      payload as unknown as Record<string, unknown>
    ) as unknown as ConfirmPriceRequest;
  }

  return payload;
}

export function buildFlightConfirmPricePayloadFromSelections(input: {
  selections: SelectedFlight[];
  passengers: ConfirmPricePaxListItem[];
  contact: Partial<ConfirmPriceContact> & {
    phone?: string;
    email?: string;
    full_name?: string;
    gender?: string;
    address?: string;
  };
  bookingFlightRequestId?: number | null;
  agentContact?: { phone?: string; email?: string } | null;
  update_phone_to_booking?: boolean;
  update_email_to_booking?: boolean;
}): ConfirmPriceRequest {
  if (is1GConfirmSelection(input.selections)) {
    const merged = merge1GSelectionsForConfirm(input.selections);
    if (!merged?.searchId) {
      throw new Error("1G_SESSION_REQUIRED");
    }
    const tripRecord = merged.trip as Record<string, unknown>;
    const paxLists = buildPaxLists(input.passengers, {
      flights: [tripRecord],
    });
    const flightForBreakdown = {
      ...tripRecord,
      source: "1G",
      domestic: false,
      selectedTicketClass: merged.fareOption,
      numberAdt: merged.paxCounts.adult,
      numberChd: merged.paxCounts.child,
      numberInf: merged.paxCounts.infant,
    };
    const fareBreakdowns = buildFareBreakdowns(flightForBreakdown);

    return build1GConfirmPriceSelectionPayload({
      selection: merged,
      paxLists,
      fareBreakdowns,
      contact: input.contact,
      bookingFlightRequestId: input.bookingFlightRequestId,
    });
  }

  for (const sel of input.selections) {
    const source = sel.trip?.source ?? sel.fareOption?.source;
    if (!isVietJetSource(source)) continue;
    if (!sel.searchId) {
      throw new Error("VJ_SESSION_REQUIRED");
    }
  }

  const flights = input.selections.map((sel, index) => {
    const trip = sel.trip as Record<string, unknown>;
    const source = trip.source ?? sel.fareOption?.source;
    const selectedFare = isVuSource(source)
      ? assertVuFareConsistency(
        {
          ...trip,
          selectedTicketClass: sel.fareOption,
          fareOptionIndex: sel.fareOptionIndex,
        },
        "confirm"
      )
      : repairFareOptionFromTrip(
        sel.fareOption as Record<string, unknown>,
        {
          fareOptionIndex: sel.fareOptionIndex,
          trip,
          source,
        }
      );
    return {
      ...trip,
      selectedTicketClass: selectedFare,
      fareOptionIndex: sel.fareOptionIndex,
      itineraryId: sel.itineraryId,
      numberAdt: sel.paxCounts.adult,
      numberChd: sel.paxCounts.child,
      numberInf: sel.paxCounts.infant,
    };
  });

  const sessionId =
    input.selections[0]?.searchId ||
    (typeof window !== "undefined"
      ? (handleSessionStorage("get", "flightSession") as string | null)
      : null);

  const allVj = input.selections.every((sel) =>
    isVietJetSource(sel.trip?.source ?? sel.fareOption?.source)
  );

  if (allVj && sessionId) {
    return buildVjConfirmPricePayload({
      flights,
      passengers: input.passengers,
      contact: input.contact,
      session: sessionId,
      bookingFlightRequestId: input.bookingFlightRequestId,
      agentContact: input.agentContact,
      update_phone_to_booking: input.update_phone_to_booking,
      update_email_to_booking: input.update_email_to_booking,
    });
  }

  return buildFlightConfirmPricePayload({
    flights,
    passengers: input.passengers,
    contact: input.contact,
    flightSession: sessionId,
    bookingFlightRequestId: input.bookingFlightRequestId,
    agentContact: input.agentContact,
    update_phone_to_booking: input.update_phone_to_booking,
    update_email_to_booking: input.update_email_to_booking,
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
        passport: item.value.passport as string | undefined,
        nationality: item.value.nationality as string | undefined,
        passport_country: (item.value.nationality as string | undefined) ?? "VNM",
        passport_expiry_date: item.value.passport_expiry_date as
          | string
          | Date
          | undefined,
        passport_issue_date: item.value.passport_issue_date as
          | string
          | Date
          | undefined,
        cccd: item.value.cccd as string | undefined,
        cccd_date: item.value.cccd_date as string | Date | undefined,
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
  holdExpiresAt: string | null;
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

  const holdExpiresAt =
    (data.hold_expires_at as string) ||
    (data.holdExpiresAt as string) ||
    ((data.orderInfo as Record<string, unknown>)?.hold_expires_at as string) ||
    null;

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
    holdExpiresAt,
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
