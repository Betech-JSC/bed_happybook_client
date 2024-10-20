"use client";
import { useRef } from "react";
import Image from "next/image";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";

const arrPartner: string[] = [];
for (let i = 1; i <= 7; i++) {
  arrPartner.push(`/partner/slide-1/${i}.svg`);
}
const arrPartner2: string[] = [];
for (let i = 1; i <= 11; i++) {
  arrPartner2.push(`/partner/slide-2/${i}.svg`);
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
    <div className="py-12 bg-white hidden lg:block">
      <div className="flex justify-between px-3 lg:px-[80px] max__screen">
        <div>
          <h3 className="text-32 font-bold">Đối Tác Hàng Không</h3>
          <p className="mt-3">
            Chúng tôi tự hào là đại lý cấp 1 của các hãng hàng không uy tín tại
            Việt Nam như:
          </p>
        </div>
      </div>
      <div className="mt-8 w-full">
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="w-full overflow-hidden border border-gray-200 py-5"
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
            {arrPartner.map((partNer, index) => (
              <SwiperSlide key={index} className="basis-1/6">
                <Image
                  src={partNer}
                  alt="Partner"
                  width={0}
                  height={0}
                  style={{ width: "auto", height: "auto", margin: "0 auto" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="mt-6 border-b border-b-gray-200 py-5">
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
              {arrPartner2.map((partNer, index) => (
                <SwiperSlide key={index} className="basis-1/6">
                  <div>
                    <Image
                      src={partNer}
                      alt="Partner"
                      width={0}
                      height={0}
                      style={{
                        width: "auto",
                        height: "40px",
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
