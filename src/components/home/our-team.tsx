"use client";
import { useRef } from "react";
// import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import styles from "@/styles/styles.module.scss";

const ourTeams: string[] = [];
for (let i = 1; i <= 16; i++) {
  ourTeams.push(`/our-team/${i}.png`);
}

export default function OurTeam() {
  // const plugin = useRef(Autoplay({ delay: 1000, stopOnInteraction: true }));
  return (
    <div className="mt-12 py-8 lg:px-[80px] hidden lg:block">
      <div className="flex justify-between">
        <div>
          <h3 className="text-[32px] font-bold">Đội ngũ của chúng tôi</h3>
        </div>
      </div>
      <div className="mt-4 w-full">
        <Swiper
          spaceBetween={10}
          slidesPerView="auto"
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={2000}
          modules={[Autoplay, FreeMode]}
          freeMode={{ enabled: true, momentum: false }}
          onSwiper={(swiper) => {
            swiper.wrapperEl.style.transitionTimingFunction = "linear";
          }}
        >
          {ourTeams.map((member, index) => (
            <SwiperSlide key={index} className="basis-1/6">
              <div>
                <Image
                  src={member}
                  alt="Member"
                  width={100}
                  height={100}
                  sizes="100vw"
                  className="rounded-2xl cursor-pointer grayscale hover:grayscale-0"
                  style={{ width: "90%", height: "auto" }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* <div className="mt-4 w-full">
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
            {ourTeams.map((member, index) => (
              <CarouselItem key={index} className="basis-1/6">
                <div>
                  <Image
                    src={member}
                    alt="Member"
                    width={100}
                    height={100}
                    sizes="100vw"
                    className="rounded-2xl cursor-pointer"
                    style={{ width: "90%", height: "auto" }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div> */}
    </div>
  );
}
