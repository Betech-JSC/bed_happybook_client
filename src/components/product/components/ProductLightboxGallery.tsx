"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { cn } from "@/lib/utils";

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

const getFileExtension = (url: string) => {
  const clean = url.split("?")[0].split("#")[0];
  const lastDot = clean.lastIndexOf(".");
  if (lastDot === -1) return "";
  return clean.substring(lastDot).toLowerCase();
};

const isVideo = (url: string) => {
  const ext = getFileExtension(url);
  return videoExtensions.includes(ext);
};

type Images = {
  id: string;
  image_location: string;
  image_url: string;
  fit_width: number;
  fit_height: number;
};

export default function ProductLightboxGallery({
  images,
  startIndex = 0,
  wrapperStyle,
  btnText = "Menu",
  btnStyle,
}: {
  images: Images[];
  btnText?: string;
  startIndex?: number;
  wrapperStyle?: string;
  btnStyle?: string;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  const items = useMemo(() => {
    return (images ?? []).map((img) => {
      const src = img.image_url + img.image_location;
      const video = isVideo(src);
      return {
        src,
        width: img.fit_width ?? 900,
        height: img.fit_height ?? 600,
        type: video ? "video" : "image",
        isVideo: video,
        ...(video
          ? {
              html: `<div class="pswp__video-wrapper"><video src="${src}" style="max-width:100%;max-height:80vh" controls autoplay playsinline></video></div>`,
            }
          : {}),
      };
    });
  }, [images]);

  // Init
  useEffect(() => {
    if (!hostRef.current) return;
    if (!images?.length) return;

    const lightbox = new PhotoSwipeLightbox({
      pswpModule: () => import("photoswipe"),
      showHideAnimationType: "zoom",
      wheelToZoom: true,
      initialZoomLevel: () => (window.innerWidth >= 1024 ? 1 : 0),
      secondaryZoomLevel: () => (window.innerWidth >= 1024 ? 2 : 1),
      paddingFn: () => ({
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      }),
      bgOpacity: 0.9,
    });

    lightboxRef.current = lightbox;

    // Thumbnails
    let thumbsWrap: HTMLDivElement | null = null;
    let thumbsList: HTMLDivElement | null = null;

    const setActiveThumb = (index: number) => {
      if (!thumbsList) return;
      Array.from(thumbsList.children).forEach((el, i) => {
        const btn = el as HTMLButtonElement;
        const active = i === index;
        btn.classList.toggle("active", active);
        if (active) btn.setAttribute("aria-current", "true");
        else btn.removeAttribute("aria-current");
      });
      const activeEl = thumbsList.children[index] as HTMLElement | undefined;
      if (activeEl) {
        activeEl.scrollIntoView({
          inline: "center",
          block: "nearest",
          behavior: "smooth",
        });
      }
    };

    const buildThumbs = () => {
      if (!lightbox.pswp || thumbsWrap) return;
      const pswp = lightbox.pswp;

      thumbsWrap = document.createElement("div");
      thumbsWrap.className = "pswp-custom-thumbs";
      thumbsWrap.setAttribute("role", "listbox");

      thumbsList = document.createElement("div");
      thumbsList.className = "pswp-custom-thumbs-list";
      thumbsWrap.appendChild(thumbsList);

      images.forEach((img, i) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "pswp-thumb-item";
        item.setAttribute("aria-label", `Ảnh ${i + 1}`);
        item.setAttribute("data-index", String(i));

        const isVidThumb = isVideo(img.image_url + img.image_location);
        if (isVidThumb) {
          const thumbVideo = document.createElement("video");
          thumbVideo.src = img.image_url + img.image_location;
          thumbVideo.muted = true;
          thumbVideo.playsInline = true;
          thumbVideo.preload = "metadata";
          thumbVideo.style.width = "100%";
          thumbVideo.style.height = "100%";
          thumbVideo.style.objectFit = "cover";
          item.appendChild(thumbVideo);
        } else {
          const thumb = document.createElement("img");
          thumb.src = img.image_url + img.image_location;
          thumb.alt = "Menu Image";
          thumb.decoding = "async";
          thumb.loading = "lazy";
          item.appendChild(thumb);
        }
        item.addEventListener("click", () => pswp.goTo(i));

        thumbsList!.appendChild(item);
      });

      pswp?.element?.appendChild(thumbsWrap);
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
    };

    // lightbox.on("afterInit", onAfterInit);
    lightbox.on("change", onChange);
    lightbox.on("destroy", onDestroy);

    return () => {
      // lightbox.off("afterInit", onAfterInit);
      lightbox.off("change", onChange);
      lightbox.off("destroy", onDestroy);
      lightbox.destroy();
      lightboxRef.current = null;
    };
  }, [images]);

  const openLightbox = useCallback(() => {
    if (!lightboxRef.current) return;
    const safeIndex =
      Number.isFinite(startIndex) &&
      startIndex >= 0 &&
      startIndex < items.length
        ? startIndex
        : 0;

    lightboxRef.current.loadAndOpen(safeIndex, items);
  }, [items, startIndex]);

  if (!images?.length) return null;

  return (
    <div ref={hostRef} className={cn("", wrapperStyle)}>
      <button
        type="button"
        aria-haspopup="dialog"
        className={cn(
          "w-[110px] p-[10px] bg-primary border-primary border-[1px] text__default_hover rounded-lg hover:bg-inherit text-white transition-all duration-500 ease-out",
          btnStyle
        )}
        onClick={openLightbox}
      >
        {btnText}
      </button>

      {/* CSS */}
      <style jsx global>{`
        .pswp img {
          object-fit: cover;
          border-radius: 4px;
        }
        .pswp__button--zoom {
          display: none !important;
        }
        .pswp-custom-thumbs {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 10px 12px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: saturate(120%) blur(4px);
          z-index: 3;
        }
        .pswp-custom-thumbs-list {
          display: flex;
          overflow-x: auto;
          gap: 10px;
          scrollbar-width: thin;
          justify-content: center;
        }
        .pswp-custom-thumbs-list::-webkit-scrollbar {
          height: 6px;
        }
        .pswp-custom-thumbs-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.25);
          border-radius: 4px;
        }
        .pswp-thumb-item {
          flex: 0 0 auto;
          width: 120px;
          height: 80px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
          padding: 0;
          background: transparent;
          cursor: pointer;
          transition: transform 0.18s ease, border-color 0.18s ease,
            box-shadow 0.18s ease;
        }
        .pswp-thumb-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.25s ease, filter 0.25s ease;
        }
        .pswp-thumb-item:hover img {
          transform: scale(1.04);
          filter: saturate(110%);
        }
        .pswp-thumb-item.active {
          border-color: #e11d48;
          box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.3);
        }
        .pswp__viewport {
          margin-bottom: 100px;
        }
        @media (max-width: 640px) {
          .pswp-thumb-item {
            width: 90px;
            height: 60px;
          }
          .pswp__viewport {
            margin-bottom: 92px;
          }
        }
      `}</style>
    </div>
  );
}
