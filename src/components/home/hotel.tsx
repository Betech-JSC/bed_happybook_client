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
import { formatCurrency, formatMoney } from "@/lib/formatters";
import { calculatorDiscountPercent } from "@/utils/Helper";
import Link from "next/link";
import HotelItem from "../product/components/HotelItem";

export default function Hotel({ data }: any) {
  const [activeTab, setActiveTab] = useState<number>(0);
  return (
    <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
      <div className="relative lg:mb-8 lg:mt-12 lg:px-6 py-6 lg:py-8">
        {/* Background */}
        <div
          className="rounded-3xl absolute inset-0 hidden lg:block"
          style={{
            background: "#FCFCFD",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1,
          }}
        ></div>
        {/* Background Image */}
        <div className="absolute inset-0 z-[2] hidden lg:block">
          <Image
            src="/bg-img/hotel.png"
            width={1280}
            height={500}
            alt="Background"
            sizes="100vw"
            className="w-full h-full rounded-3xl "
          />
        </div>
        {/* Content */}
        <div className={`relative z-10 ${styles.hide__background_mb}`}>
          <div className="flex justify-between">
            <div>
              <h2 className="text-[24px] lg:text-[32px] font-bold">
                Đa dạng lựa chọn khách sạn
              </h2>
            </div>
            <Link
              href="/khach-san"
              className="hidden lg:flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200"
              style={{ transition: "0.3s" }}
            >
              <button className="text-[#175CD3] font-medium">Xem tất cả</button>
              <Image
                className=" hover:scale-110 ease-in duration-300"
                src="/icon/chevron-right.svg"
                alt="Icon"
                width={20}
                height={20}
              />
            </Link>
          </div>
          <p className="text-sm lg:text-base font-medium mt-3">
            Dịch vụ làm visa nhanh chóng, uy tín, hỗ trợ 24/7. Tỷ lệ đậu cao!
          </p>
          <Link
            href="/khach-san"
            className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
          >
            <button className="text-[#175CD3] font-medium"> Xem tất cả</button>
            <Image
              className=" hover:scale-110 ease-in duration-300"
              src="/icon/chevron-right.svg"
              alt="Icon"
              width={20}
              height={20}
            />
          </Link>
          {/* Tabs */}
          <div className="w-full mt-6">
            <div className="">
              <div className="space-x-3 mb-8">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {data.map((tab: any, index: number) => (
                      <CarouselItem key={index} className="basis-1/8">
                        <button
                          key={index}
                          className={`px-4 py-2 outline-none rounded-[8px] duration-300 border-2  border-solid ${
                            activeTab === index
                              ? "bg-[#1570EF] hover:bg-blue-700 text-white"
                              : "text-gray-500 border-[#D0D5DD] hover:bg-gray-100"
                          }`}
                          onClick={() => setActiveTab(index)}
                        >
                          {tab.name}
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
              <div>
                {data.map((category: any, index: number) =>
                  category.products.length > 0 ? (
                    <div key={index}>
                      {activeTab === index && (
                        <Carousel
                          opts={{
                            align: "start",
                            loop: true,
                          }}
                        >
                          <CarouselContent>
                            {category.products.map((hotel: any) => (
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
                      )}
                    </div>
                  ) : (
                    activeTab === index && (
                      <div className="min-h-[100px] content-center text-center">
                        <p className="font-bold text-xl">
                          Thông tin đang được cập nhật.....
                        </p>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        {/* End */}
      </div>
    </div>
  );
}
