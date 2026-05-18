import { FlightApi } from "@/api/Flight";
import { handleSessionStorage } from "@/utils/Helper";
import {
  getCheckoutTotalsFromBookingFlight,
  isBookingDeadlineExpired,
} from "@/utils/flightBookingFlow";
import {
  buildFlightConfirmPricePayloadFromSelections,
  normalizeConfirmPriceResponse,
} from "@/utils/buildFlightConfirmPricePayload";
import type { ConfirmPricePaxListItem } from "@/types/flightConfirmPrice";
import type { ConfirmPriceResponse } from "@/types/flightConfirmPrice";
import type { SelectedFlight, TripsSource } from "@/types/selectedFlight";
import { getFlightSearchContext } from "@/utils/selectedFlightStorage";
import { updateFlightDraftMeta } from "@/utils/flightDraftSession";

export interface RefreshConfirmPriceResult {
  confirm: ConfirmPriceResponse;
  /** Giá vé từ confirm-price (chưa cộng hành lý / trừ voucher). */
  fareTotal: number | null;
  /** Tổng thanh toán khớp công thức trang checkout. */
  grandTotal: number;
  orderCode: string;
}

function passengersFromBooking(
  passengers: unknown[] | undefined
): ConfirmPricePaxListItem[] {
  if (!Array.isArray(passengers)) return [];
  return passengers.map((p, index) => {
    const row = p as Record<string, unknown>;
    return {
      index,
      type: String(row.type ?? "ADT"),
      firstName: String(row.first_name ?? ""),
      lastName: String(row.last_name ?? ""),
      gender: row.gender === true,
      birthday: String(row.birthday ?? ""),
      baggages: Array.isArray(row.baggages) ? row.baggages : undefined,
    };
  });
}

function contactFromBooking(contact: unknown) {
  const c = (contact ?? {}) as Record<string, unknown>;
  return {
    full_name: String(c.full_name ?? ""),
    gender: c.gender === true ? "male" : "female",
    phone: String(c.phone ?? ""),
    email: String(c.email ?? ""),
    address: String(c.address ?? ""),
  };
}

function paxCountsFromPassengers(passengers: unknown[] | undefined) {
  let adult = 0;
  let child = 0;
  let infant = 0;
  if (Array.isArray(passengers)) {
    for (const p of passengers) {
      const type = String((p as Record<string, unknown>).type ?? "ADT");
      if (type === "CHD") child += 1;
      else if (type === "INF") infant += 1;
      else adult += 1;
    }
  }
  return { adult: adult || 1, child, infant };
}

function selectionsFromBookingFlight(
  bookingFlight: Record<string, unknown>
): SelectedFlight[] {
  const flights = (bookingFlight.flights ?? []) as Record<string, unknown>[];
  const searchId =
    (handleSessionStorage("get", "flightSession") as string | null) ?? "";
  const paxCounts = paxCountsFromPassengers(
    bookingFlight.passengers as unknown[] | undefined
  );
  const tripsSource: TripsSource =
    getFlightSearchContext()?.tripsSource ?? "resource";

  const selections: SelectedFlight[] = [];
  flights.forEach((trip, index) => {
    const fareOption =
      (trip.selectedTicketClass as Record<string, unknown>) ??
      ((trip.fareOptions as Record<string, unknown>[])?.[0] as
        | Record<string, unknown>
        | undefined);
    if (!fareOption) return;

    selections.push({
      searchId,
      trip,
      fareOption: { ...fareOption },
      itineraryId: String(trip.itineraryId ?? index + 1),
      paxCounts,
      tripsSource,
    });
  });
  return selections;
}

