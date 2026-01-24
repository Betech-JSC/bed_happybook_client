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

// Helper: normalize URL string
const normalizeUrl = (url: string) => (url || "").trim();

// Helper: extract extension, ignoring query/fragment
const getFileExtension = (url: string): string => {
  const safeUrl = normalizeUrl(url);
  if (!safeUrl) return "";
  // Strip query / fragment
  const noQuery = safeUrl.split("?")[0].split("#")[0];
  // Take filename after last slash
  const filename = noQuery.substring(noQuery.lastIndexOf("/") + 1);
  const dotIdx = filename.lastIndexOf(".");
  if (dotIdx === -1) return "";
  return filename.substring(dotIdx).toLowerCase();
};

// Helper function to check if file is video
const isVideoFile = (url: string): boolean => {
  const videoExtensions = [
    ".mp4",
    ".webm",
    ".mov",
    ".avi",
    ".mkv",
    ".flv",
    ".wmv",
    ".m4v",
    ".3gp",
    ".ogv",
  ];
  const extension = getFileExtension(url);
  if (extension && videoExtensions.includes(extension)) return true;
  // Fallback: handle edge cases if extension missing
  const lowerUrl = normalizeUrl(url).toLowerCase();
  return videoExtensions.some((ext) => lowerUrl.endsWith(ext));
};

// Helper function to check if file is image
const isImageFile = (url: string): boolean => {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".bmp",
    ".ico",
  ];
  const extension = getFileExtension(url);
  if (extension && imageExtensions.includes(extension)) return true;
  const lowerUrl = normalizeUrl(url).toLowerCase();
  return imageExtensions.some((ext) => lowerUrl.endsWith(ext));
};

export default function ProductGallery({ product }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [mainSwiper, setMainSwiper] = useState<any>(null);
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
          const isVideo = isVideoFile(fullSrc);
          const isImage = isImageFile(fullSrc);
          
          if (isVideo) {
            return {
              src: fullSrc,
              msrc: fullSrc,
              width: 900,
              height: 600,
              type: 'video',
              html: `
                <div style="
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: #000;
                ">
                  <video
                    src="${fullSrc}"
                    style="width: 100%; height: 100%; max-width: 1200px; max-height: 80vh; object-fit: contain;"
                    controls
                    autoplay
                    playsinline
                  ></video>
                </div>
              `,
            };
          }
          
          if (isImage) {
            try {
              const { width, height } = await getImageSize(fullSrc);
              return { src: fullSrc, msrc: fullSrc, width, height, type: 'image' };
            } catch {
              return {
                src: fullSrc,
                msrc: fullSrc,
                width: 900,
                height: 600,
                type: 'image',
              };
            }
          }
          
          // Default to image if extension not recognized
          try {
            const { width, height } = await getImageSize(fullSrc);
            return { src: fullSrc, msrc: fullSrc, width, height, type: 'image' };
          } catch {
            return {
              src: fullSrc,
              msrc: fullSrc,
              width: 900,
              height: 600,
              type: 'image',
            };
          }
        })
      );
      setLightboxItems(items);
    };

    prepareGallery();
  }, [gallery]);

  // Auto play/pause video khi slide active thay đổi
  useEffect(() => {
    if (!mainSwiper) return;

    const handleSlideChange = () => {
      const slides: HTMLElement[] = mainSwiper.slides || [];
      slides.forEach((slide: HTMLElement) => {
        const videos = slide.querySelectorAll("video");
        videos.forEach((v: HTMLVideoElement) => {
          v.pause();
        });
      });
      const activeSlide: HTMLElement | undefined = mainSwiper.slides
        ? mainSwiper.slides[mainSwiper.activeIndex]
        : undefined;
      if (activeSlide) {
        const videos = activeSlide.querySelectorAll("video");
        videos.forEach((v: HTMLVideoElement) => {
          v.muted = true;
          v.play().catch(() => {});
        });
      }
    };

    mainSwiper.on("slideChange", handleSlideChange);
    // chạy ngay lần đầu
    handleSlideChange();

    return () => {
      mainSwiper.off("slideChange", handleSlideChange);
    };
  }, [mainSwiper]);

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
    <>
    <div className="image-gallery" id={galleryId}>
      <Swiper
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Thumbs]}
        onSwiper={setMainSwiper}
        className="main-swiper w-full h-[300px] md:h-[450px] rounded-lg"
      >
          {lightboxItems.map((item: any, index: number) => {
          const fullSrc = item.src;
          const width = item.width || 900;
          const height = item.height || 600;
          const isVideo = item.type === 'video';
          
          return (
            <SwiperSlide key={index}>
              {isVideo ? (
                <div className="relative w-full h-[300px] md:h-[450px] rounded-lg overflow-hidden">
                  <video
                    className="w-full h-full object-cover rounded-lg"
                    controls
                    preload="metadata"
                    playsInline
                    muted
                  >
                    <source src={fullSrc} type="video/mp4" />
                    <source src={fullSrc} type="video/webm" />
                    <source src={fullSrc} type="video/quicktime" />
                    Your browser does not support the video tag.
                  </video>
                  <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    Video
                  </span>
                  <button
                    type="button"
                    className="absolute inset-0 flex items-center justify-center bg-black/25 text-white"
                    onClick={() => lightboxRef.current?.loadAndOpen(index, lightboxItems)}
                    aria-label="Open video"
                  >
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <Link
                  href={fullSrc}
                  data-pswp-src={fullSrc}
                  data-pswp-width={width}
                  data-pswp-height={height}
                  data-cropped="true"
                  onClick={(e) => {
                    e.preventDefault();
                    lightboxRef.current?.loadAndOpen(index, lightboxItems);
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
              )}
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
            lightboxItems.map((item: any, index: number) => {
              const isVideo = item.type === 'video';
              return (
                <SwiperSlide key={index} className="overflow-hidden rounded-lg">
                  {isVideo ? (
                    <div className="relative h-24 md:h-[120px] rounded-lg overflow-hidden">
                      <video
                        className="w-full h-full object-cover rounded-lg"
                        muted
                        playsInline
                        preload="metadata"
                      >
                        <source src={item.src} type="video/mp4" />
                        <source src={item.src} type="video/webm" />
                        <source src={item.src} type="video/quicktime" />
                      </video>
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <Image
                      className="cursor-pointer h-24 md:h-[120px] rounded-lg hover:scale-110 ease-in duration-300 object-cover"
                      src={item.src}
                      alt={`Thumb ${index + 1}`}
                      width={135}
                      height={120}
                    />
                  )}
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    </div>
    </>
  );
}
