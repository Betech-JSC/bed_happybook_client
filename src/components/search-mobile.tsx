"use client";
import { useState } from "react";
import Image from "next/image";

export default function SearchMobile() {
  const [activeTabMb, setActiveTabMb] = useState(0);
  return (
    <div className="mt-4 h-[828px]">
      <div className="absolute inset-0 h-[828px]">
        <Image
          priority
          src="/bg-image.png"
          width={500}
          height={584}
          className="object-cover w-full h-full"
          alt="Background"
        />
      </div>
      <div
        className="absolute w-full h-[828px]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
        }}
      ></div>
      <div className="relative z-[1]">
        <h3 className="pt-8 text-xl lg:text-2xl font-bold text-center text-white">
          Bắt đầu hành trình với HappyBook
        </h3>
        {/* Search Bar */}
        <div className="flex items-center px-3 my-4">
          <input
            type="text"
            placeholder="Tìm theo điểm đến, hoạt động"
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
        </div>
        <div className="grid grid-cols-4 gap-2 my-4 px-3">
          <div
            onClick={() => setActiveTabMb(0)}
            className={`rounded-2xl text-center h-[104px] flex flex-col ${
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
            <span className="px-1 mt-2 text-sm font-medium">Vé máy bay</span>
          </div>
          <div
            onClick={() => setActiveTabMb(1)}
            className={`rounded-2xl text-center h-[104px] flex flex-col ${
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
            <span className="px-1 mt-2 text-sm font-medium">Khách sạn</span>
          </div>
          <div
            onClick={() => setActiveTabMb(2)}
            className={`rounded-2xl text-center h-[104px] flex flex-col ${
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
            <span className="text-sm mt-2 font-medium">Bảo hiểm</span>
          </div>
          <div
            onClick={() => setActiveTabMb(3)}
            className={`rounded-2xl text-center h-[104px] flex flex-col ${
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
            <span className="px-1 mt-2 text-sm font-medium">Vé vui chơi</span>
          </div>
        </div>
        {/* Tabs Fly */}
        <div className="mx-3 pt-6 pb-4  h-[530px] bg-white rounded-2xl shadow-lg relative">
          {/* Tab Fly */}
          {activeTabMb === 0 && (
            <div>
              <div className="grid grid-cols-2 gap-2 mb-4 px-4">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="trip" className="form-radio" />
                  <span className="text-black">Một chiều</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="trip" className="form-radio" />
                  <span className="text-black">Khứ hồi</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="cheap-tickets"
                    className="form-checkbox"
                  />
                  <span className="text-black">Tìm vé rẻ</span>
                </label>
              </div>

              <div className="px-4">
                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">Từ</label>
                  <div className="flex h-12 items-center border rounded-lg px-2">
                    <Image
                      src="/icon/AirplaneTakeoff.svg"
                      alt="Phone icon"
                      className="h-10"
                      width={18}
                      height={18}
                    ></Image>
                    <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
                      <option>TP.Hồ Chí Minh</option>
                    </select>
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">Đến</label>
                  <div className="flex h-12 items-center border rounded-lg px-2">
                    <Image
                      src="/icon/AirplaneLanding.svg"
                      alt="Phone icon"
                      className="h-10"
                      width={18}
                      height={18}
                    ></Image>
                    <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
                      <option>Hà Nội</option>
                    </select>
                  </div>
                </div>

                <div className="mb-2">
                  <div>
                    <label className="block text-gray-700 mb-1">Ngày đi</label>
                  </div>
                  <div className="flex justify-evenly h-12 items-center border rounded-lg px-2 text-black">
                    <Image
                      src="/icon/calendar.svg"
                      alt="Phone icon"
                      className="h-10"
                      width={18}
                      height={18}
                    ></Image>
                    <div className="flex justify-between">
                      <span>14/08/2024 - </span>
                      <span> 22/08/2024</span>
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">
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
                    <select className="ml-2 flex-1 focus:outline-none text-black">
                      <option>1 người lớn</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Tabs Hotel */}
          {activeTabMb === 1 && (
            <div className="px-3">
              <div className="grid grid-cols-1">
                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">
                    Thành phố, địa điểm hoặc tên khách sạn:
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
                      <option>TP.Hồ Chí Minh</option>
                    </select>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">
                    Từ ngày - đến ngày
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
                  <label className="block text-gray-700 mb-1">
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
                      <option>2 người 1 phòng</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Tab */}
          {activeTabMb === 2 && (
            <div className="px-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="trip" className="form-radio" />
                  <span className="text-black">Du lịch nội địa</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="trip" className="form-radio" />
                  <span className="text-black">Du lịch quốc tế</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="trip" className="form-radio" />
                  <span className="text-black">Nhập cảnh</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="trip" className="form-radio" />
                  <span className="text-black">Trễ chuyến bay</span>
                </label>
              </div>

              <div className="grid grid-cols-1 mt-6">
                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">Từ</label>
                  <div className="flex h-12 items-center border rounded-lg px-2">
                    <Image
                      src="/icon/place.svg"
                      alt="Phone icon"
                      className="h-10"
                      width={18}
                      height={18}
                    ></Image>
                    <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
                      <option>TP.Hồ Chí Minh</option>
                    </select>
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">Đến</label>
                  <div className="flex h-12 items-center border rounded-lg px-2">
                    <Image
                      src="/icon/place.svg"
                      alt="Phone icon"
                      className="h-10"
                      width={18}
                      height={18}
                    />
                    <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
                      <option>Hà Nội</option>
                    </select>
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">Ngày đi</label>
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
                  <label className="block text-gray-700 mb-1">
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
                      <option>1 khách</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Tab Ticket */}
          {activeTabMb === 3 && (
            <div className="px-3">
              <div className="flex space-x-12 mb-4">
                <label className="flex items-center space-x-2">
                  <span className="text-[18px] font-semibold text-black">
                    Tìm vé vui chơi
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1">
                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">Nơi đi</label>
                  <div className="flex h-12 items-center border rounded-lg px-2">
                    <Image
                      src="/icon/place.svg"
                      alt="Phone icon"
                      className="h-10"
                      width={18}
                      height={18}
                    ></Image>
                    <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
                      <option>TP.Hồ Chí Minh</option>
                    </select>
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-gray-700 mb-1">Ngày đi</label>
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
                  </div>
                </div>
              </div>
            </div>
          )}
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
              <span className="ml-2 h-12 text-white rounded-lg  focus:outline-none">
                Tìm kiếm
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
