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
  handleLocationPlaceChange: (locations: {
    fromPlace: string | null;
    toPlace: string | null;
  }) => void;
  initialFrom: string | null;
  initialFromPlace: string | null;
  initialToPlace: string | null;
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
  from: string | null;
  to: string | null;
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

export interface TabDays {
  label: string;
  date: Date;
  disabled: boolean;
}

export interface filtersFlight {
  priceWithoutTax: string;
  timeDepart: string;
  sortAirLine: string;
  sortPrice: string;
  airlines: string[];
}

export interface filtersFlightDomestic {
  priceWithoutTax: string;
  timeDepart: string;
  sortAirLine: string;
  sortPrice: string;
  airlines: string[];
  stopNum: string[];
}
export interface ListFlight {
  airportsData: AirportsCountry[];
  flightSession: string;
  flights: any;
  from: string | null;
  to: string | null;
  returnDate: any;
  departDate: any;
  currentDate: any;
  currentReturnDay: any;
  departDays: TabDays[];
  returnDays: TabDays[];
  displayType: string;
  isRoundTrip: boolean;
  totalFlightLeg: number[];
  totalPassengers: number;
  handleClickDate: (date: Date, TypeIndex: number) => void;
  flightType?: string;
  flightStopNum?: number[];
  translatedStaticText: any;
}
export interface FlightDetailPopupProps {
  isOpen: boolean;
  tabs?: {
    id: number;
    name: string;
  }[];
  airports: AirportsCountry[];
  flights: any;
  onClose: () => void;
  translatedStaticText: any;
}

export interface FlightDetailInternationalProps {
  FareData: any;
  filters: {
    priceWithoutTax: string;
    timeDepart: string;
    sortAirLine: string;
    sortPrice: string;
    airlines: string[];
  };
  onSelectFlight: (flight: any) => void;
  setFlightDetail: (FareData: any, indexFlight: number) => void;
  leg: number;
  translatedStaticText: any;
}

export interface FlightDetailDomesticProps {
  FareData: any;
  filters: {
    priceWithoutTax: string;
    timeDepart: string;
    sortAirLine: string;
    sortPrice: string;
    airlines: string[];
  };
  selectedFlight: any;
  totalPassengers: number;
  onSelectFlight: (flight: any) => void;
  setFlightDetail: (
    flight: any,
    tabs: {
      id: number;
      name: string;
    }[],
    showRuleTicket?: boolean
  ) => void;
  translatedStaticText: any;
}
