import { parseISO, format, min, parse } from "date-fns";

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
const pareseDateFromString = (
  input: string,
  currentFormat: string,
  formatType: string
): string => {
  const parsedDate = parse(input, currentFormat, new Date());
  return format(parsedDate, formatType);
};

const formatTime = (isoString: string) => {
  const date = parseISO(isoString);
  return format(date, "HH:mm");
};

const formatCurrency = (value: number) => {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
const formatNumberToHoursAndMinutesFlight = function (
  totalMinutes: number
): string {
  const hours = Math.floor(totalMinutes / 60)
    ? `${Math.floor(totalMinutes / 60)}h`
    : "";
  let minutes = totalMinutes % 60 ? `${totalMinutes % 60}m` : "";
  if (totalMinutes % 60 && totalMinutes % 60 < 10) minutes = `0${minutes}`;
  return `${hours}${minutes}`;
};

export {
  formatDate,
  formatTime,
  formatCurrency,
  formatNumberToHoursAndMinutesFlight,
  pareseDateFromString,
};
