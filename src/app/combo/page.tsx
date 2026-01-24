import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CompoItem from "@/components/product/components/CompoItem";
import Search from "./components/Search";
import SeoSchema from "@/components/schema";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { formatMetadata } from "@/lib/formatters";
import { ComboApi } from "@/api/Combo";
import { ProductLocation } from "@/api/ProductLocation";
import FAQ from "@/components/content-page/FAQ";
import { BannerApi } from "@/api/Banner";
import { Suspense } from "react";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import { getServerLang } from "@/lib/session";
import { settingApi } from "@/api/Setting";
import { PageApi } from "@/api/Page";
import { getServerT } from "@/lib/i18n/getServerT";

function getMetadata(data: any) {
  return formatMetadata({
    title: data?.meta_title || data?.page_name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: data?.canonical_link || pageUrl(BlogTypes.COMPO, true),
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
  const contentPage = (await PageApi.getContent("combo"))?.payload?.data as any;

  return getMetadata(contentPage);
}

export default async function CompoTour() {
  const language = await getServerLang();
  const locationsData =
    ((await ProductLocation.list(language))?.payload?.data as any) ?? [];
  const formatLocationsData =
    locationsData?.length > 0
      ? locationsData.map((opt: any) => ({
        value: opt.id,
        label: opt.name,
      }))
      : [];
  const comboData = ((await ComboApi.getAll())?.payload?.data as any) ?? [];
  const hotDestination =
    ((await BannerApi.getBannerPage("combo-diemdenhot"))?.payload
      ?.data as any) ?? [];

  const contentPage = (await PageApi.getContent("combo", language))?.payload
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
        <div className="relative h-max">
          <div className="absolute inset-0">
            <Image
              priority
              src={`/compo/bg-header.jpeg`}
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
          <div className="py-5">
            <Suspense>
              <Search locations={formatLocationsData} />
            </Suspense>
          </div>
        </div>
        <div className="bg-white relative z-2 rounded-2xl top-[-12px] mt-10">
          <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
            {/* Tours */}
            {comboData?.comboHot?.length > 0 && (
              <div className="w-full">
                <h2 className="text-32 font-bold">
                  {t("kham_pha_cac_diem_den_hot")}
                </h2>
                <div className="mt-8 overflow-hidden">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {comboData?.comboHot?.map((item: any) => (
                        <CarouselItem
                          key={item.id}
                          className="basis-10/12 md:basis-5/12 lg:basis-[30%]"
                        >
                          <div className="overflow-hidden rounded-lg relative pointer-events-none">
                            <Link href={`/combo/${item.slug}`}>
                              <Image
                                src={`${item.image_url}/${item.image_location}`}
                                width={365}
                                height={245}
                                className="h-56 rounded-lg hover:scale-110 ease-in duration-300 object-cover"
                                sizes="100vw"
                                alt={item.name}
                              />
                            </Link>
                            <div className="absolute bottom-3 left-2 text-white px-3 py-1">
                              <Link href={`/combo/${item.slug}`}>
                                <h3
                                  className="line-clamp-2"
                                  data-translate="true"
                                >
                                  {item.name}
                                </h3>
                              </Link>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row mt-8 justify-between items-start md:items-center">
              <h2 className="text-32 font-bold">
                {t("cac_combo_du_lich_uu_dai")}
              </h2>
            </div>
            {comboData?.comboDomestic?.length > 0 ? (
              <div className="mt-8 grid md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                {comboData?.comboDomestic.map((combo: any) => (
                  <div key={combo.id}>
                    <CompoItem data={combo} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base md:text-xl font-semibold my-4 text-center">
                {t("thong_tin_dang_cap_nhat")}
              </p>
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
