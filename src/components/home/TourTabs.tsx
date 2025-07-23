"use client";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TourItem from "@/components/product/components/tour-item";

export default function TourTabs({ data }: any) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full mt-6">
      <div className="border-b border-gray-200">
        <div className="flex space-x-3 mb-8">
          {data.map(
            (
              category: {
                name: string;
                id: number;
                type_tour: number;
                tours: any[];
              },
              index: number
            ) => (
              <button
                key={index}
                className={`px-4 py-2 outline-none rounded-[8px] duration-300 border-2 border-solid ${
                  activeTab === index
                    ? "bg-[#1570EF] hover:bg-blue-700 text-white"
                    : "text-gray-500 border-[#D0D5DD] hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(index)}
                data-translate
              >
                {category.name}
              </button>
            )
          )}
        </div>
        {data.map(
          (
            category: {
              name: string;
              id: number;
              type_tour: number;
              tours: any[];
            },
            tabIndex: number
          ) => (
            <div className="" key={tabIndex}>
              {activeTab === tabIndex && (
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {category.tours.map((tour, index) => (
                      <CarouselItem key={index} className="basis-1/4">
                        <TourItem key={index} tour={tour} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
