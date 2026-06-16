"use client";

import "react-datepicker/dist/react-datepicker.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buildSearch, renderTextContent } from "@/utils/Helper";
import { useSearchParams } from "next/navigation";
import { translatePage } from "@/utils/translateDom";
import SideBarFilterProduct from "@/components/product/components/SideBarFilter";
import DisplayPrice from "@/components/base/DisplayPrice";
import { useTranslation } from "@/hooks/useTranslation";
import { ProductBusinessLoungeApi } from "@/api/ProductBusinessLounge";
import { useWelcomeDiscount } from "@/hooks/useWelcomeDiscount";

type optionFilterType = {
  label: string;
  name: string;
  option: {
    value?: number | string;
    label?: string;
  }[];
};

export default function Search({
  optionsFilter,
  categoryDefault,
  initialItems = [],
  initialLastPage = 1,
  initialTotal = 0,
  pageSize = 12,
}: {
  optionsFilter: optionFilterType[];
  categoryDefault?: number;
  initialItems?: any[];
  initialLastPage?: number;
  initialTotal?: number;
  pageSize?: number;
}) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const welcomeDiscount = useWelcomeDiscount("business-lounge");

  const [query, setQuery] = useState<{
    page: number;
    [key: string]: string | number | boolean | undefined | any;
  }>({
    page: 1,
    per_page: pageSize,
    location: searchParams.get("location") ?? "",
    "category[]": categoryDefault ? [categoryDefault] : "",
  });

  const [data, setData] = useState<any[]>(initialItems);
  const [total, setTotal] = useState<number>(initialTotal);
  const [isLastPage, setIsLastPage] = useState<boolean>(initialLastPage <= 1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Ô tìm kiếm theo tên/sân bay + khoảng giá (debounce vào query)
  const [keyword, setKeyword] = useState<string>("");

  // Bỏ qua lần fetch đầu vì đã có dữ liệu SSR cho trang 1
  const skipNextLoad = useRef<boolean>(initialItems.length > 0);

  const loadData = useCallback(async () => {
    try {
      setLoadingMore(true);
      setIsDisabled(true);
      const res = await ProductBusinessLoungeApi.search(`${buildSearch(query)}`);
      const result = res?.payload?.data;
      const items: any[] = result?.items ?? [];

      setData((prev) => {
        // page === 1 nghĩa là bộ lọc/sắp xếp/từ khoá vừa đổi -> thay mới; page > 1 -> nối thêm
        const combined = query.page > 1 ? [...prev, ...items] : items;
        return Array.from(
          new Map(combined.map((it: any) => [it.id, it])).values()
        );
      });
      setTotal(result?.total ?? 0);
      setIsLastPage((result?.last_page ?? 1) <= query.page);

      // Dịch phần text động (tên lounge) sang ngôn ngữ hiện tại; không chặn hiển thị ảnh
      translatePage("#wrapper-search-lounge", 10);
    } catch (error) {
      console.log("Error search lounge: " + error);
    } finally {
      setLoadingMore(false);
      setIsDisabled(false);
    }
  }, [query]);

  useEffect(() => {
    if (skipNextLoad.current) {
      skipNextLoad.current = false;
      return;
    }
    loadData();
  }, [query, loadData]);

  // Debounce từ khoá -> query.keyword (reset về trang 1)
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery((prev) => {
        if ((prev.keyword ?? "") === keyword.trim()) return prev;
        return { ...prev, keyword: keyword.trim(), page: 1 };
      });
    }, 450);
    return () => clearTimeout(id);
  }, [keyword]);

  const handleFilterChange = (group: string, value: string) => {
    setQuery((prev) => {
      const groupFilters = Array.isArray(prev[group]) ? prev[group] : [];
      const next = groupFilters.includes(value)
        ? groupFilters.filter((item: string) => item !== value)
        : [...groupFilters, value];
      return { ...prev, [group]: next, location: "", page: 1 };
    });
  };

  const handleSortData = (value: string) => {
    const [sort, order] = value.split("|");
    setQuery((prev) => ({ ...prev, page: 1, sort, order }));
  };

  const loadMore = useCallback(() => {
    if (loadingMore || isLastPage) return;
    setQuery((prev) => ({ ...prev, page: prev.page + 1 }));
  }, [loadingMore, isLastPage]);

  // Infinite scroll: tự tải thêm khi sentinel lọt vào khung nhìn
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "600px" }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [loadMore]);

  return (
    <div
      id="wrapper-search-lounge"
      className="flex flex-col lg:flex-row mt-6 md:gap-4 items-start pb-8"
    >
      <div className="lg:block w-full lg:w-3/12">
        <SideBarFilterProduct
          setQuery={setQuery}
          query={query}
          isDisabled={isDisabled}
          options={optionsFilter}
          handleFilterChange={handleFilterChange}
          handleSortData={handleSortData}
          showFilterDate={false}
        />
      </div>
      <div className="w-full lg:w-9/12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <h1 className="text-32 font-bold">
            {t("phong_cho_thuong_gia")}
            {total > 0 && (
              <span className="text-base font-normal text-gray-500 ml-2">
                ({total})
              </span>
            )}
          </h1>
          <div className="hidden lg:flex my-4 md:my-0 space-x-3 items-center">
            <span>{t("sap_xep")}</span>
            <div className="w-auto min-w-[180px] bg-white border border-gray-200 rounded-lg">
              <select
                className="px-4 py-2 rounded-lg w-[90%] outline-none bg-white"
                onChange={(e) => handleSortData(e.target.value)}
                defaultValue={"price|asc"}
              >
                <option value="id|desc">{t("moi_nhat")}</option>
                <option value="id|asc">{t("cu_nhat")}</option>
                <option value="price|asc">{t("gia_tu_thap_den_cao")}</option>
                <option value="price|desc">{t("gia_tu_cao_xuong_thap")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tìm kiếm theo tên phòng chờ / sân bay / quốc gia */}
        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo tên phòng chờ, sân bay hoặc quốc gia..."
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-white outline-none focus:border-primary"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 stroke-gray-400"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <path d="M21 21l-4.3-4.3" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="mb-4">
          {data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
              {data.map((item: any, index: number) => (
                <div key={item.id ?? index} className="rounded-xl">
                  <div className="w-full relative overflow-hidden rounded-t-xl">
                    <Link href={`/phong-cho-thuong-gia/${item.slug}`}>
                      <Image
                        className="hover:scale-110 ease-in duration-300 cursor-pointer w-full h-[217px] object-cover bg-gray-100"
                        src={
                          item.image_url && item.image_location
                            ? `${item.image_url}/${item.image_location}`
                            : "/default-image.png"
                        }
                        alt={renderTextContent(item.name) || "Phòng chờ thương gia"}
                        width={360}
                        height={270}
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 360px"
                        priority={index < 3}
                        loading={index < 3 ? undefined : "lazy"}
                        unoptimized
                      />
                    </Link>
                  </div>
                  <div className="py-3 px-5 bg-white rounded-b-xl">
                    <Link
                      href={`/phong-cho-thuong-gia/${item.slug}`}
                      className="text-base font-bold line-clamp-2 h-12"
                      data-translate="true"
                    >
                      {renderTextContent(item.name)}
                    </Link>
                    <div className="mt-1 text-end">
                      {welcomeDiscount ? (
                        <div className="flex flex-col items-end">
                          <DisplayPrice
                            price={item.min_price}
                            currency={item?.currency}
                            textPrefix="Giá từ"
                            className="!text-gray-500 !line-through !font-normal !text-sm"
                          />
                          <DisplayPrice
                            price={
                              welcomeDiscount.type === "amount"
                                ? Math.max(0, item.min_price - (item?.currency?.code?.toUpperCase() === "USD" ? 2 : 50000))
                                : Math.max(0, item.min_price * (1 - welcomeDiscount.value / 100))
                            }
                            currency={item?.currency}
                            textPrefix="Giá từ"
                            className="!text-[#F27145] !font-bold !text-lg"
                          />
                        </div>
                      ) : item.discount_price > 0 && item.price > 0 ? (
                        <div className="flex flex-col items-end">
                          <DisplayPrice
                            price={item.price}
                            currency={item?.currency}
                            className="!text-gray-500 !line-through !font-normal !text-sm"
                          />
                          <DisplayPrice
                            price={item.price - item.discount_price}
                            currency={item?.currency}
                            className="!text-[#F27145] !font-bold !text-lg"
                          />
                        </div>
                      ) : (
                        <DisplayPrice
                          price={item.min_price}
                          textPrefix="Giá từ"
                          currency={item?.currency}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex mt-6 py-12 mb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center">
              {loadingMore ? (
                <>
                  <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
                  <span className="text-18">Loading...</span>
                </>
              ) : (
                <span className="text-18">
                  {t("khong_tim_thay_du_lieu_phu_hop")}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Sentinel cho infinite scroll + nút "Xem thêm" dự phòng */}
        {data.length > 0 && !isLastPage && (
          <div ref={sentinelRef} className="mt-4 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="flex group w-40 py-3 rounded-lg px-4 bg-white mt-2 space-x-2 border duration-300 text__default_hover justify-center items-center hover:border-primary"
            >
              {loadingMore ? (
                <span className="loader_spiner"></span>
              ) : (
                <>
                  <span>{t("xem_them")}</span>
                  <svg
                    className="group-hover:stroke-primary stroke-gray-700 duration-300"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
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
