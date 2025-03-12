"use client";
import { Fragment, Suspense, useEffect, useState } from "react";
import SearchFlight from "@/app/ve-may-bay/components/Search";
import Image from "next/image";
import { SearchFilghtProps } from "@/types/flight";
import SearchHotel from "@/app/khach-san/components/Search";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function SearchMobile({ airportsData, locationsData }: any) {
  const [activeTabMb, setActiveTabMb] = useState(0);
  const router = useRouter();
  const [querySeach, setQuerySeach] = useState<string>();
  const [locationSelected, setLocationSelected] = useState<any>(null);
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
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
            onClick={() => setActiveTabMb(0)}
            className={`rounded-2xl text-center h-[104px] block content-center ${
              activeTabMb === 0
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
            onClick={() => setActiveTabMb(1)}
            className={`rounded-2xl text-center h-[104px] block content-center ${
              activeTabMb === 1
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
            onClick={() => setActiveTabMb(2)}
            className={`rounded-2xl text-center h-[104px] block content-center ${
              activeTabMb === 2
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
            onClick={() => setActiveTabMb(3)}
            className={`rounded-2xl text-center h-[104px] block content-center ${
              activeTabMb === 3
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
        {/* Tabs Fly */}
        <div className="mx-2 h-fit pt-6 pb-4 bg-white rounded-2xl shadow-lg relative">
          {/* Tab Fly */}
          <div className={`px-3 ${activeTabMb === 0 ? "block" : "hidden"}`}>
            <Suspense>
              <SearchFlight airportsData={airportsData} />
            </Suspense>
          </div>

          {/* Tabs Hotel */}
          <div className={`px-3 ${activeTabMb === 1 ? "block" : "hidden"}`}>
            <SearchHotel />
          </div>

          {/* Tab */}
          <div className={`px-3 ${activeTabMb === 2 ? "block" : "hidden"}`}>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-2">
                <input type="radio" name="trip" className="form-radio" />
                <span className="text-black" data-translate="true">
                  Du lịch nội địa
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="trip" className="form-radio" />
                <span className="text-black" data-translate="true">
                  Du lịch quốc tế
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="trip" className="form-radio" />
                <span className="text-black" data-translate="true">
                  Nhập cảnh
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="trip" className="form-radio" />
                <span className="text-black" data-translate="true">
                  Trễ chuyến bay
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 mt-6">
              <div className="mb-2">
                <label
                  className="block text-gray-700 mb-1"
                  data-translate="true"
                >
                  Từ
                </label>
                <div className="flex h-12 items-center border rounded-lg px-2">
                  <Image
                    src="/icon/place.svg"
                    alt="Phone icon"
                    className="h-10"
                    width={18}
                    height={18}
                  ></Image>
                  <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
                    <option data-translate="true">TP.Hồ Chí Minh</option>
                  </select>
                </div>
              </div>

              <div className="mb-2">
                <label
                  className="block text-gray-700 mb-1"
                  data-translate="true"
                >
                  Đến
                </label>
                <div className="flex h-12 items-center border rounded-lg px-2">
                  <Image
                    src="/icon/place.svg"
                    alt="Phone icon"
                    className="h-10"
                    width={18}
                    height={18}
                  />
                  <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
                    <option data-translate="true">Hà Nội</option>
                  </select>
                </div>
              </div>

              <div className="mb-2">
                <label
                  className="block text-gray-700 mb-1"
                  data-translate="true"
                >
                  Ngày đi
                </label>
                <div className="flex justify-between h-12 items-center border rounded-lg px-2 text-black">
                  <div className="flex justify-between items-center	">
                    <Image
                      src="/icon/calendar.svg"
                      alt="Phone icon"
                      className="h-10"
                      width={18}
                      height={18}
                    ></Image>
                    <span>14/08/2024</span>
                  </div>
                  <div>
                    <span> 22/08/2024</span>
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <label
                  className="block text-gray-700 mb-1"
                  data-translate="true"
                >
                  Số lượng khách
                </label>
                <div className="flex items-center border rounded-lg px-2 h-12">
                  <Image
                    src="/icon/user-circle.svg"
                    alt="Phone icon"
                    className="h-10"
                    width={18}
                    height={18}
                  ></Image>
                  <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
                    <option data-translate="true"> 1 khách</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="w-full px-3">
              <label className="block text-gray-700 mb-1 h-6"></label>
              <button className="w-full items-center justify-center border rounded-lg px-2 h-12 bg-[#F27145] ">
                <Image
                  src="/icon/search.svg"
                  alt="Phone icon"
                  className="h-10 inline-block"
                  width={18}
                  height={18}
                  style={{ width: 20, height: 20 }}
                ></Image>
                <span
                  className="ml-2 h-12 text-white rounded-lg  focus:outline-none"
                  data-translate="true"
                >
                  Tìm kiếm
                </span>
              </button>
            </div>
          </div>

          {/* Tab Ticket */}
          <div className={`px-3 ${activeTabMb === 3 ? "block" : "hidden"}`}>
            <div className="flex space-x-12 mb-4">
              <label className="flex items-center space-x-2">
                <span
                  className="text-[18px] font-semibold text-black"
                  data-translate="true"
                >
                  Tìm vé vui chơi
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1">
              <div className="mb-2">
                <label
                  className="block text-gray-700 mb-1"
                  data-translate="true"
                >
                  Nơi đi
                </label>
                <div className="flex h-12 items-center border rounded-lg px-2">
                  <Image
                    src="/icon/place.svg"
                    alt="Phone icon"
                    className="h-10"
                    width={18}
                    height={18}
                  ></Image>
                  {mounted && (
                    <Select
                      options={locationsData}
                      placeholder={`${
                        language === "en"
                          ? "Select destination"
                          : "Chọn điểm đến"
                      }`}
                      className="w-full"
                      styles={{
                        control: (base) => ({
                          ...base,
                          border: "none",
                          boxShadow: "none",
                          cursor: "pointer",
                        }),
                      }}
                      onChange={(selectedOption) =>
                        setLocationSelected(selectedOption)
                      }
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="w-full px-3">
              <label className="block text-gray-700 mb-1 h-6"></label>
              <div
                onClick={() => {
                  router.push(
                    `/ve-vui-choi?location=${
                      locationSelected ? locationSelected.label : ""
                    }`
                  );
                }}
                className="w-full items-center justify-center border rounded-lg px-2 h-12 bg-[#F27145] text-center"
              >
                <Image
                  src="/icon/search.svg"
                  alt="Phone icon"
                  className="h-10 inline-block"
                  width={18}
                  height={18}
                  style={{ width: 20, height: 20 }}
                ></Image>
                <button
                  type="button"
                  className="ml-2 h-12 text-white rounded-lg  focus:outline-none"
                  data-translate="true"
                  onClick={() => {
                    router.push(
                      `/ve-vui-choi?location=${
                        locationSelected ? locationSelected.label : ""
                      }`
                    );
                  }}
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
