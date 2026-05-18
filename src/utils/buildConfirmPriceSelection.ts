import type { ConfirmPricePaxListItem } from "@/types/flightConfirmPrice";
import type { SelectedFlight } from "@/types/selectedFlight";
import { buildFlightConfirmPricePayloadFromSelections } from "@/utils/buildFlightConfirmPricePayload";

export type ConfirmPriceSelectionContact = {
  full_name?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
};

/**
 * Cách 1 — Full body confirm-price (OW / RT).
 * POST /api/v1/flights-v2/confirm-price
 */
export function buildConfirmPriceSelectionRequest(input: {
  selections: SelectedFlight[];
  contact: ConfirmPriceSelectionContact;
  passengers: ConfirmPricePaxListItem[];
  tripKind?: "one_way" | "round_trip";
  bookingFlightRequestId?: number | null;
}): Record<string, unknown> {
  return buildFlightConfirmPricePayloadFromSelections({
    selections: input.selections,
    passengers: input.passengers,
    contact: input.contact,
    bookingFlightRequestId: input.bookingFlightRequestId,
  }) as unknown as Record<string, unknown>;
}

