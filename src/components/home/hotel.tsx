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
                    <>
                      {activeTab === index && (
                        <Carousel
                          opts={{
                            align: "start",
                            loop: true,
                          }}
                        >
                          <CarouselContent>
                            {category.products.map(
                              (hotel: any, index: number) => (
                                <CarouselItem
                                  key={index}
                                  className="basis-10/12 md:basis-5/12 lg:basis-1/4"
                                >
                                  <div className="border-solid border-2 border-[#EAECF0] rounded-2xl bg-white">
                                    <div className="overflow-hidden rounded-2xl relative">
                                      <Link
                                        href={`/khach-san/chi-tiet/${hotel.slug}`}
                                      >
                                        <Image
                                          className=" hover:scale-110 ease-in duration-300 cursor-pointer	"
                                          src={`${hotel.image_url}/${hotel.image_location}`}
                                          alt="Hotel Image"
                                          width={320}
                                          height={320}
                                          sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                                          style={{ height: 220, width: "100%" }}
                                        />
                                      </Link>
                                      {hotel.discount_price > 0 && (
                                        <div className="absolute bottom-0 left-0 text-white px-3 py-1 bg-[#F27145] rounded-tr-3xl">
                                          <span>
                                            Tiết kiệm{" "}
                                            {calculatorDiscountPercent(
                                              hotel.discount_price,
                                              hotel.price
                                            )}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="py-3 px-4">
                                      <p
                                        className={`text-base font-semibold min-h-12 line-clamp-2 ${styles.text_hover_default}`}
                                      >
                                        {hotel.name}
                                      </p>
                                      <div className="flex mt-2">
                                        {Array.from({ length: 4 }).map(
                                          (_, index) => (
                                            <div key={index}>
                                              <Image
                                                src="/icon/start-icon.svg"
                                                alt="start icon"
                                                width={16}
                                                height={16}
                                              />
                                            </div>
                                          )
                                        )}
                                        <div>
                                          <Image
                                            src="/icon/start.svg"
                                            alt="start icon"
                                            width={16}
                                            height={16}
                                            style={{
                                              width: "16px",
                                              height: "16px",
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="line-through text-[#667085] font-semibold h-6">
                                          {hotel.discount_price
                                            ? formatCurrency(hotel.price)
                                            : ""}
                                        </p>

                                        <p className="text-[#F27145] text-xl font-semibold">
                                          {hotel.discount_price
                                            ? formatCurrency(
                                                hotel.price -
                                                  hotel.discount_price
                                              )
                                            : formatCurrency(hotel.price)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </CarouselItem>
                              )
                            )}
                          </CarouselContent>
                          <CarouselPrevious className="hidden lg:inline-flex" />
                          <CarouselNext className="hidden lg:inline-flex" />
                        </Carousel>
                      )}
                    </>
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
