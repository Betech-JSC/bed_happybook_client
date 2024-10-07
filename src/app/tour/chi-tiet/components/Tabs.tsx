"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const tabsContent = [
  { title: "Tab 1", content: "Nội dung tab 1" },
  { title: "Tab 2", content: "Nội dung tab 2" },
  { title: "Tab 3", content: "Nội dung tab 3" },
  { title: "Tab 4", content: "Nội dung tab 4" },
  { title: "Tab 5", content: "Nội dung tab 5" },
];
export default function Tabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentTabWidth, setCurrentTabWidth] = useState(0);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
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
        {activeTab === 0 && (
          <div className="bg-white rounded-2xl p-6">
            <h3 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
              Tổng quan
            </h3>
            <p className="mt-4">
              Cùng rời xa những mệt mỏi bộn bề của công việc, nếp sống náo
              nhiệt, nhộn nhịp của chốn thành đô, cùng BestPrice đến tham quan
              khám phá vùng sông nước Mỹ Tho - Cần Thơ - Miền Tây 2N1Đ. Hoà mình
              vào nhịp sống bình dị, chan hoà với những người dân miến khách,
              thật thà, tận hưởng không gian yên bình, thưởng thức những trái
              cây tươi ngon được tận tay hái tại vườn. Còn chần chờ gì nữa mà
              không xách balo lên và đi thôi.
            </p>
            <ul className="mt-4 list-disc pl-5">
              <li>
                Ngắm cảnh tại &quot;tứ linh cồn&quot; Cù lao Long, Lân, Qui,
                Phụng.
              </li>
              <li>Tham quan vẻ đẹp bình dị tại khu du lịch Cồn Phụng.</li>
              <li>Hòa mình vào không khí tấp nập tại Chợ nổi Cái Răng,</li>
              <li>Thử sức làm đặc sản kẹo dừa Bến Tre.</li>
              <li>Trải nghiệm các trò chơi hấp dẫn và thú vị.</li>
            </ul>
            <p className="mt-4">
              <span className="font-bold">Điểm tham quan:</span> Cù lao Thới
              Sơn, Cồn Phụng, Chợ nổi Cái Răng
            </p>
            <p className="mt-4">
              <span className="font-bold">Chủ đề:</span> Văn hóa
            </p>
          </div>
        )}
        {activeTab === 1 && (
          <div className="bg-white rounded-2xl p-6">
            <h3 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
              Lịch trình
            </h3>
            <div
              className="pb-4 mb-6 mt-4 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none border-b border-gray-200 cursor-pointer"
              onClick={() => toggleDropdown(1)}
            >
              <div className="flex space-x-2 justify-between items-center">
                <span className="font-18 font-semibold text-gray-900">
                  Ngày 1: TP. Hồ Chí Minh - Tiền Giang - Bến Tre - Cần Thơ
                </span>
                <button
                  className={`duration-300 ${
                    openDropdown === 1 ? "rotate-180" : "rotate-0"
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
              className={`mt-3 transition-[max-height] ease-in-out duration-500 overflow-hidden 
                ${openDropdown === 1 ? "max-h-[5000px]" : "max-h-0"}`}
            >
              <p className="font-semibold">Buổi sáng</p>
              <p className="mt-4">
                HDV và xe đón Quý khách tại điểm hẹn khu vực Quận 1 để khởi hành
                đi Tiền Giang.
              </p>
              <p className="mt-4">
                Đến Tiền Giang, đoàn xuống bến Tàu 30/04 bắt đầu hành trình du
                lịch sông Tiền.
              </p>
              <p className="mt-4">
                Tại đây, Quý khách sẽ được đến ngắm cảnh tại bốn Cù lao Long,
                Lân, Qui, Phụng. Nơi đây được người dân gọi bằng cái tên mỹ miều
                đó là &quot;tứ linh cồn&quot; nằm ngay sát nhau và được phù sa
                màu mỡ bồi đắp hình thành nên. Bên cạnh đó, khi đến thăm sông
                Tiền, Quý khách sẽ được tìm hiểu cách nuôi cá trên sông của
                người dân, ngắm nhìn Cầu Rạch Miễu - cầu dây văng lớn thứ ba
                được xây dựng ở đồng bằng sông Cửu Long.
              </p>
              <p className="mt-4">
                Tiếp đó hành trình du lịch miền Tây, Quý khách di chuyển đến Cù
                lao Thới Sơn thuộc Ấp Thới Hòa, Xã Thới Sơn hay còn được gọi là
                cồn Lân có diện tích vô cùng lớn lên đến 1200 ha với cây xanh
                bao trùm cùng hàng loạt sông, mương rạch chằng chịt mang lại
                không khí vô cùng trong lành. Tới đây, Quý khách sẽ có cơ hội
                tham quan vườn cây ăn trái, thưởng thức các loại trái cây theo
                mùa, nghe đàn ca tài tử Nam Bộ và đến thăm trại nuôi ong mật,
                thưởng thức trà mật ong chanh.
              </p>
              <p className="mt-4">
                Sau khi tham quan, thuyền sẽ đưa Quý khách đến tỉnh Bến Tre vùng
                đất trù phú với nhiều cảnh vật quyến rũ và thơ mộng. Tại đây,
                đoàn di chuyển ghé thăm lò kẹo dừa đặc sản của Bến Tre, lò bánh
                tráng ở xã Tân Thạch. Sau đó, đoàn có thể lên xe ngựa đi tham
                quan đường làng xã Tân Thạch, tìm hiểu sống bình dị của người
                dân xứ dừa.
              </p>
              <p className="mt-4">
                Đến trưa, cả đoàn dùng cơm trưa với những món đặc trưng địa
                phương.
              </p>
              <p className="mt-4 font-semibold">Buổi chiều</p>
              <p className="mt-4">
                Thuyền tiếp tục đưa Quý khách đến với Khu Du Lịch Cồn Phụng -
                địa điểm không thể bỏ lỡ khi đến du lịch miền Tây, là cù lao nằm
                giữa sông Tiền thơ mộng và bình yên. Tại đây, Quý khách sẽ được
                tìm hiểu về sự tích Ông Đạo Dừa là người sáng lập Đạo Dừa, trải
                nghiệm các trò chơi thú vị như câu cá sấu (chi phí tự túc), đi
                cầu khỉ,…
              </p>
              <p className="mt-4">
                Tiếp đó, đoàn trở lại thuyền về Mỹ Tho, khởi hành đi Cần Thơ.
              </p>
              <p className="mt-4">Buổi tối</p>
              <p className="mt-4">
                Đến Cần Thơ, đoàn khách dùng bữa tối và nhận phòng nghỉ ngơi
                hoặc tự do khám phá thành phố về đêm.
              </p>
              <p className="mt-4">Bữa ăn: Bữa trưa / Bữa tối</p>
              <div>
                <Image
                  src="/tour/detail/lich-trinh/image.png"
                  width={800}
                  height={380}
                  alt="Image"
                />
                <p className="text-center">
                  Cầu Rạch Miễu cầu dây văng lớn thứ ba tại đồng bằng sông Cửu
                  Long
                </p>
              </div>
            </div>
            <div
              className="pb-4 mb-6 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none border-b border-gray-200 cursor-pointer"
              onClick={() => toggleDropdown(2)}
            >
              <div className="flex justify-between items-center">
                <span className="font-18 font-semibold text-gray-900">
                  Ngày 2:
                </span>
                <button
                  className={`duration-300 ${
                    openDropdown === 2 ? "rotate-180" : "rotate-0"
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
              <div
                className={`mt-3 transition-[max-height] ease-in-out duration-500 overflow-hidden  ${
                  openDropdown === 2 ? "max-h-[200px]" : "max-h-0"
                }`}
              >
                <p className="text-xl font-semibold">
                  Nội dung đang cập nhật....
                </p>
              </div>
            </div>
            <div
              className="pb-4 mb-6 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none border-b border-gray-200 cursor-pointer"
              onClick={() => toggleDropdown(3)}
            >
              <div className="flex justify-between items-center">
                <span className="font-18 font-semibold text-gray-900">
                  Ngày 3:
                </span>
                <button
                  className={`duration-300 ${
                    openDropdown === 3 ? "rotate-180" : "rotate-0"
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
              <div
                className={`mt-3 transition-[max-height] ease-in-out duration-500 overflow-hidden  ${
                  openDropdown === 3 ? "max-h-[200px]" : "max-h-0"
                }`}
              >
                <p className="text-xl font-semibold">
                  Nội dung đang cập nhật....
                </p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 2 && (
          <div className="bg-white rounded-2xl p-6">
            <h3 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
              Bảng giá
            </h3>
            <div className="mt-4">
              <table className="w-full text-left align-middle">
                <tr className="bg-[#FEF8F5] text-primary">
                  <th className="py-4 px-2 border border-gray-200">
                    Ngày khởi hành
                  </th>
                  <th className="py-4 px-2  border border-gray-200">
                    Hạng tour
                  </th>
                  <th className="py-4 px-2  border border-gray-200">
                    Giá tour
                  </th>
                </tr>
                {Array.from({ length: 3 }, (item, index) => (
                  <tr key={index}>
                    <td className="w-1/3 py-3 font-me px-[10px] border-[0.5px] border-gray-200">
                      Thứ 6, 7 hàng tuần 30/01/2024 - 31/12/2024
                    </td>
                    <td className="w-1/3 py-3 font-me px-[10px] border-[0.5px] border-gray-200">
                      khách sạn 3*
                    </td>
                    <td className="w-1/3 py-3 font-me px-[10px] border-[0.5px] border-gray-200 text-right">
                      1.790.000đ
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
        )}
        {activeTab === 3 && (
          <div className="bg-white rounded-2xl p-6">
            <h3 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
              Quy định dịch vụ
            </h3>
            <div className="mt-4">
              <p className="text-xl font-semibold">
                Nội dung đang cập nhật....
              </p>
            </div>
          </div>
        )}
        {activeTab === 4 && (
          <div className="bg-white rounded-2xl p-6">
            <h3 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
              Đánh giá
            </h3>
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
                      <p className="text-sm md:text-18 font-semibold">
                        Natasia
                      </p>
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
                    Danny, hướng dẫn viên du lịch của chúng tôi, rất vui tính.
                    Anh ấy chụp ảnh cho chúng tôi ở mọi địa điểm đẹp trong
                    chuyến đi. Chuyến đi của chúng tôi rất vui khi có anh ấy.
                    Chiếc xe tải của chúng tôi hơi nóng. Nhưng chúng tôi vẫn
                    thích chuyến đi của mình với Danny.
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
        )}
      </div>
    </div>
  );
}
