import type {
  FlightBookingOrderStatus,
  FlightBookingStatusData,
  FlightBookFlightOrderInfo,
  FlightBookFlightResponse,
} from "@/types/flightBooking";
import type { ConfirmPriceResponse } from "@/types/flightConfirmPrice";
import { normalizeConfirmPriceResponse } from "@/utils/buildFlightConfirmPricePayload";

export const BOOKING_STATUS_POLL_INTERVAL_MS = 2500;
export const BOOKING_STATUS_POLL_MAX_MS = 120_000;

export function isBookingDeadlineExpired(
  deadline: string | Date | null | undefined
): boolean {
  if (!deadline) return false;
  const end = deadline instanceof Date ? deadline : new Date(deadline);
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
  if (status === "held" || status === "paid" || status === "issuing" || status === "issued") {
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
    status === "paid_book_failed"
  );
}

export function isFlightBookingTerminal(
  status: FlightBookingOrderStatus | undefined
): boolean {
  return status === "issued" || status === "paid_book_failed";
}

export function isFlightBookingSuccess(
  status: FlightBookingOrderStatus | undefined
): boolean {
  return status === "issued";
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
      hold_expires_at:
        (orderInfo as Record<string, unknown>).hold_expires_at ??
        normalized?.holdExpiresAt ??
        (existingOrderInfo.hold_expires_at as string | undefined),
      total_price:
        orderInfo.total_price ??
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

/** Giá vé từ confirm-price / order (ưu tiên), không dùng tổng cộng từ fare search cũ. */
export function resolveAuthoritativeFareTotal(input: {
  confirmPrice?: ConfirmPriceResponse | Record<string, unknown> | null;
  orderInfo?: { total_price?: number } | null;
  summedFromFlights: number;
}): number {
  if (input.confirmPrice) {
    const fromConfirm = normalizeConfirmPriceResponse(
      input.confirmPrice as Record<string, unknown>
    ).totalPrice;
    if (fromConfirm != null && !Number.isNaN(fromConfirm)) {
      return fromConfirm;
    }
  }
  const fromOrder = input.orderInfo?.total_price;
  if (fromOrder != null && !Number.isNaN(fromOrder)) {
    return fromOrder;
  }
  return input.summedFromFlights;
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
  let summedFromFlights = 0;
  const flights = (bookingFlight.flights ?? []) as {
    selectedTicketClass?: { totalPrice?: number };
  }[];
  for (const flight of flights) {
    summedFromFlights += Number(flight.selectedTicketClass?.totalPrice ?? 0);
  }

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
  });
  const grandTotal = computeFlightCheckoutGrandTotal({
    fareTotal,
    baggagePrice: baggage.price,
    discount,
    onePayFee: options?.onePayFee ?? 0,
  });

  return { fareTotal, grandTotal, baggagePrice: baggage.price, discount };
}
