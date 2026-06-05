/** Đọc điểm đi/đến từ segment (object lồng hoặc mã IATA phẳng). */
export function readSegmentEndpoint(
  segment: Record<string, unknown> | null | undefined,
  kind: "departure" | "arrival"
): { IATACode?: string; at?: string; timezone?: string } | null {
  if (!segment) return null;

  const raw = segment[kind];
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const IATACode =
      typeof obj.IATACode === "string"
        ? obj.IATACode
        : typeof obj.code === "string"
          ? obj.code
          : undefined;
    const at = typeof obj.at === "string" ? obj.at : undefined;
    const timezone =
      typeof obj.timezone === "string" ? obj.timezone : undefined;
    if (IATACode || at) return { IATACode, at, timezone };
  }

  if (typeof raw === "string" && raw.trim()) {
    const timeKey = kind === "departure" ? "departureTime" : "arrivalTime";
    const at =
      typeof segment[timeKey] === "string" ? (segment[timeKey] as string) : undefined;
    return { IATACode: raw.trim(), at };
  }

  const altCode = segment[kind === "departure" ? "origin" : "destination"];
  if (typeof altCode === "string" && altCode.trim()) {
    const timeKey = kind === "departure" ? "departureTime" : "arrivalTime";
    return {
      IATACode: altCode.trim(),
      at:
        typeof segment[timeKey] === "string"
          ? (segment[timeKey] as string)
          : undefined,
    };
  }

  return null;
}
