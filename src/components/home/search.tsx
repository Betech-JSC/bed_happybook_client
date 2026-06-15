"use client";
import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchFlight from "@/app/ve-may-bay/components/Search";
import dynamic from "next/dynamic";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";
import { buildSearch } from "@/utils/Helper";
import Select from "react-select";

const SearchHotel = dynamic(() => import("@/app/khach-san/components/Search"), { ssr: false });
const VisaSearchForm = dynamic(() => import("@/app/visa/components/SeachForm"), { ssr: false });
const SimDuLichHeroFilters = dynamic(() => import("@/app/sim-du-lich/components/SimDuLichHeroFilters"), { ssr: false });
const AirportSearchForm = dynamic(() => import("@/app/fast-track/components/SearchForm"), { ssr: false });
const SearchTour = dynamic(() => import("@/app/tours/components/Search"), { ssr: false });
const SearchYacht = dynamic(() => import("@/app/du-thuyen/components/SearchForm"), { ssr: false });
const SearchAmusement = dynamic(() => import("@/app/ve-vui-choi/components/SearchForm"), { ssr: false });
const SearchInsurance = dynamic(() => import("@/app/bao-hiem/components/SearchForm"), { ssr: false });

function ComboSearchForm({ locations }: { locations: any[] }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState<{ from: string; to: string }>({ from: "", to: "" });

  const handleSearch = () => {
    const querySearch = buildSearch(query);
    router.push(`/combo/tim-kiem${querySearch}`);
  };

  const fromOptions = locations.filter((opt: any) => opt.label !== query?.to);
  const toOptions = locations.filter((opt: any) => opt.label !== query?.from);

  return (
    <div className="mt-2 flex flex-col lg:flex-row lg:space-x-4 space-y-3 items-end justify-between">
      <div className="relative w-full lg:w-[40%]">
        <label htmlFor="from" className="font-medium text-gray-700 block mb-1">
          {t("diem_di")}
        </label>
        <div className="w-full border border-gray-300 rounded-lg p-1.5 h-12 inline-flex items-center bg-white">
          <Image src="/icon/place.svg" alt="Địa điểm" className="h-5 mr-2" width={18} height={18} />
          <Select
            id="from"
            options={fromOptions}
            placeholder={t("chon_diem_di")}
            className="w-full text-sm"
            styles={{
              control: (base) => ({
                ...base,
                border: "none",
                boxShadow: "none",
                cursor: "pointer",
                width: "100%",
              }),
              indicatorsContainer: (provided) => ({
                ...provided,
                display: "none",
              }),
            }}
            onChange={(selectedOption: any) => {
              setQuery({
                ...query,
                from: selectedOption?.label ?? "",
              });
            }}
          />
        </div>
      </div>
      <div className="w-full lg:w-[40%] relative">
        <label htmlFor="to" className="font-medium text-gray-700 block mb-1">
          {t("diem_den")}
        </label>
        <div className="w-full border border-gray-300 rounded-lg p-1.5 h-12 inline-flex items-center bg-white">
          <Image src="/icon/place.svg" alt="Địa điểm" className="h-5 mr-2" width={18} height={18} />
          <Select
            id="to"
            options={toOptions}
            placeholder={t("chon_diem_den")}
            className="w-full text-sm"
            styles={{
              control: (base) => ({
                ...base,
                border: "none",
                boxShadow: "none",
                cursor: "pointer",
                width: "100%",
              }),
              indicatorsContainer: (provided) => ({
                ...provided,
                display: "none",
              }),
            }}
            onChange={(selectedOption: any) => {
              setQuery({
                ...query,
                to: selectedOption?.label ?? "",
              });
            }}
          />
        </div>
      </div>

      <div className="w-full lg:w-[20%] text-center border rounded-lg px-2 h-12 bg-orange-700 hover:bg-orange-800 duration-300 flex items-center justify-center cursor-pointer">
        <button
          type="button"
          className="inline-flex items-center justify-center space-x-2 h-12 text-white w-full font-medium"
          onClick={handleSearch}
        >
          <Image src="/icon/search.svg" alt="Tìm kiếm" className="h-5" width={18} height={18} />
          <span>{t("tim_kiem")}</span>
        </button>
      </div>
    </div>
  );
}

