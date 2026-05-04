import { format } from "date-fns";

const getLowestFare = (flights: any[]) => {
  const flattened = flights.flat?.() ?? flights ?? [];
  const validFlights = flattened.filter(
    (flight: any) => Number.isFinite(Number(flight?.totalFare))
  );

  if (!validFlights.length) return null;

  return validFlights.reduce((lowest: any, flight: any) =>
    Number(flight.totalFare) < Number(lowest.totalFare) ? flight : lowest
  );
};

export const buildCheapestFareMap = (listMinPrice: any[] = []) => {
  return listMinPrice.reduce((acc: Record<string, number | null>, item: any) => {
    const date = item?.date ? format(new Date(item.date), "yyyy-MM-dd") : null;
    if (!date) return acc;

    const lowestFare = getLowestFare(item?.cheapestFare ?? []);
    acc[date] = lowestFare ? Number(lowestFare.totalFare) : null;
    return acc;
  }, {});
};

