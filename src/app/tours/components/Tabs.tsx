"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { formatMoney } from "@/lib/formatters";

export default function Tabs({ detail }: any) {
  const [activeTab, setActiveTab] = useState(0);
  const [currentTabWidth, setCurrentTabWidth] = useState(0);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(0);
  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      setCurrentTabWidth(tabRefs.current[activeTab].offsetWidth);
    }
  }, [activeTab]);

  return (
    <div className="w-full mt-6">
      <div
        className="flex flex-wrap md:justify-between mb-8 bg-white p-3 rounded-xl relative"
        ref={tabContainerRef}
      >
        {[
          "Tổng quan",
          "Lịch trình",
          "Bảng giá",
          "Quy định dịch vụ",
          "Đánh giá",
        ].map((tab, index) => (
          <button
            key={index}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            className={`px-3 md:px-5 py-[10px] duration-300 font-semibold text__default_hover  ${
              activeTab === index ? "text-primary" : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
        <div
          className="hidden md:block absolute bottom-3 left-0 h-0.5 bg-primary transition-transform duration-300"
          style={{
            width: `${currentTabWidth}px`,
            transform: `translateX(${tabRefs.current[activeTab]?.offsetLeft}px)`,
          }}
        ></div>
      </div>
      <div className="mt-4 transition-all duration-300">
        <div
          className={`bg-white rounded-2xl p-6 ${
            activeTab === 0 ? "block" : "hidden"
          }`}
        >
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Tổng quan
          </h2>
          <div className="mt-4">
            <p className="text-base font-semibold">
              Nội dung đang cập nhật....
            </p>
          </div>
        </div>

        <div
          className={`bg-white rounded-2xl p-6  ${
            activeTab === 1 ? "block" : "hidden"
          } `}
        >
          <h2 className="pl-2 border-l-4 mb-5 border-[#F27145] text-22 font-bold">
            Lịch trình
          </h2>
          {detail.schedule.length > 0 ? (
            detail.schedule.map((schedule: any, key: number) => (
              <div className={`border-l border-l-gray-300 pb-3 `} key={key}>
                <div
                  className="cursor-pointer"
                  onClick={() => toggleDropdown(key)}
                >
                  <div className="flex space-x-2 justify-between items-start">
                    <div className="relative bottom-1">
                      <span
                        className={`absolute left-[-8px] top-1 bg-white  inline-block w-4 h-4 rounded-full border-2 ${
                          openDropdown === key
                            ? "border-[#F27145]"
                            : "border-[#4E6EB3]"
                        }`}
                      ></span>
                      <div
                        className={`ml-5 font-18 font-semibold text-gray-900`}
                      >
                        {schedule.title}
                      </div>
                    </div>
                    <button
                      className={`duration-300 ${
                        openDropdown === key ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="#175CD3"
                          strokeWidth="1.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div
                  className={`mt-3 ml-5 transition-[max-height] ease-in-out duration-500 overflow-hidden 
                      border-b border-b-gray-200 leading-6
                      ${
                        openDropdown === key ? "max-h-[5000px] pb-4" : "max-h-0"
                      }`}
                  dangerouslySetInnerHTML={{
                    __html: schedule.content,
                  }}
                ></div>
              </div>
            ))
          ) : (
            <div className="mt-4">
              <p className="text-base font-semibold">
                Nội dung đang cập nhật....
              </p>
            </div>
          )}
        </div>

        <div
          className={`bg-white rounded-2xl p-6  ${
            activeTab === 2 ? "block" : "hidden"
          }`}
        >
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Bảng giá
          </h2>
          <div className="mt-4">
            {detail.prices.length > 0 ? (
              <table className="w-full text-left align-middle">
                <tr className="bg-[#FEF8F5] text-primary">
                  <th className="py-4 px-2 border border-gray-200">
                    Ngày khởi hành
                  </th>
                  <th className="py-4 px-2  border border-gray-200">Mã Tour</th>
                  <th className="py-4 px-2  border border-gray-200">
                    Giá người lớn
                  </th>
                  <th className="py-4 px-2  border border-gray-200">
                    Giá trẻ em
                  </th>
                  <th className="py-4 px-2  border border-gray-200">
                    Giá em bé
                  </th>
                </tr>
                {detail.prices.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="w-1/5 py-3 font-me px-[10px] border-[0.5px] border-gray-200">
                      {item.date ?? ""}
                    </td>
                    <td className="w-1/5 py-3 font-me px-[10px] border-[0.5px] border-gray-200">
                      {item.code ?? ""}
                    </td>
                    <td className="w-1/5 py-3 font-me px-[10px] border-[0.5px] border-gray-200">
                      {formatMoney(item.price_tour)}đ
                    </td>
                    <td className="w-1/5 py-3 font-me px-[10px] border-[0.5px] border-gray-200">
                      {formatMoney(item.price_child)}đ
                    </td>
                    <td className="w-1/5 py-3 font-me px-[10px] border-[0.5px] border-gray-200">
                      {formatMoney(item.price_baby)}đ
                    </td>
                  </tr>
                ))}
              </table>
            ) : (
              <p className="text-base font-semibold">
                Nội dung đang cập nhật....
              </p>
            )}
          </div>
        </div>

        <div
          className={`bg-white rounded-2xl p-6  ${
            activeTab === 3 ? "block" : "hidden"
          }`}
        >
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Quy định dịch vụ
          </h2>
          <div className="mt-4">
            <p className="text-base font-semibold">
              Nội dung đang cập nhật....
            </p>
          </div>
        </div>
        <div
          className={`bg-white rounded-2xl p-6  ${
            activeTab === 4 ? "block" : "hidden"
          }`}
        >
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Đánh giá
          </h2>
          <div className="mt-4 flex flex-col md:flex-row md:space-x-6 bg-gray-50 p-6 rounded-xl items-center">
            <div className="w-full md:w-[30%] text-center px-9 flex flex-col mb-5 md:mb-0">
              <p className="text-primary font-semibold mt-1">Xuất sắc</p>
              <div className="w-[106px] mt-1 h-9 mx-auto rounded-2xl rounded-tr bg-primary text-white font-semibold flex items-center justify-center">
                <p className="text-[26px] leading-[39px]">9.8</p>
                <p className="text-xl opacity-50">/10</p>
              </div>
              <p className="text-gray-500 mt-1">234 đánh giá</p>
              <div className="mt-3 bg-blue-600 text__default_hover p-[10px] text-white rounded-lg inline-flex w-full items-center">
                <button className="mx-auto text-sm font-medium">
                  Gửi đánh giá
                </button>
              </div>
            </div>
            <div className="w-full md:w-[70%]">
              <div className="grid grid-grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p>Hướng dẫn viên</p>
                  <div className="flex space-x-2 items-center">
                    <div className="w-full bg-gray-200 rounded-3xl">
                      <p
                        className="w-11/12 h-3 rounded-3xl"
                        style={{
                          background:
                            "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                        }}
                      ></p>
                    </div>
                    <p>9.8</p>
                  </div>
                </div>
                <div>
                  <p>Lộ trình</p>
                  <div className="flex space-x-2 items-center">
                    <div className="w-full bg-gray-200 rounded-3xl">
                      <p
                        className="w-11/12 h-3 rounded-3xl"
                        style={{
                          background:
                            "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                        }}
                      ></p>
                    </div>
                    <p>9.8</p>
                  </div>
                </div>
                <div>
                  <p>Phương tiện đưa đón</p>
                  <div className="flex space-x-2 items-center">
                    <div className="w-full bg-gray-200 rounded-3xl">
                      <p
                        className="w-11/12 h-3 rounded-3xl"
                        style={{
                          background:
                            "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                        }}
                      ></p>
                    </div>
                    <p>9.8</p>
                  </div>
                </div>
                <div>
                  <p>Giá cả</p>
                  <div className="flex space-x-2 items-center">
                    <div className="w-full bg-gray-200 rounded-3xl">
                      <p
                        className="w-11/12 h-3 rounded-3xl"
                        style={{
                          background:
                            "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                        }}
                      ></p>
                    </div>
                    <p>9.8</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {Array.from({ length: 2 }, (item, index) => (
            <div className="mt-5" key={index}>
              <div className="flex space-x-4">
                <div className="w-11 h-11 rounded-full bg-gray-50 place-content-center text-center">
                  <p className="">OR</p>
                </div>
                <div>
                  <div className="flex space-x-4 items-center">
                    <p className="text-sm md:text-18 font-semibold">Natasia</p>
                    <p className="w-4 h-1 bg-gray-300"></p>
                    <div className="text-sm md:text-base flex space-x-1 md:space-x-2 bg-gray-100 rounded-sm p-2 items-center">
                      <p className="text-sm md:text-base text-blue-900 font-semibold">
                        9.8{" "}
                        <span className="font-semibold opacity-50 text-black">
                          /10
                        </span>
                      </p>
                      <p className="text-sm text-blue-900 font-semibold">
                        Xuất sắc
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">19/04/2024</p>
                </div>
              </div>
              <div className="text-sm md:text-base mt-3">
                <p>
                  Danny, hướng dẫn viên du lịch của chúng tôi, rất vui tính. Anh
                  ấy chụp ảnh cho chúng tôi ở mọi địa điểm đẹp trong chuyến đi.
                  Chuyến đi của chúng tôi rất vui khi có anh ấy. Chiếc xe tải
                  của chúng tôi hơi nóng. Nhưng chúng tôi vẫn thích chuyến đi
                  của mình với Danny.
                </p>
              </div>
              <div className="mt-3">
                <Swiper
                  spaceBetween={10}
                  slidesPerView={2}
                  breakpoints={{
                    1024: {
                      slidesPerView: 6,
                      spaceBetween: 10,
                      loop: true,
                    },
                    768: {
                      slidesPerView: 5,
                      spaceBetween: 10,
                      loop: true,
                    },
                    640: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                      loop: true,
                    },
                  }}
                  className="main-swiper rounded-lg"
                >
                  {Array.from({ length: 6 }, (item, index) => (
                    <SwiperSlide
                      key={index}
                      className="overflow-hidden rounded-lg "
                    >
                      <Image
                        className="hover:scale-110 ease-in duration-300 w-full h-full object-cover"
                        src={`/tour/detail/review/${index + 1}.png`}
                        alt="Image"
                        width={200}
                        height={200}
                        quality={80}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
