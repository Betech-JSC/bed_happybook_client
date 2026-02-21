import { Fragment, Suspense } from "react";
import Banner from "@/components/home/banner";
import AosAnimate from "@/components/layout/aos-animate";
import Search from "@/components/home/search";
import type { Metadata } from "next";
import Image from "next/image";
import SearchMobile from "@/components/home/search-mobile";
import { FlightApi } from "@/api/Flight";
import { siteUrl } from "@/constants";
import { WebsiteSchema } from "@/components/schema/WebsiteSchema";
import { formatMetadata } from "@/lib/formatters";
import { settingApi } from "@/api/Setting";
import SkeletonProductTabs from "@/components/skeletons/SkeletonProductTabs";
import { getServerT } from "@/lib/i18n/getServerT";
import dynamic from "next/dynamic";

const TourNoiDia = dynamic(() => import("@/components/home/tour-noi-dia"));
const TourHot = dynamic(() => import("@/components/home/tour-hot"));
const TourQuocTe = dynamic(() => import("@/components/home/tour-quoc-te"));
const VisaService = dynamic(() => import("@/components/home/visa-service"));
const Hotel = dynamic(() => import("@/components/home/hotel"));
const CompoHot = dynamic(() => import("@/components/home/compo-hot"));
const VisaSteps = dynamic(() => import("@/components/home/visa-steps"));
const TouristSuggest = dynamic(() => import("@/components/home/tourist-suggest"));
const Flight = dynamic(() => import("@/components/home/flight"));
const HomeYacht = dynamic(() => import("@/components/home/Yacht"));
const HomeAmusementTicket = dynamic(() => import("@/components/home/AmusementTicket"));
const HomeFastTrack = dynamic(() => import("@/components/home/FastTrack"));
const FormContact = dynamic(() => import("./lien-he/form"));
const PartnerAirlines = dynamic(() => import("./ve-may-bay/components/Partner"));
const NewsByPage = dynamic(() => import("@/components/content-page/NewsByPage"));
const FooterMenu = dynamic(() => import("@/components/content-page/footer-menu"));

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const seo = await settingApi.getCachedMetaSeo();

  return formatMetadata({
    robots: "index, follow",
    title: seo?.seo_title,
    description: seo?.seo_description,
    keywords: seo?.seo_keywords,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      images: [
        {
          url: seo?.image,
          alt: seo?.seo_title,
        },
      ],
    },
  });
}

export default async function Home() {
  const [airportsData, seo, t] = await Promise.all([
    FlightApi.getCachedAirports(),
    settingApi.getCachedMetaSeo(),
    getServerT(),
  ]);
  return (
    <Fragment>
      <WebsiteSchema />
      <h1 className="sr-only">{seo?.seo_title || "Happy Book - Dịch vụ du lịch hàng đầu"}</h1>
      <Suspense fallback={null}>
        <Search airportsData={airportsData} />
      </Suspense>
      {/* Search Mobile */}
      <div className="mt-[68px] block lg:hidden relative h-max pb-10">
        <div className="mt-4 h-full">
          <div className="absolute inset-0 h-full">
            <Image
              priority
              src="/bg-image.png"
              width={500}
              height={584}
              className="object-cover w-full h-full"
              alt="Hỗ trợ tìm kiếm du lịch Happy Book"
            />
          </div>
          <div
            className="absolute w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
            }}
          ></div>
          <div className="relative">
            <Suspense fallback={null}>
              <SearchMobile airportsData={airportsData} />
            </Suspense>
          </div>
        </div>
      </div>
      <main className="w-full bg-white relative z-2 rounded-2xl top-[-12px]">
        <Suspense fallback={<SkeletonProductTabs />}>
          <div className="pt-7 px-3 lg:px-[50px] xl:px-[80px] max__screen">
            <Banner></Banner>
          </div>
        </Suspense>

        <Suspense fallback={<SkeletonProductTabs />}>
          <AosAnimate>
            <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
              <CompoHot></CompoHot>
            </div>
          </AosAnimate>
        </Suspense>

        <Suspense fallback={<SkeletonProductTabs />}>
          <AosAnimate>
            <TourHot />
          </AosAnimate>
        </Suspense>

        <Suspense fallback={<SkeletonProductTabs />}>
          <AosAnimate>
            <TourNoiDia></TourNoiDia>
          </AosAnimate>
        </Suspense>

        <Suspense fallback={<SkeletonProductTabs />}>
          <AosAnimate>
            <TourQuocTe></TourQuocTe>
          </AosAnimate>
        </Suspense>

        <Suspense fallback={<SkeletonProductTabs />}>
          <AosAnimate>
            <Flight />
          </AosAnimate>
        </Suspense>

        <Suspense fallback={<SkeletonProductTabs />}>
          <AosAnimate>
            <HomeFastTrack />
          </AosAnimate>
        </Suspense>

        <Suspense fallback={<SkeletonProductTabs />}>
          <AosAnimate>
            <VisaService />
          </AosAnimate>
        </Suspense>

        <Suspense fallback={<SkeletonProductTabs />}>
          <AosAnimate>
            <Hotel />
          </AosAnimate>
        </Suspense>

        <Suspense fallback={<SkeletonProductTabs />}>
          <AosAnimate>
            <HomeYacht />
          </AosAnimate>
        </Suspense>

        <Suspense fallback={<SkeletonProductTabs />}>
          <AosAnimate>
            <HomeAmusementTicket />
          </AosAnimate>
        </Suspense>

        <Suspense fallback={<SkeletonProductTabs />}>
          <AosAnimate>
            <div className="mt-4 lg:mt-6">
              <VisaSteps />
            </div>
          </AosAnimate>
        </Suspense>

        <Suspense fallback={<SkeletonProductTabs />}>
          <AosAnimate>
            <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
              <TouristSuggest></TouristSuggest>
            </div>
          </AosAnimate>
        </Suspense>

        <Suspense fallback={<SkeletonProductTabs />}>
          <AosAnimate>
            <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
              <NewsByPage
                title={"Cẩm nang du lịch"}
                wrapperStyle={"pt-8 pb-12 lg:mt-4"}
              />
            </div>
          </AosAnimate>
        </Suspense>

        <Suspense fallback={<SkeletonProductTabs />}>
          <PartnerAirlines />
        </Suspense>
        <Suspense fallback={<SkeletonProductTabs />}>
          <div className="mx-auto p-8 lg:w-[920px] h-auto">
            <h2 className="text-18 font-semibold text-center">
              {t(
                "ban_co_the_gui_thong_tin_yeu_cau_cua_minh_qua_mau_lien_he_duoi_day_va_chung_toi_se_phan_hoi_trong_thoi_gian_som_nhat"
              )}
            </h2>
            <FormContact />
          </div>
        </Suspense>
        <Suspense fallback={<SkeletonProductTabs />}>
          <AosAnimate animation="fade-up">
            <FooterMenu page={"home"}></FooterMenu>
          </AosAnimate>
        </Suspense>
      </main>
    </Fragment>
  );
}
