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

const ERROR_TRANSLATIONS_VI: Record<string, string> = {
  "Date of birth is not valid for the selected passenger type":
    "Ngày sinh không hợp lệ so với loại hành khách đã chọn (Người lớn/Trẻ em/Em bé). Vui lòng kiểm tra lại thông tin ngày sinh.",
  "The passenger type is not valid":
    "Loại hành khách không hợp lệ.",
  "Duplicate booking":
    "Đặt chỗ bị trùng lặp. Vui lòng kiểm tra lại đơn hàng.",
  "Seat class is not available":
    "Hạng ghế này hiện không còn chỗ trống.",
  "Flight is full":
    "Chuyến bay đã hết chỗ.",
  "Format of date is invalid":
    "Định dạng ngày tháng không hợp lệ.",
  "Passport is required for international flight":
    "Vui lòng điền thông tin hộ chiếu cho chuyến bay quốc tế.",
  "Passport expired date is invalid":
    "Ngày hết hạn hộ chiếu không hợp lệ.",
  "org.hibernate.exception.DataException: could not insert: [com.g2switch.gdsmodel.Fare]":
    "Lỗi hệ thống đối tác khi lưu giá vé (GDS Fare Data Exception). Vui lòng thử lại hoặc chọn vé khác.",
  "*0 AVAIL/WL CLOSED*":
    "Hạng vé này hiện đã hết chỗ hoặc hãng bay đã đóng lượt đặt chỗ. Vui lòng quay lại chọn chuyến bay hoặc hạng ghế khác.",
  "*0 AVAIL/WL OPEN*":
    "Hạng vé này hiện đã hết chỗ (chỉ mở hàng đợi/chờ). Vui lòng quay lại chọn chuyến bay hoặc hạng ghế khác.",
  "*SELL RESTRICTED*":
    "Hãng hàng không hạn chế bán hạng vé hoặc hành trình này qua kênh trực tuyến. Vui lòng chọn chuyến bay hoặc hạng ghế khác.",
  "DATE SEQUENCE IN ITINERARY NEEDS VERIFICATION":
    "Trình tự ngày bay giữa các chặng không hợp lệ (ví dụ: ngày bay về trước ngày bay đi, hoặc thời gian nối chuyến không đúng thứ tự). Vui lòng kiểm tra lại lịch trình.",
  "FLIGHT SEGMENTS UNAVAILABLE IN THE REQUESTED CLASS":
    "Hạng đặt chỗ hoặc vé bạn chọn hiện không còn khả dụng trên chuyến bay này (đã hết chỗ ở hạng vé này). Vui lòng chọn chuyến bay hoặc hạng vé khác.",
  "UNKNOWN ERROR":
    "Hệ thống hãng bay phản hồi lỗi không xác định hoặc kết nối tạm thời bị gián đoạn. Vui lòng thử lại hoặc chọn hành trình khác.",
  "TRAVELPORT_NOT_SUPPORTED_THIS_AIRLINE":
    "Hãng hàng không này hiện không được hỗ trợ đặt trực tuyến qua hệ thống đối tác. Vui lòng chọn chuyến bay của hãng hàng không khác hoặc liên hệ nhân viên để được hỗ trợ đặt thủ công.",
  "CHECK AVAILABILITY":
    "Hạng vé này hiện không còn khả dụng trực tuyến hoặc chuyến bay quá cận giờ khởi hành. Vui lòng chọn chuyến bay khác hoặc liên hệ nhân viên hỗ trợ.",
  "REQUESTED CABIN HAS NO AVAILABLE FARES":
    "Hạng ghế bạn chọn hiện đã hết chỗ trên hệ thống hãng bay. Vui lòng tìm kiếm lại để cập nhật tình trạng chỗ mới nhất hoặc chọn chuyến bay khác.",
  "NO VALID FARE FOR INPUT CRITERIA":
    "Không tìm thấy giá vé hợp lệ cho hành trình này. Hạng vé có thể đã hết hoặc điều kiện vé đã thay đổi. Vui lòng tìm kiếm lại.",
  "CABIN CLASS NOT AVAILABLE":
    "Hạng ghế yêu cầu hiện không khả dụng trên chuyến bay này. Vui lòng chọn hạng ghế hoặc chuyến bay khác.",
  "Order is not ready for holding.":
    "Yêu cầu đặt vé này đã được xử lý hoặc không còn hiệu lực. Vui lòng quay lại tìm kiếm chuyến bay mới.",
  "TRAVELPORT_CANNOT_HOLD_BOOKING_72_HOURS_BEFORE_DEPARTURE_TIME":
    "Hệ thống không hỗ trợ giữ chỗ nháp cho chuyến bay khởi hành trong vòng 72 giờ (3 ngày). Vui lòng chọn chuyến bay cách thời điểm hiện tại trên 3 ngày.",
  "Unknown FareRuleFailureAVT: RoutingFailure,BookingClassFailure":
    "Hệ thống hãng bay từ chối giữ vé do chặng bay hoặc hạng đặt chỗ không khả dụng tại thời điểm này. Vui lòng chọn chuyến bay hoặc hạng vé khác.",
  "OFFER NOT FOUND":
    "Phiên giá vé (Offer) của hãng hàng không đã hết hạn hoặc không còn hiệu lực. Vui lòng quay lại tìm kiếm chuyến bay mới để cập nhật giá vé mới nhất.",
  "AIR_CHINA_CANNOT_BE_BOOKED_WITHOUT_VIETNAM_AIRPORT":
    "Hành trình của hãng Air China (CA) phải có điểm khởi hành hoặc điểm đến tại Việt Nam mới có thể đặt trực tuyến. Vui lòng chọn hành trình khác hoặc liên hệ booker.",
  "*UNABLE - FLIGHT NOT FOUND IN VENDOR SYSTEM*":
    "Hệ thống hãng bay báo chuyến bay này không còn khả dụng hoặc đã thay đổi lịch trình. Vui lòng quay lại tìm kiếm chuyến bay mới.",
  "AGENCY_CAN_NOT_PAYMENT_THIS_AIRLINE":
    "Tài khoản đại lý không có quyền tự động xuất vé cho hãng này. Đơn hàng sẽ được nhân viên phòng vé xử lý thủ công.",
  "VJ_CANNOT_HOLD_BOOKING_24_HOURS_BEFORE_DEPARTURE_TIME":
    "Hãng VietJet không cho phép giữ chỗ dưới 24 giờ trước khởi hành. Vui lòng liên hệ bộ phận hỗ trợ khách hàng để được hỗ trợ xuất vé.",
  "vj_near_departure_manual_needed":
    "Hãng VietJet không cho phép giữ chỗ dưới 24 giờ trước khởi hành. Đơn hàng đang được Booker xử lý thủ công.",
  "REQUEST REJECTED - TOO CLOSE FROM DEPARTURE":
    "Yêu cầu đặt giữ chỗ bị từ chối do thời điểm bay quá cận giờ (quá giờ giữ chỗ của hãng). Vui lòng chọn chuyến bay khác.",
  "confirm_price_http_error":
    "Lỗi kết nối hệ thống xác nhận giá vé. Vui lòng thử lại sau.",
  "confirm_price_missing_booking_id":
    "Hệ thống đối tác không trả về mã giữ chỗ. Vui lòng thử lại sau hoặc chọn chuyến bay khác.",
  "confirm_price_failed":
    "Xác nhận giá vé thất bại. Vui lòng thử lại hoặc chọn chuyến bay khác.",
};

