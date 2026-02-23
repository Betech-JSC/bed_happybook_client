"use client";

import { useEffect, useRef, useState } from "react";
import TourStyle from "@/styles/tour.module.scss";
import Image from "next/image";

export default function SearchFilters({
  filters,
  resetFilters,
  searchParams,
  options,
  isDisabled,
  textTranSlate,
  handleFilterChange,
  handleSortData,
}: any) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleExpand = (name: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };
  return (
    <div className="lg:block md:w-4/12 lg:w-3/12">
      <div className="hidden lg:block w-full p-4 bg-white rounded-2xl">
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
                    optionsToShow.map((value: string, optionIndex: number) => {
                      if (value) {
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
                              value={value}
                              disabled={isDisabled}
                              defaultChecked={
                                searchParams && searchParams["loai_visa[]"]
                                  ? searchParams["loai_visa[]"] === value
                                  : undefined
                              }
                              className={`flex-shrink-0 ${TourStyle.custom_checkbox}`}
                              onChange={(e) =>
                                handleFilterChange(
                                  `${group.name}[]`,
                                  e.target.value
                                )
                              }
                            />
                            <label
                              htmlFor={group.name + optionIndex}
                              data-translate="true"
                              className="line-clamp-1"
                            >
                              {value}
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
                      alt="Xem thêm"
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
            className="bg-blue-600 min-w-[100px] justify-center font-medium lg:max-h-10 transition-all duration-300 text-white cursor-pointer flex items-center h-11 rounded-lg outline-none"
            type="button"
            onClick={() => setOpenModal(true)}
          >
            Bộ lọc
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
              <button
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
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="mb-3">
                <span className="block mb-2">{textTranSlate("sap_xep")}</span>
                <div className="w-full bg-white border border-gray-200 rounded-lg">
                  <select
                    className="px-4 py-2 rounded-lg w-[95%] outline-none bg-white"
                    onChange={(e) => {
                      handleSortData(e.target.value);
                    }}
                    defaultValue={"id|desc"}
                  >
                    <option value="id|desc">{textTranSlate("moi_nhat")}</option>
                    <option value="id|asc">{textTranSlate("cu_nhat")}</option>
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
                                (value: string, optionIndex: number) => {
                                  if (value) {
                                    return (
                                      <div
                                        key={optionIndex}
                                        className={`mt-3 flex space-x-2 items-center`}
                                      >
                                        <input
                                          type="checkbox"
                                          id={`mb-${group.name + optionIndex}`}
                                          value={value}
                                          disabled={isDisabled}
                                          defaultChecked={
                                            searchParams &&
                                              searchParams["loai_visa[]"]
                                              ? searchParams["loai_visa[]"] ===
                                              value
                                              : undefined
                                          }
                                          className={`flex-shrink-0 ${TourStyle.custom_checkbox}`}
                                          checked={
                                            filters[
                                              `${group.name}[]`
                                            ]?.includes(value) || false
                                          }
                                          onChange={(e) =>
                                            handleFilterChange(
                                              `${group.name}[]`,
                                              e.target.value
                                            )
                                          }
                                        />
                                        <label
                                          htmlFor={`mb-${group.name + optionIndex
                                            }`}
                                          data-translate="true"
                                          className="line-clamp-1"
                                        >
                                          {value}
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
                Xem visa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
