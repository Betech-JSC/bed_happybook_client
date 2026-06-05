import type { SelectedFlight } from "@/types/selectedFlight";
import {
  copyVjFareValueForConfirm,
  isVietJetSource,
  repairFareOptionFromTrip,
  resolveFareValueFromFareOption,
} from "@/utils/fareValueToken";
import { resolveSelectedItineraryId } from "@/utils/confirmPriceIdentifiers";
import { is1GSource } from "@/utils/internationalFlightSelection";
import { normalizeVjSelectedFlight } from "@/utils/vjSegmentToken";

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
  } else if (fareOptionsList?.length) {
    const stc = fareOption as Record<string, unknown>;
    const idx = fareOptionsList.findIndex(
      (f) =>
        f.bookingClass === stc.bookingClass &&
        f.fareBasisCode === stc.fareBasisCode &&
        (f.groupClass === stc.groupClass || f.fareType === stc.fareType)
    );
    if (idx >= 0) fareOptionIndex = idx;
  }

  const repairedFare = repairFareOptionFromTrip(fareOption, {
    fareOptionIndex,
    trip,
    source,
  });

  let fareValue = resolveFareValueFromFareOption(source, repairedFare, trip);
  if (!fareValue && is1GSource(source)) {
    fareValue = String(trip.hpb_id ?? fareOption.hpb_id ?? "").trim();
  }

  const selection: SelectedFlight = {
    searchId: context.searchId,
    resourceId: context.resourceId ?? (trip._resourceId as string | undefined),
    itineraryId:
      context.itineraryId && context.itineraryId !== "1" && context.itineraryId !== "2"
        ? context.itineraryId
        : resolveSelectedItineraryId(trip),
    fareOptionIndex,
    trip: tripRest,
    fareOption: {
      ...repairedFare,
      fareValue,
    },
    paxCounts: context.paxCounts,
    tripsSource: context.tripsSource,
  };

  if (isVietJetSource(source)) {
    return normalizeVjSelectedFlight(selection, trip);
  }

  return selection;
}
