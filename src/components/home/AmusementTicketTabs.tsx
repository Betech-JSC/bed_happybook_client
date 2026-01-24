"use client";
import { Fragment, useState } from "react";
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
import DisplayPrice from "@/components/base/DisplayPrice";
import { useTranslation } from "@/hooks/useTranslation";

export default function AmusementTicketTabs({
  title,
  data,
}: {
  title: string;
  data: any;
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  return (
    <Fragment>
      <div className="flex justify-between">
        <div>
          <h2 className="text-[24px] lg:text-[32px] font-bold">{t(title)}</h2>
        </div>
        <Link
          href={"/ve-vui-choi"}
          className="hidden lg:flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200"
          style={{ transition: "0.3s" }}
        >
          <button className="text-[#175CD3] font-medium">
            {t("xem_tat_ca")}
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

      <Link
        href={"/ve-vui-choi"}
        className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
      >
        <button className="text-[#175CD3] font-medium">
          {" "}
          {t("xem_tat_ca")}
        </button>
        <Image
          className=" hover:scale-110 ease-in duration-300"
          src="/icon/chevron-right.svg"
          alt="Icon"
          width={20}
          height={20}
        />
      </Link>
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
                     ${activeTab === index
                            ? "bg-[#1570EF] hover:bg-blue-700 text-white"
                            : "text-gray-500 border-[#D0D5DD] hover:bg-gray-100"
                          }`}
                        onClick={() => {
                          setActiveTab(index);
                        }}
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
                  className={`${category.products.length > 0 && activeTab === index
                      ? "block visible"
                      : "hidden invisible"
                    }`}
                >
                  <CarouselContent>
                    {category.products.map((item: any, subIndex: number) => (
                      <CarouselItem
                        key={subIndex}
                        className="basis-10/12 md:basis-5/12 lg:basis-1/4"
                      >
                        <div className="border-solid border-2 border-[#EAECF0] rounded-2xl bg-white">
                          <div className="overflow-hidden rounded-t-2xl	">
                            <Link href={`/ve-vui-choi/${item.slug}`} className="pointer-events-none">
                              <Image
                                className="hover:scale-110 ease-in duration-300 cursor-pointer"
                                src={`${item.image_url}/${item.image_location}`}
                                alt="Image"
                                width={320}
                                height={320}
                                sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                                style={{ height: 200, width: "100%" }}
                              />
                            </Link>
                          </div>
                          <div className="py-3 px-4 h-fit ">
                            <Link
                              href={`/ve-vui-choi/${item.slug}`}
                              className={`text-base pointer-events-none font-semibold ${styles.text_hover_default}`}
                            >
                              <h3
                                data-translate="true"
                                className="h-12 line-clamp-2"
                              >
                                {item.name}
                              </h3>
                            </Link>
                            <div className="mt-2 text-end">
                              <DisplayPrice
                                textPrefix="Giá từ"
                                price={item.min_price}
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
                <div
                  className={`min-h-[100px] content-center text-center ${category.products.length <= 0 && activeTab === index
                      ? "block visible"
                      : "hidden invisible"
                    }`}
                >
                  <p className="font-bold text-xl">
                    {t("thong_tin_dang_cap_nhat")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
}
