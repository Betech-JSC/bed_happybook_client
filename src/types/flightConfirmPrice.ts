export type FlightTripType = "OW" | "RT";
export type ConfirmPaxType = "ADULT" | "CHILD" | "INFANT";

export interface ConfirmPriceAirlineContact {
  phoneNumber: string;
  email: string;
}

/** Internal shape from booking form (before mapping to API paxLists). */
export interface ConfirmPricePaxListItem {
  index?: number;
  type: string;
  firstName?: string;
  lastName?: string;
  gender?: boolean;
  birthday?: string;
  baggages?: unknown[];
}

export interface ConfirmPricePaxApiItem {
  paxId: string;
  paxType: ConfirmPaxType;
  firstName: string;
  lastName: string;
  title: string;
  PaxDocuments: unknown[];
  /** Only when an infant is linked to this adult (form-built, not from search API). */
  childPaxId?: string;
}

export interface ConfirmPriceFareBreakdown {
  paxType: ConfirmPaxType;
  netFare: number;
  discountAmount: number;
  discountAmountParent: number;
  tax: number;
  total: number;
  fareValue: string;
}

export interface ConfirmPriceItinerary {
  domestic: boolean;
  source: string;
  airline: string;
  clientId: string;
  bookingKey: string;
  itineraryId: string;
  fareBreakdowns: ConfirmPriceFareBreakdown[];
  segments: unknown[];
  paxssr?: unknown[];
  paxSeat?: unknown[];
}

export interface ConfirmPriceRequest {
  type: string;
  flightType: FlightTripType;
  airlineContact: ConfirmPriceAirlineContact;
  paxLists: ConfirmPricePaxApiItem[];
  itineraries: ConfirmPriceItinerary[];
  splitItineraries: boolean;
  session?: string | null;
}

export interface ConfirmPriceBreakdown {
  total_price?: number;
  total_tax?: number;
  total_price_net?: number;
  total_fee_service?: number;
  currency?: string;
}

export interface ConfirmPricePricing {
  total_net?: number;
  total_tax?: number;
  total?: number;
  pax_breakdown?: unknown[];
}

export interface ConfirmPriceResponse {
  bookingId?: string;
  booking_id?: string;
  airdata_booking_id?: string;
  booking_flight_request_id?: number;
  booking_deadline?: string;
  bookingDeadline?: string;
  price_confirmed_at?: string;
  status?: string;
  total_price?: number;
  total_tax?: number;
  total_price_net?: number;
  total_fee_service?: number;
  price_breakdown?: ConfirmPriceBreakdown;
  pricing?: ConfirmPricePricing;
  order_code?: string;
  sku?: string;
  airdata?: unknown;
  orderInfo?: {
    sku?: string;
    booking_deadline?: string;
    total_price?: number;
    total_discount?: number;
  };
  [key: string]: unknown;
}

export interface FlightBookingDraft {
  passengers: unknown[];
  contact: unknown;
  fare_data: unknown[];
  flightType: string;
  trip: string;
  totalBaggages: { price: number; quantity: number };
  voucher_program_ids?: number[];
  is_invoice?: boolean;
  invoice?: unknown;
}
