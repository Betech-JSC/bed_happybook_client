import type { SelectedFlight } from "@/types/selectedFlight";
import {
  fareValueValidationMessage,
  validateFareValueForConfirm,
} from "@/utils/fareValueToken";
import { verifyInternationalSegments } from "@/utils/internationalConfirmPrice";
import { getFlightSearchContext } from "@/utils/selectedFlightStorage";
import { handleSessionStorage } from "@/utils/Helper";

export function verifySelectedFlight(sel: SelectedFlight | null | undefined): string[] {
  const errors: string[] = [];
  if (!sel) {
    errors.push("Selected flight is missing");
    return errors;
  }

  const { trip, fareOption, paxCounts, searchId } = sel;
  const source = String(trip?.source ?? "");
  const tripRecord = trip as Record<string, unknown>;

  if (!searchId) errors.push("searchId is required");

  const ctx = getFlightSearchContext();
  const liveSession =
    ctx?.searchId ??
    (handleSessionStorage("get", "flightSession") as string | null) ??
    "";
  if (liveSession && searchId && liveSession !== searchId) {
    errors.push(
      "Phiên tìm kiếm đã đổi — vui lòng quay lại tìm chuyến và chọn vé mới"
    );
  }

  if (!trip?.source) errors.push("trip.source is required");
  if (!trip?.airline) errors.push("trip.airline is required");

  if (trip?.clientId === undefined && trip?.client_id === undefined) {
    errors.push('trip.clientId is required (VJ may be empty string "")');
  }

  if (!Array.isArray(trip?.segments) || (trip.segments as unknown[]).length === 0) {
    errors.push("trip.segments must be a non-empty array");
  }

  const tripForIntlVerify = {
    ...tripRecord,
    selectedTicketClass:
      (tripRecord.selectedTicketClass as Record<string, unknown> | undefined) ??
      (fareOption as Record<string, unknown> | undefined),
  };
  errors.push(...verifyInternationalSegments(tripForIntlVerify, "Chuyến đã chọn"));

  if (!fareOption) errors.push("fareOption is required");

  const fareCheck = validateFareValueForConfirm(fareOption?.fareValue, source);
  if (!fareCheck.ok) {
    errors.push(fareValueValidationMessage(fareCheck, "vi"));
  }

  const adult = paxCounts?.adult ?? 0;
  if (adult < 1) errors.push("pax_counts.adult must be at least 1");

  const totalPax =
    adult + (paxCounts?.child ?? 0) + (paxCounts?.infant ?? 0);
  if (totalPax < 1) errors.push("At least 1 passenger required");

  return errors;
}

export function verifySelectedFlights(
  selections: SelectedFlight[]
): string[] {
  const errors: string[] = [];
  if (!selections.length) {
    errors.push("No flight selected");
    return errors;
  }
  selections.forEach((sel, index) => {
    const legErrors = verifySelectedFlight(sel);
    legErrors.forEach((msg) =>
      errors.push(`Leg ${index + 1}: ${msg}`)
    );
  });
  return errors;
}
