"use client";
import TourStyle from "@/styles/tour.module.scss";
import { Fragment, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  buildSearch,
  getLabelRatingProduct,
  renderTextContent,
} from "@/utils/Helper";
import { ComboApi } from "@/api/Combo";
import { formatCurrency } from "@/lib/formatters";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/app/hooks/useTranslation";
import { translatePage } from "@/utils/translateDom";
import { useLanguage } from "@/contexts/LanguageContext";
import DisplayPrice from "@/components/base/DisplayPrice";
import SideBarFilterProduct from "@/components/product/components/SideBarFilter";

export default function SearchResult({
  optionsFilter,
  translatedStaticText,
}: {
  optionsFilter: {
    label: string;
    name: string;
    option: {
      value?: number;
      label?: string;
    }[];
  }[];
  translatedStaticText: {};
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<{
    page: number;
    [key: string]: string | number | boolean | undefined | any;
  }>({
    page: 1,
    from: searchParams.get("from"),
    to: searchParams.get("to"),
  });
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
  const [translatedText, setTranslatedText] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const { language } = useLanguage();
  const { t } = useTranslation(translatedStaticText);

  const loadData = useCallback(async () => {
    try {
      setTranslatedText(false);
      setLoadingLoadMore(true);
      setIsDisabled(true);
      setIsLastPage(false);
      query.locale = language;
      const search = buildSearch(query);
      const res = await ComboApi.search(`/product/combo/search${search}`);
      const result = res?.payload?.data;

      setData((prevData: any[]) => {
        const combined =
          result?.items.length > 0 && !query.isFilters
            ? [...prevData, ...result.items]
            : result.items;

        const uniqueById = Array.from(
          new Map(combined.map((item: any) => [item.id, item])).values()
        );

        return uniqueById;
      });

      if (result?.last_page === query.page) {
        setIsLastPage(true);
      }
      translatePage("#wrapper-search-combo", 10).then(() =>
        setTranslatedText(true)
      );
    } catch (error) {
      console.log("Error search: " + error);
    } finally {
      setFirstLoad(false);
      setIsDisabled(false);
      setLoadingLoadMore(false);
    }
  }, [query, language]);

  const handleFilterChange = (group: string, value: string) => {
    setData([]);
    setQuery((prevFilters) => {
      const groupFilters = Array.isArray(prevFilters[group])
        ? prevFilters[group]
        : [];
      if (groupFilters.includes(value)) {
        return {
          ...prevFilters,
          [group]: groupFilters.filter((item: string) => item !== value),
          page: 1,
          isFilter: true,
        };
      } else {
        return {
          ...prevFilters,
          [group]: [...groupFilters, value],
          page: 1,
          isFilter: true,
        };
      }
    });
  };
  const handleSortData = (value: string) => {
    setData([]);
    const [sort, order] = value.split("|");
    setQuery({ ...query, page: 1, sort: sort, order: order, isFilter: true });
  };

  useEffect(() => {
    loadData();
  }, [query, loadData]);

  if (firstLoad) {
    return (
      <div
        className={`flex mt-6 py-12 mb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
      >
        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
        <span className="text-18">{t("dang_tai_du_lieu")}...</span>
      </div>
    );
  }
  return (
    <div
      id="wrapper-search-combo"
      className="flex flex-col lg:flex-row mt-6 lg:gap-4 items-start pb-8"
    >
      <div className="lg:block w-full lg:w-3/12">
        <SideBarFilterProduct
          setQuery={setQuery}
          query={query}
          isDisabled={isDisabled}
          options={optionsFilter}
          handleFilterChange={handleFilterChange}
          handleSortData={handleSortData}
        />
      </div>
      <div className="w-full lg:w-9/12">
        <div className="hidden lg:flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-32 font-bold">{t("tim_kiem")}</h1>
          <div className="flex my-4 md:my-0 space-x-3 items-center">
            <span>{t("sap_xep")}</span>
            <div className="w-40 bg-white border border-gray-200 rounded-lg">
              <select
                className="px-4 py-2 rounded-lg w-[90%] outline-none bg-white"
                onChange={(e) => {
                  handleSortData(e.target.value);
                }}
                defaultValue={"id|desc"}
              >
                <option value="id|desc">{t("moi_nhat")}</option>
                <option value="id|asc">{t("cu_nhat")}</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mb-4">
          {data?.length > 0 ? (
            data.map((item: any, index: number) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row lg:space-x-6 rounded-3xl bg-white mt-4 transition-opacity duration-700 ${
                  translatedText ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="w-full md:w-5/12 relative overflow-hidden rounded-t-2xl lg:rounded-none lg:rounded-l-2xl">
                  <Link href={`/combo/chi-tiet/${item.slug}`}>
                    <Image
                      className="block hover:scale-110 ease-in duration-300 cursor-pointer h-auto w-full rounded-t-2xl lg:rounded-none lg:rounded-l-2xl object-cover"
                      src={`${item.image_url}/${item.image_location}`}
                      alt="Image"
                      width={360}
                      height={270}
                      sizes="100vw"
                      style={{ maxHeight: 270 }}
                    />
                  </Link>
                </div>
                <div className="w-full px-3 lg:px-0 md:w-7/12 flex flex-col justify-between">
                  <div className="my-4 lg:mr-6">
                    <div className="flex flex-col lg:flex-row space-x-0 space-y-2 lg:space-y-0 lg:space-x-2">
                      <Link
                        href={`/combo/chi-tiet/${item.slug}`}
                        className="w-full md:w-[80%] text-18 font-semibold hover:text-primary duration-300 transition-colors line-clamp-3"
                      >
                        <h2 data-translate="true">
                          {renderTextContent(item.name)}
                        </h2>
                      </Link>
                      <div className="flex w-full md:w-[20%] space-x-1">
                        <>
                          {Array.from({ length: 5 }, (_, index) =>
                            item?.combo?.hotel?.star &&
                            index < item?.combo?.hotel.star ? (
                              <Image
                                key={index}
                                className="w-4 h-4"
                                src="/icon/starFull.svg"
                                alt="Icon"
                                width={16}
                                height={16}
                              />
                            ) : (
                              <Image
                                key={index}
                                className="w-4 h-4"
                                src="/icon/star.svg"
                                alt="Icon"
                                width={16}
                                height={16}
                              />
                            )
                          )}
                        </>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-2 items-center">
                      <Image
                        className="w-4 h-4"
                        src="/icon/marker-pin-01.svg"
                        alt="Icon"
                        width={20}
                        height={20}
                      />
                      <span className="text-sm" data-translate="true">
                        {renderTextContent(item?.combo?.address)}
                      </span>
                    </div>
                    <div className="flex flex-wrap">
                      {item?.combo?.hotel?.amenities?.length > 0 &&
                        item?.combo?.hotel?.amenities.map((item: any) => (
                          <span
                            className="mr-2 mt-2 py-[2px] px-[6px] border border-gray-300 rounded-sm"
                            key={item.id}
                            data-translate="true"
                          >
                            {renderTextContent(item?.hotel_amenity?.name)}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 p-2 lg:mr-6 mt-8 mb-4 items-center justify-between bg-gray-50 rounded-lg">
                    <div className="flex space-x-1">
                      <span className="w-9 h-6 rounded-xl rounded-tr bg-primary text-white font-semibold text-center">
                        {item.average_rating}
                      </span>
                      <div className="flex flex-col space-y-1">
                        <span className="text-primary text-sm font-semibold">
                          {getLabelRatingProduct(item.average_rating)}
                        </span>
                        <span
                          className="text-gray-500 text-xs"
                          data-translate="true"
                        >
                          {item.total_rating} đánh giá
                        </span>
                      </div>
                    </div>
                    <div className="text-base text-end">
                      <DisplayPrice
                        price={item?.price - item?.discount_price}
                        textPrefix={`${
                          item?.discount_price > 0 ? "giá ưu đãi" : "chỉ từ"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className={`flex mt-6 py-12 mb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
            >
              <span className="!border-blue-500 !border-t-blue-200"></span>
              {loadingLoadMore ? (
                <>
                  <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
                  <span className="text-18">{t("dang_tai_du_lieu")}..</span>
                </>
              ) : (
                <span className="text-18">
                  {t("khong_tim_thay_du_lieu_phu_hop")}...
                </span>
              )}
            </div>
          )}
        </div>
        {data?.length > 0 && !isLastPage && (
          <div className="mt-4">
            <button
              onClick={() => {
                setQuery({
                  ...query,
                  page: query.page + 1,
                  isFilters: false,
                });
              }}
              className="flex mx-auto group w-40 py-3 rounded-lg px-4 bg-white mt-6 space-x-2 border duration-300 text__default_hover
            justify-center items-center hover:border-primary"
            >
              {loadingLoadMore ? (
                <span className="loader_spiner"></span>
              ) : (
                <>
                  Xem thêm
                  <svg
                    className="group-hover:stroke-primary stroke-gray-700 duration-300"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
