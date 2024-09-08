"use client";
import { useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import TourItem from "@/components/tour-item";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import styles from "@/styles/styles.module.scss";

const tours = [
  {
    category: "Du lịch miền Nam",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/tour-noi-dia/1.png",
  },
  {
    category: "Du lịch miền Bắc",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/tour-noi-dia/2.png",
    hot: 1,
  },
  {
    category: "Du lịch miền Trung",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/tour-noi-dia/3.png",
    hot: 1,
  },
  {
    category: "Du lịch miền Trung",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/tour-noi-dia/4.png",
  },
  {
    category: "Du lịch miền Nam",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/tour-noi-dia/1.png",
  },
];
export default function TourNoiDia() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div
      className={`hidden lg:block mt-12 px-6 py-8 rounded-3xl ${styles.hide__background_mb}`}
      style={{
        background: "url(/bg-img/tour-noi-dia.png), #FCFCFD",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex justify-between">
        <div>
          <h3 className="text-[32px] font-bold">Tour Nội địa</h3>
        </div>
        <div
          className="flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200"
          style={{ transition: "0.3s" }}
        >
          <button className="text-[#175CD3] font-medium"> Xem tất cả</button>
          <Image
            className=" hover:scale-110 ease-in duration-300"
            src="/icon/chevron-right.svg"
            alt="Icon"
            width={20}
            height={20}
          />
        </div>
      </div>
      <p className="text-16 font-medium mt-3">
        Trải nghiệm sắc vàng và khám phá văn hóa mùa thu!
      </p>
      {/* Tabs */}
      <div className="w-full mt-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-3 mb-8">
            {["Tour miền Nam", "Tour miền Trung", "Tour miền Bắc"].map(
              (tab, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 focus:outline-none rounded-[8px] hover:bg-gray-100  ${
                    activeTab === index
                      ? "bg-[#1570EF] text-white"
                      : "text-gray-500 border-solid border-[#D0D5DD] border-2"
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  {tab}
                </button>
              )
            )}
          </div>
          <div className="">
            {activeTab === 0 && (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent>
                  {tours.map((tour, index) => (
                    <CarouselItem key={index} className="basis-1/4">
                      <TourItem key={index} {...tour} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
            {activeTab === 1 && (
              <div className="min-h-[100px] content-center text-center">
                <p className="font-bold text-xl">
                  Thông tin đang được cập nhật.....
                </p>
              </div>
            )}
            {activeTab === 2 && (
              <div className="min-h-[100px] content-center text-center">
                <p className="font-bold text-xl">
                  Thông tin đang được cập nhật.....
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* End */}
    </div>
  );
}
