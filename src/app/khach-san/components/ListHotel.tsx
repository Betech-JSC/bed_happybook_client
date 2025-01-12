"use client";
import { HotelApi } from "@/api/Hotel";
import { formatCurrency } from "@/lib/formatters";
import TourStyle from "@/styles/tour.module.scss";
import { buildSearch, calculatorDiscountPercent } from "@/utils/Helper";
import { Span } from "next/dist/trace";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
  const [isFilters, setIsFilters] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const loadData = useCallback(async () => {
    try {
      setLoadingLoadMore(true);
      const search = buildSearch(query);
      const res = await HotelApi.search(`/product/hotel/search${search}`);
      const result = res?.payload?.data;
      setData((prevData: any) =>
        result.items.length > 0 && !isFilters
          ? [...prevData, ...result.items]
          : result.items
      );
      if (result?.last_page === query.page) {
        setIsLastPage(true);
      }
    } catch (error) {
      console.log("Error search: " + error);
    } finally {
      setFirstLoad(false);
      setIsFilters(false);
      setLoadingLoadMore(false);
    }
  }, [query, isFilters]);

  const handleFilterChange = (group: string, value: string) => {
    setData([]);
    setIsFilters(true);
    setQuery((prevFilters) => {
      const groupFilters = Array.isArray(prevFilters[group])
        ? prevFilters[group]
        : [];
      if (groupFilters.includes(value)) {
        return {
          ...prevFilters,
          [group]: groupFilters.filter((item: string) => item !== value),
        };
      } else {
        return {
          ...prevFilters,
          [group]: [...groupFilters, value],
        };
      }
    });
  };
  const handleSortData = (value: string) => {
    setData([]);
    setIsFilters(true);
    const [sort, order] = value.split("|");
    setQuery({ ...query, sort: sort, order: order });
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
        <span className="text-18">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (!data) return;
  return (
    <div className="flex mt-6 md:space-x-4 items-start pb-8">
      <div className="hidden md:block md:w-4/12 lg:w-3/12 p-4 bg-white rounded-2xl">
        <div className="pb-3 mb-3 border-b border-gray-200 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none">
          <p className="font-semibold">Sắp xếp</p>
          <select
            onChange={(e) => {
              handleSortData(e.target.value);
            }}
            defaultValue={"id|desc"}
            className="py-3 px-4 border border-gray-300 w-full rounded-lg mt-3 outline-none font-semibold"
          >
            <option value="">Đề xuất</option>
            <option value="id|desc">Mới nhất</option>
            <option value="id|asc">Cũ nhất</option>
          </select>
        </div>
        {optionsFilter.map((item, index) => (
          <div
            key={index}
            className="pb-3 mb-3 border-b border-gray-200 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none"
          >
            <p className="font-semibold">{item.label}</p>
            {item.option.map((option, index) => {
              return (
                index < 20 && (
                  <div
                    key={option.value}
                    className="mt-3 flex space-x-2 items-center"
                  >
                    <input
                      type="checkbox"
                      disabled={isFilters ? true : false}
                      id={item.name + index}
                      value={option.value}
                      className={TourStyle.custom_checkbox}
                      onChange={(e) =>
                        handleFilterChange(`${item.name}[]`, e.target.value)
                      }
                    />
                    {/* <div className="flex space-x-1">
                      {value.rating !== undefined && (
                        <>
                          {Array.from({ length: 5 }, (_, index) =>
                            value.rating !== undefined &&
                            index < value.rating ? (
                              <Image
                                key={index}
                                className="w-auto"
                                src="/icon/starFull.svg"
                                alt="Icon"
                                width={10}
                                height={10}
                              />
                            ) : (
                              <Image
                                key={index}
                                className="w-auto"
                                src="/icon/star.svg"
                                alt="Icon"
                                width={10}
                                height={10}
                              />
                            )
                          )}
                        </>
                      )}
                    </div> */}
                    <label htmlFor={item.name + index}>{option.label}</label>
                  </div>
                )
              );
            })}
            {item.option.length > 20 && (
              <button className="mt-3 flex items-center rounded-lg space-x-3 ">
                <span className="text-[#175CD3] font-medium">Xem thêm</span>
                <Image
                  className="hover:scale-110 ease-in duration-300 rotate-90"
                  src="/icon/chevron-right.svg"
                  alt="Icon"
                  width={20}
                  height={20}
                />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="md:w-8/12 lg:w-9/12">
        <div className="mb-4">
          {data.length > 0 ? (
            data.map((item: any, index: number) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row lg:space-x-6 rounded-3xl bg-white mb-4"
              >
                <div className="w-full lg:w-5/12 relative overflow-hidden rounded-l-2xl">
                  <Link href={`/khach-san/chi-tiet/${item.slug}`}>
                    <Image
                      className="hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full rounded-2xl lg:rounded-none lg:rounded-l-2xl"
                      src={`${item.image_url}/${item.image_location}`}
                      alt="Image"
                      width={450}
                      height={350}
                      sizes="100vw"
                      style={{ height: 275, width: "100%" }}
                    />
                  </Link>
                </div>
                <div className="w-full px-3 lg:px-0 lg:w-7/12 mt-4 lg:mt-0 flex flex-col justify-between">
                  <div className="my-4 mr-6">
                    <div className="flex flex-col lg:flex-row space-x-0 space-y-2 lg:space-y-0 lg:space-x-2">
                      <Link
                        href={`/khach-san/chi-tiet/${item.slug}`}
                        className="w-[80%] text-18 font-semibold hover:text-primary duration-300 transition-colors line-clamp-3"
                      >
                        {item.name}
                      </Link>
                      <div className="flex w-[20%] space-x-1">
                        <>
                          {Array.from({ length: 5 }, (_, index) =>
                            item.rating !== undefined && index < item.rating ? (
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
                    <div className="flex space-x-2 mt-2 items-center">
                      <Image
                        className="w-4 h-4"
                        src="/icon/marker-pin-01.svg"
                        alt="Icon"
                        width={20}
                        height={20}
                      />
                      <span className="text-sm">{item.hotel.address}</span>
                    </div>
                    {item?.hotel?.amenity_service.length > 0 && (
                      <div className="w-full">
                        <ul className="mt-2 list-[circle] grid grid-cols-2 items-start pl-4 w-10/12 gap-2">
                          {item.hotel.amenity_service.map(
                            (service: any, index: number) => (
                              <li key={index}>
                                {service.hotel_amenity_service.name}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                    {item.discount_price > 0 &&
                      item.price - item.discount_price <= 0 && (
                        <div className="mt-3 inline-flex py-[2px] px-[6px] rounded-sm text-white bg-blue-700">
                          Hoàn tiền toàn bộ
                        </div>
                      )}
                  </div>
                  <div className="flex space-x-2 p-2 lg:mr-6 mt-3 mb-4 items-end justify-between bg-gray-50 rounded-lg">
                    <div className="flex space-x-1">
                      {item.rating && (
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-[18px] rounded-tr bg-primary text-white font-semibold">
                          {item.rating}
                        </span>
                      )}

                      <div className="flex flex-col space-y-1">
                        {item.rating_text && (
                          <span className="text-primary text-sm font-semibold">
                            Xuất sắc
                          </span>
                        )}
                        <span className="text-gray-500 text-xs">
                          {item.totalReview ?? 0} đánh giá
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div>
                        {item.discount_price > 0 && (
                          <div className="text-sm mr-2 inline-flex py-[2px] px-[6px] rounded-sm text-white bg-blue-700">
                            <span>
                              Giảm{" "}
                              {calculatorDiscountPercent(
                                item.discount_price,
                                item.price
                              )}
                            </span>
                          </div>
                        )}
                        {item.discount_price > 0 && (
                          <span className="text-gray-500 line-through ">
                            {formatCurrency(item.price)}
                          </span>
                        )}
                      </div>
                      <div className="text-base md:text-xl text-primary font-semibold text-end">
                        {item.price - item.discount_price <= 0 ? (
                          <span>0 đ</span>
                        ) : (
                          <>
                            <span className="text-gray-500 text-sm md:text-base mr-2">
                              chỉ từ
                            </span>
                            {item.discount_price
                              ? formatCurrency(item.price - item.discount_price)
                              : formatCurrency(item.price)}
                          </>
                        )}
                      </div>
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
                  <span className="text-18"> Đang tải dữ liệu...</span>
                </>
              ) : (
                <span className="text-18">
                  Không tìm thấy dữ liệu phù hợp...
                </span>
              )}
            </div>
          )}
        </div>
        {data.length > 0 && !isLastPage && (
          <div className="mt-4">
            <button
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
