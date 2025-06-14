"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { VisaApi } from "@/api/Visa";
import { buildSearch, displayProductPrice } from "@/utils/Helper";
import { formatTranslationMap, translatePage } from "@/utils/translateDom";
import { translateText } from "@/utils/translateApi";
import { visaStaticText } from "@/constants/staticText";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import SearchFilters from "./SearchFilters";
import { debounce } from "lodash";
import { formatCurrency } from "@/lib/formatters";
import SideBarFilterProduct from "@/components/product/components/SideBarFilter";

export default function ListVisa({
  alias,
  optionsFilter,
  searchParams,
}: {
  alias?: string;
  searchParams?: { [key: string]: string };
  optionsFilter: {
    label: string;
    name: string;
    option: string[];
  }[];
}) {
  const { language } = useLanguage();
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
  const [translatedStaticText, setTranslatedStaticText] = useState<{}>({});
  const [translatedText, setTranslatedText] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [query, setQuery] = useState<{
    page: number;
    [key: string]: string | number | boolean | undefined | any;
  }>({
    page: 1,
    category_slug: alias ?? "",
    text: searchParams?.text ?? "",
    "loai_visa[]":
      searchParams && searchParams["loai_visa[]"]
        ? [searchParams["loai_visa[]"]]
        : [],
  });

  useEffect(() => {
    translateText(visaStaticText, language).then((data) => {
      const translationMap = formatTranslationMap(visaStaticText, data);
      setTranslatedStaticText(translationMap);
    });
  }, [language]);

  const { t } = useTranslation(translatedStaticText);

  const performSearch = useCallback(async () => {
    try {
      query.locale = language;
      const search = buildSearch(query);

      const res = await VisaApi.search(`/product/visa/search${search}`);
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

      await translatePage("#wrapper-search-visa", 10);
      setTranslatedText(true);
    } catch (error) {
      console.log("Error search: " + error);
    } finally {
      setFirstLoad(false);
      setIsDisabled(false);
      setLoadingLoadMore(false);
    }
  }, [query, language]);

  const debouncedSearch = useMemo(
    () => debounce(performSearch, 500),
    [performSearch]
  );

  const loadData = useCallback(async () => {
    setTranslatedText(false);
    setLoadingLoadMore(true);
    setIsDisabled(true);
    debouncedSearch();
  }, [debouncedSearch]);

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
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch, loadData]);

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
      id="wrapper-search-visa"
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
          <h1 className="text-32 font-bold">{t("dich_vu_visa")}</h1>
          <div className="hidden lg:flex my-4 md:my-0 space-x-3 items-center">
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
        <div>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {data.length > 0 ? (
              data.map((item: any, index: number) => (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row lg:space-x-6 rounded-3xl bg-white p-3 md:p-5 transition-opacity duration-700 ${
                    translatedText ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="w-full lg:w-5/12 relative overflow-hidden rounded-xl">
                    <Link href={`/visa/chi-tiet/${item.slug}`}>
                      <Image
                        className="hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full"
                        src={`${item.image_url}/${item.image_location}`}
                        alt="Image"
                        width={360}
                        height={270}
                        sizes="100vw"
                        style={{ height: "auto", width: "100%" }}
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
                        href={`/visa/chi-tiet/${item.slug}`}
                        className="text-18 font-semibold hover:text-primary duration-300 transition-colors"
                      >
                        <h2>{item.name}</h2>
                      </Link>
                      <div className="mt-3 font-semibold">
                        <span className="mr-1">{`${t("loai_visa")}:`}</span>
                        <span>{item.loai_visa ?? ""}</span>
                      </div>
                      <div className="mt-3 font-semibold">
                        <span className="mr-1">{`${t("diem_den")}:`}</span>
                        <span>{item.diem_den ?? ""}</span>
                      </div>
                      <div className="mt-3 font-semibold">
                        <span className="mr-1">{`${t(
                          "thoi_gian_lam_visa"
                        )}:`}</span>
                        <span>{item.thoi_gian_lam_visa ?? ""}</span>
                      </div>
                      <div className="mt-3 font-semibold">
                        <span className="mr-1">{`${t(
                          "thoi_gian_luu_tru"
                        )}:`}</span>
                        <span>{item.thoi_gian_luu_tru ?? ""}</span>
                      </div>
                      <div className="mt-3 font-semibold">
                        <span className="mr-1">{`${t(
                          "so_lan_nhap_canh"
                        )}:`}</span>
                        <span>{item.so_lan_nhap_canh ?? ""}</span>
                      </div>
                      {item.phi_nop_tai_dsq && (
                        <div className="mt-3 font-semibold">
                          <span className="mr-1">{`${t(
                            "phi_nop_tai_dsq"
                          )}:`}</span>
                          <span>{item.phi_nop_tai_dsq ?? ""}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-end mt-3">
                      {item?.price > 0 ? (
                        <div className="flex gap-2 justify-end items-end font-semibold">
                          <p data-translate="true">Giá </p>
                          <p className="text-xl text-primary">
                            {displayProductPrice(item.price, item?.currency)}
                          </p>
                        </div>
                      ) : (
                        <p
                          data-translate="true"
                          className="text-xl text-primary font-semibold"
                        >
                          Liên hệ
                        </p>
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
                    <span className="text-18">Loading...</span>
                  </>
                ) : (
                  !data?.length && (
                    <span className="text-18">
                      {t("khong_tim_thay_du_lieu_phu_hop")}
                    </span>
                  )
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
                  });
                }}
                className="flex mx-auto group w-40 py-3 rounded-lg px-4 bg-white mt-6 space-x-2 border duration-300 text__default_hover
                justify-center items-center hover:border-primary"
              >
                {loadingLoadMore ? (
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
    </div>
  );
}
