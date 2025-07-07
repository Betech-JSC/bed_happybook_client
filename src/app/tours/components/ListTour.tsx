"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import TourStyle from "@/styles/tour.module.scss";
import Image from "next/image";
import Link from "next/link";
import {
  buildSearch,
  getLabelRatingProduct,
  renderTextContent,
} from "@/utils/Helper";
import { TourApi } from "@/api/Tour";
import { formatCurrency } from "@/lib/formatters";
import { useSearchParams } from "next/navigation";
import { translatePage } from "@/utils/translateDom";
import SideBarFilterProduct from "@/components/product/components/SideBarFilter";

type optionFilterType = {
  label: string;
  name: string;
  option: {
    value?: number;
    label?: string;
  }[];
};

export default function ListTour({
  type_tour,
  titlePage,
  optionsFilter,
}: {
  type_tour: number | undefined;
  titlePage: string;
  optionsFilter: optionFilterType[];
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<{
    page: number;
    [key: string]: string | number | boolean | undefined | any;
  }>({
    page: 1,
    type_tour: type_tour,
    text: searchParams.get("text"),
  });
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [translatedText, setTranslatedText] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const loadData = useCallback(async () => {
    try {
      setTranslatedText(false);
      setLoadingLoadMore(true);
      setIsDisabled(true);
      setIsLastPage(false);
      setTranslatedText(false);
      setIsDisabled(true);
      const search = buildSearch(query);
      const res = await TourApi.search(`/product/tours/search${search}`);
      const result = res?.payload?.data;

      setData((prevData: any[]) => {
        const map = new Map();

        [...prevData, ...result.items].forEach((item) => {
          map.set(item.id, item);
        });

        const unique = Array.from(map.values());

        return result.items.length > 0 && !query.isFilters
          ? unique
          : result.items;
      });

      if (result?.last_page === query.page) {
        setIsLastPage(true);
      }
      translatePage("#wrapper-search-tours", 10).then(() =>
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
    query.text = "";
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
        className={`min-h-[300px] flex mt-6 py-12 mb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
      >
        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
        <span className="text-18" data-translate>
          Loading.....
        </span>
      </div>
    );
  }
  return (
    <div
      id="wrapper-search-tours"
      className="block lg:flex mt-6 lg:space-x-4 items-start pb-8"
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
        <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-32 font-bold" data-translate="true">
            {titlePage}
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
            data.map((tour: any, index: number) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row lg:space-x-6 rounded-3xl bg-white p-5 mt-4 transition-opacity duration-700 ${
                  translatedText ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="w-full lg:w-5/12 relative overflow-hidden rounded-xl">
                  <Link href={`/tours/${tour.slug}`}>
                    <Image
                      className="hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full min-h-40 object-cover"
                      src={`${tour.image_url}/${tour.image_location}`}
                      alt="Image"
                      width={360}
                      height={270}
                      sizes="100vw"
                      // style={{ height: 270 }}
                    />
                  </Link>
                  <div className="absolute bottom-0 left-0 text-white px-3 py-1 bg-[#4E6EB3] rounded-tr-3xl">
                    <span data-translate="true">
                      {renderTextContent(tour?.category_name)}
                    </span>
                  </div>
                  {tour.is_hot > 0 && (
                    <div className="absolute top-3 left-3 text-white px-3 py-1 bg-[#F27145] rounded-md">
                      <span data-translate="true">Hot tour</span>
                    </div>
                  )}
                </div>
                <div className="w-full lg:w-7/12 mt-4 lg:mt-0 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="text-18 font-semibold hover:text-primary duration-300 transition-colors"
                    >
                      <h2 data-translate="true">
                        {renderTextContent(tour?.product_name)}
                      </h2>
                    </Link>
                    <div className="flex space-x-2 mt-2">
                      {tour.average_rating > 0 && (
                        <Fragment>
                          <span className="w-9 h-6 rounded-xl rounded-tr bg-primary text-white font-semibold text-center">
                            {tour.average_rating}
                          </span>
                          {tour.average_rating >= 2 ? (
                            <span
                              className="text-primary font-semibold"
                              data-translate="true"
                            >
                              {getLabelRatingProduct(tour.average_rating)}
                            </span>
                          ) : (
                            <span className="text-primary font-semibold"></span>
                          )}
                        </Fragment>
                      )}
                      <span className="text-gray-500" data-translate="true">
                        {tour.total_rating ?? 0} đánh giá
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-2 items-center">
                      <Image
                        className="w-4 h-4"
                        src="/icon/clock.svg"
                        alt="Icon"
                        width={18}
                        height={18}
                      />
                      <span data-translate="true">{`${
                        tour.day ? `${tour.day} ngày` : ""
                      } ${tour.night ? `${tour.night} đêm` : ""}`}</span>
                    </div>
                    {tour.start_date && tour.end_date && (
                      <div className="flex space-x-2 mt-2 items-center">
                        <Image
                          className="w-4 h-4"
                          src="/icon/clock-check.svg"
                          alt="Time"
                          width={18}
                          height={18}
                        />
                        <span data-translate="true">{`Khởi hành vào: ${tour.start_date
                          .split("-")
                          .reverse()
                          .join("/")}`}</span>
                      </div>
                    )}
                    {tour.remain && (
                      <div className="flex space-x-2 mt-2 items-center">
                        <Image
                          className="w-4 h-4"
                          src="/icon/Ticket.svg"
                          alt="Time"
                          width={18}
                          height={18}
                        />
                        <span data-translate="true">{`Chỗ trống: ${
                          tour.remain ?? "Liên hệ"
                        }`}</span>
                      </div>
                    )}

                    {tour.depart_point && (
                      <div className="flex space-x-2 mt-2 items-center">
                        <Image
                          className="w-4 h-4"
                          src="/icon/flag.svg"
                          alt="Icon"
                          width={18}
                          height={18}
                        />
                        <span data-translate="true">
                          Khởi hành từ {renderTextContent(tour.depart_point)}
                        </span>
                      </div>
                    )}
                    {tour.destination_point && (
                      <div className="flex space-x-2 mt-2 items-center">
                        <Image
                          className="w-4 h-4"
                          src="/icon/marker-pin-01.svg"
                          alt="Icon"
                          width={18}
                          height={18}
                        />
                        <span data-translate="true">
                          {renderTextContent(tour.destination_point)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-2xl text-primary font-bold text-end mt-3">
                    {tour.price > 0 ? (
                      <span>
                        {formatCurrency(tour.price - tour.discount_price)}
                      </span>
                    ) : (
                      <span data-translate="true">Liên hệ</span>
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
                  <span className="text-18" data-translate="true">
                    {" "}
                    Loading...
                  </span>
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
