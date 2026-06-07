"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import { useMemo, useState } from "react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/thumbs";
import { getImageSrc } from "@/utils/Helper";

export default function ImageGallery({ gallery }: any) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [brokenImageIndexes, setBrokenImageIndexes] = useState<Record<number, boolean>>({});
  const safeGallery = useMemo(() => {
    if (!gallery?.length) {
      return [{ image_url: "", image: "/default-image.png" }];
    }
    return gallery;
  }, [gallery]);
  return (
    <div className="image-gallery">
      <Swiper
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Thumbs]}
        className="main-swiper w-full h-[300px] md:h-[450px] rounded-lg"
      >
        {safeGallery.map((item: any, index: number) => (
          <SwiperSlide key={index}>
            <Image
              className="cursor-pointer w-full h-[300px] md:h-[450px] rounded-lg hover:scale-110 ease-in duration-300 object-cover"
              src={
                brokenImageIndexes[index]
                  ? "/default-image.png"
                  : getImageSrc(item.image_url, item.image)
              }
              alt="Ảnh tour"
              width={845}
              height={450}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() =>
                setBrokenImageIndexes((prev) => ({ ...prev, [index]: true }))
              }
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
          {safeGallery.map((item: any, index: number) => (
            <SwiperSlide key={index} className="overflow-hidden rounded-lg">
                <Image
                  className="cursor-pointer h-24 md:h-[120px] rounded-lg hover:scale-110 ease-in duration-300 object-cover"
                  src={
                    brokenImageIndexes[index]
                      ? "/default-image.png"
                      : getImageSrc(item.image_url, item.image)
                  }
                  alt="Ảnh tour"
                  width={135}
                  height={120}
                  onError={() =>
                    setBrokenImageIndexes((prev) => ({ ...prev, [index]: true }))
                  }
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
