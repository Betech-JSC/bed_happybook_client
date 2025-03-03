"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import HotelItem from "@/components/product/components/HotelItem";
import { useState } from "react";

export default function HotelTabs({ data }: any) {
  const [activeTab, setActiveTab] = useState<number>(data[0].id);
  return (
    <div className="mt-3">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {data.map((tab: any, index: number) => (
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
                data-translate="true"
              >
                {tab.name}
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="mt-8">
        {data.map(
          (tab: any, index: number) =>
            activeTab === tab.id && (
              <div key={tab.id}>
                {tab.products.length > 0 ? (
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {tab.products.map((hotel: any) => (
                        <CarouselItem
                          key={hotel.id}
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
            )
        )}
      </div>
    </div>
  );
}
