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
import QuestionAndAnswer from "@/components/QuestionAndAnswer";
import ImageGallery from "../components/ImageGallery";
import Tabs from "../components/Tabs";
import VisaSteps from "@/components/home/visa-steps";

export const metadata: Metadata = {
  title: "Dịch Vụ Hỗ Trợ Làm Thủ Tục Visa Nhật Bản",
  description: "Happy Book",
};

const visa = [
  {
    title: "Visa Trung Quốc",
    image: "/visa/1.png",
  },
  {
    title: "Visa Đài Loan",
    image: "/visa/2.png",
  },
  {
    title: "Visa Nhật Bản",
    image: "/visa/3.png",
  },
  {
    title: "Visa Hàn Quốc",
    image: "/visa/4.png",
  },
  {
    title: "Visa Đài Loan",
    image: "/visa/2.png",
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
                  <Link href="/visa" className="text-blue-700">
                    Dịch vụ Visa
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/visa/visa-nhat-ban" className="text-blue-700">
                    Visa Nhật Bản
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className="text-gray-700">
                    Dịch Vụ Hỗ Trợ Làm Thủ Tục Visa Nhật Bản
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
            <div className="w-full lg:w-4/12 p-4 md:p-6 bg-white rounded-3xl">
              <div className="mt-4 lg:mt-0 flex flex-col justify-between">
                <div>
                  <span className="text-2xl font-bold hover:text-primary duration-300 transition-colors">
                    Dịch Vụ Hỗ Trợ Làm Thủ Tục Visa Nhật Bản
                  </span>
                  <div className="mt-6">
                    <div>
                      <span className="font-semibold">Mã visa:</span>{" "}
                      <span>VS001</span>
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold">Loại Visa:</span>{" "}
                      <span>Du lịch</span>
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold">Điểm Đến:</span>{" "}
                      <span>Visa Nhật Bản</span>
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold">Thời gian làm Visa:</span>{" "}
                      <span>10 ngày</span>
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold">Thời gian lưu trú:</span>{" "}
                      <span>14 ngày</span>
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold">Số lần nhập cảnh:</span>{" "}
                      <span>3 tháng 1 lần</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 text-end p-2 rounded-lg mt-6">
                  <p className="text-gray-500 line-through text-sm md:text-base">
                    3.000.000 vnđ
                  </p>
                  <div className="flex justify-between mt-3 items-end">
                    <p className="font-semibold">Giá dịch vụ hỗ trợ từ:</p>
                    <p className="text-base md:text-xl text-primary font-semibold">
                      2.500.000 vnđ
                    </p>
                  </div>
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
        <div>
          <VisaSteps />
        </div>
        <div className="bg-white">
          <div className="px-3 lg:px-[80px] max__screen">
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
                    {visa.map((item, index) => (
                      <CarouselItem
                        key={index}
                        className="basis-10/12 md:basis-5/12 lg:basis-1/4"
                      >
                        <div className="border-solid border-2 border-[#EAECF0] rounded-2xl bg-white">
                          <div className="overflow-hidden rounded-t-2xl	">
                            <Image
                              className="hover:scale-110 ease-in duration-300 cursor-pointer	"
                              src={item.image}
                              alt="Banner"
                              width={200}
                              height={160}
                              sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                              style={{ height: "100%", width: "100%" }}
                            />
                          </div>
                          <div className="py-3 px-4 lg:h-[72px] ">
                            <p
                              className={`text-base font-semibold line-clamp-2 text__default_hover`}
                            >
                              {item.title}
                            </p>
                          </div>
                          <div className="text-end py-3 px-4 mt-2">
                            <span className="text-[#F27145] font-semibold text-base lg:text-xl">
                              800.000 vnđ
                            </span>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden lg:inline-flex" />
                  <CarouselNext className="hidden lg:inline-flex" />
                </Carousel>
              </div>
            </div>
            {/* Blog */}
            <div className="mt-8 rounded-2xl bg-gray-50 p-8">
              <h3 className="text-2xl font-bold">
                Trọn gói dịch vụ làm visa Nhật Bản cực kỳ đơn giản, chi phí hấp
                dẫn
              </h3>
              <p className="mt-6 line-clamp-2">
                Nếu bạn muốn đến Nhật Bản để du lịch, thăm thân hoặc công tác…
                bạn cần có “giấy thông hành” chính là visa. Nhưng bạn lại lo
                lắng, băn khoăn về thủ tục, lệ phí xin visa Nhật Bản. Hãy đến
                với Lữ hành Việt Nam để đăng ký sử dụng dịch vụ làm visa Nhật
                Bản trọn gói nhanh gọn và tiết kiệm.
              </p>
              <button className="flex group mt-6 space-x-2 text-blue-700 mx-auto justify-center items-center">
                <span className="font-medium group-hover:text-primary duration-300">
                  Xem thêm
                </span>
                <svg
                  className="group-hover:stroke-primary stroke-blue-700 duration-300"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
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
