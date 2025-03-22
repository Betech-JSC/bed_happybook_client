"use client";
import Image from "next/image";

export default function SearchFormInsurance() {
  return (
    <div className="flex lg:space-x-1 xl:space-x-2">
      <div className="w-[42.5%]">
        <label className="block text-gray-700 mb-1" data-translate="true">
          Bảo hiểm
        </label>
        <div className="flex h-12 items-center border rounded-lg px-2">
          <Image
            src="/icon/umbrella-blue.svg"
            alt="Icon"
            width={18}
            height={18}
          ></Image>
          <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
            <option data-translate="true">Gói ABCD</option>
          </select>
        </div>
      </div>

      <div className="w-[42.5%]">
        <label className="block text-gray-700 mb-1" data-translate="true">
          Ngày đi - ngày về
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
            <Image
              src="/icon/line.png"
              alt="Icon"
              className="h-[1px] max-w-[280px]"
              width={280}
              height={1}
            ></Image>
          </div>
          <div>
            <span> 22/08/2024</span>
          </div>
        </div>
      </div>

      <div className="w-[15%]">
        <label className="block text-gray-700 mb-1 h-6"></label>
        <div className="text-center cursor-pointer w-full items-center border rounded-lg px-2 h-12 bg-orange-500 hover:bg-orange-600  ">
          <Image
            src="/icon/search.svg"
            alt="Phone icon"
            className="h-10 inline-block"
            width={18}
            height={18}
            style={{ width: 18, height: 18 }}
          ></Image>
          <button
            className="ml-2 inline-block h-12 text-white rounded-lg focus:outline-none"
            data-translate="true"
          >
            Tra cứu
          </button>
        </div>
      </div>
    </div>
  );
}
