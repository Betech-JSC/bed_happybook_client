import type { SelectedFlight } from "@/types/selectedFlight";
import {
  copyVjFareValueForConfirm,
  resolveFareValueFromFareOption,
} from "@/utils/fareValueToken";

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
  const fareOptionsList = trip.fareOptions as Record<string, unknown>[] | undefined;
  const fareOption =
    (trip.selectedTicketClass as Record<string, unknown>) ??
    fareOptionsList?.[0];

  if (!fareOption) return null;

  const { selectedTicketClass: _stc, fareOptions: _fo, ...tripRest } = trip;

  const source = trip.source ?? fareOption.source;
  const selectedFv = (fareOption as { fareValue?: string }).fareValue;
  let fareOptionIndex = 0;
  if (selectedFv && fareOptionsList?.length) {
    const idx = fareOptionsList.findIndex(
      (f) =>
        f.fareValue === selectedFv ||
        copyVjFareValueForConfirm(f) === selectedFv
    );
    if (idx >= 0) fareOptionIndex = idx;
  }

  return {
    searchId: context.searchId,
    resourceId: context.resourceId ?? (trip._resourceId as string | undefined),
    itineraryId: String(
      trip.itineraryId ?? context.itineraryId ?? (trip.flightLeg === 1 ? "2" : "1")
    ),
    fareOptionIndex,
    trip: tripRest,
    fareOption: {
      ...fareOption,
      fareValue: resolveFareValueFromFareOption(source, fareOption),
    },
    paxCounts: context.paxCounts,
    tripsSource: context.tripsSource,
  };
}
