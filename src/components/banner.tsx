"use client";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export default function Banner() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  return (
    <div
      className="mt-0 lg:mt-3"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        // plugins={[plugin.current]}
        // onMouseEnter={plugin.current.stop}
        // onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          <CarouselItem className="basis-full lg:basis-2/4">
            <Image
              src="/images/banner.svg"
              alt="Banner"
              width={200}
              height={160}
              style={{ height: "100%", width: "100%" }}
            />
          </CarouselItem>
          <CarouselItem className="basis-full lg:basis-2/4">
            <Image
              src="/images/banner-1.svg"
              alt="Banner"
              width={200}
              height={160}
              style={{ height: "100%", width: "100%" }}
            />
          </CarouselItem>
          <CarouselItem className="basis-full lg:basis-2/4">
            <Image
              src="/images/banner.svg"
              alt="Banner"
              width={200}
              height={160}
              style={{ height: "100%", width: "100%" }}
            />
          </CarouselItem>
          <CarouselItem className="basis-full lg:basis-2/4">
            <Image
              src="/images/banner-1.svg"
              alt="Banner"
              width={200}
              height={160}
              style={{ height: "100%", width: "100%" }}
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="hidden lg:inline-flex" />
        <CarouselNext className="hidden lg:inline-flex" />
      </Carousel>
    </div>
  );
}
