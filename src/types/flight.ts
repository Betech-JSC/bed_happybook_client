export interface PassengerType {
  type: string;
  title: string;
  quantity: number;
  price: number;
  totalPrice: number;
  currency: string;
}
export interface AirportOption {
  label: string;
  value: string;
}

export interface FormData {
  from: string | null;
  to: string | null;
  departureDate: Date | null;
  returnDate: Date | null;
  Adt: number;
  Chd: number;
  Inf: number;
  tripType: string;
  cheapest: number;
  fromPlace: string | null;
  toPlace: string | null;
}
