"use client";
import { Fragment, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Search() {
  const router = useRouter();
  const handleSearch = () => {
    router.push(`/khach-san/tim-kiem`);
  };
  return (
    <Fragment>
      <div className="flex flex-wrap lg:flex-nowrap lg:space-x-1 xl:space-x-2 space-y-2 lg:space-y-0">
        <div className="w-full flex flex-wrap lg:flex-nowrap space-y-2 lg:space-y-0 lg:space-x-2 relative">
          <div className="w-full lg:w-1/2">
            <label className="block text-gray-700 mb-1">
              Thành phố, địa điểm hoặc tên khách sạn:
            </label>
            <div className="flex h-12 items-center border rounded-lg px-2">
              <Image
                src="/icon/place.svg"
                alt="Icon"
                className="h-10"
                width={18}
                height={18}
              ></Image>
              <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
                <option>TP.Hồ Chí Minh</option>
              </select>
            </div>
          </div>
          <div className="w-full lg:w-[22.5%]">
            <label className="block text-gray-700 mb-1">
              Từ ngày - đến ngày
            </label>
            <div className="flex justify-between h-12 space-x-2 items-center border rounded-lg px-2 text-black">
              <div className="flex items-center	w-full">
                <Image
                  src="/icon/calendar.svg"
                  alt="Icon"
                  className="h-10"
                  width={18}
                  height={18}
                ></Image>
                <span>14/08/2024</span>
              </div>
              <div className="block md:hidden border-t border-black w-1/2"></div>
              <div>
                <span> 22/08/2024</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[20%]">
            <label className="block text-gray-700 mb-1">Khách</label>
            <div className="flex items-center border rounded-lg px-2 h-12">
              <Image
                src="/icon/user-circle.svg"
                alt="Icon"
                className="h-10"
                width={18}
                height={18}
              ></Image>
              <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
                <option>1 người lớn</option>
              </select>
            </div>
          </div>

          <div className="w-full lg:w-[15%]" onClick={handleSearch}>
            <label className="block text-gray-700 mb-1 h-6"></label>
            <div className="text-center cursor-pointer w-full items-center border rounded-lg px-2 h-12 bg-orange-500 hover:bg-orange-600">
              <Image
                src="/icon/search.svg"
                alt="Icon"
                className="h-10 inline-block"
                width={18}
                height={18}
                style={{ width: 18, height: 18 }}
              />
              <button className="ml-2 inline-block h-12 text-white rounded-lg focus:outline-none">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
