"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import { useState } from "react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/thumbs";

export default function ImageGallery({ detail }: any) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const gallery = detail?.gallery ?? [];
  const imageUrl = detail?.image_url;
  if (!gallery?.length) {
    if (detail?.image_location) {
      gallery[0] = { image_url: imageUrl, image: detail?.image_location };
    } else {
      gallery[0] = { image_url: "", image: "default-image.png" };
    }
  }
  return (
    <div className="image-gallery">
      <Swiper
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Thumbs]}
        className="main-swiper w-full h-[300px] md:h-[450px] rounded-lg"
      >
        {gallery.map((item: any, index: number) => (
          <SwiperSlide key={index}>
            <Image
              className="cursor-pointer w-full h-[300px] md:h-[450px] rounded-lg hover:scale-110 ease-in duration-300"
              src={`${item.image_url}/${item.image}`}
              alt="Ảnh dịch vụ visa"
              width={845}
              height={450}
              sizes="100vw"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {gallery?.length > 1 && (
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
            {gallery.map((item: any, index: number) => (
              <SwiperSlide key={index} className="overflow-hidden rounded-lg">
                <Image
                  className="cursor-pointer h-24 md:h-[110px] rounded-lg hover:scale-110 ease-in duration-300"
                  src={`${item.image_url}/${item.image}`}
                  alt="Ảnh dịch vụ visa"
                  width={135}
                  height={120}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
