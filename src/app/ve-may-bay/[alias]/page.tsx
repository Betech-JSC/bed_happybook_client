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
import Search from "../components/Search";
import { notFound } from "next/navigation";
import { ProductFlightApi } from "@/api/ProductFlight";
import styles from "@/styles/styles.module.scss";
import { isEmpty } from "lodash";

function getMetadata(data: any) {
  return formatMetadata({
    title: data?.meta_title || data?.name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical:
        data?.canonical_link || pageUrl(`ve-may-bay/${data?.alias}`, true),
    },
    openGraph: {
      images: [
        {
          url: data?.meta_image ? data.meta_image : null,
          alt: data?.meta_title,
        },
      ],
    },
  });
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const category = (await ProductFlightApi.categoryDetail(params.alias))
    ?.payload?.data as any;

  return getMetadata(category);
}

export default async function AirlineTicketCategory({ params }: any) {
  const detail = (await ProductFlightApi.categoryDetail(params.alias))?.payload
    ?.data as any;

  if (!detail) notFound();

  const airportsData = (await FlightApi.airPorts())?.payload?.data as any;
  const productFlights = (await ProductFlightApi.getFlights("all", detail.id))
    ?.payload?.data as any;
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("ve-may-bay", language))
    ?.payload?.data as any;
  const metadata = getMetadata(contentPage);
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
          <div className="mt-0 lg:mt-24 lg:mb-4 mx-auto">
            <h1 className="text-2xl lg:text-3xl font-bold text-center relative text-white mb-8">
              {detail?.name}
            </h1>
            <div className="p-6 bg-white rounded-lg shadow-lg relative">
              <Suspense>
                <Search
                  airportsData={airportsData}
                  airportDefault={{
                    from: detail.from_location,
                    to: detail.to_location,
                  }}
                />
              </Suspense>
            </div>
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
          {!isEmpty(productFlights) &&
            Object.entries(productFlights as Record<string, any[]>).map(
              ([key, items], index) => {
                if (items?.length > 0) {
                  return (
                    <div className="mt-6 py-6" key={index}>
                      <div>
                        <div className="flex justify-between">
                          <div>
                            <h2
                              className="text-[24px] lg:text-32 font-bold"
                              data-translate
                            >
                              {key === "popular"
                                ? "Những chuyến bay phổ biến"
                                : key === "oneWay"
                                ? "Vé Máy Bay Một Chiều Dành Cho Bạn"
                                : "Vé Máy Bay Khứ Hồi Dành Cho Bạn"}
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
                              {items.map((flight: any) => (
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
                  );
                }
              }
            )}
          {/* Blog */}
          {detail?.content && (
            <div className="mt-8 rounded-2xl bg-gray-50 p-8">
              <ContentByPage data={detail} />
            </div>
          )}
          {/* Faq */}
          <div className="my-8">
            <FAQ />
          </div>
        </div>
        {detail.children?.length > 0 && (
          <div className="hidden lg:block py-12 px-3 lg:px-[50px] xl:px-[80px] max__screen">
            <div className="mb-8">
              <h2
                className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]"
                data-translate="true"
              >
                Hành trình
              </h2>
              <div className="grid grid-cols-5 gap-4 mt-3">
                {detail.children.map((item: any) => (
                  <Link key={item.id} href={`/ve-may-bay/${item.alias}`}>
                    <h3
                      className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                      data-translate="true"
                    >
                      {`${item?.from_location?.city} - ${detail?.to_location?.city}`}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </SeoSchema>
  );
}
