/**
 * Accumulate total baggage price and quantity from a list of passengers.
 *
 * This replaces the inline reduce() pattern that was duplicated across
 * BookingDetail2.tsx and 1G/BookingDetail.tsx (4 occurrences total).
 */
export function accumulateBaggages(
  passengers: { baggages?: { price: number }[] }[] | undefined | null
): { price: number; quantity: number } {
  if (!passengers?.length) return { price: 0, quantity: 0 };

  return passengers.reduce(
    (acc, item) => {
      if (Array.isArray(item.baggages)) {
        item.baggages.forEach((bag) => {
          acc.price += bag.price;
          acc.quantity++;
        });
      }
      return acc;
    },
    { price: 0, quantity: 0 }
  );
}
