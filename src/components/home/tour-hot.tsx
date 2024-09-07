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

const tours = [
  {
    category: "Du lịch miền Nam",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/tour-hot/1.png",
    hot: 1,
  },
  {
    category: "Du lịch miền Bắc",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/tour-hot/2.png",
  },
  {
    category: "Du lịch miền Trung",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/tour-hot/3.png",
  },
  {
    category: "Du lịch miền Trung",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/tour-hot/4.png",
  },
  {
    category: "Du lịch miền Bắc",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/tour-hot/2.png",
  },
];
export default function TourHot() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <div className="lg:mt-12 py-6 lg:px-6 lg:py-8 bg-[#FCFCFD] rounded-3xl">
      <div className="mt-5">
        <div className="flex justify-between">
          <div>
            <h3 className="text-[32px] font-bold">Tour Hot</h3>
          </div>
          <div className="hidden lg:flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3">
            <button className="text-[#175CD3]"> Xem tất cả</button>
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
        <div className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3">
          <button className="text-[#175CD3]"> Xem tất cả</button>
          <Image
            className=" hover:scale-110 ease-in duration-300"
            src="/icon/chevron-right.svg"
            alt="Icon"
            width={20}
            height={20}
          />
        </div>
        <div className="mt-4 w-full">
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
                <CarouselItem
                  key={index}
                  className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                >
                  <TourItem {...tour} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:inline-flex" />
            <CarouselNext className="hidden lg:inline-flex" />
          </Carousel>
        </div>
      </div>
    </div>
  );
}
