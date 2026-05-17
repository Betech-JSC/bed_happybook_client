import type { ConfirmPricePaxApiItem } from "@/types/flightConfirmPrice";
import type { FlightTripType } from "@/types/flightConfirmPrice";
import type { SelectedFlight } from "@/types/selectedFlight";
import { buildPaxLists } from "@/utils/buildFlightConfirmPricePayload";
import type { ConfirmPricePaxListItem } from "@/types/flightConfirmPrice";
import { mapSegmentsForConfirm } from "@/utils/mapSegmentForConfirm";
import { getTripClientId } from "@/utils/normalizeFlightTrip";

export type ConfirmPriceSelectionContact = {
  full_name?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
};

function buildSelectionLeg(sel: SelectedFlight, paxLists: ConfirmPricePaxApiItem[]) {
  const { trip, fareOption, itineraryId, paxCounts } = sel;
  const fareOptionRecord = fareOption as Record<string, unknown>;

  return {
    trip: {
      domestic: Boolean(trip.domestic),
      source: trip.source,
      airline: trip.airline,
      clientId: getTripClientId(trip as Record<string, unknown>),
      segments: mapSegmentsForConfirm(trip.segments, {
        airline: String(trip.airline ?? ""),
        fareType: String(
          fareOptionRecord.fareType ?? fareOptionRecord.groupClass ?? ""
        ),
        fareBasisCode: String(fareOptionRecord.fareBasisCode ?? ""),
        bookingClass: String(fareOptionRecord.bookingClass ?? ""),
        groupClass: String(fareOptionRecord.groupClass ?? ""),
      }),
    },
    fare_option: { ...fareOption },
    itinerary_id: itineraryId,
    pax_counts: {
      adult: paxCounts.adult,
      child: paxCounts.child,
      infant: paxCounts.infant,
    },
    pax_lists: paxLists,
    paxssr: [] as unknown[],
    pax_seat: [] as unknown[],
  };
}

export function buildConfirmPriceSelectionRequest(input: {
  selections: SelectedFlight[];
  contact: ConfirmPriceSelectionContact;
  passengers: ConfirmPricePaxListItem[];
  tripKind: "one_way" | "round_trip";
}): Record<string, unknown> {
  const { selections, contact, passengers, tripKind } = input;
  const primary = selections[0];
  const flightType: FlightTripType =
    selections.length > 1 ? "RT" : "OW";
  const paxLists = buildPaxLists(passengers);

  const payload: Record<string, unknown> = {
    flightType,
    type: String(primary.trip.source ?? ""),
    airlineContact: {
      phoneNumber: contact.phone ?? "",
      email: contact.email ?? "",
    },
    selection: buildSelectionLeg(primary, paxLists),
    contact: {
      full_name: contact.full_name ?? "",
      gender: contact.gender ?? "male",
      phone: contact.phone ?? "",
      email: contact.email ?? "",
      address: contact.address ?? "",
    },
    trip: tripKind,
  };

  if (selections.length > 1) {
    payload.return_selection = buildSelectionLeg(selections[1], paxLists);
  }

  return payload;
}

/** Legacy session: departFlight trip object → SelectedFlight (best effort). */
export function legacyTripToSelectedFlight(
  trip: Record<string, unknown>,
  context: {
    searchId: string;
    tripsSource: SelectedFlight["tripsSource"];
    paxCounts: SelectedFlight["paxCounts"];
    itineraryId?: string;
    resourceId?: string;
  }
): SelectedFlight | null {
  const fareOption =
    (trip.selectedTicketClass as Record<string, unknown>) ??
    (trip.fareOptions as Record<string, unknown>[])?.[0];

  if (!fareOption) return null;

  const { selectedTicketClass, fareOptions, ...tripRest } = trip;

  return {
    searchId: context.searchId,
    resourceId: context.resourceId ?? (trip._resourceId as string | undefined),
    itineraryId: String(
      trip.itineraryId ?? context.itineraryId ?? (trip.flightLeg === 1 ? "2" : "1")
    ),
    trip: tripRest,
    fareOption: { ...fareOption },
    paxCounts: context.paxCounts,
    tripsSource: context.tripsSource,
  };
}
