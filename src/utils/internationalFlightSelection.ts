import type { PaxCounts, SelectedFlight, TripsSource } from "@/types/selectedFlight";
import { createSelectedFlight } from "@/utils/createSelectedFlight";
import {
  saveFlightSearchContext,
  saveSelectedFlight,
} from "@/utils/selectedFlightStorage";
import { handleSessionStorage } from "@/utils/Helper";
import { copyFareValueRaw } from "@/utils/fareValueToken";

export function is1GSource(source: unknown): boolean {
  return String(source ?? "").toUpperCase() === "1G";
}

export type JourneyLike = {
  journeyId?: string;
  segments?: Record<string, unknown>[];
};

/** Flatten segments từ journeys theo journeyIds của fare đã chọn (1G). */
export function collectSegmentsFromJourneys(
  journeys: Record<string, JourneyLike[]> | JourneyLike[][] | undefined,
  selectedByLeg?: Record<string, Record<string, unknown>>,
  journeyIds?: string[]
): Record<string, unknown>[] {
  let flat: JourneyLike[] = [];

  if (selectedByLeg && Object.keys(selectedByLeg).length > 0) {
    flat = Object.entries(selectedByLeg)
      .sort(([a], [b]) => Number(a) - Number(b))
      .flatMap(([, flight]) => {
        const segs = (flight.segments ?? []) as Record<string, unknown>[];
        const journeyId = (flight.journeyId ?? flight.journey_id ?? "") as string;
        return segs.length
          ? [{ journeyId, segments: segs }]
          : [{ journeyId, segments: [flight] }];
      });
  } else if (journeys) {
    if (Array.isArray(journeys)) {
      flat = journeys.flat() as JourneyLike[];
    } else {
      flat = Object.values(journeys).flat();
    }
  }

  const matched = journeyIds?.length
    ? flat.filter((j) => journeyIds.includes(String(j.journeyId ?? "")))
    : flat;

  let leg = 0;
  return matched.flatMap((j) =>
    (j.segments ?? []).map((seg) => {
      leg += 1;
      return { ...seg, leg };
    })
  );
}

export function fareOptionIndexFromTrip(
  trip: Record<string, unknown>
): number {
  const fareOptions = trip.fareOptions as Record<string, unknown>[] | undefined;
  const selected = trip.selectedTicketClass as Record<string, unknown> | undefined;
  if (!fareOptions?.length || !selected) return 0;

  const selectedFv = copyFareValueRaw(selected.fareValue);
  const idx = fareOptions.findIndex(
    (f) =>
      f === selected ||
      copyFareValueRaw(f.fareValue) === selectedFv ||
      f.groupClass === selected.groupClass
  );
  return idx >= 0 ? idx : 0;
}

/** Giá/hạng vé cấp gói 1G (search response). */
export function build1GFareOptionFromPackage(
  pkg: Record<string, unknown>
): Record<string, unknown> {
  const ticket =
    (pkg.selectedTicketClass as Record<string, unknown> | undefined) ?? {};
  const fareValue =
    copyFareValueRaw(ticket.fareValue) ||
    copyFareValueRaw(pkg.fareValue) ||
    String(pkg.hpb_id ?? "").trim();
  const journeyIds = ticket.journeyIds ?? pkg.journeyIds ?? ticket.journey_ids ?? pkg.journey_ids;

  return {
    ...ticket,
    source: "1G",
    fareAdult: ticket.fareAdult ?? pkg.fareAdult ?? pkg.totalAdult,
    fareChild: ticket.fareChild ?? pkg.fareChild,
    fareInfant: ticket.fareInfant ?? pkg.fareInfant,
    taxAdult: ticket.taxAdult ?? pkg.taxAdult,
    taxChild: ticket.taxChild ?? pkg.taxChild,
    taxInfant: ticket.taxInfant ?? pkg.taxInfant,
    totalAdult: ticket.totalAdult ?? pkg.totalAdult,
    totalChild: ticket.totalChild ?? pkg.totalChild,
    totalInfant: ticket.totalInfant ?? pkg.totalInfant,
    totalPrice: ticket.totalPrice ?? pkg.totalPrice,
    totalServiceFee: ticket.totalServiceFee ?? pkg.totalServiceFee,
    totalPriceWithOutTax:
      ticket.totalPriceWithOutTax ?? pkg.totalPriceWithOutTax,
    fareValue,
    ...(journeyIds ? { journeyIds } : {}),
  };
}