const ERROR_TRANSLATIONS_EN: Record<string, string> = {
  "*0 AVAIL/WL CLOSED*":
    "This booking class is sold out or the airline has closed bookings for this class. Please go back and select a different flight or booking class.",
  "*0 AVAIL/WL OPEN*":
    "This booking class is currently sold out (only waitlist open). Please go back and select a different flight or booking class.",
  "*SELL RESTRICTED*":
    "The airline has restricted online sales for this booking class or itinerary. Please select a different flight or booking class.",
  "TRAVELPORT_CANNOT_HOLD_BOOKING_72_HOURS_BEFORE_DEPARTURE_TIME":
    "Holding is not supported for flights departing within 72 hours (3 days). Please select a flight departing more than 3 days from now.",
  "Unknown FareRuleFailureAVT: RoutingFailure,BookingClassFailure":
    "The airline rejected holding due to routing or booking class restrictions. Please select a different flight or booking class.",
  "OFFER NOT FOUND":
    "The fare offer has expired. Please go back and search again to get the latest price.",
  "TRAVELPORT_NOT_SUPPORTED_THIS_AIRLINE":
    "This airline is not supported for online booking through our partner system. Please choose a different airline or contact support.",
  "AIR_CHINA_CANNOT_BE_BOOKED_WITHOUT_VIETNAM_AIRPORT":
    "Air China (CA) flights cannot be booked online for itineraries that do not start or end in Vietnam. Please choose another route or contact support.",
  "*UNABLE - FLIGHT NOT FOUND IN VENDOR SYSTEM*":
    "The airline reported that this flight is no longer available or the schedule has changed. Please search for a new flight.",
  "AGENCY_CAN_NOT_PAYMENT_THIS_AIRLINE":
    "Our agency account is not authorized to auto-issue tickets for this airline. The order will be handled manually by bookers.",
  "VJ_CANNOT_HOLD_BOOKING_24_HOURS_BEFORE_DEPARTURE_TIME":
    "VietJet does not allow booking holds within 24 hours of departure. Please contact support to issue your ticket.",
  "vj_near_departure_manual_needed":
    "VietJet does not allow booking holds within 24 hours of departure. The order is being handled manually by bookers.",
  "REQUEST REJECTED - TOO CLOSE FROM DEPARTURE":
    "Request rejected because it is too close to the departure time. Please choose another flight.",
  "confirm_price_http_error":
    "System connection error while confirming price. Please try again later.",
  "confirm_price_missing_booking_id":
    "Partner system did not return a booking ID. Please try again or select another flight.",
  "confirm_price_failed":
    "Price confirmation failed. Please try again or select another flight.",
};

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
  
  let rawMessage = typeof p.message === "string" ? p.message : undefined;
  
  const innerData = p.data && typeof p.data === "object" ? (p.data as Record<string, unknown>) : null;
  if (innerData) {
    if (!rawMessage || ["fail", "error"].includes(rawMessage.toLowerCase())) {
      if (typeof innerData.detailedMessage === "string" && innerData.detailedMessage) {
        rawMessage = innerData.detailedMessage;
      } else if (typeof innerData.message === "string" && innerData.message) {
        rawMessage = innerData.message;
      }
    }
  }

  const code = String(p.code ?? p.message ?? "").trim();
  return {
    code,
    errors,
    rawMessage,
  };
}

