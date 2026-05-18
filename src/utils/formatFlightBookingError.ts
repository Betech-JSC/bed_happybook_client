import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

export type FlightBookingErrorCode =
  | "departure_too_close"
  | "flight_departure_passed"
  | "confirm_price_failed"
  | string;

export interface FlightBookingErrorDetails {
  departure_time?: string;
  min_hours_before_departure?: number;
  latest_payment_time?: string;
  reason?: string;
}

export interface FlightBookingErrorDisplay {
  code: FlightBookingErrorCode;
  message: string;
  details: string[];
}

function formatErrorDateTime(
  iso: string | undefined,
  language: "vi" | "en"
): string | null {
  if (!iso || typeof iso !== "string") return null;
  try {
    const d = parseISO(iso);
    if (Number.isNaN(d.getTime())) return null;
    if (language === "vi") {
      return format(d, "HH:mm 'ngày' dd/MM/yyyy", { locale: vi });
    }
    return format(d, "HH:mm, MMM d yyyy");
  } catch {
    return null;
  }
}

function extractPayload(payload: unknown): {
  code: string;
  errors: FlightBookingErrorDetails;
  rawMessage?: string;
} {
  const p =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};
  const errors = (p.errors ?? {}) as FlightBookingErrorDetails;
  const code = String(p.message ?? p.code ?? "").trim();
  return {
    code,
    errors,
    rawMessage: typeof p.message === "string" ? p.message : undefined,
  };
}

export function formatFlightBookingError(
  payload: unknown,
  language: "vi" | "en" = "vi"
): FlightBookingErrorDisplay {
  const { code, errors } = extractPayload(payload);
  const minHours = Number(errors.min_hours_before_departure ?? 4) || 4;
  const departureLabel = formatErrorDateTime(errors.departure_time, language);
  const latestPayLabel = formatErrorDateTime(
    errors.latest_payment_time,
    language
  );

  if (code === "departure_too_close") {
    const message =
      language === "vi"
        ? `Vui lòng chọn chuyến bay cách giờ khởi hành ít nhất ${minHours} giờ.`
        : `Please choose a flight departing at least ${minHours} hours from now.`;
    const details: string[] = [];
    if (departureLabel) {
      details.push(
        language === "vi"
          ? `Giờ khởi hành: ${departureLabel}`
          : `Departure: ${departureLabel}`
      );
    }
    if (latestPayLabel) {
      details.push(
        language === "vi"
          ? `Hạn hoàn tất đặt vé: trước ${latestPayLabel}`
          : `Complete booking by: ${latestPayLabel}`
      );
    }
    if (errors.reason && language === "en") {
      details.push(String(errors.reason));
    }
    return { code, message, details };
  }

  if (code === "flight_departure_passed") {
    return {
      code,
      message:
        language === "vi"
          ? "Chuyến bay đã khởi hành hoặc quá giờ đặt. Vui lòng chọn chuyến khác."
          : "This flight has already departed. Please choose another flight.",
      details: departureLabel
        ? [
            language === "vi"
              ? `Giờ khởi hành: ${departureLabel}`
              : `Departure: ${departureLabel}`,
          ]
        : [],
    };
  }

  if (code === "confirm_price_failed" || code === "fare_token_invalid") {
    return {
      code,
      message:
        language === "vi"
          ? "Token giá hoặc phiên tìm kiếm không còn hợp lệ (thường gặp với VietJet). Vui lòng tìm chuyến bay lại và xác nhận giá trong vài phút."
          : "Fare token or search session is invalid. Please search again and confirm promptly.",
      details: [],
    };
  }

  const { rawMessage } = extractPayload(payload);
  const fallbackMessage =
    (rawMessage && !["fail", "error"].includes(code) ? rawMessage : null) ||
    (language === "vi"
      ? "Có lỗi xảy ra. Vui lòng thử lại sau."
      : "Something went wrong. Please try again.");

  return {
    code: code || "unknown",
    message: fallbackMessage,
    details: [],
  };
}

export function flightBookingErrorToastText(
  payload: unknown,
  language: "vi" | "en",
  fallback: string
): string {
  const { message, details, code } = formatFlightBookingError(payload, language);
  if (!code || code === "unknown") {
    const p = extractPayload(payload);
    if (p.rawMessage && p.rawMessage !== "fail") {
      return p.rawMessage;
    }
    return fallback;
  }
  if (!details.length) return message;
  return `${message}\n${details.join("\n")}`;
}

export function isFlightDepartureError(code: string): boolean {
  return code === "departure_too_close" || code === "flight_departure_passed";
}
