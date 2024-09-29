import { Fragment } from "react";
import Banner from "@/components/banner";
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
import TravelGuide from "@/components/home/travel-guide";
import Flight from "@/components/home/flight";
import AosAnimate from "@/components/aos-animate";
import FooterMenu from "@/components/footer-menu";
import Search from "@/components/search";
import SearchMobile from "@/components/search-mobile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Happy Book",
};

export default function Home() {
  return (
    <Fragment>
      <Search />
      <div className="mt-[68px] block lg:hidden">
        <SearchMobile />
      </div>
      <main className="w-full bg-white relative z-2 rounded-2xl top-[-12px]">
        <div className="pt-7 px-3 lg:px-[50px] xl:px-[80px] max__screen">
          <Banner></Banner>
        </div>
        <AosAnimate>
          <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
            <CompoHot></CompoHot>
          </div>
        </AosAnimate>
        <AosAnimate>
          <Flight></Flight>
        </AosAnimate>
        <AosAnimate>
          <TourHot></TourHot>
        </AosAnimate>
        <AosAnimate>
          <TourNoiDia></TourNoiDia>
        </AosAnimate>
        <AosAnimate>
          <TourQuocTe></TourQuocTe>
        </AosAnimate>
        <AosAnimate>
          <VisaService></VisaService>
        </AosAnimate>
        <AosAnimate>
          <Hotel></Hotel>
        </AosAnimate>
        <AosAnimate>
          <VisaSteps></VisaSteps>
        </AosAnimate>
        <AosAnimate>
          <OurTeam></OurTeam>
        </AosAnimate>
        <AosAnimate>
          <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
            <TouristSuggest></TouristSuggest>
          </div>
        </AosAnimate>
        <AosAnimate>
          <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
            <TravelGuide></TravelGuide>
          </div>
        </AosAnimate>
        <AosAnimate>
          <Partner></Partner>
        </AosAnimate>
        <AosAnimate>
          <FooterMenu></FooterMenu>
        </AosAnimate>
      </main>
    </Fragment>
  );
}
