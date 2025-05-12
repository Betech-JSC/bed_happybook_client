export interface SearchForm {
  productId: number | null;
  departureDate: Date | null;
  returnDate: Date | null;
}
export interface SearchProps {
  searchParams: {
    productId: string | null;
    departDate: string | null;
    returnDate: string | null;
  };
}
