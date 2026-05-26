import { handleSessionStorage } from "@/utils/Helper";
import type { FlightSearchContext } from "@/types/selectedFlight";
import type { SelectedFlight } from "@/types/selectedFlight";
import { legacyTripToSelectedFlight } from "@/utils/legacyTripToSelectedFlight";
import { is1GSource } from "@/utils/internationalFlightSelection";
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
