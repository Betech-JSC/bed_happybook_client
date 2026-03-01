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
import QuestionAndAnswer from "@/components/product/QuestionAndAnswer";
import VisaSteps from "@/components/home/visa-steps";
import { VisaApi } from "@/api/Visa";
import { notFound } from "next/navigation";
import SeoSchema from "@/components/schema";
import { BlogTypes, blogUrl, pageUrl } from "@/utils/Urls";
import FAQ from "@/components/content-page/FAQ";
import { PageApi } from "@/api/Page";
import ContentByPage from "@/components/content-page/ContentByPage";
import { displayProductPrice, renderTextContent } from "@/utils/Helper";
import { getServerLang } from "@/lib/session";
import DisplayPrice from "@/components/base/DisplayPrice";
import Tabs from "./Tabs";
import ProductGallery from "@/components/product/components/ProductGallery";

export default async function VisaDetail({ alias }: { alias: string }) {
  const response = await VisaApi.detail(alias);
  const detail = response?.payload.data;
  if (!detail.id) {
    notFound();
  }
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("visa", language))?.payload
    ?.data as any;
  return (
    <SeoSchema
      blog={detail}
      breadscrumbItems={[
        {
          url: pageUrl(BlogTypes.VISA, true),
          name: "Visa",
        },
        {
          url: blogUrl(BlogTypes.VISA, detail.slug, true),
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
                  <Link
                    href="/visa"
                    className="text-blue-700"
                    data-translate="true"
                  >
                    Dịch vụ Visa
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {/* <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/visa/visa-nhat-ban"
                    className="text-blue-700"
                    data-translate="true"
                  >
                    Visa Nhật Bản
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem> */}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="#"
                    className="text-gray-700"
                    data-translate="true"
                  >
                    {renderTextContent(detail?.name)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-col-reverse lg:flex-row lg:space-x-8 items-start mt-6">
            <div className="w-full lg:w-8/12 mt-4 lg:mt-0">
              <ProductGallery product={detail} />
              <div className="mt-4">
                <Tabs detail={detail} />
              </div>
              <div className="mt-4 mb-8">
                <QuestionAndAnswer productId={detail.id} />
              </div>
            </div>
            <div className="w-full lg:w-4/12 p-4 md:p-6 bg-white rounded-3xl">
              <div className="mt-4 lg:mt-0 flex flex-col justify-between">
                <div>
                  <h1
                    className="text-2xl font-bold hover:text-primary duration-300 transition-colors"
                    data-translate="true"
                  >
                    {renderTextContent(detail?.name)}
                  </h1>
                  <div className="mt-4">
                    {detail?.product_visa?.ma_visa && (
                      <div>
                        <span className="font-semibold" data-translate="true">
                          Mã visa:
                        </span>{" "}
                        <span data-translate="true">
                          {renderTextContent(detail?.product_visa?.ma_visa)}
                        </span>
                      </div>
                    )}
                    <div className="mt-1">
                      <span className="font-semibold" data-translate="true">
                        Loại Visa:
                      </span>{" "}
                      <span data-translate="true">
                        {renderTextContent(detail?.product_visa?.loai_visa)}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold" data-translate="true">
                        Điểm Đến:
                      </span>{" "}
                      <span data-translate="true">
                        {renderTextContent(detail?.product_visa?.diem_den)}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold" data-translate="true">
                        Thời gian làm Visa:
                      </span>{" "}
                      <span data-translate="true">
                        {renderTextContent(
                          detail?.product_visa?.thoi_gian_lam_visa
                        )}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold" data-translate="true">
                        Thời gian lưu trú:
                      </span>{" "}
                      <span data-translate="true">
                        {renderTextContent(
                          detail?.product_visa?.thoi_gian_luu_tru
                        )}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold" data-translate="true">
                        Số lần nhập cảnh:
                      </span>{" "}
                      <span data-translate="true">
                        {renderTextContent(
                          detail?.product_visa?.so_lan_nhap_canh
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                {/* {detail.price > 0 && ( */}
                <div className="bg-gray-50 text-end p-2 rounded-lg mt-6">
                  {/* <p className="text-gray-500 line-through text-sm md:text-base">
                    {detail.discount_price > 0
                      ? formatCurrency(detail.price)
                      : ""}
                  </p> */}
                  <div className="flex gap-2 mt-3 items-end w-full justify-end">
                    <DisplayPrice
                      textPrefix={
                        detail.discount_price > 0 ? "Giá ưu đãi" : "Giá"
                      }
                      price={detail.price - detail.discount_price}
                      currency={detail?.currency}
                    />
                  </div>
                </div>
                {/* // )} */}
                <div className="mt-6">
                  <Link
                    href={`/visa/checkout/${detail.slug}`}
                    className="bg-blue-600 text__default_hover p-[10px] text-white rounded-lg inline-flex w-full items-center"
                  >
                    <button
                      className="mx-auto text-base font-medium"
                      data-translate="true"
                    >
                      Gửi yêu cầu
                    </button>
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
        <div>
          <VisaSteps />
        </div>
        <div className="bg-white">
          <div className="px-3 lg:px-[80px] max__screen">
            {detail?.similar_visa.length > 0 && (
              <div className="mt-6">
                <h3 className="text-2xl font-bold">Visa tương tự</h3>
                <div className="mt-8">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {detail.similar_visa.map((item: any, index: number) => (
                        <CarouselItem
                          key={index}
                          className="basis-10/12 md:basis-5/12 lg:basis-1/4"
                        >
                          <div className="border-solid border-2 border-[#EAECF0] rounded-2xl bg-white">
                            <Link
                              href={`/visa/${item.slug}`}
                              className="block overflow-hidden rounded-t-2xl	"
                            >
                              <Image
                                className="hover:scale-110 ease-in duration-300 cursor-pointer	"
                                src={`${item.image_url}/${item.image_location}`}
                                alt={item.name}
                                width={200}
                                height={160}
                                sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                                style={{ height: 220, width: "100%" }}
                              />
                            </Link>
                            <Link
                              href={`/visa/${item.slug}`}
                              className="block py-3 px-4 lg:h-[72px] "
                            >
                              <p
                                className={`text-base font-semibold line-clamp-2 text__default_hover`}
                              >
                                {item.name}
                              </p>
                            </Link>
                            {/* <div className="text-end py-3 px-4 mt-2">
                              <span className="text-[#F27145] font-semibold text-base lg:text-xl">
                                {formatCurrency(item.price)}
                              </span>
                            </div> */}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:inline-flex" />
                    <CarouselNext className="hidden lg:inline-flex" />
                  </Carousel>
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
            <div className="my-8 p-8 rounded-2xl bg-gray-50 ">
              <h3 className="text-32 font-bold text-center">
                Vì sao nên chọn HappyBook
              </h3>
              <div className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  <div className="flex items-center space-x-3 h-20">
                    <Image
                      src="/tour/adviser.svg"
                      alt="Tư vấn chuyên nghiệp"
                      className="h-11 w-11"
                      width={44}
                      height={44}
                    ></Image>
                    <div>
                      <p className="text-18 font-semibold mb-1 text-gray-900">
                        Đội ngũ Happybook tư vấn
                      </p>
                      <p className="text-18 font-semibold mb-1 text-gray-900">
                        hỗ trợ nhiệt tình 24/7
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 h-20">
                    <Image
                      src="/tour/developers.svg"
                      alt="Kinh nghiệm lâu năm"
                      className="h-11 w-11"
                      width={44}
                      height={44}
                    ></Image>
                    <div>
                      <p className="text-18 font-semibold mb-1 text-gray-900">
                        Đơn vị hơn 8 năm kinh nghiệm.
                      </p>
                      <p className="text-18 font-semibold text-gray-900">
                        Lấy chữ tín làm đầu
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 h-20">
                    <Image
                      src="/tour/product-icon.svg"
                      alt="Sản phẩm đa dạng"
                      className="h-11 w-11"
                      width={44}
                      height={44}
                    ></Image>
                    <div>
                      <p className="text-18 font-semibold mb-1 text-gray-900">
                        Sản phẩm đa dạng,
                      </p>
                      <p className="text-18 font-semibold text-gray-900">
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
