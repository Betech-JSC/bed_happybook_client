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
import FlightCalendar from "../components/FlightCalendar";
import SignUpReceiveCheapTickets from "../components/SignUpReceiveCheapTickets";
import {
  AirportOption,
  AirportsCountry,
  SearchParamsProps,
} from "@/types/flight";
import { FlightApi } from "@/api/Flight";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";
import FAQ from "@/components/content-page/FAQ";
import { PageApi } from "@/api/Page";
import ContentByPage from "@/components/content-page/ContentByPage";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import { getServerLang } from "@/lib/session";

export const metadata: Metadata = formatMetadata({
  title: "Vé máy bay giá rẻ",
  description: "Happy Book | Vé máy bay giá rẻ",
  keywords: "Vé máy bay giá rẻ",
  alternates: {
    canonical: pageUrl("/ve-may-bay/ve-may-bay-gia-re", true),
  },
});
export default async function SearchTicketCheap({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) {
  const airportsReponse = await FlightApi.airPorts();
  const airports = airportsReponse?.payload.data ?? [];
  const startPoint = searchParams?.StartPoint ?? "SGN";
  const endPoint = searchParams?.EndPoint ?? "HAN";
  const tripType = searchParams?.tripType ?? "oneWay";
  const fromPlace = searchParams?.from ?? "Hồ Chí Minh (SGN)";
  const toPlace = searchParams?.to ?? "Hà Nội (HAN)";
  const fromOption = {
    city: fromPlace,
    code: startPoint,
    type: "",
  };
  const toOption = {
    city: toPlace,
    code: endPoint,
    type: "",
  };
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("ve-may-bay", language))
    ?.payload?.data as any;

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
              <Search airportsData={airports} />
            </div>
          </div>
        </div>

        <main className="w-full bg-gray-100 relative z-2 rounded-2xl top-[-12px]">
          <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
            <Breadcrumb className="pt-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="text-blue-700" data-translate>
                      Trang chủ
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/ve-may-bay"
                      className="text-blue-700"
                      data-translate
                    >
                      Vé máy bay
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <p className="text-gray-700" data-translate>
                      Vé máy bay từ {fromOption?.city ?? " "} {" tới "}
                      {toOption?.city ?? " "}
                    </p>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div id="wrapper-find-cheap-tickets-flight">
            <div className="px-0 md:px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
              <div className="min-h-40">
                <FlightCalendar
                  airports={airports}
                  fromOption={fromOption}
                  toOption={toOption}
                  flightType={"depart"}
                />
              </div>
            </div>
            {tripType === "roundTrip" && (
              <div className="px-0 md:px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
                <div className="min-h-40">
                  <FlightCalendar
                    airports={airports}
                    fromOption={toOption}
                    toOption={fromOption}
                    flightType={"return"}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="px-3 pb-12 lg:px-[50px] xl:px-[80px] max__screen">
            <div className="mt-8">
              <SignUpReceiveCheapTickets />
            </div>
          </div>
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
