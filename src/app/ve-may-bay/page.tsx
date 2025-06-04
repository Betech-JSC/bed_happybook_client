import type { Metadata } from "next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import FlightItem from "@/components/product/components/flight-item";
import Image from "next/image";
import Link from "next/link";
import Search from "./components/Search";
import { Suspense } from "react";
import { FlightApi } from "@/api/Flight";
import { formatCurrency, formatDate, formatMetadata } from "@/lib/formatters";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";
import { buildSearch, cloneItemsCarousel } from "@/utils/Helper";
import ContentByPage from "@/components/content-page/ContentByPage";
import { PageApi } from "@/api/Page";
import FooterMenu from "@/components/content-page/footer-menu";
import FAQ from "@/components/content-page/FAQ";
import { getServerLang } from "@/lib/session";
import { format, isValid } from "date-fns";

export const metadata: Metadata = formatMetadata({
  robots: "index, follow",
  title:
    "Vé Máy Bay - HappyBook Travel: Đặt vé máy bay, Tour, Khách sạn giá rẻ #1",
  description:
    "Vé Máy Bay - HappyBook Travel: Đặt vé máy bay, Tour, Khách sạn giá rẻ #1",
  alternates: {
    canonical: pageUrl("ve-may-bay"),
  },
});

export default async function AirlineTicket() {
  const airportsReponse = await FlightApi.airPorts();
  const airportsData = airportsReponse?.payload.data ?? [];
  let popularFlights = (await FlightApi.getPopularFlights())?.payload
    ?.data as any;
  if (popularFlights.length > 0 && popularFlights.length < 5) {
    popularFlights = cloneItemsCarousel(popularFlights, 8);
  }
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("ve-may-bay", language))
    ?.payload?.data as any;
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
              <Search airportsData={airportsData} />
            </Suspense>
          </div>
        </div>
      </div>
      <main className="w-full bg-white relative z-2 rounded-2xl top-[-12px]">
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
          <div className="py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-3 h-20">
              <Image
                src="/tour/globe-gradient.svg"
                alt="Icon"
                className="h-11 w-11"
                width={44}
                height={44}
              ></Image>
              <div>
                <p
                  className="text-18 text-gray-700 font-semibold mb-1"
                  data-translate
                >
                  Lựa Chọn Không Giới Hạn
                </p>
                <p data-translate>Vô vàn hành trình, triệu cảm hứng</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 h-20">
              <Image
                src="/tour/Travel-gradient-icon.svg"
                alt="Icon"
                className="h-11 w-11"
                width={44}
                height={44}
              ></Image>
              <div>
                <p
                  className="text-18 text-gray-700 font-semibold mb-1"
                  data-translate
                >
                  Dịch Vụ Cá Nhân Hóa
                </p>
                <p data-translate>Chăm sóc đặc biệt, trải nghiệm độc đáo</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 h-20">
              <Image
                src="/tour/sun-icon.svg"
                alt="Icon"
                className="h-11 w-11"
                width={44}
                height={44}
              ></Image>
              <div>
                <p
                  className="text-18 text-gray-700 font-semibold mb-1"
                  data-translate
                >
                  Giá Trị Vượt Trội
                </p>
                <p data-translate>Chất lượng đỉnh, đảm bảo giá tốt nhất</p>
              </div>
            </div>
          </div>
          {/* Flight */}
          {popularFlights?.length > 0 && (
            <div className="mt-6 py-6">
              <div>
                <div className="flex justify-between">
                  <div>
                    <h2
                      className="text-[24px] lg:text-32 font-bold"
                      data-translate
                    >
                      Những chuyến bay phổ biến
                    </h2>
                  </div>
                </div>
                <div className="mt-8 w-full">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {popularFlights.map((flight: any) => (
                        <CarouselItem
                          key={flight.id}
                          className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                        >
                          <FlightItem data={flight} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:inline-flex" />
                    <CarouselNext className="hidden lg:inline-flex" />
                  </Carousel>
                </div>
              </div>
            </div>
          )}
          {popularFlights.length > 0 && (
            <div className="mt-6 py-6">
              <div>
                <div className="flex justify-between">
                  <div>
                    <h2
                      className="text-[24px] lg:text-32 font-bold"
                      data-translate
                    >
                      Vé Máy Bay Một Chiều Dành Cho Bạn
                    </h2>
                  </div>
                </div>
                <div className="mt-8 w-full">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {popularFlights.map((item: any) => {
                        const pararmSearchFlight = {
                          tripType: "oneWay",
                          cheapest: 0,
                          StartPoint: item.flight.data_diem_di.ma_dia_diem,
                          EndPoint: item.flight.data_diem_den.ma_dia_diem,
                          DepartDate: isValid(
                            new Date(item.flight.ngay_khoi_hanh)
                          )
                            ? format(item.flight.ngay_khoi_hanh, "ddMMyyyy")
                            : format(new Date(), "ddMMyyyy"),
                          ReturnDate: "",
                          Adt: 1,
                          Chd: 0,
                          Inf: 0,
                          from: item.flight.data_diem_di.ten_dia_diem,
                          to: item.flight.data_diem_den.ten_dia_diem,
                        };
                        const querySerachFlight = `/ve-may-bay/tim-kiem-ve${buildSearch(
                          pararmSearchFlight
                        )}`;
                        return (
                          <CarouselItem
                            key={item.id}
                            className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                          >
                            <div className="px-4 py-3 border border-gray-200 rounded-2xl">
                              <div className="flex text-sm h-5">
                                <Image
                                  src={`${item.image_url}/${item.flight.data_hang_bay.logo}`}
                                  alt="Airline logo"
                                  width={66}
                                  height={24}
                                />
                                <p className="ml-2">
                                  {item.flight.data_hang_bay.name}
                                </p>
                              </div>
                              <Link
                                href={querySerachFlight}
                                className="mt-2 font-semibold block"
                              >
                                <h3
                                  data-translate
                                >{`${item.flight.data_diem_di.ten_dia_diem} - ${item.flight.data_diem_den.ten_dia_diem}`}</h3>
                              </Link>
                              <div className="mt-2 text-sm font-normal h-6">
                                {formatDate(item.flight.ngay_khoi_hanh)}
                              </div>
                              <div className="mt-3 text-right text-xl font-semibold text-primary">
                                {formatCurrency(item.price)}
                              </div>
                            </div>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:inline-flex" />
                    <CarouselNext className="hidden lg:inline-flex" />
                  </Carousel>
                </div>
              </div>
            </div>
          )}
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
        </div>
        <FooterMenu page="flight" />
      </main>
    </SeoSchema>
  );
}
