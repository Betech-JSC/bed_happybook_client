import type {
  ConfirmPriceContact,
  ConfirmPriceFareBreakdown,
  ConfirmPriceItinerary,
  ConfirmPricePaxApiItem,
  ConfirmPriceRequest,
  FlightTripType,
} from "@/types/flightConfirmPrice";
import type { SelectedFlight } from "@/types/selectedFlight";
import { normalizeAirdataPhoneNumber, copyFareValueRaw } from "@/utils/fareValueToken";
import {
  collectSegmentsFromJourneys,
  is1GSource,
  type JourneyLike,
} from "@/utils/internationalFlightSelection";
import { mapSegmentsForConfirm } from "@/utils/mapSegmentForConfirm";

export { collectSegmentsFromJourneys } from "@/utils/internationalFlightSelection";

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

/** Gộp nhiều leg 1G (format cũ) thành một selection gói đầy đủ. */
export function merge1GSelectionsForConfirm(
  selections: SelectedFlight[]
): SelectedFlight | null {
  if (!selections.length) return null;
  const first = selections[0];

  const tripHasPackage =
    is1GSource(first.trip?.source) &&
    (Array.isArray(first.trip?.journeys) ||
      (first.trip?._selectedJourneyFlights &&
        typeof first.trip._selectedJourneyFlights === "object"));

  if (tripHasPackage) return first;

  const picked: Record<string, Record<string, unknown>> = {};
  let packageTrip: Record<string, unknown> | null = null;

  for (const sel of selections) {
    if (!is1GSource(sel.trip?.source ?? sel.fareOption?.source)) continue;
    const t = sel.trip as Record<string, unknown>;
    if (t.journeys || t._selectedJourneyFlights) {
      packageTrip = { ...t };
    }
    const leg = t.flightLeg;
    const legKey =
      leg === 0 || leg === 1 || leg === "0" || leg === "1"
        ? String(leg)
        : String(Object.keys(picked).length);
    picked[legKey] = t;
  }

  if (packageTrip) {
    const existing =
      (packageTrip._selectedJourneyFlights as Record<string, unknown>) ?? {};
    packageTrip._selectedJourneyFlights = { ...existing, ...picked };
    return { ...first, trip: packageTrip };
  }

  if (Object.keys(picked).length > 0) {
    return {
      ...first,
      trip: {
        ...first.trip,
        source: "1G",
        domestic: false,
        _selectedJourneyFlights: picked,
      },
    };
  }

  return first;
}

export function resolve1GFlightType(trip: Record<string, unknown>): FlightTripType {
  const picked = trip._selectedJourneyFlights as Record<string, unknown> | undefined;
  if (picked && Object.keys(picked).length > 1) return "RT";

  const journeys = trip.journeys as unknown[] | undefined;
  if (Array.isArray(journeys) && journeys.length > 1) {
    const pickedCount = picked ? Object.keys(picked).length : 0;
    if (pickedCount >= 2) return "RT";
  }

  return "OW";
}

/** Map segments + fare breakdowns cho POST confirm-price 1G (Postman). */
export function build1GItineraries(
  selection: SelectedFlight,
  fareBreakdowns: ConfirmPriceFareBreakdown[]
): ConfirmPriceItinerary[] {
  const trip = selection.trip as Record<string, unknown>;
  const fareOption = selection.fareOption as Record<string, unknown>;

  const journeyIds = Array.isArray(fareOption.journeyIds)
    ? (fareOption.journeyIds as string[])
    : [];

  let segments = collectSegmentsFromJourneys(
    trip.journeys as Record<string, JourneyLike[]> | JourneyLike[][] | undefined,
    trip._selectedJourneyFlights as Record<string, Record<string, unknown>> | undefined,
    journeyIds
  );

  if (!segments.length && Array.isArray(trip.segments)) {
    segments = (trip.segments as Record<string, unknown>[]).map((seg, i) => ({
      ...seg,
      leg: typeof seg.leg === "number" ? seg.leg : i + 1,
    }));
  }

  if (!segments.length) {
    return [];
  }

  const firstSegmentValue =
    copyFareValueRaw(
      (segments[0] as Record<string, unknown> | undefined)?.segmentValue
    ) || "";

  const fareTypeDefault = String(
    fareOption.fareType ?? fareOption.groupClass ?? ""
  ).split("|")[0]?.trim();

  const mappedSegments = mapSegmentsForConfirm(segments, {
    fareType: fareTypeDefault,
    airline: String(trip.airline ?? ""),
    source: "1G",
    fareBasisCode: String(fareOption.fareBasisCode ?? ""),
    bookingClass: String(fareOption.bookingClass ?? ""),
    groupClass: String(fareOption.groupClass ?? "Economy"),
  });

  return [
    {
      domestic: false,
      source: "1G",
      airline: String(trip.airline ?? ""),
      clientId: String(trip.clientId ?? trip.client_id ?? ""),
      bookingKey: "string",
      itineraryId: firstSegmentValue || "1",
      fareBreakdowns,
      segments: mappedSegments,
      paxssr: [],
      paxSeat: [],
    },
  ];
}

