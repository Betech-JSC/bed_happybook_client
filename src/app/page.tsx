import { Fragment, Suspense } from "react";
import Banner from "@/components/home/banner";
import { getCachedBanner } from "@/app/utils/home-cached-api";
import BannerSlide from "@/components/home/BannerSlide";
import AosAnimate from "@/components/layout/aos-animate";
import Search from "@/components/home/search";
import type { Metadata } from "next";
import SearchMobile from "@/components/home/search-mobile";
import { FlightApi } from "@/api/Flight";
import { siteUrl } from "@/constants";
import { WebsiteSchema } from "@/components/schema/WebsiteSchema";
import { formatMetadata } from "@/lib/formatters";
import { settingApi } from "@/api/Setting";
import SkeletonProductTabs from "@/components/skeletons/SkeletonProductTabs";
import { getServerT } from "@/lib/i18n/getServerT";
import { VisaApi } from "@/api/Visa";
import { ProductLocation } from "@/api/ProductLocation";
import { getServerLang } from "@/lib/session";
import {
  HomeHeroDesktopBackground,
  HomeHeroMobileBackground,
} from "@/components/home/HomeHeroBackground";
import dynamic from "next/dynamic";
// import SentryTestButton from "@/components/dev/SentryTestButton";

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
const HomeSimFeatured = dynamic(() => import("@/components/home/SimFeatured"));
const HomeFastTrack = dynamic(() => import("@/components/home/FastTrack"));
const HomeBusinessLounge = dynamic(() => import("@/components/home/BusinessLounge"));
const FormContact = dynamic(() => import("./lien-he/form"));
const PartnerAirlines = dynamic(() => import("./ve-may-bay/components/Partner"));
const NewsByPage = dynamic(() => import("@/components/content-page/NewsByPage"));
const FooterMenu = dynamic(() => import("@/components/content-page/footer-menu"));

export async function generateMetadata({ params }: any): Promise<Metadata> {
  type SeoMeta = {
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string | string[];
    image?: string;
  };
  let seo: SeoMeta = {};
  try {
    seo = (await settingApi.getCachedMetaSeo()) as SeoMeta;
  } catch (e) {
    console.warn("[Home generateMetadata] getCachedMetaSeo failed:", e);
  }

  const ogImageUrl = seo?.image ?? siteUrl;

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
          url: ogImageUrl,
          alt: seo?.seo_title ?? "HappyBook Travel",
        },
      ],
    },
  });
}

export default async function Home() {
  const language = await getServerLang();
  const [airportsData, seo, t, visaOptions, locationsData, bannerDataRes] = await Promise.all([
    FlightApi.getCachedAirports().catch((e) => {
      console.warn("[Home] getCachedAirports failed:", e);
      return [];
    }),
    settingApi.getCachedMetaSeo().catch((e) => {
      console.warn("[Home] getCachedMetaSeo failed:", e);
      return {};
    }),
    getServerT(),
    VisaApi.getOptionsFilter(undefined, language).then(res => res?.payload?.data || []).catch(() => []),
    ProductLocation.list(language).then(res => res?.payload?.data || []).catch(() => []),
    getCachedBanner("home").catch((e) => {
      console.warn("[Home] getCachedBanner failed:", e);
      return null;
    }),
  ]);

  const bannerData = bannerDataRes?.payload?.data || [];

  const comboLocations = locationsData?.length > 0
    ? locationsData.map((opt: any) => ({
      value: opt.id,
      label: opt.name,
    }))
    : [];

  return (
    <Fragment>
      <WebsiteSchema />
      <h1 className="sr-only">{seo?.seo_title || "Happy Book - Dịch vụ du lịch hàng đầu"}</h1>

      {/* Search Desktop */}
      <div className="hidden lg:block relative">
        <HomeHeroDesktopBackground />
        <Suspense fallback={null}>
          <Search
            airportsData={airportsData}
            visaOptionsFilter={visaOptions}
            comboLocations={comboLocations}
          />
        </Suspense>
        {bannerData && bannerData.length > 0 && (
          <div className="absolute bottom-6 left-0 right-0 z-10 max-w-[1100px] mx-auto">
            <BannerSlide data={bannerData} />
          </div>
        )}
      </div>

      {/* Search Mobile */}
      <div className="mt-[68px] block lg:hidden relative min-h-[calc(100vh-68px)] flex flex-col pb-10 justify-start">
        <HomeHeroMobileBackground />
        <div className="relative flex flex-col">
          <div>
            <Suspense fallback={null}>
              <SearchMobile
                airportsData={airportsData}
                visaOptionsFilter={visaOptions}
                comboLocations={comboLocations}
              />
            </Suspense>
          </div>
          {bannerData && bannerData.length > 0 && (
            <div className="mt-0 px-3 relative z-10 w-full">
              <BannerSlide data={bannerData} />
            </div>
          )}
        </div>
      </div>
      <main className="w-full bg-white relative z-2 rounded-2xl">


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
            <HomeBusinessLounge />
          </AosAnimate>
        </Suspense>

        <Suspense fallback={<SkeletonProductTabs />}>
          <AosAnimate>
            <div className="mt-12 lg:mt-16 px-3 lg:px-[50px] xl:px-[80px] max__screen">
              <HomeSimFeatured />
            </div>
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
      {/* <SentryTestButton /> */}
    </Fragment>
  );
}
