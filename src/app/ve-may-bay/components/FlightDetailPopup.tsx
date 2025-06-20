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
import { useTranslation } from "@/app/hooks/useTranslation";
import { toSnakeCase } from "@/utils/Helper";
import { isEmpty } from "lodash";

export default function FlightDetailPopup({
  isOpen,
  tabs = [
    { id: 1, name: "Chi tiết chuyến bay" },
    { id: 2, name: "Điều kiện vé" },
  ],
  airports,
  flights,
  onClose,
  translatedStaticText,
  isLoadingFareRules,
}: FlightDetailPopupProps) {
  const { t } = useTranslation(translatedStaticText);
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
  let isFareRulesOfStrings = false;
  const flightDetail = flights?.[0];
  // const flightFareRules =
  //   flights[0]?.listFareRules && flights[0]?.listFareRules?.length > 0
  //     ? flights[0]?.listFareRules
  //     : null;
  // if (flightFareRules) {
  //   isFareRulesOfStrings =
  //     Array.isArray(flightFareRules) && typeof flightFareRules[0] === "string";
  // }
  // console.log(flightDetail);
  return (
    <div
      id="flight-detail-popup-wrapper"
      className={`fixed transition-opacity visible duration-300 px-3 md:px-0 inset-0  bg-black bg-opacity-70 flex justify-center items-center ${
        isOpen ? "visible z-[9999]" : "invisible z-[-1]"
      }`}
      style={{
        opacity: isOpen ? "100" : "0",
      }}
    >
      {Array.isArray(flights) &&
        flights.length > 0 &&
        Array.isArray(tabs) &&
        tabs.length > 0 && (
          <div className="relative bg-white max-h-[90vh] overflow-y-auto custom-scrollbar py-6 px-4 md:px-8 pb-8 w-full md:max-w-[680px] md:min-w-[680px] rounded-lg">
            {tabs.length > 1 && (
              <div className="flex justify-between items-end sticky top-[-25px] bg-white z-[999]">
                <p className="text-22 font-bold" data-translate="true">
                  {t("chi_tiet")}
                </p>
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
              className={`flex sticky top-[-25px] bg-white z-[999]  ${
                tabs.length > 1 ? "mt-3" : "justify-between"
              } `}
            >
              {tabs.map((tab: any, index: number) => (
                <div key={index} onClick={() => setActiveTab(tab.id)}>
                  <button
                    type="button"
                    className={`pt-2 font-bold duration-150 transition-colors outline-none 
                    ${activeTab === tab.id ? "text-primary " : ""} 
                    ${
                      tabs.length > 1 && activeTab === tab.id
                        ? "border-b-2 border-primary"
                        : ""
                    } 
                    ${
                      tabs.length < 2 && activeTab === tab.id
                        ? "text-22 px-0"
                        : "px-4"
                    }`}
                    // data-translate="true"
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
                      className={` bg-white ${
                        key > 0
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
                        data-translate="true"
                      >
                        {flight.flightLeg ? t("chieu_ve") : t("chieu_di")}
                      </h2>
                      {flight?.segments?.length > 0 &&
                        flight.segments.map((segment: any, index: number) => {
                          const segmentArrivalAt = parseISO(segment.arrival.at);
                          const segmentDepartureAt = parseISO(
                            segment.departure.at
                          );
                          const durationFlight =
                            segment.duration > 0
                              ? segment.duration
                              : differenceInSeconds(
                                  segmentArrivalAt,
                                  segmentDepartureAt
                                ) / 60;
                          const airPortStartPoint =
                            airports
                              .flatMap((country: any) => country.airports)
                              .find(
                                (airport: any) =>
                                  airport.code === segment.departure.IATACode
                              ) || null;
                          const airPortEndPoint =
                            airports
                              .flatMap((country: any) => country.airports)
                              .find(
                                (airport: any) =>
                                  airport.code === segment.arrival.IATACode
                              ) || null;
                          const flightCarryOnBaggage =
                            flight.selectedTicketClass
                              ? flight.selectedTicketClass.carryOnBaggage
                              : flight?.fareOptions[0]?.carryOnBaggage ?? "";
                          const flightCheckedBagge = flight.selectedTicketClass
                            ? flight.selectedTicketClass.checkedBaggae
                            : flight?.fareOptions[0]?.checkedBaggae ?? "";
                          const airPortTransit =
                            airports
                              .flatMap((country: any) => country.airports)
                              .find(
                                (airport: any) =>
                                  airport.code === segment.stopPoint
                              ) || null;

                          const operatingAirline = !isEmpty(segment?.operating)
                            ? segment?.operating
                            : segment.airline;
                          return (
                            <div
                              className={`grid grid-cols-12 items-start gap-6 ${
                                index > 0 ? "mt-6" : ""
                              }`}
                              key={index}
                            >
                              <div className="col-span-12 h-full w-full">
                                <div className="flex h-full items-start gap-2">
                                  <div className="w-4/12 md:w-2/12 flex h-full justify-between flex-col items-end">
                                    <div className="text-center w-full">
                                      <p className="text-22 font-bold">
                                        {formatTimeZone(
                                          segment.departure.at,
                                          segment.departure.timezone
                                        )}
                                      </p>
                                      <p className="text-gray-500">
                                        {format(
                                          new Date(segment.departure.at),
                                          "dd/MM/yyyy"
                                        )}
                                      </p>
                                    </div>
                                    <div className="font-semibold text-center w-full">
                                      <Image
                                        src="/icon/AirplaneTiltBlue.svg"
                                        width={20}
                                        height={20}
                                        alt="Icon"
                                        className="w-5 h-5 mx-auto"
                                      />
                                      <p className="mt-2 text-22 text-[#4E6EB3]">
                                        {formatNumberToHoursAndMinutesFlight(
                                          durationFlight
                                        )}
                                      </p>
                                    </div>
                                    <div className="text-center w-full">
                                      <p className="text-22 font-bold">
                                        {formatTimeZone(
                                          segment.arrival.at,
                                          segment.arrival.timezone
                                        )}
                                      </p>
                                      <p className="text-gray-500">
                                        {format(
                                          new Date(segment.arrival.at),
                                          "dd/MM/yyyy"
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="w-1/12 relative h-full py-5 flex flex-col items-center">
                                    <div className="w-[6px] h-[6px] bg-blue-700 rounded-full"></div>
                                    <div className="w-px h-full bg-blue-700"></div>
                                    <div className="w-[6px] h-[6px] bg-blue-700 rounded-full"></div>
                                  </div>
                                  <div className="w-7/12 md:w-9/12 flex justify-between space-y-3 md:space-y-0 flex-col h-full">
                                    <div>
                                      <div
                                        className="text-22 font-bold"
                                        data-translate="true"
                                      >
                                        {airPortStartPoint
                                          ? `${
                                              airPortStartPoint?.city ?? ""
                                            } (${airPortStartPoint.code})`
                                          : `${segment.departure.IATACode}`}
                                      </div>
                                      <p className="text-gray-500 mt-1 h-6"></p>
                                    </div>
                                    <div className="rounded-lg py-3 px-4 bg-gray-50">
                                      <div className="flex space-x-3">
                                        <DisplayImage
                                          imagePath={`assets/images/airline/${operatingAirline.toLowerCase()}.gif`}
                                          width={82}
                                          height={24}
                                          alt={"AirLine"}
                                          classStyle={
                                            "max-w-20 md:max-w-24 max-h-10"
                                          }
                                        />
                                        <p className="font-bold">
                                          {segment.airline}
                                        </p>
                                      </div>
                                      <div className="mt-3 flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0 text-sm font-medium">
                                        <p>{segment.flightNumber}</p>
                                        <p
                                          className="hidden md:block"
                                          data-translate="true"
                                        >
                                          -
                                        </p>
                                        <p>
                                          {t("hang")}{" "}
                                          {flight.selectedTicketClass
                                            ? flight?.selectedTicketClass
                                                ?.bookingClass
                                            : segment.bookingClass ?? ""}
                                        </p>
                                      </div>

                                      <div className="mt-3 flex flex-col md:flex-row flex-wrap gap-3 text-sm font-medium">
                                        {flightCarryOnBaggage &&
                                          !isEmpty(
                                            flightCarryOnBaggage.trim()
                                          ) && (
                                            <p data-translate="true">{`${t(
                                              "hanh_ly_xach_tay"
                                            )}: ${flightCarryOnBaggage}`}</p>
                                          )}
                                        {flightCheckedBagge &&
                                          !isEmpty(
                                            flightCheckedBagge.trim()
                                          ) && (
                                            <p data-translate="true">{`${t(
                                              "hanh_ly_ky_gui"
                                            )}: ${flightCheckedBagge}`}</p>
                                          )}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-gray-500 mt-1 h-6"></p>
                                      <p
                                        className="text-22 font-bold"
                                        data-translate="true"
                                      >
                                        {airPortEndPoint
                                          ? `${airPortEndPoint?.city ?? ""} (${
                                              airPortEndPoint.code
                                            })`
                                          : `${segment.arrival.IATACode}`}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {segment.stopTime > 0 && airPortTransit && (
                                <div className="col-span-12 h-full w-full">
                                  <div className="flex h-full items-start gap-0 md:gap-2">
                                    <div className="w-0 md:w-2/12 flex h-full justify-between flex-col items-end"></div>
                                    <div className="w-0 md:w-1/12 h-full py-5 flex flex-col items-center"></div>
                                    <div className="w-full md:w-9/12 flex justify-between space-y-3 md:space-y-0 flex-col h-full">
                                      <div className="bg-gray-50 rounded-lg p-4 flex space-x-4 lg:space-x-8 items-center text-sm">
                                        <p data-translate="true">
                                          Transfer in{" "}
                                          {`${airPortEndPoint?.city ?? ""} (${
                                            airPortEndPoint.code
                                          })`}{" "}
                                        </p>
                                        <p>
                                          {formatNumberToHoursAndMinutesFlight(
                                            segment.stopTime
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
              {activeTab === 2 && (
                <Fragment>
                  {!flightDetail.domestic &&
                  ["1G", "VN1A"].includes(flightDetail.source) ? (
                    <div className="flex flex-col gap-2">
                      {!isEmpty(
                        flightDetail?.fareOptSelected?.carryOnBaggage
                      ) && (
                        <div className="flex gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20px"
                            height="20px"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-[2px] text-[#efad02]"
                          >
                            <rect
                              x="2"
                              y="7"
                              width="20"
                              height="14"
                              rx="2"
                              ry="2"
                            ></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                          </svg>
                          <p>
                            Hành lý xách tay:{" "}
                            {flightDetail?.fareOptSelected?.carryOnBaggage}
                          </p>
                        </div>
                      )}
                      {!isEmpty(
                        flightDetail?.fareOptSelected?.checkedBaggae
                      ) && (
                        <div className="flex gap-2">
                          <Image
                            src={`/icon/flight/${
                              !isEmpty(
                                flightDetail?.fareOptSelected?.checkedBaggae
                              )
                                ? "luggage"
                                : "no-luggage"
                            }.svg`}
                            width={24}
                            height={24}
                            alt="Icon"
                            className="w-6 h-6"
                          />
                          <p
                            className={`${
                              isEmpty(
                                flightDetail?.fareOptSelected?.checkedBaggae
                              )
                                ? "text-[#ef5350]"
                                : ""
                            }`}
                          >
                            Hành lý ký gửi:{" "}
                            {!isEmpty(
                              flightDetail?.fareOptSelected?.checkedBaggae
                            )
                              ? flightDetail?.fareOptSelected?.checkedBaggae
                              : "Không bao gồm"}
                          </p>
                        </div>
                      )}
                      {flightDetail?.fareOptSelected?.noRefund && (
                        <div className="flex flex-col md:flex-row gap-1">
                          <div className="flex gap-2">
                            <Image
                              src="/icon/flight/can-refund.svg"
                              width={24}
                              height={24}
                              alt="Icon"
                              className="w-6 h-6"
                            />
                            <span data-translate="true">Hoàn vé: </span>
                            <p data-translate="true">Được phép</p>
                          </div>
                          <p className="text-[#166987] font-semibold text-end">
                            (Phí vui lòng liên hệ booker).
                          </p>
                        </div>
                      )}
                      {flightDetail?.fareOptSelected?.changePenalties?.length >
                        0 && (
                        <div className="flex flex-col md:flex-row gap-1">
                          <div className="flex gap-2">
                            <Image
                              src="/icon/flight/can-change.svg"
                              width={24}
                              height={24}
                              alt="Icon"
                              className="w-6 h-6"
                            />
                            <span data-translate="true">Đổi vé:</span>
                            <p data-translate="true">Được phép</p>
                          </div>
                          <p className="text-[#166987] font-semibold text-end">
                            (Phí vui lòng liên hệ booker).
                          </p>
                        </div>
                      )}
                      {/* {flightDetail?.fareOptSelected?.noshowPenalties &&
                        !flightDetail?.fareOptSelected?.noshowPenalties
                          .length && (
                          <div className="flex gap-2">
                            <Image
                              src="/icon/flight/no-change.svg"
                              width={24}
                              height={24}
                              alt="Icon"
                              className="w-6 h-6"
                            />
                            <p>Không được No Show</p>
                          </div>
                        )} */}
                    </div>
                  ) : (
                    <div>
                      {!isEmpty(flightDetail?.fareRules) ? (
                        <div className="flex flex-col gap-2">
                          {!isEmpty(
                            flightDetail?.fareRules?.carry_on_baggage
                          ) && (
                            <div className="ml-[2px] flex gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-[#efad02]"
                              >
                                <rect
                                  x="2"
                                  y="7"
                                  width="20"
                                  height="14"
                                  rx="2"
                                  ry="2"
                                ></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                              </svg>
                              <p>{flightDetail?.fareRules?.carry_on_baggage}</p>
                            </div>
                          )}

                          {!isEmpty(
                            flightDetail?.fareRules?.checked_baggage
                          ) && (
                            <div className="flex gap-2">
                              <Image
                                src={`/icon/flight/${
                                  !isEmpty(
                                    flightDetail?.fareRules?.checked_baggage
                                  )
                                    ? "luggage"
                                    : "no-luggage"
                                }.svg`}
                                width={24}
                                height={24}
                                alt="Icon"
                                className="w-6 h-6"
                              />
                              <p>{flightDetail?.fareRules?.checked_baggage}</p>
                            </div>
                          )}

                          {!isEmpty(flightDetail?.fareRules?.can_refund) && (
                            <div className="flex gap-2">
                              <Image
                                src="/icon/flight/can-refund.svg"
                                width={24}
                                height={24}
                                alt="Icon"
                                className="w-6 h-6"
                              />
                              <span>{flightDetail?.fareRules?.can_refund}</span>
                            </div>
                          )}
                          {!isEmpty(flightDetail?.fareRules?.can_change) && (
                            <div className="flex gap-2">
                              <Image
                                src="/icon/flight/can-change.svg"
                                width={24}
                                height={24}
                                alt="Icon"
                                className="w-6 h-6"
                              />
                              <span>{flightDetail?.fareRules?.can_change}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          Xin vui lòng liên hệ HappyBook để biết thêm chi tiết.
                        </div>
                      )}
                    </div>
                  )}
                </Fragment>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
