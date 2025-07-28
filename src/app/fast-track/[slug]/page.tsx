import { formatMetadata } from "@/lib/formatters";
import "@/styles/ckeditor-content.scss";
import "@/styles/ckeditor-content.scss";
import { ProductYachtApi } from "@/api/ProductYacht";
import { Metadata } from "next";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { ProductCategoryApi } from "@/api/ProductCategory";
import FastTrackDetail from "../components/FastTrackDetail";
import FastTrackCategory from "../components/FastTrackCategory";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = params;
  let data = null;

  data = (await ProductCategoryApi.detail("fast-track", slug))?.payload
    ?.data as any;

  if (!data) {
    const resDetail = await ProductYachtApi.detailBySlug(slug);
    data = resDetail?.payload.data;
    if (data) data.alias = data?.slug;
  }

  return formatMetadata({
    title: data?.meta_title ?? data?.name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: pageUrl(data?.alias ?? slug, BlogTypes.FAST_TRACK, true),
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

export default async function FastTrackAliasPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const { slug } = params;
  const detailCate = (await ProductCategoryApi.detail("fast-track", slug))
    ?.payload?.data as any;
  return !detailCate ? (
    <FastTrackDetail alias={slug} searchParams={searchParams} />
  ) : (
    <FastTrackCategory detail={detailCate} />
  );
}