export function formatFlightBookingError(
  payload: unknown,
  language: "vi" | "en" = "vi"
): FlightBookingErrorDisplay {
  const { code, errors, rawMessage } = extractPayload(payload);
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

  if (
    code === "confirm_price_failed" ||
    code === "fare_token_invalid" ||
    code === "FARE_ALREADY_EXPIRED" ||
    rawMessage === "FARE_ALREADY_EXPIRED"
  ) {
    return {
      code: "FARE_ALREADY_EXPIRED",
      message:
        language === "vi"
          ? "Phiên giữ giá vé của Vietjet đã hết hiệu lực. Vui lòng quay lại tìm kiếm chuyến bay để cập nhật giá vé mới nhất."
          : "Vietjet's fare session has expired. Please search for the flight again to get the latest fare.",
      details: [],
    };
  }

  // rawMessage is already extracted at the top
  let fallbackMessage =
    rawMessage && !["fail", "error"].includes(code.toLowerCase()) ? rawMessage : null;

  const lookupKey = fallbackMessage || code;

  if (language === "vi" && lookupKey && ERROR_TRANSLATIONS_VI[lookupKey]) {
    fallbackMessage = ERROR_TRANSLATIONS_VI[lookupKey];
  } else if (language === "en" && lookupKey && ERROR_TRANSLATIONS_EN[lookupKey]) {
    fallbackMessage = ERROR_TRANSLATIONS_EN[lookupKey];
  } else if (!fallbackMessage) {
    fallbackMessage =
      language === "vi"
        ? "Có lỗi xảy ra. Vui lòng thử lại sau."
        : "Something went wrong. Please try again.";
  }

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
