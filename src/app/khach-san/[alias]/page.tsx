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
import { notFound } from "next/navigation";
import { HotelApi } from "@/api/Hotel";
import {
  BlogTypes,
  blogUrl,
  pageUrl,
  ProductTypes,
  productUrl,
} from "@/utils/Urls";
import { formatMetadata } from "@/lib/formatters";
import FAQ from "@/components/content-page/FAQ";
import { PageApi } from "@/api/Page";
import ContentByPage from "@/components/content-page/ContentByPage";
import { renderTextContent } from "@/utils/Helper";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import { getServerLang } from "@/lib/session";
import HotelDetailTabs from "../components/HotalDetaiTabs";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const res = (await HotelApi.detail(params?.alias)) as any;
  const data = res?.payload.data;
  return formatMetadata({
    title: data?.meta_title ?? data?.name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: productUrl(data?.slug, ProductTypes.HOTEL, true),
    },
    openGraph: {
      images: [
        {
          url: data?.meta_image
            ? data.meta_image
            : `${data?.image_url}${data?.image_location}`,
          alt: data?.meta_title,
        },
      ],
    },
  });
}

export default async function HotelDetail({
  params,
}: {
  params: { alias: string };
}) {
  const res = (await HotelApi.detail(params.alias)) as any;
  const detail = res?.payload?.data;
  if (!detail) {
    notFound();
  }
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("khach-san", language))?.payload
    ?.data as any;

  return (
    <SeoSchema
      product={detail}
      type={ProductTypes.HOTEL}
      breadscrumbItems={[
        {
          url: pageUrl(ProductTypes.HOTEL, true),
          name: "Khách sạn",
        },
        {
          url: productUrl(ProductTypes.HOTEL, detail?.slug, true),
          name: detail?.title as string,
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
                  <Link
                    href="/khach-san"
                    className="text-blue-700"
                    data-translate="true"
                  >
                    Khách sạn
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
                    {renderTextContent(detail.name)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className=" mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 rounded-lg">
              <div className="overflow-hidden rounded-lg">
                <Image
                  className="cursor-pointer w-full h-[280px] md:h-[450px] rounded-lg hover:scale-110 ease-in duration-300 object-cover"
                  src={`${detail.image_url}/${detail.image_location}`}
                  alt="Image"
                  width={700}
                  height={450}
                  sizes="100vw"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {detail?.gallery?.length > 0 &&
                  detail.gallery.map(
                    (item: any, index: number) =>
                      index <= 4 && (
                        <div
                          className="overflow-hidden rounded-lg h-32 md:h-[220px]"
                          key={index}
                        >
                          <Image
                            className="cursor-pointer w-full h-32 md:h-[220px] rounded-lg hover:scale-110 ease-in duration-300 object-cover"
                            src={`${item.image_url}${item.image}`}
                            alt="Image"
                            width={320}
                            height={220}
                            sizes="100vw"
                            // style={{ height: "100%", width: "100%" }}
                          />
                        </div>
                      )
                  )}
              </div>
            </div>
            <div className="mt-4">
              <HotelDetailTabs data={detail} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-white">
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
        </div>
      </div>
    </SeoSchema>
  );
}
