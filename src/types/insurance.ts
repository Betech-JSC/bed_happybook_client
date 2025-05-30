export interface SearchForm {
  departurePlace: string;
  destinationPlace: string;
  departureDate: Date | null;
  returnDate: Date | null;
  guests: number;
  type: string;
}
export interface SearchProps {
  searchParams: {
    departurePlace: string | null;
    destinationPlace: string | null;
    departDate: string | null;
    returnDate: string | null;
    guests: string | null;
    type: string | null;
  };
}

export interface Location {
  label: string;
  value: number;
}

export interface InsuranceInfoType {
  gender: string;
  name: string;
  birthday: Date | null;
  citizenId: string;
  buyFor: string;
  address: string;
  phone: string;
  email: string;
}
