"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import HotelItem from "@/components/HotelItem";
import { useState } from "react";
import { Span } from "next/dist/trace";

const hotels = [
  {
    title: "Night Hotel",
    image: "/hotel/1.png",
    price: "1.200.00",
    discount: "800.000",
    discountPercent: 22,
  },
  {
    title: "Melia Bavi Mountain Retreat",
    image: "/hotel/2.png",
    price: "1.200.00",
    discount: "800.000",
    discountPercent: 22,
  },
  {
    title:
      "Livotel Hotel Lat Phrao Bangkok Livotel Hotel Lat Phrao Bangkok Livotel Hotel Lat Phrao Bangkok",
    image: "/hotel/3.png",
    price: "1.200.00",
    discount: "800.000",
    discountPercent: 22,
  },
  {
    title: "BAIYOKE SKY HOTEL",
    image: "/hotel/4.png",
    price: "1.200.00",
    discount: "800.000",
    discountPercent: 22,
  },
  {
    title: "Melia Bavi Mountain Retreat",
    image: "/hotel/2.png",
    price: "1.200.00",
    discount: "800.000",
    discountPercent: 22,
  },
];
const tabs = [
  { id: 1, title: "Hồ Chí Minh", items: hotels },
  { id: 2, title: "Hà Nội", items: [] },
  { id: 3, title: "Đà Lạt", items: [] },
];
export default function HotelTabs() {
  const [activeTab, setActiveTab] = useState<number>(tabs[0].id);

  return (
    <div className="mt-3">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {tabs.map((tab, index) => (
            <CarouselItem
              key={tab.id}
              className="basis-1/8"
              onClick={() => setActiveTab(tab.id)}
            >
              <button
                className={`px-4 py-2 rounded-lg border duration-300 border-gray-300 ${
                  activeTab === tab.id
                    ? "bg-[#1570EF] hover:bg-blue-700 text-white"
                    : "text-gray-500  hover:bg-gray-100"
                }`}
              >
                {tab.title}
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="mt-8">
        {tabs.map((tab, index) =>
          activeTab === tab.id ? (
            <div key={tab.id}>
              {tab.items.length > 1 ? (
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {tab.items.map((hotel, index_2) => (
                      <CarouselItem
                        key={index_2}
                        className="basis-10/12 md:basis-5/12 lg:basis-1/4"
                      >
                        <HotelItem hotel={hotel} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden lg:inline-flex" />
                  <CarouselNext className="hidden lg:inline-flex" />
                </Carousel>
              ) : (
                <div className="min-h-[100px] content-center text-center font-bold text-xl">
                  Thông tin đang được cập nhật.....
                </div>
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
