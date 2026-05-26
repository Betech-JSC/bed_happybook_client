export type TripsSource = "search" | "resource";

export type PaxCounts = {
  adult: number;
  child: number;
  infant: number;
};

/** Trip + fare option from Airdata search / flight-resource (passthrough). */
export type Trip = Record<string, unknown>;
export type FareOption = Record<string, unknown>;

export type SelectedFlight = {
  searchId: string;
  resourceId?: string;
  itineraryId: string;
  /** Index j trong trips[i].fareOptions[] — net/tax/total/fareValue cùng một hạng vé. */
  fareOptionIndex: number;
  trip: Trip;
  fareOption: FareOption;
  paxCounts: PaxCounts;
  tripsSource: TripsSource;
};

export type FlightSearchContext = {
  searchId: string;
  tripsSource: TripsSource;
  paxCounts: PaxCounts;
};
