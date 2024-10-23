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
import CompoItem from "@/components/CompoItem";

export const metadata: Metadata = {
  title:
    "HCM - Hà Nội - Sapa - Lào Cai - Ninh Bình - Hạ Long 5N4Đ (Tour bao gồm máy bay)",
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
      <div className="bg-gray-100 pb-8">
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
                  <Link href="/compo" className="text-blue-700">
                    Compo
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className="text-gray-700">
                    Combo 3N2Đ Vinpearl Resort Nha Trang 5 sao + Vé máy bay
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
            </div>
            <div className="w-full lg:w-4/12 p-6 bg-white rounded-3xl">
              <div className="mt-4 lg:mt-0 flex flex-col justify-between">
                <div>
                  <span className="text-2xl font-bold hover:text-primary duration-300 transition-colors">
                    Combo 3N2Đ Vinpearl Resort Nha Trang 5 sao + Vé máy bay
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
                    <span>3 ngày 2 đêm</span>
                  </div>

                  <div className="flex space-x-2 mt-3 items-center">
                    <Image
                      className="w-4 h-4"
                      src="/icon/marker-pin-01.svg"
                      alt="Icon"
                      width={18}
                      height={18}
                    />
                    <span>Nha Trang</span>
                  </div>
                  <div className="mt-4 p-2 border border-gray-100 rounded-xl">
                    <div className="border-b border-b-gray-100 pb-3">
                      <div>
                        <span className="mr-2">Khởi hành từ</span>
                        <span className="font-semibold">Hồ Chí Minh</span>
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
                        <span className="font-semibold">Hà Nội</span>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <span className="mr-2">01/11 → 30/11</span>
                        <span className="font-normal text-primary">
                          4.299.000đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" bg-gray-50 text-end p-2 rounded-lg mt-6">
                  <span className="text-2xl text-primary font-bold">
                    3.999.000 vnđ
                  </span>{" "}
                  <span>/ khách</span>
                  <p className="text-blue-700 mt-3">+ 40 điểm</p>
                </div>
                <div className="mt-6">
                  <div className="bg-blue-600 text__default_hover p-[10px] text-white rounded-lg inline-flex w-full items-center">
                    <button className="mx-auto text-base font-medium">
                      Yêu cầu đặt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Hotel />
          </div>
        </div>
      </div>
      <div className="bg-white my-6">
        <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
          <h3 className="text-2xl md:text-32 font-bold">Các combo khác</h3>
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
                    <CompoItem {...tour} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden lg:inline-flex" />
              <CarouselNext className="hidden lg:inline-flex" />
            </Carousel>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
