import { format, parseISO } from "date-fns";
import { handleSessionStorage } from "@/utils/Helper";
import { isBookingDeadlineExpired } from "@/utils/flightBookingFlow";
import { normalizeConfirmPriceResponse } from "@/utils/buildFlightConfirmPricePayload";
import type { ConfirmPriceResponse } from "@/types/flightConfirmPrice";
import {
  getSelectedFlight,
  loadSelectedFlightsForBooking,
} from "@/utils/selectedFlightStorage";
import type { SelectedFlight } from "@/types/selectedFlight";

export const FLIGHT_DRAFT_META_KEY = "flightBookingDraftMeta";
const DISMISS_STORAGE_KEY = "flightDraftDismissedKeys";

export type FlightDraftTripType = "oneWay" | "roundTrip";

export type FlightDraftStage =
  | "selecting"
  | "price_confirmed"
  | "held"
  | "pending_payment";

export interface FlightSearchRoute {
  startPoint: string;
  endPoint: string;
  tripType: FlightDraftTripType;
  departDate: string;
  returnDate: string;
}

export type FlightDraftFlow = "domestic" | "international" | "1g";

export interface FlightDraftMeta extends FlightSearchRoute {
  stage: FlightDraftStage;
  resumeUrl: string;
  orderCode?: string;
  bookingDeadline?: string | null;
  holdExpiresAt?: string | null;
  fromLabel?: string;
  toLabel?: string;
  /** depart:code|fareIdx|… or depart:…|return:… */
  selectionFingerprint?: string;
  updatedAt: number;
  flow: FlightDraftFlow;
}

export type FlightSelectionLeg = "depart" | "return";

export type FlightSelectionChangeAction =
  | { type: "allow" }
  | { type: "block_pending_payment"; orderCode?: string }
  | { type: "confirm_replace"; message: string }
  | { type: "auto_replaced" };

export interface FlightDraftMatch {
  meta: FlightDraftMeta;
  routeKey: string;
}

const BOOKING_STATE_KEYS = [
  "flightConfirmPrice",
  "bookingFlight",
  "flightBookingDraft",
  "flightPaymentPending",
] as const;

const SESSION_KEYS_TO_CLEAR = [
  FLIGHT_DRAFT_META_KEY,
  ...BOOKING_STATE_KEYS,
  "selectedFlightDepart",
  "selectedFlightReturn",
  "departFlight",
  "returnFlight",
  "flightSearchContext",
  "flightSession",
] as const;

function normalizeTripType(value: string | null | undefined): FlightDraftTripType {
  return value === "roundTrip" ? "roundTrip" : "oneWay";
}

export function buildFlightDraftRouteKey(route: FlightSearchRoute): string {
  const returnDate =
    route.tripType === "roundTrip" ? route.returnDate : route.departDate;
  return [
    route.startPoint,
    route.endPoint,
    route.tripType,
    route.departDate,
    returnDate,
  ].join("|");
}

export function isoToSearchDateParam(iso: string | undefined): string | null {
  if (!iso) return null;
  try {
    const d = parseISO(iso);
    if (Number.isNaN(d.getTime())) return null;
    return format(d, "ddMMyyyy");
  } catch {
    return null;
  }
}

export function routesMatchStrict(
  search: FlightSearchRoute,
  draft: FlightSearchRoute
): boolean {
  if (
    search.startPoint.toUpperCase() !== draft.startPoint.toUpperCase() ||
    search.endPoint.toUpperCase() !== draft.endPoint.toUpperCase()
  ) {
    return false;
  }
  if (search.tripType !== draft.tripType) return false;
  if (search.departDate !== draft.departDate) return false;
  if (search.tripType === "roundTrip") {
    return search.returnDate === draft.returnDate;
  }
  return true;
}

