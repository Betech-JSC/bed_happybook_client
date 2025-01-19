"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CustomerRating from "@/components/product/CustomerRating";

export default function Tabs({ detail }: any) {
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
        <div
          className={`bg-white rounded-2xl p-6 ${
            activeTab === 0 ? "block" : "hidden"
          }`}
        >
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Tìm hiểu Visa
          </h2>
          <div
            className="mt-4 leading-6"
            dangerouslySetInnerHTML={{
              __html:
                detail.product_visa.content_tim_hieu_visa ??
                "Nội dung đang cập nhật",
            }}
          ></div>
        </div>

        <div
          className={`bg-white rounded-2xl p-6 ${
            activeTab === 1 ? "block" : "hidden"
          }`}
        >
          <h2 className="pl-2 border-l-4 mb-5 border-[#F27145] text-22 font-bold">
            Giá dịch vụ, phí nộp ĐSQ, chuẩn bị hồ sơ
          </h2>
          <div
            className="mt-4 leading-6"
            dangerouslySetInnerHTML={{
              __html:
                detail.product_visa.content_gia_dich_vu ??
                "Nội dung đang cập nhật",
            }}
          ></div>
        </div>

        <div
          className={`bg-white rounded-2xl p-6 ${
            activeTab === 2 ? "block" : "hidden"
          }`}
        >
          <CustomerRating
            product_id={detail.id}
            total_rating={detail.total_rating}
            average_rating={detail.average_rating}
            average_tour_guide_rating={detail.average_tour_guide_rating}
            average_route_rating={detail.average_route_rating}
            average_transportation_rating={detail.average_transportation_rating}
            average_price_rating={detail.average_price_rating}
          />
        </div>
      </div>
    </div>
  );
}
