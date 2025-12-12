"use client";

import { useEffect, useId, useState, useMemo } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import "swiper/css";
import "photoswipe/style.css";
import Link from "next/link";
import { useLightbox } from "@/hooks/useLightbox";
import { getImageSize } from "@/utils/Helper";

type Props = {
  product: {
    image_location: string;
    image_url: string;
    gallery: { image: string }[];
  };
};

export default function ProductGallery({ product }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [lightboxItems, setLightboxItems] = useState<any[]>([]);
  const DEFAULT_IMAGE_SRC = "/images/default-image.png";
  const galleryId = useId().replace(/:/g, "_");
  const gallery = useMemo(() => {
    const list = (product?.gallery ?? []).filter(Boolean);

    const filled = list.map((it: any) => ({
      image: it.image,
      image_url: it.image_url || product?.image_url || "",
    }));

    if (filled.length > 0) return filled;

    if (product?.image_location) {
      return [{ image_url: product.image_url, image: product.image_location }];
    }

    return [{ image_url: "", image: DEFAULT_IMAGE_SRC }];
  }, [product?.gallery, product?.image_url, product?.image_location]);

  useEffect(() => {
    if (!gallery.length) return;

    const prepareGallery = async () => {
      const items = await Promise.all(
        gallery.map(async (img: any) => {
          const fullSrc = `${img.image_url}/${img.image}`;
          try {
            const { width, height } = await getImageSize(fullSrc);
            return { src: fullSrc, msrc: fullSrc, width, height };
          } catch {
            return {
              src: fullSrc,
              msrc: fullSrc,
              width: 900,
              height: 600,
            };
          }
        })
      );
      setLightboxItems(items);
    };

    prepareGallery();
  }, [gallery]);

  const lightboxRef = useLightbox({
    galleryId,
    items: lightboxItems,
    getPadding: () => ({
      top: 10,
      bottom: window.innerWidth > 1024 ? 120 : 40,
      left: 20,
      right: 20,
    }),
  });

  if (!gallery?.length) return null;

  return (
    <div className="image-gallery" id={galleryId}>
      <Swiper
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Thumbs]}
        className="main-swiper w-full h-[300px] md:h-[450px] rounded-lg"
      >
        {lightboxItems.map((item: any, index: number) => {
          const fullSrc = item.src;
          const width = item.width || 900;
          const height = item.height || 600;
          return (
            <SwiperSlide key={index}>
              <Link
                href={fullSrc}
                data-pswp-src={fullSrc}
                data-pswp-width={width}
                data-pswp-height={height}
                data-cropped="true"
                onClick={(e) => {
                  e.preventDefault();
                  lightboxRef.current?.pswp?.goTo(index);
                }}
              >
                <Image
                  className="cursor-pointer w-full h-[300px] md:h-[450px] rounded-lg hover:scale-110 ease-in duration-300 object-cover"
                  src={fullSrc}
                  alt={`Image ${index + 1}`}
                  width={845}
                  height={450}
                  sizes="100vw"
                />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Swiper thumbnail */}
      <div className="mt-3">
        <Swiper
          onSwiper={setThumbsSwiper}
          slidesPerView={3}
          spaceBetween={10}
          breakpoints={{
            1024: {
              slidesPerView: 6,
              spaceBetween: 10,
              loop: false,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 10,
              loop: false,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
              loop: false,
            },
          }}
          watchSlidesProgress
          modules={[Thumbs]}
          className="thumbs-swiper"
        >
          {lightboxItems?.length > 1 &&
            lightboxItems.map((item: any, index: number) => (
              <SwiperSlide key={index} className="overflow-hidden rounded-lg">
                <Image
                  className="cursor-pointer h-24 md:h-[120px] rounded-lg hover:scale-110 ease-in duration-300 object-cover"
                  src={item.src}
                  alt={`Thumb ${index + 1}`}
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
