const VN1A_CLIENT_ID = "VN1A";

/** Vietnam Airlines (Airdata source VN1A or IATA VN). */
export function isVietnamAirlinesTrip(
  trip: Record<string, unknown> | null | undefined,
): boolean {
  if (!trip) return false;
  const source = String(trip.source ?? "").toUpperCase();
  if (source === "VN1A") return true;
  const airline = String(
    trip.airline ?? trip.airLineCode ?? trip.operator ?? "",
  ).toUpperCase();
  return airline === "VN";
}

/**
 * Airdata clientId from search trip — copy as-is ("" is valid for VJ).
 * Vietnam Airlines: empty clientId → "VN1A".
 * Backend may return camelCase or snake_case.
 */
export function getTripClientId(
  trip: Record<string, unknown> | null | undefined,
): string {
  if (!trip) return "";

  const raw = trip.clientId ?? trip.client_id;

  let clientId = "";
  if (raw === null || raw === undefined) clientId = "";
  else if (typeof raw === "string") clientId = raw;
  else if (typeof raw === "number" || typeof raw === "boolean")
    clientId = String(raw);

  if (!clientId.trim() && isVietnamAirlinesTrip(trip)) {
    return VN1A_CLIENT_ID;
  }
  return clientId;
}

/** Ensure trip always has clientId string when stored / sent to confirm-price. */
export function normalizeFlightTrip<T extends Record<string, unknown>>(
  trip: T,
): T & { clientId: string } {
  return {
    ...trip,
    clientId: getTripClientId(trip),
  };
}
