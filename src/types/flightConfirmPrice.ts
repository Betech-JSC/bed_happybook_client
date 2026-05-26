export type FlightTripType = "OW" | "RT";
export type ConfirmPaxType = "ADULT" | "CHILD" | "INFANT";

export interface ConfirmPriceAirlineContact {
  phoneNumber: string;
  email: string;
}

/** Airdata PaxDocuments[] entry (Postman). */
export interface AirdataPaxDocument {
  paxId: string;
  docType: "P" | "C";
  number: string;
  nationality?: string;
  isCountry?: string;
  endDate?: string;
  gender?: "MALE" | "FEMALE";
  birthday?: string;
  residence?: string;
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
  passport?: string;
  nationality?: string;
  passport_country?: string;
  passport_expiry_date?: string | Date;
  /** Ngày cấp hộ chiếu → Airdata PaxDocuments.residence (YYYY-MM-DD). */
  passport_issue_date?: string | Date;
  cccd?: string;
  cccd_date?: string | Date;
}

export interface ConfirmPricePaxApiItem {
  paxId: string;
  paxType: ConfirmPaxType;
  firstName: string;
  lastName: string;
  title: string;
  birthday?: string;
  PaxDocuments: AirdataPaxDocument[];
  /** Only when an infant is linked to this adult (form-built, not from search API). */
  childPaxId?: string;
  /** VJ / Postman: infant → adult that carries the infant. */
  parentPaxId?: string;
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
  /** Omit when search trip has no clientId; send "" when search returns empty. */
  clientId?: string;
  /** 1G Postman placeholder — không lấy từ API search. */
  bookingKey?: string;
  itineraryId: string;
  fareBreakdowns: ConfirmPriceFareBreakdown[];
  segments: unknown[];
  paxssr?: unknown[];
  paxSeat?: unknown[];
}

/** BE FlightConfirmPriceRequest::airdataPayload — 1G selection passthrough. */
export interface ConfirmPriceSelectionBlock {
  trip: Record<string, unknown>;
  fare_option: Record<string, unknown>;
  pax_counts: { adult: number; child: number; infant: number };
  pax_lists: ConfirmPricePaxApiItem[];
}

export interface ConfirmPriceContact {
  full_name: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

export interface ConfirmPriceRequest {
  type: string;
  flightType: FlightTripType;
  splitItineraries: boolean;
  airlineContact: ConfirmPriceAirlineContact;
  paxLists: ConfirmPricePaxApiItem[];
  itineraries: ConfirmPriceItinerary[];
  /** 1G: BE build itineraries từ trip + fare_option search. */
  selection?: ConfirmPriceSelectionBlock;
  contact?: ConfirmPriceContact;
  booking_flight_request_id?: number | null;
  trip?: string | null;
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
  hold_expires_at?: string;
  holdExpiresAt?: string;
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
