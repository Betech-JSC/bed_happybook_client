"use client";
import { useRef } from "react";
import Image from "next/image";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";

const arrPartner: string[] = [];
for (let i = 1; i <= 10; i++) {
  arrPartner.push(`/partner/${i}.png`);
}
const arrPartner2: string[] = [];
for (let i = 1; i <= 9; i++) {
  arrPartner2.push(`/partner-2/${i}.png`);
}
export default function Partner() {
  const swiperRef = useRef<SwiperType | null>(null);
  const swiperRef2 = useRef<SwiperType | null>(null);

  let transformValue: string;
  let transformValue2: string;

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
      swiperRef.current.wrapperEl.style.transitionDuration = "3000ms";
      swiperRef.current.wrapperEl.style.transform = transformValue;
      swiperRef.current.autoplay.start();
    }
  };

  const handleMouseEnter2 = () => {
    if (swiperRef2.current) {
      swiperRef2.current.autoplay.stop();
      transformValue2 = swiperRef2.current.wrapperEl.style.transform;
      swiperRef2.current.wrapperEl.style.transitionDuration = "0ms";
      swiperRef2.current.wrapperEl.style.transform =
        "translate3d(" + swiperRef2.current.getTranslate() + "px, 0px, 0px)";
    }
  };

  const handleMouseLeave2 = () => {
    if (swiperRef2.current) {
      swiperRef2.current.autoplay.start();
      swiperRef2.current.wrapperEl.style.transitionDuration = "3000ms";
      swiperRef2.current.wrapperEl.style.transform = transformValue2;
    }
  };
  return (
    <div className="mt-12 py-8 bg-[#FCFCFD] hidden lg:block">
      <div className="flex justify-between px-3 lg:px-[80px]">
        <div>
          <h3 className="text-[32px] font-bold">Đối tác</h3>
        </div>
      </div>
      <div className="mt-8 w-full">
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Swiper
            spaceBetween={10}
            slidesPerView="auto"
            loop={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            speed={3000}
            modules={[Autoplay, FreeMode]}
            freeMode={{ enabled: true, momentum: false }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              swiper.wrapperEl.style.transitionTimingFunction = "linear";
            }}
          >
            {arrPartner.map((partNer, index) => (
              <SwiperSlide key={index} className="basis-1/6">
                <div>
                  <Image
                    src={partNer}
                    alt="Partner"
                    width={100}
                    height={70}
                    sizes="100vw"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="mt-5">
          <div
            onMouseEnter={handleMouseEnter2}
            onMouseLeave={handleMouseLeave2}
          >
            <Swiper
              spaceBetween={10}
              slidesPerView="auto"
              loop={true}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                reverseDirection: true,
              }}
              speed={3000}
              modules={[Autoplay, FreeMode]}
              freeMode={{ enabled: true, momentum: false }}
              onSwiper={(swiper) => {
                swiperRef2.current = swiper;
                swiper.wrapperEl.style.transitionTimingFunction = "linear";
              }}
            >
              {arrPartner2.map((partNer, index) => (
                <SwiperSlide key={index} className="basis-1/6">
                  <div>
                    <Image
                      src={partNer}
                      alt="Partner"
                      width={100}
                      height={70}
                      sizes="100vw"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
