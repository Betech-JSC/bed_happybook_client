import { parseISO, format, min, parse, isValid } from "date-fns";
import { isNil } from "lodash";
import { Metadata } from "next";
import {
  AlternateLinkDescriptor,
  Languages,
} from "next/dist/lib/metadata/types/alternative-urls-types";

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
    return Math.round(number).toLocaleString();
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
  const languages: Languages<null | string | URL | AlternateLinkDescriptor[]> =
    {
      vi: (alternates?.canonical as string) || "",
    };

  return {
    alternates: {
      ...alternates,
      languages: alternates?.languages || languages,
    },
    ..._metadata,
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
};
