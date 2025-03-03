"use client";
import { useRef } from "react";
import Image from "next/image";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import styles from "@/styles/styles.module.scss";
import { cloneItemsCarousel } from "@/utils/Helper";

export default function OurTeam({ data }: any) {
  if (data.length > 0 && data.length < 6) {
    data = cloneItemsCarousel(data, 12);
  }
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
    <div className="mt-12 py-8 lg:px-[80px] hidden lg:block max__screen">
      <div className="flex justify-between">
        <div>
          <h3 className="text-[32px] font-bold" data-translate>
            Đội ngũ của chúng tôi
          </h3>
        </div>
      </div>
      <div
        className="mt-8"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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
          {data.map((member: any) => (
            <SwiperSlide key={member.id} className="basis-1/6">
              <div className={styles.member__item}>
                <Image
                  src={`${member.image_url}/${member.image_location}`}
                  alt="Image"
                  width={100}
                  height={100}
                  sizes="100vw"
                  className={styles.member__img}
                  style={{ width: "90%", height: 255 }}
                />
                <div className={styles.member__info}>
                  <div className={`m-3 text-white`}>
                    <p className="font-semibold" data-translate>
                      {member.name}
                    </p>
                    <p className="font-medium text-sm mt-[6px]" data-translate>
                      {member.sub_title}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
