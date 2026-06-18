"use client";
import { Fragment, Suspense, useState } from "react";
import SearchFlight from "@/app/ve-may-bay/components/Search";
import Image from "next/image";
import SearchHotel from "@/app/khach-san/components/Search";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { buildSearch } from "@/utils/Helper";
import Select from "react-select";

const VisaSearchForm = dynamic(() => import("@/app/visa/components/SeachForm"), { ssr: false });
const SimDuLichHeroFilters = dynamic(() => import("@/app/sim-du-lich/components/SimDuLichHeroFilters"), { ssr: false });
const AirportSearchForm = dynamic(() => import("@/app/fast-track/components/SearchForm"), { ssr: false });
const LoungeSearchForm = dynamic(() => import("@/app/phong-cho-thuong-gia/components/SearchForm"), { ssr: false });
const SearchAmusement = dynamic(() => import("@/app/ve-vui-choi/components/SearchForm"), { ssr: false });

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
    <div className="flex flex-col space-y-3">
      <div className="relative w-full">
        <label htmlFor="from-mb" className="font-medium text-gray-700 block mb-1">
          {t("diem_di")}
        </label>
        <div className="w-full border border-gray-300 rounded-lg p-1.5 h-12 inline-flex items-center bg-white">
          <Image src="/icon/place.svg" alt="Địa điểm" className="h-5 mr-2" width={18} height={18} />
          <Select
            id="from-mb"
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
      <div className="w-full relative">
        <label htmlFor="to-mb" className="font-medium text-gray-700 block mb-1">
          {t("diem_den")}
        </label>
        <div className="w-full border border-gray-300 rounded-lg p-1.5 h-12 inline-flex items-center bg-white">
          <Image src="/icon/place.svg" alt="Địa điểm" className="h-5 mr-2" width={18} height={18} />
          <Select
            id="to-mb"
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

      <div className="w-full text-center border rounded-lg px-2 h-12 bg-orange-700 hover:bg-orange-800 duration-300 flex items-center justify-center cursor-pointer">
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

