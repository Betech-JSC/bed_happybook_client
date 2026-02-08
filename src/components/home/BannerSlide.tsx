"use client";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cloneItemsCarousel } from "@/utils/Helper";
import Link from "next/link";

export default function BannerSlide({ data }: any) {
  const clonedItems =
    data?.length > 0 && data?.length <= 2 ? cloneItemsCarousel(data, 4) : data;
  return (
    clonedItems && (
      <div
        className="mt-0 lg:mt-3"
        style={{ width: "100%", height: "100%", position: "relative" }}
      >
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {clonedItems.map((banner: any, index: number) => (
              <CarouselItem
                className="basis-full lg:basis-2/4 rounded-xl"
                key={banner.id}
              >
                <Link href={banner?.url ?? "#"}>
                  <Image
                    priority={index === 0}
                    src={`${banner.image_url}/${banner.image_location}`}
                    alt="Banner"
                    width={628}
                    height={210}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="h-[100px] md:h-[156px] rounded-xl w-full object-cover"
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
