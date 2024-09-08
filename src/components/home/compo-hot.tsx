"use client";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import TourItem from "@/components/tour-item";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const tours = [
  {
    categor: "Du lịch miền Nam",
    title: "Bãi Dài + Khách Sạn 4* Sunkiss Nha Trang",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/compo-hot/1.png",
  },
  {
    category: "Du lịch miền Bắc",
    title: "Khách Sạn Melia Vinpearl Huế ",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/compo-hot/2.png",
  },
  {
    category: "Du lịch miền Trung",
    title: "Du Lịch Quy Nhơn - Máy Bay Khứ Hồi - Bữa Sáng Buffet ",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/compo-hot/3.png",
  },
  {
    category: "Du lịch miền Trung",
    title: "Du Lịch Quy Nhơn - Máy Bay Khứ Hồi - Bữa Sáng Buffet ",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/compo-hot/3.png",
  },
];
export default function CompoHot() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  return (
    <div
      className="mt-6 px-3 py-6 lg:py-8 rounded-3xl"
      style={{
        backgroundImage:
          "radial-gradient(85.35% 42.91% at 13.4% 89%, #69A0FF 0%, #1E68E8 16.6%, #0A4CBE 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mt-0 lg:mt-5">
        <div className="mt-0 lg:mt-4 lg:flex">
          <div className="flex md:w-[40%] flex-col justify-between lg:items-center">
            <div>
              <h3 className="text-2xl lg:text-[32px] leading-9 font-bold text-white">
                Combo siêu hot hôm nay
              </h3>
              <p className="text-16 font-medium text-white mt-3">
                Đặt ngay hôm nay, kẻo lỡ cơ hội!
              </p>
            </div>
            <Image
              className="hidden lg:block"
              src="/compo-hot/image.svg"
              alt="Compo Hot"
              width={200}
              height={160}
              style={{ height: "auto", width: "80%" }}
            />
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8 lg:mr-3">
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
                    className="basis-10/12 md:basis-5/12 lg:basis-1/3"
                  >
                    <TourItem key={index} {...tour} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
