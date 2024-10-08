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

interface Tabs {
  name: string;
}
interface Props {
  tabs: Tabs[];
}
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
export default function VisaItem({ tabs }: Props) {
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
            {tabs.map((tab, index) => (
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
                  {tab.name}
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
  );
}
