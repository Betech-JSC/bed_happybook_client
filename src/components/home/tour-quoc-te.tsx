"use client";
import { useState } from "react";
import TourItem from "@/components/tour-item";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import styles from "@/styles/styles.module.scss";

const tours = [
  {
    category: "Du lịch miền Nam",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/tour-quoc-te/1.png",
  },
  {
    category: "Du lịch miền Bắc",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/tour-quoc-te/2.png",
    hot: 1,
  },
  {
    category: "Du lịch miền Trung",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/tour-quoc-te/3.png",
    hot: 1,
  },
  {
    category: "Du lịch miền Trung",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/tour-quoc-te/4.png",
  },
  {
    category: "Du lịch miền Bắc",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000 đồng",
    duration: "3 ngày 2 đêm",
    image: "/tour-quoc-te/2.png",
    hot: 1,
  },
];
export default function TourQuocTe() {
  // const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="hidden lg:block px-3 lg:px-[50px] xl:px-[80px] max__screen">
      <div className="relative mt-12 px-6 py-8 rounded-3xl">
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
            src="/bg-img/tour-quoc-te.png"
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
              <h3 className="text-[32px] font-bold">Tour quốc tế</h3>
            </div>
            <div
              className="flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200"
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
          <p className="text-16 font-medium mt-3">
            Trải nghiệm sắc vàng và khám phá văn hóa mùa thu!
          </p>
          {/* Tabs */}
          <div className="w-full mt-6">
            <div className="border-b border-gray-200">
              <div className="flex space-x-3 mb-8">
                {[
                  "Tour Đông Nam Á",
                  "Tour châu Á",
                  "Tour châu Âu - Úc",
                  "Tour châu Mỹ - Phi",
                ].map((tab, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 focus:outline-none rounded-[8px] duration-300 ${
                      activeTab === index
                        ? "bg-[#1570EF] hover:bg-blue-700 text-white"
                        : "text-gray-500 border-solid border-[#D0D5DD] border-2  hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveTab(index)}
                  >
                    {tab}
                  </button>
                ))}
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
                      {tours.map((tour, index) => (
                        <CarouselItem key={index} className="basis-1/4">
                          <TourItem key={index} {...tour} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
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
              </div>
            </div>
          </div>
        </div>
        {/* End */}
      </div>
    </div>
  );
}
