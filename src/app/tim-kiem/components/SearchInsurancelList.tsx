"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";
import { addDays, format, differenceInDays } from "date-fns";
import { renderTextContent } from "@/utils/Helper";
import { formatCurrency } from "@/lib/formatters";
import { useRouter } from "next/navigation";
import { isEmpty } from "lodash";
import DisplayImage from "@/components/base/DisplayImage";
import useEmblaCarousel from "embla-carousel-react";

export default function SearchInsuranceList({ insurances }: any) {
  const router = useRouter();
  const [showDetail, setShowDetail] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);

  const departDate = new Date();
  const returnDate = addDays(departDate, 1);
  const diffDate = differenceInDays(returnDate, departDate);
  const toggleShowDetail = useCallback(
    (id: number) => {
      setShowDetail(showDetail === id ? null : id);
    },
    [showDetail]
  );
  const handleChoose = (id: number) => {
    router.push(`/bao-hiem/checkout/${id}`);
  };

  return (
    <Fragment>
      <div className="mt-8 mb-4 flex flex-col lg:flex-row gap-3 justify-between">
        <div>
          <h2
            className="text-[24px] lg:text-[32px] font-bold"
            data-translate="true"
          >
            Bảo hiểm{" "}
          </h2>
        </div>
        <Link
          href="/bao-hiem"
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
            alt="Xem tất cả"
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
          {insurances.map((item: any, index: number) => {
            const matchedInsurancePackagePrice =
              item?.insurance_package_prices?.find(
                (item: any) =>
                  diffDate >= item.day_start && diffDate <= item.day_end
              );
            const matchedFee =
              parseInt(matchedInsurancePackagePrice?.parsed_price) ?? 0;
            const totalFee = matchedFee * 1;
            const currencyFormatDisplay =
              item?.currency.toLowerCase() === "usd" ? "en" : "vi";
            return (
              <CarouselItem key={index} className="basis-full">
                <>
                  <div className="grid gap-1 grid-cols-8 items-start justify-between bg-white p-4 rounded-lg relative">
                    <div className="col-span-8 lg:col-span-3">
                      <div className="flex flex-col md:flex-row items-start gap-4 text-center md:text-left mb-3">
                        <div className="w-full md:w-[120px] flex-shrink-0">
                          {!isEmpty(item?.insurance_type.image_location) ? (
                            <DisplayImage
                              imagePath={item?.insurance_type.image_location}
                              width={174}
                              height={58}
                              alt={item.name}
                              classStyle="w-full h-auto rounded-sm object-cover "
                            />
                          ) : (
                            <Image
                              src="/default-image.png"
                              width={174}
                              height={58}
                              alt={item.name}
                              className="w-full h-auto object-cover rounded-sm"
                            />
                          )}
                        </div>
                        <div className="flex gap-1 flex-col items-start justify-between space-y-1 lg:space-y-0">
                          <h3 className="text-18 font-bold !leading-normal">
                            {renderTextContent(item.name)}
                          </h3>
                          <p className="line-clamp-5 text-sm font-normal leading-snug text-gray-500 text-justify">
                            {renderTextContent(item.description)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-8 lg:col-span-5">
                      <div
                        className={`grid grid-cols-4 lg:grid-cols-${currencyFormatDisplay === "vi" ? "4" : "5"
                          }`}
                      >
                        {!isEmpty(item.exchange_rate) &&
                          currencyFormatDisplay !== "vi" && (
                            <div className="hidden lg:block col-span-2 lg:col-span-1 text-center">
                              <p className="text-gray-700">Tỷ giá</p>
                              <div className="flex flex-col items-center justify-between space-y-1 lg:space-y-0">
                                <p className="mt-1 leading-snug font-medium">
                                  {formatCurrency(item.exchange_rate)}
                                </p>
                              </div>
                            </div>
                          )}
                        <div className="hidden lg:block col-span-2 lg:col-span-1 text-center">
                          <p className="text-gray-700">Giá / Khách</p>
                          <div className="flex flex-col items-center justify-between space-y-1 lg:space-y-0">
                            <p className="mt-1 leading-snug font-medium">
                              {formatCurrency(
                                matchedFee,
                                currencyFormatDisplay
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="hidden lg:block col-span-2 lg:col-span-1 text-center">
                          <p className="text-gray-700">Số lượng</p>
                          <p className="mt-1 leading-snug font-medium">1</p>
                        </div>
                        <div className="col-span-4 lg:col-span-1 text-right lg:text-center mb-4">
                          <p className="text-gray-700 font-semibold">Tổng</p>
                          <p className="mt-1 leading-snug text-primary text-18 font-semibold">
                            {formatCurrency(totalFee, currencyFormatDisplay)}
                          </p>
                        </div>
                        <div className="col-span-4 lg:col-span-1 w-full text-center md:text-right xl:pr-8">
                          <div className="flex flex-row-reverse w-full lg:flex-col justify-between float-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleChoose(item.id)}
                              className="max-w-32 block text-center w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:text-primary duration-300"
                            >
                              Chọn
                            </button>
                            {/* <button
                              type="button"
                              onClick={() => toggleShowDetail(item.id)}
                              className="text-blue-700 font-medium text-base border-b border-b-blue-700"
                            >
                              Xem quyền lợi
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    ref={contentRef}
                    style={{
                      maxHeight: showDetail === item.id ? "500px" : "0px",
                    }}
                    className={`bg-gray-100 border-2 rounded-2xl relative transition-[opacity,max-height,transform] ease-out duration-500 overflow-hidden ${showDetail === item.id
                        ? `opacity-1 border-blue-500 translate-y-0 mt-4 p-4 `
                        : "opacity-0 border-none -translate-y-6 invisible mt-0 pt-0"
                      } overflow-y-auto rounded-lg`}
                  >
                    <div className="flex flex-col justify-between py-3 px-4 md:px-6 bg-white rounded-lg">
                      <div className="pb-1">
                        <p className="text-blue-700 text-22 font-bold mb-4">
                          Quyền lợi bảo hiểm
                        </p>
                        {item?.insurance_package_benefits?.length > 0 ? (
                          item.insurance_package_benefits.map(
                            (benefit: any, benefitIndex: number) => (
                              <div
                                key={benefitIndex}
                                className="mb-4 pb-4 border-b border-b-gray-200"
                              >
                                <p className="mb-1">
                                  {renderTextContent(benefit.name)}
                                </p>
                                <p className="mb-1">
                                  {renderTextContent(benefit.description)}
                                </p>
                                {benefit.parsed_price > 0 && (
                                  <p className="text-primary text-base font-bold">
                                    {formatCurrency(
                                      benefit.parsed_price,
                                      currencyFormatDisplay
                                    )}
                                  </p>
                                )}
                              </div>
                            )
                          )
                        ) : (
                          <p>Nội dung đang cập nhật...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
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
