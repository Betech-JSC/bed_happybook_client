import type {
  FlightBookingOrderStatus,
  FlightBookingStatusData,
  FlightBookFlightOrderInfo,
  FlightBookFlightResponse,
} from "@/types/flightBooking";
import type { ConfirmPriceResponse } from "@/types/flightConfirmPrice";
import { normalizeConfirmPriceResponse } from "@/utils/buildFlightConfirmPricePayload";
import { PRICE_HOLD_STARTED_AT_KEY } from "@/utils/flightHoldExpiry";
import {
  resolveCheckoutFareTotal,
  sumFareFromFlights,
  sumServiceFeeFromFlights,
} from "@/utils/flightCheckoutPricing";

export const BOOKING_STATUS_POLL_INTERVAL_MS = 2500;
export const BOOKING_STATUS_POLL_MAX_MS = 120_000;

export function isBookingDeadlineExpired(
  deadline: string | Date | null | undefined
): boolean {
  if (!deadline) return false;
  if (deadline instanceof Date) {
    return Date.now() > deadline.getTime();
  }

  // Normalize YYYY-MM-DD HH:mm:ss to YYYY-MM-DDTHH:mm:ss for Safari / cross-browser parsing
  let normalized = deadline.trim();
  if (normalized.includes(" ") && !normalized.includes("T")) {
    normalized = normalized.replace(" ", "T");
  }

  const end = new Date(normalized);
  if (Number.isNaN(end.getTime())) return false;
  return Date.now() > end.getTime();
}

export function orderCodeFromConfirm(
  confirm: ConfirmPriceResponse | Record<string, unknown> | null | undefined
): string {
  if (!confirm) return "";
  const normalized = normalizeConfirmPriceResponse(
    confirm as Record<string, unknown>
  );
  return (
    normalized.orderCode ||
    (confirm.order_code as string) ||
    ((confirm.orderInfo as { sku?: string })?.sku ?? "") ||
    (confirm.sku as string) ||
    ""
  );
}

export function shouldPollFlightBookingStatus(
  status: FlightBookingOrderStatus | undefined,
  paymentStarted: boolean
): boolean {
  if (!paymentStarted) return false;
  if (!status) return true;
  // Stop after payment is confirmed or PNR is held — no polling for ticket issuance.
  if (
    status === "held" ||
    status === "paid" ||
    status === "issuing" ||
    status === "issued" ||
    status === "done"
  ) {
    return false;
  }
  return status === "pending_payment";
}

export function isFlightPaymentConfirmed(
  status: FlightBookingOrderStatus | undefined
): boolean {
  return (
    status === "paid" ||
    status === "issuing" ||
    status === "issued" ||
    status === "done" ||
    status === "paid_book_failed"
  );
}

export function isFlightBookingTerminal(
  status: FlightBookingOrderStatus | undefined
): boolean {
  return (
    status === "issued" ||
    status === "done" ||
    status === "paid_book_failed"
  );
}

export function isFlightBookingSuccess(
  status: FlightBookingOrderStatus | undefined
): boolean {
  return status === "issued" || status === "done";
}

export function mergeBookFlightIntoSession(
  existing: Record<string, unknown>,
  bookResponse: FlightBookFlightResponse,
  confirmPrice: ConfirmPriceResponse | null
): Record<string, unknown> {
  const normalized = confirmPrice
    ? normalizeConfirmPriceResponse(confirmPrice as Record<string, unknown>)
    : null;
  const orderInfo: Partial<FlightBookFlightOrderInfo> =
    bookResponse.orderInfo ?? {};
  const existingOrderInfo =
    typeof existing.orderInfo === "object" && existing.orderInfo
      ? (existing.orderInfo as Record<string, unknown>)
      : {};
  const sku =
    orderInfo.sku ||
    normalized?.orderCode ||
    (existingOrderInfo.sku as string) ||
    "";

  const sessionFlights = (existing.flights ?? []) as {
    selectedTicketClass?: { totalServiceFee?: number; totalPrice?: number };
  }[];
  const serviceFee = sumServiceFeeFromFlights(sessionFlights);
  const searchFareTotal = sumFareFromFlights(sessionFlights);
  const checkoutFare = resolveCheckoutFareTotal({
    confirmPrice: confirmPrice ?? undefined,
    summedFromFlights: searchFareTotal,
    serviceFeeFromSearch: serviceFee,
    orderInfoTotal: orderInfo.total_price,
  });

  return {
    ...existing,
    passengers: bookResponse.passengers ?? existing.passengers,
    contact: bookResponse.contact ?? existing.contact,
    status: orderInfo.status ?? "pending_payment",
    orderInfo: {
      ...existingOrderInfo,
      ...orderInfo,
      sku,
      booking_deadline:
        orderInfo.booking_deadline ??
        normalized?.bookingDeadline ??
        (existingOrderInfo.booking_deadline as string | undefined),
      // Giữ giá: chỉ từ confirm-price, book-flight không trả hold_expires_at
      hold_expires_at:
        normalized?.holdExpiresAt ??
        (existingOrderInfo.hold_expires_at as string | undefined),
      total_price:
        orderInfo.total_price ??
        checkoutFare ??
        normalized?.totalPrice ??
        (existingOrderInfo.total_price as number | undefined),
    },
    order_code: sku,
    booking_flight_request_id:
      existing.booking_flight_request_id ?? normalized?.bookingFlightRequestId,
    airdata_booking_id:
      existing.airdata_booking_id ?? normalized?.bookingId,
    confirmPrice: confirmPrice ?? existing.confirmPrice,
  };
}

