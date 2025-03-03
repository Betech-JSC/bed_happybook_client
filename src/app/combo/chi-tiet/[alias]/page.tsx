import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Fragment } from "react";
import ImageGallery from "../../components/ImageGallery";
import Tabs from "../../components/Tabs";
import Hotel from "../../components/Hotel";
import CompoItem from "@/components/product/components/CompoItem";
import { ComboApi } from "@/api/Combo";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { getLabelRatingProduct, renderTextContent } from "@/utils/Helper";

export const metadata: Metadata = {
  title: "Combo 3N2Đ Vinpearl Resort Nha Trang 5 sao + Vé máy bay",
  description: "Happy Book",
};

export default async function CompoDetail({
  params,
}: {
  params: { alias: string };
}) {
  const detail = (await ComboApi.detail(params.alias))?.payload?.data as any;
  if (!detail) {
    notFound();
  }
  return (
    <Fragment>
      <div className="bg-gray-100 pb-8">
        <div className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
          <Breadcrumb className="pt-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="text-blue-700"
                    data-translate={true}
                  >
                    Trang chủ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/combo" className="text-blue-700">
                    Combo
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="#"
                    className="text-gray-700"
                    data-translate={true}
                  >
                    {renderTextContent(detail.name)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-col-reverse lg:flex-row lg:space-x-8 items-start mt-6">
            <div className="w-full lg:w-8/12 mt-4 lg:mt-0">
              <ImageGallery gallery={detail?.gallery ?? []} />
              <div className="mt-4">
                <Tabs data={detail} />
              </div>
            </div>
            <div className="w-full lg:w-4/12 p-6 bg-white rounded-3xl">
              <div className="mt-4 lg:mt-0 flex flex-col justify-between">
                <div>
                  <h1
                    className="text-2xl font-bold hover:text-primary duration-300 transition-colors"
                    data-translate={true}
                  >
                    {renderTextContent(detail.name)}
                  </h1>
                  <div className="flex space-x-2 mt-2">
                    <span className="w-9 h-6 rounded-xl rounded-tr bg-primary text-white font-semibold text-center">
                      {detail?.average_rating ?? 0}
                    </span>
                    <span className="text-primary font-semibold">
                      {getLabelRatingProduct(detail?.total_rating)}
                    </span>
                    <span className="text-gray-500" data-translate={true}>
                      {detail?.total_rating ?? 0} đánh giá
                    </span>
                  </div>
                  <div className="flex space-x-2 mt-6 items-center">
                    <Image
                      className="w-4 h-4"
                      src="/icon/clock.svg"
                      alt="Icon"
                      width={18}
                      height={18}
                    />
                    <span data-translate={true}>
                      {`${detail?.combo?.day ? detail.combo.day : ""} ngày ${
                        detail?.combo?.night ? detail.combo.night : ""
                      } đêm`}
                    </span>
                  </div>

                  <div className="flex space-x-2 mt-3 items-center">
                    <Image
                      className="w-4 h-4"
                      src="/icon/marker-pin-01.svg"
                      alt="Icon"
                      width={18}
                      height={18}
                    />
                    <span data-translate={true}>
                      {renderTextContent(detail?.combo?.address)}
                    </span>
                  </div>
                  {/* <div className="mt-4 p-2 border border-gray-100 rounded-xl">
                    <div className="border-b border-b-gray-100 pb-3">
                      <div>
                        <span className="mr-2">Khởi hành từ</span>
                        <span className="font-semibold">
                          {detail.combo.start_location_data.name}
                        </span>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <span className="mr-2">01/11 → 30/11</span>
                        <span className="font-normal text-primary">
                          3.999.000đ
                        </span>
                      </div>
                    </div>
                    <div className="border-b border-b-gray-100">
                      <div>
                        <span className="mr-2">Khởi hành từ</span>
                        <span className="font-semibold">
                          {detail.combo.destination_location_data.name}
                        </span>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <span className="mr-2">01/11 → 30/11</span>
                        <span className="font-normal text-primary">
                          4.299.000đ
                        </span>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div className=" bg-gray-50 text-end p-2 rounded-lg mt-6">
                  <span className="text-2xl text-primary font-bold">
                    {detail?.price > 0 ? (
                      formatCurrency(detail?.price - detail?.discount_price)
                    ) : (
                      <span data-translate={true}>Liên hệ</span>
                    )}
                  </span>
                  {/* <span>/ khách</span> */}
                  {/* <p className="text-blue-700 mt-3">+ 40 điểm</p> */}
                </div>
                <div className="mt-6">
                  <Link
                    href={`/combo/chi-tiet/${detail?.slug}/checkout`}
                    className="bg-blue-600 text__default_hover p-[10px] text-white rounded-lg inline-flex w-full items-center"
                  >
                    <span
                      className="block mx-auto text-base font-medium"
                      data-translate={true}
                    >
                      Yêu cầu đặt
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Hotel data={detail} />
          </div>
        </div>
      </div>
      {detail?.similar_combo?.length > 0 && (
        <div className="bg-white my-6">
          <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
            <h2 className="text-2xl md:text-32 font-bold">Các combo khác</h2>
            <div className="mt-8 w-full">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {detail.similar_combo.map((combo: any) => (
                    <CarouselItem
                      key={combo.id}
                      className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                    >
                      <CompoItem data={combo} />
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
    </Fragment>
  );
}
