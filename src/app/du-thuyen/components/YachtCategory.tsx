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
import { ProductYachtApi } from "@/api/ProductYacht";
import Search from "./Search";
import { getServerLang } from "@/lib/session";
import { getServerT } from "@/lib/i18n/getServerT";
import { translateText } from "@/utils/translateApi";

export default async function YachtCategory({ detail }: any) {
  const language = await getServerLang();
  const t = await getServerT();
  const optionsFilter = (await ProductYachtApi.getOptionsFilter(language))?.payload
    ?.data as any;
  const filteredOptions = optionsFilter.filter(
    (item: any) => item.name !== "category"
  );
  const rawDisplayTitle = detail?.display_title ?? detail?.name ?? "";
  const displayTitle =
    language === "vi" || !rawDisplayTitle
      ? rawDisplayTitle
      : (await translateText([rawDisplayTitle], language))[0] || rawDisplayTitle;

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
                  <p className="text-gray-700">
                    {displayTitle}
                  </p>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Suspense>
            <Search
              optionsFilter={filteredOptions}
              categoryDefault={detail?.id}
              title={rawDisplayTitle}
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
