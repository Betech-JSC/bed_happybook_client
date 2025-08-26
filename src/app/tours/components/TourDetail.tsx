import Image from "next/image";
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
import QuestionAndAnswer from "@/components/product/QuestionAndAnswer";
import TourItem from "@/components/product/components/tour-item";
import { TourApi } from "@/api/Tour";
import { notFound } from "next/navigation";
import SeoSchema from "@/components/schema";
import { pageUrl, ProductTypes, productUrl } from "@/utils/Urls";
import { formatCurrency } from "@/lib/formatters";
import { getLabelRatingProduct, renderTextContent } from "@/utils/Helper";
import { getServerLang } from "@/lib/session";
import ImageGallery from "./ImageGallery";
import Tabs from "./Tabs";
import ProductGallery from "@/components/product/components/ProductGallery";

export default async function TourDetail({ alias }: { alias: string }) {
  const language = await getServerLang();
  const res = (await TourApi.detail(alias, language)) as any;
  const detail = res?.payload?.data;
  if (!detail?.id) {
    notFound();
  }
  let typeTourText: string = "Tour nội địa";
  let categorySlug: string = "tour-noi-dia";
  switch (detail.type_tour) {
    case 1:
      typeTourText = "Tour quốc tế";
      categorySlug = "tour-quoc-te";
      break;
    case 2:
      typeTourText = "Tour du thuyền";
      categorySlug = "tour-du-thuyen";
      break;
  }
  return (
    <SeoSchema
      product={detail}
      type={ProductTypes.TOURS}
      breadscrumbItems={[
        {
          url: pageUrl(ProductTypes.TOURS, true),
          name: "Tours",
        },
        {
          url: productUrl(ProductTypes.TOURS, detail.slug, true),
          name: detail?.name as string,
        },
      ]}
    >
      <div className="bg-gray-100">
        <div className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
          <Breadcrumb className="pt-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="text-blue-700"
                    data-translate="true"
                  >
                    Trang chủ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/tours" className="text-blue-700">
                    Tours
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/tours/${categorySlug}`}
                    className="text-blue-700"
                    data-translate
                  >
                    {typeTourText}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className="text-gray-700" data-translate>
                    {renderTextContent(detail.name)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-col-reverse lg:flex-row lg:space-x-8 items-start mt-6">
            <div className="w-full lg:w-8/12 mt-4 lg:mt-0">
              {detail?.gallery && <ProductGallery product={detail} />}
              <div className="mt-4">
                <Tabs detail={detail} id={detail.id} />
              </div>
              <div className="mt-4 mb-8">
                <QuestionAndAnswer productId={detail.id} />
              </div>
            </div>
            <div className="w-full lg:w-4/12 p-6 bg-white rounded-3xl">
              <div className="mt-4 lg:mt-0 flex flex-col justify-between">
                <div>
                  <h1
                    className="text-2xl font-bold hover:text-primary duration-300 transition-colors"
                    data-translate
                  >
                    {detail.name ?? ""}
                  </h1>
                  <div className="flex space-x-2 mt-2">
                    {detail.average_rating >= 2 && (
                      <Fragment>
                        <span className="w-9 h-6 rounded-xl rounded-tr bg-primary text-white font-semibold text-center">
                          {detail.average_rating}
                        </span>
                        <span
                          className="text-primary font-semibold"
                          data-translate
                        >
                          {getLabelRatingProduct(
                            detail.average_rating,
                            language
                          )}
                        </span>
                      </Fragment>
                    )}
                    <span className="text-gray-500">
                      {detail.total_rating ?? 0}
                    </span>
                    <span data-translate> đánh giá</span>
                  </div>
                  <div className="flex space-x-2 mt-6 items-center">
                    <Image
                      className="w-4 h-4"
                      src="/icon/clock.svg"
                      alt="Icon"
                      width={18}
                      height={18}
                    />
                    <span>
                      <span data-translate>
                        {`${detail.day ? `${detail.day} ngày` : ""} ${
                          detail.night ? `${detail.night} đêm` : ""
                        }`}
                      </span>
                    </span>
                  </div>
                  <div>
                    {detail.remain && (
                      <p className="flex space-x-2 mt-2">
                        <Image
                          src="/icon/Ticket.svg"
                          alt="Time"
                          width={20}
                          height={20}
                        />
                        <span data-translate>{`Chỗ trống: ${
                          detail.remain ?? "Liên hệ"
                        }`}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-3 items-center">
                    <Image
                      className="w-4 h-4"
                      src="/icon/flag.svg"
                      alt="Icon"
                      width={18}
                      height={18}
                    />
                    <span data-translate>
                      {detail.depart_point
                        ? `Khởi hành từ ${detail.depart_point}`
                        : ""}
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
                    <span data-translate>{detail.destination_point ?? ""}</span>
                  </div>
                </div>
                <div className="bg-gray-50 text-end p-2 rounded-lg mt-6">
                  {detail.discount_price > 0 && (
                    <p className="text-gray-500 line-through">
                      {detail.price > 0
                        ? `${formatCurrency(detail.price)}`
                        : ""}
                    </p>
                  )}
                  <p className="text-2xl text-primary font-bold mt-3">
                    {detail.price > 0 ? (
                      <span>
                        {formatCurrency(detail.price - detail.discount_price)}
                      </span>
                    ) : (
                      <span data-translate>Liên hệ</span>
                    )}
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/tours/checkout/${detail.slug}`}
                    className="bg-blue-600 text__default_hover p-[10px] text-white rounded-lg inline-flex w-full items-center"
                  >
                    <span
                      className="mx-auto text-base font-medium"
                      data-translate="true"
                    >
                      Gửi yêu cầu
                    </span>
                  </Link>
                  {/* <div className="text__default_hover text-gray-700 rounded-lg p-[10px] border border-gray-300 mt-3 inline-flex w-full items-center">
                    <button className="mx-auto text-base font-medium">
                      Xem lịch khởi hành
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-white">
          <div className="px-3 lg:px-[80px] max__screen">
            {detail?.similar_tours?.length > 0 && (
              <div className="w-full">
                <p className="text-32 font-bold my-6" data-translate>
                  Tour du lịch tương tự
                </p>
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {detail.similar_tours.map((tour: any, index: number) => (
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
            )}
            {/* Faq */}
            {/* <div className="my-8">
              <FAQ />
            </div> */}
            <div className="my-8 p-8 rounded-2xl bg-gray-50 ">
              <h3 className="text-32 font-bold text-center" data-translate>
                Vì sao nên chọn HappyBook
              </h3>
              <div className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  <div className="flex items-center space-x-3 h-20">
                    <Image
                      src="/tour/adviser.svg"
                      alt="Icon"
                      className="h-11 w-11"
                      width={44}
                      height={44}
                    ></Image>
                    <div>
                      <p
                        className="text-18 font-semibold mb-1 text-gray-900"
                        data-translate
                      >
                        Đội ngũ Happybook tư vấn
                      </p>
                      <p
                        className="text-18 font-semibold mb-1 text-gray-900"
                        data-translate
                      >
                        hỗ trợ nhiệt tình 24/7
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 h-20">
                    <Image
                      src="/tour/developers.svg"
                      alt="Icon"
                      className="h-11 w-11"
                      width={44}
                      height={44}
                    ></Image>
                    <div>
                      <p
                        className="text-18 font-semibold mb-1 text-gray-900"
                        data-translate
                      >
                        Đơn vị hơn 8 năm kinh nghiệm.
                      </p>
                      <p
                        className="text-18 font-semibold text-gray-900"
                        data-translate
                      >
                        Lấy chữ tín làm đầu
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 h-20">
                    <Image
                      src="/tour/product-icon.svg"
                      alt="Icon"
                      className="h-11 w-11"
                      width={44}
                      height={44}
                    ></Image>
                    <div>
                      <p
                        className="text-18 font-semibold mb-1 text-gray-900"
                        data-translate
                      >
                        Sản phẩm đa dạng,
                      </p>
                      <p
                        className="text-18 font-semibold text-gray-900"
                        data-translate
                      >
                        giá cả tốt nhất
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SeoSchema>
  );
}
