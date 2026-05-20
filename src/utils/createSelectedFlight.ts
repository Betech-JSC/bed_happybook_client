import type {
  PaxCounts,
  SelectedFlight,
  TripsSource,
} from "@/types/selectedFlight";
import {
  cloneSegmentsFromSearch,
  isInternationalConfirmTrip,
  resolveItineraryIdFromTrip,
} from "@/utils/internationalConfirmPrice";
import { pickFareValueForPaxBreakdown } from "@/utils/domesticConfirmFields";
import { normalizeFlightTrip } from "@/utils/normalizeFlightTrip";

export function createSelectedFlight(
  trip: Record<string, unknown>,
  fareOptionIndex: number,
  options: {
    searchId: string;
    tripsSource: TripsSource;
    paxCounts: PaxCounts;
    resourceId?: string;
  }
): SelectedFlight | null {
  const fareOptions = trip.fareOptions as Record<string, unknown>[] | undefined;
  if (!fareOptions?.[fareOptionIndex]) return null;

  const sourceFare = fareOptions[fareOptionIndex] as Record<string, unknown>;
  const fareOption = {
    ...sourceFare,
    fareValue: pickFareValueForPaxBreakdown(sourceFare, trip, "ADULT"),
    fareValueAdult: pickFareValueForPaxBreakdown(sourceFare, trip, "ADULT"),
    fareValueChild: pickFareValueForPaxBreakdown(sourceFare, trip, "CHILD"),
    fareValueInfant: pickFareValueForPaxBreakdown(sourceFare, trip, "INFANT"),
  };
  const normalizedTrip = normalizeFlightTrip({
    ...trip,
    selectedTicketClass: fareOption,
  });

  const itineraryId = isInternationalConfirmTrip(trip)
    ? resolveItineraryIdFromTrip(trip, {
        allowLegFallback: false,
        tripsSource: options.tripsSource,
      })
    : String(
        trip.itineraryId ??
          (trip.flightLeg === 2 || trip.flightLeg === "2" ? "2" : "1")
      );

  const tripBody = { ...normalizedTrip } as Record<string, unknown>;
  tripBody.segments = cloneSegmentsFromSearch(tripBody.segments);
  delete tripBody.selectedTicketClass;
  delete tripBody.fareOptions;

  return {
    searchId: options.searchId,
    resourceId: options.resourceId ?? (trip._resourceId as string | undefined),
    itineraryId,
    trip: tripBody,
    fareOption,
    paxCounts: options.paxCounts,
    tripsSource: options.tripsSource,
  };
}
