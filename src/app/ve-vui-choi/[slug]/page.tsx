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
import { ProductTicket } from "@/api/ProductTicket";
import { renderTextContent } from "@/utils/Helper";
import FAQ from "@/components/content-page/FAQ";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import "@/styles/ckeditor-content.scss";
import { format, parse, parseISO } from "date-fns";
import { isEmpty } from "lodash";
import SmoothScrollLink from "@/components/base/SmoothScrollLink";
import "@/styles/ckeditor-content.scss";
import DisplayContentEditor from "@/components/base/DisplayContentEditor";
import ImageGallery from "../components/ImageGallery";
import TicketOptionContent from "../components/TicketOptionContent";
import Schedule from "../components/Schedule";
import { Metadata } from "next";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { getServerT } from "@/lib/i18n/getServerT";
import TicketDetailInfor from "../components/TicketDetailInfor";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = params;

  const res = (await ProductTicket.detailBySlug(params.slug)) as any;
  const data = res?.payload?.data;

  return formatMetadata({
    title: data?.meta_title ?? data?.name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: pageUrl(data?.alias ?? slug, BlogTypes.TICKET, true),
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

export default async function EntertainmentTicketDetail({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const res = (await ProductTicket.detail(params.slug)) as any;
  const detail = res?.payload?.data;

  if (!detail) notFound();
  const t = await getServerT();
  return (
    <Fragment>
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
                  <Link href={`/ve-vui-choi`} className="text-blue-700">
                    {t("ve_vui_choi")}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <p className="text-gray-700" data-translate="true">
                    {renderTextContent(detail?.name)}
                  </p>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <TicketDetailInfor product={detail} />
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
    </Fragment>
  );
}
