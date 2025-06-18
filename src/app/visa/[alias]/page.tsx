import { VisaApi } from "@/api/Visa";
import { notFound } from "next/navigation";
import VisaDetail from "../components/VisaDetail";
import VisaCategory from "../components/VisaCategory";
import { extractSlugAndId } from "@/utils/Helper";
import type { Metadata } from "next";
import { formatMetadata } from "@/lib/formatters";
import { BlogTypes, pageUrl } from "@/utils/Urls";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug, isDetail } = extractSlugAndId(params.alias);
  let data = null;

  if (isDetail) {
    const res = await VisaApi.detail(slug);
    data = res?.payload.data;
  } else {
    const res = (await VisaApi.getCategory(slug)) as any;
    data = res?.payload.data;
  }
  return formatMetadata({
    title: data?.meta_title ?? data?.name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: pageUrl(data?.alias ?? slug, BlogTypes.VISA, true),
    },
  });
}

export default async function VisaAliasPage({
  params,
}: {
  params: { alias: string };
}) {
  const { slug, isDetail } = extractSlugAndId(params.alias);
  return isDetail ? <VisaDetail alias={slug} /> : <VisaCategory alias={slug} />;
}