/** Gắn mốc submit book-flight + hold_expires_at từ confirm-price cho countdown checkout. */
export function attachPriceHoldToBookingSession(
  session: Record<string, unknown>,
  confirmPrice: ConfirmPriceResponse | Record<string, unknown> | null,
  startedAt: string = new Date().toISOString()
): Record<string, unknown> {
  const normalized = confirmPrice
    ? normalizeConfirmPriceResponse(confirmPrice as Record<string, unknown>)
    : null;
  const holdExpiresAt = normalized?.holdExpiresAt ?? null;
  const existingOrderInfo =
    typeof session.orderInfo === "object" && session.orderInfo
      ? (session.orderInfo as Record<string, unknown>)
      : {};

  return {
    ...session,
    [PRICE_HOLD_STARTED_AT_KEY]: startedAt,
    confirmPrice: confirmPrice ?? session.confirmPrice,
    orderInfo: {
      ...existingOrderInfo,
      ...(holdExpiresAt ? { hold_expires_at: holdExpiresAt } : {}),
    },
  };
}

export function parseBookingStatusPayload(
  payload: Record<string, unknown> | null | undefined
): FlightBookingStatusData | null {
  if (!payload) return null;
  const data = (payload.data as FlightBookingStatusData) ?? payload;
  if (!data?.sku && !data?.status) return null;
  return data as FlightBookingStatusData;
}

export function sumBaggageFromPassengers(passengers: unknown[] | undefined): {
  price: number;
  quantity: number;
} {
  const result = { price: 0, quantity: 0 };
  if (!Array.isArray(passengers)) return result;
  for (const p of passengers) {
    const baggages = (p as Record<string, unknown>).baggages;
    if (!Array.isArray(baggages)) continue;
    for (const bag of baggages) {
      if (bag && typeof bag === "object") {
        result.price += Number((bag as Record<string, unknown>).price ?? 0);
        result.quantity += 1;
      }
    }
  }
  return result;
}

/** Giá vé checkout: confirm + phí dịch vụ search khi confirm chưa gồm phí. */
export function resolveAuthoritativeFareTotal(input: {
  confirmPrice?: ConfirmPriceResponse | Record<string, unknown> | null;
  orderInfo?: { total_price?: number } | null;
  summedFromFlights: number;
  serviceFeeFromSearch?: number;
}): number {
  return resolveCheckoutFareTotal({
    confirmPrice: input.confirmPrice,
    summedFromFlights: input.summedFromFlights,
    serviceFeeFromSearch: input.serviceFeeFromSearch,
    orderInfoTotal: input.orderInfo?.total_price,
  });
}

export function resolveBookingDraftFlow(
  flights: { source?: unknown }[],
  flightType: string
): "domestic" | "international" | "1g" {
  if (
    flights.some((f) => String(f.source ?? "").toUpperCase() === "1G")
  ) {
    return "1g";
  }
  if (flightType === "international") return "international";
  return "domestic";
}

export function computeFlightCheckoutGrandTotal(input: {
  fareTotal: number;
  baggagePrice?: number;
  discount?: number;
  onePayFee?: number;
}): number {
  return (
    input.fareTotal +
    (input.baggagePrice ?? 0) -
    (input.discount ?? 0) +
    (input.onePayFee ?? 0)
  );
}

export function getCheckoutTotalsFromBookingFlight(
  bookingFlight: Record<string, unknown>,
  options?: { onePayFee?: number }
): {
  fareTotal: number;
  grandTotal: number;
  baggagePrice: number;
  discount: number;
} {
  const flights = (bookingFlight.flights ?? []) as {
    selectedTicketClass?: { totalPrice?: number; totalServiceFee?: number };
  }[];
  const summedFromFlights = sumFareFromFlights(flights);
  const serviceFee = sumServiceFeeFromFlights(flights);

  const baggage = sumBaggageFromPassengers(
    bookingFlight.passengers as unknown[] | undefined
  );
  const orderInfo = (bookingFlight.orderInfo ?? {}) as {
    total_discount?: number;
  };
  const discount = Number(orderInfo.total_discount ?? 0);
  const fareTotal = resolveAuthoritativeFareTotal({
    confirmPrice: bookingFlight.confirmPrice as ConfirmPriceResponse | undefined,
    orderInfo: bookingFlight.orderInfo as { total_price?: number },
    summedFromFlights,
    serviceFeeFromSearch: serviceFee,
  });
  const grandTotal = computeFlightCheckoutGrandTotal({
    fareTotal,
    baggagePrice: baggage.price,
    discount,
    onePayFee: options?.onePayFee ?? 0,
  });

  return { fareTotal, grandTotal, baggagePrice: baggage.price, discount };
}
