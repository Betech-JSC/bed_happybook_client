import { VisaApi } from "@/api/Visa";
import { notFound } from "next/navigation";
import VisaDetail from "../components/VisaDetail";
import VisaCategory from "../components/VisaCategory";
import { extractSlugAndId } from "@/utils/Helper";
import type { Metadata } from "next";
import { formatMetadata } from "@/lib/formatters";
import { BlogTypes, pageUrl } from "@/utils/Urls";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { alias } = params;
  let data = null;
  const resCategory = (await VisaApi.getCategory(alias)) as any;
  data = resCategory?.payload.data;
  if (!data) {
    const resDetail = await VisaApi.detail(alias);
    data = resDetail?.payload.data;
    data.alias = data.slug;
  }
  return formatMetadata({
    title: data?.meta_title ?? data?.name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: pageUrl(data?.alias ?? alias, BlogTypes.VISA, true),
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

export default async function VisaAliasPage({
  params,
}: {
  params: { alias: string };
}) {
  const { alias } = params;
  const resCategory = (await VisaApi.getCategory(alias)) as any;
  const detailCate = resCategory?.payload.data;
  return !detailCate ? (
    <VisaDetail alias={alias} />
  ) : (
    <VisaCategory alias={alias} />
  );
}
