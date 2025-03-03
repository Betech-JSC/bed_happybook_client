"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buildSearch, renderTextContent } from "@/utils/Helper";
import DynamicTag from "@/components/base/DynamicTag";
import PostStyle from "@/styles/posts.module.scss";
import { DinhCuApi } from "@/api/DinhCu";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { translateText } from "@/utils/translateApi";
import { dinhCuStaticText } from "@/constants/staticText";
import { formatTranslationMap } from "@/utils/translateDom";
import { useTranslation } from "@/app/hooks/useTranslation";

type Props = {
  categories?: {
    id: number;
    name: string;
    alias: string;
  }[];
  categoryDetail?: any;
};
export default function ListItem({ categories, categoryDetail }: Props) {
  const [query, setQuery] = useState<{
    page: number;
    [key: string]: string | number | boolean | undefined | any;
  }>({
    page: 1,
    category: categoryDetail ? categoryDetail.alias : "",
  });
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [translatedStaticText, setTranslatedStaticText] = useState<{}>({});
  const { language } = useLanguage();
  const { t } = useTranslation(translatedStaticText);

  useEffect(() => {
    translateText(dinhCuStaticText, language).then((data) => {
      const translationMap = formatTranslationMap(dinhCuStaticText, data);
      setTranslatedStaticText(translationMap);
    });
  }, [language]);

  const loadData = useCallback(async () => {
    try {
      setLoadingLoadMore(true);
      query.locale = language;
      const res = await DinhCuApi.search(
        `/product/dinhcu/search${buildSearch(query)}`
      );
      const result = res?.payload?.data;

      setData((prevData: any) =>
        result.items.length > 0 ? [...prevData, ...result.items] : result.items
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
  }, [query, language]);

  const handleSortData = (value: string) => {
    setData([]);
    const [sort, order] = value.split("|");
    setQuery({ ...query, page: 1, sort: sort, order: order });
    setIsLastPage(false);
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
  if (!data) return;
  return (
    <Fragment>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-32 font-bold">{`${
          categoryDetail ? categoryDetail.name : t("dich_vu_dinh_cu")
        }`}</h2>
        <div className="flex my-4 md:my-0 space-x-3 items-center">
          <span data-translate>{t("sap_xep")}</span>
          <div className="w-40 bg-white border border-gray-200 rounded-lg">
            <select
              className="px-4 py-2 rounded-lg w-[90%] outline-none bg-white"
              onChange={(e) => {
                handleSortData(e.target.value);
              }}
              defaultValue={"id|desc"}
            >
              <option value="id|desc" data-translate>
                {t("moi_nhat")}
              </option>
              <option value="id|asc" data-translate>
                {t("cu_nhat")}
              </option>
            </select>
          </div>
        </div>
      </div>
      {categories && categories.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:flex md:space-x-2 md:flex-wrap mt-3">
          {categories.map((item: any) => (
            <Link href={`/dinh-cu/${item.alias}`} key={item.id}>
              <div
                className="mx-auto w-max group py-3 rounded-lg px-4 bg-white border duration-300 text__default_hover
                          justify-center items-center text-center"
              >
                <span className="font-medium " data-translate>
                  {item.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
      {data?.length > 0 ? (
        <div>
          <div className="mt-8 grid md:grid-cols-3 lg:grid-cols-3 gap-6 w-full">
            {data.map((item: any) => (
              <div key={item.id} className={`${PostStyle.post__item}`}>
                <div className="overflow-hidden rounded-xl">
                  <Link href={`/dinh-cu/chi-tiet/${item.slug}`}>
                    <Image
                      className="hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full"
                      src={`${item.image_url}/${item.image_location}`}
                      alt={item.name}
                      width={500}
                      height={350}
                      sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                      style={{ height: 270, width: "100%" }}
                    />
                  </Link>
                </div>
                <Link href={`/dinh-cu/chi-tiet/${item.slug}`}>
                  <DynamicTag
                    typeElement={"h3" as keyof JSX.IntrinsicElements}
                    className={`ease-in duration-300 text-18 font-semibold mt-3 line-clamp-3 ${PostStyle.post__item_title}`}
                  >
                    {item.name}
                  </DynamicTag>
                </Link>
                <div
                  className="text-base mt-2 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: renderTextContent(item?.content_tim_hieu_visa),
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className={`flex mt-6 py-12 mb-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
        >
          <span className="!border-blue-500 !border-t-blue-200"></span>
          {loadingLoadMore ? (
            <>
              <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
              <span className="text-18">{t("dang_tai_du_lieu")}...</span>
            </>
          ) : (
            <span className="text-18">
              {t("khong_tim_thay_du_lieu_phu_hop")}..
            </span>
          )}
        </div>
      )}

      {data.length > 0 && !isLastPage && (
        <div className="mt-8">
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
    </Fragment>
  );
}
