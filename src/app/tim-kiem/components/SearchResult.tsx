"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCallback, useEffect, useRef, useState } from "react";
import TourStyle from "@/styles/tour.module.scss";
import Image from "next/image";
import Link from "next/link";
import { buildSearch, renderTextContent } from "@/utils/Helper";
import { useSearchParams } from "next/navigation";
import { translatePage } from "@/utils/translateDom";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { format, isValid } from "date-fns";
import { ProductYachtApi } from "@/api/ProductYacht";
import SideBarFilterProduct from "@/components/product/components/SideBarFilter";
import DisplayPrice from "@/components/base/DisplayPrice";

type optionFilterType = {
  label: string;
  name: string;
  option: {
    value?: number;
    label?: string;
  }[];
};

export default function SearchAllResult({
  optionsFilter,
}: {
  optionsFilter: optionFilterType[];
}) {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<{
    [key: string]: string | number | boolean | undefined | any;
  }>({
    keyword: searchParams.get("keyword") ?? "",
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
      const res = await ProductYachtApi.search(`${search}`);
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
    <div
      className={`flex mt-6 pt-12 pb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
    >
      <span className="text-18" data-translate="true">
        Không tìm thấy dữ liệu phù hợp...
      </span>
    </div>
  );
}
