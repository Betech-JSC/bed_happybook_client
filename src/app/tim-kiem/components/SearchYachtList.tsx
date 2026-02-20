import { Fragment } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";
import DisplayPrice from "@/components/base/DisplayPrice";
import { renderTextContent } from "@/utils/Helper";
import { format } from "date-fns";

export default function SearchYachtList({ yachts }: any) {
  const today = new Date();
  return (
    <Fragment>
      <div className="mt-8 mb-4 flex flex-col lg:flex-row gap-3 justify-between">
        <div>
          <h2
            className="text-[24px] lg:text-[32px] font-bold"
            data-translate="true"
          >
            Du thuyền
          </h2>
        </div>
        <Link
          href="/du-thuyen"
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
          {yachts.map((item: any) => (
            <CarouselItem
              key={item.id}
              className="basis-10/12 md:basis-5/12 lg:basis-1/4"
            >
              <div
                className={`w-full relative overflow-hidden rounded-t-xl transition-opacity duration-700`}
              >
                <Link
                  href={`/du-thuyen/${item.slug}?departDate=${format(
                    today,
                    "yyyy-MM-dd"
                  )}`}
                >
                  <Image
                    className="hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full"
                    src={`${item.image_url}/${item.image_location}`}
                    alt={item.name}
                    width={360}
                    height={270}
                    sizes="100vw"
                    style={{ height: 217 }}
                  />
                </Link>
              </div>
              <div className="py-3 px-5 bg-white rounded-b-xl">
                <Link
                  href={`/du-thuyen/${item.slug}?departDate=${format(
                    today,
                    "yyyy-MM-dd"
                  )}`}
                  className="text-base font-bold line-clamp-2 h-12"
                  data-translate="true"
                >
                  {renderTextContent(item.name)}
                </Link>
                <div className="mt-1 text-end">
                  <DisplayPrice
                    price={item.minPrice}
                    textPrefix="chỉ từ"
                    currency={item?.currency}
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:inline-flex" />
        <CarouselNext className="hidden lg:inline-flex" />
      </Carousel>
    </Fragment>
  );
}
