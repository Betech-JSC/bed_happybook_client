import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment, Suspense } from "react";
import FAQ from "@/components/content-page/FAQ";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";
import Search from "./Search";
import { ProductFastTrackApi } from "@/api/ProductFastTrack";

export default async function FastTrackCategory({ detail }: any) {
  const optionsFilter = (await ProductFastTrackApi.getOptionsFilter())?.payload
    ?.data as any;
  const filteredOptions = optionsFilter.filter(
    (item: any) => item.name !== "category"
  );

  return (
    <Fragment>
      <div className="bg-gray-100">
        <div className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
          <Breadcrumb className="pt-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="text-blue-700"
                    data-translate="true"
                  >
                    Trang chủ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <p className="text-gray-700" data-translate="true">
                    {detail?.name}
                  </p>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Suspense>
            <Search
              optionsFilter={filteredOptions}
              categoryDefault={detail?.id}
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
    </Fragment>
  );
}
