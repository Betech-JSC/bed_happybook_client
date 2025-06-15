"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import { displayProductPrice } from "@/utils/Helper";
import DisplayPrice from "@/components/base/DisplayPrice";

export default function VisaTabs({ data }: any) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="w-full mt-6">
      <div className="lg:space-x-3 mb-6 lg:mb-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {data.map(
              (tab: any, index: number) =>
                tab.name && (
                  <CarouselItem key={index} className="basis-1/8">
                    <button
                      className={`h-10 text-sm border-solid border-2 lg:text-base px-3 lg:px-4 py-2 rounded-[8px] duration-300
                     ${
                       activeTab === index
                         ? "bg-[#1570EF] hover:bg-blue-700 text-white"
                         : "text-gray-500 border-[#D0D5DD] hover:bg-gray-100"
                     }`}
                      onClick={() => setActiveTab(index)}
                      data-translate="true"
                    >
                      {tab.name}
                    </button>
                  </CarouselItem>
                )
            )}
          </CarouselContent>
        </Carousel>
      </div>
      <div>
        {data.map((category: any, index: number) => {
          if (index !== activeTab) return null;
          return (
            <div key={index}>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className={`${
                  category.products.length > 0 && activeTab === index
                    ? "block visible"
                    : "hidden invisible"
                }`}
              >
                <CarouselContent>
                  {category.products.map((visa: any, subIndex: number) => (
                    <CarouselItem
                      key={subIndex}
                      className="basis-10/12 md:basis-5/12 lg:basis-1/4"
                    >
                      <div className="border-solid border-2 border-[#EAECF0] rounded-2xl bg-white">
                        <div className="overflow-hidden rounded-t-2xl	">
                          <Link href={`/visa/chi-tiet/${visa.slug}`}>
                            <Image
                              className="hover:scale-110 ease-in duration-300 cursor-pointer"
                              src={`${visa.image_url}/${visa.image_location}`}
                              alt="Visa Image"
                              width={320}
                              height={320}
                              sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                              style={{ height: 200, width: "100%" }}
                            />
                          </Link>
                        </div>
                        <div className="py-3 px-4 h-fit ">
                          <Link
                            href={`/visa/chi-tiet/${visa.slug}`}
                            className={`text-base font-semibold ${styles.text_hover_default}`}
                          >
                            <h3
                              data-translate="true"
                              className="h-12 line-clamp-2"
                            >
                              {visa.name}
                            </h3>
                          </Link>
                          <div className="mt-2 text-end">
                            <DisplayPrice
                              textPrefix={
                                visa.discount_price > 0 ? "Giá ưu đãi" : "Giá"
                              }
                              price={visa.price - visa.discount_price}
                              currency={visa?.currency}
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
              <div
                className={`min-h-[100px] content-center text-center ${
                  category.products.length <= 0 && activeTab === index
                    ? "block visible"
                    : "hidden invisible"
                }`}
              >
                <p className="font-bold text-xl" data-translate="true">
                  Thông tin đang được cập nhật.....
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
