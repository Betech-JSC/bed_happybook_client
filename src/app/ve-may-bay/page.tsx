import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Search from "./components/Search";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";
import { getServerT } from "@/lib/i18n/getServerT";
import dynamic from "next/dynamic";
import {
  getCachedAirports,
  getCachedPageContent,
  getCachedFooterMenu,
} from "./utils/cached-api";
import { getServerLang } from "@/lib/session";
import styles from "@/styles/styles.module.scss";

// Dynamic imports for heavy sections
const FlightCarouselSection = dynamic(
  () => import("./components/FlightCarouselSection"),
  {
    loading: () => (
      <div className="mt-6 py-6 h-96 bg-gray-100 animate-pulse rounded-2xl" />
    ),
  }
);

const ContentSection = dynamic(() => import("./components/ContentSection"), {
  loading: () => <div className="mt-8 h-64 bg-gray-100 animate-pulse rounded-2xl" />,
});

const FAQ = dynamic(() => import("@/components/content-page/FAQ"), {
  loading: () => <div className="my-8 h-40 bg-gray-100 animate-pulse rounded-2xl" />,
});

function getMetadata(data: any) {
  return formatMetadata({
    title: data?.meta_title || data?.page_name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical: data?.canonical_link || pageUrl("ve-may-bay", true),
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
  const contentPage = await getCachedPageContent();
  return getMetadata(contentPage);
}

export default async function AirlineTicket() {
  // Critical for LCP: Fetch airports immediately (blocking but necessary for Search)
  const airportsData = await getCachedAirports();
  const language = await getServerLang();

  // Parallel fetch for Metadata and SEO (blocking)
  const contentPage = await getCachedPageContent(language);
  const metadata = getMetadata(contentPage);
  const t = await getServerT();

  // Footer data needed for links below
  const footerData = await getCachedFooterMenu("flight");

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
      <div className="relative h-max pb-14">
        <div className="absolute inset-0">
          <Image
            priority
            src="/bg-image-2.png"
            width={500}
            height={584}
            className="object-cover w-full h-full"
            alt="VMB Happy Book"
          />
        </div>
        <div
          className="absolute w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
          }}
        ></div>
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-[100px] lg:pt-[132px] max__screen">
          <div className="mt-0 lg:mt-24 lg:mb-4 p-6 mx-auto  bg-white rounded-lg shadow-lg relative">
            <Suspense>
              <Search airportsData={airportsData} />
            </Suspense>
          </div>
        </div>
      </div>
      <main className="w-full bg-white relative z-2 rounded-2xl top-[-12px]">
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
          <div className="py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-3 h-20">
              <Image
                src="/tour/globe-gradient.svg"
                alt="Lựa chọn không giới hạn"
                className="h-11 w-11"
                width={44}
                height={44}
              ></Image>
              <div>
                <p className="text-18 text-gray-700 font-semibold mb-1">
                  {t("lua_chon_khong_gioi_han")}
                </p>
                <p> {t("vo_van_hanh_trinh_trieu_cam_hung")}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 h-20">
              <Image
                src="/tour/Travel-gradient-icon.svg"
                alt="Dịch vụ cá nhân hóa"
                className="h-11 w-11"
                width={44}
                height={44}
              ></Image>
              <div>
                <p className="text-18 text-gray-700 font-semibold mb-1">
                  {t("dich_vu_ca_nhan_hoa")}
                </p>
                <p>{t("cham_soc_dac_biet_trai_nghiem_doc_dao")}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 h-20">
              <Image
                src="/tour/sun-icon.svg"
                alt="Giá trị vượt trội"
                className="h-11 w-11"
                width={44}
                height={44}
              ></Image>
              <div>
                <p className="text-18 text-gray-700 font-semibold mb-1">
                  {t("gia_tri_vuot_troi")}
                </p>
                <p>{t("chat_luong_dinh_dam_bao_gia_tot_nhat")}</p>
              </div>
            </div>
          </div>

          {/* Flight Carousel - Streamed */}
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-2xl mt-6" />}>
            <FlightCarouselSection />
          </Suspense>

          {/* Blog - Streamed */}
          <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-2xl mt-8" />}>
            <ContentSection />
          </Suspense>

          {/* Faq - Streamed */}
          <div className="my-8">
            <FAQ />
          </div>
        </div>

        {/* Footer Links - Streamed */}
        <div className="hidden lg:block py-12 px-3 lg:px-[50px] xl:px-[80px] max__screen">
          {footerData?.flight?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
                {t("diem_den")}
              </h2>
              <div className="grid grid-cols-5 gap-4 mt-3">
                {footerData.flight?.map((item: any) => (
                  <Link key={item.id} href={`/ve-may-bay/${item.alias}`}>
                    <h3
                      className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                      data-translate="true"
                    >
                      {item.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </SeoSchema>
  );
}