/**
 * Một chặng 1G: trip = flight user chọn trong journey; fareOption = giá gói từ search.
 */
export function createSelectedFlightFrom1G(input: {
  package: Record<string, unknown>;
  journeyIndex: number;
  selectedFlight: Record<string, unknown>;
  searchId: string;
  tripsSource: TripsSource;
  paxCounts: PaxCounts;
}): SelectedFlight {
  const { package: pkg, journeyIndex, selectedFlight } = input;
  const fareOption = build1GFareOptionFromPackage(pkg);

  const trip: Record<string, unknown> = {
    ...selectedFlight,
    source: "1G",
    domestic: false,
    itineraryId: String(journeyIndex + 1),
    clientId: pkg.clientId ?? selectedFlight.clientId ?? "",
    hpb_id: pkg.hpb_id,
    flightLeg: journeyIndex,
    numberAdt: pkg.numberAdt,
    numberChd: pkg.numberChd,
    numberInf: pkg.numberInf,
  };
  delete trip.selectedTicketClass;
  delete trip.fareOptions;

  return {
    searchId: input.searchId,
    resourceId: pkg._resourceId as string | undefined,
    itineraryId: String(journeyIndex + 1),
    fareOptionIndex: 0,
    trip,
    fareOption,
    paxCounts: input.paxCounts,
    tripsSource: input.tripsSource,
  };
}

export function get1GJourneyFlights(
  pkg: Record<string, unknown>
): { journeyIndex: number; flight: Record<string, unknown> }[] {
  const picked = pkg._selectedJourneyFlights as
    | Record<string, Record<string, unknown>>
    | undefined;
  if (picked && Object.keys(picked).length > 0) {
    return Object.entries(picked)
      .map(([key, flight]) => ({
        journeyIndex: Number(key),
        flight,
      }))
      .filter((x) => !Number.isNaN(x.journeyIndex) && x.flight)
      .sort((a, b) => a.journeyIndex - b.journeyIndex);
  }

  const journeys = pkg.journeys as Record<string, unknown>[][] | undefined;
  if (!journeys?.length) return [];

  return journeys
    .map((journey, journeyIndex) => ({
      journeyIndex,
      flight: journey?.[0] as Record<string, unknown> | undefined,
    }))
    .filter((x): x is { journeyIndex: number; flight: Record<string, unknown> } =>
      Boolean(x.flight)
    );
}

export function persist1GPackageSelections(input: {
  package: Record<string, unknown>;
  searchId: string;
  tripsSource: TripsSource;
  paxCounts: PaxCounts;
}): SelectedFlight[] {
  const pkg = input.package;
  const fareOption = build1GFareOptionFromPackage(pkg);
  const trip: Record<string, unknown> = {
    ...pkg,
    source: "1G",
    domestic: false,
    clientId: pkg.clientId ?? "",
    hpb_id: pkg.hpb_id,
    numberAdt: pkg.numberAdt,
    numberChd: pkg.numberChd,
    numberInf: pkg.numberInf,
  };
  delete trip.selectedTicketClass;

  const journeyIds = Array.isArray(fareOption.journeyIds)
    ? (fareOption.journeyIds as string[])
    : [];
  const segments = collectSegmentsFromJourneys(
    pkg.journeys as Record<string, JourneyLike[]> | JourneyLike[][] | undefined,
    pkg._selectedJourneyFlights as Record<string, Record<string, unknown>> | undefined,
    journeyIds
  );
  if (segments.length) {
    trip.segments = segments;
  }

  const firstSegValue = String(
    (segments[0] as Record<string, unknown> | undefined)?.segmentValue ?? ""
  );

  const selection: SelectedFlight = {
    searchId: input.searchId,
    resourceId: pkg._resourceId as string | undefined,
    itineraryId: firstSegValue || "1",
    fareOptionIndex: fareOptionIndexFromTrip(pkg),
    trip,
    fareOption,
    paxCounts: input.paxCounts,
    tripsSource: input.tripsSource,
  };

  saveSelectedFlight("depart", selection);
  handleSessionStorage("remove", "selectedFlightReturn");

  return [selection];
}

