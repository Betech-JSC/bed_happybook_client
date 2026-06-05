import type { SelectedFlight } from "@/types/selectedFlight";
import {
  fareValueValidationMessage,
  isVietJetSource,
  isVietnamAirlinesSource,
  resolveFareValueFromFareOption,
  validateFareValueForConfirm,
} from "@/utils/fareValueToken";
import { resolveVn1aFareValueFromSearch } from "@/utils/vn1aConfirmPrice";
import { isVuSource, resolveVuFareValueFromSearch } from "@/utils/vuConfirmPrice";
import { assertVjTripHasSegmentTokens } from "@/utils/vjSegmentToken";
import { is1GSource } from "@/utils/internationalFlightSelection";
import { getFlightSearchContext } from "@/utils/selectedFlightStorage";
import { handleSessionStorage } from "@/utils/Helper";

export function verifySelectedFlight(sel: SelectedFlight | null | undefined): string[] {
  const errors: string[] = [];
  if (!sel) {
    errors.push("Selected flight is missing");
    return errors;
  }

  const { trip, fareOption, paxCounts, searchId } = sel;
  const source = String(trip?.source ?? fareOption?.source ?? "");

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

  const is1G = is1GSource(source);
  if (
    !is1G &&
    trip?.clientId === undefined &&
    trip?.client_id === undefined
  ) {
    errors.push('trip.clientId is required (VJ may be empty string "")');
  }

  if (!is1G) {
    if (
      !Array.isArray(trip?.segments) ||
      (trip.segments as unknown[]).length === 0
    ) {
      errors.push("trip.segments must be a non-empty array");
    } else if (isVietJetSource(source)) {
      try {
        assertVjTripHasSegmentTokens(trip as Record<string, unknown>);
      } catch {
        errors.push(
          "Thiếu mã chặng bay từ kết quả tìm kiếm — vui lòng chọn lại chuyến và hạng vé"
        );
      }
    }
  } else {
    const picked = trip?._selectedJourneyFlights as Record<string, unknown> | undefined;
    const journeys = trip?.journeys;
    const hasPicked = picked && Object.keys(picked).length > 0;
    const hasJourneys =
      Array.isArray(journeys) && journeys.some((j) => Array.isArray(j) && j.length > 0);
    const hasSegments =
      Array.isArray(trip?.segments) && (trip.segments as unknown[]).length > 0;
    if (!hasPicked && !hasJourneys && !hasSegments) {
      errors.push("1G trip must include journeys or selected flights");
    }
  }

  if (!fareOption) errors.push("fareOption is required");

  if (isVietnamAirlinesSource(source) || isVuSource(source)) {
    const tripRecord = trip as Record<string, unknown> | undefined;
    const fareRecord = fareOption as Record<string, unknown>;
    const fareValue = isVuSource(source)
      ? resolveVuFareValueFromSearch(fareRecord, tripRecord)
      : resolveVn1aFareValueFromSearch(fareRecord, tripRecord) ||
        resolveFareValueFromFareOption(source, fareRecord, tripRecord);
    const validation = validateFareValueForConfirm(fareValue, { source });
    if (!validation.ok) {
      errors.push(fareValueValidationMessage(validation));
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
