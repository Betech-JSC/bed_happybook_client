import type { SelectedFlight } from "@/types/selectedFlight";

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
