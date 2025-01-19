import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment, Suspense } from "react";
import SearchListTour from "../components/SearchListTour";
import { ComboApi } from "@/api/Combo";

export const metadata: Metadata = {
  title: "Compo Nha Trang",
  description: "Happy Book",
};

export default async function SearchCompo({
  params,
}: {
  params: { category: string };
}) {
  const optionsFilter = (await ComboApi.getOptionsFilter())?.payload
    ?.data as any;
  return (
    <Fragment>
      <div className="bg-gray-100">
        <div className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
          <Breadcrumb className="pt-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="text-blue-700">
                    Trang chủ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/combo" className="text-blue-700">
                    Combo
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className="text-gray-700">
                    Tìm kiếm
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* Section Tour */}
          <SearchListTour optionsFilter={optionsFilter} />
        </div>
      </div>
    </Fragment>
  );
}
