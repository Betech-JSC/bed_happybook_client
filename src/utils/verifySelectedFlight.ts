import type { SelectedFlight } from "@/types/selectedFlight";
import { resolveBookingKey } from "@/utils/mapSegmentForConfirm";

/** Base64 JSON → bookingKey; 9G token; hoặc bookingKey thuần (không bọc eyJ). */
export function decodeBookingKey(fareValue: string): string {
  return resolveBookingKey(fareValue);
}

export function verifySelectedFlight(sel: SelectedFlight | null | undefined): string[] {
  const errors: string[] = [];
  if (!sel) {
    errors.push("Selected flight is missing");
    return errors;
  }

  const { trip, fareOption, paxCounts, searchId } = sel;

  if (!searchId) errors.push("searchId is required");
  if (!trip?.source) errors.push("trip.source is required");
  if (!trip?.airline) errors.push("trip.airline is required");

  if (trip?.clientId === undefined || trip?.clientId === null) {
    errors.push('trip.clientId is required (VJ may be empty string "")');
  }

  if (!Array.isArray(trip?.segments) || (trip.segments as unknown[]).length === 0) {
    errors.push("trip.segments must be a non-empty array");
  }

  if (!fareOption) errors.push("fareOption is required");

  const fareValue =
    typeof fareOption?.fareValue === "string" ? fareOption.fareValue : "";
  if (!fareValue) {
    errors.push("fareOption.fareValue is required");
  } else {
    const source = String(trip?.source ?? "").toUpperCase();
    const needsDecodedBookingKey =
      source === "VJ" || source.includes("VIETJET");
    if (needsDecodedBookingKey && !decodeBookingKey(fareValue)) {
      errors.push("bookingKey is empty — decode fareOption.fareValue failed");
    }
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

