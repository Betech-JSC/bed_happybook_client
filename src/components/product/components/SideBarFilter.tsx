"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import TourStyle from "@/styles/tour.module.scss";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateText } from "@/utils/translateApi";
import { ProductFilterStaticText } from "@/constants/staticText";
import { formatTranslationMap } from "@/utils/translateDom";
import { useTranslation } from "@/app/hooks/useTranslation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isValid, parseISO } from "date-fns";
import { vi, enUS } from "date-fns/locale";

export default function SideBarFilterProduct({
  setQuery,
  query,
  options,
  isDisabled,
  handleFilterChange,
  handleSortData,
  showFilterDate = false,
}: any) {
  const today = new Date();
  const { language } = useLanguage();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [translatedStaticText, setTranslatedStaticText] = useState<{}>({});
  const { t } = useTranslation(translatedStaticText);

  const toggleExpand = (name: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  useEffect(() => {
    translateText(ProductFilterStaticText, language).then((data) => {
      const translationMap = formatTranslationMap(
        ProductFilterStaticText,
        data
      );
      setTranslatedStaticText(translationMap);
    });
  }, [language]);

  const resetFilters = useCallback(() => {
    setQuery((prev: any) => {
      const resetQuery: any = {};
      Object.keys(prev).forEach((key) => {
        const value = prev[key];
        if (typeof value === "string") {
          if (isValid(parseISO(value))) {
            resetQuery[key] = format(new Date(), "yyyy-MM-dd");
          } else resetQuery[key] = "";
        } else if (Array.isArray(value)) {
          resetQuery[key] = [];
        } else if (typeof value === "number") {
          resetQuery[key] = key === "page" ? 1 : 0;
        } else {
          resetQuery[key] = null;
        }
      });
      return resetQuery;
    });
  }, [setQuery]);

  return (
    <Fragment>
      <div className="hidden lg:block w-full p-4 bg-white rounded-2xl">
        {showFilterDate && (
          <div className="pb-3 mb-3 border-b border-gray-200 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none">
            <p className="font-semibold" data-translate="true">
              Ngày đi
            </p>
            <div className="flex h-12 items-center border rounded-lg px-2 mt-2">
              <Image
                src="/icon/calendar.svg"
                alt="Lịch trình"
                className="h-10"
                width={18}
                height={18}
              />
              <div className="w-full [&>div]:w-full">
                <DatePicker
                  selected={query.departureDate}
                  onChange={(date) =>
                    setQuery((prev: any) => ({
                      ...prev,
                      departureDate: format(
                        date ? date : new Date(),
                        "yyyy-MM-dd"
                      ),
                    }))
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn ngày"
                  popperPlacement="bottom-start"
                  minDate={today}
                  locale={language === "vi" ? vi : enUS}
                  onFocus={(e) => e.target.blur()}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  className="z-20 pl-3 w-full outline-none"
                />
              </div>
            </div>
          </div>
        )}
        {options.length > 0 &&
          options.map((group: any, index: number) => {
            const showAll = expandedGroups[group.name];
            const ref = (el: HTMLDivElement) => {
              contentRefs.current[group.name] = el;
            };
            const visibleCount = 5;

            const optionsToShow = group.option;

            return (
              <div
                key={index}
                className="pb-3 mb-3 border-b border-gray-200 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none"
              >
                <div
                  ref={ref}
                  className={`pb-3 overflow-hidden transition-[max-height] ease-in-out duration-500
                    `}
                  style={{
                    maxHeight: showAll
                      ? `${(optionsToShow.length + 1) * 36}px`
                      : `${(visibleCount + 1) * 36}px`,
                  }}
                >
                  <p className="font-semibold" data-translate="true">
                    {group.label}
                  </p>
                  {optionsToShow.length > 0 &&
                    optionsToShow.map((option: any, optionIndex: number) => {
                      if (option) {
                        return (
                          <div
                            key={optionIndex}
                            className={`mt-3 flex space-x-2 items-center ${!showAll && optionIndex > visibleCount
                              ? "invisible"
                              : ""
                              }`}
                          >
                            <input
                              type="checkbox"
                              id={group.name + optionIndex}
                              value={option.value}
                              disabled={isDisabled}
                              className={`flex-shrink-0 ${TourStyle.custom_checkbox}`}
                              onChange={(e) =>
                                handleFilterChange(
                                  `${group.name}[]`,
                                  e.target.value
                                )
                              }
                            />
                            {group.name === "star" && (
                              <label
                                htmlFor={group.name + optionIndex}
                                className="flex space-x-1 cursor-pointer"
                              >
                                {Array.from({ length: 5 }, (_, starIndex) =>
                                  option.value && starIndex < option.value ? (
                                    <Image
                                      key={starIndex}
                                      className="w-auto"
                                      src="/icon/starFull.svg"
                                      alt="Sao đánh giá"
                                      width={10}
                                      height={10}
                                    />
                                  ) : (
                                    <Image
                                      key={starIndex}
                                      className="w-auto"
                                      src="/icon/star.svg"
                                      alt="Sao đánh giá"
                                      width={10}
                                      height={10}
                                    />
                                  )
                                )}
                              </label>
                            )}
                            <label
                              htmlFor={group.name + optionIndex}
                              data-translate="true"
                              className="line-clamp-1 cursor-pointer"
                              title={option.label}
                            >
                              {option.label}
                            </label>
                          </div>
                        );
                      }
                    })}
                </div>
                {group.option.length > visibleCount && (
                  <button
                    className="flex items-center rounded-lg space-x-3"
                    onClick={() => toggleExpand(group.name)}
                  >
                    <span
                      className="text-[#175CD3] font-medium"
                      data-translate="true"
                    >
                      {showAll ? "Thu gọn" : "Xem thêm"}
                    </span>
                    <Image
                      className={`transform transition-transform ${showAll ? "rotate-[270deg]" : "rotate-90"
                        }`}
                      src="/icon/chevron-right.svg"
                      alt="Mũi tên"
                      width={20}
                      height={20}
                    />
                  </button>
                )}
              </div>
            );
          })}
      </div>
      <div className="block lg:hidden mb-4">
        <div>
          <button
            className="bg-blue-600 min-w-[100px] gap-1 justify-center font-medium lg:max-h-10 transition-all duration-300 text-white cursor-pointer flex items-center h-11 rounded-lg outline-none"
            type="button"
            onClick={() => setOpenModal(true)}
          >
            Bộ lọc{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
              />
            </svg>
          </button>
        </div>
        <div
          className={`fixed transition-opacity visible duration-300 px-3 md:px-0 inset-0  bg-black bg-opacity-50 flex justify-center items-center ${openModal ? "visible z-[9999]" : "invisible z-[-1]"
            }`}
          style={{
            opacity: openModal ? "100" : "0",
          }}
        >
          {" "}
          <div className="flex flex-col bg-white py-2 px-4 w-[90vw] h-[80vh] overflow-hidden rounded-2xl">
            <div className="h-10 flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold" data-translate="true">
                Bộ lọc
              </h2>
              {/* <button
                className="text-xl"
                onClick={() => {
                  resetFilters();
                  setOpenModal(false);
                }}
              >
                <Image
                  src="/icon/close.svg"
                  alt="Đóng"
                  className="h-10"
                  width={20}
                  height={20}
                />
              </button> */}
            </div>
            {showFilterDate && (
              <div className="pb-3 mb-3 border-b border-gray-200 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none">
                <p className="font-semibold" data-translate="true">
                  Ngày đi
                </p>
                <div className="flex h-12 items-center border rounded-lg px-2 mt-2">
                  <Image
                    src="/icon/calendar.svg"
                    alt="Lịch trình"
                    className="h-10"
                    width={18}
                    height={18}
                  />
                  <div className="w-full [&>div]:w-full">
                    <DatePicker
                      selected={query.departureDate}
                      onChange={(date) =>
                        setQuery((prev: any) => ({
                          ...prev,
                          departureDate: format(
                            date ? date : new Date(),
                            "yyyy-MM-dd"
                          ),
                        }))
                      }
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày"
                      popperPlacement="bottom-start"
                      minDate={today}
                      locale={language === "vi" ? vi : enUS}
                      onFocus={(e) => e.target.blur()}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      className="z-20 pl-3 w-full outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">
              <div className="mb-3">
                <span className="block mb-2">{t("sap_xep")}</span>
                <div className="w-full bg-white border border-gray-200 rounded-lg">
                  <select
                    className="px-4 py-2 rounded-lg w-[95%] outline-none bg-white"
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
              <div className="flex justify-between items-center mb-4">
                <div className="w-full bg-white rounded-2xl">
                  {options.length > 0 &&
                    options.map((group: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="pb-3 mb-3 border-b border-gray-200 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none"
                        >
                          <div
                            className={`overflow-hidden transition-[max-height] ease-in-out duration-500`}
                          >
                            <p className="font-semibold" data-translate="true">
                              {group.label}
                            </p>
                            {group?.option?.length > 0 &&
                              group.option.map(
                                (option: any, optionIndex: number) => {
                                  if (option) {
                                    return (
                                      <div
                                        key={optionIndex}
                                        className={`mt-3 flex space-x-2 items-center`}
                                      >
                                        <input
                                          type="checkbox"
                                          id={`mb-${group.name}-${optionIndex}`}
                                          value={option.value}
                                          disabled={isDisabled}
                                          className={`flex-shrink-0 ${TourStyle.custom_checkbox}`}
                                          checked={
                                            query[`${group.name}[]`]?.includes(
                                              option?.value?.toString()
                                            ) || false
                                          }
                                          onChange={(e) =>
                                            handleFilterChange(
                                              `${group.name}[]`,
                                              e.target.value
                                            )
                                          }
                                        />
                                        {group.name === "star" && (
                                          <label
                                            htmlFor={`mb-${group.name}-${optionIndex}`}
                                            className="flex space-x-1"
                                          >
                                            {Array.from(
                                              { length: 5 },
                                              (_, starIndex) =>
                                                option.value &&
                                                  starIndex < option.value ? (
                                                  <Image
                                                    key={starIndex}
                                                    className="w-auto"
                                                    src="/icon/starFull.svg"
                                                    alt="Sao đánh giá"
                                                    width={10}
                                                    height={10}
                                                  />
                                                ) : (
                                                  <Image
                                                    key={starIndex}
                                                    className="w-auto"
                                                    src="/icon/star.svg"
                                                    alt="Sao đánh giá"
                                                    width={10}
                                                    height={10}
                                                  />
                                                )
                                            )}
                                          </label>
                                        )}
                                        <label
                                          htmlFor={`mb-${group.name}-${optionIndex}`}
                                          data-translate="true"
                                          className="line-clamp-1"
                                        >
                                          {option.label}
                                        </label>
                                      </div>
                                    );
                                  }
                                }
                              )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 h-10 mt-4">
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                }}
                className="bg-blue-700 border-[1px] text__default_hover hover:bg-inherit text-white rounded-lg h-full inline-flex w-full items-center justify-center"
              >
                Đặt lại
              </button>{" "}
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="bg-primary border-primary border-[1px] text__default_hover hover:bg-inherit text-white rounded-lg h-full inline-flex w-full items-center justify-center"
              >
                Xem kết quả
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
