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

export const metadata: Metadata = formatMetadata({
  title:
    "Combo Archives - HappyBook Travel: Đặt vé máy bay, Tour, Khách sạn giá rẻ #1",
  description:
    "Combo Archives - HappyBook Travel: Đặt vé máy bay, Tour, Khách sạn giá rẻ #1",
  alternates: {
    canonical: pageUrl(BlogTypes.COMPO, true),
  },
});

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
            {hotDestination?.length > 0 && (
              <div className="w-full">
                <h2 className="text-32 font-bold" data-translate="true">
                  Khám phá các điểm đến HOT
                </h2>
                <div className="mt-8 overflow-hidden">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {hotDestination.map((item: any) => (
                        <CarouselItem
                          key={item.id}
                          className="basis-10/12 md:basis-5/12 lg:basis-[30%]"
                        >
                          <div className="overflow-hidden rounded-lg relative">
                            <Link href={item.url ?? "#"}>
                              <Image
                                src={`${item.image_url}/${item.image_location}`}
                                width={365}
                                height={245}
                                className=" h-56 rounded-lg hover:scale-110 ease-in duration-300"
                                sizes="100vw"
                                alt={item.name}
                              />
                            </Link>
                            <div className="absolute bottom-3 left-2 text-white px-3 py-1">
                              <Link href={item.url ?? "#"}>
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
            {comboData?.comboDomestic?.length > 0 && (
              <>
                <div className="flex flex-col md:flex-row mt-8 justify-between items-start md:items-center">
                  <h2 className="text-32 font-bold" data-translate="true">
                    Các combo du lịch ưu đãi
                  </h2>
                  {/* <div className="flex my-4 md:my-0 space-x-3 items-center">
                    <span>Sắp xếp</span>
                    <div className="w-40 bg-white border border-gray-200 rounded-lg">
                      <select
                        className="px-4 py-2 rounded-lg w-[90%] outline-none bg-white"
                        name=""
                        id=""
                      >
                        <option value="">Mới nhất</option>
                        <option value="">Cũ nhất</option>
                      </select>
                    </div>
                  </div> */}
                </div>
                <div className="mt-8 grid md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                  {comboData?.comboDomestic.map((combo: any) => (
                    <div key={combo.id}>
                      <CompoItem data={combo} />
                    </div>
                  ))}
                </div>
              </>
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
