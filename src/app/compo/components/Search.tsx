"use client";
import { Fragment, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Search() {
  const router = useRouter();
  const handleSearch = () => {
    router.push(`/compo/tim-kiem`);
  };
  return (
    <Fragment>
      <div className="base__content h-full relative place-content-center">
        <div className="bg-white rounded-2xl p-3 md:p-6 w-full lg:w-[850px]">
          <h3 className="text-18 font-semibold">Tìm Combo du lịch</h3>
          <div className="mt-4 md:mt-6 h-fit md:h-20 flex flex-col md:flex-row md:space-x-2 space-y-3 items-end justify-between">
            <div className="relative w-full md:w-1/4">
              <div className="absolute left-4 top-1/2 translate-y-1/4">
                <Image
                  src="/icon/place.svg"
                  alt="Icon"
                  className="h-10"
                  width={20}
                  height={20}
                  style={{ width: 20, height: 20 }}
                ></Image>
              </div>
              <label htmlFor="from" className="font-medium block">
                Khởi hành từ
              </label>
              <input
                type="text"
                id="from"
                placeholder="Hồ Chí Minh"
                className={`mt-2 w-full rounded-lg p-2 border border-gray-300 h-12 indent-10 outline-none`}
              />
            </div>
            <div className="w-full md:w-1/4 relative">
              <div className="absolute left-4 top-1/2 translate-y-1/4">
                <Image
                  src="/icon/place.svg"
                  alt="Icon"
                  className="h-10"
                  width={20}
                  height={20}
                  style={{ width: 20, height: 20 }}
                ></Image>
              </div>
              <label htmlFor="to" className="font-medium block">
                Điểm đến
              </label>
              <input
                type="text"
                id="to"
                placeholder="Điểm đến"
                className={`mt-2 w-full rounded-lg p-2 border border-gray-300 h-12 indent-10 outline-none`}
              />
            </div>
            <div className="w-full md:w-[30%] relative">
              <div className="absolute left-4 top-1/2 translate-y-1/4">
                <Image
                  src="/icon/calendar.svg"
                  alt="Icon"
                  className="h-10"
                  width={20}
                  height={20}
                  style={{ width: 20, height: 20 }}
                ></Image>
              </div>
              <label htmlFor="typeVisa" className="font-medium block">
                Ngày khởi hành
              </label>
              <input
                type="text"
                id="to"
                placeholder="14/08/2024"
                className={`mt-2 w-full rounded-lg p-2 border border-gray-300 h-12 indent-10 outline-none`}
              />
            </div>
            <div className="w-full md:w-1/5 text-center border rounded-lg px-2 h-12 bg-primary hover:bg-orange-600 duration-300">
              <button
                className="ml-2 inline-flex items-center space-x-2 h-12 text-white"
                onClick={handleSearch}
              >
                <Image
                  src="/icon/search.svg"
                  alt="Search icon"
                  className="h-10 mr-2"
                  width={20}
                  height={20}
                  style={{ width: 20, height: 20 }}
                ></Image>
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
