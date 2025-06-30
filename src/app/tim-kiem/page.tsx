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
import { settingApi } from "@/api/Setting";

async function getMetadata() {
  const res = await settingApi.getMetaSeo();
  const seo = res?.payload?.data;

  return formatMetadata({
    robots: "index, follow",
    title: `Vé Máy Bay | ${seo.seo_title}`,
    description: `Vé Máy Bay | ${seo.seo_title}`,
    alternates: {
      canonical: pageUrl("tim-kiem"),
    },
  });
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const metadata = await getMetadata();
  return metadata;
}

export default async function SearchAll() {
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
            <SearchAllResult />
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
