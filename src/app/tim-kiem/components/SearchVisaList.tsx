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
import styles from "@/styles/styles.module.scss";
import DisplayPrice from "@/components/base/DisplayPrice";

export default function SearchVisaList({ visa }: any) {
  return (
    <Fragment>
      <div className="mt-8 mb-4 flex flex-col lg:flex-row gap-3 justify-between">
        <div>
          <h2
            className="text-[24px] lg:text-[32px] font-bold"
            data-translate="true"
          >
            Visa
          </h2>
        </div>
        <Link
          href="/visa"
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
            alt="Icon"
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
          {visa.map((item: any) => (
            <CarouselItem
              key={item.id}
              className="basis-10/12 md:basis-5/12 lg:basis-1/4"
            >
              <div className="border-solid border-2 border-[#EAECF0] rounded-2xl bg-white">
                <div className="overflow-hidden rounded-t-2xl	">
                  <Link href={`/visa/${item.slug}-${item.product_id}`}>
                    <Image
                      className="hover:scale-110 ease-in duration-300 cursor-pointer"
                      src={`${item.image_url}/${item.image_location}`}
                      alt={item.name}
                      width={320}
                      height={320}
                      sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                      style={{ height: 200, width: "100%" }}
                    />
                  </Link>
                </div>
                <div className="py-3 px-4 h-fit ">
                  <Link
                    href={`/visa/${item.slug}-${item.product_id}`}
                    className={`text-base font-semibold ${styles.text_hover_default}`}
                  >
                    <h3 data-translate="true" className="h-12 line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="mt-2 text-end">
                    <DisplayPrice
                      textPrefix={
                        item.discount_price > 0 ? "Giá ưu đãi" : "Giá"
                      }
                      price={item.price - item.discount_price}
                      currency={item?.currency}
                    />
                  </div>
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
