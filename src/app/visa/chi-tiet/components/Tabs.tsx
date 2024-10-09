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
  const [openDropdown, setOpenDropdown] = useState(1);
  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? 0 : id);
  };

  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      setCurrentTabWidth(tabRefs.current[activeTab].offsetWidth);
    }
  }, [activeTab]);

  return (
    <div className="w-full mt-6">
      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6 mb-8 bg-white p-3 rounded-xl relative"
        ref={tabContainerRef}
      >
        {["Tìm hiểu Visa", "Giá dịch vụ", "Đánh giá"].map((tab, index) => (
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
              Tìm hiểu Visa
            </h3>
            <p className="mt-4">
              Nhật Bản, xứ sở hoa anh đào, vẫn luôn là nơi thu hút rất nhiều
              khách du lịch trên thế giới. Đến Nhật Bản, bạn có thể ghé thăm
              những thành phố hiện đại, sầm uất như Tokyo, Yokohama hay tham
              quan những vùng đất đậm nét truyền thống, cổ kính như Kyoto,
              Nagoya; hoặc đắm mình giữa cảnh sắc thiên nhiên xinh đẹp của núi
              Phú Sĩ và các suối nước nóng ở Noboribetsu… Bên cạnh đó, bạn còn
              được thưởng thức những món ăn ngon, độc đáo của đất nước này và
              tham gia các lễ hội văn hóa đậm đà bản sắc dân tộc nơi đây.
            </p>
            <p className="mt-6">
              Quý khách có thể đến khám phá các điểm đến nổi bật sau: Tokyo, Núi
              Phú Sĩ, Nikko, Narita, Kyoto, Osaka, Nagoya, Okinawa, Hakone,
              Kobe, Yokohama, Sapporo, Furano, Hokkaido, Kawaguchiko, Kamakura,
              Kawasaki, Nhật Bản, Takayama, Fukuoka, Huis Ten Bosch, Nagasaki,
              Shimabara, Núi lửa Aso, Beppu, Yamanashi, Otaru, Sounkyo,
              Noboribetsu, Ibaraki, Kanazawa, Shirakawa, Fukushima, Hiroshima,
              Sendai,
            </p>
            <div className="mt-4 w-[90%]">
              <Image
                src="/visa-service/detail/about/image.png"
                width={800}
                height={600}
                alt="Image"
              />
            </div>
          </div>
        )}
        {activeTab === 1 && (
          <div className="bg-white rounded-2xl p-6 ">
            <h3 className="pl-2 border-l-4 mb-5 border-[#F27145] text-22 font-bold">
              Giá dịch vụ, phí nộp ĐSQ, chuẩn bị hồ sơ
            </h3>
            <p className="mt-4">
              Chúng tôi là công ty lữ hành - du lịch, có phòng dịch vụ tư vấn
              xin visa cho quý khách, thông qua chúng tôi hồ sơ sẽ được hướng
              dẫn nhanh, đúng, đủ, chuẩn… khả năng đạt Visa cao hơn. Quý khách
              tiết kiệm thời gian đi lại chuẩn bị hồ sơ… với mức phí dịch vụ nhỏ
            </p>
            <p className="mt-4">
              <span className="font-semibold">
                + Khách hàng ở Hà Nội hay các tinh miền Bắc{" "}
              </span>
              sẽ liên hệ với văn phòng cty LHVN ở Hà Nội để được tư vấn, hồ sơ
              xin visa của quý khách sẽ nộp tại Đại sứ quán Nhật Bản 27 P. Liễu
              Giai, Ngọc Khánh, Ba Đình, Hà Nội. SĐT: 024 3846 3000
            </p>
            <p className="mt-4">
              <span className="font-semibold">
                + Khách hàng sống và làm việc ở TP HCM và tỉnh miền Nam{" "}
              </span>
              (từ Phú Yên trở vào) sẽ liên hệ với văn phòng cty LHVN ở Tp HCM để
              được tư vấn, hồ sơ visa của quý khách sẽ nộp tại Tổng Lãnh Sự Quán
              Nhật Bản 261 Đ. Điện Biên Phủ, Võ Thị Sáu, Quận 3, Thành phố Hồ
              Chí Minh. SĐT: 028 3933 3510
            </p>
            <p className="mt-4">
              <span className="font-semibold">
                + Khách hàng ở Huế, Đà Nẵng, Quảng Nam{" "}
              </span>
              sẽ liên hệ với văn phòng công ty LHVN ở Đà Nẵng để được tư vấn, hồ
              sơ xin visa của quý khách sẽ nộp tại Tổng lãnh sự quán Nhật Bản
              Tầng 4-5, Số A17- 18-19, Đường 2/9, P. Bình Thuận, Q. Hải Châu,
              TP. Đà Nẵng, Việt Nam. SDT: 0236-3555-535
            </p>
            <p className="mt-4">
              Dưới đây là thông tin về yêu cầu giấy tờ cần thiết, các thủ tục
              chuẩn bị để làm visa Nhật Bản, click vào loại visa để xem chi tiết
            </p>
            <ul className="mt-4 list-disc pl-5 text-blue-700">
              <li>
                <a href="#">Visa DU LỊCH NHẬT BẢN</a>
              </li>
              <li className="mt-3">
                <a href="#">Visa CÔNG TÁC</a>
              </li>
              <li className="mt-3">
                <a href="#">Visa THĂM THÂN</a>
              </li>
            </ul>
          </div>
        )}
        {activeTab === 2 && (
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
