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
  "\"field\":\"PNRSearch\",\"message\":\"1 | \nCHECK FORMAT\"":
    "Không tìm thấy vé - Vui lòng kiểm tra mã PNR và thử lại.",
  "*0 AVAIL/WL CLOSED*":
    "Hạng vé này hiện đã hết chỗ hoặc hãng bay đã đóng lượt đặt chỗ. Vui lòng quay lại chọn chuyến bay hoặc hạng ghế khác.",
  "*0 AVAIL/WL OPEN*":
    "Hạng vé này hiện đã hết chỗ (chỉ mở hàng đợi/chờ). Vui lòng quay lại chọn chuyến bay hoặc hạng ghế khác.",
  "*SELL RESTRICTED*":
    "Hãng hàng không hạn chế bán hạng vé hoặc hành trình này qua kênh trực tuyến. Vui lòng chọn chuyến bay hoặc hạng ghế khác.",
  "*UNABLE - FLIGHT NOT FOUND IN VENDOR SYSTEM*":
    "Hệ thống hãng bay báo chuyến bay này không còn khả dụng hoặc đã thay đổi lịch trình. Vui lòng quay lại tìm kiếm chuyến bay mới.",
  "1902 | ITEM TOO LONG / NOT ENTERED":
    "Đặt vé không thành công - Tên của hành khách vượt quá giới hạn ký tự cho phép - Vui lòng liên hệ booker để được hỗ trợ!",
  "500 Internal Server Erorr":
    "LỖI TỪ HÃNG: VUI LÒNG KIỂM TRA EMAIL HOẶC LIÊN HỆ BOOKER TRƯỚC KHI THỬ LẠI",
  "500 Internal Server Error":
    "LỖI TỪ HÃNG: VUI LÒNG KIỂM TRA EMAIL HOẶC LIÊN HỆ BOOKER TRƯỚC KHI THỬ LẠI",
  "[NUMBER] IS INVALID DATA FORMAT":
    "Nhập sai định dạng ",
  "A flight has been found to be unavailable. Please pick another option":
    "Có chuyến bay không khả dụng, vui lòng chọn chuyến khác và thử lại !",
  "A flight is unavailable. Please pick another option":
    "Có chuyến bay không khả dụng trong hành trình đã chọn, vui lòng chọn hành trình khác và thử lại",
  "Account disabled":
    "Tài khoản tạm dừng hoạt động, vui lòng liên hệ bộ phận Kinh doanh để được hỗ trợ.",
  "ACCOUNT_CAN_NOT_ACTION_THIS_SOURCE":
    "Không thể thực hiện hành động này với tài khoản này.",
  "ACCOUNT_IS_NOT_ACTIVE":
    "Tài khoản tạm dừng hoạt động, vui lòng liên hệ bộ phận Kinh doanh để được hỗ trợ.",
  "ACCOUNTS_PAYABLE_BOOK_CLOSING":
    "Lỗi khoá sổ công nợ",
  "ACCOUNTS_PAYABLE_BOOK_CLOSING_NOT_FOUND":
    "Không tìm thấy Khoá sổ công nợ",
  "ACCOUNTS_PAYABLE_NOT_FOUND":
    "Không tìm được công nợ",
  "ACCOUNTS_PAYABLE_WITH_AGENCY_AND_BOOKER_CONFLICT":
    "Công nợ của đại lý và Booker không khớp",
  "AG_HAS_BEEN_BANNED":
    "Tài khoản đại lý đã bị cấm đăng bán. Vui lòng liên hệ Sales để được hỗ trợ.",
  "AGENCY_CAN_NOT_BOOKING_THIS_AIRLINE":
    "Đại lý của bạn không có quyền đặt booking với hãng hàng không này, vui lòng liên hệ đại lý cấp cao hơn",
  "AGENCY_CAN_NOT_BOOKING_THIS_SOURCE":
    "Đại lý không có quyền đặt vé hệ thống này",
  "AGENCY_CAN_NOT_PAYMENT_THIS_AIRLINE":
    "Tài khoản đại lý không có quyền tự động xuất vé cho hãng này. Đơn hàng sẽ được nhân viên phòng vé xử lý thủ công.",
  "AGENCY_CAN_NOT_REFUND_THIS_AIRLINE":
    "Đại lý chưa được cấp quyền hoàn vé cho hãng này.",
  "AGENCY_CAN_NOT_VOID_THIS_AIRLINE":
    "Đại lý chưa được cấp quyền VOID vé cho hãng này.",
  "AGENCY_CANNOT_UPDATE_HIGHER_AGENCY_LEVEL":
    "Không được cập nhật thông tin đại lý cấp trên.",
  "AGENCY_CODE_ALREADY_IN_USE":
    "Mã đại lý đã tồn tại",
  "AGENCY_CONFIG_DISABLED_PAYMENT_IMMEDIATE_MODIFY_SOURCES":
    "Không hỗ trợ thanh toán ngay cho hãng này, vui lòng chọn thanh toán sau!",
  "AGENCY_CONFIG_NOT_FOUND":
    "Không tìm thấy cấu hình phí xuất vé",
  "AGENCY_IS_NOT_YET_ACTIVATED":
    "Đại lý chưa được kích hoạt",
  "AGENCY_IS_ONLY_ALLOW_UPDATE_THEIR_BANK_ACCOUNTS":
    "Chỉ đại lý được phép cập nhật tài khoản ngân hàng của họ.",
  "AGENCY_MANAGER_NOT_FOUND":
    "Không tìm thấy Quản lý Đại lý.",
  "AGENCY_NOT_FOUND":
    "Không tìm thấy Đại lý. Vui lòng kiểm tra lại thông tin Đại lý.",
  "AGENCY_ONLY_CANCEL_ALL_ITINERARY":
    "Đại lý chỉ được phép huỷ tất cả các hành trình",
  "AGENCY_OR_BOOKER_NOT_FOUND":
    "Đại lý hoặc Booker không tồn tại",
  "AGENCY_OR_BOOKER_REQUIRE":
    "Bắt buộc phải là Đại lý hoặc Booker",
  "AGENCY_PACKAGE_CONFIG_NOT_FOUND":
    "Vui lòng mua gói trước khi thao tác!",
  "AGENCY_TIER_1_DO_NOT_HAVE_BOOKER_ID":
    "Đại lý cấp 1 không có BookerID",
  "AIR_CHINA_CANNOT_BE_BOOKED_WITHOUT_VIETNAM_AIRPORT":
    "Hành trình của hãng Air China (CA) phải có điểm khởi hành hoặc điểm đến tại Việt Nam mới có thể đặt trực tuyến. Vui lòng chọn hành trình khác hoặc liên hệ booker.",
  "AIR_PRICE_QUOTE_NOT_FOUND":
    "Không có giá vé mới cho hành trình hiện tại !",
  "AIRPORT_NOT_FOUND":
    "Sân bay không tồn tại",
  "AK_BOOKING_EXCEPTION":
    "AK Booking: Kết nối đến hãng bị gián đoạn, vui lòng thử lại",
  "AK_BOOKING_HOLD_CANNOT_MODIFY":
    "AK - Vui lòng thanh toán vé trước khi mua thêm dịch vụ!",
  "AK_PASSENGER_ALREADY_HAVE_BAGGAGE_ON_SEGMENT":
    "Các hãng giá rẻ chỉ được mua 1 gói hành lý/khách/chặng. Vui lòng liên hệ booker để được hỗ trợ!",
  "AK_PAYNOW_INVALID_CURRENCY_CODE":
    "Thanh toán AK không thành công, vui lòng liên hệ booker xuất vé giúp!",
  "AK_WARNING_EXCEPTION":
    "AK Warning: Kết nối đến hãng bị gián đoạn, vui lòng thử lại",
  "AUTO_ISSUE_FOR_THIS_SOURCE_IS_CURRENTLY_NOT_SUPPORTED":
    "Tính năng đặt giờ xuất vé cho hãng này hiện không được hỗ trợ.",
  "AUTO_ISSUE_TIME_MUST_BE_GREATER_THAN_NOW":
    "Thời gian đặt giờ xuất vé phải lớn hơn thời gian hiện tại",
  "BALANCE_ALREADY_MATCH_WITH_AMOUNT":
    "Không thể chỉnh sửa do quỹ của đại lý đang bằng với quỹ muốn điều chỉnh, vui lòng kiểm tra lại quỹ!",
  "BIRTH_DATE_MUST_BE_NIL_OR_DATE":
    "Nhập sai định dạng Ngày sinh hành khách",
  "BOOK_WITH_SSR_IS_NOT_SUPPORTED":
    "Chưa hỗ trợ mua hành lý/ dịch vụ bổ sung cho hành trình này, vui lòng liên hệ booker để thao tác!",
  "BOOKER_CANNOT_PAYMENT_1G":
    "Bạn không có quyền xuất vé 1G",
  "BOOKER_ID_ALREADY_IN_USE":
    "BookerID đã được sử dụng",
  "BOOKER_MUST_BELONG_WITH_AGENCY":
    "Booker phải thuộc đại lý",
  "Booking is already paid":
    "Mã đặt chỗ đã được thanh toán, vui lòng kiểm tra trước khi thao tác lại",
  "BOOKING_CODE_ALREADY_IN_USE":
    "Mã đặt chỗ đã được sử dụng",
  "BOOKING_NOT_ELIGIBLE":
    "Không thể đăng bán, nếu trước đó code không được xuất trên hệ thống.",
  "BOOKING_NOT_FOUND":
    "Booking không tồn tại",
  "BOOKING_NOT_REFUNDED":
    "Mã đặt chỗ chưa được hoàn định danh",
  "BOOKING_ROOM_NOT_AVAILABLE":
    "Không còn phòng trống Vui lòng cập nhật lại kết quả tìm kiếm.",
  "CABIN CLASS NOT AVAILABLE":
    "Hạng ghế yêu cầu hiện không khả dụng trên chuyến bay này. Vui lòng chọn hạng ghế hoặc chuyến bay khác.",
  "Can not issue ticket, please contact for more information":
    "Lỗi thanh toán từ hãng, vui lòng liên hệ booker xuất hộ!",
  "Can not issue ticket. Please contact support for assistance.":
    "Không thể xuất vé. Vui lòng liên hệ bộ phận hỗ trợ để được trợ giúp.",
  "CAN_NOT_ADD_MULTIPLE_AUTHENTICATOR":
    "Không thể tạo nhiều mã Xác thực 2 bước (MFA)",
  "CAN_NOT_CREATE_USER":
    "Không thể tạo tài khoản",
  "CAN_NOT_CREATE_WITHIN_ONE_MINUTE":
    "Không thể tạo trong vòng một phút, vui lòng thử lại sau một phút.",
  "CAN_NOT_DELETE_REAL_TIME_SALE_REPORT":
    "Không thể xoá báo cáo bán hiện tại",
  "CAN_NOT_EDIT_REAL_TIME_SALE_REPORT":
    "Không thể sửa báo cáo bán hiện tại",
  "CAN_NOT_SET_AUTO_ISSUE_WITHOUT_TIME_HOLD":
    "Vui lòng chờ sau khi có thời hạn giữ chỗ để có thể hẹn giờ xuất vé.",
  "CAN_NOT_SET_BOOKER_ID_FOR_MAMA":
    "Không thể thiết lập BookerID cho F1",
  "CAN_NOT_UPDATE_ANOTHER_BOOKER_ID":
    "Không thể sửa BookerID",
  "CAN_ONLY_DELETE_TOP_UP_IN_STATUS_PENDING_PAYMENT":
    "Chỉ có thể xoá yêu cầu nạp tiền ở trạng thái chờ thanh toán",
  "CANNOT_ACTIVE_CLOSED_AGENCY":
    "Không thể bật trạng thái hoạt động với đại lý \"Đã thanh lý\" hợp đồng",
  "CANNOT_ADD_INFANT_WITH_USED_TICKET":
    "Vé đã sử dụng, không thể thêm em bé, vui lòng liên hệ booker hỗ trợ!",
  "CANNOT_CANCEL_PAID_BOOKING":
    "Không thể huỷ vé đã thanh toán, vui lòng sử dụng tính năng void vé trước khi huỷ chuyến bay hoặc sử dụng tính năng hoàn vé!",
  "CANNOT_CHANGE_BALANCE_MORE_THAN_10_ BILLIONS":
    "Không thể chỉnh sửa số dư lớn hơn 10 tỉ.",
  "CANNOT_CHANGE_BALANCE_MORE_THAN_10_BILLIONS":
    "Không thể chỉnh sửa số dư lớn hơn 10 tỉ.",
  "CANNOT_CHANGE_EXCHANGE_TICKET":
    "Chỉ được đổi vé 1 lần, vui lòng liên hệ booker hỗ trợ!",
  "CANNOT_CHANGE_FLIGHT_WITH_REFUND_IDENTIFICATION":
    "Không hỗ trợ đổi chuyến bay đang hoàn định danh, vui lòng liên hệ team Sales.",
  "CANNOT_CONFIRM_TOPUP_FROM_OTHER_AGENCY":
    "Không thể xác nhận nạp tiền từ đại lý khác.",
  "CANNOT_DELETE_SALES_REPORT_BEFORE_YESTERDAY":
    "Không thể xoá báo cáo bán ngày hôm nay",
  "CANNOT_EDIT_ANOTHER_EMPLOYEE_TICKET_CONFIG":
    "Không thể sửa cấu hình mặt vé của tài khoản khác",
  "CANNOT_EDIT_CLOSED_SALE_REPORT":
    "Không thể sửa báo cáo bán đã đóng",
  "CANNOT_EDIT_SALES_REPORT_BEFORE_YESTERDAY":
    "Không thể sửa báo cáo bán trước ngày hôm nay",
  "CANNOT_EDIT_THIS_AGENCY":
    "Không thể chỉnh sửa đại lý này.",
  "CANNOT_MODIFY_BOOKING_AFTER_CHECKING_IN":
    "Vé đã checkin, không cho phép mua thêm dịch vụ bổ sung",
  "CANNOT_MODIFY_BOOKING_BEFORE_PAYMENT":
    "Vui lòng thanh toán trước khi thực hiện thao tác này.",
  "CANNOT_MODIFY_BOOKING_OUTSIDE":
    "Không thể chỉnh sửa booking ngoài hệ thống.",
  "CANNOT_MODIFY_PNR_WITH_UNPAID_SSR":
    "Vé này đang có dịch vụ treo, vui lòng liên hệ booker để thanh toán hoặc gỡ phần dịch vụ treo trước khi thao tác lại.",
  "CANNOT_MODIFY_SSR_24_HOURS_BEFORE_DEPARTURE_TIME":
    "Không thể mua SSR trong vòng 24 giờ trước giờ khởi hành. Vui lòng liên hệ booker để được hỗ trợ.",
  "CANNOT_PAYMENT_BOOKING_WITH_INFANT_UC":
    "Không được phép thanh toán vé chưa có chỗ cho em bé!",
  "CANNOT_PAYMENT_THIS_CARRIER":
    "Không thể thanh toán hãng bay này, vui lòng liên hệ Booker !",
  "CANNOT_PAYMENT_VNA_BOOKING_WITH_OVER_LIMIT_ITINERARIES":
    "Không được phép thanh toán vé VNA có số chặng vượt quá quy định, vui lòng liên hệ booker hỗ trợ!",
  "CANNOT_PAYNOW_MULTIPLE_TIME_IN_ONE_MINUTE":
    "Không thể thanh toán nhiều lần trong vòng một phút, vui lòng thử lại sau một phút.",
  "CANNOT_REBOOK_BOOKING_BY_REBOOK":
    "Không thể rebook vé được tạo ra từ rebook",
  "CANNOT_REBOOK_BOOKING_OVERDUE":
    "Không thể đặt lại vé",
  "CANNOT_REBOOK_DUPLICATED":
    "Không thể rebook vé đã rebook 1 lần",
  "CANNOT_REBOOK_VIETJET":
    "Vietjet Air không hỗ trợ rebook",
  "CANNOT_REBOOK_WITH_AMOUNT_LARGER_THAN_THE_PREVIOUS_BOOKING":
    "Không thể đặt lại vé với số tiền lớn hơn số tiền vé trước",
  "CANNOT_REBOOK_WITHOUT_BOOKING_REQUEST":
    "Không thể đặt lại vé khi không có yêu cầu",
  "CANNOT_REFUND_EXCHANGE_TICKET":
    "Không thể hoàn vé đã đổi hành trình trên hệ thống. Vui lòng liên hệ booker để được hỗ trợ",
  "CANNOT_REFUND_TICKET_PRICING":
    "Không thể hoàn vé với hạng vé này, vui lòng liên hệ booker hỗ trợ!",
  "CANNOT_SET_AUTO_ISSUE_DURING_THIS_TIME_PERIOD":
    "Không hỗ trợ tự động xuất vé trong khoảng thời gian từ 00h30 đến 01h30 ngày 24.02.2024 (GMT+7), Vui lòng chọn khung giờ khác.",
  "CANNOT_SET_AUTO_ISSUE_FOR_OUTSIDE_BOOKING":
    "Hệ thống không hỗ trợ tự động xuất vé nhập ngoài hệ thống",
  "CANNOT_SET_AUTO_ISSUE_WITHOUT_PRICE":
    "Không có giá, vui lòng lưu giá mới trước khi hẹn giờ xuất vé !",
  "CANNOT_SET_LOW_FARE_TRACKING_FOR_OUTSIDE_BOOKING":
    "Hệ thống không hỗ trợ canh vé rẻ nhập ngoài hệ thống",
  "CANNOT_SYNC_BOOKING_WITH_OTHER_CURRENCY":
    "Không thể đồng bộ code ngoại tệ",
  "CANNOT_UPDATE_DATA_OUT_OF_YOUR_PERMISSION":
    "Không thể cập nhật dữ liệu ngoài phạm vi quyền hạn của bạn.",
  "CANNOT_UPDATE_EMPLOYEE_EMAIL":
    "Bạn không có quyền sửa email nhân viên",
  "CanNotSliptAllAdult":
    "Không được phép. Vui lòng liên hệ sales hoặc booker để được hỗ trợ.",
  "CEBU_INVALIDATE_SSR_BAGGAGE":
    "Các hãng giá rẻ chỉ được mua 1 gói hành lý/khách/chặng. Vui lòng liên hệ booker để được hỗ trợ!",
  "CHANGE_FLIGHTS_PRICE_IS_EXPIRED":
    "Tính giá đổi chuyến bay đã hết hạn, vui lòng tính giá lại!",
  "CHANGE_PASSENGER_NAME_IS_INVALID":
    "Chỉ được đổi tên hành khách một lần không quá 2 ký tự",
  "CHECK AVAILABILITY":
    "Hạng vé này hiện không còn khả dụng trực tuyến hoặc chuyến bay quá cận giờ khởi hành. Vui lòng chọn chuyến bay khác hoặc liên hệ nhân viên hỗ trợ.",
  "CMD_CALCULATE_PRICE_FAIL":
    "Lỗi tính giá, vui lòng chọn lại chuyến và thử lại",
  "CMD_HOLD_BOOKING_ERROR":
    "Hết chỗ, vui lòng chọn chuyến khác",
  "CMD_PASSENGER_NAME_IS_INVALID":
    "Lỗi nhập tên, vui lòng nhập đúng định dạng",
  "CODE_ALREADY_IN_USE":
    "Mã đã được sử dụng",
  "CODE_NOT_FOUND":
    "Không tìm thấy mã",
  "COMMAND_NOT_REGISTERED":
    "Lệnh Command chưa được đăng ký",
  "COMMAND_SERVER_ERROR":
    "Lỗi server CMD. Vui lòng thử lại sau!",
  "COMPANY_IS_PROCESSING_BATCH_OF_INVOICES":
    "Không thể phát hành lô hoá đơn hoặc đổi cấu hình sinh số hoá đơn khi đang xử lý phát hành một lô hoá đơn. Vui lòng hoàn thành hoặc huỷ lô hoá đơn và thử lại sau 5 phút.",
  "COMPANY_NOT_FOUND":
    "Công ty không tồn tại.",
  "COMPANY_NOT_RELEASE_RECORDS_EXISTS":
    "Không thể đổi cấu hình cấp số hoá đơn khi vẫn còn hoá đơn có cấu hình cấp số hoá đơn hiện tại chưa phát hành.",
  "confirm_price_failed":
    "Xác nhận giá vé thất bại. Vui lòng thử lại hoặc chọn chuyến bay khác.",
  "confirm_price_http_error":
    "Lỗi kết nối hệ thống xác nhận giá vé. Vui lòng thử lại sau.",
  "confirm_price_missing_booking_id":
    "Hệ thống đối tác không trả về mã giữ chỗ. Vui lòng thử lại sau hoặc chọn chuyến bay khác.",
  "CONTACT_BOOKER_FOR_ANCILLARY_AND_SEATS":
    "Vui lòng liên hệ booker để thêm hành lý hoặc chọn chỗ ngồi cho vé này.",
  "CONTACT_BOOKER_FOR_REFUND":
    "Vui lòng liên hệ booker để được hỗ trợ hoàn vé.",
  "CONTACT_NOT_FOUND":
    "Không tìm thấy liên hệ",
  "COUPON_NOT_AVAILABLE":
    "Chiết khấu không hợp lệ",
  "CurrencyAmounts is invalid":
    "Không thể thanh toán với loại ngoại tệ này. Vui lòng liên hệ Booker để được giúp đỡ.",
  "CurrencyAmounts[0].TotalAmount is invalid":
    "Vui lòng chọn thanh toán sau hoặc liên hệ sales, booker hỗ trợ",
  "CUSTOMER_MUST_BELONG_WITH_AGENCY":
    "Khách hàng phải thuộc đại lý",
  "CUSTOMER_NOT_FOUND":
    "Khách hàng không tồn tại.",
  "Date of birth is not valid for the selected passenger type":
    "Ngày sinh không hợp lệ so với loại hành khách đã chọn (Người lớn/Trẻ em/Em bé). Vui lòng kiểm tra lại thông tin ngày sinh.",
  "DATE SEQUENCE IN ITINERARY NEEDS VERIFICATION":
    "Trình tự ngày bay giữa các chặng không hợp lệ (ví dụ: ngày bay về trước ngày bay đi, hoặc thời gian nối chuyến không đúng thứ tự). Vui lòng kiểm tra lại lịch trình.",
  "DATE_MUST_BE_AFTER_CURRENT_BOOK_CLOSING_DATE":
    "Thời gian chọn phải sau ngày khoá sổ",
  "DATE_MUST_BE_BEFORE_CURRENT_DATE":
    "Ngày chọn phải trước ngày hiện tại",
  "DATE_OF_BIRTH_IS_REQUIRED_FOR_VJ":
    "Vui lòng nhập ngày sinh cho booking của Vietjet",
  "DEBIT_AMOUNT_CANNOT_OVER_CREDIT_LIMIT":
    "Số tiền thanh toán không thể vượt quá số dư quỹ !",
  "DELETE_NEED_CONDITION":
    "Hành động xoá cần phải có điều kiện xoá",
  "DOCUMENT_IS_NOT_CREATE_IN_THIS_FOLDER":
    "Tài liệu không được tạo thư mục",
  "DOCUMENT_IS_REQUIRED_FOR_ADULT":
    "Thông tin không hợp lệ, vui lòng nhập đầy thông tin CCCD/Passport cho người lớn!",
  "DOCUMENT_IS_REQUIRED_FOR_THESE_ROUTES":
    "Thông tin không hợp lệ, vui lòng nhập đầy thông tin hộ chiếu (Passport) cho hành khách trên chặng này!",
  "Duplicate booking":
    "Đặt chỗ bị trùng lặp. Vui lòng kiểm tra lại đơn hàng.",
  "EK_FARE_CHANGED_CHECK_ORDER_RESHOP_REPRICE":
    "Giá vé đã thay đổi, vui lòng tính lại giá và lưu giá mới !",
  "EMAIL_ADDRESS_ALREADY_IN_USE":
    "Email đã được tồn tại",
  "EMAIL_ADDRESS_CANNOT_BE_DUPLICATED":
    "Địa chỉ email không được trùng",
  "EMAIL_CAN_ONLY_BE_SENT_ONCE":
    "Chỉ có thể gửi email một lần",
  "EMAIL_NOT_FOUND":
    "Email không tồn tại !",
  "EMPLOYEE_CODE_ALREADY_IN_USE":
    "Mã nhân viên đã tồn tại",
  "EMPLOYEE_IS_NOT_BOOKER":
    "Nhân viên không phải là Booker",
  "EMPLOYEE_NOT_FOUND":
    "Mã nhân viên không tồn tại",
  "EMPTY_INVOICE_DECOMPRESS_DATA":
    "Dữ liệu hoá đơn trống",
  "ENDORSEMENT_IS_ONLY_APPLICABLE_TO_SINGLE_PASSENGER_AIR_PRICE_QUOTES":
    "Ngày sinh hành khách (ENDORSEMENT) chỉ hỗ trợ cho từng Price quote của 1 hành khách riêng lẻ. Vui lòng tính lại giá cho từng hành khách!",
  "EndTransaction":
    "VUI LÒNG LIÊN HỆ BOOKER ĐỂ KIỂM TRA HOẶC ĐỢI 5 PHÚT MỞ LẠI BOOKING",
  "EnhancedAirBookRQ: INVENTORY MANAGER UNAVAILABLE - 0/145":
    "Không còn chỗ ngồi cho chuyến bay bạn đã chọn.",
  "EnhancedAirBookRQ: UNABLE 00 AVAILABLE":
    "Vé đã chọn hết chỗ trên hệ thống, vui lòng chọn lại!",
  "ERR.PNRSVC-CERT.INTERNAL_ERROR: Error occurred while invoking service NmvReservationRetrieverFacadeRQ:1.0.0":
    "Đã xảy ra lỗi trong quá trình gọi dịch vụ NmvReservationRetrieverFacadeRQ:1.0.0, vui lòng thực hiện lại",
  "ERROR_NOTIFICATION_INVOICE_ERROR_CODE_REQUIRE":
    "Lỗi yêu cầu thông báo hoá đơn",
  "ERROR_NOTIFICATION_INVOICE_ERROR_DATE_REQUIRE":
    "Lỗi thời gian yêu cầu thông báo hoá đơn",
  "ERROR_NOTIFICATION_INVOICE_NOT_PERMISSION":
    "Lỗi quyền hạn thông báo hoá đơn",
  "exception occurred in ReservationManager.AddReservation/_addResJourneys : Availability check failed, either no valid fare was found, OR one or more of the seats are no longer available : dbo.sp_Reservation_Add (-997)":
    "Vé đã chọn đã bị thay đổi giá hoặc hành trình, vui lòng kiểm tra lại!",
  "EXCHANGE_RATE_ALREADY_EXISTS":
    "Tỷ giá đã tồn tại.",
  "EXP_DATE_MUST_BE_LATER_THAN_ISSUED_DATE":
    "Ngày hết hạn phải sau ngày xuất vé",
  "EXPORTING_TOO_MANY_RECORDS":
    "Dữ liệu quá lớn, vui lòng chọn bộ lộc phù hợp để xuất file!",
  "EXTERNAL_SERVICE_ERROR":
    "Lỗi API hãng, Vui lòng liên hệ booker hỗ trợ!",
  "FARE_ALREADY_EXPIRED":
    "Giá đã hết hạn. Vui lòng thử lại!",
  "FARE_HUNTER_ONLY_DOMESTIC_ALLOWED":
    "Chỉ hỗ trợ săn vé cho hành trình nội địa!",
  "FARE_HUNTER_RECORD_ALREADY_LIMITED":
    "Bạn chỉ được săn tối đa 5 hành trình cùng lúc. Vui lòng huỷ bớt các hành trình đang săn để thêm mới.",
  "field:\"PNRSearch\",\"message\":\"1 | \nCHECK FORMAT\"":
    "Không tìm thấy vé - Vui lòng kiểm tra mã PNR và thử lại",
  "Flight is full":
    "Chuyến bay đã hết chỗ.",
  "FLIGHT SEGMENTS UNAVAILABLE IN THE REQUESTED CLASS":
    "Hạng đặt chỗ hoặc vé bạn chọn hiện không còn khả dụng trên chuyến bay này (đã hết chỗ ở hạng vé này). Vui lòng chọn chuyến bay hoặc hạng vé khác.",
  "FOLDER_NAME_NOT_FOUND":
    "Tên thư mục không tồn tại",
  "FOLDER_NOT_FOUND":
    "Thư mục không tồn tại",
  "Format of date is invalid":
    "Định dạng ngày tháng không hợp lệ.",
  "FREQUENT FLYER NUMBER NOT FOUND":
    "Số thẻ không đúng, vui lòng kiểm tra lại thông tin!",
  "FUNCTION_IS_NOT_SUPPORTED_NOW":
    "Tính năng này hiện tại đang tạm khoá, vui lòng liên hệ booker hỗ trợ.",
  "GET_VNA_BOOKING_CANCELLED_ERROR":
    "Lỗi tải booking VNA đã huỷ",
  "Host error during ticket retrieve.":
    "Lỗi máy chủ trong quá trình tìm kiếm vé",
  "HOTEL_COMMISSION_AGENCY_DUPLICATE":
    "Cấu hình đã tồn tại.",
  "INDIGO_CANNOT_HOLD_BOOKING_72_HOURS_BEFORE_DEPARTURE_TIME":
    "INDIGO-6E : Không cho phép giữ chỗ hành trình trước 72 giờ thời gian khởi hành",
  "INTERNAL_SERVER_ERROR":
    "Lỗi hệ thống. Vui lòng kiểm tra trước khi thử lại.",
  "Invalid body, check 'errors' property for more info.":
    "Lỗi yêu cầu sai thông tin. Vui lòng copy lỗi và gửi cho bộ phận IT để được hỗ trợ!!!",
  "INVALID RECORD LOCATOR":
    "PNR không hợp lệ, vui lòng kiểm tra và thử lại.",
  "INVALID REFUND AMOUNT PLEASE IGNORE AND PROCESS MANUALLY":
    "Số tiền hoàn không hợp lệ — vui lòng liên hệ booker để xử lý thủ công!",
  "Invalid user credentials":
    "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng nhập lại.",
  "INVALID_API_KEY":
    "API key không hợp lệ.",
  "INVALID_OTP":
    "Sai OTP. Vui lòng nhập lại!",
  "INVALID_PASSWORD":
    "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng nhập lại.",
  "INVALID_USERNAME":
    "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng nhập lại.",
  "INVALID_USERNAME_OR_PASSWORD":
    "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng nhập lại.",
  "INVOICE_CANCELED":
    "Hóa đơn đã bị hủy.",
  "INVOICE_CONFIG_DUPLICATE":
    "Cấu hình hoá đơn trùng lặp",
  "INVOICE_CONFIG_NOT_FOUND":
    "Cấu hình hoá đơn không tồn tại.",
  "INVOICE_DO_NOT_HAVE_PERMISSION":
    "Không có quyền thao tác trên hoá đơn",
  "INVOICE_NOT_FOUND":
    "Hóa đơn không tồn tại.",
  "INVOICE_REQUEST_MESSAGE_ERROR":
    "Lỗi thông báo yêu cầu hoá đơn",
  "INVOICE_SIGNATURE_ERROR":
    "Lỗi chữ kí hoá đơn",
  "INVOICE_TICKET_ALREADY_EXISTS":
    "Vé đã tồn tại trong hệ thống.",
  "INVOICE_TICKET_HAS_BEEN_USED":
    "Vé đã được sử dụng cho hoá đơn khác.",
  "INVOICE_TICKET_HOLD":
    "Giữ vé hoá đơn",
  "ITEM TOO LONG / NOT ENTERED /":
    "Tên hành khách quá dài, vui lòng kiểm tra lại",
  "JETSTAR_CANNOT_HOLD_BOOKING_48_HOURS_BEFORE_DEPARTURE_TIME":
    "Không thể đặt chỗ trước 48H với giờ khởi hành.",
  "Journeys[0].PassengerJourneyDetails[0].BookingKey is expired":
    "Đặt chỗ quá thời gian, vui lòng tìm kiếm và đặt chỗ lại.",
  "JUST_ONLY_TOPUP_FOR_PARENT_AGENCY":
    "Chỉ được phép tạo lệnh nạp tiền cho đại lý cấp trên.",
  "LCC_PASSENGER_CAN_ONLY_BUY_ONE_BAGGAGE_PACKAGE":
    "Các hãng giá rẻ chỉ được mua 1 gói hành lý/khách/chặng. Vui lòng liên hệ booker để được hỗ trợ!",
  "LN NBR PNTR DESIG. LOST/REDESIG. PNTR":
    "Lỗi khi thanh toán từ hãng, vui lòng thử lại.",
  "LOAD_BOOKING_FAILED":
    "Lỗi tải booking từ hãng. Vui lòng thử lại!",
  "LOW_FARE_TRACKING_FOR_THIS_SOURCE_IS_CURRENTLY_NOT_SUPPORTED":
    "Hiện hệ thống không hỗ trợ canh vé giá rẻ cho hãng hàng không này.",
  "MAX_DOCUMENTS_PIN_REACHED":
    "Không thể treo thông báo vì đã treo số lượng thông báo tối đa.",
  "MAX_HOTEL_COMMISSION_AMOUNT_IF_PERCENTAGE":
    "Giá trị hoa hồng tối đa là 100%.",
  "Method not implemented":
    "Chức năng này không được hỗ trợ.",
  "MFA_CODE_IS_INVALID":
    "Mã xác thực 2 bước (MFA) không hợp lệ.",
  "MFA_INIT_REQUEST_EXPIRED":
    "Yêu cầu tạo mã Xác thực 2 bước (MFA) đã hết hạn",
  "MFA_REQUIRED_FOR_LOGIN":
    "Cần tắt Xác thực 2 bước (MFA) khi đăng nhập trước khi xoá mã Xác thực 2 bước (MFA)",
  "MISSING_API_KEY":
    "Thiếu API_KEY",
  "MODIFY_FOR_THIS_SOURCE_IS_CURRENTLY_NOT_SUPPORTED":
    "Hiện tại không hỗ trợ thao tác sửa đổi cho hãng này, Vui lòng liên hệ booker!",
  "MODIFY_OPERATION_NOT_SUPPORTED":
    "Không thể thực hiện mua dịch vụ này. Vui lòng liên hệ booker",
  "MODIFY_WITH_SSR_IS_NOT_SUPPORTED":
    "Chưa hỗ trợ thêm hành lý/ dịch vụ bổ sung cho hành trình này, vui lòng liên hệ booker để thao tác!",
  "MUST_TURN_ON_AUTO_DEPOSIT_BEFORE_AUTO_ISSUE_TICKET":
    "Đại lý chưa được cấp quyền nạp tiền tự động.",
  "NAME_CANNOT_SHORTER_THAN_2_CHARACTERS":
    "Tên khách phải tối thiểu 2 ký tự",
  "Network Error":
    "Lỗi kết nối mạng",
  "NO COMBINABLE FARES FOR CLASS USED":
    "Giá không hợp lệ, vui lòng chọn tính giá rẻ nhất để có giá tốt nhất!",
  "NO FARES/RBD/CARRIER/PASSENGER TYPE":
    "Không có giá vé cho hạng vé, hãng vận chuyển hoặc loại hành khách này, vui lòng chọn hạng vé khác và thử lại",
  "NO MATCH FOR NAME":
    "Số thẻ không phù hợp với tên hành khách, vui lòng kiểm tra lại thông tin!",
  "NO PLATING CARRIER FOUND-ET INTERLINE AGREEMENT":
    "Hành trình này không tính được giá, vui lòng chọn hành trình khác",
  "NO VALID FARE FOR INPUT CRITERIA":
    "Không tìm thấy giá vé hợp lệ cho hành trình này. Hạng vé có thể đã hết hoặc điều kiện vé đã thay đổi. Vui lòng tìm kiếm lại.",
  "NO_AIRLINE_SYSTEM_OR_DISTRIBUTOR_SYSTEM_AVAILABLE":
    "Hệ thống hiện tại không hỗ trợ hãng bay hoặc hệ thống phân phối này. Vui lòng thử lại sau.",
  "NO_SEATS_AVAILABLE_FOR_BOOKING_PLEASE_CONTACT_BOOKER":
    "Vé chưa có chỗ, vui lòng liên hệ Booker để được trợ giúp",
  "NO_SEATS_AVAILABLE_FOR_CURRENT_CLASS":
    "Không có ghế trống cho hạng vé hiện tại.",
  "NO_SEATS_AVAILABLE_FOR_EVERY_CLASS":
    "Không có ghế trống cho mọi hạng vé.",
  "NO_SEATS_AVAILABLE_FOR_EXCEED_CURRENT_CLASS":
    "Không có ghế trống cho hạng vé cao hơn.",
  "NO_SEATS_AVAILABLE_FOR_THIS_FLIGHT":
    "Không thể rebook vì chuyến bay không còn đủ chỗ ngồi.",
  "NO_VALID_FARE_WAS_FOUND":
    "Không tìm thấy giá hợp lệ, vui lòng kiểm lại giá vé!",
  "NON_PATTERN_CODE":
    "Mã không đúng định dạng",
  "NOT_SUPPORTED_FOR_NDC":
    "Tính năng này hiện không được hỗ trợ cho NDC.",
  "NOTIFICATION_EXPIRED":
    "Thông báo đã quá hạn, không thể thực hiện thao tác",
  "OFFER NOT FOUND":
    "Phiên giá vé (Offer) của hãng hàng không đã hết hạn hoặc không còn hiệu lực. Vui lòng quay lại tìm kiếm chuyến bay mới để cập nhật giá vé mới nhất.",
  "One or more pricing have changed.":
    "Vé đã chọn đã bị thay đổi giá hoặc hành trình, vui lòng chọn lại!",
  "One or more pricings have changed.":
    "Giá vé thay đổi, vui lòng chọn lại !",
  "One or more segments are not bookable.":
    "Một trong các hành trình đã hết vé. Vui lòng tìm kiếm và đặt lại!",
  "ONE_AGENCY_MUST_HAVE_AT_LEAST_ONE_ADMINISTRATOR":
    "Mỗi agency phải có ít nhất một quản trị viên.",
  "ONLY_ADM_CAN_CREATE_THIS_ROLE":
    "Chỉ admin có thể tạo quyền này",
  "ONLY_BOOKER_HAVE_BOOKER_TYPE":
    "Chỉ Booker mới có Nghiệp vụ",
  "ONLY_CTV_CAN_CHANGE_COMPANY":
    "Chỉ cộng tác viên có thể thay đổi công ty",
  "ONLY_KTT_AND_KTV_CAN_DELETE_TOP_UP":
    "Chỉ kế toán trưởng và kế toán viên có thể xoá yêu cầu nạp tiền",
  "ONLY_MAMA_CAN_PERFORM_THIS_ACTION":
    "Chỉ F1 có quyền thực hiện hành động này",
  "ONLY_PAYMENT_IMMEDIATE_WITH_THIS_BOOKING":
    "Vui lòng chọn thanh toán ngay với mã đặt chỗ đã được thanh toán.",
  "ONLY_SPECIFIC_EMPLOYEE_CAN_MANAGE_AGENCY":
    "Chỉ nhân viên cụ thể có thể quản lý đại lý",
  "ONLY_SUPPORT_CALCULATE_PRICE_FOR_HK_SEGMENT":
    "Hệ thống chỉ hỗ trợ tính giá hành trình trạng thái HK",
  "ONLY_SUPPORT_CHANGE_NAME_PRICE":
    "Chỉ hỗ trợ tính giá đổi tên khách",
  "Order is not ready for holding.":
    "Yêu cầu đặt vé này đã được xử lý hoặc không còn hiệu lực. Vui lòng quay lại tìm kiếm chuyến bay mới.",
  "org.hibernate.exception.DataException: could not insert: [com.g2switch.gdsmodel.Fare]":
    "Lỗi hệ thống đối tác khi lưu giá vé (GDS Fare Data Exception). Vui lòng thử lại hoặc chọn vé khác.",
  "OTP_IS_INVALID":
    "Mã OTP không hợp lệ",
  "OTP_RESEND_COOLDOWN_ACTIVE":
    "Bạn vừa yêu cầu gửi lại OTP. Vui lòng chờ một chút trước khi thử lại.",
  "OTP_RESEND_LIMIT_EXCEEDED":
    "Vui lòng kiểm tra lại email hoặc thử lại sau 5 phút.",
  "PARENT_IS_NOT_FOLDER":
    "Đường dẫn chứa không phải là thư mục",
  "PASSENGER NAME IS TOO LONG":
    "Tên hành khách quá dài, vui lòng kiểm tra lại",
  "Passengers[0].Loyalty passenger validation failed. The provided profile details do not match the loyalty identifier":
    "Nhập sai thẻ thành viên, vui lòng kiểm tra lại mã thẻ.",
  "PASSKEY_NOT_FOUND":
    "Không thể đăng nhập bằng passkey này. Vui lòng thử lại hoặc sử dụng phương thức đăng nhập khác",
  "Passport expired date is invalid":
    "Ngày hết hạn hộ chiếu không hợp lệ.",
  "Passport is required for international flight":
    "Vui lòng điền thông tin hộ chiếu cho chuyến bay quốc tế.",
  "Passport must be entered":
    "Yêu cầu nhập hộ chiếu cho đặt chỗ này, vui lòng điền thông tin và thực hiện lại",
  "Payment attempt failed res validation":
    "Vui lòng thanh toán ngay.",
  "PAYMENT_AMOUNT_INCORRECT":
    "Số tiền thanh toán không chính xác",
  "PAYMENT_FOR_ANCILLARY_SERVICE_FAILED":
    "Thanh toán dịch vụ mua thêm lỗi! Vui lòng kiểm tra lại hành lý, ghế, dịch vụ trước khi thao tác mua lại hoặc liên hệ booker kiểm tra.",
  "PAYMENT_FOR_THIS_SOURCE_IS_CURRENTLY_NOT_SUPPORTED":
    "Không hỗ trợ xuất vé cho hãng này, Vui lòng liên hệ booker!",
  "PAYMENT_IMMEDIATE_IS_REQUIRED":
    "Vui lòng thanh toán ngay",
  "PAYMENT_PASSWORD_IS_INCORRECT":
    "Mật khẩu thanh toán không đúng!",
  "PAYMENT_PASSWORD_IS_REQUIRED":
    "Yêu cầu nhập mật khẩu thanh toán !",
  "PAYNOW_ERROR_PLEASE_CONTACT_WITH_BOOKER":
    "Lỗi thanh toán ngay từ hãng. Vui lòng kiểm tra lại email và liên hệ Booker trước khi thử lại để tránh xuất vé trùng lặp.",
  "PAYNOW_WITH_SEAT_IS_NOT_SUPPORTED":
    "Không hỗ trợ mua ghế khi thanh toán ngay, đại lý vui lòng chọn giữ chỗ nếu cần chọn ghế.",
  "PCC_ALREADY_IN_USE":
    "PCC này đang được dùng bởi một Đại lý khác. Vui lòng sử dụng PCC khác.",
  "PCC_IS_INVALID":
    "PCC không hợp lệ. Vui lòng nhập PCC từ 2 đến 10 ký tự và chỉ dùng chữ hoặc số.",
  "PCC_ONLY_ALLOWED_FOR_AGENCY_TIER_2":
    "Chỉ đại lý cấp 2 mới có thể thêm hoặc cập nhật PCC.",
  "Permission error":
    "Bạn chưa có quyền thực hiện thao tác này.",
  "PHONE_NUMBER_ALREADY_IN_USE":
    "Số điện thoại đã tồn tại",
  "PHONE_NUMBER_CANNOT_BE_DUPLICATED":
    "Số điện thoại không được trùng",
  "PHONE_NUMBER_OR_EMAIL_ALREADY_IN_USE":
    "Số điện thoại hoặc email đã tồn tại",
  "PLEASE_SELECT_ANOTHER_AGENCY_OR_CUSTOMER":
    "Vui lòng chọn đại lý hoặc khách hàng khác.",
  "PNR has not been updated successfully, see remaining messages for details":
    "Booking cập nhật thất bại, vui lòng thử lại.",
  "PNR not found, code: 100123, severity: MODERATE":
    "Không tìm thấy mã đặt chỗ, vui lòng kiểm tra lại thông tin. Mã lỗi: 100123 - MODERATE",
  "PRICE_GLP_DISCOUNT_1_PAX_PER_BOOKING":
    "Giá giảm GLP chỉ áp dụng tối đa 1 khách có thẻ trên booking, vui lòng tách booking khách có thẻ ra hoặc liên hệ booker!",
  "PRICE_GLP_NOT_APPLY_FOR_MULTI_CITY_BOOKING":
    "Giá giảm GLP không áp dụng cho chuyến bay nhiều chặng!",
  "PRICE_GLP_NOT_APPLY_FOR_YOUR_TRAVELER_TIER":
    "Giá giảm GLP không áp dụng cho hạng TTV của bạn!",
  "PRICE_QUOTES_ARE_CHANGED":
    "Giá vé thay đổi, vui lòng tải lại booking để kiểm tra lại giá rồi thực hiện Thanh Toán",
  "PROMOTION_CODE_ALREADY_EXISTS":
    "Mã giảm giá đã tồn tại.",
  "QH_CANNOT_BUY_XBAG_OVER_1_PACKAGE":
    "Bamboo Airlines không cho phép mua nhiều hơn 1 gói hành lý",
  "QH_CANNOT_BUY_XBAG_OVER_60_KG":
    "Bamboo Airlines không cho phép mua nhiều hơn 60kg hành lý",
  "QH_RT_MC_NOT_SUPPORTED_ADD_ANCILLARY ":
    "Hệ thống không hỗ trợ mua hành lý QH hành trình khứ hồi, đa chặng, Vui lòng liên hệ booker!",
  "Request failed with status code 400":
    "Lỗi kết nối máy chủ hãng. Vui lòng thử lại! [400]",
  "Request failed with status code 500":
    "Lỗi kết nối máy chủ hãng. Vui lòng thử lại! [500]",
  "REQUEST REJECTED - TOO CLOSE FROM DEPARTURE":
    "Yêu cầu đặt giữ chỗ bị từ chối do thời điểm bay quá cận giờ (quá giờ giữ chỗ của hãng). Vui lòng chọn chuyến bay khác.",
  "REQUESTED CABIN HAS NO AVAILABLE FARES":
    "Hạng ghế bạn chọn hiện đã hết chỗ trên hệ thống hãng bay. Vui lòng tìm kiếm lại để cập nhật tình trạng chỗ mới nhất hoặc chọn chuyến bay khác.",
  "REQUIRE_ENABLE_MFA_FOR_ACTION":
    "Vui lòng cài Xác thực 2 bước (MFA) để thực hiện thao tác này!",
  "REQUIRE_ENABLE_MFA_FOR_PAYMENT":
    "Vui lòng cài đặt Xác thực 2 bước (MFA) để thanh toán.",
  "REQUIRE_MFA_SETUP_TO_ENABLE_THIS_FEATURE":
    "Cần tạo mã Xác thực 2 bước (MFA) trước khi bật Xác thực 2 bước (MFA) khi đăng nhập",
  "Reservation does not exist.":
    "Không tìm thấy mã đặt chỗ, vui lòng kiểm tra lại thông tin.",
  "SALE_REPORT_ALREADY_EXISTS":
    "Báo cáo bán đã tồn tại",
  "SALE_REPORT_NOT_FOUND":
    "Báo cáo bán không tồn tại",
  "SCHEDULE_CALENDAR_NOT_FOUND":
    "Lịch trực không tồn tại",
  "SCHEDULE_NOT_FOUND":
    "Không tìm thấy lịch trực",
  "SCHEDULE_TAG_NOT_FOUND":
    "Tag lịch trực không tồn tại",
  "Seat class is not available":
    "Hạng ghế này hiện không còn chỗ trống.",
  "SEGMENT_IN_TICKET_NOT_FOUND":
    "Trạng thái vé không tồn tại",
  "SERVICE_FEE_ALREADY_EXISTS":
    "Phí dịch vụ này đã tồn tại",
  "SERVICE_FEE_NOT_FOUND":
    "Không tìm thấy phí dịch vụ",
  "SESSION_PRICE_ALREADY_EXPIRED":
    "Phiên tính giá đã hết hạn, xin vui lòng tính giá lại",
  "soap:Server | 1931|Application|NO MATCH FOR RECORD LOCATOR":
    "Không tìm thấy vé - Vui lòng kiểm tra mã PNR và thử lại",
  "SSR NOT CREATED - DUPLICATE EXISTS":
    "Số thẻ trùng lặp với số thẻ hiện tại, vui lòng kiểm tra lại thông tin!",
  "Step 1 - Cannot change to lower price":
    "Không thể đổi sang hạng vé có giá thấp hơn, vui lòng chọn hạng vé khác và thử lại",
  "Step 1 - NO FARE FOR BOOKING CODE-TRY OTHER PRICING OPTIONS":
    "Không có giá vé cho hạng vé này, vui lòng chọn hạng vé khác và thử lại",
  "Step 1 - REQUESTED CHANGE NOT ALLOWED BY CARRIER":
    "Không thể đổi sang hạng vé đã chọn, vui lòng chọn hạng vé khác và thử lại",
  "Step 1 - The system does not support exchange tickets with EMD, please contact for assistance":
    "Chưa cho phép đổi vé có kèm dịch vụ mua thêm, vui lòng liên hệ Booker !",
  "SUPPORT_REQUEST_CANNOT_BE_DUPLICATED":
    "Không thể tạo thêm yêu cầu trên PNR này do có yêu cầu đang xử lý.",
  "SYSTEM_ERROR_PLEASE_CONTACT_BOOKER":
    "Lỗi hệ thống vui lòng liên hệ booker !!!",
  "TAX_CODE_NOT_FOUND":
    "Không tìm thấy mã số thuế",
  "The passenger type is not valid":
    "Loại hành khách không hợp lệ.",
  "The PNR has passed its created date. Please use the PriceQuote to obtain the new price":
    "PNR đã có giá mới, vui lòng tính lại giá để xuất vé.",
  "THE REQUEST IS INVALID.":
    "Nhập dữ liệu không đúng định dạng. Vui lòng kiểm tra lại.",
  "The waitlist has been closed, please select another flight.":
    "Sổ chờ đã hết. Vui lòng chọn hạng đặt chỗ hoặc chuyến khác.",
  "There is not enough adults to accompany infants and children":
    "Không có đủ người lớn đi cùng trẻ sơ sinh và trẻ em",
  "THIS_AIRLINE_NOT_SUPPORTED_REFUND":
    "Không hỗ trợ hoàn vé hãng này, vui lòng liên hệ booker kiểm tra!",
  "THIS_FEATURE_IS_CURRENTLY_NOT_SUPPORTED":
    "Tính năng này hiện không được hỗ trợ.",
  "THIS_FEATURE_ONLY_SUPPORT_DOMESTIC_FLIGHT":
    "Tính năng này chỉ hỗ trợ đối với chuyến bay nội địa",
  "THIS_FEATURE_ONLY_SUPPORT_INTERNATIONAL_FLIGHT":
    "Tính năng này chỉ hỗ trợ đối với chuyến bay quốc tế.",
  "THIS_MFA_TYPE_CURRENTLY_NOT_SUPPORTED":
    "Phương thức Xác thực 2 bước (MFA) này chưa được hỗ trợ",
  "THIS_SOURCE_IS_CURRENT_NOT_SUPPORTED":
    "Không hỗ trợ đặt vé hệ thống này",
  "THIS_SOURCE_NOT_ALLOWED_ON_MOBILE_APP":
    "Booking của hãng này chưa hỗ trợ thao tác trên Mobile App, vui lòng sử dụng Web!",
  "Ticket is not EMD.":
    "Xin lỗi, không tìm thấy số vé nào phù hợp. Vui lòng kiểm tra lại số vé bạn đã nhập!",
  "Ticket type EMD is not supported yet.":
    "Chưa hỗ trợ xem vé EMD (1G)",
  "TICKET_ARE_NOT_ALLOWED_VOID":
    "Số vé không được phép void",
  "TICKET_BOOKING_TIME_IS_TOO_SHORT_FOR_REFUND_OR_EXCHANGE":
    "Không đủ điều kiện hoàn, huỷ vé",
  "TICKET_NOT_FOUND":
    "Vé không tồn tại",
  "Tickets are non-refundable":
    "Hạng vé bạn đặt không được phép hoàn.",
  "TOP_UP_NOT_FOUND":
    "Yêu cầu nạp tiền không tồn tại",
  "TOPUP_DESCRIPTION_IS_INVALID":
    "Nội dung nạp tiền không hợp lệ",
  "TRACKING_FOR_THIS_ITINERARY_ALREADY_EXISTS":
    "Tính năng thông báo khi có giá rẻ hơn cho hành trình này đã được bật.",
  "TRANSACTION_HAS_BEEN_DONE_OR_CANCELED":
    "Giao dịch đã hoàn thành hoặc đã huỷ",
  "TRANSACTION_IS_IN_PROGRESS":
    "Giao dịch đang tiến hành",
  "TRAVELPORT_CANNOT_HOLD_BOOKING_72_HOURS_BEFORE_DEPARTURE_TIME":
    "Hệ thống không hỗ trợ giữ chỗ nháp cho chuyến bay khởi hành trong vòng 72 giờ (3 ngày). Vui lòng chọn chuyến bay cách thời điểm hiện tại trên 3 ngày.",
  "TRAVELPORT_NOT_SUPPORTED_PAYMENT_THIS_AIRLINE":
    "Hệ thống không hỗ trợ xuất vé hãng bay này trên source 1G. Vui lòng liên hệ booker hỗ trợ!",
  "TRAVELPORT_NOT_SUPPORTED_PRIVATE_FARE_FOR_AGENCY":
    "Booking 1G này có giá riêng, vui lòng liên hệ Booker để được hỗ trợ book/xuất",
  "TRAVELPORT_NOT_SUPPORTED_THIS_AIRLINE":
    "Hãng hàng không này hiện không được hỗ trợ đặt trực tuyến qua hệ thống đối tác. Vui lòng chọn chuyến bay của hãng hàng không khác hoặc liên hệ nhân viên để được hỗ trợ đặt thủ công.",
  "UNABLE TO CREATE NAME/CHECK INPUT":
    "Thông tin nhập vào không hợp lệ, vui lòng kiểm tra lại thông tin hành khách!",
  "UNABLE TO PROCESS DUPLICATE NAMES - COMBINE AND REENTER - 01/02":
    "Không thể giữ chỗ do trùng tên hành khách.",
  "Unable to recover from EndTransactionLLSRQ error. Please see below messages for details":
    "VUI LÒNG LIÊN HỆ BOOKER ĐỂ KIỂM TRA HOẶC ĐỢI 5 PHÚT MỞ LẠI BOOKING",
  "UNABLE TO RETRIEVE - CHECK RECORD LOCATOR":
    "Không tìm thấy vé - Vui lòng kiểm tra mã PNR và thử lại",
  "UNABLE_TO_SPLIT_BOOKING_WITH_BOOKING_GROUP":
    "Không thể tách mã đặt chỗ khi đang có giá nhóm",
  "Unexpected error when issuing tickets.":
    "Lỗi thanh toán từ hệ thống VNA, vui lòng thử lại.",
  "UNKNOWN ERROR":
    "Hệ thống hãng bay phản hồi lỗi không xác định hoặc kết nối tạm thời bị gián đoạn. Vui lòng thử lại hoặc chọn hành trình khác.",
  "Unknown FareRuleFailureAVT: RoutingFailure,BookingClassFailure":
    "Hệ thống hãng bay từ chối giữ vé do chặng bay hoặc hạng đặt chỗ không khả dụng tại thời điểm này. Vui lòng chọn chuyến bay hoặc hạng vé khác.",
  "UNKNOWN_SESSION":
    "Thời gian nhập OTP Xác thực 2 bước (MFA) đã hết, vui lòng đăng nhập lại",
  "USER_DISABLED":
    "Tài khoản tạm dừng hoạt động, vui lòng liên hệ bộ phận Kinh doanh để được hỗ trợ.",
  "USERNAME_ALREADY_IN_USE":
    "Tên đăng nhập đã tồn tại",
  "USERNAME_CANNOT_BE_DUPLICATED":
    "Tên đăng nhập không được trùng",
  "VALIDATION_ERROR":
    "Sai định dạng , vui lòng kiểm tra lại",
  "VJ_CANNOT_HOLD_BOOKING_24_HOURS_BEFORE_DEPARTURE_TIME":
    "Hãng VietJet không cho phép giữ chỗ dưới 24 giờ trước khởi hành. Vui lòng liên hệ bộ phận hỗ trợ khách hàng để được hỗ trợ xuất vé.",
  "VJ_CANNOT_HOLD_BOOKING_24_HOURS_BEFORE_DEPARTURE_TIME_RETAIL":
    "Vietjet không thể giữ chỗ trong vòng 24h trước giờ bay. Quý khách vui lòng liên hệ đại lý để được hỗ trợ!",
  "vj_near_departure_manual_needed":
    "Hãng VietJet không cho phép giữ chỗ dưới 24 giờ trước khởi hành. Đơn hàng đang được Booker xử lý thủ công.",
  "VJ_PAYNOW_ERROR_PLEASE_CONTACT_WITH_BOOKER":
    "Lỗi thanh toán ngay từ hãng. Vui lòng kiểm tra lại email và liên hệ Booker trước khi thử lại để tránh xuất vé trùng lặp.",
  "VU airline or distribution system is currently not supported.":
    "Hãng hàng không hoặc hệ thống phân phối VU hiện chưa được hỗ trợ.",
  "WARNING_CREDIT_MUST_NOT_BE_MORE_THAN_LIMIT_CREDIT":
    "Cảnh báo số tiền thanh toán không thể vượt quá số dư quỹ !",
  "WARNING_SPAM_BOOKING":
    "Thông tin hành khách đã giữ chỗ 2 lần, không thể tiếp tục giữ chỗ. Vui lòng thanh toán ngay.",
  "WRONG BOOKING CATEGORIES PLEASE CHANGE NUMBER 1 TO BOOKING RANGE T":
    "Đổi vé VNA lỗi: Vé không đổi tự động được, vui lòng liên hệ Booker để được hỗ trợ !",
  "YOU_CAN_ONLY_ASSIGN_BOOKING_ON_THE_DAY":
    "Bạn chỉ được phép chuyển mã công nợ trong ngày đặt vé",
  "YOU_NOT_HAVE_PERMISSION_TO_ACTION_THIS_EMPLOYEE_TYPE":
    "Bạn không có quyền tạo/sửa loại nhân viên này",
  "YOU_NOT_HAVE_PERMISSION_TO_MODIFY_BOOKING":
    "Không có quyền thực hiện tính năng này, vui lòng liên hệ booker hỗ trợ !",
  "YOU_NOT_HAVE_PERMISSION_TO_PERFORM_THIS_ACTION":
    "Bạn không có quyền thực hiện hành động này",
  "YOU_NOT_HAVE_PERMISSION_TO_VIEW_THIS_BOOKING":
    "Tài khoản của bạn không có quyền xem Đặt chỗ này.",
  "YOU_NOT_HAVE_PERMISSION_TO_VIEW_THIS_DOCUMENT":
    "Tài khoản của bạn không có quyền xem Công văn, tài liệu này.",
  "YOUR_ACCOUNT_CANNOT_CREATE_BOOKING_QH_V3":
    "Tài khoản của bạn không thể tạo booking QH (V3)",
  "timeout of 60000ms exceeded":
    "Hệ thống hãng bay phản hồi chậm (Timeout). Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ khách hàng.",
  "timeout":
    "Hệ thống hãng bay phản hồi chậm (Timeout). Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ khách hàng.",
  "Request timeout":
    "Hệ thống hãng bay phản hồi chậm (Timeout). Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ khách hàng.",
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
  "timeout of 60000ms exceeded":
    "The airline system took too long to respond (Timeout). Please try again later or contact support.",
  "timeout":
    "The airline system took too long to respond (Timeout). Please try again later or contact support.",
  "Request timeout":
    "The airline system took too long to respond (Timeout). Please try again later or contact support.",
};

