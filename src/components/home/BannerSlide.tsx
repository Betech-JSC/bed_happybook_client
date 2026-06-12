"use client";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cloneItemsCarousel, getImageSrc } from "@/utils/Helper";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

export default function BannerSlide({ data }: any) {
  const clonedItems =
    data?.length > 0 && data?.length <= 2 ? cloneItemsCarousel(data, 4) : data;
  return (
    clonedItems && (
      <div
        className="mt-0 lg:mt-3"
        style={{ width: "100%", position: "relative" }}
      >
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: false,
            }),
          ]}
        >
          <CarouselContent className="!ml-0">
            {clonedItems.map((banner: any, index: number) => (
              <CarouselItem
                className="basis-full rounded-xl !pl-0"
                key={banner.id}
              >
                <Link href={banner?.url ?? "#"} className="w-full block">
                  {/* Mobile/Tablet Image */}
                  <Image
                    priority={index < 2}
                    src={getImageSrc(banner.image_url_mobile || banner.image_url, banner.image_location_mobile || banner.image_location)}
                    alt={banner.title || "Banner Happy Book"}
                    width={1024}
                    height={239}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="block lg:hidden w-full h-[150px] md:h-[170px] rounded-xl"
                    style={{ objectFit: "cover" }}
                  />
                  {/* Desktop Image */}
                  <Image
                    priority={index < 2}
                    src={getImageSrc(banner.image_url, banner.image_location)}
                    alt={banner.title || "Banner Happy Book"}
                    width={1024}
                    height={239}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="hidden lg:block w-full lg:h-[257px] rounded-xl"
                    style={{ objectFit: "cover" }}
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:inline-flex" />
          <CarouselNext className="hidden lg:inline-flex" />
        </Carousel>
      </div>
    )
  );
}
