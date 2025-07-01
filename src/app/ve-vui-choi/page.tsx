import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Suspense } from "react";
import Search from "./components/Search";
import FAQ from "@/components/content-page/FAQ";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import { ProductTicket } from "@/api/ProductTicket";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { formatMetadata } from "@/lib/formatters";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { PageApi } from "@/api/Page";
import { getServerLang } from "@/lib/session";
import SeoSchema from "@/components/schema";

function getMetadata(data: any) {
  return formatMetadata({
    title: data?.meta_title || data?.page_name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: data?.canonical_link || pageUrl(BlogTypes.TICKET, true),
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

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const contentPage = (await PageApi.getContent("ve-vui-choi"))?.payload
    ?.data as any;

  return getMetadata(contentPage);
}

export default async function EntertainmentTickets() {
  const optionsFilter = (await ProductTicket.getOptionsFilter())?.payload
    ?.data as any;

  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("ve-vui-choi", language))
    ?.payload?.data as any;
  const metadata = getMetadata(contentPage);
  return (
    <SeoSchema
      metadata={metadata}
      breadscrumbItems={[
        {
          url: metadata.alternates?.canonical as string,
          name: metadata.title as string,
        },
      ]}
    >
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
                    Vé vui chơi
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
    </SeoSchema>
  );
}
