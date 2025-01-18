import { Fragment, Suspense } from "react";
import Banner from "@/components/home/banner";
import TourNoiDia from "@/components/home/tour-noi-dia";
import TourHot from "@/components/home/tour-hot";
import TourQuocTe from "@/components/home/tour-quoc-te";
import VisaService from "@/components/home/visa-service";
import Hotel from "@/components/home/hotel";
import CompoHot from "@/components/home/compo-hot";
import VisaSteps from "@/components/home/visa-steps";
import Partner from "@/components/home/partner";
import OurTeam from "@/components/home/our-team";
import TouristSuggest from "@/components/home/tourist-suggest";
import Flight from "@/components/home/flight";
import AosAnimate from "@/components/layout/aos-animate";
import FooterMenu from "@/components/content-page/footer-menu";
import Search from "@/components/home/search";
import type { Metadata } from "next";
import Image from "next/image";
import SearchMobile from "@/components/home/search-mobile";
import { FlightApi } from "@/api/Flight";
import { HomeApi } from "@/api/Home";
import { siteUrl } from "@/constants";
import { WebsiteSchema } from "@/components/schema/WebsiteSchema";
import { formatMetadata } from "@/lib/formatters";
import { BannerApi } from "@/api/Banner";
import { cloneItemsCarousel } from "@/utils/Helper";
import NewsByPage from "@/components/content-page/NewsByPage";
import { newsApi } from "@/api/news";

export const metadata: Metadata = formatMetadata({
  title: "HappyBook Travel: Đặt vé máy bay, Tour, Khách sạn giá rẻ #1",
  description:
    "HappyBook Travel - Hỗ trợ đặt vé máy bay, tour du lịch, khách sạn và tư vấn visa nhanh chóng. Là đại lý CẤP #1 uy tín với hơn >100.000 Quý khách tin tưởng 2024.",
  alternates: {
    canonical: siteUrl,
  },
});

export default async function Home() {
  const airportsReponse = await FlightApi.airPorts();
  const airportsData = airportsReponse?.payload.data ?? [];
  const homeApiReponse = await HomeApi.index();
  const homeData = homeApiReponse?.payload.data ?? [];
  const bannerData = (await BannerApi.getBannerPage("home"))?.payload
    ?.data as any;
  let popularFlights = (await FlightApi.getPopularFlights())?.payload
    ?.data as any;
  if (popularFlights.length > 0 && popularFlights.length < 5) {
    popularFlights = cloneItemsCarousel(popularFlights, 8);
  }
  const membersData = (await BannerApi.getBannerPage("home-doingu"))?.payload
    ?.data as any;
  const partners = (await BannerApi.getBannerPage("home-doitac"))?.payload
    ?.data as any;
  const touristSuggest = (await BannerApi.getBannerPage("home-dichoi"))?.payload
    ?.data as any;
  const lastestNews =
    ((await newsApi.getLastedNewsByPage())?.payload?.data as any) ?? [];
  return (
    <Fragment>
      <WebsiteSchema {...(metadata as any)} url={siteUrl} />

      <Suspense>
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
              alt="Background"
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
            <SearchMobile airportsData={airportsData} />
          </div>
        </div>
      </div>
      <main className="w-full bg-white relative z-2 rounded-2xl top-[-12px]">
        {bannerData?.length > 0 && (
          <div className="pt-7 px-3 lg:px-[50px] xl:px-[80px] max__screen">
            <Banner data={bannerData}></Banner>
          </div>
        )}
        {homeData?.compoHot.length > 0 && (
          <AosAnimate>
            <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
              <CompoHot data={homeData?.compoHot}></CompoHot>
            </div>
          </AosAnimate>
        )}
        {popularFlights?.length > 0 && (
          <AosAnimate>
            <Flight data={popularFlights}></Flight>
          </AosAnimate>
        )}

        {homeData?.tours?.hot.length > 0 && (
          <AosAnimate>
            <TourHot data={homeData.tours.hot}></TourHot>
          </AosAnimate>
        )}

        {homeData?.tours?.domestic.length > 0 && (
          <AosAnimate>
            <TourNoiDia data={homeData.tours.domestic}></TourNoiDia>
          </AosAnimate>
        )}

        {homeData?.tours?.international.length > 0 && (
          <AosAnimate>
            <TourQuocTe data={homeData.tours.international}></TourQuocTe>
          </AosAnimate>
        )}

        {homeData?.visa.length > 0 && (
          <AosAnimate>
            <VisaService data={homeData.visa}></VisaService>
          </AosAnimate>
        )}

        {homeData?.hotels.length > 0 && (
          <AosAnimate>
            <Hotel data={homeData.hotels}></Hotel>
          </AosAnimate>
        )}

        <AosAnimate>
          <VisaSteps></VisaSteps>
        </AosAnimate>

        {membersData?.length > 0 && (
          <AosAnimate>
            <OurTeam data={membersData}></OurTeam>
          </AosAnimate>
        )}

        {touristSuggest?.length > 0 && (
          <AosAnimate>
            <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
              <TouristSuggest data={touristSuggest}></TouristSuggest>
            </div>
          </AosAnimate>
        )}

        {lastestNews.length > 0 && (
          <AosAnimate>
            <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
              <NewsByPage title={"Cẩm nang du lịch"} data={lastestNews} />
            </div>
          </AosAnimate>
        )}

        {partners?.length > 0 && (
          <AosAnimate>
            <Partner data={partners}></Partner>
          </AosAnimate>
        )}

        <AosAnimate>
          <FooterMenu page={"home"}></FooterMenu>
        </AosAnimate>
      </main>
    </Fragment>
  );
}

