import type {
  PaxCounts,
  SelectedFlight,
  TripsSource,
} from "@/types/selectedFlight";
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
    fareValue:
      typeof sourceFare.fareValue === "string"
        ? sourceFare.fareValue.trim()
        : sourceFare.fareValue,
  };
  const normalizedTrip = normalizeFlightTrip({
    ...trip,
    selectedTicketClass: fareOption,
  });

  const itineraryId = String(
    trip.itineraryId ?? (trip.flightLeg === 1 ? "2" : "1")
  );

  const tripBody = { ...normalizedTrip } as Record<string, unknown>;
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
