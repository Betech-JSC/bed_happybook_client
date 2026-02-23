import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import VisaTabs from "./components/VisaTabs";
import VisaSteps from "@/components/home/visa-steps";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { VisaApi } from "@/api/Visa";
import SearchForm from "./components/SeachForm";
import NewsByPage from "@/components/content-page/NewsByPage";
import { newsApi } from "@/api/news";
import FooterMenu from "@/components/content-page/footer-menu";
import { PageApi } from "@/api/Page";
import { getServerLang } from "@/lib/session";
import { getServerT } from "@/lib/i18n/getServerT";
import { Suspense } from "react";
import SkeletonProductTabs from "@/components/skeletons/SkeletonProductTabs";

function getMetadata(data: any) {
  return formatMetadata({
    title: data?.meta_title || data?.page_name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: data?.canonical_link || pageUrl(BlogTypes.VISA, true),
    },
    openGraph: {
      images: [
        {
          url: data?.meta_image
            ? data.meta_image
            : `${data?.image_url}/${data?.image_location}`,
          alt: data?.meta_title,
        },
      ],
    },
  });
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const contentPage = (await PageApi.getContent("visa"))?.payload?.data as any;

  return getMetadata(contentPage);
}

export default async function Visa() {
  const res = (await VisaApi.getAll()) as any;
  const data = res?.payload?.data;
  const optionsFilter = (await VisaApi.getOptionsFilter())?.payload
    ?.data as any;
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("visa", language))?.payload
    ?.data as any;
  const metadata = getMetadata(contentPage);
  const t = await getServerT();
  return (
    <SeoSchema
      metadata={metadata}
      breadscrumbItems={[
        {
          url: metadata.alternates?.canonical as string,
          name: metadata.title as string,
        },
      ]}
    >
      <main>
        <div className="relative h-[400px] lg:h-[500px]">
          <div className="absolute inset-0">
            <Image
              priority
              src="/visa-service/bg-header.png"
              width={1900}
              height={600}
              className="object-cover w-full h-full"
              alt="Dịch vụ Visa Happy Book"
            />
          </div>
          <div
            className="absolute w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
            }}
          ></div>
          {/* Search */}
          <div className="base__content h-full relative place-content-center">
            <div className="bg-white rounded-2xl p-3 md:p-6 w-full lg:w-3/5">
              <h1 className="text-18 font-semibold">
                {t("tim_visa_theo_dia_danh_diem_den")}
              </h1>
              <SearchForm optionsFilter={optionsFilter} />
            </div>
          </div>
        </div>
        <div className="bg-white relative z-2 rounded-2xl top-[-12px] mt-10">
          <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
            {data?.visaOutstanding?.length > 0 && (
              <div className="">
                <VisaTabs
                  title="dich_vu_visa_noi_bat"
                  defaultCategoryAlias="tim-kiem?text=tat-ca-visa-noi-bat"
                  data={data.visaOutstanding}
                />
              </div>
            )}
            <Suspense fallback={<SkeletonProductTabs />}>
              <NewsByPage
                title={"Cẩm nang visa"}
                page={"visa"}
                wrapperStyle="mt-6"
              />
            </Suspense>
            {data?.visaByCategory?.length > 0 &&
              data.visaByCategory.map((parentCategory: any, index: number) => (
                <div className="mt-6" key={index}>
                  {/* <div className="flex justify-between">
                    <div>
                      <h2
                        className="text-[24px] lg:text-[32px] font-bold"
                        data-translate
                      >
                        {parentCategory.name}
                      </h2>
                    </div>
                    <Link
                      href={`/visa/${parentCategory.alias}`}
                      className="hidden lg:flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200"
                      style={{ transition: "0.3s" }}
                    >
                      <button
                        className="text-[#175CD3] font-medium"
                        data-translate
                      >
                        {t("xem_tat_ca")}
                      </button>
                       <Image
                         className=" hover:scale-110 ease-in duration-300"
                         src="/icon/chevron-right.svg"
                         alt="Xem tất cả"
                         width={20}
                         height={20}
                       />
                    </Link>
                  </div>
                  <Link
                    href={`/visa/${parentCategory.alias}`}
                    className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
                  >
                    <button
                      className="text-[#175CD3] font-medium"
                      data-translate
                    >
                      {t("xem_tat_ca")}
                    </button>
                    <Image
                      className=" hover:scale-110 ease-in duration-300"
                      src="/icon/chevron-right.svg"
                      alt="Xem tất cả"
                      width={20}
                      height={20}
                    />
                  </Link> */}
                  <VisaTabs
                    title={parentCategory?.name}
                    defaultCategoryAlias={parentCategory.alias}
                    showDescription={false}
                    data={parentCategory.children}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="mt-8">
          <VisaSteps />
        </div>
        <FooterMenu page="visa" />
      </main>
    </SeoSchema>
  );
}
