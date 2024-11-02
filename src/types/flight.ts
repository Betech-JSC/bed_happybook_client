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
export interface SearchParamsProps {
  Adt: number;
  Chd: number;
  Inf: number;
  tripType: string | null;
  StartPoint: string | null;
  EndPoint: string | null;
  DepartDate: string | null;
  ReturnDate: string | null;
  Cheapest: string | null;
}

export interface FlightCalendarProps {
  airports: AirportOption[];
  fromOption: AirportOption | null;
  toOption: AirportOption | null;
  flightType: string;
}

export interface ListFilghtProps {
  airports: AirportOption[];
}
export interface SearchFilghtProps {
  airports: AirportOption[];
}

export interface FlightSearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  airports: {
    label: string;
    value: string;
  }[];
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  flightType: string;
}
