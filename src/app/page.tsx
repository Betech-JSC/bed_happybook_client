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

export default function Home() {
  return (
    <main className="w-full bg-white relative z-2 rounded-2xl top-[-12px]">
      <div className="pt-7 px-3 lg:px-[50px] xl:px-[80px]">
        <Banner></Banner>
      </div>
      <div className="px-3 lg:px-[50px] xl:px-[80px]">
        <CompoHot></CompoHot>
      </div>
      <div className="px-3 lg:px-[50px] xl:px-[80px]">
        <TourHot></TourHot>
      </div>
      <div className="px-3 lg:px-[50px] xl:px-[80px]">
        <TourNoiDia></TourNoiDia>
      </div>
      <div className="px-3 lg:px-[50px] xl:px-[80px]">
        <TourQuocTe></TourQuocTe>
      </div>
      <div className="px-3 lg:px-[50px] xl:px-[80px]">
        <VisaService></VisaService>
      </div>
      <div className="px-3 lg:px-[50px] xl:px-[80px]">
        <Hotel></Hotel>
      </div>
      <VisaSteps></VisaSteps>
      <OurTeam></OurTeam>
      <div className="px-3 lg:px-[50px] xl:px-[80px]">
        <TouristSuggest></TouristSuggest>
      </div>
      <div className="px-3 lg:px-[50px] xl:px-[80px]">
        <TravelGuide></TravelGuide>
      </div>
      <Partner></Partner>
    </main>
  );
}
