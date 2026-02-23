"use client";
import { Fragment, Suspense, useEffect, useState } from "react";
import SearchFlight from "@/app/ve-may-bay/components/Search";
import Image from "next/image";
import { SearchFilghtProps } from "@/types/flight";
import SearchHotel from "@/app/khach-san/components/Search";
import { useRouter } from "next/navigation";
import SearchFormInsurance from "@/app/bao-hiem/components/SearchForm";
import { default as TicketSearchForm } from "@/app/ve-vui-choi/components/SearchForm";
import { default as VisaSearchForm } from "@/app/visa/components/SeachForm";
import { VisaApi } from "@/api/Visa";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function SearchMobile({ airportsData }: any) {
  const { t } = useTranslation();
  const [activeTabMb, setActiveTabMb] = useState<string>("ve-may-bay");
  const router = useRouter();
  const [querySeach, setQuerySeach] = useState<string>();
  // const optionsFilter = VisaApi.getOptionsFilter().then((data) => data);
  // console.log(optionsFilter);
  return (
    <Fragment>
      <h3 className="pt-8 text-xl lg:text-2xl font-bold text-center text-white">
        {t("bat_dau_hanh_trinh_voi_happy_book")}
      </h3>
      {/* Search Bar */}
      <form
        className="flex items-center px-3 my-4"
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
      </form>
      <div className="relative">
        {/* Search Bar */}
        <div className="grid grid-cols-4 gap-1.5 md:gap-2 my-4 px-3 md:px-1">
          <div
            onClick={() => setActiveTabMb("ve-may-bay")}
            className={`rounded-2xl text-center h-[104px] block content-center ${activeTabMb === "ve-may-bay"
              ? "bg-white text-[#175CD3]"
              : "bg-[#00000054] text-white"
              }`}
          >
            <div className="w-10 h-10 bg-[#175CD3] rounded-full mt-2 mx-auto content-center">
              <Image
                src="/icon/AirplaneTilt.svg"
                alt="Phone icon"
                width={20}
                height={20}
                className="rounded-full mx-auto"
                style={{ width: 20, height: 20 }}
              ></Image>
            </div>
            <span className="px-1 mt-2 text-sm font-medium">
              {t("ve_may_bay")}
            </span>
          </div>
          <div
            onClick={() => setActiveTabMb("hotel")}
            className={`rounded-2xl text-center h-[104px] block content-center ${activeTabMb === "hotel"
              ? "bg-white text-[#175CD3]"
              : "bg-[#00000054] text-white"
              }`}
          >
            <div className="w-10 h-10 bg-[#175CD3] rounded-full mt-2 mx-auto content-center">
              <Image
                src="/icon/Buildings.svg"
                alt="Phone icon"
                width={20}
                height={20}
                className="rounded-full mx-auto"
                style={{ width: 20, height: 20 }}
              ></Image>
            </div>
            <span className="px-1 mt-2 text-sm font-medium">
              {t("khach_san")}
            </span>
          </div>
          <div
            onClick={() => setActiveTabMb("insurance")}
            className={`rounded-2xl text-center h-[104px] block content-center ${activeTabMb === "insurance"
              ? "bg-white text-[#175CD3]"
              : "bg-[#00000054] text-white"
              }`}
          >
            <div className="w-10 h-10 rounded-full mt-2 bg-[#175CD3] mx-auto content-center">
              <Image
                src="/icon/Umbrella.svg"
                alt="Phone icon"
                width={20}
                height={20}
                className="rounded-full mx-auto"
              ></Image>
            </div>
            <span className="text-sm mt-2 font-medium">{t("bao_hiem")}</span>
          </div>
          <div
            onClick={() => setActiveTabMb("amusement-ticket")}
            className={`rounded-2xl text-center h-[104px] block content-center ${activeTabMb === "amusement-ticket"
              ? "bg-white text-[#175CD3]"
              : "bg-[#00000054] text-white"
              }`}
          >
            <div className="w-10 h-10 rounded-full mt-2 bg-[#175CD3] mx-auto content-center">
              <Image
                src="/icon/Ticket.svg"
                alt="Phone icon"
                width={20}
                height={20}
                className="rounded-full mx-auto"
              ></Image>
            </div>
            <span className="px-1 mt-2 text-sm font-medium">
              {t("ve_vui_choi")}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1.5 md:gap-2 my-4 px-3 md:px-1">
          <Link
            href="/visa"
            className={`rounded-2xl text-center h-[104px] block content-center bg-[#00000054] text-white`}
          >
            <div className="w-10 h-10 rounded-full mt-2 bg-[#175CD3] mx-auto content-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="rounded-full mx-auto"
              >
                <path d="M16 10h2" />
                <path d="M16 14h2" />
                <path d="M6.17 15a3 3 0 0 1 5.66 0" />
                <circle cx="9" cy="11" r="2" />
                <rect x="2" y="5" width="20" height="14" rx="2" />
              </svg>
            </div>
            <span className="text-sm mt-2 font-medium">{t("visa")}</span>
          </Link>
          <Link
            href="/tours"
            className={`rounded-2xl text-center h-[104px] block content-center bg-[#00000054] text-white`}
          >
            <div className="w-10 h-10 bg-[#175CD3] rounded-full mt-2 mx-auto content-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#fff"
                className="rounded-full mx-auto"
              >
                <path d="M784-120 530-374l56-56 254 254-56 56Zm-546-28q-60-60-89-135t-29-153q0-78 29-152t89-134q60-60 134.5-89.5T525-841q78 0 152.5 29.5T812-722L238-148Zm8-122 54-54q-16-21-30.5-43T243-411q-12-22-21-44t-16-43q-11 59-1.5 118T246-270Zm112-110 222-224q-43-33-86.5-53.5t-81.5-28q-38-7.5-68.5-2.5T296-666q-17 18-22 48.5t2.5 69q7.5 38.5 28 81.5t53.5 87Zm278-280 56-54q-53-32-112-42t-118 2q22 7 44 16t44 20.5q22 11.5 43.5 26T636-660Z" />
              </svg>
            </div>
            <span className="px-1 mt-2 text-sm font-medium">{t("tours")}</span>
          </Link>
          <Link
            href="/du-thuyen"
            className={`rounded-2xl text-center h-[104px] block content-center bg-[#00000054] text-white`}
          >
            <div className="w-10 h-10 bg-[#175CD3] rounded-full mt-2 mx-auto content-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#fff"
                className="rounded-full mx-auto"
              >
                <path d="m120-420 320-460v460H120Zm153-80h87v-125l-87 125Zm227 80q12-28 26-98t14-142q0-72-13.5-148T500-920q61 18 121.5 67t109 117q48.5 68 79 149.5T840-420H500Zm104-80h148q-17-77-55.5-141T615-750q2 21 3.5 43.5T620-660q0 47-4.5 87T604-500ZM360-200q-36 0-67-17t-53-43q-14 15-30.5 28T173-211q-35-26-59.5-64.5T80-360h800q-9 46-33.5 84.5T787-211q-20-8-36.5-21T720-260q-23 26-53.5 43T600-200q-36 0-67-17t-53-43q-22 26-53 43t-67 17ZM80-40v-80h40q32 0 62.5-10t57.5-30q27 20 57.5 29.5T360-121q32 0 62-9.5t58-29.5q27 20 57.5 29.5T600-121q32 0 62-9.5t58-29.5q28 20 58 30t62 10h40v80h-40q-31 0-61-7.5T720-70q-29 15-59 22.5T600-40q-31 0-61-7.5T480-70q-29 15-59 22.5T360-40q-31 0-61-7.5T240-70q-29 15-59 22.5T120-40H80Zm280-460Zm244 0Z" />
              </svg>
            </div>
            <span className="px-1 mt-2 text-sm font-medium">
              {t("du_thuyen")}
            </span>
          </Link>
          <Link
            href="/combo"
            className={`rounded-2xl text-center h-[104px] block content-center bg-[#00000054] text-white`}
          >
            <div className="w-10 h-10 rounded-full mt-2 bg-[#175CD3] mx-auto content-center">
              <Image
                src="/icon/Umbrella.svg"
                alt="Phone icon"
                width={20}
                height={20}
                className="rounded-full mx-auto"
              ></Image>
            </div>
            <span className="text-sm mt-2 font-medium">{t("combo")}</span>
          </Link>
        </div>
        {/* Tabs Fly */}
        <div className="mx-3 md:mx-2 h-fit pt-6 pb-4 bg-white rounded-2xl shadow-lg relative">
          {/* Tab Fly */}
          <div
            className={`px-3 ${activeTabMb === "ve-may-bay" ? "block" : "hidden"
              }`}
          >
            <Suspense>
              <SearchFlight airportsData={airportsData} />
            </Suspense>
          </div>

          {/* Tabs Hotel */}
          <div
            className={`px-3 ${activeTabMb === "hotel" ? "block" : "hidden"}`}
          >
            <SearchHotel />
          </div>

          {/* Tab */}
          <div
            className={`px-3 ${activeTabMb === "insurance" ? "block" : "hidden"
              }`}
          >
            <SearchFormInsurance />
          </div>

          {/* Tab Ticket */}
          <div
            className={`px-3 ${activeTabMb === "amusement-ticket" ? "block" : "hidden"
              }`}
          >
            <TicketSearchForm />
          </div>
          {/* Tab Visa */}
          {/* <div
            className={`px-3 ${activeTabMb === "visa" ? "block" : "hidden"}`}
          >
            <VisaSearchForm />
          </div> */}
        </div>
      </div>
    </Fragment>
  );
}
