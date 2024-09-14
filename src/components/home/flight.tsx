"use client";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import styles from "@/styles/styles.module.scss";
import FlightItem from "@/components/flight-item";
import AOS from "aos";
import "aos/dist/aos.css";

const tours = [
  {
    title: "Hà Nội - Hồ Chí Minh",
    image: "/flight/1.png",
    price: "800.000 đồng",
    airlineName: "Vietjet Air",
    airlineLogo: "/airline/vietjet.svg",
    date: "15/09/2024",
    type: 0,
  },
  {
    title: "Hà Nội - Đà Lạt",
    image: "/flight/2.png",
    price: "800.000 đồng",
    airlineName: "Vietjet Air",
    airlineLogo: "/airline/vietjet.svg",
    date: "15/09/2024",
    type: 1,
  },
  {
    title: "Hồ Chí Minh - Nha Trang",
    image: "/flight/3.png",
    price: "800.000 đồng",
    airlineName: "Vietjet Air",
    airlineLogo: "/airline/vietjet.svg",
    date: "15/09/2024",
    type: 0,
  },
  {
    title: "Hồ Chí Minh - Hà Nội",
    image: "/flight/4.png",
    price: "800.000 đồng",
    airlineName: "Vietjet Air",
    airlineLogo: "/airline/vietjet.svg",
    date: "15/09/2024",
    type: 0,
  },
  {
    title: "Hà Nội - Hồ Chí Minh",
    image: "/flight/1.png",
    price: "800.000 đồng",
    airlineName: "Vietjet Air",
    airlineLogo: "/airline/vietjet.svg",
    date: "15/09/2024",
    type: 0,
  },
];
export default function Flight() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  return (
    <div
      className={`lg:mt-12 py-6 lg:px-6 lg:py-8 rounded-3xl  hidden lg:block ${styles.hide__background_mb}`}
      style={{
        background: "url(/bg-img/flight.png), #FCFCFD",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div>
        <div className="flex justify-between">
          <div>
            <h3 className="text-[24px] lg:text-[32px] font-bold">
              Những chuyến bay phổ biến
            </h3>
          </div>
          <div
            className="hidden lg:flex bg-[#EFF8FF] hover:bg-blue-200 py-1 px-4 rounded-lg space-x-3"
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
        <div className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3">
          <button className="text-[#175CD3] font-medium"> Xem tất cả</button>
          <Image
            className=" hover:scale-110 ease-in duration-300"
            src="/icon/chevron-right.svg"
            alt="Icon"
            width={20}
            height={20}
          />
        </div>
        <div className="mt-8 w-full">
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
                  <FlightItem {...tour} />
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
