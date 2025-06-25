import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { formatCurrency } from "@/lib/formatters";
import FormCheckOut from "../../components/FormCheckout";
import { ProductInsurance } from "@/api/ProductInsurance";
import { notFound } from "next/navigation";
import { isEmpty } from "lodash";
import { differenceInDays, parse, format } from "date-fns";
import DisplayImage from "@/components/base/DisplayImage";

export default async function InsuranceCheckout({
  params,
  searchParams,
}: {
  params: { id: string | number };
  searchParams: { [key: string]: string | string[] };
}) {
  const safeParams: Record<string, string> = {};
  Object.entries(searchParams).forEach(([key, value]) => {
    safeParams[key] = Array.isArray(value) ? value[0] : value;
  });
  const queryString = new URLSearchParams(safeParams).toString();

  const startDate = parse(safeParams.departDate, "ddMMyyyy", new Date());
  const endDate = parse(safeParams.returnDate, "ddMMyyyy", new Date());

  const diffDate = differenceInDays(endDate, startDate);
  const detail =
    ((await ProductInsurance.detail(params.id))?.payload?.data as any) ?? null;

  const matchedInsurance = detail?.insurance_package_prices?.find(
    (item: any) => diffDate >= item.day_start && diffDate <= item.day_end
  );
  const totalFee =
    parseInt(matchedInsurance.parsed_price) *
    (parseInt(safeParams.guests) ?? 1);
  if (isEmpty(detail) || !matchedInsurance) {
    notFound();
  }
  const currencyFormatDisplay =
    detail?.currency?.toLowerCase() === "usd" ? "en" : "vi";
  return (
    <FormCheckOut
      detail={detail}
      startDate={startDate}
      endDate={endDate}
      diffDate={diffDate}
      matchedInsurance={matchedInsurance}
      currencyFormatDisplay={currencyFormatDisplay}
      totalFee={totalFee}
      queryString={queryString}
    />
  );
}
