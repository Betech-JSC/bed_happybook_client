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
import FAQ from "@/components/FAQ";
import { Fragment } from "react";
import Tabs from "../components/Tabs";
import FormContact from "../../components/FormContact";

export const metadata: Metadata = {
  title: "Định Cư Mỹ Diện Trí Thức EB2 Advanced Degree/EB3 Professionals",
  description: "Happy Book",
};

export default function SettleDetail({
  params,
}: {
  params: { alias: string };
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
                    Định cư
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/tour/noi-dia" className="text-blue-700">
                    Định cư Mỹ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className="text-gray-700">
                    Định Cư Mỹ Diện Trí Thức EB2 Advanced Degree/EB3
                    Professionals
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-col-reverse lg:flex-row lg:space-x-8 items-start mt-6 pb-8">
            <div className="w-full lg:w-8/12 mt-4 lg:mt-0">
              <div className="overflow-hidden rounded-lg">
                <Image
                  className="cursor-pointer w-full h-[300px] md:h-[450px] rounded-lg hover:scale-110 ease-in duration-300"
                  src={`/settle-service/detail.png`}
                  alt="Image"
                  width={1000}
                  height={600}
                  sizes="100vw"
                />
              </div>
              <div className="mt-4">
                <Tabs />
              </div>
            </div>
            <div className="w-full lg:w-4/12 p-6 bg-white rounded-3xl">
              <div className="mt-4 lg:mt-0 flex flex-col justify-between">
                <div>
                  <span className="text-2xl font-bold hover:text-primary duration-300 transition-colors">
                    Định Cư Mỹ Diện Trí Thức EB2 Advanced Degree/EB3
                    Professionals
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
                  <p className="text-gray-500 line-through">8.004.927 vnđ</p>
                  <div className="mt-3">
                    <span className="mr-3">Giá từ</span>
                    <span className="text-2xl text-primary font-bold mt-3">
                      7.004.927 vnđ
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="bg-blue-600 text__default_hover p-[10px] text-white rounded-lg inline-flex w-full items-center">
                    <button className="mx-auto text-base font-medium">
                      Liên hệ ngay
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
            <div>
              <FormContact />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
