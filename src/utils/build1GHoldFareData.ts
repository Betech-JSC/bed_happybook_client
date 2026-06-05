import { get1GJourneyFlights } from "@/utils/internationalFlightSelection";
import { copyFareValueRaw } from "@/utils/fareValueToken";

export type HoldFareDataEntry = {
  session: string;
  fare_data_id_api: string;
  source: string;
  flights: Array<{
    flight_value: string;
    detail: Record<string, unknown>;
  }>;
};

type PaxCounts = {
  adult: number;
  child: number;
  infant: number;
};

type FlightPoint = {
  IATACode?: string;
  at?: string;
  timezone?: string;
};

function asFlightPoint(value: unknown): FlightPoint | undefined {
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
): FlightPoint | undefined {
  if (!segment) return undefined;
  const nested = asFlightPoint(segment[kind]);
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

function journeyFareOptions(
  journey: Record<string, unknown> | undefined
): Record<string, unknown>[] {
  if (!journey) return [];
  const list = journey.fareOptions ?? journey.fare_options;
  return Array.isArray(list) ? (list as Record<string, unknown>[]) : [];
}

function isRoundTripPackageFare(fare: Record<string, unknown>): boolean {
  const journeyIds = fare.journeyIds as string[] | undefined;
  return Array.isArray(journeyIds) && journeyIds.length > 1;
}

function hasPerLegFareShape(fare: Record<string, unknown>): boolean {
  return (
    fare.taxAdult != null ||
    fare.totalAdult != null ||
    (fare.fareAdult != null && !isRoundTripPackageFare(fare))
  );
}

function findJourneyInPackage(
  packageTrip: Record<string, unknown>,
  legIndex: number,
  journeyId?: string
): Record<string, unknown> | undefined {
  const journeys = packageTrip.journeys as
    | Record<string, unknown>[][]
    | undefined;
  if (!journeys?.length) return undefined;

  if (journeyId) {
    for (const leg of journeys) {
      const found = leg?.find(
        (j) => String(j.journeyId ?? "") === journeyId
      );
      if (found) return found as Record<string, unknown>;
    }
  }

  return journeys[legIndex]?.[0] as Record<string, unknown> | undefined;
}

/** Chỉ segment thuộc một chiều (tránh 4 chặng gộp từ trip.segments). */
function segmentsForLeg(
  segments: Record<string, unknown>[],
  legIndex: number
): Record<string, unknown>[] {
  if (segments.length <= 2) return segments;

  const legNums = legIndex === 0 ? [1, 2] : [3, 4];
  const byLeg = segments.filter((seg) => {
    const leg = Number(seg.leg);
    return !Number.isNaN(leg) && legNums.includes(leg);
  });
  if (byLeg.length > 0) return byLeg;

  const half = Math.ceil(segments.length / 2);
  return legIndex === 0
    ? segments.slice(0, half)
    : segments.slice(half);
}

/**
 * Journey đầy đủ cho một chiều: ưu tiên journeys[i][0] từ search, merge _selectedJourneyFlights.
 */
export function resolveCanonical1GJourney(
  packageTrip: Record<string, unknown>,
  legIndex: number,
  picked?: Record<string, unknown>
): Record<string, unknown> {
  const journeyId = String(
    picked?.journeyId ?? picked?.flightId ?? ""
  ).trim();
  const canonical = findJourneyInPackage(packageTrip, legIndex, journeyId || undefined);

  const rawSegments = (canonical?.segments ??
    picked?.segments) as Record<string, unknown>[] | undefined;
  const segments = Array.isArray(rawSegments)
    ? segmentsForLeg(rawSegments, legIndex)
    : [];

  const firstSeg = segments[0];
  const lastSeg = segments[segments.length - 1] ?? firstSeg;

  const departure =
    asFlightPoint(canonical?.departure) ??
    asFlightPoint(picked?.departure) ??
    flightPointFromSegment(firstSeg, "departure");

  const arrival =
    asFlightPoint(canonical?.arrival) ??
    asFlightPoint(picked?.arrival) ??
    flightPointFromSegment(lastSeg, "arrival");

  const resolvedJourneyId =
    canonical?.journeyId ??
    picked?.journeyId ??
    picked?.flightId;

  return {
    ...(canonical ?? {}),
    ...(picked ?? {}),
    journeyId: resolvedJourneyId,
    flightId: resolvedJourneyId,
    airline: canonical?.airline ?? picked?.airline,
    duration: canonical?.duration ?? picked?.duration,
    segments,
    ...(departure ? { departure } : {}),
    ...(arrival ? { arrival } : {}),
    fareOptions:
      journeyFareOptions(canonical).length > 0
        ? journeyFareOptions(canonical)
        : journeyFareOptions(picked),
    fare_options:
      journeyFareOptions(canonical).length > 0
        ? journeyFareOptions(canonical)
        : journeyFareOptions(picked),
  };
}

function resolveJourneyFareOption(
  journey: Record<string, unknown>,
  packageTrip: Record<string, unknown>,
  legIndex: number,
  fareOptionIndex = 0
): Record<string, unknown> {
  const journeyId = String(journey.journeyId ?? journey.flightId ?? "");

  const fromJourneyList = journeyFareOptions(journey);
  if (fromJourneyList[fareOptionIndex]) return fromJourneyList[fareOptionIndex];
  if (fromJourneyList[0] && hasPerLegFareShape(fromJourneyList[0])) {
    return fromJourneyList[0];
  }

  const canonical = findJourneyInPackage(packageTrip, legIndex, journeyId);
  const fromCanonical = journeyFareOptions(canonical);
  if (fromCanonical[fareOptionIndex]) return fromCanonical[fareOptionIndex];
  if (fromCanonical[0]) return fromCanonical[0];

  const packageFareList = (packageTrip.fareOptions ??
    packageTrip.fare_options) as Record<string, unknown>[] | undefined;
  if (Array.isArray(packageFareList) && journeyId) {
    const matched = packageFareList.find((fo) => {
      const ids = fo.journeyIds as string[] | undefined;
      return (
        Array.isArray(ids) &&
        ids.length === 1 &&
        ids[0] === journeyId &&
        hasPerLegFareShape(fo)
      );
    });
    if (matched) return matched;
  }

  const selected = journey.selectedTicketClass as
    | Record<string, unknown>
    | undefined;
  if (selected && hasPerLegFareShape(selected) && !isRoundTripPackageFare(selected)) {
    return selected;
  }

  // Fallback for first leg of round-trip packages
  if (legIndex === 0) {
    const pkgSelected = packageTrip.selectedTicketClass as Record<string, unknown> | undefined;
    if (pkgSelected && Object.keys(pkgSelected).length > 0) {
      return pkgSelected;
    }

    if (Array.isArray(packageFareList)) {
      if (packageFareList[fareOptionIndex]) return packageFareList[fareOptionIndex];
      if (packageFareList[0]) return packageFareList[0];
    }
  }

  return {};
}

function resolveJourneyFlightValue(
  journey: Record<string, unknown>,
  fareOption: Record<string, unknown>
): string {
  const fromFare = copyFareValueRaw(fareOption.fareValue);
  if (fromFare) return fromFare;

  const fromJourney = copyFareValueRaw(journey.fareValue);
  if (fromJourney) return fromJourney;

  const segments = Array.isArray(journey.segments)
    ? (journey.segments as Record<string, unknown>[])
    : [];
  const fromSegment = copyFareValueRaw(segments[0]?.segmentValue);
  if (fromSegment) return fromSegment;

  return copyFareValueRaw(journey.journeyId) || "";
}

function findCarryOnBaggage(fareOption: Record<string, unknown>): string {
  const allowances = fareOption.baggageAllowances as
    | Array<Record<string, unknown>>
    | undefined;
  if (!Array.isArray(allowances)) return "";
  const carryOn = allowances.find(
    (b) =>
      String(b.baggageType ?? b.baggage_type ?? "").toUpperCase() === "CARRY_ON"
  );
  return String(carryOn?.freeText ?? carryOn?.free_text ?? "").trim();
}

function buildSelectedTicketClass(
  fareOption: Record<string, unknown>
): Record<string, unknown> {
  const totalAdult = Number(fareOption.totalAdult ?? fareOption.totalPriceAdt ?? 0);
  const totalChild = Number(fareOption.totalChild ?? fareOption.totalPriceChd ?? 0);
  const totalInfant = Number(fareOption.totalInfant ?? fareOption.totalPriceInf ?? 0);
  const legTotal =
    totalAdult + totalChild + totalInfant ||
    Number(fareOption.totalPrice ?? 0);

  const fareAdultFinal = Number(
    fareOption.fareAdultFinal ??
      fareOption.fareAdult ??
      (totalAdult - Number(fareOption.taxAdult ?? 0))
  );
  const fareChildFinal = Number(
    fareOption.fareChildFinal ??
      fareOption.fareChild ??
      (totalChild - Number(fareOption.taxChild ?? 0))
  );
  const fareInfantFinal = Number(
    fareOption.fareInfantFinal ??
      fareOption.fareInfant ??
      (totalInfant - Number(fareOption.taxInfant ?? 0))
  );

  const taxAdult = Number(fareOption.taxAdult ?? 0);
  const taxChild = Number(fareOption.taxChild ?? 0);
  const taxInfant = Number(fareOption.taxInfant ?? 0);

  const totalTaxAdt = Number(fareOption.totalTaxAdt ?? taxAdult);
  const totalTaxChd = Number(fareOption.totalTaxChd ?? taxChild);
  const totalTaxInf = Number(fareOption.totalTaxInf ?? taxInfant);

  return {
    fareAdult: fareOption.fareAdult,
    fareChild: fareOption.fareChild,
    fareInfant: fareOption.fareInfant,
    taxAdult,
    taxChild,
    taxInfant,
    totalPrice: legTotal,
    bookingClass: fareOption.bookingClass,
    groupClass: fareOption.groupClass,
    fareType: fareOption.fareType ?? fareOption.cabin ?? "Economy",
    fareBasisCode: fareOption.fareBasisCode,
    seatAvailable: fareOption.seatAvailable,
    noRefund: fareOption.noRefund,
    changePenalties: fareOption.changePenalties ?? [],
    carryOnBaggage: findCarryOnBaggage(fareOption),
    checkedBaggae:
      fareOption.checkedBaggae ??
      fareOption.checkedBaggage ??
      "25 KG",
    ...(fareOption.journeyIds ? { journeyIds: fareOption.journeyIds } : {}),
    ...(fareOption.journey_ids ? { journey_ids: fareOption.journey_ids } : {}),
    totalAdult,
    totalChild,
    totalInfant,
    totalPriceAdt: totalAdult,
    totalPriceChd: totalChild,
    totalPriceInf: totalInfant,
    fareAdultFinal,
    fareChildFinal,
    fareInfantFinal,
    totalTaxAdt,
    totalTaxChd,
    totalTaxInf,
  };
}

function buildHoldDetail(
  journey: Record<string, unknown>,
  fareOption: Record<string, unknown>,
  legIndex: number,
  paxCounts: PaxCounts
): Record<string, unknown> {
  const segments = Array.isArray(journey.segments)
    ? (journey.segments as Record<string, unknown>[])
    : [];
  const firstSeg = segments[0] ?? {};
  const airline = String(journey.airline ?? "");
  const journeyId = journey.journeyId ?? journey.flightId;

  const detail: Record<string, unknown> = {
    source: "1G",
    clientId: "",
    airline,
    domestic: false,
    operator: String(firstSeg.operating ?? firstSeg.airline ?? airline),
    legs: legIndex,
    currency: "VND",
    numberAdt: paxCounts.adult,
    numberChd: paxCounts.child,
    numberInf: paxCounts.infant,
    flightId: journeyId,
    flightNumber: firstSeg.flightNumber ?? journey.flightNumber,
    duration: journey.duration,
    segments,
    selectedTicketClass: buildSelectedTicketClass(fareOption),
    flightLeg: legIndex,
  };

  if (journey.departure) detail.departure = journey.departure;
  if (journey.arrival) detail.arrival = journey.arrival;

  return detail;
}

function buildHoldLeg(input: {
  journey: Record<string, unknown>;
  packageTrip: Record<string, unknown>;
  legIndex: number;
  session: string;
  fareDataIdApi: string;
  paxCounts: PaxCounts;
  fareOptionIndex: number;
}): HoldFareDataEntry {
  const fareOption = resolveJourneyFareOption(
    input.journey,
    input.packageTrip,
    input.legIndex,
    input.fareOptionIndex
  );

  return {
    session: input.session,
    fare_data_id_api: input.fareDataIdApi,
    source: "1G",
    flights: [
      {
        flight_value: resolveJourneyFlightValue(input.journey, fareOption),
        detail: buildHoldDetail(
          input.journey,
          fareOption,
          input.legIndex,
          input.paxCounts
        ),
      },
    ],
  };
}

function resolve1GJourneyLegs(
  packageTrip: Record<string, unknown>
): { journey: Record<string, unknown>; legIndex: number }[] {
  const pickedLegs = get1GJourneyFlights(packageTrip);
  const legCount = Math.max(
    pickedLegs.length,
    (packageTrip.journeys as unknown[] | undefined)?.length ?? 0
  );

  if (legCount === 0) return [];

  const legs: { journey: Record<string, unknown>; legIndex: number }[] = [];
  for (let legIndex = 0; legIndex < legCount; legIndex += 1) {
    const picked = pickedLegs.find((l) => l.journeyIndex === legIndex)?.flight;
    const journey = resolveCanonical1GJourney(packageTrip, legIndex, picked);
    if (Object.keys(journey).length > 0) {
      legs.push({ journey, legIndex });
    }
  }

  return legs;
}

/** Hai chuyến hiển thị / baggage API — mỗi chiều có departure, arrival, 2 segment. */
export function build1GFlightsForBookingDisplay(input: {
  packageTrip: Record<string, unknown>;
  paxCounts: PaxCounts;
  fareOptionIndex?: number;
}): Record<string, unknown>[] {
  const legs = resolve1GJourneyLegs(input.packageTrip);
  return legs.map(({ journey, legIndex }) => {
    const fareOption = resolveJourneyFareOption(
      journey,
      input.packageTrip,
      legIndex,
      input.fareOptionIndex ?? 0
    );
    const segments = Array.isArray(journey.segments)
      ? (journey.segments as Record<string, unknown>[])
      : [];
    const firstSeg = segments[0];

    const ticketClass = buildSelectedTicketClass(fareOption);

    return {
      ...journey,
      source: "1G",
      domestic: false,
      selectedTicketClass: ticketClass,
      fareOptions:
        journeyFareOptions(journey).length > 0
          ? journeyFareOptions(journey)
          : [ticketClass],
      numberAdt: input.paxCounts.adult,
      numberChd: input.paxCounts.child,
      numberInf: input.paxCounts.infant,
      flightLeg: legIndex,
      itineraryId: String(legIndex + 1),
      flightNumber: firstSeg?.flightNumber ?? journey.flightNumber,
      airLineCode: journey.airline,
      airline: journey.airline,
    };
  });
}

/** hold-flight 1G quốc tế: mỗi chiều = một phần tử fare_data (domestic detail shape). */
export function build1GHoldFareData(input: {
  packageTrip: Record<string, unknown>;
  fareOption?: Record<string, unknown>;
  session: string;
  fareDataIdApi?: string;
  fareOptionIndex?: number;
  paxCounts?: PaxCounts;
  fallbackFlights?: Record<string, unknown>[];
}): HoldFareDataEntry[] {
  const fareDataIdApi = String(
    input.fareDataIdApi ??
      input.packageTrip.hpb_id ??
      input.packageTrip.flightId ??
      ""
  );
  const paxCounts: PaxCounts = {
    adult: Number(input.paxCounts?.adult ?? input.packageTrip.numberAdt ?? 1),
    child: Number(input.paxCounts?.child ?? input.packageTrip.numberChd ?? 0),
    infant: Number(input.paxCounts?.infant ?? input.packageTrip.numberInf ?? 0),
  };
  const fareOptionIndex = input.fareOptionIndex ?? 0;

  const legs = resolve1GJourneyLegs(input.packageTrip);
  if (legs.length > 0) {
    return legs.map(({ journey, legIndex }) =>
      buildHoldLeg({
        journey,
        packageTrip: input.packageTrip,
        legIndex,
        session: input.session,
        fareDataIdApi,
        paxCounts,
        fareOptionIndex,
      })
    );
  }

  const fallback = input.fallbackFlights ?? [];
  return fallback.map((flight, legIndex) => {
    const journey = resolveCanonical1GJourney(
      input.packageTrip,
      legIndex,
      flight
    );
    return buildHoldLeg({
      journey,
      packageTrip: input.packageTrip,
      legIndex,
      session: input.session,
      fareDataIdApi,
      paxCounts,
      fareOptionIndex,
    });
  });
}

/** Cộng tổng tiền từng chiều (per-leg selectedTicketClass), tránh giá cả đơn RT. */
export function sum1GHoldFareTotals(fareData: HoldFareDataEntry[]): {
  total_price: number;
  total_tax: number;
  total_price_net: number;
  total_fee_service: number;
} {
  let total_price = 0;
  let total_tax = 0;
  let total_price_net = 0;
  let total_fee_service = 0;

  for (const entry of fareData) {
    const stc = entry.flights[0]?.detail?.selectedTicketClass as
      | Record<string, unknown>
      | undefined;
    if (!stc) continue;

    const legPrice = Number(stc.totalPrice ?? 0);
    total_price += legPrice;

    const tax =
      Number(stc.taxAdult ?? 0) +
      Number(stc.taxChild ?? 0) +
      Number(stc.taxInfant ?? 0);
    total_tax += tax;

    const net =
      Number(stc.fareAdult ?? 0) +
      Number(stc.fareChild ?? 0) +
      Number(stc.fareInfant ?? 0);
    total_price_net += net || legPrice - tax;

    total_fee_service += Number(stc.totalServiceFee ?? 0);
  }

  return { total_price, total_tax, total_price_net, total_fee_service };
}
