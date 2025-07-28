import FAQ from "@/components/content-page/FAQ";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import { renderTextContent } from "@/utils/Helper";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { getServerT } from "@/lib/i18n/getServerT";
import FastTrackDetailInfor from "./FastTrackDetailInfor";
import { ProductFastTrackApi } from "@/api/ProductFastTrack";

export default async function FastTrackDetail({
  alias,
  searchParams,
}: {
  alias: string;
  searchParams: { [key: string]: string | undefined };
}) {
  const t = await getServerT();
  const res = (await ProductFastTrackApi.detail(alias)) as any;
  const detail = res?.payload?.data;

  if (!detail) notFound();

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
                  <Link
                    href={`/du-thuyen/${detail?.category?.alias}`}
                    className="text-blue-700"
                    data-translate="true"
                  >
                    {detail?.category?.name}
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
          <FastTrackDetailInfor product={detail} />
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
