"use client";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SearchFlight from "@/app/ve-may-bay/components/Search";
import { SearchFilghtProps } from "@/types/flight";

export default function Search({ airportsData }: SearchFilghtProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const handleSearchHotel = () => {
    router.push(`/khach-san/tim-kiem`);
  };
  return (
    <div className="relative z-[1] hidden lg:block">
      <div className="absolute inset-0">
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
        className="absolute w-full h-full"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
        }}
      ></div>
      <div className="lg:h-[694px] lg:px-[50px] xl:px-[80px] sm:px-3 content-center pt-[132px] max__screen">
        <h3 className="text-2xl text-white font-bold text-center mb-12 relative">
          Bắt đầu hành trình với HappyBook
        </h3>
        <div className="pt-11 p-6 mx-auto  bg-white rounded-lg shadow-lg relative">
          <div className="w-[600px] grid grid-cols-4 gap-2 mb-4 absolute top-[-12%] left-[50%] translate-x-[-50%] bg-[#000000] py-2 px-3 rounded-3xl">
            <button
              className={`flex lg:h-11 items-center text-white py-1 px-3 rounded-3xl focus:outline-none ${
                activeTab === 0 ? "bg-[#1570EF]" : ""
              }`}
              onClick={() => setActiveTab(0)}
            >
              <Image
                src="/icon/AirplaneTilt.svg"
                alt="Phone icon"
                width={18}
                height={18}
                style={{ width: 18, height: 18 }}
              ></Image>
              <span className="ml-2"> Vé máy bay</span>
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`flex lg:h-11 items-center text-white py-1 px-3 rounded-3xl focus:outline-none ${
                activeTab === 1 ? "bg-[#1570EF]" : ""
              }`}
            >
              <Image
                src="/icon/Buildings.svg"
                alt="Phone icon"
                width={18}
                height={18}
                style={{ width: 18, height: 18 }}
              ></Image>
              <span className="ml-2">Khách sạn</span>
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`flex lg:h-11 items-center text-white py-1 px-3 rounded-3xl focus:outline-none ${
                activeTab === 2 ? "bg-[#1570EF]" : ""
              }`}
            >
              <Image
                src="/icon/Umbrella.svg"
                alt="Phone icon"
                width={18}
                height={18}
              ></Image>
              <span className="ml-2">Bảo hiểm</span>
            </button>
            <button
              onClick={() => setActiveTab(3)}
              className={`flex lg:h-11 items-center text-white py-1 px-3 rounded-3xl focus:outline-none ${
                activeTab === 3 ? "bg-[#1570EF]" : ""
              }`}
            >
              <Image
                src="/icon/Ticket.svg"
                alt="Phone icon"
                width={18}
                height={18}
              ></Image>
              <span className="ml-2">Vé vui chơi</span>
            </button>
          </div>
          {/* Tabs 1 */}
          {activeTab === 0 && (
            <div className="mt-2">
              <Suspense>
                <SearchFlight airportsData={airportsData} />
              </Suspense>
            </div>
          )}
          {/* Tabs 2 */}
          {activeTab === 1 && (
            <div className="mt-10">
              <div className="flex lg:space-x-1 xl:space-x-2">
                <div className="w-[40%]">
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
                <div className="w-[22.5%]">
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

                <div className="w-[20%]">
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

                <div className="w-[15%]" onClick={handleSearchHotel}>
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
                    <button className="ml-2 inline-block h-12 text-white rounded-lg focus:outline-none">
                      Tìm kiếm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Tabs 3 */}
          {activeTab === 2 && (
            <div>
              <div className="flex space-x-12 mb-4">
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

              <div className="flex lg:space-x-1 xl:space-x-2">
                <div className="w-[20%]">
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

                <div className="w-[20%]">
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

                <div className="w-[22.5%]">
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

                <div className="w-[20%]">
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
                    <button className="ml-2 inline-block h-12 text-white rounded-lg focus:outline-none">
                      Tra cứu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Tabs 3 */}
          {activeTab === 3 && (
            <div>
              <div className="flex space-x-12 mb-3">
                <label className="flex items-center space-x-2">
                  <span className="text-[18px] font-semibold text-black">
                    Tìm vé vui chơi
                  </span>
                </label>
              </div>

              <div className="flex lg:space-x-1 xl:space-x-2">
                <div className="w-[40%]">
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

                <div className="w-[40%]">
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

                <div className="w-[16%]">
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
                    <button className="ml-2 inline-block h-12 text-white rounded-lg focus:outline-none">
                      Tìm kiếm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