/**
 * Confirm-price 1G: `selection` (BE passthrough) + `itineraries` (Postman đầy đủ).
 */
export function build1GConfirmPriceSelectionPayload(input: {
  selection: SelectedFlight;
  paxLists: ConfirmPricePaxApiItem[];
  fareBreakdowns: ConfirmPriceFareBreakdown[];
  contact: Partial<ConfirmPriceContact> & {
    phone?: string;
    email?: string;
    full_name?: string;
    gender?: string;
    address?: string;
  };
  bookingFlightRequestId?: number | null;
}): ConfirmPriceRequest {
  const { selection, paxLists, fareBreakdowns, contact } = input;
  const trip = { ...(selection.trip as Record<string, unknown>) };
  const fareOption = { ...selection.fareOption };
  const flightType = resolve1GFlightType(trip);
  const itineraries = build1GItineraries(selection, fareBreakdowns);

  if (itineraries[0]?.segments) {
    trip.segments = itineraries[0].segments;
  }

  const payload: ConfirmPriceRequest = {
    type: "1G",
    flightType,
    session: selection.searchId,
    splitItineraries: false,
    airlineContact: {
      phoneNumber: normalizeAirdataPhoneNumber(contact.phone),
      email: contact.email ?? "",
    },
    paxLists,
    itineraries,
    selection: {
      trip,
      fare_option: fareOption,
      pax_counts: selection.paxCounts,
      pax_lists: paxLists,
    },
    contact: buildConfirmContact(contact),
  };

  if (input.bookingFlightRequestId != null) {
    payload.booking_flight_request_id = input.bookingFlightRequestId;
  }

  return payload;
}

/** Chỉ itineraries (không gửi selection). */
export function build1GConfirmPriceItinerariesPayload(input: {
  selection: SelectedFlight;
  paxLists: ConfirmPricePaxApiItem[];
  fareBreakdowns: ConfirmPriceFareBreakdown[];
  contact: Partial<ConfirmPriceContact> & {
    phone?: string;
    email?: string;
    full_name?: string;
    gender?: string;
    address?: string;
  };
  bookingFlightRequestId?: number | null;
}): ConfirmPriceRequest {
  const { selection, paxLists, fareBreakdowns, contact } = input;
  const flightType = resolve1GFlightType(selection.trip as Record<string, unknown>);
  const itineraries = build1GItineraries(selection, fareBreakdowns);

  const payload: ConfirmPriceRequest = {
    type: "1G",
    flightType,
    session: selection.searchId,
    splitItineraries: false,
    airlineContact: {
      phoneNumber: normalizeAirdataPhoneNumber(contact.phone),
      email: contact.email ?? "",
    },
    paxLists,
    itineraries,
    contact: buildConfirmContact(contact),
  };

  if (input.bookingFlightRequestId != null) {
    payload.booking_flight_request_id = input.bookingFlightRequestId;
  }

  return payload;
}

export function is1GConfirmSelection(selections: SelectedFlight[]): boolean {
  return (
    selections.length > 0 &&
    selections.every((s) =>
      is1GSource(s.trip?.source ?? s.fareOption?.source)
    )
  );
}
