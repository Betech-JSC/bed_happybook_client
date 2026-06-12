import { handleSessionStorage } from "@/utils/Helper";
import type { FlightSearchContext } from "@/types/selectedFlight";
import type { SelectedFlight } from "@/types/selectedFlight";
import { legacyTripToSelectedFlight } from "@/utils/legacyTripToSelectedFlight";
import { is1GSource } from "@/utils/internationalFlightSelection";
import { build1GFlightsForBookingDisplay } from "@/utils/build1GHoldFareData";
import { merge1GSelectionsForConfirm } from "@/utils/oneGConfirmPrice";
import {
  isVietJetSource,
  repairFareOptionFromTrip,
  repairVjFareOption,
} from "@/utils/fareValueToken";
import {
  assertVjTripHasSegmentTokens,
  mergeVjSegmentsFromSearchFlight,
  normalizeVjSelectedFlight,
} from "@/utils/vjSegmentToken";

const KEYS = {
  context: "flightSearchContext",
  depart: "selectedFlightDepart",
  return: "selectedFlightReturn",
  departLegacy: "departFlight",
  returnLegacy: "returnFlight",
} as const;

/**
 * VJ confirm-price state (Postman template):
 * - context.searchId → session
 * - depart/return: trip.segments[].segmentId (token), fareOption.fareValue (shared ADT/CHD/INF)
 * - Không dùng segmentValue "1" trên payload — segmentValue gửi "".
 */

export function saveFlightSearchContext(ctx: FlightSearchContext) {
  handleSessionStorage("save", KEYS.context, ctx);
}

export function getFlightSearchContext(): FlightSearchContext | null {
  return handleSessionStorage("get", KEYS.context);
}

export type SaveSelectedFlightOptions = {
  /** Trip gốc từ search/resource — giữ segments[].segmentId token. */
  searchFlight?: Record<string, unknown>;
};

function ensureSelectedFlightReady(
  selection: SelectedFlight,
  searchFlight?: Record<string, unknown>
): SelectedFlight {
  const source = String(
    selection.trip?.source ?? selection.fareOption?.source ?? ""
  );
  let next = selection;

  const trip = selection.trip as Record<string, unknown>;

  if (isVietJetSource(source)) {
    const segments = mergeVjSegmentsFromSearchFlight(trip, searchFlight ?? trip);
    const fareOption = repairVjFareOption(
      selection.fareOption as Record<string, unknown>,
      {
        fareOptionIndex: selection.fareOptionIndex,
        trip,
        searchFlight,
      }
    );
    next = {
      ...selection,
      trip: { ...trip, segments },
      fareOption,
    };
  } else {
    next = {
      ...selection,
      fareOption: repairFareOptionFromTrip(
        selection.fareOption as Record<string, unknown>,
        {
          fareOptionIndex: selection.fareOptionIndex,
          trip: searchFlight ?? trip,
          source,
        }
      ),
    };
  }

  return next;
}

export function saveSelectedFlight(
  leg: "depart" | "return",
  selection: SelectedFlight,
  options?: SaveSelectedFlightOptions
) {
  const source = String(
    selection.trip?.source ?? selection.fareOption?.source ?? ""
  );
  let toSave = ensureSelectedFlightReady(selection, options?.searchFlight);

  if (isVietJetSource(source)) {
    assertVjTripHasSegmentTokens(toSave.trip as Record<string, unknown>);
    handleSessionStorage("remove", "flightConfirmPrice");
  }

  const key = leg === "depart" ? KEYS.depart : KEYS.return;
  handleSessionStorage("save", key, toSave);
  const legacyTrip = {
    ...toSave.trip,
    selectedTicketClass: toSave.fareOption,
  };
  handleSessionStorage(
    "save",
    leg === "depart" ? KEYS.departLegacy : KEYS.returnLegacy,
    legacyTrip
  );
}

