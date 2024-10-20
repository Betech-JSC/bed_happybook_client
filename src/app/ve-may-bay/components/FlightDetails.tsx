import Image from "next/image";
import Link from "next/link";
import React from "react";

const FlightDetails: React.FC = () => {
  return (
    <div className="grid grid-cols-8 items-center justify-between bg-white p-6 rounded-lg mt-4 relative">
      <div className="col-span-2 border-r border-gray-200">
        <div className="flex items-center gap-4 mb-3">
          <Image
            src="/airline/vietjet.svg"
            width={48}
            height={48}
            alt="Vietjet"
            className="w-12 h-12"
          />
          <div>
            <h3 className="text-18 font-semibold mb-1">Vietjet Air</h3>
            <p className="text-sm text-gray-500">VJ168</p>
          </div>
        </div>
        <Link
          href="#"
          className="text-blue-700 border-b border-blue-700 font-normal"
        >
          Xem chi tiết
        </Link>
      </div>

      <div className="col-span-4 text-center flex justify-between">
        <div className="flex items-center justify-between gap-4 w-full px-6">
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold">6:40</span>
            <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm">
              SGN
            </span>
          </div>
          <Image
            src="/icon/fa-solid_plane.svg"
            width={20}
            height={20}
            alt="Icon"
            className="w-5 h-5"
          />
          <div className="flex flex-col items-center w-full max-w-md">
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
            className="w-5 h-5"
          />
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold">8:50</span>
            <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm">
              HAN
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center absolute right-[24%] h-fit">
        <div className="w-11 h-11 bg-gray-100 rounded-full"></div>
        <div className="relative h-fit w-px my-2 overflow-hidden">
          <div className="h-20 w-1 bg-gradient-to-b from-[#4E6EB3] to-[#4E6EB3] via-transparent bg-[length:2px_16px] bg-repeat-y"></div>
        </div>
        <div className="w-11 h-11 bg-gray-100 rounded-full"></div>
      </div>
      <div className="col-span-2 text-right px-8">
        <p className="text-primary text-18 font-semibold">1,436,600 vnđ</p>
        <button className=" mt-3 w-full bg-blue-600 border text-white  py-2 rounded-lg hover:text-primary duration-300">
          Chọn
        </button>
      </div>
    </div>
  );
};

export default FlightDetails;
