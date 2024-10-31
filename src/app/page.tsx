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
import type { Metadata } from "next";
import Image from "next/image";
import SearchMobile from "@/components/search-mobile";
import { getAirportsDefault } from "@/utils/Helper";

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Happy Book",
};
const airports = getAirportsDefault();

export default function Home() {
  return (
    <Fragment>
      <Search airports={airports} />
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
          <div className="relative z-[1]">
            <h3 className="pt-8 text-xl lg:text-2xl font-bold text-center text-white">
              Bắt đầu hành trình với HappyBook
            </h3>
            {/* Search Bar */}
            <div className="flex items-center px-3 my-4">
              <input
                type="text"
                placeholder="Tìm theo điểm đến, hoạt động"
                className="p-2 w-full rounded-l-lg text-gray-700 h-12"
              />
              <button className="bg-blue-500 px-3 rounded-r-lg w-12 h-12">
                <Image
                  src="/icon/search.svg"
                  alt="Search icon"
                  className="h-10"
                  width={20}
                  height={20}
                  style={{ width: 20, height: 20 }}
                />
              </button>
            </div>
            <SearchMobile airports={airports} />
          </div>
        </div>
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
