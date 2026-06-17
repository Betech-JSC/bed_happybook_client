"use client";
import { Fragment, useState, useMemo } from "react";
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

export default function BusinessLoungeTabs({
  title,
  data,
}: {
  title: string;
  defaultCategoryAlias?: string;
  data: any;
}) {
  const { t, lang } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const [linkCategory, setLinkCategory] = useState<string>(
    "/phong-cho-thuong-gia?country[]=Việt Nam"
  );

  // Phân loại phòng chờ thành "Trong nước" và "Quốc tế"
  const tabData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Gom tất cả sản phẩm phòng chờ từ API
    const allProducts = data.reduce((acc: any[], cat: any) => {
      return acc.concat(cat.products || []);
    }, []);

    const trongNuoc = allProducts.filter((p: any) => {
      const country = p.business_lounge?.country || "";
      return ["vietnam", "viet nam", "việt nam"].includes(
        country.toLowerCase().trim()
      );
    });

    const quocTe = allProducts.filter((p: any) => {
      const country = p.business_lounge?.country || "";
      return !["vietnam", "viet nam", "việt nam"].includes(
        country.toLowerCase().trim()
      );
    });

    return [
      {
        name: t("phong_cho_trong_nuoc"),
        alias: "trong-nuoc",
        products: trongNuoc,
      },
      {
        name: t("phong_cho_quoc_te"),
        alias: "quoc-te",
        products: quocTe,
      },
    ];
  }, [data, t]);

  return (
    <Fragment>
      <div className="flex justify-between">
        <div>
          <h2 className="text-[24px] lg:text-[32px] font-bold">{t(title)}</h2>
        </div>
        <Link
          href={linkCategory}
          className="hidden lg:flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200"
          style={{ transition: "0.3s" }}
        >
          <button className="text-[#175CD3] font-medium">
            {t("xem_tat_ca")}
          </button>
          <Image
            className=" hover:scale-110 ease-in duration-300"
            src="/icon/chevron-right.svg"
            alt={t("xem_tat_ca")}
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link
        href={linkCategory}
        className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
      >
        <button className="text-[#175CD3] font-medium">
          {t("xem_tat_ca")}
        </button>
        <Image
          className=" hover:scale-110 ease-in duration-300"
          src="/icon/chevron-right.svg"
          alt={t("xem_tat_ca")}
          width={20}
          height={20}
        />
      </Link>
      <div className="w-full mt-6">
        <div className="lg:space-x-3 mb-6 lg:mb-8">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
          >
            <CarouselContent>
              {tabData.map(
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
                        onClick={() => {
                          setActiveTab(index);
                          setLinkCategory(
                            tab.alias === "trong-nuoc"
                              ? "/phong-cho-thuong-gia?country[]=Việt Nam"
                              : "/phong-cho-thuong-gia"
                          );
                          if (!visited.includes(index)) {
                            setVisited([...visited, index]);
                          }
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
          {tabData.map((category: any, index: number) => {
            const isVisited = visited.includes(index);
            if (!isVisited) return null;
            return (
              <div
                key={index}
                className={index === activeTab ? "block" : "hidden"}
              >
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className={`${
                    category.products.length > 0
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
                        <div
                          key={item.id}
                          className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-150 hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="w-full relative overflow-hidden">
                            <Link href={`/phong-cho-thuong-gia/${item.slug}`}>
                              {item.image_location ? (
                                <Image
                                  className="hover:scale-105 ease-in duration-300 cursor-pointer w-full h-[200px] object-cover bg-gray-100"
                                  src={`${item.image_url}/${item.image_location}`}
                                  alt={item.name}
                                  width={360}
                                  height={240}
                                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 360px"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="flex w-full h-[200px] bg-slate-200 justify-center items-center font-semibold text-lg">
                                  No Image
                                </div>
                              )}
                              {(item.business_lounge?.iata_code || (item.discount_price > 0 && item.price > 0)) && (
                                <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                                  {item.business_lounge?.iata_code && (
                                    <span className="bg-black/55 text-white text-[12px] font-bold tracking-wide px-2.5 py-1 rounded-md backdrop-blur-sm">
                                      {item.business_lounge.iata_code}
                                    </span>
                                  )}
                                  {item.discount_price > 0 && item.price > 0 && (
                                    <span className="bg-[#F27145] text-white text-[12px] font-bold px-2 py-1 rounded-md shadow-sm" data-translate="true">
                                      {t("giam")} {Math.round((item.discount_price / item.price) * 100)}%
                                    </span>
                                  )}
                                </div>
                              )}
                            </Link>
                          </div>
                          <div className="py-3 px-4 flex-1 flex flex-col justify-between">
                            <div>
                              <Link
                                href={`/phong-cho-thuong-gia/${item.slug}`}
                                className={`text-base font-semibold ${styles.text_hover_default}`}
                              >
                                <h3
                                  data-translate="true"
                                  className="h-12 line-clamp-2"
                                >
                                  {item.name}
                                </h3>
                              </Link>
                            </div>
                            <div className="mt-2 flex items-baseline justify-end gap-2.5 mt-auto">
                              {(() => {
                                const sale =
                                  item.discount_price > 0 && item.price > 0
                                    ? item.price - item.discount_price
                                    : item.min_price || item.price || 0;
                                const original =
                                  item.discount_price > 0 && item.price > 0
                                    ? item.price
                                    : item.price > sale
                                    ? item.price
                                    : 0;
                                return (
                                  <Fragment>
                                    {original > sale && (
                                      <DisplayPrice
                                        price={original}
                                        currency={item?.currency}
                                        className="!text-gray-400 !line-through !font-normal !text-[13px]"
                                      />
                                    )}
                                    <DisplayPrice
                                      price={sale}
                                      currency={item?.currency}
                                      className="!text-[#F27145] !font-extrabold !text-lg"
                                    />
                                  </Fragment>
                                );
                              })()}
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
                    category.products.length <= 0
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
