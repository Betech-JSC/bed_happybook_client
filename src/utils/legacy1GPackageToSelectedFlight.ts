import type { SelectedFlight } from "@/types/selectedFlight";
import {
  pickFirstBookingClassId,
} from "@/utils/internationalConfirmPrice";
import {
  findMatching1GJourneyRow,
  pick1GResourceFetchId,
  resolve1GConfirmItineraryId,
  resolve1GJourneySegments,
} from "@/utils/international1G";
import { copyFareValueRaw } from "@/utils/fareValueToken";
import { normalizeFlightTrip } from "@/utils/normalizeFlightTrip";

/** 1G search lưu package: selectedTicketClass = chuyến (có segments), giá ở package. */
export function isLegacy1GPackage(
  stored: Record<string, unknown> | null | undefined
): boolean {
  if (!stored) return false;
  if (String(stored.source ?? "").toUpperCase() !== "1G") return false;
  const row = stored.selectedTicketClass as Record<string, unknown> | undefined;
  return Boolean(row && Array.isArray(row.segments) && row.segments.length > 0);
}

function pickFareField(
  pkg: Record<string, unknown>,
  tripRow: Record<string, unknown>,
  keys: string[]
): unknown {
  for (const key of keys) {
    const fromPkg = pkg[key];
    if (fromPkg !== undefined && fromPkg !== null && fromPkg !== "") {
      return fromPkg;
    }
    const fromRow = tripRow[key];
    if (fromRow !== undefined && fromRow !== null && fromRow !== "") {
      return fromRow;
    }
  }
  return undefined;
}

function build1GFareOption(
  pkg: Record<string, unknown>,
  tripRow: Record<string, unknown>
): Record<string, unknown> {
  const fareValue = copyFareValueRaw(
    pickFareField(pkg, tripRow, ["fareValue", "fare_value"])
  );

  return {
    fareValue,
    fareAdult: Number(pickFareField(pkg, tripRow, ["fareAdult", "fare_adult"]) ?? 0),
    fareChild: Number(pickFareField(pkg, tripRow, ["fareChild", "fare_child"]) ?? 0),
    fareInfant: Number(
      pickFareField(pkg, tripRow, ["fareInfant", "fare_infant"]) ?? 0
    ),
    taxAdult: Number(pickFareField(pkg, tripRow, ["taxAdult", "tax_adult"]) ?? 0),
    taxChild: Number(pickFareField(pkg, tripRow, ["taxChild", "tax_child"]) ?? 0),
    taxInfant: Number(
      pickFareField(pkg, tripRow, ["taxInfant", "tax_infant"]) ?? 0
    ),
    discountAdult: Number(
      pickFareField(pkg, tripRow, ["discountAdult", "discount_adult"]) ?? 0
    ),
    discountChild: Number(
      pickFareField(pkg, tripRow, ["discountChild", "discount_child"]) ?? 0
    ),
    discountInfant: Number(
      pickFareField(pkg, tripRow, ["discountInfant", "discount_infant"]) ?? 0
    ),
    totalAdult: Number(
      pickFareField(pkg, tripRow, ["totalAdult", "total_adult"]) ?? 0
    ),
    totalChild: Number(
      pickFareField(pkg, tripRow, ["totalChild", "total_child"]) ?? 0
    ),
    totalInfant: Number(
      pickFareField(pkg, tripRow, ["totalInfant", "total_infant"]) ?? 0
    ),
    fareAdultFinal: Number(
      pickFareField(pkg, tripRow, ["fareAdultFinal", "fare_adult_final"]) ?? 0
    ),
    fareChildFinal: Number(
      pickFareField(pkg, tripRow, ["fareChildFinal", "fare_child_final"]) ?? 0
    ),
    fareInfantFinal: Number(
      pickFareField(pkg, tripRow, ["fareInfantFinal", "fare_infant_final"]) ?? 0
    ),
    totalPrice: Number(pickFareField(pkg, tripRow, ["totalPrice", "total_price"]) ?? 0),
    fareType: String(pickFareField(pkg, tripRow, ["fareType", "fare_type"]) ?? ""),
    fareBasisCode: String(
      pickFareField(pkg, tripRow, ["fareBasisCode", "fare_basis_code"]) ?? ""
    ),
    bookingClass: String(
      pickFareField(pkg, tripRow, ["bookingClass", "booking_class"]) ?? ""
    ),
    groupClass: String(
      pickFareField(pkg, tripRow, ["groupClass", "group_class"]) ?? ""
    ),
    bookingClassId: pickFirstBookingClassId(tripRow, pkg),
  };
}

export function legacy1GPackageToSelectedFlight(
  pkg: Record<string, unknown>,
  context: {
    searchId: string;
    tripsSource: SelectedFlight["tripsSource"];
    paxCounts: SelectedFlight["paxCounts"];
    itineraryId?: string;
  }
): SelectedFlight | null {
  const legIndex = Number(pkg.selectedJourneyLeg ?? 0);
  const rawJourney = pkg.selectedTicketClass as Record<string, unknown> | undefined;
  if (!rawJourney || !Array.isArray(rawJourney.segments)) return null;

  const tripRow = findMatching1GJourneyRow(pkg, rawJourney, legIndex) ?? rawJourney;

  const itineraryId =
    resolve1GConfirmItineraryId(tripRow, { legIndex, packageRow: pkg }) ||
    (context.itineraryId?.trim() ?? "");

  const airline =
    String(tripRow.airline ?? tripRow.airLineCode ?? pkg.airline ?? "").trim();

  const tripBody = normalizeFlightTrip({
    source: "1G",
    domestic: false,
    airline,
    clientId: pkg.clientId ?? pkg.client_id ?? "",
    itineraryId,
    segments: resolve1GJourneySegments(pkg, rawJourney, legIndex),
    departure: tripRow.departure,
    arrival: tripRow.arrival,
    flightNumber: tripRow.flightNumber,
    StopNum: tripRow.StopNum,
    duration: tripRow.duration,
    hpb_id: pkg.hpb_id,
    numberAdt: pkg.numberAdt,
    numberChd: pkg.numberChd,
    numberInf: pkg.numberInf,
    totalPrice: pkg.totalPrice,
    totalTaxAdt: pkg.totalTaxAdt,
    totalTaxChd: pkg.totalTaxChd,
    totalTaxInf: pkg.totalTaxInf,
  });

  const paxCounts = {
    adult: Number(pkg.numberAdt ?? context.paxCounts.adult) || 1,
    child: Number(pkg.numberChd ?? context.paxCounts.child) || 0,
    infant: Number(pkg.numberInf ?? context.paxCounts.infant) || 0,
  };

  return {
    searchId: context.searchId,
    resourceId:
      pick1GResourceFetchId(pkg) ??
      (pkg._resourceFetchId as string | undefined),
    itineraryId,
    trip: tripBody,
    fareOption: build1GFareOption(pkg, tripRow),
    paxCounts,
    tripsSource: context.tripsSource,
  };
}
