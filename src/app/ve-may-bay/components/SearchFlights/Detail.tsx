"use client";
import Image from "next/image";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  formatCurrency,
  formatNumberToHoursAndMinutesFlight,
  formatTime,
  formatTimeZone,
} from "@/lib/formatters";
import { FlightDetailProps } from "@/types/flight";
import DisplayImage from "@/components/base/DisplayImage";
import { isEmpty } from "lodash";
import { useTranslation } from "@/hooks/useTranslation";

const FlightDomesticDetail = ({
  FareData,
  onSelectFlight,
  selectedFlight,
  filters,
  setFlightDetail,
  totalPassengers,
  translatedStaticText,
}: FlightDetailProps) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | string>(0);
  const [hasHeight, setHasHeight] = useState<boolean>(false);

  if (selectedFlight) {
    FareData = selectedFlight;
  }

  let flight = FareData ?? null;

  const toggleShowDetails = useCallback(
    (flightCode: any, flightSelected: any) => {
      if (flightSelected) {
        onSelectFlight(flightSelected, 0);
        setShowDetails(null);
      } else {
        setShowDetails(
          showDetails && showDetails === flightCode ? null : flightCode
        );
      }
    },
    [showDetails, onSelectFlight]
  );

  useEffect(() => {
    if (!contentRef.current) return;

    setHeight(showDetails ? contentRef.current.scrollHeight + 60 : 0);
    setHasHeight(true);
  }, [showDetails]);

  if (flight?.fareOptions?.length < 1) {
    return;
  }

  const startOperating = !isEmpty(flight.segments?.[0]?.operating)
    ? flight.segments?.[0]?.operating
    : flight.airLineCode;
  return (
    <Fragment>
      {flight && (
        <div className="h-fit">
          <div className="grid grid-cols-5 md:grid-cols-6 items-center justify-between bg-white p-3 rounded-lg mt-2 relative">
            <div className="col-span-1 md:col-span-2">
              <div className="flex flex-col md:flex-row item-start md:items-center gap-2 md:gap-12">
                <DisplayImage
                  imagePath={`assets/images/airline/${startOperating.toLowerCase()}.gif`}
                  width={80}
                  height={24}
                  alt={startOperating}
                  classStyle={"max-w-16 md:max-w-20 max-h-10 md:mx-0"}
                />
                <div className="flex items-center  text-md font-semibold text-gray-500">
                  <h3 className="">
                    {flight.airline}
                  </h3>
                  <p className="whitespace-nowrap">
                    {flight.flightNumber}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-2 md:col-span-2 flex  items-center">
              <div className="grid grid-cols-2 w-full">
                <div className="col-span-full md:col-span-1 flex space-x-[4px] items-center justify-center">
                  <span className="text-lg font-semibold">
                    {formatTimeZone(
                      flight.departure.at,
                      flight.departure.timezone
                    )}
                  </span>
                  <span>-</span>
                  <span className="text-lg">
                    {formatTimeZone(flight.arrival.at, flight.arrival.timezone)}
                  </span>
                </div>
                <div className="col-span-full md:col-span-1 flex space-x-[4px] items-center justify-center">
                  <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm">
                    {flight.departure.IATACode}
                  </span>
                  <span>-</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm">
                    {flight.arrival.IATACode}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-span-2 md:col-span-2 flex justify-between items-center">
              <div className="grid grid-cols-2 w-full">
                <div className="col-span-full md:col-span-1 md:text-center">
                  {flight.segments?.[0].airCraft}
                </div>
                <div className="col-span-full md:col-span-1 justify-between items-center space-x-[8px] md:space-x-[12px] ">
                  <div className="grid grid-cols-3 ">
                    <div className="col-span-2 text-primary text-18 font-bold">
                      {filters.priceWithoutTax === "1"
                        ? flight.selectedTicketClass
                          ? flight.selectedTicketClass.totalPriceWithOutTax.toLocaleString(
                            "vi-VN"
                          )
                          : flight.fareOptions[0].totalPriceWithOutTax.toLocaleString(
                            "vi-VN"
                          )
                        : flight.selectedTicketClass
                          ? (
                            flight.selectedTicketClass.fareAdultFinal +
                            flight.selectedTicketClass.taxAdult
                          ).toLocaleString("vi-VN")
                          : (
                            flight.fareOptions[0].fareAdultFinal +
                            flight.fareOptions[0].taxAdult
                          ).toLocaleString("vi-VN")}{" "}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleShowDetails(flight.flightCode, selectedFlight)}
                      className="col-span-1 flex items-center justify-center w-8 h-8 rounded-full  transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-500"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
              {/* <button
                onClick={() =>
                  toggleShowDetails(flight.flightCode, selectedFlight)
                }
                className="block text-center mt-5 md:mt-3 w-full bg-blue-50 text-blue-700 font-medium py-2 rounded-lg hover:text-primary duration-300"
              >
                {selectedFlight && selectedFlight.flightCode
                  ? t("thay_doi")
                  : t("chon")}
              </button> */}
            </div>
          </div>
          {flight.fareOptions.length > 0 && (
            <div
              ref={contentRef}
              style={{
                maxHeight: showDetails === flight.flightCode ? height : "0px",
              }}
              className={`bg-gray-100 border-2 rounded-2xl relative transition-[opacity,max-height,transform] ease-out duration-500 overflow-hidden ${showDetails === flight.flightCode && hasHeight
                ? `opacity-1 border-blue-500 translate-y-0 mt-4 p-4 `
                : "opacity-0 border-none -translate-y-6 invisible mt-0 pt-0"
                }`}
            >
              <div className="overflow-x-auto rounded-lg">
                <div
                  className={`inline-grid w-max gap-3`}
                  style={{
                    gridTemplateColumns: `repeat(${flight.fareOptions.length}, minmax(0, 1fr)`,
                  }}
                >
                  {flight.fareOptions.map((ticket: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-col justify-between py-3 px-4 md:px-6 bg-white rounded-lg min-w-[250px] max-w-[250px] md:min-w-[296px] md:max-w-[296px]"
                      >
                        <div className="mb-4 pb-1">
                          <p className="text-gray-900 text-18 font-bold">
                            {!isEmpty(ticket.fareType)
                              ? ticket.fareType
                              : ticket.groupClass}
                          </p>
                          <div className="mt-4 flex justify-between items-end">
                            <p className="text-sm text-gray-700">
                              {t("hang_ve")}
                            </p>
                            <p className="font-medium text-sm">
                              {ticket.bookingClass}
                            </p>
                          </div>

                          {ticket.carryOnBaggage && (
                            <div className="flex justify-between items-start mt-3">
                              <p className="text-sm text-gray-700 flex-1">
                                {t("hanh_ly_xach_tay")}
                              </p>
                              <p className="font-medium text-sm flex-1 text-right">
                                {ticket.carryOnBaggage ?? ""}
                              </p>
                            </div>
                          )}

                          {ticket.checkedBaggae && (
                            <div className="flex justify-between items-start mt-3">
                              <p className="text-sm text-gray-700 flex-1">
                                {t("hanh_ly_ky_gui")}
                              </p>
                              <p className="font-medium text-sm flex-1 text-right">
                                {ticket.checkedBaggae
                                  ? ticket.checkedBaggae
                                  : ""}
                              </p>
                            </div>
                          )}

                          <button
                            className="mt-3 text-blue-700 border-b border-blue-700 font-medium"
                            onClick={() =>
                              setFlightDetail(
                                flight,
                                index,
                                [{ id: 2, name: "Điều kiện vé" }],
                                true
                              )
                            }
                          >
                            <span>{t("dieu_kien_ve")}</span>
                          </button>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <div>
                            {totalPassengers > 1 ? (
                              <div>
                                <p className="text-sm text-gray-700 font-semibold mb-2">
                                  {`${t("nguoi_lon")}: ${(
                                    ticket.fareAdultFinal + ticket.taxAdult
                                  ).toLocaleString()} ${flight.currency} x ${flight.numberAdt
                                    }`}
                                </p>
                                {flight.numberChd > 0 && (
                                  <p className="text-sm text-gray-700 font-semibold mb-2">
                                    {`${t("tre_em")}: ${(
                                      ticket.fareChildFinal + ticket.taxChild
                                    ).toLocaleString()} ${flight.currency} x ${flight.numberChd
                                      }`}
                                  </p>
                                )}
                                {flight.numberInf > 0 && (
                                  <p className="text-sm text-gray-700 font-semibold mb-2">
                                    {`${t("em_be")}: ${(
                                      ticket.fareInfantFinal + ticket.taxInfant
                                    ).toLocaleString()} ${flight.currency} x ${flight.numberInf
                                      }`}
                                  </p>
                                )}
                                <div className="text-primary text-22 font-bold">
                                  <span>{t("tong")} : </span>
                                  {formatCurrency(ticket.totalPrice)}
                                </div>
                              </div>
                            ) : (
                              <p className="text-primary text-22 font-bold">
                                {filters.priceWithoutTax === "1"
                                  ? ticket.totalPriceWithOutTax.toLocaleString()
                                  : ticket.totalPrice.toLocaleString()}{" "}
                                {flight.currency}
                              </p>
                            )}
                          </div>
                          <div className="mt-4">
                            <button
                              onClick={() => {
                                onSelectFlight(flight, index);
                                toggleShowDetails(
                                  flight.flightCode,
                                  selectedFlight
                                );
                              }}
                              className="text-center w-full border border-blue-600 bg-blue-600 text-white font-medium py-2 rounded-lg hover:text-primary duration-300"
                            >
                              {t("dat_ve")}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default FlightDomesticDetail;