export function getSelectedFlight(
  leg: "depart" | "return"
): SelectedFlight | null {
  const key = leg === "depart" ? KEYS.depart : KEYS.return;
  const stored = handleSessionStorage("get", key);
  if (stored?.trip && stored?.fareOption) {
    const selection: SelectedFlight = {
      ...(stored as SelectedFlight),
      fareOptionIndex:
        typeof stored.fareOptionIndex === "number" ? stored.fareOptionIndex : 0,
    };
    return ensureSelectedFlightReady(normalizeVjSelectedFlight(selection));
  }
  return null;
}

export function loadSelectedFlightsForBooking(): SelectedFlight[] {
  const ctx = getFlightSearchContext();
  const searchId = ctx?.searchId ?? handleSessionStorage("get", "flightSession") ?? "";
  const tripsSource = ctx?.tripsSource ?? "resource";
  const paxCounts = ctx?.paxCounts ?? { adult: 1, child: 0, infant: 0 };

  const legs: SelectedFlight[] = [];

  const depart = getSelectedFlight("depart");
  if (depart) {
    legs.push(depart);
  } else {
    const legacy = handleSessionStorage("get", KEYS.departLegacy);
    if (legacy) {
      const converted = legacyTripToSelectedFlight(legacy, {
        searchId,
        tripsSource,
        paxCounts,
      });
      if (converted) {
        legs.push(ensureSelectedFlightReady(converted, legacy as Record<string, unknown>));
      }
    }
  }

  const returnSel = getSelectedFlight("return");
  if (returnSel) {
    legs.push(returnSel);
  } else {
    const legacy = handleSessionStorage("get", KEYS.returnLegacy);
    if (legacy) {
      const converted = legacyTripToSelectedFlight(legacy, {
        searchId,
        tripsSource,
        paxCounts,
      });
      if (converted) {
        legs.push(
          ensureSelectedFlightReady(
            isVietJetSource(converted.trip?.source)
              ? normalizeVjSelectedFlight(converted)
              : converted,
            legacy as Record<string, unknown>
          )
        );
      }
    }
  }

  if (legs.length > 1 && legs.every((l) => is1GSource(l.trip?.source))) {
    const merged = merge1GSelectionsForConfirm(legs);
    return merged ? [merged] : legs;
  }

  return legs;
}

export function tripFromSelection(sel: SelectedFlight): Record<string, unknown> {
  return {
    ...sel.trip,
    selectedTicketClass: sel.fareOption,
  };
}

type FlightDisplayPoint = {
  at?: string;
  IATACode?: string;
  timezone?: string;
};

function asFlightDisplayPoint(value: unknown): FlightDisplayPoint | undefined {
  if (!value || typeof value !== "object") return undefined;
  const obj = value as Record<string, unknown>;
  const at = typeof obj.at === "string" ? obj.at : undefined;
  const IATACode =
    typeof obj.IATACode === "string"
      ? obj.IATACode
      : typeof obj.code === "string"
        ? obj.code
        : undefined;
  const timezone = typeof obj.timezone === "string" ? obj.timezone : undefined;
  if (!at && !IATACode) return undefined;
  return { at, IATACode, timezone };
}

function flightPointFromSegment(
  segment: Record<string, unknown> | undefined,
  kind: "departure" | "arrival"
): FlightDisplayPoint | undefined {
  if (!segment) return undefined;

  const nested = asFlightDisplayPoint(segment[kind]);
  if (nested?.at || nested?.IATACode) return nested;

  const timeKey = kind === "departure" ? "departureTime" : "arrivalTime";
  const at = typeof segment[timeKey] === "string" ? segment[timeKey] : undefined;
  const codeField = segment[kind];
  const IATACode =
    typeof codeField === "string"
      ? codeField
      : typeof segment[kind === "departure" ? "origin" : "destination"] ===
          "string"
        ? (segment[kind === "departure" ? "origin" : "destination"] as string)
        : undefined;

  if (!at && !IATACode) return undefined;
  return { at, IATACode };
}