export function persistInternationalTripSelection(input: {
  leg: "depart" | "return";
  trip: Record<string, unknown>;
  searchId: string;
  tripsSource: TripsSource;
  paxCounts: PaxCounts;
}): SelectedFlight | null {
  const fareOptionIndex = fareOptionIndexFromTrip(input.trip);
  const selection = createSelectedFlight(input.trip, fareOptionIndex, {
    searchId: input.searchId,
    tripsSource: input.tripsSource,
    paxCounts: input.paxCounts,
    resourceId: input.trip._resourceId as string | undefined,
  });
  if (!selection) return null;
  saveSelectedFlight(input.leg, selection);
  return selection;
}

/** Lưu selectedFlight + legacy depart/returnFlight trước khi sang form đặt chỗ. */
export function persistInternationalCheckoutSelections(input: {
  depart: Record<string, unknown> | null;
  return: Record<string, unknown> | null;
  searchId: string;
  tripsSource?: TripsSource;
  paxCounts: PaxCounts;
}): void {
  const tripsSource = input.tripsSource ?? "resource";
  const { searchId, paxCounts } = input;

  saveFlightSearchContext({ searchId, tripsSource, paxCounts });

  if (!input.depart) return;

  if (is1GSource(input.depart.source)) {
    persist1GPackageSelections({
      package: input.depart,
      searchId,
      tripsSource,
      paxCounts,
    });
    handleSessionStorage("save", "departFlight", input.depart);
    if (input.return) {
      handleSessionStorage("save", "returnFlight", input.return);
    }
    return;
  }

  const departSel = persistInternationalTripSelection({
    leg: "depart",
    trip: input.depart,
    searchId,
    tripsSource,
    paxCounts,
  });
  if (departSel) {
    handleSessionStorage("save", "departFlight", {
      ...departSel.trip,
      ...input.depart,
      segments: departSel.trip.segments ?? input.depart.segments,
      fareOptions:
        (input.depart.fareOptions as Record<string, unknown>[] | undefined) ??
        [departSel.fareOption],
      selectedTicketClass: departSel.fareOption,
      flightCode: input.depart.flightCode,
      numberAdt: paxCounts.adult,
      numberChd: paxCounts.child,
      numberInf: paxCounts.infant,
      domestic: false,
    });
  }

  if (input.return && !is1GSource(input.return.source)) {
    const returnSel = persistInternationalTripSelection({
      leg: "return",
      trip: input.return,
      searchId,
      tripsSource,
      paxCounts,
    });
    if (returnSel) {
      handleSessionStorage("save", "returnFlight", {
        ...returnSel.trip,
        ...input.return,
        segments: returnSel.trip.segments ?? input.return.segments,
        fareOptions:
          (input.return.fareOptions as Record<string, unknown>[] | undefined) ??
          [returnSel.fareOption],
        selectedTicketClass: returnSel.fareOption,
        flightCode: input.return.flightCode,
        numberAdt: paxCounts.adult,
        numberChd: paxCounts.child,
        numberInf: paxCounts.infant,
        domestic: false,
      });
    }
  }
}
