import { arrLanguages } from "@/constants/language";
import { parseISO, format, min, parse, isValid } from "date-fns";
import { isNil } from "lodash";
import { Metadata } from "next";
import {
  AlternateLinkDescriptor,
  Languages,
} from "next/dist/lib/metadata/types/alternative-urls-types";
import { toZonedTime, format as formatTimeZoneFns } from "date-fns-tz";

const formatTimeFromHour = (h: number) => `${String(h).padStart(2, "0")}:00`;

const formatDate = (isoDate: string, dateFormat: string = "dd/MM/yyyy") => {
  if (isNil(isoDate)) return "";
  const date = new Date(isoDate);
  return isValid(date) ? format(date, dateFormat) : "";
};
const pareseDateFromString = (
  input: string,
  currentFormat: string,
  formatType: string
): string => {
  const parsedDate = isValid(parse(input, currentFormat, new Date()))
    ? parse(input, currentFormat, new Date())
    : new Date();
  return format(parsedDate, formatType);
};

const formatTime = (isoString: string) => {
  const date = parseISO(isoString);
  return format(date, "HH:mm");
};

const formatTimeZone = (isoString: string, timeZone: string) => {
  const date = parseISO(isoString);
  const zonedDate = toZonedTime(date, timeZone);
  return formatTimeZoneFns(zonedDate, "HH:mm", { timeZone });
};

const formatCurrency = (
  value: number,
  language: string = "vi",
  digits: number = 0
) => {
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency: language === "vi" ? "VND" : "USD",
    minimumFractionDigits: digits,
  }).format(value);
};

const formatMoney = (
  value: any,
  locale: string | undefined = undefined,
  fixed: boolean = false,
  digits: number = 2
) => {
  if (!value) return "";
  const number = Number(value);
  if (fixed) {
    return number.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits,
    });
  } else {
    return Math.round(number).toLocaleString("vi");
  }
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

const formatMetadata = (metadata: Metadata): Metadata => {
  const { alternates, ..._metadata } = metadata;
  let languages: Languages<null | string | URL | AlternateLinkDescriptor[]>;

  arrLanguages?.forEach((lang: any) => {
    languages = {
      ...languages,
      [lang]: `${alternates?.canonical}?lang=${lang}`,
    };
  });
  return {
    alternates: {
      ...alternates,
      languages: alternates?.languages || languages!,
    },
    ..._metadata,
    robots: _metadata?.robots ?? "index, follow",
  };
};

export {
  formatDate,
  formatTime,
  formatCurrency,
  formatMoney,
  formatNumberToHoursAndMinutesFlight,
  pareseDateFromString,
  formatMetadata,
  formatTimeFromHour,
  formatTimeZone,
};
