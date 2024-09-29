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

const visa = [
  {
    title: "Visa Trung Quốc",
    image: "/visa/1.png",
  },
  {
    title: "Visa Đài Loan",
    image: "/visa/2.png",
  },
  {
    title: "Visa Nhật Bản",
    image: "/visa/3.png",
  },
  {
    title: "Visa Hàn Quốc",
    image: "/visa/4.png",
  },
  {
    title: "Visa Đài Loan",
    image: "/visa/2.png",
  },
];
export default function VisaService() {
  // const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
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
              <h3 className="text-[24px] lg:text-[32px] font-bold">
                Dịch vụ Visa nổi bật
              </h3>
            </div>
            <div
              className="hidden lg:flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200"
              style={{ transition: "0.3s" }}
            >
              <button className="text-[#175CD3] font-medium">
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
            </div>
          </div>
          <p className="text-sm lg:text-16 font-medium mt-3">
            Dịch vụ làm visa nhanh chóng, uy tín, hỗ trợ 24/7. Tỷ lệ đậu cao!
          </p>
          <div className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3">
            <button className="text-[#175CD3] font-medium"> Xem tất cả</button>
            <Image
              className=" hover:scale-110 ease-in duration-300"
              src="/icon/chevron-right.svg"
              alt="Icon"
              width={20}
              height={20}
            />
          </div>
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
                  {[
                    "Visa Hot",
                    "Visa Châu Á",
                    "Visa Châu Phi",
                    "Visa Châu Úc",
                    "Visa Châu Mỹ",
                    "Visa Châu Âu",
                  ].map((tab, index) => (
                    <CarouselItem key={index} className="basis-1/8">
                      <button
                        key={index}
                        className={`h-10 text-sm lg:text-base px-3 lg:px-4 py-2 rounded-[8px] duration-300 ${
                          activeTab === index
                            ? "bg-[#1570EF] hover:bg-blue-700 text-white"
                            : "text-gray-500 border-solid border-[#D0D5DD] border-2 hover:bg-gray-100"
                        }`}
                        onClick={() => setActiveTab(index)}
                      >
                        {tab}
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            <div className="">
              {activeTab === 0 && (
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
                    {visa.map((item, index) => (
                      <CarouselItem
                        key={index}
                        className="basis-10/12 md:basis-5/12 lg:basis-1/4"
                      >
                        <div className="border-solid border-2 border-[#EAECF0] rounded-2xl bg-white">
                          <div className="overflow-hidden rounded-t-2xl	">
                            <Image
                              className="hover:scale-110 ease-in duration-300 cursor-pointer	"
                              src={item.image}
                              alt="Banner"
                              width={200}
                              height={160}
                              sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                              style={{ height: "100%", width: "100%" }}
                            />
                          </div>
                          <div className="py-3 px-4 lg:h-[72px] ">
                            <p
                              className={`text-base font-semibold line-clamp-2 ${styles.text_hover_default}`}
                            >
                              {item.title}
                            </p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden lg:inline-flex" />
                  <CarouselNext className="hidden lg:inline-flex" />
                </Carousel>
              )}
              {activeTab === 1 && (
                <div className="min-h-[100px] content-center text-center">
                  <p className="font-bold text-xl">
                    Thông tin đang được cập nhật.....
                  </p>
                </div>
              )}
              {activeTab === 2 && (
                <div className="min-h-[100px] content-center text-center">
                  <p className="font-bold text-xl">
                    Thông tin đang được cập nhật.....
                  </p>
                </div>
              )}
              {activeTab === 3 && (
                <div className="min-h-[100px] content-center text-center">
                  <p className="font-bold text-xl">
                    Thông tin đang được cập nhật.....
                  </p>
                </div>
              )}
              {activeTab === 4 && (
                <div className="min-h-[100px] content-center text-center">
                  <p className="font-bold text-xl">
                    Thông tin đang được cập nhật.....
                  </p>
                </div>
              )}
              {activeTab === 5 && (
                <div className="min-h-[100px] content-center text-center">
                  <p className="font-bold text-xl">
                    Thông tin đang được cập nhật.....
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* End */}
      </div>
    </div>
  );
}
