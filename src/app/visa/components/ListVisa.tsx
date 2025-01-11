"use client";

import { useCallback, useEffect, useState } from "react";
import TourStyle from "@/styles/tour.module.scss";
import Image from "next/image";
import Link from "next/link";
import { VisaApi } from "@/api/Visa";
import { buildSearch } from "@/utils/Helper";

export default function ListVisa({
  alias,
  optionsFilter,
}: {
  alias: string;
  optionsFilter: {
    label: string;
    name: string;
    option: string[];
  }[];
}) {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [query, setQuery] = useState<{
    page: number;
    [key: string]: string | number | boolean | undefined | any;
  }>({
    page: 1,
  });
  const loadData = useCallback(
    async (reset: boolean = false) => {
      try {
        setLoadingLoadMore(true);
        const search = buildSearch(query);
        const res = await VisaApi.getListByCategory(
          `/product/visa/list-by-category/${alias}${search}`
        );
        const result = res?.payload?.data;
        setData((prevData: any) =>
          reset ? result : [...prevData, ...result.items]
        );
        if (result?.last_page === query.page) {
          setIsLastPage(true);
        }
      } catch (error) {
        console.log("Error search: " + error);
      } finally {
        setFirstLoad(false);
        setLoadingLoadMore(false);
      }
    },
    [query, alias]
  );

  useEffect(() => {
    loadData();
  }, [query, loadData]);

  const handleFilterChange = (group: string, value: string) => {
    setQuery((prevFilters) => {
      const groupFilters = prevFilters[group] || [];
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
    setData([]);
  };
  const handleSortData = (value: string) => {
    const [sort, order] = value.split("|");
    setQuery({ ...query, sort: sort, order: order });
    setData([]);
  };

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
        {optionsFilter &&
          optionsFilter.map((item, index) => (
            <div
              key={index}
              className="pb-3 mb-3 border-b border-gray-200 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none"
            >
              <p className="font-semibold">{item.label}</p>
              {item.option.map((value: string, index: number) => {
                return (
                  index < 10 && (
                    <div
                      key={index}
                      className="mt-3 flex space-x-2 items-center"
                    >
                      <input
                        type="checkbox"
                        id={item.name + index}
                        value={value}
                        className={TourStyle.custom_checkbox}
                        onChange={(e) =>
                          handleFilterChange(`${item.name}[]`, e.target.value)
                        }
                      />
                      <label htmlFor={item.name + index}>{value}</label>
                    </div>
                  )
                );
              })}
              {item.option.length > 5 && (
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
          <h1 className="text-32 font-bold">Dịch vụ Visa</h1>
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
          {data.length > 0 &&
            data.map((item: any, index: number) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row lg:space-x-6 rounded-3xl bg-white p-5 mt-4"
              >
                <div className="w-full lg:w-5/12 relative overflow-hidden rounded-xl">
                  <Link href="/visa/chi-tiet/visa-nhat-ban">
                    <Image
                      className=" hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full"
                      src={`${item.image_url}/${item.image_location}`}
                      alt="Image"
                      width={360}
                      height={270}
                      sizes="100vw"
                      style={{ height: 310, width: "100%" }}
                    />
                  </Link>
                  {item.is_outstanding == 1 && (
                    <div className="absolute top-3 left-3 text-white px-3 py-1 bg-[#F27145] rounded-md">
                      <span>Hot Visa</span>
                    </div>
                  )}
                </div>
                <div className="w-full lg:w-7/12 mt-4 lg:mt-0 flex flex-col justify-between">
                  <div>
                    <Link
                      href="/visa/chi-tiet/visa-nhat-ban"
                      className="text-18 font-semibold hover:text-primary duration-300 transition-colors"
                    >
                      <h2>{item.name}</h2>
                    </Link>
                    <div className="mt-3">
                      <span className="font-semibold">{`Loại Visa: ${
                        item.loai_visa ?? ""
                      }`}</span>
                    </div>
                    <div className="mt-3">
                      <span className="font-semibold">{`Điểm đến: ${
                        item.diem_den ?? ""
                      }`}</span>
                    </div>
                    <div className="mt-3">
                      <span className="font-semibold">{`Thời gian làm Visa: ${
                        item.thoi_gian_lam_visa ?? ""
                      }`}</span>
                    </div>
                    <div className="mt-3">
                      <span className="font-semibold">
                        {`Thời gian lưu trú: ${item.thoi_gian_luu_tru ?? ""}`}
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="font-semibold">
                        {`Số lần nhập cảnh: ${item.so_lan_nhap_canh ?? ""}`}
                      </span>
                    </div>
                    {item.phi_nop_tai_dsq && (
                      <div className="mt-3">
                        <span className="font-semibold">
                          {`Phí nộp tại ĐSQ: ${item.phi_nop_tai_dsq ?? ""}`}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* <div className="text-end mt-3">
                          <p className="line-through text-gray-500">
                            3.000.000 vnđ
                          </p>
                          <p className="mt-2 text-xl text-primary font-semibold">
                            2.500.000 vnđ
                          </p>
                        </div> */}
                </div>
              </div>
            ))}
        </div>
        {!isLastPage && (
          <div className="mt-4">
            <button
              onClick={() => {
                setQuery({
                  ...query,
                  page: query.page + 1,
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
