"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import TourStyle from "@/styles/tour.module.scss";
import Image from "next/image";
import Link from "next/link";
import { buildSearch, getLabelRatingProduct } from "@/utils/Helper";
import { TourApi } from "@/api/Tour";
import { formatCurrency } from "@/lib/formatters";
import { useSearchParams } from "next/navigation";

type optionFilterType = {
  label: string;
  name: string;
  option: {
    value?: number;
    label?: string;
  }[];
};

export default function Search({
  optionsFilter,
}: {
  optionsFilter: optionFilterType[];
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
  //   const [data, setData] = useState<any>([]);
  const data = [
    {
      image: "/ve-vui-choi/1.png",
      name: "Vé VinWonders Phú Quốc",
      price: 710000,
      slug: "vinwonders-ha-noi",
    },
    {
      image: "/ve-vui-choi/2.png",
      name: "Vé Vinpearl Safari Phú Quốc",
      price: 650000,
      slug: "vinwonders-ha-noi",
    },
    {
      image: "/ve-vui-choi/3.png",
      name: "Vé Bảo tàng gấu Teddy Phú Quốc",
      price: 710000,
      slug: "vinwonders-ha-noi",
    },
    {
      image: "/ve-vui-choi/3.png",
      name: "Vé Vinpearl Safari Phú Quốc",
      price: 710000,
      slug: "vinwonders-ha-noi",
    },
    {
      image: "/ve-vui-choi/1.png",
      name: "Vé VinWonders Phú Quốc",
      price: 710000,
      slug: "vinwonders-ha-noi",
    },
    {
      image: "/ve-vui-choi/2.png",
      name: "Vé Bảo tàng gấu Teddy Phú Quốc",
      price: 710000,
      slug: "vinwonders-ha-noi",
    },
  ];
  //   const loadData = useCallback(async () => {
  //     try {
  //       setLoadingLoadMore(true);
  //       setIsDisabled(true);
  //       const search = buildSearch(query);
  //       const res = await TourApi.search(`/product/tours/search${search}`);
  //       const result = res?.payload?.data;
  //       setData((prevData: any) =>
  //         result.items.length > 0 && !query.isFilters
  //           ? [...prevData, ...result.items]
  //           : result.items
  //       );
  //       if (result?.last_page === query.page) {
  //         setIsLastPage(true);
  //       }
  //     } catch (error) {
  //       console.log("Error search: " + error);
  //     } finally {
  //       setFirstLoad(false);
  //       setLoadingLoadMore(false);
  //       setIsDisabled(false);
  //     }
  //   }, [query]);

  //   const handleFilterChange = (group: string, value: string) => {
  //     setData([]);
  //     setQuery((prevFilters) => {
  //       const groupFilters = Array.isArray(prevFilters[group])
  //         ? prevFilters[group]
  //         : [];
  //       if (groupFilters.includes(value)) {
  //         return {
  //           ...prevFilters,
  //           [group]: groupFilters.filter((item: string) => item !== value),
  //           isFilter: true,
  //         };
  //       } else {
  //         return {
  //           ...prevFilters,
  //           [group]: [...groupFilters, value],
  //           isFilter: true,
  //         };
  //       }
  //     });
  //   };
  //   const handleSortData = (value: string) => {
  //     setData([]);
  //     const [sort, order] = value.split("|");
  //     setQuery({ ...query, sort: sort, order: order, isFilters: true });
  //   };

  //   useEffect(() => {
  //     loadData();
  //   }, [query, loadData]);

  //   if (firstLoad) {
  //     return (
  //       <div
  //         className={`flex mt-6 py-12 mb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
  //       >
  //         <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
  //         <span className="text-18">Đang tải dữ liệu...</span>
  //       </div>
  //     );
  //   }
  //   if (!data) return;
  return (
    <div className="flex mt-6 md:space-x-4 items-start pb-8">
      <div className="hidden md:block md:w-4/12 lg:w-3/12 p-4 bg-white rounded-2xl">
        {optionsFilter?.length > 0 &&
          optionsFilter.map((item: optionFilterType, index: number) => (
            <div
              key={index}
              className="pb-3 mb-3 border-b border-gray-200 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none"
            >
              <p className="font-semibold">{item.label}</p>
              {item?.option?.length > 0 ? (
                item.option.map((option, index) => {
                  return (
                    index < 20 && (
                      <div
                        key={option.value}
                        className="mt-3 flex space-x-2 items-center"
                      >
                        <input
                          id={item.name + index}
                          type="checkbox"
                          value={option.value}
                          disabled={isDisabled}
                          className={TourStyle.custom_checkbox}
                          //   onChange={(e) =>
                          //     handleFilterChange(`${item.name}[]`, e.target.value)
                          //   }
                        />
                        <label htmlFor={item.name + index}>
                          {option.label}
                        </label>
                      </div>
                    )
                  );
                })
              ) : (
                <p className="mt-1 text-base text-gray-700">
                  Dữ liệu đang cập nhật...
                </p>
              )}
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
          <h1 className="text-32 font-bold">Vé vui chơi</h1>
          <div className="flex my-4 md:my-0 space-x-3 items-center">
            <span>Sắp xếp</span>
            <div className="w-40 bg-white border border-gray-200 rounded-lg">
              <select
                className="px-4 py-2 rounded-lg w-[90%] outline-none bg-white"
                // onChange={(e) => {
                //   handleSortData(e.target.value);
                // }}
                defaultValue={"id|desc"}
              >
                <option value="id|desc">Mới nhất</option>
                <option value="id|asc">Cũ nhất</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mb-4">
          {data.length > 0 ? (
            <div className="grid grid-cols-3 gap-6 mt-4">
              {data.map((item: any, index: number) => (
                <div key={index} className="rounded-xl">
                  <div className="w-full relative overflow-hidden rounded-t-xl">
                    <Link href={`/ve-vui-choi/chi-tiet/${item.slug}`}>
                      <Image
                        className="hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full"
                        src={item.image}
                        alt="Image"
                        width={360}
                        height={270}
                        sizes="100vw"
                        style={{ height: 217 }}
                      />
                    </Link>
                  </div>
                  <div className="py-3 px-5 bg-white rounded-b-xl">
                    <Link
                      href={`/ve-vui-choi/chi-tiet/${item.slug}`}
                      className="text-base font-bold line-clamp-2 h-12"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xl font-semibold mt-2 text-right text-primary">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
