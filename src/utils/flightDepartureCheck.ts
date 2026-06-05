import { parseISO, differenceInMinutes } from "date-fns";

/**
 * Kiểm tra xem chuyến bay có giờ khởi hành quá gần so với thời điểm hiện tại hay không.
 * @param departureAt Chuỗi ISO thời gian khởi hành (e.g. 2026-05-30T15:30:00+07:00)
 * @param minHours Số giờ tối thiểu yêu cầu (Mặc định là 4 giờ)
 */
export function isFlightDepartureTooClose(
  departureAt: string | undefined | null,
  minHours: number = 4
): boolean {
  if (!departureAt) return false;
  try {
    const departureDate = parseISO(departureAt);
    if (isNaN(departureDate.getTime())) return false;
    
    // Tính toán số phút chênh lệch từ hiện tại đến lúc cất cánh
    const diffInMinutes = differenceInMinutes(departureDate, new Date());
    
    return diffInMinutes < minHours * 60;
  } catch {
    return false;
  }
}
