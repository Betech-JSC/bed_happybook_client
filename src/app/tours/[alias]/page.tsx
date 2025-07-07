import type { Metadata } from "next";
import { TourApi } from "@/api/Tour";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { formatMetadata } from "@/lib/formatters";
import { PageApi } from "@/api/Page";
import { extractSlugAndId } from "@/utils/Helper";
import TourDetail from "../components/TourDetail";
import CategoryTour from "../components/CategoryTour";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { alias } = params;
  const isDetail = !["tour-noi-dia", "tour-quoc-te"].includes(alias);
  let data = null;

  if (isDetail) {
    const res = (await TourApi.detail(alias)) as any;
    data = res?.payload.data;
    data.alias = data.slug;
  } else {
    const res = (await PageApi.getContent(alias)) as any;
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
      canonical: pageUrl(data?.alias ?? alias, BlogTypes.TOURS, true),
    },
    openGraph: {
      images: [
        {
          url: data?.meta_image
            ? data.meta_image
            : data?.image_url && data?.image_location
            ? `${data?.image_url}${data?.image_location}`
            : null,
          alt: data?.meta_title,
        },
      ],
    },
  });
}

export default async function TourAliasPage({
  params,
}: {
  params: { alias: string };
}) {
  const { alias } = params;
  const isDetail = !["tour-noi-dia", "tour-quoc-te"].includes(alias);
  return isDetail ? (
    <TourDetail alias={alias} />
  ) : (
    <CategoryTour alias={alias} />
  );
}
