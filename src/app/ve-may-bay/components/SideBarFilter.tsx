"use client";

import { Fragment, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import TimeRangeSlider from "@/components/base/TimeRangeSlider";
import { formatTimeFromHour } from "@/lib/formatters";
import Image from "next/image";

export default function SideBarFilterFlights({
  setFilters,
  flightStopNum,
  filters,
  handleCheckboxChange,
  airlineData,
  resetFilters,
  t,
}: any) {
  const visibleCount = 5;
  const [showAll, setShowAll] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <Fragment>
      <aside className="hidden xl:block xl:col-span-3 bg-white p-4 rounded-2xl">
        {Array.isArray(flightStopNum) && flightStopNum.length >= 1 && (
          <div className="pb-3 border-b border-gray-200">
            <h2 className="font-semibold">{t("so_diem_dung")}</h2>
            {flightStopNum.map(
              (stopNum: number, index: number) =>
                stopNum >= 1 && (
                  <div key={index} className="flex space-x-2 mt-3 items-center">
                    <input
                      type="checkbox"
                      name="stopNum"
                      value={`${stopNum}`}
                      id={`stopNum_${index}`}
                      onChange={handleCheckboxChange}
                      checked={filters.stopNum.includes(`${stopNum}`)}
                    />
                    <label htmlFor={`${`stopNum_${index}`}`}>
                      {` ${stopNum} ${t("diem_dung")}`}
                    </label>
                  </div>
                )
            )}
          </div>
        )}

        <div className="mt-3 pb-3 border-b border-gray-200">
          <h2 className="font-semibold">Thời gian</h2>
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex gap-2">
              <p>Giờ cất cánh</p>
              <div className="flex gap-2">
                <span>{formatTimeFromHour(filters.departureTime[0])}</span>
                <span>-</span>
                <span>{formatTimeFromHour(filters.departureTime[1])}</span>
              </div>
            </div>
            <div className="slider-container w-[90%] mx-auto mt-1">
              <TimeRangeSlider
                defaultValue={[0, 24]}
                onFinalChange={(time) => {
                  setFilters((prev: any) => ({
                    ...prev,
                    departureTime: time,
                  }));
                }}
                allowCross={false}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex gap-2">
              <p>Giờ hạ cánh</p>
              <div className="flex gap-2">
                <span>{formatTimeFromHour(filters.arrivalTime[0])}</span>
                <span>-</span>
                <span>{formatTimeFromHour(filters.arrivalTime[1])}</span>
              </div>
            </div>
            <div className="slider-container w-[90%] mx-auto mt-1">
              <TimeRangeSlider
                defaultValue={[0, 24]}
                onFinalChange={(time) => {
                  setFilters((prev: any) => ({
                    ...prev,
                    arrivalTime: time,
                  }));
                }}
                allowCross={false}
              />
            </div>
          </div>
        </div>
        <div className="mt-3 pb-3 border-b border-gray-200">
          <h2 className="font-semibold">{t("sap_xep")}</h2>
          <div className="flex space-x-2 mt-3 items-center"></div>
          <div className="flex space-x-2 items-center">
            <input
              type="checkbox"
              name="sortAirLine"
              value="asc"
              id="sortAirLine"
              onChange={handleCheckboxChange}
              checked={filters.sortAirLine === "asc"}
            />
            <label htmlFor="sortAirLine">{t("hang_hang_khong")}</label>
          </div>
        </div>
        {airlineData.length > 0 && (
          <div className="mt-3 pb-3 border-b border-gray-200">
            <h2 className="font-semibold">{t("hang_hang_khong")}</h2>
            <div
              className="flex flex-col overflow-hidden transition-[max-height] ease-in-out duration-500"
              style={{
                maxHeight: showAll
                  ? `${(airlineData.length + 1) * 36}px`
                  : `${visibleCount * 36}px`,
              }}
            >
              {airlineData.map((airline: any, index: number) => {
                return (
                  <div
                    key={index}
                    className={`flex gap-2 items-center mt-3 ${
                      !showAll && index > visibleCount ? "invisible" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="airLine"
                      value={airline.code}
                      id={`airline_${index}`}
                      onChange={handleCheckboxChange}
                      checked={filters.airlines.includes(airline.code)}
                    />
                    <label htmlFor={`airline_${index}`}>{airline.name}</label>
                  </div>
                );
              })}
            </div>
            {airlineData.length > visibleCount && (
              <button
                className="mt-3 flex items-center rounded-lg space-x-3 outline-none"
                onClick={() => setShowAll(!showAll)}
              >
                <span
                  className="text-[#175CD3] font-medium"
                  data-translate="true"
                >
                  {showAll ? "Thu gọn" : "Xem thêm"}
                </span>
                <Image
                  className={`transform transition-transform ${
                    showAll ? "rotate-[270deg]" : "rotate-90"
                  }`}
                  src="/icon/chevron-right.svg"
                  alt="Icon"
                  width={20}
                  height={20}
                />
              </button>
            )}
          </div>
        )}
        <button
          className="w-full mt-3 py-3 bg-blue-600 text-white rounded-lg font-medium"
          onClick={resetFilters}
        >
          {t("xoa_bo_loc")}
        </button>
      </aside>
      <div className="block xl:hidden mt-2">
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
          className={`fixed transition-opacity visible duration-300 px-3 md:px-0 inset-0  bg-black bg-opacity-50 flex justify-center items-center ${
            openModal ? "visible z-[9999]" : "invisible z-[-1]"
          }`}
          style={{
            opacity: openModal ? "100" : "0",
          }}
        >
          {" "}
          <div className="flex flex-col bg-white py-2 px-4 w-[90vw] h-[80vh] overflow-hidden rounded-2xl">
            <div className="h-10 flex justify-between items-center">
              <h2 className="text-2xl font-bold" data-translate="true">
                Bộ lọc
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="mt-3 mb-4">
                {Array.isArray(flightStopNum) && flightStopNum.length >= 1 && (
                  <div className="">
                    <h2 className="font-semibold">{t("so_diem_dung")}</h2>
                    {flightStopNum.map(
                      (stopNum: number, index: number) =>
                        stopNum >= 1 && (
                          <div
                            key={index}
                            className="flex space-x-2 mt-3 items-center"
                          >
                            <input
                              type="checkbox"
                              name="stopNum"
                              value={`${stopNum}`}
                              id={`mb-stopNum_${index}`}
                              onChange={handleCheckboxChange}
                              checked={filters.stopNum.includes(`${stopNum}`)}
                            />
                            <label htmlFor={`${`mb-stopNum_${index}`}`}>
                              {` ${stopNum} ${t("diem_dung")}`}
                            </label>
                          </div>
                        )
                    )}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <h2 className="font-semibold">Thời gian</h2>
                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex gap-2">
                    <p>Giờ cất cánh</p>
                    <div className="flex gap-2">
                      <span>
                        {formatTimeFromHour(filters.departureTime[0])}
                      </span>
                      <span>-</span>
                      <span>
                        {formatTimeFromHour(filters.departureTime[1])}
                      </span>
                    </div>
                  </div>
                  <div className="slider-container w-[85%] mx-auto mt-1">
                    <TimeRangeSlider
                      defaultValue={[0, 24]}
                      onFinalChange={(time) => {
                        setFilters((prev: any) => ({
                          ...prev,
                          departureTime: time,
                        }));
                      }}
                      allowCross={false}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex gap-2">
                    <p>Giờ hạ cánh</p>
                    <div className="flex gap-2">
                      <span>{formatTimeFromHour(filters.arrivalTime[0])}</span>
                      <span>-</span>
                      <span>{formatTimeFromHour(filters.arrivalTime[1])}</span>
                    </div>
                  </div>
                  <div className="slider-container w-[85%] mx-auto mt-1">
                    <TimeRangeSlider
                      defaultValue={[0, 24]}
                      onFinalChange={(time) => {
                        setFilters((prev: any) => ({
                          ...prev,
                          arrivalTime: time,
                        }));
                      }}
                      allowCross={false}
                    />
                  </div>
                </div>
              </div>
              <div className=" mb-4">
                <h2 className="font-semibold">{t("sap_xep")}</h2>
                <div className="mt-3 flex space-x-2 items-center">
                  <input
                    type="checkbox"
                    name="sortAirLine"
                    value="asc"
                    id="mb-sortAirLine"
                    onChange={handleCheckboxChange}
                    checked={filters.sortAirLine === "asc"}
                  />
                  <label htmlFor="mb-sortAirLine">{t("hang_hang_khong")}</label>
                </div>
              </div>
              <div>
                {airlineData.length > 0 && (
                  <div className="mt-3 pb-3 border-b border-gray-200">
                    <h2 className="font-semibold">{t("hang_hang_khong")}</h2>
                    {airlineData.map((airline: any, index: number) => (
                      <div
                        key={index}
                        className="flex space-x-2 mt-3 items-center"
                      >
                        <input
                          type="checkbox"
                          name="airLine"
                          value={airline.code}
                          id={`mb-airline_${index}`}
                          onChange={handleCheckboxChange}
                          checked={filters.airlines.includes(airline.code)}
                        />
                        <label htmlFor={`mb-airline_${index}`}>
                          {airline.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 h-10 mt-4">
              <button
                type="button"
                onClick={() => resetFilters()}
                className="bg-blue-700 border-[1px] text__default_hover hover:bg-inherit text-white rounded-lg h-full inline-flex w-full items-center justify-center"
              >
                Đặt lại
              </button>{" "}
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="bg-primary border-primary border-[1px] text__default_hover hover:bg-inherit text-white rounded-lg h-full inline-flex w-full items-center justify-center"
              >
                Xem chuyến bay
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
