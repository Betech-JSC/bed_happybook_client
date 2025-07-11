import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import { notFound, redirect } from "next/navigation";
import { formatCurrency, formatMetadata } from "@/lib/formatters";
import { renderTextContent } from "@/utils/Helper";
import FAQ from "@/components/content-page/FAQ";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import "@/styles/ckeditor-content.scss";
import { format, parse, parseISO } from "date-fns";
import { isEmpty } from "lodash";
import SmoothScrollLink from "@/components/base/SmoothScrollLink";
import "@/styles/ckeditor-content.scss";
import { ProductYachtApi } from "@/api/ProductYacht";
import DisplayContentEditor from "@/components/base/DisplayContentEditor";
import ImageGallery from "../components/ImageGallery";
import TicketOptionContent from "../components/TicketOptionContent";
import Schedule from "../components/Schedule";
import DisplayPrice from "@/components/base/DisplayPrice";
import { Metadata } from "next";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import YachtDetail from "../components/YachtDetail";
import YachtCategory from "../components/YachtCategory";
import { ProductCategoryApi } from "@/api/ProductCategory";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = params;
  let data = null;

  data = (await ProductCategoryApi.detail("yacht", slug))?.payload?.data as any;

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
      canonical: pageUrl(data?.alias ?? slug, BlogTypes.YACHT, true),
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

export default async function YachtAliasPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const { slug } = params;
  const detailCate = (await ProductCategoryApi.detail("yacht", slug))?.payload
    ?.data as any;
  return !detailCate ? (
    <YachtDetail alias={slug} searchParams={searchParams} />
  ) : (
    <YachtCategory detail={detailCate} />
  );
}
