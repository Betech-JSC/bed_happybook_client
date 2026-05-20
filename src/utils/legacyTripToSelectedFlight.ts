import type { SelectedFlight } from "@/types/selectedFlight";
import { pickFareValueForPaxBreakdown } from "@/utils/domesticConfirmFields";
import {
  cloneSegmentsFromSearch,
  isInternationalConfirmTrip,
  resolveItineraryIdFromTrip,
} from "@/utils/internationalConfirmPrice";
import {
  isLegacy1GPackage,
  legacy1GPackageToSelectedFlight,
} from "@/utils/legacy1GPackageToSelectedFlight";

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
  if (isLegacy1GPackage(trip)) {
    return legacy1GPackageToSelectedFlight(trip, context);
  }

  const rawFare =
    (trip.selectedTicketClass as Record<string, unknown>) ??
    (trip.fareOptions as Record<string, unknown>[])?.[0];

  if (!rawFare) return null;

  const fareOption = {
    ...rawFare,
    fareValue: pickFareValueForPaxBreakdown(rawFare, trip, "ADULT"),
    fareValueAdult: pickFareValueForPaxBreakdown(rawFare, trip, "ADULT"),
    fareValueChild: pickFareValueForPaxBreakdown(rawFare, trip, "CHILD"),
    fareValueInfant: pickFareValueForPaxBreakdown(rawFare, trip, "INFANT"),
  };

  const { selectedTicketClass, fareOptions, ...tripRest } = trip;

  tripRest.segments = cloneSegmentsFromSearch(tripRest.segments);

  return {
    searchId: context.searchId,
    resourceId: context.resourceId ?? (trip._resourceId as string | undefined),
    itineraryId: isInternationalConfirmTrip(tripRest)
      ? resolveItineraryIdFromTrip(tripRest, {
          allowLegFallback: false,
          tripsSource: context.tripsSource,
        })
      : String(
          trip.itineraryId ??
            context.itineraryId ??
            (trip.flightLeg === 2 || trip.flightLeg === "2" ? "2" : "1")
        ),
    trip: tripRest,
    fareOption: { ...fareOption },
    paxCounts: context.paxCounts,
    tripsSource: context.tripsSource,
  };
}
