"use client";
import { useRef } from "react";
import Image from "next/image";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import { cloneItemsCarousel } from "@/utils/Helper";

export default function Partner({ data }: any) {
  if (data.length > 0 && data.length < 6) {
    data = cloneItemsCarousel(data, 12);
  }
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
      <div className="flex justify-between px-3 lg:px-[80px] max__screen">
        <div>
          <h2 className="text-[32px] font-bold" data-translate>
            Đối tác
          </h2>
        </div>
      </div>
      <div className="mt-8 w-full">
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="w-full overflow-hidden"
        >
          <Swiper
            spaceBetween={10}
            slidesPerView="auto"
            loop={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            speed={4000}
            modules={[Autoplay, FreeMode]}
            freeMode={{ enabled: true, momentum: false }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              swiper.wrapperEl.style.transitionTimingFunction = "linear";
            }}
          >
            {data.map((item: any) => (
              <SwiperSlide key={item.id} className="basis-1/6">
                <Image
                  src={`${item.image_url}/${item.image_location}`}
                  alt="Image"
                  width={250}
                  height={60}
                  style={{ width: "auto", height: "42px", margin: "0 auto" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="mt-6">
          <div
            onMouseEnter={handleMouseEnter2}
            onMouseLeave={handleMouseLeave2}
            className="w-full overflow-hidden"
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
              speed={4000}
              modules={[Autoplay, FreeMode]}
              freeMode={{ enabled: true, momentum: false }}
              onSwiper={(swiper) => {
                swiperRef2.current = swiper;
                swiper.wrapperEl.style.transitionTimingFunction = "linear";
              }}
            >
              {data.map((item: any) => (
                <SwiperSlide key={item.id} className="basis-1/6">
                  <div>
                    <Image
                      src={`${item.image_url}/${item.image_location}`}
                      alt="Image"
                      width={250}
                      height={60}
                      style={{
                        width: "auto",
                        height: "42px",
                        margin: "0 auto",
                      }}
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