function resolveFlightDisplayPoints(trip: Record<string, unknown>): {
  departure?: FlightDisplayPoint;
  arrival?: FlightDisplayPoint;
} {
  const segments = Array.isArray(trip.segments)
    ? (trip.segments as Record<string, unknown>[])
    : [];
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1] ?? firstSegment;

  return {
    departure:
      asFlightDisplayPoint(trip.departure) ??
      flightPointFromSegment(firstSegment, "departure"),
    arrival:
      asFlightDisplayPoint(trip.arrival) ??
      flightPointFromSegment(lastSegment, "arrival"),
  };
}

/** Flight object shape dùng cho bookingFlight / hold-flight / checkout (đồng bộ QN–QT). */
export function flightFromSelection(
  sel: SelectedFlight,
  options?: {
    legacyTrip?: Record<string, unknown> | null;
    legIndex?: number;
  }
): Record<string, unknown> {
  const legacy = options?.legacyTrip ?? null;
  const trip = sel.trip as Record<string, unknown>;
  const fareOption = sel.fareOption as Record<string, unknown>;
  const itineraryId = sel.itineraryId ?? trip.itineraryId;

  const rawLeg = trip.flightLeg ?? legacy?.flightLeg ?? options?.legIndex;
  let flightLeg = 0;
  if (typeof rawLeg === "number") {
    flightLeg = rawLeg;
  } else if (String(itineraryId) === "2") {
    flightLeg = 1;
  } else if (options?.legIndex != null) {
    flightLeg = options.legIndex;
  }

  const fareOptions =
    (legacy?.fareOptions as Record<string, unknown>[] | undefined) ??
    (trip.fareOptions as Record<string, unknown>[] | undefined) ??
    [fareOption];

  const mergedTrip = {
    ...(legacy ?? {}),
    ...trip,
    selectedTicketClass: fareOption,
    fareOptions,
    numberAdt: sel.paxCounts.adult,
    numberChd: sel.paxCounts.child,
    numberInf: sel.paxCounts.infant,
    flightId:
      trip.flightId ??
      legacy?.flightId ??
      trip.hpb_id ??
      legacy?.hpb_id ??
      trip.flightCode ??
      legacy?.flightCode,
    flightCode: trip.flightCode ?? legacy?.flightCode,
    flightLeg,
    domestic: trip.domestic ?? legacy?.domestic ?? false,
    itineraryId: itineraryId ?? (flightLeg === 1 ? "2" : "1"),
    source: trip.source ?? fareOption.source ?? legacy?.source,
    segments: trip.segments ?? legacy?.segments,
  };

  const { departure, arrival } = resolveFlightDisplayPoints(mergedTrip);

  return {
    ...mergedTrip,
    ...(departure ? { departure } : {}),
    ...(arrival ? { arrival } : {}),
  };
}

function enrich1GPackageTrip(
  trip: Record<string, unknown>
): Record<string, unknown> {
  const departPkg = handleSessionStorage("get", KEYS.departLegacy) as
    | Record<string, unknown>
    | null;
  return {
    ...(departPkg ?? {}),
    ...trip,
    journeys: trip.journeys ?? departPkg?.journeys,
    _selectedJourneyFlights:
      trip._selectedJourneyFlights ?? departPkg?._selectedJourneyFlights,
  };
}

export function flightsFromSelections(
  selections: SelectedFlight[]
): Record<string, unknown>[] {
  if (selections.length >= 1 && is1GSource(selections[0].trip?.source)) {
    const sel = selections[0];
    const packageTrip = enrich1GPackageTrip(sel.trip as Record<string, unknown>);
    const legFlights = build1GFlightsForBookingDisplay({
      packageTrip,
      paxCounts: sel.paxCounts,
      fareOptionIndex: sel.fareOptionIndex,
    });
    if (legFlights.length > 0) return legFlights;
  }

  const legacyKeys = ["departFlight", "returnFlight"] as const;
  return selections.map((sel, index) => {
    const legacyKey = legacyKeys[index];
    const legacy = legacyKey
      ? (handleSessionStorage("get", legacyKey) as Record<string, unknown> | null)
      : null;
    return flightFromSelection(sel, { legacyTrip: legacy, legIndex: index });
  });
}
