"use client";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { differenceInSeconds, format, parseISO } from "date-fns";
import {
  formatNumberToHoursAndMinutesFlight,
  formatTime,
  formatTimeZone,
} from "@/lib/formatters";
import { FlightDetailPopupProps } from "@/types/flight";
import DisplayImage from "@/components/base/DisplayImage";
import { toSnakeCase } from "@/utils/Helper";
import { isEmpty } from "lodash";
import { useTranslation } from "@/hooks/useTranslation";
import { createPortal } from "react-dom";
import FlightInfo from "@/components/FlightInfo";

export default function Flight1GDetailPopup({
  isOpen,
  tabs = [
    { id: 1, name: "Chi tiết chuyến bay" },
    { id: 2, name: "Điều kiện vé" },
  ],
  airports,
  flights,
  onClose,
  isLoadingFareRules,
}: FlightDetailPopupProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(0);
  useEffect(() => {
    if (tabs.length) {
      if (tabs.length > 1) {
        if (!activeTab) {
          setActiveTab(tabs[0].id);
        }
      } else {
        setActiveTab(tabs[0].id);
      }
    }
  }, [tabs, activeTab]);
  const flightDetail = [flights];
  return createPortal(
    <div
      id="flight-detail-2-popup-wrapper"
      className={`fixed transition-opacity visible duration-300 px-3 md:px-0 inset-0  bg-black bg-opacity-70 flex justify-center items-center ${isOpen ? "opacity-100 visible z-[9999]" : "opacity-0 invisible z-[-1]"
        }`}
      style={{
        opacity: isOpen ? "100" : "0",
      }}
    >
      {Array.isArray(flightDetail) &&
        flightDetail.length > 0 &&
        Array.isArray(tabs) &&
        tabs.length > 0 && (
          <div className="relative bg-white max-h-[90vh] overflow-y-auto custom-scrollbar py-6 px-4 md:px-8 pb-8 w-full md:max-w-[680px] md:min-w-[680px] rounded-lg">
            {tabs.length > 1 && (
              <div className="flex justify-between items-end sticky top-[-25px] bg-white z-[999]">
                <p className="text-22 font-bold">{t("chi_tiet")}</p>
                <button
                  type="button"
                  className="text-xl"
                  onClick={() => {
                    onClose();
                  }}
                >
                  <Image
                    src="/icon/close.svg"
                    alt="Icon"
                    className="h-6"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            )}
            {/* Tabs */}
            <div
              className={`flex sticky top-[-25px] bg-white z-[999]  ${tabs.length > 1 ? "mt-3" : "justify-between"
                } `}
            >
              {tabs.map((tab: any, index: number) => (
                <div key={index} onClick={() => setActiveTab(tab.id)}>
                  <button
                    type="button"
                    className={`pt-2 font-bold duration-150 transition-colors outline-none 
                    ${activeTab === tab.id ? "text-primary " : ""} 
                    ${tabs.length > 1 && activeTab === tab.id
                        ? "border-b-2 border-primary"
                        : ""
                      } 
                    ${tabs.length < 2 && activeTab === tab.id
                        ? "text-22 px-0"
                        : "px-4"
                      }`}
                  >
                    {t(`${toSnakeCase(tab.name)}`)}
                  </button>
                </div>
              ))}
              {tabs.length < 2 && (
                <button
                  className="text-xl"
                  type="button"
                  onClick={() => {
                    onClose();
                  }}
                >
                  <Image
                    src="/icon/close.svg"
                    alt="Icon"
                    className="h-6"
                    width={24}
                    height={24}
                  />
                </button>
              )}
            </div>
            <div className="mt-4">
              {activeTab === 1 &&
                flights.map((flight: any, key: number) => {
                  return (
                    <div
                      key={key}
                      className={` bg-white ${key > 0
                          ? "pt-6 border-t border-t-gray-300"
                          : "mt-4 pb-6"
                        }`}
                    >
                      <h2
                        className="text-xl py-1 px-4 font-semibold text-white mb-6 max-w-fit rounded-lg"
                        style={{
                          background:
                            "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                        }}
                      >
                        {flight.sequence === 2 ? t("chieu_ve") : t("chieu_di")}
                      </h2>
                      <FlightInfo flight={flight} airports={airports} />
                    </div>
                  );
                })}
            </div>
            {activeTab === 2 && (
              <Fragment>
                {flights.map((flightDetail: any, index: number) => (
                  <div
                    key={index}
                    className={` bg-white ${index > 0
                        ? "pt-4 border-t border-t-gray-300"
                        : "mt-4 pb-6"
                      }`}
                  >
                    {flights?.length > 1 && (
                      <h2
                        className="text-xl py-1 px-4 font-semibold text-white mb-4 max-w-fit rounded-lg"
                        style={{
                          background:
                            "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                        }}
                      >
                        {flightDetail.sequence === 2
                          ? t("chieu_ve")
                          : t("chieu_di")}
                      </h2>
                    )}

                    <div className="flex flex-col gap-2">
                      {t(
                        "xin_vui_long_lien_he_happy_book_de_biet_them_chi_tiet"
                      )}
                    </div>
                  </div>
                ))}
              </Fragment>
            )}
          </div>
        )}
    </div>,
    document.body
  );
}