export default function SearchMobile({ airportsData, visaOptionsFilter, comboLocations }: any) {
  const { t } = useTranslation();
  const [activeTabMb, setActiveTabMb] = useState<string | null>(null);
  const router = useRouter();
  const [querySeach, setQuerySeach] = useState<string>();

  return (
    <div className={`relative w-full ${activeTabMb ? "z-20" : "z-0"}`}>

      <h3 className="pt-3 text-lg font-bold text-center text-white">
        {t("bat_dau_hanh_trinh_voi_happy_book")}
      </h3>
      {/* Search Bar */}
      <form
        className="flex items-center px-3 mt-2 mb-0"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          router.push(`tours/tim-kiem?text=${querySeach}`);
        }}
      >
        <input
          type="text"
          placeholder={t("tim_theo_diem_den_hoat_dong")}
          onChange={(e) => {
            setQuerySeach(e.target.value);
          }}
          className="p-2 w-full rounded-l-lg text-gray-700 h-10 text-sm"
        />
        <button className="bg-blue-500 px-3 rounded-r-lg w-10 h-10 flex items-center justify-center">
          <Image
            src="/icon/search.svg"
            alt="Tìm kiếm"
            className="h-5 w-5"
            width={20}
            height={20}
            style={{ width: 20, height: 20 }}
          />
        </button>
      </form>
      <div className="relative">
        <div className="mx-3 my-2 bg-white rounded-2xl p-2 pb-2.5 shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-[#F2F4F7]">
          {/* Search Bar Grid */}
          <div className="grid grid-cols-3 gap-x-1.5 gap-y-1 w-full mx-auto items-start">
            {/* Tab 1 */}
            <div
              onClick={() => setActiveTabMb(activeTabMb === "ve-may-bay" ? null : "ve-may-bay")}
              className={`rounded-xl text-center min-h-[72px] h-fit pb-1.5 flex flex-col items-center justify-start pt-1 cursor-pointer ${activeTabMb === "ve-may-bay" ? "bg-blue-50 text-[#1570EF]" : "bg-transparent text-[#344054]"
                }`}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <Image
                  src="/icon/AirplaneTilt.svg"
                  alt="Vé máy bay"
                  width={28}
                  height={28}
                  className="rounded-full"
                  style={{
                    width: 28,
                    height: 28,
                    filter: "brightness(0) saturate(100%) invert(32%) sepia(85%) saturate(1472%) hue-rotate(204deg) brightness(96%) contrast(97%)"
                  }}
                />
              </div>
              <span className="px-1 mt-0.5 text-[11px] font-bold block leading-tight">{t("ve_may_bay")}</span>
            </div>

            {/* Tab 2 */}
            <div
              onClick={() => setActiveTabMb(activeTabMb === "hotel" ? null : "hotel")}
              className={`rounded-xl text-center min-h-[72px] h-fit pb-1.5 flex flex-col items-center justify-start pt-1 cursor-pointer ${activeTabMb === "hotel" ? "bg-blue-50 text-[#1570EF]" : "bg-transparent text-[#344054]"
                }`}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <Image
                  src="/icon/Buildings.svg"
                  alt="Khách sạn"
                  width={28}
                  height={28}
                  className="rounded-full"
                  style={{
                    width: 28,
                    height: 28,
                    filter: "brightness(0) saturate(100%) invert(32%) sepia(85%) saturate(1472%) hue-rotate(204deg) brightness(96%) contrast(97%)"
                  }}
                />
              </div>
              <span className="px-1 mt-0.5 text-[11px] font-bold block leading-tight">{t("khach_san")}</span>
            </div>

            {/* Tab 3 */}
            <div
              onClick={() => setActiveTabMb(activeTabMb === "visa" ? null : "visa")}
              className={`rounded-xl text-center min-h-[72px] h-fit pb-1.5 flex flex-col items-center justify-start pt-1 cursor-pointer ${activeTabMb === "visa" ? "bg-blue-50 text-[#1570EF]" : "bg-transparent text-[#344054]"
                }`}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={28}
                  height={28}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1570EF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="rounded-full"
                >
                  <rect x="5" y="3" width="14" height="18" rx="2" />
                  <circle cx="12" cy="11" r="3" strokeWidth="1.5" />
                  <line x1="9" y1="11" x2="15" y2="11" strokeWidth="1.5" />
                  <path d="M12 8c1 0 1.5 1.5 1.5 3s-.5 3-1.5 3-1.5-1.5-1.5-3 .5-3 1.5-3z" strokeWidth="1.5" />
                  <line x1="8" y1="18" x2="16" y2="18" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="px-1 mt-0.5 text-[11px] font-bold block leading-tight">{t("visa")}</span>
            </div>

            {/* Tab 4 */}
            <div
              onClick={() => setActiveTabMb(activeTabMb === "sim-du-lich" ? null : "sim-du-lich")}
              className={`rounded-xl text-center min-h-[72px] h-fit pb-1.5 flex flex-col items-center justify-start pt-1 cursor-pointer ${activeTabMb === "sim-du-lich" ? "bg-blue-50 text-[#1570EF]" : "bg-transparent text-[#344054]"
                }`}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={28}
                  height={28}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1570EF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="rounded-full"
                >
                  <path d="M16.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5.5L16.5 3z" />
                  <rect x="8" y="11" width="8" height="6" rx="1" strokeWidth="1.5" />
                  <line x1="12" y1="11" x2="12" y2="17" strokeWidth="1.5" />
                  <line x1="8" y1="14" x2="16" y2="14" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="px-1 mt-0.5 text-[11px] font-bold block leading-tight">{t("sim_du_lich")}</span>
            </div>

            {/* Tab 5 */}
            <div
              onClick={() => setActiveTabMb(activeTabMb === "combo" ? null : "combo")}
              className={`rounded-xl text-center min-h-[72px] h-fit pb-1.5 flex flex-col items-center justify-start pt-1 cursor-pointer ${activeTabMb === "combo" ? "bg-blue-50 text-[#1570EF]" : "bg-transparent text-[#344054]"
                }`}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={28}
                  height={28}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1570EF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="rounded-full"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2.5" />
                </svg>
              </div>
              <span className="px-1 mt-0.5 text-[11px] font-bold block leading-tight">{t("combo_tiet_kiem")}</span>
            </div>

            {/* Tab 6 */}
            <div
              onClick={() => setActiveTabMb(activeTabMb === "airport-service" ? null : "airport-service")}
              className={`rounded-xl text-center min-h-[72px] h-fit pb-1.5 flex flex-col items-center justify-start pt-1 cursor-pointer ${activeTabMb === "airport-service" ? "bg-blue-50 text-[#1570EF]" : "bg-transparent text-[#344054]"
                }`}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={28}
                  height={28}
                  viewBox="0 0 24 24"
                  fill="#1570EF"
                  stroke="#1570EF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="rounded-full"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span className="px-1 mt-0.5 text-[11px] font-bold block leading-tight">{t("don_tien_uu_tien_fast_track") || "Đón tiễn ưu tiên (FastTrack)"}</span>
            </div>


            {/* Tab 11 - Phòng chờ thương gia */}
            <div
              onClick={() => setActiveTabMb(activeTabMb === "phong-cho-thuong-gia" ? null : "phong-cho-thuong-gia")}
              className={`rounded-xl text-center min-h-[62px] h-fit pb-1 flex flex-col items-center justify-start pt-1 cursor-pointer ${activeTabMb === "phong-cho-thuong-gia" ? "bg-blue-50 text-[#1570EF]" : "bg-transparent text-[#344054]"
                }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activeTabMb === "phong-cho-thuong-gia" ? "bg-[#1570EF]" : "bg-[#EFF8FF]"
                }`}>
                <Image
                  src="/icon/lounge-light.svg"
                  alt="Phòng chờ thương gia"
                  width={16}
                  height={16}
                  className="rounded-full"
                  style={{
                    width: 16,
                    height: 16,
                    filter: activeTabMb === "phong-cho-thuong-gia"
                      ? "none"
                      : "brightness(0) saturate(100%) invert(32%) sepia(85%) saturate(1472%) hue-rotate(204deg) brightness(96%) contrast(97%)"
                  }}
                />
              </div>
              <span className="px-1 mt-0.5 text-[11px] font-bold block leading-tight">
                {t("phong_cho_thuong_gia") || "Phòng chờ thương gia"}
              </span>
            </div>

            {/* Du thuyền */}
            <Link
              href="/du-thuyen"
              className="rounded-xl text-center min-h-[62px] h-fit pb-1 flex flex-col items-center justify-start pt-1 bg-transparent text-[#344054]"
            >
              <div className="w-8 h-8 bg-[#EFF8FF] rounded-full flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16px"
                  viewBox="0 -960 960 960"
                  width="16px"
                  fill="#1570EF"
                  className="rounded-full"
                >
                  <path d="m120-420 320-460v460H120Zm153-80h87v-125l-87 125Zm227 80q12-28 26-98t14-142q0-72-13.5-148T500-920q61 18 121.5 67t109 117q48.5 68 79 149.5T840-420H500Zm104-80h148q-17-77-55.5-141T615-750q2 21 3.5 43.5T620-660q0 47-4.5 87T604-500ZM360-200q-36 0-67-17t-53-43q-14 15-30.5 28T173-211q-35-26-59.5-64.5T80-360h800q-9 46-33.5 84.5T787-211q-20-8-36.5-21T720-260q-23 26-53.5 43T600-200q-36 0-67-17t-53-43q-22 26-53 43t-67 17ZM80-40v-80h40q32 0 62.5-10t57.5-30q27 20 57.5 29.5T360-121q32 0 62-9.5t58-29.5q27 20 57.5 29.5T600-121q32 0 62-9.5t58-29.5q28 20 58 30t62 10h40v80h-40q-31 0-61-7.5T720-70q-29 15-59 22.5T600-40q-31 0-61-7.5T480-70q-29 15-59 22.5T360-40q-31 0-61-7.5T240-70q-29 15-59 22.5T120-40H80Zm280-460Zm244 0Z" />
                </svg>
              </div>
              <span className="px-1 mt-0.5 text-[11px] font-bold block leading-tight">{t("du_thuyen")}</span>
            </Link>

            {/* Vé vui chơi */}
            <div
              onClick={() => setActiveTabMb(activeTabMb === "ve-vui-choi" ? null : "ve-vui-choi")}
              className={`rounded-xl text-center min-h-[62px] h-fit pb-1 flex flex-col items-center justify-start pt-1 cursor-pointer ${activeTabMb === "ve-vui-choi" ? "bg-blue-50 text-[#1570EF]" : "bg-transparent text-[#344054]"
                }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activeTabMb === "ve-vui-choi" ? "bg-[#1570EF]" : "bg-[#EFF8FF]"
                }`}>
                <Image
                  src="/icon/Ticket.svg"
                  alt="Vé vui chơi"
                  width={16}
                  height={16}
                  className="rounded-full"
                  style={{
                    filter: activeTabMb === "ve-vui-choi"
                      ? "none"
                      : "brightness(0) saturate(100%) invert(32%) sepia(85%) saturate(1472%) hue-rotate(204deg) brightness(96%) contrast(97%)"
                  }}
                />
              </div>
              <span className="px-1 mt-0.5 text-[11px] font-bold block leading-tight">
                {t("ve_vui_choi_hoat_dong") || "Vé vui chơi & hoạt động"}
              </span>
            </div>


            {/* Tours */}
            <Link
              href="/tours"
              className="rounded-xl text-center min-h-[62px] h-fit pb-1 flex flex-col items-center justify-start pt-1 bg-transparent text-[#344054]"
            >
              <div className="w-8 h-8 bg-[#EFF8FF] rounded-full flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16px"
                  viewBox="0 -960 960 960"
                  width="16px"
                  fill="#1570EF"
                  className="rounded-full"
                >
                  <path d="M784-120 530-374l56-56 254 254-56 56Zm-546-28q-60-60-89-135t-29-153q0-78 29-152t89-134q60-60 134.5-89.5T525-841q78 0 152.5 29.5T812-722L238-148Zm8-122 54-54q-16-21-30.5-43T243-411q-12-22-21-44t-16-43q-11 59-1.5 118T246-270Zm112-110 222-224q-43-33-86.5-53.5t-81.5-28q-38-7.5-68.5-2.5T296-666q-17 18-22 48.5t2.5 69q7.5 38.5 28 81.5t53.5 87Zm278-280 56-54q-53-32-112-42t-118 2q22 7 44 16t44 20.5q22 11.5 43.5 26T636-660Z" />
                </svg>
              </div>
              <span className="px-1 mt-0.5 text-[11px] font-bold block leading-tight">{t("tours")}</span>
            </Link>

            {/* Vé tàu */}
            <Link
              href="/ve-tau"
              className="rounded-xl text-center min-h-[62px] h-fit pb-1 flex flex-col items-center justify-start pt-1 bg-transparent text-[#344054]"
            >
              <div className="w-8 h-8 bg-[#EFF8FF] rounded-full flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1570EF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="rounded-full"
                >
                  <path d="M21 3.5V19c0 1.7-1.3 3-3 3H6c-1.7 0-3-1.3-3-3V3.5" />
                  <path d="M6 5c0-1 1-2 2-2h8c1 0 2 1 2 2v4c0 1-1 2-2 2H8c-1 0-2-1-2-2Z" />
                  <path d="M12 11v4" />
                  <path d="M8 15h8" />
                  <path d="M9 19c0 1.1-.9 2-2 2" />
                  <path d="M15 19c0 1.1.9 2 2 2" />
                </svg>
              </div>
              <span className="px-1 mt-0.5 text-[11px] font-bold block leading-tight">{t("ve_tau") || "Vé tàu"}</span>
            </Link>

            {/* Thuê xe */}
            <Link
              href="/thue-xe"
              className="rounded-xl text-center min-h-[62px] h-fit pb-1 flex flex-col items-center justify-start pt-1 bg-transparent text-[#344054]"
            >
              <div className="w-8 h-8 bg-[#EFF8FF] rounded-full flex items-center justify-center shrink-0">
                <Image
                  src="/icon/car-outline.svg"
                  alt="Thuê xe"
                  width={16}
                  height={16}
                  className="rounded-full"
                  style={{
                    filter: "brightness(0) saturate(100%) invert(32%) sepia(85%) saturate(1472%) hue-rotate(204deg) brightness(96%) contrast(97%)"
                  }}
                />
              </div>
              <span className="px-1 mt-0.5 text-[11px] font-bold block leading-tight">{t("thue_xe") || "Thuê xe"}</span>
            </Link>
          </div>
        </div>

        {/* Tab Forms Container */}
        <div className={`mx-3 md:mx-2 h-fit pt-6 pb-4 mb-4 bg-white rounded-2xl shadow-lg relative ${activeTabMb ? "block" : "hidden"}`}>
          {/* Tab 1 */}
          <div className={`px-3 ${activeTabMb === "ve-may-bay" ? "block" : "hidden"}`}>
            <Suspense fallback={null}>
              <SearchFlight airportsData={airportsData} />
            </Suspense>
          </div>

          {/* Tab 2 */}
          <div className={`px-3 ${activeTabMb === "hotel" ? "block" : "hidden"}`}>
            <SearchHotel />
          </div>

          {/* Tab 3 */}
          <div className={`px-3 ${activeTabMb === "visa" ? "block" : "hidden"}`}>
            <VisaSearchForm optionsFilter={visaOptionsFilter} />
          </div>

          {/* Tab 4 */}
          <div className={`px-3 ${activeTabMb === "sim-du-lich" ? "block" : "hidden"}`}>
            <label className="font-medium text-gray-700 block mb-2">{t("sim_du_lich")}</label>
            <SimDuLichHeroFilters />
          </div>

          {/* Tab 5 */}
          <div className={`px-3 ${activeTabMb === "combo" ? "block" : "hidden"}`}>
            <ComboSearchForm locations={comboLocations} />
          </div>

          {/* Tab 6 */}
          <div className={`px-3 ${activeTabMb === "airport-service" ? "block" : "hidden"}`}>
            <AirportSearchForm />
          </div>

          {/* Tab 11 - Phòng chờ thương gia */}
          <div className={`px-3 ${activeTabMb === "phong-cho-thuong-gia" ? "block" : "hidden"}`}>
            <LoungeSearchForm />
          </div>

          {/* Tab 8 - Vé vui chơi & hoạt động */}
          <div className={`px-3 ${activeTabMb === "ve-vui-choi" ? "block" : "hidden"}`}>
            <SearchAmusement locations={comboLocations} />
          </div>

        </div>
      </div>
    </div>
  );
}
