import type {
  PaxCounts,
  SelectedFlight,
  TripsSource,
} from "@/types/selectedFlight";
import { normalizeFlightTrip } from "@/utils/normalizeFlightTrip";
import {
  isVietJetSource,
  repairFareOptionFromTrip,
} from "@/utils/fareValueToken";
import { resolveSelectedItineraryId } from "@/utils/confirmPriceIdentifiers";
import { mergeVjSegmentsFromSearchFlight } from "@/utils/vjSegmentToken";

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
  const tripSource = trip.source ?? sourceFare.source;

  const fareOption = repairFareOptionFromTrip(sourceFare, {
    fareOptionIndex,
    trip,
    source: tripSource,
  });

  const normalizedTrip = normalizeFlightTrip({
    ...trip,
    selectedTicketClass: fareOption,
  });

  const itineraryId = resolveSelectedItineraryId(trip);

  const tripBody = { ...normalizedTrip } as Record<string, unknown>;
  delete tripBody.selectedTicketClass;
  delete tripBody.fareOptions;
  tripBody.source = tripSource;
  fareOption.source = tripSource;

  if (isVietJetSource(tripSource) && Array.isArray(tripBody.segments)) {
    tripBody.segments = mergeVjSegmentsFromSearchFlight(tripBody, trip);
  }

  return {
    searchId: options.searchId,
    resourceId: options.resourceId ?? (trip._resourceId as string | undefined),
    itineraryId,
    fareOptionIndex,
    trip: tripBody,
    fareOption,
    paxCounts: options.paxCounts,
    tripsSource: options.tripsSource,
  };
}