const a = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://happybook.com.vn/#person",
      name: "Happy Book ????\ufe0f \u0110\u1ea1i L\u00fd \u0110\u1eb7t V\u00e9 M\u00e1y Bay Gi\u00e1 R\u1ebb #1 To\u00e0n Qu\u1ed1c",
      image: {
        "@type": "ImageObject",
        "@id": "https://happybook.com.vn/#logo",
        url: "https://happybook.com.vn/wp-content/uploads/2023/06/cropped-logo-happy-book.png",
        contentUrl:
          "https://happybook.com.vn/wp-content/uploads/2023/06/cropped-logo-happy-book.png",
        caption:
          "Happy Book ????\ufe0f \u0110\u1ea1i L\u00fd \u0110\u1eb7t V\u00e9 M\u00e1y Bay Gi\u00e1 R\u1ebb #1 To\u00e0n Qu\u1ed1c",
        inLanguage: "vi",
        width: "512",
        height: "512",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://happybook.com.vn/#website",
      url: "https://happybook.com.vn",
      name: "Happy Book ????\ufe0f \u0110\u1ea1i L\u00fd \u0110\u1eb7t V\u00e9 M\u00e1y Bay Gi\u00e1 R\u1ebb #1 To\u00e0n Qu\u1ed1c",
      publisher: { "@id": "https://happybook.com.vn/#person" },
      inLanguage: "vi",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://happybook.com.vn/combo/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: "1",
          item: { "@id": "https://happybook.com.vn", name: "Trang ch\u1ee7" },
        },
        {
          "@type": "ListItem",
          position: "2",
          item: { "@id": "https://happybook.com.vn/combo/", name: "Combo" },
        },
      ],
    },
    {
      "@type": "CollectionPage",
      "@id": "https://happybook.com.vn/combo/#webpage",
      url: "https://happybook.com.vn/combo/",
      name: "Combo Archives - HappyBook Travel: \u0110\u1eb7t v\u00e9 m\u00e1y bay, Tour, Kh\u00e1ch s\u1ea1n gi\u00e1 r\u1ebb #1",
      isPartOf: { "@id": "https://happybook.com.vn/#website" },
      inLanguage: "vi",
      breadcrumb: { "@id": "https://happybook.com.vn/combo/#breadcrumb" },
    },
  ],
};
