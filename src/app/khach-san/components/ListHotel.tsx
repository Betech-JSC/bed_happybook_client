"use client";
import { HotelApi } from "@/api/Hotel";
import DisplayPrice from "@/components/base/DisplayPrice";
import SideBarFilterProduct from "@/components/product/components/SideBarFilter";
import { formatCurrency } from "@/lib/formatters";
import TourStyle from "@/styles/tour.module.scss";
import {
  buildSearch,
  calculatorDiscountPercent,
  renderTextContent,
} from "@/utils/Helper";
import { translatePage } from "@/utils/translateDom";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ListHotel({
  optionsFilter,
}: {
  optionsFilter: {
    label: string;
    name: string;
    option: {
      value?: number;
      label?: string;
    }[];
  }[];
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<{
    page: number;
    [key: string]: string | number | boolean | undefined | any;
  }>({
    page: 1,
    text: searchParams.get("text"),
  });
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [translatedText, setTranslatedText] = useState<boolean>(false);

  const [data, setData] = useState<any>([]);
  const loadData = useCallback(async () => {
    try {
      setTranslatedText(false);
      setLoadingLoadMore(true);
      setIsDisabled(true);
      setIsLastPage(false);
      const search = buildSearch(query);
      const res = await HotelApi.search(`/product/hotel/search${search}`);
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
      translatePage("#wrapper-search-hotels", 10).then(() =>
        setTranslatedText(true)
      );
    } catch (error) {
      console.log("Error search: " + error);
    } finally {
      setFirstLoad(false);
      setIsDisabled(false);
      setLoadingLoadMore(false);
    }
  }, [query]);

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
        <span className="text-18">Loading...</span>
      </div>
    );
  }

  return (
    <div
      id="wrapper-search-hotels"
      className="flex flex-col lg:flex-row mt-6 gap-4 items-start pb-8"
    >
      <div className="w-full lg:w-3/12 lg:bg-white lg:rounded-2xl">
        <div className="hidden lg:block p-4 border-b border-gray-200 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none">
          <p className="font-semibold" data-translate="true">
            Sắp xếp
          </p>
          <select
            onChange={(e) => {
              handleSortData(e.target.value);
            }}
            defaultValue={"id|desc"}
            className="py-3 px-4 border border-gray-300 w-full rounded-lg mt-3 outline-none font-semibold"
          >
            <option value="id|desc" data-translate="true">
              Mới nhất
            </option>
            <option value="id|asc" data-translate="true">
              Cũ nhất
            </option>
          </select>
        </div>
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
        <div className="mb-4">
          {data.length > 0 ? (
            data.map((item: any, index: number) => {
              const minPrice = item?.hotel?.rooms?.[0] ?? null;
              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row lg:space-x-6 rounded-3xl bg-white mb-4
                  transition-opacity duration-700  ${
                    translatedText ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="w-full md:w-5/12 relative overflow-hidden md:rounded-l-2xl">
                    <Link href={`/khach-san/${item.slug}`}>
                      <Image
                        className="hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full rounded-t-2xl md:rounded-none md:rounded-l-2xl object-cover"
                        src={`${item.image_url}/${item.image_location}`}
                        alt="Image"
                        width={450}
                        height={350}
                        sizes="100vw"
                        style={{ height: 275, width: "100%" }}
                      />
                    </Link>
                  </div>
                  <div className="w-full px-3 lg:px-0 md:w-7/12 flex flex-col justify-between">
                    <div className="my-4 lg:mr-6">
                      <div className="flex flex-col lg:flex-row space-x-0 space-y-2 lg:space-y-0 lg:space-x-2">
                        <Link
                          data-translate="true"
                          href={`/khach-san/${item.slug}`}
                          className="w-full md:w-[80%] text-18 font-semibold hover:text-primary duration-300 transition-colors line-clamp-3"
                        >
                          {renderTextContent(item.name)}
                        </Link>
                        <div className="flex w-full md:w-[20%] space-x-1">
                          <>
                            {Array.from({ length: 5 }, (_, index) =>
                              item?.hotel?.star && index < item.hotel.star ? (
                                <Image
                                  key={index}
                                  className="w-4 h-4"
                                  src="/icon/starFull.svg"
                                  alt="Icon"
                                  width={10}
                                  height={10}
                                />
                              ) : (
                                <Image
                                  key={index}
                                  className="w-4 h-4"
                                  src="/icon/star.svg"
                                  alt="Icon"
                                  width={10}
                                  height={10}
                                />
                              )
                            )}
                          </>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-2 items-start">
                        <Image
                          className="w-4 h-4 mt-1"
                          src="/icon/marker-pin-01.svg"
                          alt="Icon"
                          width={20}
                          height={20}
                        />
                        <span className="text-sm" data-translate="true">
                          {renderTextContent(item.hotel.address)}
                        </span>
                      </div>
                      {item?.hotel?.amenity_service.length > 0 && (
                        <div className="w-full">
                          <ul className="mt-2 list-[circle] grid grid-cols-2 items-start pl-5 w-full lg:w-10/12 gap-4">
                            {item.hotel.amenity_service.map(
                              (service: any, index: number) => (
                                <li key={index} data-translate="true">
                                  {renderTextContent(
                                    service.hotel_amenity_service.name
                                  )}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                      {minPrice?.discount_price > 0 &&
                        minPrice.price - minPrice.discount_price <= 0 && (
                          <div
                            className="mt-3 inline-flex py-[2px] px-[6px] rounded-sm text-white bg-blue-700"
                            data-translate="true"
                          >
                            Hoàn tiền toàn bộ
                          </div>
                        )}
                    </div>
                    <div className="flex space-x-2 p-2 lg:mr-6 mt-3 mb-4 items-end justify-between bg-gray-50 rounded-lg">
                      <div className="flex space-x-1">
                        {item.rating && (
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-[18px] rounded-tr bg-primary text-white font-semibold">
                            {item.rating ?? 0}
                          </span>
                        )}
                        <div className="flex flex-col space-y-1">
                          <span
                            className="text-primary text-sm font-semibold"
                            data-translate="true"
                          >
                            {item.rating_text ?? ""}
                          </span>

                          <span
                            className="text-gray-500 text-xs"
                            data-translate="true"
                          >
                            {item.totalReview ?? 0} đánh giá
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div>
                          {minPrice?.discount_price > 0 && (
                            <div className="text-sm mr-2 inline-flex gap-1 py-[2px] px-[6px] rounded-sm text-white bg-blue-700">
                              <span data-translate="true">Giảm </span>
                              <span>
                                {calculatorDiscountPercent(
                                  minPrice.discount_price,
                                  minPrice.price
                                )}
                              </span>
                            </div>
                          )}
                          {minPrice?.discount_price > 0 && (
                            <DisplayPrice
                              price={minPrice.discount_price}
                              currency={item?.currency}
                              className="!text-gray-500 !line-through !font-normal !text-base"
                            />
                          )}
                        </div>
                        <div className="text-base md:text-xl text-primary font-semibold text-end">
                          {minPrice?.price > 0 && (
                            <>
                              <span
                                className="text-gray-500 text-sm md:text-base mr-2"
                                data-translate="true"
                              >
                                chỉ từ
                              </span>
                              <DisplayPrice
                                price={
                                  minPrice.discount_price < minPrice.price
                                    ? minPrice.price - minPrice.discount_price
                                    : minPrice.price
                                }
                                currency={item?.currency}
                                className="text-22"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              className={`flex mt-6 py-12 mb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
            >
              <span className="!border-blue-500 !border-t-blue-200"></span>
              {loadingLoadMore ? (
                <>
                  <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
                  <span className="text-18"> Loading...</span>
                </>
              ) : (
                <span className="text-18" data-translate="true">
                  Không tìm thấy dữ liệu phù hợp...
                </span>
              )}
            </div>
          )}
        </div>
        {data.length > 0 && !isLastPage && (
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
                  <span data-translate="true"> Xem thêm</span>
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
