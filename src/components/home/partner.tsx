"use client";
import { useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const arrPartner: string[] = [];
for (let i = 1; i <= 10; i++) {
  arrPartner.push(`/partner/${i}.png`);
}
const arrPartner2: string[] = [];
for (let i = 1; i <= 9; i++) {
  arrPartner2.push(`/partner-2/${i}.png`);
}
export default function Partner() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const plugin2 = useRef(Autoplay({ delay: 3001, stopOnInteraction: true }));
  return (
    <div className="mt-12 py-8 bg-[#FCFCFD] hidden lg:block">
      <div className="flex justify-between px-3 lg:px-[80px]">
        <div>
          <h3 className="text-[32px] font-bold">Đối tác</h3>
        </div>
      </div>
      <div className="mt-4 w-full">
        <div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {arrPartner.map((partNer, index) => (
                <CarouselItem key={index} className="basis-[13%]">
                  <div>
                    <Image
                      src={partNer}
                      alt="Partner"
                      width={100}
                      height={70}
                      sizes="100vw"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div>
          <div className="py-6">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[plugin2.current]}
              onMouseEnter={plugin2.current.stop}
              onMouseLeave={plugin2.current.reset}
            >
              <CarouselContent>
                {arrPartner2.map((partNer, index) => (
                  <CarouselItem key={index} className="basis-[13%]">
                    <div>
                      <Image
                        src={partNer}
                        alt="Partner"
                        width={70}
                        height={50}
                        sizes="100vw"
                        style={{ width: "auto", height: "auto" }}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
