import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Suspense } from "react";
import FAQ from "@/components/content-page/FAQ";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import { ProductYachtApi } from "@/api/ProductYacht";
import Search from "./components/Search";
import { Metadata } from "next";
import { formatMetadata } from "@/lib/formatters";
import { BlogTypes, pageUrl } from "@/utils/Urls";

export const metadata: Metadata = formatMetadata({
  title: "Đặt Du Thuyền | Du Thuyền Giá Rẻ 2024",
  description:
    "Mời các bạn đặt Du Thuyền, tạo kỷ niệm đáng nhớ với các hoạt động vui chơi thú vị, an toàn tại HappyBook Travel. Ưu đãi hấp dẫn, thanh toán tiện lơi, xác nhận tức thì.",
  alternates: {
    canonical: pageUrl(BlogTypes.YACHT, true),
  },
});

export default async function ProductYacht() {
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
                  <p className="text-blue-700" data-translate="true">
                    Du thuyền
                  </p>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Suspense>
            <Search optionsFilter={optionsFilter} />
          </Suspense>
        </div>
      </div>
      <div className="bg-white">
        <div className="lg:px-[80px] max__screen">
          <div className="my-8 bg-gray-50 rounded-3xl">
            <FAQ />
          </div>
          <div className="my-8 p-8 bg-gray-50 rounded-3xl">
            <WhyChooseHappyBook />
          </div>
        </div>
      </div>
    </>
  );
}
