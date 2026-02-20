import { Fragment } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import HotelItem from "@/components/product/components/HotelItem";
import Link from "next/link";
import Image from "next/image";
export default function SearchHotelList({ hotels }: any) {
  return (
    <Fragment>
      <div className="mt-8 mb-4 flex flex-col lg:flex-row gap-3 justify-between">
        <div>
          <h2
            className="text-[24px] lg:text-[32px] font-bold"
            data-translate="true"
          >
            Khách sạn
          </h2>
        </div>
        <Link
          href="/khach-san"
          className="flex bg-[#EFF8FF] hover:bg-blue-200 py-3 px-4 lg:py-1 rounded-lg space-x-3 w-fit"
          style={{ transition: "0.3s" }}
        >
          <button className="text-[#175CD3] font-medium" data-translate="true">
            {" "}
            Xem tất cả
          </button>
          <Image
            className=" hover:scale-110 ease-in duration-300"
            src="/icon/chevron-right.svg"
            alt="Xem tất cả"
            width={20}
            height={20}
          />
        </Link>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {hotels.map((hotel: any) => (
            <CarouselItem
              key={hotel.id}
              className="basis-10/12 md:basis-5/12 lg:basis-1/4"
            >
              <HotelItem hotel={hotel} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:inline-flex" />
        <CarouselNext className="hidden lg:inline-flex" />
      </Carousel>
    </Fragment>
  );
}
