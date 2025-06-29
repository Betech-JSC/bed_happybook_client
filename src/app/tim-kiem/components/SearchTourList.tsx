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
import styles from "@/styles/styles.module.scss";

export default function SearchTourList({ tours }: any) {
  return (
    <Fragment>
      <div className="mt-8 mb-4 flex flex-col lg:flex-row gap-3 justify-between">
        <div>
          <h2
            className="text-[24px] lg:text-[32px] font-bold"
            data-translate="true"
          >
            Tours
          </h2>
        </div>
        <Link
          href="/tours"
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
          {tours.map((product: any) => {
            const vehicleIcon = ["bus", "AirplaneTilt-2"];
            const tour = product?.tour;
            if (tour?.transportation === 1) {
              vehicleIcon.splice(1, 1);
            } else if (tour?.transportation === 2) {
              vehicleIcon.splice(0, 1);
            }
            return (
              <CarouselItem
                key={tour.id}
                className="basis-10/12 md:basis-5/12 lg:basis-1/4"
              >
                <div className="rounded-2xl border-solid border-2 border-[#EAECF0] l bg-white">
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <Link href={`/tours/${product.slug}-${product.id}`}>
                      <Image
                        className=" hover:scale-110 ease-in duration-300 cursor-pointer	object-cover"
                        src={`${product.image_url}/${product.image_location}`}
                        alt="Tour Image"
                        width={320}
                        height={320}
                        sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
                        style={{ height: 220, width: "100%" }}
                      />
                    </Link>
                    <div className="absolute bottom-0 left-0 text-white px-3 py-1 bg-[#4E6EB3] rounded-tr-3xl">
                      <span data-translate>{product.category?.name ?? ""}</span>
                    </div>
                    {tour.is_hot ? (
                      <div className="absolute top-3 left-3 text-white px-3 py-1 bg-[#F27145] rounded-md">
                        <span>Hot tour</span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="py-3 px-4">
                    <Link
                      href={`/tours/${product.slug}-${product.id}`}
                      className={`text-base text-gray-900 min-h-12 font-semibold line-clamp-2 ${styles.text_hover_default}`}
                    >
                      <h3 data-translate>{product.name ?? ""}</h3>
                    </Link>
                    <p className="flex space-x-2 mt-2">
                      <Image
                        src="/icon/clock-check.svg"
                        alt="Time"
                        width={20}
                        height={20}
                      />
                      <span data-translate>{`${
                        tour.day ? `${tour.day} ngày` : ""
                      } ${tour.night ? `${tour.night} đêm` : ""}`}</span>
                    </p>
                    <p className="flex space-x-2 mt-2">
                      <span data-translate>{`Khởi hành vào: ${
                        product.start_date
                          ? product.start_date.split("-").reverse().join("/")
                          : ""
                      }`}</span>
                    </p>
                    <p className="flex space-x-2 mt-2">
                      <Image
                        src="/icon/Ticket.svg"
                        alt="Time"
                        width={20}
                        height={20}
                      />
                      <span data-translate>{`Chỗ trống: ${
                        tour.remain ? tour.remain : "Liên hệ"
                      }`}</span>
                    </p>
                    <div className="flex justify-between mt-[14px]">
                      <div className="flex space-x-2">
                        {tour?.transportation > 0 &&
                          vehicleIcon.map((item, index) => (
                            <Image
                              key={index}
                              src={`/icon/${item}.svg`}
                              alt="Icon"
                              width={20}
                              height={20}
                            />
                          ))}
                      </div>
                      <div>
                        <DisplayPrice
                          price={product.price - product?.discount_price}
                          currency={product?.currency}
                          textPrefix="chỉ từ"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:inline-flex" />
        <CarouselNext className="hidden lg:inline-flex" />
      </Carousel>
    </Fragment>
  );
}
