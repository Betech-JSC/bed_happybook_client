import type { SelectedFlight } from "@/types/selectedFlight";
import {
  cloneSegmentsFromSearch,
  isInternationalConfirmTrip,
  pickFirstBookingClassId,
  resolveItineraryIdFromTrip,
} from "@/utils/internationalConfirmPrice";

/** Sửa selection quốc tế khi load (itineraryId p0, segment token từ API). */
export function healInternationalSelection(sel: SelectedFlight): SelectedFlight {
  const trip = sel.trip as Record<string, unknown>;
  if (!isInternationalConfirmTrip(trip)) {
    return sel;
  }

  const legIndex = trip.selectedJourneyLeg as number | undefined;
  const itineraryId =
    resolveItineraryIdFromTrip(trip, {
      tripsSource: sel.tripsSource,
      allowLegFallback: true,
      legIndex,
    }) || sel.itineraryId;

  const fareRow = sel.fareOption as Record<string, unknown> | undefined;
  const journeyBci = pickFirstBookingClassId(trip, fareRow);
  const segments = cloneSegmentsFromSearch(trip.segments, {
    bookingClassId: journeyBci,
  });

  return {
    ...sel,
    itineraryId,
    trip: {
      ...trip,
      itineraryId,
      segments,
      selectedTicketClass: fareRow ?? trip.selectedTicketClass,
    },
  };
}