function extractPayload(payload: unknown): {
  code: string;
  errors: FlightBookingErrorDetails;
  rawMessage?: string;
} {
  if (typeof payload === "string") {
    const trimmed = payload.trim();
    return {
      code: trimmed,
      errors: {},
      rawMessage: trimmed,
    };
  }

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
  const lowerKey = String(lookupKey || "").toLowerCase();

  if (
    lowerKey.includes("inactive conversation") ||
    lowerKey.includes("session expired") ||
    lowerKey.includes("inactive session") ||
    lowerKey.includes("verify session")
  ) {
    fallbackMessage =
      language === "vi"
        ? "Phiên giao dịch với hãng đã hết hạn do quá thời gian chờ. Vui lòng quay lại tìm kiếm và đặt vé lại."
        : "The booking session has expired due to inactivity. Please search for the flight and try again.";
  } else if (lowerKey.includes("timeout of 60000ms exceeded") || lowerKey.includes("timeout")) {
    fallbackMessage =
      language === "vi"
        ? "Hệ thống hãng bay phản hồi chậm (Timeout). Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ khách hàng."
        : "The airline system took too long to respond (Timeout). Please try again later or contact support.";
  } else if (language === "vi" && lookupKey && ERROR_TRANSLATIONS_VI[lookupKey]) {
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
