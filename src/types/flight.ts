export interface PassengerType {
  type: string;
  title: string;
  quantity: number;
  price: number;
  totalPrice: number;
  currency: string;
}

export interface AirportOption {
  city: string;
  code: string;
  type: string;
}
export interface AirportsCountry {
  id: number;
  country: string;
  airports: AirportOption[];
}
export interface AirportPopupSelectorProps {
  handleLocationChange: (locations: {
    from: string | null;
    to: string | null;
  }) => void;
  initialFrom: string | null;
  initialTo: string | null;
  airportsData: AirportsCountry[];
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
  airports: AirportsCountry[];
  fromOption: AirportOption | undefined;
  toOption: AirportOption | undefined;
  flightType: string;
}

export interface ListFilghtProps {
  airportsData: AirportsCountry[];
}
export interface SearchFilghtProps {
  airportsData: AirportsCountry[];
}

export interface FlightDetailProps {
  session: string;
  FareData: any;
  onSelectFlight: (fligt: any) => void;
  selectedFlight: any;
  filters: {
    priceWithoutTax: string;
    timeDepart: string;
    sortAirLine: string;
    sortPrice: string;
    airlines: string[];
  };
  airports: AirportsCountry[];
  displayType: string;
}
export interface FlightSearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  airportsData: AirportsCountry[];
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  fromOption: AirportOption | undefined;
  toOption: AirportOption | undefined;
  flightType: string;
}

export interface BookingDetailProps {
  airports: AirportsCountry[];
}
