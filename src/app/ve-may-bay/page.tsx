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
import styles from "@/styles/styles.module.scss";
import { ProductFlightApi } from "@/api/ProductFlight";
import { isEmpty } from "lodash";
import { getServerT } from "@/lib/i18n/getServerT";

function getMetadata(data: any) {
  return formatMetadata({
    title: data?.meta_title || data?.page_name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: data?.canonical_link || pageUrl("ve-may-bay", true),
    },
    openGraph: {
      images: [
        {
          url: data?.meta_image
            ? data.meta_image
            : `${data?.image_url}/${data?.image_location}`,
          alt: data?.meta_title,
        },
      ],
    },
  });
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const contentPage = (await PageApi.getContent("ve-may-bay"))?.payload
    ?.data as any;

  return getMetadata(contentPage);
}

export default async function AirlineTicket() {
  const airportsReponse: any = await FlightApi.airPorts();
  const airportsData = airportsReponse?.payload.data ?? [];
  const productFlights = (await ProductFlightApi.getFlights("all"))?.payload
    ?.data as any;
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("ve-may-bay", language))
    ?.payload?.data as any;
  const metadata = getMetadata(contentPage);
  const footerData = (await PageApi.footerMenu("flight"))?.payload as any;
  const t = await getServerT();

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
                <p className="text-18 text-gray-700 font-semibold mb-1">
                  {t("lua_chon_khong_gioi_han")}
                </p>
                <p> {t("vo_van_hanh_trinh_trieu_cam_hung")}</p>
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
                <p className="text-18 text-gray-700 font-semibold mb-1">
                  {t("dich_vu_ca_nhan_hoa")}
                </p>
                <p>{t("cham_soc_dac_biet_trai_nghiem_doc_dao")}</p>
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
                <p className="text-18 text-gray-700 font-semibold mb-1">
                  {t("gia_tri_vuot_troi")}
                </p>
                <p>{t("chat_luong_dinh_dam_bao_gia_tot_nhat")}</p>
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
                                ? t("nhung_chuyen_bay_pho_bien")
                                : key === "oneWay"
                                ? t("ve_may_bay_mot_chieu_danh_cho_ban")
                                : t("ve_may_bay_khu_hoi_danh_cho_ban")}
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
        <div className="hidden lg:block py-12 px-3 lg:px-[50px] xl:px-[80px] max__screen">
          {footerData.flight?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
                {t("diem_den")}
              </h2>
              <div className="grid grid-cols-5 gap-4 mt-3">
                {footerData.flight?.map((item: any) => (
                  <Link key={item.id} href={`/ve-may-bay/${item.alias}`}>
                    <h3
                      className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                      data-translate="true"
                    >
                      {item.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {/* {footerData.flight?.international?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
                {t("diem_den_quoc_te")}
              </h2>
              <div className="grid grid-cols-5 gap-4 mt-3">
                {footerData.flight?.international.map((item: any) => (
                  <Link key={item.id} href={`/ve-may-bay/${item.alias}`}>
                    <h3
                      className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                      data-translate="true"
                    >
                      {item.location.city}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </main>
    </SeoSchema>
  );
}
