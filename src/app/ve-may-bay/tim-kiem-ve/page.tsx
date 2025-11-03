import { Suspense } from "react";
import type { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import Link from "next/link";
import Search from "../components/Search";
import { FlightApi } from "@/api/Flight";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";
import FAQ from "@/components/content-page/FAQ";
import { PageApi } from "@/api/Page";
import ContentByPage from "@/components/content-page/ContentByPage";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import { getServerLang } from "@/lib/session";
import SearchFlightsResult from "../components/SearchResult";
import PartnerAirlines from "../components/Partner";
import { redirect } from "next/navigation";
import { format, parse, isValid, isBefore, startOfDay } from "date-fns";
import { getServerT } from "@/lib/i18n/getServerT";
import SearchFlightsInternationalResult from "../components/SearchFlights/International/SearchResult";

export const metadata: Metadata = formatMetadata({
  robots: "index, follow",
  title: "Tìm kiếm Vé máy bay",
  description: "Happy Book | Tìm kiếm Vé máy bay",
  keywords: "Tìm kiếm Vé máy bay",
  alternates: {
    canonical: pageUrl("ve-may-bay/tim-kiem-ve", true),
  },
});

export default async function SearchTicket({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const defaultParams = {
    tripType: "oneWay",
    cheapest: "0",
    StartPoint: "SGN",
    EndPoint: "HAN",
    DepartDate: format(new Date(), "ddMMyyyy"),
    ReturnDate: format(new Date(), "ddMMyyyy"),
    Adt: "1",
    Chd: "0",
    Inf: "0",
    from: "Hồ Chí Minh (SGN)",
    to: "Hà Nội (HAN)",
  };
  const mergedParams = { ...defaultParams, ...searchParams };

  if (!["oneWay", "roundTrip"].includes(mergedParams?.tripType)) {
    mergedParams.tripType = "oneWay";
    const queryString = new URLSearchParams(mergedParams).toString();
    redirect(`/ve-may-bay/tim-kiem-ve?${queryString}`);
  }

  const parseDDMMYYYY = (dateStr: string) =>
    parse(dateStr, "ddMMyyyy", new Date());
  const isValidDDMMYYYY = (dateStr: string) => isValid(parseDDMMYYYY(dateStr));
  const isValidDDMMYYYYAndNotPast = (dateStr: string) => {
    const parsedDate = parseDDMMYYYY(dateStr);
    return (
      isValid(parsedDate) &&
      !isBefore(startOfDay(parsedDate), startOfDay(new Date()))
    );
  };

  const departDateParsed = parseDDMMYYYY(searchParams.DepartDate ?? "");
  const returnDateParsed = parseDDMMYYYY(searchParams.ReturnDate ?? "");

  const hasMissingParams = Object.keys(defaultParams).some(
    (key) => searchParams[key] === undefined
  );

  const departDateInvalid = !isValidDDMMYYYYAndNotPast(
    searchParams.DepartDate ?? ""
  );
  const returnDateInvalid = !isValidDDMMYYYY(searchParams.ReturnDate ?? "");

  const returnDateBeforeDepartDate =
    mergedParams.tripType === "roundTrip" &&
    isValid(departDateParsed) &&
    isValid(returnDateParsed) &&
    isBefore(returnDateParsed, departDateParsed);

  const hasInvalidDates =
    departDateInvalid || returnDateInvalid || returnDateBeforeDepartDate;

  const shouldRedirect = hasMissingParams || hasInvalidDates;

  if (shouldRedirect) {
    if (departDateInvalid) {
      mergedParams.DepartDate = defaultParams.DepartDate;
    }

    if (returnDateInvalid || returnDateBeforeDepartDate) {
      mergedParams.ReturnDate = mergedParams.DepartDate;
    }

    const queryString = new URLSearchParams(mergedParams).toString();
    redirect(`/ve-may-bay/tim-kiem-ve?${queryString}`);
  }

  const airportsReponse = await FlightApi.airPorts();
  const airportsData = airportsReponse?.payload.data ?? [];
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("ve-may-bay", language))
    ?.payload?.data as any;
  const t = await getServerT();

  const flightType = (
    await FlightApi.getFlightType(
      mergedParams.StartPoint,
      mergedParams.EndPoint
    )
  )?.payload?.data as any;
  return (
    <SeoSchema
      metadata={metadata}
      breadscrumbItems={[
        {
          url: pageUrl("ve-may-bay", true),
          name: "Vé máy bay",
        },
        {
          url: metadata.alternates?.canonical as string,
          name: metadata.title as string,
        },
      ]}
    >
      <Suspense>
        <div className="relative h-max pb-14" key={Math.random()}>
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
              <Search airportsData={airportsData} />
            </div>
          </div>
        </div>

        <main className="w-full bg-gray-100 relative z-2 rounded-2xl top-[-12px]">
          <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
            <Breadcrumb className="pt-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="text-blue-700">
                      {t("trang_chu")}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="#" className="text-gray-700">
                      {t("ve_may_bay")}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="min-h-40" id="wrapper_search_flight">
              {flightType === "international" &&
              mergedParams.tripType === "roundTrip" ? (
                <SearchFlightsInternationalResult
                  airportsData={airportsData}
                  flightType={flightType}
                />
              ) : (
                <SearchFlightsResult
                  airportsData={airportsData}
                  flightType={flightType}
                />
              )}
            </div>
          </div>
          <PartnerAirlines />
        </main>
        <div>
          <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
            {/* Blog */}
            {contentPage?.content && (
              <div className="mt-8 rounded-2xl bg-gray-50 p-8">
                <ContentByPage data={contentPage} />
              </div>
            )}
            {/* Faq */}
            <div className="my-8">
              <FAQ />
            </div>
            <div className="my-8 p-8 rounded-2xl bg-gray-50 ">
              <WhyChooseHappyBook />
            </div>
          </div>
        </div>
      </Suspense>
    </SeoSchema>
  );
}
