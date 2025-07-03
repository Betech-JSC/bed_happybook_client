import type { Metadata } from "next";
import { TourApi } from "@/api/Tour";
import { PageApi } from "@/api/Page";
import { Fragment, Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import ListTour from "../components/ListTour";
import ContentByPage from "@/components/content-page/ContentByPage";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import FAQ from "@/components/content-page/FAQ";
import { formatMetadata } from "@/lib/formatters";
import { BlogTypes, pageUrl } from "@/utils/Urls";

function getMetadata(data: any) {
  return formatMetadata({
    title: data?.meta_title || data?.page_name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: data?.canonical_link || pageUrl(BlogTypes.TOURS, true),
    },
    openGraph: {
      images: [
        {
          url: data?.meta_image
            ? data.meta_image
            : `${data?.image_url}/${data?.image_location}`,
          alt: data?.meta_title,
        },
      ],
    },
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const contentPage = (await PageApi.getContent("tours"))?.payload?.data as any;

  return getMetadata(contentPage);
}

export default async function SearchTours() {
  const contentPage = (await PageApi.getContent("tours"))?.payload?.data as any;
  const optionsFilter = (await TourApi.getOptionsFilter(undefined))?.payload
    ?.data as any;
  return (
    <Fragment>
      <div className="bg-gray-100">
        <div className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
          <Breadcrumb className="pt-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="text-blue-700" data-translate>
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
                  <Link href="#" className="text-gray-700" data-translate>
                    Tìm kiếm
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* Section Tour */}
          <Suspense>
            <ListTour
              type_tour={undefined}
              titlePage={"Tìm kiếm"}
              optionsFilter={optionsFilter}
            />
          </Suspense>
          {/* <div className="min-h-52 text-center mt-20 text-xl">
            Dữ liệu đang được cập nhật....
          </div> */}
          {/* Section Before Footer */}
        </div>
      </div>
      <div className="px-3 lg:px-[80px] max__screen">
        {/* Blog */}
        {contentPage && (
          <div className="mt-8 rounded-2xl bg-gray-50 p-8">
            <ContentByPage data={contentPage} />
          </div>
        )}
        {/* Faq */}
        <div className="my-8">
          <FAQ />
        </div>
        <div className="my-8 p-8 rounded-2xl bg-gray-50 ">
          <WhyChooseHappyBook />
        </div>
      </div>
    </Fragment>
  );
}
