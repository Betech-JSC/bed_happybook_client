import Image from "next/image";
import type { Metadata } from "next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import TourItem from "@/components/product/components/tour-item";
import SeoSchema from "@/components/schema";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { formatMetadata } from "@/lib/formatters";
import { TourApi } from "@/api/Tour";
import SearchTour from "./components/Search";
import { BannerApi } from "@/api/Banner";
import TouristSuggest from "@/components/home/tourist-suggest";
import ContentByPage from "@/components/content-page/ContentByPage";
import { PageApi } from "@/api/Page";
import FAQ from "@/components/content-page/FAQ";
import { getServerLang } from "@/lib/session";
import { getServerT } from "@/lib/i18n/getServerT";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import { Suspense } from "react";
import SkeletonProductTabs from "@/components/skeletons/SkeletonProductTabs";

function getMetadata(data: any) {
  return formatMetadata({
    title: data?.meta_title || data?.page_name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: data?.canonical_link || pageUrl(BlogTypes.TOURS, true),
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
  const contentPage = (await PageApi.getContent("tours"))?.payload?.data as any;

  return getMetadata(contentPage);
}

const tourist: string[] = [];
for (let i = 1; i <= 8; i++) {
  tourist.push(`/tourist-suggest/${i}.png`);
}

export default async function Tours() {
  const res = (await TourApi.getAll()) as any;
  const data = res?.payload?.data;
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("tours", language))?.payload
    ?.data as any;
  const metadata = getMetadata(contentPage);
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
      <main>
        <div className="relative h-[400px] lg:h-[500px]">
          <div className="absolute inset-0">
            <Image
              priority
              src="/tour/bg-header.png"
              width={1900}
              height={600}
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
          {/* Search */}
          <SearchTour />
        </div>
        <div className="bg-white relative z-2 rounded-2xl top-[-12px] mt-10">
          <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                  {t("vo_van_hanh_trinh_trieu_cam_hung")}
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
            {/* Tour nội địa */}
            {data?.tourDomestic?.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-[24px] lg:text-[32px] font-bold">
                      {t("tour_trong_nuoc")}
                    </h2>
                  </div>
                  <Link
                    href="/tours/tour-noi-dia"
                    className="hidden lg:flex items-center bg-[#EFF8FF] hover:bg-blue-200 py-1 px-4 rounded-lg space-x-3 ease-in duration-300"
                  >
                    <span className="text-[#175CD3] font-medium">
                      {t("xem_tat_ca")}
                    </span>
                    <Image
                      className="hover:scale-110 ease-in duration-300"
                      src="/icon/chevron-right.svg"
                      alt="Icon"
                      width={20}
                      height={20}
                    />
                  </Link>
                </div>
                <p className="text-16 font-medium mt-3">
                  {t("choi_he_tha_ga_khong_lo_ve_gia")}
                </p>
                <Link
                  href="/tours/tour-noi-dia"
                  className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
                >
                  <span className="text-[#175CD3] font-medium">
                    {" "}
                    {t("xem_tat_ca")}
                  </span>
                  <Image
                    className=" hover:scale-110 ease-in duration-300"
                    src="/icon/chevron-right.svg"
                    alt="Icon"
                    width={20}
                    height={20}
                  />
                </Link>
                <div className="mt-8 w-full">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {data.tourDomestic.map((tour: any, index: number) => (
                        <CarouselItem
                          key={index}
                          className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                        >
                          <TourItem tour={tour} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:inline-flex" />
                    <CarouselNext className="hidden lg:inline-flex" />
                  </Carousel>
                </div>
              </div>
            )}
            {/* Tour nước ngoài */}
            {data?.tourInternational?.length > 0 && (
              <div className="mt-12">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-[24px] lg:text-[32px] font-bold">
                      {t("tour_du_lich_nuoc_ngoai_cao_cap")}
                    </h2>
                  </div>
                  <Link
                    href="/tours/tour-quoc-te"
                    className="hidden lg:flex items-center bg-[#EFF8FF] hover:bg-blue-200 py-1 px-4 rounded-lg space-x-3 ease-in duration-300"
                  >
                    <span className="text-[#175CD3] font-medium">
                      {t("xem_tat_ca")}
                    </span>
                    <Image
                      className="hover:scale-110 ease-in duration-300"
                      src="/icon/chevron-right.svg"
                      alt="Icon"
                      width={20}
                      height={20}
                    />
                  </Link>
                </div>
                <p className="text-16 font-medium mt-3">
                  {t("trai_nghiem_the_gioi_kham_pha_ban_than")}
                </p>
                <Link
                  href="/tours/tour-quoc-te"
                  className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
                >
                  <span className="text-[#175CD3] font-medium">
                    {t("xem_tat_ca")}
                  </span>
                  <Image
                    className=" hover:scale-110 ease-in duration-300"
                    src="/icon/chevron-right.svg"
                    alt="Icon"
                    width={20}
                    height={20}
                  />
                </Link>
                <div className="mt-8 w-full">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {data.tourInternational.map(
                        (tour: any, index: number) => (
                          <CarouselItem
                            key={index}
                            className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                          >
                            <TourItem tour={tour} />
                          </CarouselItem>
                        )
                      )}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:inline-flex" />
                    <CarouselNext className="hidden lg:inline-flex" />
                  </Carousel>
                </div>
              </div>
            )}
            {/* Suggest Tour */}
            <Suspense fallback={<SkeletonProductTabs />}>
              <div className="mt-6">
                <TouristSuggest></TouristSuggest>
              </div>
            </Suspense>

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
      </main>
    </SeoSchema>
  );
}
