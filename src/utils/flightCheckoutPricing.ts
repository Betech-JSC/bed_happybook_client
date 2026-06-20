import type { ConfirmPriceResponse } from "@/types/flightConfirmPrice";
import { normalizeConfirmPriceResponse } from "@/utils/buildFlightConfirmPricePayload";

type FlightWithTicketClass = {
  selectedTicketClass?: { totalServiceFee?: number; totalPrice?: number };
};

/** Tổng phí dịch vụ từ search (totalServiceFee trên fare option). */
export function sumServiceFeeFromFlights(
  flights?: FlightWithTicketClass[] | null
): number {
  if (!flights?.length) return 0;
  return flights.reduce(
    (sum, flight) =>
      sum + Number(flight.selectedTicketClass?.totalServiceFee ?? 0),
    0
  );
}

export function sumFareFromFlights(
  flights?: FlightWithTicketClass[] | null
): number {
  if (!flights?.length) return 0;
  return flights.reduce(
    (sum, flight) =>
      sum + Number(flight.selectedTicketClass?.totalPrice ?? 0),
    0
  );
}

/**
 * Giá vé checkout: confirm-price + phí dịch vụ search khi API confirm chưa gồm phí.
 * Khớp tổng với `summedFromFlights` (totalPrice từ search, đã gồm totalServiceFee).
 */
export function resolveCheckoutFareTotal(input: {
  confirmPrice?: ConfirmPriceResponse | Record<string, unknown> | null;
  summedFromFlights: number;
  serviceFeeFromSearch?: number;
  orderInfoTotal?: number | null;
}): number {
  const serviceFee = input.serviceFeeFromSearch ?? 0;
  const searchTotal = input.summedFromFlights;

  let confirmTotal: number | null = null;
  if (input.confirmPrice) {
    confirmTotal = normalizeConfirmPriceResponse(
      input.confirmPrice as Record<string, unknown>
    ).totalPrice;
  }

  if (confirmTotal != null && !Number.isNaN(confirmTotal)) {
    if (serviceFee > 0) {
      const withService = confirmTotal + serviceFee;
      if (
        Math.abs(withService - searchTotal) <= 1000 ||
        confirmTotal < searchTotal - 500
      ) {
        return withService;
      }
    }
    return confirmTotal;
  }

  if (
    input.orderInfoTotal != null &&
    !Number.isNaN(Number(input.orderInfoTotal))
  ) {
    return Number(input.orderInfoTotal);
  }

  return searchTotal;
}
