import { formatMetadata } from "@/lib/formatters";
import "@/styles/ckeditor-content.scss";
import "@/styles/ckeditor-content.scss";
import { ProductBusinessLoungeApi } from "@/api/ProductBusinessLounge";
import { Metadata } from "next";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { ProductCategoryApi } from "@/api/ProductCategory";
import BusinessLoungeDetail from "../components/BusinessLoungeDetail";
import BusinessLoungeCategory from "../components/BusinessLoungeCategory";
import { getServerLang } from "@/lib/session";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = params;
  const language = await getServerLang();
  let data = (await ProductBusinessLoungeApi.detailBySlug(slug, language))
    ?.payload?.data as any;

  if (data) {
    data.alias = data?.slug;
  } else {
    data = (await ProductCategoryApi.detail("business-lounge", slug, language))
      ?.payload?.data as any;
  }

  return formatMetadata({
    title: data?.meta_title ?? data?.name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: pageUrl(data?.alias ?? slug, BlogTypes.BUSINESS_LOUNGE, true),
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

export default async function BusinessLoungeAliasPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const { slug } = params;
  const language = await getServerLang();
  const detail = (await ProductBusinessLoungeApi.detailBySlug(slug, language))
    ?.payload?.data as any;

  if (detail) {
    return <BusinessLoungeDetail alias={slug} searchParams={searchParams} />;
  }

  const detailCate = (await ProductCategoryApi.detail("business-lounge", slug, language))
    ?.payload?.data as any;

  return detailCate ? (
    <BusinessLoungeCategory detail={detailCate} />
  ) : (
    <BusinessLoungeDetail alias={slug} searchParams={searchParams} />
  );
}
