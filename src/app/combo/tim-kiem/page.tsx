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
import { ComboApi } from "@/api/Combo";
import { translateText } from "@/utils/translateApi";
import { comboStaticText } from "@/constants/staticText";
import { getServerLang } from "@/lib/session";
import { formatTranslationMap } from "@/utils/translateDom";
import SearchResult from "../components/SearchResult";

export const metadata: Metadata = {
  title: "Compo Nha Trang",
  description: "Happy Book",
};

export default async function SearchCombo() {
  const optionsFilter = (await ComboApi.getOptionsFilter())?.payload
    ?.data as any;
  const language = await getServerLang();
  const translatedStaticText = await translateText(comboStaticText, language);
  const translationMap = formatTranslationMap(
    comboStaticText,
    translatedStaticText
  );
  return (
    <Fragment>
      <div className="bg-gray-100">
        <div className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
          <Breadcrumb className="pt-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="text-blue-700" data-translate>
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
                  <Link href="#" className="text-gray-700" data-translate>
                    Tìm kiếm
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* Section Tour */}
          <Suspense>
            <SearchResult
              optionsFilter={optionsFilter}
              translatedStaticText={translationMap}
            />
          </Suspense>
        </div>
      </div>
    </Fragment>
  );
}
