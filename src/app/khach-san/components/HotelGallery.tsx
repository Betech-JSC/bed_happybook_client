"use client";
import { useLightbox } from "@/hooks/useLightbox";
import { getImageSize } from "@/utils/Helper";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";

export default function HotelGallery({ product }: any) {
  const galleryId = useId().replace(/:/g, "_");
  const [lightboxItems, setLightboxItems] = useState<any[]>([]);
  const DEFAULT_IMAGE_SRC = "/images/default-image.png";
  const gallery = useMemo(() => {
    const list = (product?.gallery ?? []).filter(Boolean);

    const filled = list.map((it: any) => ({
      image: it.image,
      image_url: it.image_url || product?.image_url || "",
    }));

    if (product?.image_location) {
      return [
        { image_url: product.image_url, image: product.image_location },
        ...filled,
      ];
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
            return { src: fullSrc, msrc: fullSrc + "?w=400", width, height };
          } catch {
            return {
              src: fullSrc,
              msrc: fullSrc + "?w=400",
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
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-2 rounded-lg"
      id={galleryId}
    >
      <div className="overflow-hidden rounded-lg">
        {lightboxItems[0] && (
          <Link
            href={lightboxItems[0].src}
            data-pswp-src={lightboxItems[0].src}
            data-pswp-width={lightboxItems[0].width}
            data-pswp-height={lightboxItems[0].height}
            data-cropped="true"
            onClick={(e) => {
              e.preventDefault();
              lightboxRef.current?.pswp?.goTo(0);
            }}
          >
            <Image
              className="cursor-pointer w-full h-[280px] md:h-[450px] rounded-lg hover:scale-110 ease-in duration-300 object-cover"
              src={lightboxItems[0].src}
              alt={product?.name || "Ảnh khách sạn"}
              width={700}
              height={450}
              sizes="100vw"
            />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {lightboxItems.slice(1, 5).map((item: any, index: number) => (
          <Link
            className="overflow-hidden rounded-lg h-32 md:h-[220px]"
            key={index + 1}
            href={item.src}
            data-pswp-src={item.src}
            data-pswp-width={item.width}
            data-pswp-height={item.height}
            data-cropped="true"
            onClick={(e) => {
              e.preventDefault();
              lightboxRef.current?.pswp?.goTo(index + 1);
            }}
          >
            <Image
              className="cursor-pointer w-full h-32 md:h-[220px] rounded-lg hover:scale-110 ease-in duration-300 object-cover"
              src={item.src}
              alt={product?.name || "Ảnh khách sạn"}
              width={320}
              height={220}
              sizes="100vw"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
