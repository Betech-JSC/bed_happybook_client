"use client";
import { useRef } from "react";
import Image from "next/image";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import styles from "@/styles/styles.module.scss";

const ourTeams = [
  {
    name: "Chị Văn",
    position: "Tổng Giám Đốc",
    image: "1",
  },
  {
    name: "Hòa",
    position: "Leader Booker Quốc Tế",
    image: "2",
  },
  {
    name: "Ngà",
    position: "Leader Booker Nội Địa",
    image: "3",
  },
  {
    name: "Nhu",
    position: "Leader Marketing",
    image: "4",
  },
  {
    name: "Huy Lớn",
    position: "Hộ Chiếu & Visa",
    image: "6",
  },
  {
    name: "Huy Nhỏ",
    position: "Content Creator",
    image: "1",
  },
  {
    name: "Tươi",
    position: "Content Marketing",
    image: "1",
  },
  {
    name: "Kiệt",
    position: "ADS Marketing",
    image: "1",
  },
  {
    name: "My",
    position: "S.E.O Website",
    image: "1",
  },
  {
    name: "Anh Thành",
    position: "Tour Du Lịch",
    image: "1",
  },
  {
    name: "Chị Thoa",
    position: "CTV Vé Máy Bay",
    image: "1",
  },
  {
    name: "Kiều",
    position: "Booker",
    image: "1",
  },
  {
    name: "Vy",
    position: "Booker",
    image: "1",
  },
  {
    name: "Thắm",
    position: "HR",
    image: "1",
  },
  {
    name: "Tuyết",
    position: "Kế Toán",
    image: "1",
  },
];

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
    <div className="mt-12 py-8 lg:px-[80px] hidden lg:block max__screen">
      <div className="flex justify-between">
        <div>
          <h3 className="text-[32px] font-bold">Đội ngũ của chúng tôi</h3>
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
          {ourTeams.map((member, index) => (
            <SwiperSlide key={index} className="basis-1/6">
              <div className={styles.member__item}>
                <Image
                  src={`/our-team/${index + 1}.png`}
                  alt="Member"
                  width={100}
                  height={100}
                  sizes="100vw"
                  className={styles.member__img}
                  style={{ width: "90%", height: "auto" }}
                />
                <div className={styles.member__info}>
                  <div className={`m-3 text-white`}>
                    <p className="font-semibold">{member.name}</p>
                    <p className="font-medium text-sm mt-[6px]">
                      {member.position}
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