function getDismissedKeys(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DISMISS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isFlightDraftDismissed(routeKey: string): boolean {
  return getDismissedKeys().includes(routeKey);
}

export function dismissFlightDraft(routeKey: string): void {
  if (typeof window === "undefined") return;
  const keys = getDismissedKeys();
  if (!keys.includes(routeKey)) {
    keys.push(routeKey);
    localStorage.setItem(DISMISS_STORAGE_KEY, JSON.stringify(keys));
  }
}

function removeDismissForRoute(routeKey: string): void {
  if (typeof window === "undefined") return;
  const keys = getDismissedKeys().filter((k) => k !== routeKey);
  localStorage.setItem(DISMISS_STORAGE_KEY, JSON.stringify(keys));
}

export function getFlightDraftMeta(): FlightDraftMeta | null {
  const raw = handleSessionStorage("get", FLIGHT_DRAFT_META_KEY);
  if (!raw?.startPoint || !raw?.endPoint || !raw?.departDate) return null;
  return raw as FlightDraftMeta;
}

export function saveFlightDraftMeta(meta: FlightDraftMeta): void {
  handleSessionStorage("save", FLIGHT_DRAFT_META_KEY, {
    ...meta,
    updatedAt: Date.now(),
  });
  removeDismissForRoute(buildFlightDraftRouteKey(meta));
}

export function updateFlightDraftMeta(
  patch: Partial<FlightDraftMeta>
): FlightDraftMeta | null {
  const current = getFlightDraftMeta();
  if (!current) return null;
  const next: FlightDraftMeta = {
    ...current,
    ...patch,
    flow: patch.flow ?? current.flow,
    updatedAt: Date.now(),
  };
  saveFlightDraftMeta(next);
  return next;
}

export function clearFlightDraftSession(): void {
  handleSessionStorage("remove", [...SESSION_KEYS_TO_CLEAR]);
}

/** Xóa confirm/book/payment; giữ meta tuyến nếu đã có. */
export function clearFlightDraftBookingState(): void {
  handleSessionStorage("remove", [...BOOKING_STATE_KEYS]);
}

export function buildLegSelectionFingerprint(
  flight: Record<string, unknown>,
  fareOptionIndex: number,
  leg: FlightSelectionLeg
): string {
  const fareOptions = flight.fareOptions as
    | Record<string, unknown>[]
    | undefined;
  const fare = fareOptions?.[fareOptionIndex] as
    | Record<string, unknown>
    | undefined;
  const ticket = flight.selectedTicketClass as
    | Record<string, unknown>
    | undefined;
  const fareValue = String(
    fare?.fareValue ?? ticket?.fareValue ?? fare?.fareValue ?? ""
  );
  const flightCode = String(flight.flightCode ?? "");
  const depAt = String(
    (flight.departure as { at?: string } | undefined)?.at ?? ""
  );
  return `${leg}:${flightCode}:${fareOptionIndex}:${fareValue.slice(0, 48)}:${depAt}`;
}

export function buildCombinedSelectionFingerprint(input: {
  depart: { flight: Record<string, unknown>; fareOptionIndex: number } | null;
  return: { flight: Record<string, unknown>; fareOptionIndex: number } | null;
}): string {
  const parts: string[] = [];
  if (input.depart) {
    parts.push(
      buildLegSelectionFingerprint(
        input.depart.flight,
        input.depart.fareOptionIndex,
        "depart"
      )
    );
  }
  if (input.return) {
    parts.push(
      buildLegSelectionFingerprint(
        input.return.flight,
        input.return.fareOptionIndex,
        "return"
      )
    );
  }
  return parts.join("|");
}

export function isSameLegFingerprint(
  stored: string | undefined,
  leg: FlightSelectionLeg,
  newLegFp: string
): boolean {
  if (!stored) return false;
  const prefix = `${leg}:`;
  const legPart = stored.split("|").find((p) => p.startsWith(prefix));
  return legPart === newLegFp;
}

export function evaluateFlightSelectionChange(input: {
  searchRoute: FlightSearchRoute;
  leg: FlightSelectionLeg;
  newLegFingerprint: string;
  isDeselect: boolean;
}): FlightSelectionChangeAction {
  if (input.isDeselect) return { type: "allow" };

  let meta = getFlightDraftMeta();
  if (!meta) return { type: "allow" };
  if (!routesMatchStrict(input.searchRoute, meta)) return { type: "allow" };

  if (meta.stage === "pending_payment" || meta.stage === "held") {
    return {
      type: "block_pending_payment",
      orderCode: meta.orderCode,
    };
  }

  const sameLeg = isSameLegFingerprint(
    meta.selectionFingerprint,
    input.leg,
    input.newLegFingerprint
  );
  if (sameLeg) return { type: "allow" };

  if (meta.stage === "price_confirmed") {
    return {
      type: "confirm_replace",
      message:
        "Bạn đang giữ giá chuyến cũ. Chọn chuyến này sẽ hủy giữ giá và bắt đầu lại từ đầu.",
    };
  }

  return { type: "auto_replaced" };
}

export function applyNewFlightSelectionDraft(input: {
  searchRoute: FlightSearchRoute;
  selectionFingerprint: string;
  fromLabel?: string;
  toLabel?: string;
  flow?: FlightDraftFlow;
}): void {
  clearFlightDraftBookingState();
  saveFlightDraftMeta({
    ...input.searchRoute,
    stage: "selecting",
    resumeUrl: "/ve-may-bay/thong-tin-hanh-khach",
    selectionFingerprint: input.selectionFingerprint,
    fromLabel: input.fromLabel,
    toLabel: input.toLabel,
    orderCode: undefined,
    bookingDeadline: null,
    updatedAt: Date.now(),
    flow: input.flow ?? "domestic",
  });
}

export function refreshDraftMetaFingerprint(
  selectionFingerprint: string
): void {
  updateFlightDraftMeta({
    selectionFingerprint,
    stage: "selecting",
    resumeUrl: "/ve-may-bay/thong-tin-hanh-khach",
    orderCode: undefined,
    bookingDeadline: null,
  });
}

export function mergeSelectionFingerprintLeg(
  stored: string | undefined,
  leg: FlightSelectionLeg,
  newLegFp: string
): string {
  const parts = (stored ?? "")
    .split("|")
    .filter((p) => p.length > 0 && !p.startsWith(`${leg}:`));
  const depart =
    leg === "depart"
      ? newLegFp
      : parts.find((p) => p.startsWith("depart:"));
  const ret =
    leg === "return"
      ? newLegFp
      : parts.find((p) => p.startsWith("return:"));
  return [depart, ret].filter(Boolean).join("|");
}

export function replaceDraftLegSelection(input: {
  searchRoute: FlightSearchRoute;
  leg: FlightSelectionLeg;
  newLegFingerprint: string;
  fromLabel?: string;
  toLabel?: string;
}): void {
  const meta = getFlightDraftMeta();
  const merged = mergeSelectionFingerprintLeg(
    meta?.selectionFingerprint,
    input.leg,
    input.newLegFingerprint
  );
  clearFlightDraftBookingState();
  applyNewFlightSelectionDraft({
    searchRoute: input.searchRoute,
    selectionFingerprint: merged,
    fromLabel: input.fromLabel,
    toLabel: input.toLabel,
  });
}

export function buildSearchRouteFromParams(input: {
  startPoint: string;
  endPoint: string;
  tripType: string;
  departDate: string;
  returnDate: string;
}): FlightSearchRoute {
  const tripType = normalizeTripType(input.tripType);
  return {
    startPoint: input.startPoint,
    endPoint: input.endPoint,
    tripType,
    departDate: input.departDate,
    returnDate: tripType === "roundTrip" ? input.returnDate : input.departDate,
  };
}

function buildFingerprintFromStoredSelections(
  selections: SelectedFlight[]
): string | undefined {
  if (!selections.length) return undefined;
  return buildCombinedSelectionFingerprint({
    depart: selections[0]
      ? {
          flight: {
            ...(selections[0].trip as Record<string, unknown>),
            fareOptions: [selections[0].fareOption],
            selectedTicketClass: selections[0].fareOption,
          },
          fareOptionIndex: selections[0].fareOptionIndex ?? 0,
        }
      : null,
    return: selections[1]
      ? {
          flight: {
            ...(selections[1].trip as Record<string, unknown>),
            fareOptions: [selections[1].fareOption],
            selectedTicketClass: selections[1].fareOption,
          },
          fareOptionIndex: selections[1].fareOptionIndex ?? 0,
        }
      : null,
  });
}

function extractRouteFromTrip(
  trip: Record<string, unknown> | undefined
): { startPoint: string; endPoint: string; departDate: string | null } | null {
  if (!trip) return null;
  const departure = trip.departure as { IATACode?: string; at?: string };
  const arrival = trip.arrival as { IATACode?: string };
  if (!departure?.IATACode || !arrival?.IATACode) return null;
  return {
    startPoint: departure.IATACode,
    endPoint: arrival.IATACode,
    departDate: isoToSearchDateParam(departure.at),
  };
}

function inferMetaFromLegacySessions(): FlightDraftMeta | null {
  const bookingFlight = handleSessionStorage("get", "bookingFlight") as
    | Record<string, unknown>
    | null;
  if (bookingFlight) {
    const flights = bookingFlight.flights as Record<string, unknown>[] | undefined;
    const first = flights?.[0] as Record<string, unknown> | undefined;
    const route = extractRouteFromTrip(first);
    if (route?.departDate) {
      const second = flights?.[1] as Record<string, unknown> | undefined;
      const returnLeg = extractRouteFromTrip(second);
      const tripType: FlightDraftTripType =
        flights && flights.length > 1 ? "roundTrip" : "oneWay";
      const orderInfo = bookingFlight.orderInfo as
        | { sku?: string; status?: string; booking_deadline?: string }
        | undefined;
      const status = (orderInfo?.status ??
        bookingFlight.status) as string | undefined;
      let stage: FlightDraftStage = "pending_payment";
      if (status === "price_confirmed") stage = "price_confirmed";
      if (status === "held" || status === "holding") stage = "held";

      return {
        startPoint: route.startPoint,
        endPoint: route.endPoint,
        tripType,
        departDate: route.departDate,
        returnDate:
          tripType === "roundTrip" && returnLeg?.departDate
            ? returnLeg.departDate
            : route.departDate,
        stage,
        resumeUrl:
          stage === "pending_payment" || stage === "held"
            ? "/ve-may-bay/thong-tin-dat-cho"
            : "/ve-may-bay/thong-tin-hanh-khach",
        orderCode: orderInfo?.sku,
        bookingDeadline: orderInfo?.booking_deadline ?? null,
        updatedAt: Date.now(),
        flow: "domestic",
      };
    }
  }

  const confirmWrap = handleSessionStorage("get", "flightConfirmPrice") as
    | {
        confirm?: ConfirmPriceResponse;
      }
    | null;
  if (confirmWrap?.confirm) {
    const normalized = normalizeConfirmPriceResponse(
      confirmWrap.confirm as Record<string, unknown>
    );
    const selections = loadSelectedFlightsForBooking();
    const depart = selections[0]?.trip as Record<string, unknown> | undefined;
    const route = extractRouteFromTrip(depart);
    if (route?.departDate) {
      const returnSel = selections[1]?.trip as Record<string, unknown> | undefined;
      const returnRoute = extractRouteFromTrip(returnSel);
      const tripType: FlightDraftTripType =
        selections.length > 1 ? "roundTrip" : "oneWay";
      return {
        startPoint: route.startPoint,
        endPoint: route.endPoint,
        tripType,
        departDate: route.departDate,
        returnDate:
          tripType === "roundTrip" && returnRoute?.departDate
            ? returnRoute.departDate
            : route.departDate,
        stage: "price_confirmed",
        resumeUrl: "/ve-may-bay/thong-tin-hanh-khach",
        orderCode: normalized.orderCode || undefined,
        bookingDeadline: normalized.bookingDeadline,
        selectionFingerprint: buildFingerprintFromStoredSelections(selections),
        updatedAt: Date.now(),
        flow: "domestic",
      };
    }
  }

  const departSel = getSelectedFlight("depart");
  if (departSel?.trip) {
    const route = extractRouteFromTrip(departSel.trip as Record<string, unknown>);
    if (route?.departDate) {
      const returnSel = getSelectedFlight("return");
      const returnRoute = returnSel?.trip
        ? extractRouteFromTrip(returnSel.trip as Record<string, unknown>)
        : null;
      const tripType: FlightDraftTripType = returnSel ? "roundTrip" : "oneWay";
      const fp = buildFingerprintFromStoredSelections([departSel, ...(returnSel ? [returnSel] : [])]);
      return {
        startPoint: route.startPoint,
        endPoint: route.endPoint,
        tripType,
        departDate: route.departDate,
        returnDate:
          tripType === "roundTrip" && returnRoute?.departDate
            ? returnRoute.departDate
            : route.departDate,
        stage: "selecting",
        resumeUrl: "/ve-may-bay/thong-tin-hanh-khach",
        selectionFingerprint: fp,
        updatedAt: Date.now(),
        flow: "domestic",
      };
    }
  }

  return null;
}

function isTerminalOrExpired(meta: FlightDraftMeta): boolean {
  const deadline =
    meta.holdExpiresAt ?? meta.bookingDeadline ?? null;
  if (deadline && isBookingDeadlineExpired(deadline)) {
    return true;
  }
  return false;
}

export function findMatchingFlightDraftForFlow(
  search: FlightSearchRoute,
  flow?: FlightDraftFlow
): FlightDraftMatch | null {
  const match = findMatchingFlightDraft(search);
  if (!match) return null;
  if (flow && match.meta.flow !== flow) return null;
  return match;
}

export function findMatchingFlightDraft(
  search: FlightSearchRoute
): FlightDraftMatch | null {
  if (typeof window === "undefined") return null;

  let meta = getFlightDraftMeta();
  if (!meta) {
    meta = inferMetaFromLegacySessions();
    if (meta) saveFlightDraftMeta(meta);
  }

  if (!meta) return null;
  if (!routesMatchStrict(search, meta)) return null;

  const routeKey = buildFlightDraftRouteKey(meta);
  if (isFlightDraftDismissed(routeKey)) return null;
  if (isTerminalOrExpired(meta)) {
    clearFlightDraftSession();
    return null;
  }

  const bookingFlight = handleSessionStorage("get", "bookingFlight") as
    | { status?: string; orderInfo?: { status?: string } }
    | null;
  const terminalStatus =
    bookingFlight?.status === "issued" ||
    bookingFlight?.status === "paid_book_failed" ||
    bookingFlight?.orderInfo?.status === "issued" ||
    bookingFlight?.orderInfo?.status === "paid_book_failed";
  if (terminalStatus) {
    clearFlightDraftSession();
    return null;
  }

  return { meta, routeKey };
}

export function saveFlightDraftMetaForSearch(input: {
  startPoint: string;
  endPoint: string;
  tripType: string;
  departDate: string;
  returnDate: string;
  fromLabel?: string;
  toLabel?: string;
  stage: FlightDraftStage;
  resumeUrl: string;
  orderCode?: string;
  bookingDeadline?: string | null;
  holdExpiresAt?: string | null;
  selectionFingerprint?: string;
  flow?: FlightDraftFlow;
}): FlightDraftMeta {
  const route = buildSearchRouteFromParams(input);
  const meta: FlightDraftMeta = {
    ...route,
    stage: input.stage,
    resumeUrl: input.resumeUrl,
    orderCode: input.orderCode,
    bookingDeadline: input.bookingDeadline ?? null,
    holdExpiresAt:
      input.holdExpiresAt ?? input.bookingDeadline ?? null,
    fromLabel: input.fromLabel,
    toLabel: input.toLabel,
    selectionFingerprint: input.selectionFingerprint,
    updatedAt: Date.now(),
    flow: input.flow ?? "domestic",
  };
  saveFlightDraftMeta(meta);
  return meta;
}

export function formatDraftDateLabel(ddMMyyyy: string): string {
  try {
    const d = parseISO(
      `${ddMMyyyy.slice(4, 8)}-${ddMMyyyy.slice(2, 4)}-${ddMMyyyy.slice(0, 2)}`
    );
    if (Number.isNaN(d.getTime())) return ddMMyyyy;
    return format(d, "dd/MM/yyyy");
  } catch {
    return ddMMyyyy;
  }
}
