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
import { Fragment } from "react";
import Tabs from "../components/Tabs";
import FormContact from "../../components/FormContact";
import FAQ from "@/components/content-page/FAQ";
import { DinhCuApi } from "@/api/DinhCu";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";

export const metadata: Metadata = {
  title: "Định Cư Mỹ Diện Trí Thức EB2 Advanced Degree/EB3 Professionals",
  description: "Happy Book",
};

export default async function SettleDetail({
  params,
}: {
  params: { alias: string };
}) {
  const res = (await DinhCuApi.detail(params.alias)) as any;
  const detail = res?.payload?.data;
  if (!detail) {
    notFound();
  }
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
                  <Link href="/dinh-cu" className="text-blue-700">
                    Định cư
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/dinh-cu/${detail?.category?.alias}`}
                    className="text-blue-700"
                  >
                    {detail?.category?.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className="text-gray-700">
                    {detail.name}
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
                  src={`${detail.image_url}/${detail.image_location}`}
                  alt="Image"
                  width={1000}
                  height={600}
                  sizes="100vw"
                />
              </div>
              <div className="mt-4">
                <Tabs data={detail?.product_dinhcu} />
              </div>
            </div>
            <div className="w-full lg:w-4/12 p-6 bg-white rounded-3xl">
              <div className="mt-4 lg:mt-0 flex flex-col justify-between">
                <div>
                  <h1 className="text-2xl font-bold hover:text-primary duration-300 transition-colors">
                    {detail.name}
                  </h1>
                  <div className="mt-6">
                    <div>
                      <span className="font-semibold">Mã visa:</span>{" "}
                      <span>{detail?.product_dinhcu?.ma_visa}</span>
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold">Loại Visa:</span>{" "}
                      <span>{detail?.product_dinhcu?.loai_visa}</span>
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold">Điểm Đến:</span>{" "}
                      <span>{detail?.product_dinhcu?.diem_den}</span>
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold">Thời gian làm Visa:</span>{" "}
                      <span>{detail?.product_dinhcu?.thoi_gian_lam_visa}</span>
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold">Thời gian lưu trú:</span>{" "}
                      <span>{detail?.product_dinhcu?.thoi_gian_luu_tru}</span>
                    </div>
                    <div className="mt-1">
                      <span className="font-semibold">Số lần nhập cảnh:</span>{" "}
                      <span>{detail?.product_dinhcu?.so_lan_nhap_canh}</span>
                    </div>
                  </div>
                </div>
                {detail.price > 0 && (
                  <div className="bg-gray-50 text-end p-2 rounded-lg mt-6">
                    <p className="text-gray-500 line-through text-sm md:text-base">
                      {formatCurrency(detail.price)}
                    </p>
                    <div className="flex justify-between mt-3 items-end">
                      <p className="font-semibold">Giá dịch vụ hỗ trợ từ:</p>
                      <p className="text-base md:text-xl text-primary font-semibold">
                        {formatCurrency(detail.price - detail.discount_price)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-6">
                  <Link
                    href={`/dinh-cu/chi-tiet/${detail.slug}/checkout`}
                    className="bg-blue-600 text__default_hover p-[10px] text-white rounded-lg inline-flex w-full items-center"
                  >
                    <button className="mx-auto text-base font-medium">
                      Liên hệ ngay
                    </button>
                  </Link>
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
