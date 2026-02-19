"use client";
import { Suspense, useState } from "react";
import Image from "next/image";
import SearchFlight from "@/app/ve-may-bay/components/Search";
import { SearchFilghtProps } from "@/types/flight";
import SearchHotel from "@/app/khach-san/components/Search";
import SearchFormInsurance from "@/app/bao-hiem/components/SearchForm";
import { default as TicketSearchForm } from "@/app/ve-vui-choi/components/SearchForm";
import { useTranslation } from "@/hooks/useTranslation";

export default function Search({ airportsData }: any) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="relative z-[1] hidden lg:block">
      <div className="absolute inset-0">
        <Image
          priority
          src="/bg-image.png"
          width={500}
          height={584}
          className="object-cover w-full h-full"
          alt="Tìm kiếm tour và vé máy bay Happy Book"
        />
      </div>
      <div
        className="absolute w-full h-full"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
        }}
      ></div>
      <div className="lg:h-[694px] lg:px-[50px] xl:px-[80px] sm:px-3 content-center pt-[132px] max__screen">
        <h1 className="text-3xl text-white font-bold text-center mb-12 relative">
          {t("bat_dau_hanh_trinh_voi_happy_book")}
        </h1>
        <div className="h-[192px] pt-11 p-6 mx-auto  bg-white rounded-lg shadow-lg relative">
          <div className="min-w-[600px] w-max grid grid-cols-4 gap-2 mb-4 absolute top-[-12%] left-[50%] translate-x-[-50%] bg-[#000000] py-2 px-3 rounded-3xl">
            <button
              className={`flex lg:h-11 items-center justify-center text-white py-1 px-3 rounded-3xl focus:outline-none ${activeTab === 0 ? "bg-[#1570EF]" : ""
                }`}
              onClick={() => setActiveTab(0)}
            >
              <Image
                src="/icon/AirplaneTilt.svg"
                alt="Vé máy bay"
                width={18}
                height={18}
                style={{ width: 18, height: 18 }}
              ></Image>
              <span className="ml-2">{t("ve_may_bay")}</span>
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`flex lg:h-11 items-center justify-center text-white py-1 px-3 rounded-3xl focus:outline-none ${activeTab === 1 ? "bg-[#1570EF]" : ""
                }`}
            >
              <Image
                src="/icon/Buildings.svg"
                alt="Khách sạn"
                width={18}
                height={18}
                style={{ width: 18, height: 18 }}
              ></Image>
              <span className="ml-2">{t("khach_san")}</span>
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`flex lg:h-11 items-center justify-center text-white py-1 px-3 rounded-3xl focus:outline-none ${activeTab === 2 ? "bg-[#1570EF]" : ""
                }`}
            >
              <Image
                src="/icon/Umbrella.svg"
                alt="Bảo hiểm"
                width={18}
                height={18}
              ></Image>
              <span className="ml-2">{t("bao_hiem")}</span>
            </button>
            <button
              onClick={() => setActiveTab(3)}
              className={`flex lg:h-11 items-center justify-center text-white py-1 px-3 rounded-3xl focus:outline-none ${activeTab === 3 ? "bg-[#1570EF]" : ""
                }`}
            >
              <Image
                src="/icon/Ticket.svg"
                alt="Vé vui chơi"
                width={18}
                height={18}
              ></Image>
              <span className="ml-2">{t("ve_vui_choi")}</span>
            </button>
          </div>
          {/* Tabs 0 */}
          <div className={`mt-2 ${activeTab === 0 ? "block" : "hidden"}`}>
            <Suspense>
              <SearchFlight airportsData={airportsData} />
            </Suspense>
          </div>

          {/* Tabs 1 */}
          <div className={`mt-8 ${activeTab === 1 ? "block" : "hidden"}`}>
            <SearchHotel />
          </div>
          {/* Tabs 2 */}
          <div className={`mt-8 ${activeTab === 2 ? "block" : "hidden"}`}>
            <SearchFormInsurance />
          </div>

          {/* Tabs 3 */}
          <div className={`${activeTab === 3 ? "block" : "hidden"}`}>
            <TicketSearchForm />
          </div>
        </div>
      </div>
    </div>
  );
}
