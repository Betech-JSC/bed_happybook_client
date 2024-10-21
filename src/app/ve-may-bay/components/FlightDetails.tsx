"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import PassengerTable from "./PassengerTable";
interface Flight {
  id: number;
  checkout?: boolean;
  firstItem?: number;
  checkOut?: boolean;
}
interface Props {
  flight: Flight;
}
const FlightDetails = ({ flight }: Props) => {
  const firstItem = flight.firstItem ? flight.id : null;
  const [showDetails, setShowDetails] = useState<number | null>(firstItem);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | string>(0);
  const [hasHeight, setHasHeight] = useState<boolean>(false);

  const toggleShowDetails = useCallback(
    (id: number) => {
      if (contentRef.current) {
        setHeight(showDetails ? 0 : contentRef.current.scrollHeight + 60);
        setHasHeight(true);
      }
      setShowDetails(showDetails === id ? null : id);
    },
    [showDetails]
  );
  useEffect(() => {
    if (firstItem && contentRef.current) {
      setHeight(contentRef.current.scrollHeight + 60);
      setHasHeight(true);
    }
  }, [firstItem]);

  return (
    <div className="h-fit">
      <div className="grid grid-cols-8 items-start md:items-center justify-between bg-white p-3 md:p-6 rounded-lg mt-4 relative">
        <div className="col-span-2 border-r border-gray-200">
          <div className="flex flex-col md:flex-row item-start md:items-center gap-2 md:gap-4 mb-3">
            <Image
              src="/airline/vietjet.svg"
              width={48}
              height={48}
              alt="Vietjet"
              className="w-8 h-7 md:w-12 md:h-12"
            />
            <div>
              <h3 className="text-sm md:text-18 font-semibold mb-1">
                Vietjet Air
              </h3>
              <p className="text-sm text-gray-500">VJ168</p>
            </div>
          </div>
          <button
            className="hidden md:inline-block text-blue-700 border-b border-blue-700 font-normal"
            onClick={() => toggleShowDetails(flight.id)}
          >
            Xem chi tiết
          </button>
        </div>

        <div className="col-span-6 md:col-span-4 text-center flex justify-between">
          <div className="flex items-center justify-between gap-4 w-full pl-3 md:px-6">
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold">6:40</span>
              <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm">
                SGN
              </span>
            </div>

            <div className="flex items-center w-full space-x-3">
              <Image
                src="/icon/fa-solid_plane.svg"
                width={20}
                height={20}
                alt="Icon"
                className="w-5 h-5 hidden md:block"
              />
              <div className="flex flex-col items-center w-full">
                <span className="text-sm text-gray-700 mb-2">2h10m</span>
                <div className="relative flex items-center w-full">
                  <div className="flex-grow h-px bg-gray-700"></div>
                  <div className="flex-shrink-0 w-4 h-4 bg-white border-2 border-gray-400 rounded-full absolute left-1/2 -translate-x-1/2"></div>
                </div>
                <span className="text-sm text-gray-700 mt-2">Bay thẳng</span>
              </div>
              <Image
                src="/icon/map-pinned.svg"
                width={20}
                height={20}
                alt="Icon"
                className="w-5 h-5 hidden md:block"
              />
            </div>

            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold">8:50</span>
              <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm">
                HAN
              </span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center absolute right-[24%] h-fit">
          <div className="w-11 h-11 bg-gray-100 rounded-full"></div>
          <div className="relative h-fit w-px my-2 overflow-hidden">
            <div className="h-20 w-1 bg-gradient-to-b from-[#4E6EB3] to-[#4E6EB3] via-transparent bg-[length:2px_16px] bg-repeat-y"></div>
          </div>
          <div className="w-11 h-11 bg-gray-100 rounded-full"></div>
        </div>
        <div className="col-span-8 w-full md:col-span-2 text-center md:text-right md:pl-8 xl:pr-8">
          <div className="flex justify-between mt-3 md:mt-0">
            <button
              className="inline-block md:hidden text-blue-700 border-b border-blue-700 font-normal"
              onClick={() => toggleShowDetails(flight.id)}
            >
              Xem chi tiết
            </button>
            <p className="text-primary text-18 font-semibold text-right">
              1,436,600 vnđ
            </p>
          </div>
          <Link
            href="/ve-may-bay/chi-tiet"
            className="block text-center mt-5 md:mt-3 w-full bg-blue-600 border text-white  py-2 rounded-lg hover:text-primary duration-300"
          >
            {flight.checkOut === true ? "Thay đổi" : "Chọn"}
          </Link>
        </div>
      </div>
      <div
        ref={contentRef}
        style={{
          maxHeight: showDetails === flight.id ? height : "0px",
        }}
        className={`bg-gray-100 border-2 rounded-2xl relative z-10 transition-[opacity,max-height,transform] ease-out duration-500 overflow-hidden ${
          showDetails === flight.id && hasHeight
            ? `opacity-1 border-blue-500 translate-y-0 mt-4 p-4 `
            : "opacity-0 border-none -translate-y-6 invisible mt-0 pt-0"
        }`}
      >
        <div className="bg-white p-4 rounded-lg">
          <PassengerTable />
        </div>
        <div className="mt-6 rounded-lg p-3 md:p-6 bg-white">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">
            Chi tiết hành trình
          </h2>
          <div className="grid grid-cols-12 items-start gap-6">
            <div className="col-span-12 md:col-span-3 flex flex-col border-r border-gray-200 pr-8">
              <div className="flex gap-4">
                <Image
                  src="/airline/vietjet.svg"
                  width={48}
                  height={48}
                  alt="Logo"
                  className="w-12 h-12"
                />
                <div>
                  <h3 className="text-18 font-semibold mb-1">Vietjet Air</h3>
                  <p className="text-sm text-gray-500">VJ168</p>
                </div>
              </div>
              <p className="text-[#4E6EB3] font-semibold mt-4">Điều kiện vé</p>
              <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                <li>Hành lý xách tay: 7kg</li>
                <li>
                  Thay đổi chuyến bay, ngày bay, chặng bay: thu phí + chênh lệch
                  giá vé nếu có /chặng/lần thay đổi
                </li>
                <li>Thay đổi tên: Không được phép</li>
                <li>Hoàn vé: Không được phép</li>
              </ul>
            </div>
            <div className="col-span-12 md:col-span-9 h-full w-full">
              <div className="flex h-full items-start gap-2">
                <div className="w-4/12 md:w-2/12 flex h-full justify-between flex-col items-end">
                  <div className="text-center">
                    <p className="text-22 font-bold">6:40</p>
                    <p className="text-gray-500">30/08/2024</p>
                  </div>
                  <div className="font-semibold text-center">
                    <Image
                      src="/icon/AirplaneTiltBlue.svg"
                      width={20}
                      height={20}
                      alt="Icon"
                      className="w-5 h-5 mx-auto"
                    />
                    <p className="mt-2 text-22 text-[#4E6EB3]">02h10m</p>
                  </div>
                  <div className="text-center">
                    <p className="text-22 font-bold">6:40</p>
                    <p className="text-gray-500">30/08/2024</p>
                  </div>
                </div>
                <div className="w-1/12 relative h-full py-5 flex flex-col items-center">
                  <div className="w-[6px] h-[6px] bg-blue-700 rounded-full"></div>
                  <div className="w-px h-full bg-blue-700"></div>
                  <div className="w-[6px] h-[6px] bg-blue-700 rounded-full"></div>
                </div>
                <div className="w-7/12 md:w-9/12 flex justify-between space-y-3 md:space-y-0 flex-col h-full">
                  <div>
                    <p className="text-22 font-bold">Hồ Chí Minh (SGN)</p>
                    <p className="text-gray-500 mt-1">Sân bay Tân Sơn Nhất</p>
                  </div>
                  <div
                    className="rounded-lg text-white p-4"
                    style={{
                      background:
                        "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                    }}
                  >
                    <p className="text-sm">Máy bay: 330</p>
                    <p className="text-sm">Chuyến bay: VJ168</p>
                    <p className="text-sm">Hạng: Eco</p>
                  </div>
                  <div>
                    <p className="text-22 font-bold">Hà Nội (HAN)</p>
                    <p className="text-gray-500 mt-1">Sân bay Nội Bài</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
