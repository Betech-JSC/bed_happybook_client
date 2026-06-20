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
import Search from "./components/Search";
import { Metadata } from "next";
import { formatMetadata } from "@/lib/formatters";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { PageApi } from "@/api/Page";
import SeoSchema from "@/components/schema";
import { getServerLang } from "@/lib/session";
import { getServerT } from "@/lib/i18n/getServerT";
import { ProductBusinessLoungeApi } from "@/api/ProductBusinessLounge";

function getMetadata(data: any) {
  return formatMetadata({
    title: data?.meta_title || data?.page_name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: data?.canonical_link || pageUrl(BlogTypes.BUSINESS_LOUNGE, true),
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
  const contentPage = (await PageApi.getContent("business-lounge"))?.payload
    ?.data as any;

  return getMetadata(contentPage);
}

const PAGE_SIZE = 12;

function toArr(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export default async function ProductBusinessLounge({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const language = await getServerLang();

  // Pre-fill từ homepage widget (e.g. ?airport[]=Sân bay Tân Sơn Nhất)
  const preAirport = toArr(searchParams["airport[]"] ?? searchParams["airport"]);
  const preCity = toArr(searchParams["city[]"] ?? searchParams["city"]);
  const preCountry = toArr(searchParams["country[]"] ?? searchParams["country"]);

  const hasPreFilter = preAirport.length > 0 || preCity.length > 0 || preCountry.length > 0;

  const filterQuery = () => {
    const p = new URLSearchParams({ page: "1", per_page: String(PAGE_SIZE) });
    preAirport.forEach((a) => p.append("airport[]", a));
    preCity.forEach((c) => p.append("city[]", c));
    preCountry.forEach((c) => p.append("country[]", c));
    return "?" + p.toString();
  };

  // Tải song song: bộ lọc + trang 1 danh sách (SSR) + nội dung trang
  const [optionsRes, initialRes, contentRes] = await Promise.all([
    ProductBusinessLoungeApi.getOptionsFilter(hasPreFilter ? filterQuery() : ""),
    ProductBusinessLoungeApi.search(filterQuery()),
    PageApi.getContent("business-lounge", language),
  ]);

  const optionsFilter = optionsRes?.payload?.data as any;
  const initialData = (initialRes?.payload?.data as any) ?? {};
  const contentPage = contentRes?.payload?.data as any;
  const metadata = getMetadata(contentPage);
  const t = await getServerT();

  // JSON-LD ItemList cho danh sách (SEO) — trang đầu render sẵn server-side
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: (metadata.title as string) || "Phòng chờ thương gia",
    numberOfItems: initialData?.total ?? 0,
    itemListElement: (initialData?.items ?? []).map((it: any, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${pageUrl(BlogTypes.BUSINESS_LOUNGE, true)}/${it.slug}`,
      name: it.name,
    })),
  };
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
                  <Link href="/" className="text-blue-700">
                    {t("trang_chu")}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <p className="text-gray-700">{t("phong_cho_thuong_gia")}</p>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
          />
          <Suspense>
            <Search
              optionsFilter={optionsFilter}
              initialItems={initialData?.items ?? []}
              initialLastPage={initialData?.last_page ?? 1}
              initialTotal={initialData?.total ?? 0}
              pageSize={PAGE_SIZE}
              initialSel={{ country: preCountry, city: preCity, airport: preAirport }}
            />
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
