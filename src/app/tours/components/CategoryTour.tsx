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
import { TourApi } from "@/api/Tour";
import { notFound } from "next/navigation";
import SeoSchema from "@/components/schema";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import ListTour from "../components/ListTour";
import { Suspense } from "react";
import { PageApi } from "@/api/Page";
import ContentByPage from "@/components/content-page/ContentByPage";
import FAQ from "@/components/content-page/FAQ";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import { getServerLang } from "@/lib/session";

export default async function CategoryTour({ alias }: { alias: string }) {
  let typeTour: number | undefined;
  let titlePage: string;
  switch (alias) {
    case "tour-noi-dia":
      typeTour = 0;
      titlePage = "Tour nội địa";
      break;
    case "tour-quoc-te":
      typeTour = 1;
      titlePage = "Tour quốc tế";
      break;
    case "tour-du-thuyen":
      typeTour = 2;
      titlePage = "Tour du thuyền";
      break;
    default:
      typeTour = undefined;
      titlePage = "Tìm kiếm";
  }
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent(alias, language))?.payload
    ?.data as any;
  const optionsFilter = (await TourApi.getOptionsFilter(typeTour))?.payload
    ?.data as any;
  return (
    <SeoSchema
      article={contentPage}
      type={BlogTypes.TOURS}
      breadscrumbItems={[
        { url: pageUrl(BlogTypes.TOURS, true), name: "Tours" },
        {
          url: pageUrl(contentPage?.slug, BlogTypes.TOURS, true),
          name: contentPage?.title,
        },
      ]}
    >
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
                    {titlePage}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* Section Tour */}
          <Suspense>
            <ListTour
              type_tour={typeTour ?? undefined}
              titlePage={titlePage}
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
    </SeoSchema>
  );
}