export default function Search({ airportsData, visaOptionsFilter, comboLocations }: any) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="relative z-20 hidden lg:block pointer-events-none">
      <div className="lg:h-[800px] lg:px-[50px] xl:px-[80px] sm:px-3 pt-[210px] max__screen">
        <h2 className="text-3xl text-white font-bold text-center mb-12 relative top-[-40px]">
          {t("bat_dau_hanh_trinh_voi_happy_book")}
        </h2>
        <div className="min-h-[192px] h-fit pt-[42px] p-6 mx-auto bg-white rounded-lg shadow-lg relative max-w-[1100px] pointer-events-auto">
          <div className="absolute -top-[52px] left-1/2 -translate-x-1/2 flex flex-col items-center w-full max-w-[960px] min-w-[820px] gap-1 bg-[#000000] p-2 rounded-3xl shadow-lg z-10">
            {/* Hàng 1: Sản phẩm nổi bật */}
            <div className="flex justify-center gap-2 w-full">
              {/* Tab 0 */}
              <button
                className={`flex items-center justify-center whitespace-nowrap text-white px-5 py-2.5 rounded-3xl focus:outline-none transition-colors ${activeTab === 0 ? "bg-[#1570EF]" : "bg-transparent"
                  }`}
                onClick={() => setActiveTab(0)}
              >
                <Image
                  src="/icon/AirplaneTilt.svg"
                  alt="Vé máy bay"
                  width={18}
                  height={18}
                  style={{ width: 18, height: 18 }}
                />
                <span className="ml-2 text-sm">{t("ve_may_bay")}</span>
              </button>

              {/* Tab 1 */}
              <button
                onClick={() => setActiveTab(1)}
                className={`flex items-center justify-center whitespace-nowrap text-white px-5 py-2.5 rounded-3xl focus:outline-none transition-colors ${activeTab === 1 ? "bg-[#1570EF]" : "bg-transparent"
                  }`}
              >
                <Image
                  src="/icon/Buildings.svg"
                  alt="Khách sạn"
                  width={18}
                  height={18}
                  style={{ width: 18, height: 18 }}
                />
                <span className="ml-2 text-sm">{t("khach_san")}</span>
              </button>

              {/* Tab 2 */}
              <button
                onClick={() => setActiveTab(2)}
                className={`flex items-center justify-center whitespace-nowrap text-white px-5 py-2.5 rounded-3xl focus:outline-none transition-colors ${activeTab === 2 ? "bg-[#1570EF]" : "bg-transparent"
                  }`}
              >
                <Image
                  src="/icon/Umbrella.svg"
                  alt="Visa"
                  width={18}
                  height={18}
                  style={{ width: 18, height: 18 }}
                />
                <span className="ml-2 text-sm">{t("visa")}</span>
              </button>

              {/* Tab 3 */}
              <button
                onClick={() => setActiveTab(3)}
                className={`flex items-center justify-center whitespace-nowrap text-white px-5 py-2.5 rounded-3xl focus:outline-none transition-colors ${activeTab === 3 ? "bg-[#1570EF]" : "bg-transparent"
                  }`}
              >
                <Image
                  src="/icon/Ticket.svg"
                  alt="Sim du lịch"
                  width={18}
                  height={18}
                  style={{ width: 18, height: 18 }}
                />
                <span className="ml-2 text-sm">{t("sim_du_lich")}</span>
              </button>

              {/* Tab 4 */}
              <button
                onClick={() => setActiveTab(4)}
                className={`flex items-center justify-center whitespace-nowrap text-white px-5 py-2.5 rounded-3xl focus:outline-none transition-colors ${activeTab === 4 ? "bg-[#1570EF]" : "bg-transparent"
                  }`}
              >
                <Image
                  src="/icon/Ticket.svg"
                  alt="Combo tiết kiệm"
                  width={18}
                  height={18}
                  style={{ width: 18, height: 18 }}
                />
                <span className="ml-2 text-sm">{t("combo_tiet_kiem")}</span>
              </button>

              {/* Tab 5 */}
              <button
                onClick={() => setActiveTab(5)}
                className={`flex items-center justify-center whitespace-nowrap text-white px-5 py-2.5 rounded-3xl focus:outline-none transition-colors ${activeTab === 5 ? "bg-[#1570EF]" : "bg-transparent"
                  }`}
              >
                <Image
                  src="/icon/Ticket.svg"
                  alt="Dịch vụ tại sân bay"
                  width={18}
                  height={18}
                  style={{ width: 18, height: 18 }}
                />
                <span className="ml-2 text-sm">{t("dich_vu_tai_san_bay")}</span>
              </button>
            </div>

            {/* Hàng 2: Menu còn lại (nhỏ hơn) */}
            <div className="flex justify-center gap-2 mt-0.5 border-t border-gray-800 w-full pt-1.5 pb-0.5">
              {/* Tab 6: Tours */}
              <button
                onClick={() => setActiveTab(6)}
                className={`flex items-center justify-center whitespace-nowrap text-white px-3 py-1 rounded-2xl focus:outline-none transition-colors text-xs ${activeTab === 6 ? "bg-[#1570EF]" : "bg-transparent opacity-75 hover:opacity-100"
                  }`}
              >
                <Image
                  src="/icon/map-pinned.svg"
                  alt="Tours"
                  width={14}
                  height={14}
                  style={{ width: 14, height: 14 }}
                />
                <span className="ml-1.5">{t("tours") || "Tours"}</span>
              </button>

              {/* Tab 7: Du thuyền */}
              <button
                onClick={() => setActiveTab(7)}
                className={`flex items-center justify-center whitespace-nowrap text-white px-3 py-1 rounded-2xl focus:outline-none transition-colors text-xs ${activeTab === 7 ? "bg-[#1570EF]" : "bg-transparent opacity-75 hover:opacity-100"
                  }`}
              >
                <Image
                  src="/icon/Ticket.svg"
                  alt="Du thuyền"
                  width={14}
                  height={14}
                  style={{ width: 14, height: 14 }}
                />
                <span className="ml-1.5">{t("du_thuyen") || "Du thuyền"}</span>
              </button>

              {/* Tab 8: Vé vui chơi */}
              <button
                onClick={() => setActiveTab(8)}
                className={`flex items-center justify-center whitespace-nowrap text-white px-3 py-1 rounded-2xl focus:outline-none transition-colors text-xs ${activeTab === 8 ? "bg-[#1570EF]" : "bg-transparent opacity-75 hover:opacity-100"
                  }`}
              >
                <Image
                  src="/icon/Ticket.svg"
                  alt="Vé vui chơi"
                  width={14}
                  height={14}
                  style={{ width: 14, height: 14 }}
                />
                <span className="ml-1.5">
                  {t("ve_vui_choi_hoat_dong") || "Vé vui chơi"}
                </span>
              </button>

              {/* Tab 9: Bảo hiểm */}
              <button
                onClick={() => setActiveTab(9)}
                className={`flex items-center justify-center whitespace-nowrap text-white px-3 py-1 rounded-2xl focus:outline-none transition-colors text-xs ${activeTab === 9 ? "bg-[#1570EF]" : "bg-transparent opacity-75 hover:opacity-100"
                  }`}
              >
                <Image
                  src="/icon/shield.svg"
                  alt="Bảo hiểm"
                  width={14}
                  height={14}
                  style={{ width: 14, height: 14 }}
                />
                <span className="ml-1.5">{t("bao_hiem") || "Bảo hiểm"}</span>
              </button>

              {/* Vé tàu */}
              <Link
                href="/ve-tau"
                className="flex items-center justify-center whitespace-nowrap text-white px-3 py-1 rounded-2xl transition-colors text-xs bg-transparent opacity-75 hover:opacity-100"
              >
                <Image
                  src="/icon/Ticket.svg"
                  alt="Vé tàu"
                  width={14}
                  height={14}
                  style={{ width: 14, height: 14 }}
                />
                <span className="ml-1.5">{t("ve_tau") || "Vé tàu"}</span>
              </Link>

              {/* Thuê xe */}
              <Link
                href="/thue-xe"
                className="flex items-center justify-center whitespace-nowrap text-white px-3 py-1 rounded-2xl transition-colors text-xs bg-transparent opacity-75 hover:opacity-100"
              >
                <Image
                  src="/icon/car-outline.svg"
                  alt="Thuê xe"
                  width={14}
                  height={14}
                  style={{ width: 14, height: 14 }}
                />
                <span className="ml-1.5">{t("thue_xe") || "Thuê xe"}</span>
              </Link>
            </div>
          </div>

          {/* Tabs 0 - Vé máy bay */}
          <div className={`mt-2 ${activeTab === 0 ? "block" : "hidden"}`}>
            <Suspense>
              <SearchFlight airportsData={airportsData} />
            </Suspense>
          </div>

          {/* Tabs 1 - Khách sạn */}
          <div className={`mt-2 ${activeTab === 1 ? "block" : "hidden"}`}>
            <SearchHotel />
          </div>

          {/* Tabs 2 - Visa */}
          <div className={`mt-2 ${activeTab === 2 ? "block" : "hidden"}`}>
            <VisaSearchForm optionsFilter={visaOptionsFilter} />
          </div>

          {/* Tabs 3 - Sim du lịch */}
          <div className={`mt-2 ${activeTab === 3 ? "block" : "hidden"}`}>
            <label className="font-medium text-gray-700 block mb-1">
              {t("sim_du_lich")}
            </label>
            <SimDuLichHeroFilters />
          </div>

          {/* Tabs 4 - Combo tiết kiệm */}
          <div className={`${activeTab === 4 ? "block" : "hidden"}`}>
            <ComboSearchForm locations={comboLocations} />
          </div>

          {/* Tabs 5 - Dịch vụ tại sân bay */}
          <div className={`${activeTab === 5 ? "block" : "hidden"}`}>
            <AirportSearchForm />
          </div>

          {/* Tabs 6 - Tours */}
          <div className={`mt-2 ${activeTab === 6 ? "block" : "hidden"}`}>
            <SearchTour isHomePage={true} />
          </div>

          {/* Tabs 7 - Du thuyền */}
          <div className={`mt-2 ${activeTab === 7 ? "block" : "hidden"}`}>
            <SearchYacht />
          </div>

          {/* Tabs 8 - Vé vui chơi & hoạt động */}
          <div className={`mt-2 ${activeTab === 8 ? "block" : "hidden"}`}>
            <SearchAmusement locations={comboLocations} />
          </div>

          {/* Tabs 9 - Bảo hiểm */}
          <div className={`mt-2 ${activeTab === 9 ? "block" : "hidden"}`}>
            <SearchInsurance />
          </div>
        </div>
      </div>
    </div>
  );
}
