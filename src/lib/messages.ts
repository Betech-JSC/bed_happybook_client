export interface ValidationMessages {
  required: string;
  email: string;
  minLength: (length: number) => string;
  maxLength: (length: number) => string;
  passwordMismatch: string;
  inValid: string;
  inValidCheckOutDate: string;
  inValidFirstName: string;
  inValidLastName: string;
  inValidBirthDay: string;
  inValidPaymentMethod: string;
  inValidAgreeTerms: string;
}

export const validationMessages: Record<"vi" | "en", ValidationMessages> = {
  vi: {
    required: "Vui lòng điền thông tin này!",
    email: "Email không hợp lệ",
    inValid: "Thông tin không hợp lệ",
    minLength: (length: number) => `Vui lòng điền thông tin này!`,
    maxLength: (length: number) => `Thông tin không hợp lệ`,
    passwordMismatch: "Mật khẩu không trùng khớp",
    inValidCheckOutDate: "Ngày trả phòng không được nhỏ hơn ngày nhận phòng",
    inValidFirstName: "Vui lòng nhập Họ không dấu và không có các chữ số",
    inValidLastName:
      "Vui lòng nhập Tên đệm & Tên không dấu và không có các chữ số",
    inValidBirthDay: "Ngày sinh không đúng định dạng",
    inValidPaymentMethod: "Vui lòng chọn phương thức thanh toán",
    inValidAgreeTerms: "Vui lòng xác nhận thông tin này",
  },
  en: {
    required: "This field is required",
    email: "Invalid email",
    minLength: (length: number) => `This field is required`,
    maxLength: (length: number) => `Invalid information`,
    inValid: `Invalid information`,
    passwordMismatch: "Passwords do not match",
    inValidCheckOutDate: "Check-out date must not be less than check-in date",
    inValidFirstName: "Please enter your Last Name without accents or numbers.",
    inValidLastName:
      "Please enter Middle Name & First Name without accents and without numbers",
    inValidBirthDay: "Date of birth is not in correct format",
    inValidPaymentMethod: "Please select payment method",
    inValidAgreeTerms: "Please confirm this information",
  },
};

interface ToastMessages {
  sendSuccess: string;
  sendFailed: string;
  error: string;
  successRegister: string;
  errorRegister: string;
  missingInfoSearchFlight: string;
  notFoundFlight: string;
  errorConnectApiFlight: string;
  tooManyRequests: string;
  transferSuccessful: string;
  formNotValid: string;
}

export const toastMessages: Record<"vi" | "en", ToastMessages> = {
  vi: {
    successRegister: "Đăng ký thành công!",
    errorRegister: "Đăng ký thất bại. Vui lòng thử lại.",
    sendSuccess: "Gửi thành công!",
    sendFailed: "Gửi thất bại! Vui lòng thử lại sau",
    error: "Có lỗi xảy ra. Vui lòng thử lại sau!",
    missingInfoSearchFlight: "Vui lòng chọn đầy đủ thông tin",
    notFoundFlight:
      "Không có chuyến bay nào trong ngày hôm nay, quý khách vui lòng chuyển sang ngày khác để đặt vé. Xin cám ơn!",
    errorConnectApiFlight:
      "Hiện tại chúng tôi đang không kết nối được với hãng bay, quý khách vui lòng thực hiện tìm lại chuyến bay sau ít phút nữa. Xin cám ơn",
    tooManyRequests: "Bạn đã bấm quá nhanh, hãy thử lại sau vài giây!",
    transferSuccessful: "Chuyển khoản thành công",
    formNotValid: "Thông tin không hợp lệ. Vui lòng kiểm tra lại!",
  },
  en: {
    successRegister: "Registration successful!",
    errorRegister: "Registration failed. Please try again.",
    sendSuccess: "Sent successfully!",
    error: "An error occurred. Please try again later!",
    sendFailed: "sendFailed",
    missingInfoSearchFlight: "Please select complete information",
    notFoundFlight:
      "There are no flights today, please book another day. Thank you!",
    errorConnectApiFlight:
      "We are currently unable to connect with the airline. Please try searching for your flight again in a few minutes. Thank you.",
    tooManyRequests: "You clicked too fast, try again in a few seconds!",
    transferSuccessful: "Transfer Successful",
    formNotValid: "Invalid information. Please check again!",
  },
};
