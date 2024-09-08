"use client";
import { useRef } from "react";
import Image from "next/image";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";

const ourTeams: string[] = [];
for (let i = 1; i <= 16; i++) {
  ourTeams.push(`/our-team/${i}.png`);
}

export default function OurTeam() {
  const swiperRef = useRef<SwiperType | null>(null);
  let transformValue: string;

  const handleMouseEnter = () => {
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop();

      transformValue = swiperRef.current.wrapperEl.style.transform;
      swiperRef.current.wrapperEl.style.transitionDuration = "0ms";
      swiperRef.current.wrapperEl.style.transform =
        "translate3d(" + swiperRef.current.getTranslate() + "px, 0px, 0px)";
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current) {
      swiperRef.current.wrapperEl.style.transitionDuration = "2000ms";
      swiperRef.current.wrapperEl.style.transform = transformValue;
      swiperRef.current.autoplay.start();
    }
  };
  return (
    <div className="mt-12 py-8 lg:px-[80px] hidden lg:block">
      <div className="flex justify-between">
        <div>
          <h3 className="text-[32px] font-bold">Đội ngũ của chúng tôi</h3>
        </div>
      </div>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Swiper
          spaceBetween={10}
          slidesPerView="auto"
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          speed={2000}
          modules={[Autoplay, FreeMode]}
          freeMode={{ enabled: true, momentum: false }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
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
    </div>
  );
}
