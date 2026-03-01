"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import { useState } from "react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/thumbs";

export default function ImageTour({ url }: any) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  return (
    <div className="image-gallery">
      <Swiper
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Thumbs]}
        className="main-swiper w-full h-[300px] md:h-[450px] rounded-lg"
      >
        <SwiperSlide>
          <Image
            className="cursor-pointer w-full h-[300px] md:h-[450px] rounded-lg hover:scale-110 ease-in duration-300"
            src={url}
            alt="Ảnh tour"
            width={845}
            height={450}
            sizes="100vw"
          />
        </SwiperSlide>
      </Swiper>
      <div className="mt-3">
        <Swiper
          onSwiper={setThumbsSwiper}
          slidesPerView={3}
          spaceBetween={10}
          breakpoints={{
            1024: {
              slidesPerView: 6,
              spaceBetween: 10,
              loop: true,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 10,
              loop: true,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
              loop: true,
            },
          }}
          watchSlidesProgress={true}
          modules={[Thumbs]}
          className="thumbs-swiper"
        >
          <SwiperSlide className="overflow-hidden rounded-lg">
            <Image
              className="cursor-pointer h-24 md:h-[120px] rounded-lg hover:scale-110 ease-in duration-300"
              src={url}
              alt="Ảnh tour"
              width={135}
              height={120}
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}
