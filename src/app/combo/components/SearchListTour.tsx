"use client";
import TourStyle from "@/styles/tour.module.scss";
import { Fragment, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buildSearch, getLabelRatingProduct } from "@/utils/Helper";
import { ComboApi } from "@/api/Combo";
import { formatCurrency } from "@/lib/formatters";
import { useSearchParams } from "next/navigation";

export default function SearchListTour({
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
    from: searchParams.get("from"),
    to: searchParams.get("to"),
  });
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const loadData = useCallback(async () => {
    try {
      setLoadingLoadMore(true);
      setIsDisabled(true);
      const search = buildSearch(query);
      const res = await ComboApi.search(`/product/combo/search${search}`);
      const result = res?.payload?.data;
      setData((prevData: any) =>
        result?.items?.length > 0 && !query.isFilters
          ? [...prevData, ...result.items]
          : result?.items
      );
      if (result?.last_page === query.page) {
        setIsLastPage(true);
      }
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
          isFilter: true,
        };
      } else {
        return {
          ...prevFilters,
          [group]: [...groupFilters, value],
          isFilter: true,
        };
      }
    });
  };
  const handleSortData = (value: string) => {
    setData([]);
    const [sort, order] = value.split("|");
    setQuery({ ...query, sort: sort, order: order, isFilter: true });
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
        {optionsFilter?.map((item, index) => (
          <div
            key={index}
            className="pb-3 mb-3 border-b border-gray-200 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none text-sm text-gray-700"
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
                      disabled={isDisabled}
                      id={item.name + index}
                      value={option.value}
                      className={TourStyle.custom_checkbox}
                      onChange={(e) =>
                        handleFilterChange(`${item.name}[]`, e.target.value)
                      }
                    />
                    {item.name === "star" && (
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }, (_, index) =>
                          option.value && index < option.value ? (
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
                      </div>
                    )}
                    <label
                      className={`${
                        item.name === "star"
                      } ? "text-[#667085]" : ""`}
                      htmlFor={item.name + index}
                    >
                      {option.label}
                    </label>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-32 font-bold">Tìm kiếm</h1>
          <div className="flex my-4 md:my-0 space-x-3 items-center">
            <span>Sắp xếp</span>
            <div className="w-40 bg-white border border-gray-200 rounded-lg">
              <select
                className="px-4 py-2 rounded-lg w-[90%] outline-none bg-white"
                onChange={(e) => {
                  handleSortData(e.target.value);
                }}
                defaultValue={"id|desc"}
              >
                <option value="id|desc">Mới nhất</option>
                <option value="id|asc">Cũ nhất</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mb-4">
          {data?.length > 0 ? (
            data.map((item: any, index: number) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row lg:space-x-6 rounded-3xl bg-white mt-4"
              >
                <div className="w-full lg:w-5/12 relative overflow-hidden rounded-l-2xl">
                  <Link href={`/combo/chi-tiet/${item.slug}`}>
                    <Image
                      className="hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full rounded-2xl lg:rounded-none lg:rounded-l-2xl"
                      src={`${item.image_url}/${item.image_location}`}
                      alt="Image"
                      width={360}
                      height={270}
                      sizes="100vw"
                      style={{ height: 270 }}
                    />
                  </Link>
                </div>
                <div className="w-full px-3 lg:px-0 lg:w-7/12 mt-4 lg:mt-0 flex flex-col justify-between">
                  <div className="my-4 mr-6">
                    <div className="flex flex-col lg:flex-row space-x-0 space-y-2 lg:space-y-0 lg:space-x-2">
                      <Link
                        href={`/combo/chi-tiet/${item.slug}`}
                        className="w-[80%] text-18 font-semibold hover:text-primary duration-300 transition-colors line-clamp-3"
                      >
                        <h2>{item.name}</h2>
                      </Link>
                      <div className="flex w-[20%] space-x-1">
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
                      <span className="text-sm">
                        {item?.combo?.address ?? ""}
                      </span>
                    </div>
                    <div className="flex flex-wrap">
                      {item?.combo?.hotel?.amenities?.length > 0 &&
                        item?.combo?.hotel?.amenities.map((item: any) => (
                          <span
                            className="mr-2 mt-2 py-[2px] px-[6px] border border-gray-300 rounded-sm"
                            key={item.id}
                          >
                            {item?.hotel_amenity?.name ?? ""}
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
                        <span className="text-gray-500 text-xs">
                          {item.total_rating} đánh giá
                        </span>
                      </div>
                    </div>
                    {item.price && (
                      <div className="text-base md:text-xl text-primary font-semibold text-end">
                        <span className="text-gray-500 text-sm md:text-base mr-2">
                          chỉ từ
                        </span>
                        {formatCurrency(item.price)}
                      </div>
                    )}
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
        {data?.length > 0 && !isLastPage && (
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
