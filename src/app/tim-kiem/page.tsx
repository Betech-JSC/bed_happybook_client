import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Suspense } from "react";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import { ProductYachtApi } from "@/api/ProductYacht";
import { Metadata } from "next";
import { formatMetadata } from "@/lib/formatters";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import SearchAllResult from "./components/SearchResult";

export const metadata: Metadata = formatMetadata({
  robots: "index, follow",
  title:
    "Vé Máy Bay - HappyBook Travel: Đặt vé máy bay, Tour, Khách sạn giá rẻ #1",
  description:
    "Vé Máy Bay - HappyBook Travel: Đặt vé máy bay, Tour, Khách sạn giá rẻ #1",
  alternates: {
    canonical: pageUrl("tim-kiem"),
  },
});

export default async function SearchAll() {
  const optionsFilter = (await ProductYachtApi.getOptionsFilter())?.payload
    ?.data as any;
  return (
    <>
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
                  <p className="text-gray-700" data-translate="true">
                    Tìm kiếm
                  </p>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Suspense>
            <SearchAllResult optionsFilter={optionsFilter} />
          </Suspense>
        </div>
      </div>
      {/* <div className="bg-[#F9FAFB]">
        <div className="lg:px-[80px] max__screen">
          <div className="mb-8 p-8 bg-gray-50 rounded-3xl">
            <WhyChooseHappyBook />
          </div>
        </div>
      </div> */}
    </>
  );
}
