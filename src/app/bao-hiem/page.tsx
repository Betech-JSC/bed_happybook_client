import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { formatMetadata } from "@/lib/formatters";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";
import SearchFormInsurance from "./components/SearchForm";
import SearchResults from "./components/SearchResults";
import { SearchProps } from "@/types/insurance";
import { getServerLang } from "@/lib/session";
import { PageApi } from "@/api/Page";
import ContentByPage from "@/components/content-page/ContentByPage";
import { settingApi } from "@/api/Setting";

function getMetadata(data: any) {
  return formatMetadata({
    title: data?.meta_title || data?.page_name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: data?.canonical_link || pageUrl("bao-hiem", true),
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
  const contentPage = (await PageApi.getContent("bao-hiem"))?.payload
    ?.data as any;

  return getMetadata(contentPage);
}

export default async function Insurance({ searchParams }: SearchProps) {
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("bao-hiem", language))?.payload
    ?.data as any;

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
      <div className="relative h-max pb-14">
        <div className="absolute inset-0">
          <Image
            priority
            src="/bg-image-2.png"
            width={500}
            height={584}
            className="object-cover w-full h-full"
            alt="Background"
          />
        </div>
        <div
          className="absolute w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
          }}
        ></div>
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-[100px] lg:pt-[132px] max__screen">
          <div className="mt-0 lg:mt-24 lg:mb-4 p-6 mx-auto  bg-white rounded-lg shadow-lg relative">
            <Suspense>
              <SearchFormInsurance />
            </Suspense>
          </div>
        </div>
      </div>
      <main className="w-full bg-gray-100 relative z-2 rounded-2xl py-5 lg:py-12">
        <SearchResults />
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
          {/* Blog */}
          {contentPage?.content && (
            <div className=" rounded-2xl bg-gray-50 p-8">
              <ContentByPage data={contentPage} />
            </div>
          )}
        </div>
      </main>
    </SeoSchema>
  );
}
