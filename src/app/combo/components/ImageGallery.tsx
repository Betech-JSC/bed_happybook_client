"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import { useState } from "react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/thumbs";

export default function ImageGallery({ gallery }: any) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  if (!gallery?.length) {
    gallery[0] = { image_url: "", image: "default-image.png" };
  }
  return (
    <div className="image-gallery">
      <Swiper
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Thumbs]}
        className="main-swiper w-full h-[300px] md:h-[450px] rounded-lg"
      >
        {gallery.length > 0 &&
          gallery.map((item: any) => (
            <SwiperSlide key={item.id}>
              <Image
                className="cursor-pointer w-full h-[300px] md:h-[450px] rounded-lg hover:scale-110 ease-in duration-300 object-cover"
                src={`${item.image_url}/${item.image}`}
                alt="Ảnh combo tour"
                width={845}
                height={450}
                sizes="100vw"
              />
            </SwiperSlide>
          ))}
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
          {gallery.length > 0 &&
            gallery.map((item: any) => (
              <SwiperSlide key={item.id} className="overflow-hidden rounded-lg">
                <Image
                  className="cursor-pointer h-24 md:h-[120px] rounded-lg hover:scale-110 ease-in duration-300 object-cover"
                  src={`${item.image_url}/${item.image}`}
                  alt="Ảnh combo tour"
                  width={135}
                  height={120}
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}
