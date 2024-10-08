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
import FAQ from "@/components/FAQ";
import { Fragment } from "react";
import ImageGallery from "../components/ImageGallery";
import Tabs from "../components/Tabs";
import QuestionAndAnswer from "@/components/QuestionAndAnswer";
import TourItem from "@/components/tour-item";

export const metadata: Metadata = {
  title: "Tour",
  description: "Happy Book",
};
const tours = [
  {
    category: "Du lịch miền Nam",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/tour-noi-dia/1.png",
    hot: 1,
  },
  {
    category: "Du lịch miền Nam",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/tour-noi-dia/2.png",
  },
  {
    category: "Du lịch miền Nam",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/tour-noi-dia/3.png",
  },
  {
    category: "Du lịch miền Nam",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/tour-noi-dia/4.png",
    vehicle: "aa",
  },
  {
    category: "Du lịch miền Nam",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/tour-noi-dia/1.png",
  },
];

export default function CategoryPosts({
  params,
}: {
  params: { category: string };
}) {
  return (
    <Fragment>
      <div className="bg-gray-100">
        <div className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
          <Breadcrumb className="pt-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="text-blue-700">
                    Trang chủ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/tour" className="text-blue-700">
                    Tours
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/tour/noi-dia" className="text-blue-700">
                    Tours nội địa
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className="text-gray-700">
                    HCM - Hà Nội - Sapa - Lào Cai - Ninh Bình - Hạ Long 5N4Đ
                    (Tour bao gồm máy bay)
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-col-reverse lg:flex-row lg:space-x-8 items-start mt-6">
            <div className="w-full lg:w-8/12 mt-4 lg:mt-0">
              <ImageGallery />
              <div className="mt-4">
                <Tabs />
              </div>
              <div className="mt-4 mb-8">
                <QuestionAndAnswer />
              </div>
            </div>
            <div className="w-full lg:w-4/12 p-6 bg-white rounded-3xl">
              <div className="mt-4 lg:mt-0 flex flex-col justify-between">
                <div>
                  <span className="text-2xl font-bold hover:text-primary duration-300 transition-colors">
                    HCM - Hà Nội - Sapa - Lào Cai - Ninh Bình - Hạ Long 5N4Đ
                    (Tour bao gồm máy bay)
                  </span>
                  <div className="flex space-x-2 mt-2">
                    <span className="w-9 h-6 rounded-xl rounded-tr bg-primary text-white font-semibold text-center">
                      9.8
                    </span>
                    <span className="text-primary font-semibold">Xuất sắc</span>
                    <span className="text-gray-500">234 đánh giá</span>
                  </div>
                  <div className="flex space-x-2 mt-6 items-center">
                    <Image
                      className="w-4 h-4"
                      src="/icon/clock.svg"
                      alt="Icon"
                      width={18}
                      height={18}
                    />
                    <span>2 ngày 1 đêm</span>
                  </div>
                  <div className="flex space-x-2 mt-3 items-center">
                    <Image
                      className="w-4 h-4"
                      src="/icon/flag.svg"
                      alt="Icon"
                      width={18}
                      height={18}
                    />
                    <span>Khởi hành từ Hồ Chí Minh Thứ 6, Thứ 7 hàng tuần</span>
                  </div>
                  <div className="flex space-x-2 mt-3 items-center">
                    <Image
                      className="w-4 h-4"
                      src="/icon/marker-pin-01.svg"
                      alt="Icon"
                      width={18}
                      height={18}
                    />
                    <span>
                      Hồ Chí Minh - Cù lao Thới Sơn - Cồn Phụng - Chợ nổi Cái
                      Răng
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 text-end p-2 rounded-lg mt-6">
                  <p className="text-gray-500 line-through">8.004.927 vnđ</p>
                  <p className="text-2xl text-primary font-bold mt-3">
                    7.004.927 vnđ
                  </p>
                </div>
                <div className="mt-6">
                  <div className="bg-blue-600 text__default_hover p-[10px] text-white rounded-lg inline-flex w-full items-center">
                    <button className="mx-auto text-base font-medium">
                      Gửi yêu cầu
                    </button>
                  </div>
                  <div className="text__default_hover text-gray-700 rounded-lg p-[10px] border border-gray-300 mt-3 inline-flex w-full items-center">
                    <button className="mx-auto text-base font-medium">
                      Xem lịch khởi hành
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-white">
          <div className="px-3 lg:px-[80px] max__screen">
            <div className="mt-8 w-full">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {tours.map((tour, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                    >
                      <TourItem {...tour} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden lg:inline-flex" />
                <CarouselNext className="hidden lg:inline-flex" />
              </Carousel>
            </div>
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
                      alt="Icon"
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
                      alt="Icon"
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
                      alt="Icon"
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
    </Fragment>
  );
}
