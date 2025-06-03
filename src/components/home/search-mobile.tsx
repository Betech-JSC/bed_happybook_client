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

export default function SearchMobile({ airportsData }: any) {
  const [activeTabMb, setActiveTabMb] = useState<string>("ve-may-bay");
  const router = useRouter();
  const [querySeach, setQuerySeach] = useState<string>();
  // const optionsFilter = VisaApi.getOptionsFilter().then((data) => data);
  // console.log(optionsFilter);
  return (
    <Fragment>
      <h3
        className="pt-8 text-xl lg:text-2xl font-bold text-center text-white"
        data-translate="true"
      >
        Bắt đầu hành trình với HappyBook
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
          placeholder="Tìm theo điểm đến, hoạt động"
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
        <div className="grid grid-cols-4 gap-2 my-4 px-1">
          <div
            onClick={() => setActiveTabMb("ve-may-bay")}
            className={`rounded-2xl text-center h-[104px] block content-center ${
              activeTabMb === "ve-may-bay"
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
            <span
              className="px-1 mt-2 text-sm font-medium"
              data-translate="true"
            >
              Vé máy bay
            </span>
          </div>
          <div
            onClick={() => setActiveTabMb("hotel")}
            className={`rounded-2xl text-center h-[104px] block content-center ${
              activeTabMb === "hotel"
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
            <span
              className="px-1 mt-2 text-sm font-medium"
              data-translate="true"
            >
              Khách sạn
            </span>
          </div>
          <div
            onClick={() => setActiveTabMb("insurance")}
            className={`rounded-2xl text-center h-[104px] block content-center ${
              activeTabMb === "insurance"
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
            <span className="text-sm mt-2 font-medium" data-translate="true">
              Bảo hiểm
            </span>
          </div>
          <div
            onClick={() => setActiveTabMb("amusement-ticket")}
            className={`rounded-2xl text-center h-[104px] block content-center ${
              activeTabMb === "amusement-ticket"
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
            <span
              className="px-1 mt-2 text-sm font-medium"
              data-translate="true"
            >
              Vé vui chơi
            </span>
          </div>
        </div>
        {/* <div className="grid grid-cols-4 gap-2 my-4 px-1">
          <div
            onClick={() => setActiveTabMb("visa")}
            className={`rounded-2xl text-center h-[104px] block content-center ${
              activeTabMb === "visa"
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
            <span className="text-sm mt-2 font-medium" data-translate="true">
              Visa
            </span>
          </div>
          <div
            onClick={() => setActiveTabMb("tour")}
            className={`rounded-2xl text-center h-[104px] block content-center ${
              activeTabMb === "tour"
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
            <span
              className="px-1 mt-2 text-sm font-medium"
              data-translate="true"
            >
              Tour
            </span>
          </div>
          <div
            onClick={() => setActiveTabMb("dinh-cu")}
            className={`rounded-2xl text-center h-[104px] block content-center ${
              activeTabMb === "dinh-cu"
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
            <span
              className="px-1 mt-2 text-sm font-medium"
              data-translate="true"
            >
              Định cư
            </span>
          </div>
          <div
            onClick={() => setActiveTabMb("combo")}
            className={`rounded-2xl text-center h-[104px] block content-center ${
              activeTabMb === "combo"
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
            <span className="text-sm mt-2 font-medium" data-translate="true">
              Combo
            </span>
          </div>
        </div> */}
        {/* Tabs Fly */}
        <div className="mx-2 h-fit pt-6 pb-4 bg-white rounded-2xl shadow-lg relative">
          {/* Tab Fly */}
          <div
            className={`px-3 ${
              activeTabMb === "ve-may-bay" ? "block" : "hidden"
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
            className={`px-3 ${
              activeTabMb === "insurance" ? "block" : "hidden"
            }`}
          >
            <SearchFormInsurance />
          </div>

          {/* Tab Ticket */}
          <div
            className={`px-3 ${
              activeTabMb === "amusement-ticket" ? "block" : "hidden"
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
