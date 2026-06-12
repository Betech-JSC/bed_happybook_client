/**
 * FE ↔ BE sync (quốc tế):
 * - B2 confirm-price: PaxDocuments trong paxLists → BE validate + forward Airdata
 * - B3 book-flight / hold-flight: passport_number, passport_expiry, nationality, doc_type
 * - CHD / INF: passport khi quốc tế (nếu form có nhập)
 * - residence: passport_issue_date (ngày cấp HC) khi có
 */
import { format } from "date-fns";
import type { ConfirmPricePaxListItem } from "@/types/flightConfirmPrice";
import type { AirdataPaxDocument } from "@/types/flightConfirmPrice";

const PAX_TYPE_MAP: Record<string, string> = {
  ADT: "ADULT",
  ADULT: "ADULT",
  CHD: "CHILD",
  CHILD: "CHILD",
  INF: "INFANT",
  INFANT: "INFANT",
};

export function isInternationalItineraries(
  flights: Record<string, unknown>[]
): boolean {
  if (!flights.length) return false;
  return flights.some((flight) => {
    if (flight.domestic === false) return true;
    const source = String(flight.source ?? "").toUpperCase();
    return source === "1G" || source === "9G";
  });
}

function parseToDate(value: string | Date | undefined): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Airdata: `1990-05-15T00:00:00.000Z` */
export function toAirdataBirthdayIso(
  birthday: string | Date | undefined
): string | undefined {
  const d = parseToDate(birthday);
  if (!d) return undefined;
  return d.toISOString();
}

/** Airdata endDate: ISO date `yyyy-MM-dd` */
export function toAirdataEndDate(
  expiry: string | Date | undefined
): string | undefined {
  const d = parseToDate(expiry);
  if (!d) return undefined;
  return format(d, "yyyy-MM-dd");
}

export function genderToAirdata(gender?: boolean): "MALE" | "FEMALE" {
  return gender === false ? "FEMALE" : "MALE";
}

export function buildPaxDocumentsForPassenger(
  paxId: string,
  pax: ConfirmPricePaxListItem,
  isInternational: boolean
): AirdataPaxDocument[] {
  if (isInternational) {
    const number = (pax.passport ?? "").trim();
    if (!number) return [];

    const nationality = (pax.nationality ?? "VNM").trim().toUpperCase();
    const isCountry = (
      pax.passport_country ?? pax.nationality ?? "VNM"
    )
      .trim()
      .toUpperCase();

    const doc: AirdataPaxDocument = {
      paxId,
      docType: "P",
      number,
      nationality,
      isCountry: isCountry || nationality,
      endDate: toAirdataEndDate(pax.passport_expiry_date) ?? "",
      gender: genderToAirdata(pax.gender),
      birthday: toAirdataBirthdayIso(pax.birthday) ?? "",
    };

    const residence = toAirdataEndDate(pax.passport_issue_date);
    if (residence) {
      doc.residence = residence;
    }

    return [doc];
  }

  const paxType = PAX_TYPE_MAP[pax.type] ?? "ADULT";
  if (paxType !== "ADULT") return [];

  const cccd = (pax.cccd ?? "").trim();
  if (!cccd) return [];

  return [
    {
      paxId,
      docType: "C",
      number: cccd,
    },
  ];
}

export type BookFlightPaxType = "ADT" | "CHD" | "INF";

/** Fields for POST /flights-v2/book-flight passengers[] (B3). */
export function appendBookFlightPassportFields(
  passenger: Record<string, unknown>,
  formValue: Record<string, unknown>,
  options: { isInternational: boolean; paxType: BookFlightPaxType }
): void {
  const passport = String(formValue.passport ?? "").trim();
  const nationality = String(formValue.nationality ?? "VNM")
    .trim()
    .toUpperCase();
  const expiry = formValue.passport_expiry_date
    ? format(new Date(formValue.passport_expiry_date as string | Date), "yyyy-MM-dd")
    : "";

  if (options.isInternational && passport) {
    passenger.passport_number = passport;
    passenger.passport_expiry = expiry;
    passenger.passport_country = nationality;
    passenger.nationality = nationality;
    passenger.doc_type = "P";
    return;
  }

  if (options.paxType === "ADT" && formValue.cccd) {
    passenger.cccd = String(formValue.cccd).trim();
    if (formValue.cccd_date) {
      passenger.cccd_date = format(
        new Date(formValue.cccd_date as string | Date),
        "yyyy-MM-dd"
      );
    }
    passenger.doc_type = "C";
  }
}
