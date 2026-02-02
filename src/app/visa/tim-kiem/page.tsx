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
import SeoSchema from "@/components/schema";
import { VisaApi } from "@/api/Visa";
import { notFound } from "next/navigation";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import ListVisa from "../components/ListVisa";
import FAQ from "@/components/content-page/FAQ";
import ContentByPage from "@/components/content-page/ContentByPage";
import { PageApi } from "@/api/Page";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import { getServerLang } from "@/lib/session";

export default async function SearchVisa({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const text = searchParams?.text ?? "";
  const optionsFilter = (
    await VisaApi.getOptionsFilter(
      text ? { text } : undefined
    )
  )?.payload?.data as any;
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("visa", language))?.payload
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
                  <Link
                    href="/visa"
                    className="text-blue-700"
                    data-translate="true"
                  >
                    Dịch vụ Visa
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="#"
                    className="text-gray-700"
                    data-translate="true"
                  >
                    Tìm kiếm
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* Section Visa */}
          <ListVisa searchParams={searchParams} optionsFilter={optionsFilter} />
          {/* Section Before Footer */}
        </div>
      </div>
      <div className="px-3 lg:px-[80px] max__screen">
        {/* Blog */}
        {contentPage?.content && (
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
    </>
  );
}
