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

export default function VisaService({ data }: any) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
      <div className="relative py-6 lg:mt-12 lg:px-6 lg:py-8 rounded-3xl">
        {/* Background */}
        <div
          className="absolute inset-0 hidden lg:block rounded-3xl"
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
            src="/bg-img/visa.png"
            width={1280}
            height={500}
            alt="Background"
            sizes="100vw"
            className="w-full h-full rounded-3xl "
          />
        </div>
        {/* Content */}
        <div className="relative z-10">
          <div className="flex justify-between">
            <div>
              <h2
                className="text-[24px] lg:text-[32px] font-bold"
                data-translate
              >
                Dịch vụ Visa nổi bật
              </h2>
            </div>
            <Link
              href="/visa"
              className="hidden lg:flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200"
              style={{ transition: "0.3s" }}
            >
              <button className="text-[#175CD3] font-medium" data-translate>
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
          <p className="text-sm lg:text-16 font-medium mt-3" data-translate>
            Dịch vụ làm visa nhanh chóng, uy tín, hỗ trợ 24/7. Tỷ lệ đậu cao!
          </p>
          <Link
            href="/visa"
            className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
          >
            <button className="text-[#175CD3] font-medium" data-translate>
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
          {/* Tabs */}
          <div className="w-full mt-6">
            <div className="lg:space-x-3 mb-6 lg:mb-8">
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
                        className={`h-10 text-sm outline-none lg:text-base px-3 lg:px-4 py-2 rounded-[8px] duration-300  border-solid  border-2 
                           ${
                             activeTab === index
                               ? "bg-[#1570EF] hover:bg-blue-700 text-white"
                               : "text-gray-500border-[#D0D5DD] hover:bg-gray-100"
                           }`}
                        onClick={() => setActiveTab(index)}
                        data-translate
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
                    {/* {activeTab === index && ( */}
                    <Carousel
                      opts={{
                        align: "start",
                        loop: true,
                      }}
                      className={`${activeTab === index ? "block" : "hidden"}`}
                    >
                      <CarouselContent>
                        {category.products.map((visa: any) => (
                          <CarouselItem
                            key={visa.id}
                            className="basis-10/12 md:basis-5/12 lg:basis-1/4"
                          >
                            <div className="border-solid border-2 border-[#EAECF0] rounded-2xl bg-white">
                              <div className="overflow-hidden rounded-t-2xl	">
                                <Link href={`/visa/chi-tiet/${visa.slug}`}>
                                  <Image
                                    className="hover:scale-110 ease-in duration-300 cursor-pointer object-cover"
                                    src={`${visa.image_url}/${visa.image_location}`}
                                    alt="Visa Image"
                                    width={320}
                                    height={320}
                                    sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                                    style={{ height: 220, width: "100%" }}
                                  />
                                </Link>
                              </div>
                              <div className="py-3 px-4 lg:h-[72px] ">
                                <Link
                                  href={`/visa/chi-tiet/${visa.slug}`}
                                  className={`text-base font-semibold line-clamp-2 ${styles.text_hover_default}`}
                                >
                                  <h3 data-translate>{visa.name}</h3>
                                </Link>
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden lg:inline-flex" />
                      <CarouselNext className="hidden lg:inline-flex" />
                    </Carousel>
                    {/* )} */}
                  </div>
                ) : (
                  activeTab === index && (
                    <div className="min-h-[100px] content-center text-center">
                      <p className="font-bold text-xl" data-translate>
                        Thông tin đang được cập nhật.....
                      </p>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
        {/* End */}
      </div>
    </div>
  );
}
