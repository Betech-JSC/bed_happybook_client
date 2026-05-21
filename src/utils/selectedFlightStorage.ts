import { handleSessionStorage } from "@/utils/Helper";
import type { FlightSearchContext } from "@/types/selectedFlight";
import type { SelectedFlight } from "@/types/selectedFlight";
import { healInternationalSelection } from "@/utils/healInternationalSelection";
import { legacyTripToSelectedFlight } from "@/utils/legacyTripToSelectedFlight";

const KEYS = {
  context: "flightSearchContext",
  depart: "selectedFlightDepart",
  return: "selectedFlightReturn",
  departLegacy: "departFlight",
  returnLegacy: "returnFlight",
} as const;

export function saveFlightSearchContext(ctx: FlightSearchContext) {
  handleSessionStorage("save", KEYS.context, ctx);
}

export function getFlightSearchContext(): FlightSearchContext | null {
  return handleSessionStorage("get", KEYS.context);
}

export function saveSelectedFlight(
  leg: "depart" | "return",
  selection: SelectedFlight
) {
  const healed = healInternationalSelection(selection);
  const key = leg === "depart" ? KEYS.depart : KEYS.return;
  handleSessionStorage("save", key, healed);
  const legacyTrip = {
    ...healed.trip,
    selectedTicketClass: healed.fareOption,
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
    return healInternationalSelection(stored as SelectedFlight);
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
        resourceId:
          (legacy._resourceFetchId as string | undefined) ??
          (legacy._resourceId as string | undefined),
      });
      if (converted) legs.push(converted);
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
        resourceId:
          (legacy._resourceFetchId as string | undefined) ??
          (legacy._resourceId as string | undefined),
      });
      if (converted) legs.push(converted);
    }
  }

  return legs.map((sel) => healInternationalSelection(sel));
}

export function tripFromSelection(sel: SelectedFlight): Record<string, unknown> {
  return {
    ...sel.trip,
    selectedTicketClass: sel.fareOption,
  };
}
