/** DB / API order status for domestic flight booking (post confirm-price). */
export type FlightBookingOrderStatus =
  | "price_confirmed"
  | "pending_payment"
  | "held"
  | "holding"
  | "paid"
  | "issuing"
  | "issued"
  | "done"
  | "paid_book_failed";

export interface FlightBookingStatusData {
  sku: string;
  status: FlightBookingOrderStatus;
  pnr_number?: string | null;
  airdata_booking_id?: string | null;
  airdata_booking_status?: string | null;
  booking_deadline?: string | null;
  price_confirmed_at?: string | null;
  paid_at?: string | null;
  issued_at?: string | null;
}

export interface FlightBookFlightOrderInfo {
  id?: number;
  sku: string;
  status?: FlightBookingOrderStatus;
  total_price?: number;
  booking_deadline?: string;
  hold_expires_at?: string;
  pnr_number?: string;
  total_discount?: number;
}

export interface FlightBookFlightResponse {
  passengers?: unknown[];
  contact?: unknown;
  orderInfo?: FlightBookFlightOrderInfo;
}
