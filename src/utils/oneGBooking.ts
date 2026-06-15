import type { SelectedFlight } from "@/types/selectedFlight";
import { is1GSource } from "@/utils/internationalFlightSelection";
import { loadSelectedFlightsForBooking } from "@/utils/selectedFlightStorage";

export {
  is1GSource,
  build1GFareOptionFromPackage,
  collectSegmentsFromJourneys,
} from "@/utils/internationalFlightSelection";
export {
  build1GConfirmPriceSelectionPayload,
  merge1GSelectionsForConfirm,
  is1GConfirmSelection,
} from "@/utils/oneGConfirmPrice";

/** @deprecated Dùng loadSelectedFlightsForBooking sau persistInternationalCheckoutSelections. */
export function load1GFlightsAsSelections(): SelectedFlight[] {
  return loadSelectedFlightsForBooking().filter((sel) =>
    is1GSource(sel.trip?.source ?? sel.fareOption?.source)
  );
}
