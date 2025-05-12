import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { formatMetadata } from "@/lib/formatters";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";
import SearchFormInsurance from "./components/SearchForm";
import SearchResults from "./components/SearchResults";
import { SearchProps } from "@/types/insurance";
import { format, parse, isValid, addDays, isBefore, isEqual } from "date-fns";
import { redirect } from "next/navigation";

export const metadata: Metadata = formatMetadata({
  title:
    "Vé Máy Bay - HappyBook Travel: Đặt vé máy bay, Tour, Khách sạn giá rẻ #1",
  description:
    "Vé Máy Bay - HappyBook Travel: Đặt vé máy bay, Tour, Khách sạn giá rẻ #1",
  alternates: {
    canonical: pageUrl("bao-hiem"),
  },
});
export default async function Insurance({ searchParams }: SearchProps) {
  const today = new Date();

  const parseDate = (value?: string): Date | null => {
    if (!value || value.length !== 8) return null;
    const parsed = parse(value, "ddMMyyyy", new Date());
    return isValid(parsed) ? parsed : null;
  };

  const departDate = parseDate(searchParams?.departDate ?? "") ?? today;
  let returnDate = parseDate(searchParams?.returnDate ?? "");

  if (
    !returnDate ||
    isBefore(returnDate, departDate) ||
    isEqual(returnDate, departDate)
  ) {
    returnDate = addDays(departDate, 1);
  }

  const newParams = new URLSearchParams({
    departDate: format(departDate, "ddMMyyyy"),
    returnDate: format(returnDate, "ddMMyyyy"),
  });

  if (
    searchParams.departDate !== newParams.get("departDate") ||
    searchParams.returnDate !== newParams.get("returnDate")
  ) {
    redirect(`?${newParams.toString()}`);
  }

  return (
    <SeoSchema
      metadata={metadata}
      breadscrumbItems={[
        {
          url: metadata.alternates?.canonical as string,
          name: metadata.title as string,
        },
      ]}
    >
      <div className="relative h-max pb-14">
        <div className="absolute inset-0">
          <Image
            priority
            src="/bg-image-2.png"
            width={500}
            height={584}
            className="object-cover w-full h-full"
            alt="Background"
          />
        </div>
        <div
          className="absolute w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
          }}
        ></div>
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-[100px] lg:pt-[132px] max__screen">
          <div className="mt-0 lg:mt-24 lg:mb-4 p-6 mx-auto  bg-white rounded-lg shadow-lg relative">
            <Suspense>
              <SearchFormInsurance />
            </Suspense>
          </div>
        </div>
      </div>
      <main className="w-full bg-gray-100 relative z-2 rounded-2xl top-[-12px] py-5 lg:py-12">
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
          <div>
            <h2 className="text-2xl lg:text-32 font-bold !leading-tight">
              Bảo hiểm du lịch quốc tế
            </h2>
            <p className="text-base font-normal leading-normal text-gray-500 mt-2">
              {`${format(departDate, "dd/MM/yyyy")} - ${format(
                returnDate,
                "dd/MM/yyyy"
              )}`}
            </p>
          </div>
          <div className="mt-6">
            <SearchResults />
          </div>
        </div>
      </main>
    </SeoSchema>
  );
}
