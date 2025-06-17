"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCallback, useEffect, useRef, useState } from "react";
import TourStyle from "@/styles/tour.module.scss";
import Image from "next/image";
import Link from "next/link";
import { buildSearch, renderTextContent } from "@/utils/Helper";
import { formatCurrency } from "@/lib/formatters";
import { useSearchParams } from "next/navigation";
import { ProductTicket } from "@/api/ProductTicket";
import { translatePage } from "@/utils/translateDom";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { vi, enUS } from "date-fns/locale";
import { format, isValid } from "date-fns";
import SideBarFilterProduct from "@/components/product/components/SideBarFilter";

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
  const today = new Date();
  const { language } = useLanguage();

  const searchParams = useSearchParams();
  const [query, setQuery] = useState<{
    page: number;
    [key: string]: string | number | boolean | undefined | any;
  }>({
    page: 1,
    location: searchParams.get("location") ?? "",
    departureDate: format(today, "yyyy-MM-dd"),
  });
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [translatedText, setTranslatedText] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);

  const toggleExpand = (name: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };
  const loadData = useCallback(async () => {
    try {
      setTranslatedText(false);
      setLoadingLoadMore(true);
      setIsDisabled(true);
      const search = buildSearch(query);
      const res = await ProductTicket.search(`${search}`);
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
      translatePage("#wrapper-search-amusement-ticket", 10).then(() =>
        setTranslatedText(true)
      );
    } catch (error) {
      console.log("Error search: " + error);
    } finally {
      setFirstLoad(false);
      setLoadingLoadMore(false);
      setIsDisabled(false);
    }
  }, [query]);

  const handleFilterChange = (group: string, value: string) => {
    setData([]);
    query.location = "";
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
    setQuery({ ...query, sort: sort, order: order, isFilters: true });
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
        <span className="text-18" data-translate="true">
          Loading...
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col lg:flex-row mt-6 md:gap-4 items-start pb-8">
      <div className="lg:block w-full lg:w-3/12">
        <SideBarFilterProduct
          setQuery={setQuery}
          query={query}
          isDisabled={isDisabled}
          options={optionsFilter}
          handleFilterChange={handleFilterChange}
          handleSortData={handleSortData}
          showFilterDate={true}
        />
      </div>
      <div className="w-full lg:w-9/12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-32 font-bold" data-translate="true">
            Vé vui chơi
          </h1>
          <div className="hidden lg:flex my-4 md:my-0 space-x-3 items-center">
            <span data-translate="true">Sắp xếp</span>
            <div className="w-40 bg-white border border-gray-200 rounded-lg">
              <select
                className="px-4 py-2 rounded-lg w-[90%] outline-none bg-white"
                onChange={(e) => {
                  handleSortData(e.target.value);
                }}
                defaultValue={"id|desc"}
              >
                <option value="id|desc" data-translate="true">
                  Mới nhất
                </option>
                <option value="id|asc" data-translate="true">
                  Cũ nhất
                </option>
              </select>
            </div>
          </div>
        </div>
        <div className="mb-4">
          {data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
              {data.map((item: any, index: number) => {
                return (
                  <div key={index} className="rounded-xl">
                    <div
                      className={`w-full relative overflow-hidden rounded-t-xl transition-opacity duration-700 ${
                        translatedText ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Link
                        href={`/ve-vui-choi/${item.slug}?departDate=${query.departureDate}`}
                      >
                        <Image
                          className="hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full"
                          src={`${item.image_url}/${item.image_location}`}
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
                        href={`/ve-vui-choi/${item.slug}?departDate=${query.departureDate}`}
                        className="text-base font-bold line-clamp-2 h-12"
                        data-translate="true"
                      >
                        {renderTextContent(item.name)}
                      </Link>
                      <div className="mt-1 text-end">
                        <span>Giá từ </span>
                        <span className="text-xl font-semibold text-right text-primary">
                          {formatCurrency(item.minPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className={`flex mt-6 py-12 mb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
            >
              <span className="!border-blue-500 !border-t-blue-200"></span>
              {loadingLoadMore ? (
                <>
                  <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
                  <span className="text-18">Loading...</span>
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
                  <span>{language === "vi" ? "Xem thêm" : "See more"}</span>
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
