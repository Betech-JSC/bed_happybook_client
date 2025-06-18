import type { Metadata } from "next";
import { TourApi } from "@/api/Tour";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { formatMetadata } from "@/lib/formatters";
import { PageApi } from "@/api/Page";
import { extractSlugAndId } from "@/utils/Helper";
import TourDetail from "../components/TourDetail";
import CategoryTour from "../components/CategoryTour";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug, isDetail } = extractSlugAndId(params.alias);
  let data = null;

  if (isDetail) {
    const res = (await TourApi.detail(slug)) as any;
    data = res?.payload.data;
  } else {
    const res = (await PageApi.getContent(slug)) as any;
    data = res?.payload.data;
  }
  return formatMetadata({
    title: isDetail
      ? data?.meta_title ?? data?.name
      : data?.meta_title ?? data?.title,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: pageUrl(data?.alias ?? slug, BlogTypes.TOURS, true),
    },
  });
}

export default async function TourAliasPage({
  params,
}: {
  params: { alias: string };
}) {
  const { slug, isDetail } = extractSlugAndId(params.alias);
  return isDetail ? <TourDetail alias={slug} /> : <CategoryTour alias={slug} />;
}