function buildConfirmPricePayload(
  bookingFlight: Record<string, unknown>,
  draft: Record<string, unknown> | null
): Record<string, unknown> | null {
  const storedRequest = bookingFlight.confirmPriceRequest as
    | Record<string, unknown>
    | undefined;
  const flightSession =
    (handleSessionStorage("get", "flightSession") as string | null) ?? null;

  if (storedRequest && typeof storedRequest === "object") {
    return {
      ...storedRequest,
      ...(flightSession ? { session: flightSession } : {}),
    };
  }

  const selections = selectionsFromBookingFlight(bookingFlight);
  if (!selections.length) return null;

  const passengers = passengersFromBooking(
    (draft?.passengers ?? bookingFlight.passengers) as unknown[] | undefined
  );
  const contact = contactFromBooking(draft?.contact ?? bookingFlight.contact);

  const requestId =
    bookingFlight.booking_flight_request_id ??
    (bookingFlight.confirmPrice as ConfirmPriceResponse | undefined)
      ?.booking_flight_request_id;

  const payload = buildFlightConfirmPricePayloadFromSelections({
    selections,
    passengers,
    contact,
    bookingFlightRequestId:
      typeof requestId === "number" ? requestId : undefined,
  }) as unknown as Record<string, unknown>;

  return payload;
}

function applyConfirmToBookingSession(
  bookingFlight: Record<string, unknown>,
  confirm: ConfirmPriceResponse,
  request: Record<string, unknown>
): Record<string, unknown> {
  const normalized = normalizeConfirmPriceResponse(
    confirm as Record<string, unknown>
  );
  const orderInfo =
    typeof bookingFlight.orderInfo === "object" && bookingFlight.orderInfo
      ? (bookingFlight.orderInfo as Record<string, unknown>)
      : {};

  const updated: Record<string, unknown> = {
    ...bookingFlight,
    confirmPrice: confirm,
    confirmPriceRequest: request,
    booking_flight_request_id:
      normalized.bookingFlightRequestId ??
      bookingFlight.booking_flight_request_id,
    orderInfo: {
      ...orderInfo,
      sku: orderInfo.sku ?? normalized.orderCode,
      booking_deadline:
        normalized.bookingDeadline ??
        (orderInfo.booking_deadline as string | undefined),
      total_price:
        normalized.totalPrice ??
        (orderInfo.total_price as number | undefined),
    },
  };

  handleSessionStorage("save", "bookingFlight", updated);
  updateFlightDraftMeta({
    bookingDeadline: normalized.bookingDeadline,
    orderCode: normalized.orderCode || (orderInfo.sku as string | undefined),
  });

  return updated;
}

/** Gọi confirm-price với dữ liệu đơn đang chờ thanh toán; cập nhật bookingFlight trong session. */
export async function refreshConfirmPriceFromBookingSession(): Promise<RefreshConfirmPriceResult | null> {
  const bookingFlight = handleSessionStorage("get", "bookingFlight") as
    | Record<string, unknown>
    | null;
  if (!bookingFlight?.orderInfo && !bookingFlight?.flights) {
    return null;
  }

  const orderInfo = (bookingFlight.orderInfo ?? {}) as Record<string, unknown>;
  const deadline =
    (orderInfo.booking_deadline as string | undefined) ??
    (bookingFlight.confirmPrice as ConfirmPriceResponse | undefined)
      ?.booking_deadline;

  if (deadline && isBookingDeadlineExpired(deadline)) {
    return null;
  }

  const draft = handleSessionStorage("get", "flightBookingDraft") as
    | Record<string, unknown>
    | null;
  const payload = buildConfirmPricePayload(bookingFlight, draft);
  if (!payload) return null;

  const respon = await FlightApi.confirmPrice(payload);
  if (respon?.status !== 200) {
    return null;
  }

  const confirm =
    (respon?.payload?.data as ConfirmPriceResponse) ?? respon?.payload;
  const normalized = normalizeConfirmPriceResponse(
    confirm as Record<string, unknown>
  );

  const updated = applyConfirmToBookingSession(
    bookingFlight,
    confirm as ConfirmPriceResponse,
    payload
  );

  const checkout = getCheckoutTotalsFromBookingFlight(updated);

  return {
    confirm: confirm as ConfirmPriceResponse,
    fareTotal: checkout.fareTotal,
    grandTotal: checkout.grandTotal,
    orderCode:
      normalized.orderCode || String(orderInfo.sku ?? bookingFlight.order_code ?? ""),
  };
}
