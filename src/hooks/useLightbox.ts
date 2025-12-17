"use client";

import { useEffect, useMemo, useRef } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import "@/styles/lightbox-styles.scss";
import Swiper from "swiper";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

export type LightboxItem = {
  src: string;
  msrc?: string;
  width: number;
  height: number;
};

interface UseLightboxOptions {
  galleryId: string;
  items: any[];
  getPadding?: () => {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  bgOpacity?: number;
}

export function useLightbox({
  galleryId,
  items,
  getPadding,
  bgOpacity,
}: UseLightboxOptions) {
  const lightboxItems = useMemo(() => items ?? [], [items]);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);
  const swiperRef = useRef<Swiper | null>(null);

  useEffect(() => {
    if (!lightboxItems.length) return;

    const lightbox = new PhotoSwipeLightbox({
      // Dùng trực tiếp dataSource để đảm bảo thứ tự/index khớp với lightboxItems
      dataSource: lightboxItems,
      showHideAnimationType: "fade",
      pswpModule: () => import("photoswipe"),
      wheelToZoom: true,
      bgOpacity: bgOpacity ?? 0.75,
      paddingFn:
        getPadding || (() => ({ top: 10, bottom: 40, left: 20, right: 20 })),
    });

    // Thumbnails
    let thumbsWrap: HTMLDivElement | null = null;
    let thumbsList: HTMLDivElement | null = null;

    const setActiveThumb = (index: number) => {
      if (!thumbsList || !swiperRef.current) return;

      const buttons = thumbsList.querySelectorAll(".pswp-thumb-item");

      buttons.forEach((btn, i) => {
        const isActive = i === index;
        btn.classList.toggle("active", isActive);
        if (isActive) {
          btn.setAttribute("aria-current", "true");
        } else {
          btn.removeAttribute("aria-current");
        }
      });
      const swiper = swiperRef.current;
      const visibleIndexes = swiper.slides
        .filter((slide) => slide.classList.contains("swiper-slide-visible"))
        .map((slide) =>
          Array.from(slide.parentElement!.children).indexOf(slide)
        );

      if (!visibleIndexes.includes(index)) {
        swiper.slideTo(index, 500);
      }
    };

    const buildThumbs = () => {
      if (!lightbox.pswp || thumbsWrap) return;
      const pswp = lightbox.pswp;

      // Wrapper
      thumbsWrap = document.createElement("div");
      thumbsWrap.className = "pswp-custom-thumbs";
      thumbsWrap.setAttribute("role", "listbox");

      // Swiper container
      thumbsList = document.createElement("div");
      thumbsList.className = "swiper pswp-custom-thumbs-list";

      // Swiper wrapper
      const swiperWrapper = document.createElement("div");
      swiperWrapper.className = "swiper-wrapper";
      thumbsList.appendChild(swiperWrapper);
      thumbsWrap.appendChild(thumbsList);

      // Render thumbnail
      lightboxItems.forEach((img, i) => {
        const slideEl = document.createElement("div");
        slideEl.className = "swiper-slide";

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pswp-thumb-item";
        btn.setAttribute("aria-label", `Image ${i + 1}`);
        btn.setAttribute("data-index", `${i}`);

        // Nếu là video -> dùng thẻ video; ngược lại dùng img
        const isVideo = img.type === "video" || img.isVideo;
        if (isVideo) {
          const thumbVideo = document.createElement("video");
          thumbVideo.src = img.msrc || img.src;
          thumbVideo.muted = true;
          thumbVideo.playsInline = true;
          thumbVideo.preload = "metadata";
          thumbVideo.style.width = "100%";
          thumbVideo.style.height = "100%";
          thumbVideo.style.objectFit = "cover";
          btn.appendChild(thumbVideo);
        } else {
          const thumb = document.createElement("img");
          thumb.src = img.msrc || img.src;
          thumb.alt = `Thumbnail ${i + 1}`;
          thumb.decoding = "async";
          thumb.loading = "lazy";
          btn.appendChild(thumb);
        }
        btn.addEventListener("click", () => pswp.goTo(i));

        slideEl.appendChild(btn);
        swiperWrapper.appendChild(slideEl);
      });

      pswp.element?.appendChild(thumbsWrap);

      // Swiper Instance
      swiperRef.current = new Swiper(thumbsList, {
        modules: [FreeMode],
        slidesPerView: "auto",
        spaceBetween: 10,
        grabCursor: true,
        freeMode: true,
        watchSlidesProgress: true,
      });

      setActiveThumb(pswp.currIndex);
    };

    const onAfterInit = () => buildThumbs();
    const onChange = () => {
      if (!lightbox.pswp) return;
      setActiveThumb(lightbox.pswp.currIndex);
    };

    const onDestroy = () => {
      thumbsWrap?.remove();
      thumbsWrap = null;
      thumbsList = null;
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };

    lightbox.init();
    lightbox.on("afterInit", onAfterInit);
    lightbox.on("change", onChange);
    lightbox.on("destroy", onDestroy);

    lightboxRef.current = lightbox;

    return () => {
      lightbox.off("afterInit", onAfterInit);
      lightbox.off("change", onChange);
      lightbox.off("destroy", onDestroy);
      lightbox.destroy();
      lightboxRef.current = null;
    };
  }, [galleryId, lightboxItems, getPadding, bgOpacity]);

  return lightboxRef;
}
