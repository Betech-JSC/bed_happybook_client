export const getCheapestComparablePrice = <T>(
  items: T[],
  getPrice: (item: T) => number | null | undefined
) => {
  const prices = items
    .map((item) => getPrice(item))
    .filter((price): price is number => Number.isFinite(price ?? NaN));

  if (!prices.length) return null;

  return Math.min(...prices);
};

export const getDomesticDisplayedPrice = (
  flight: any,
  priceWithoutTax: string
) => {
  const fare = flight?.selectedTicketClass ?? flight?.fareOptions?.[0];

  if (!fare) return null;

  if (priceWithoutTax === "1") {
    const price = Number(fare.totalPriceWithOutTax ?? 0);
    return Number.isFinite(price) ? price : null;
  }

  const adultPrice = Number(fare.fareAdultFinal ?? 0);
  const adultTax = Number(fare.taxAdult ?? 0);
  const price = adultPrice + adultTax;

  return Number.isFinite(price) ? price : null;
};

export const getInternationalPackagePrice = (flight: any) => {
  const price = Number(flight?.totalPrice ?? 0);
  return Number.isFinite(price) ? price : null;
};
