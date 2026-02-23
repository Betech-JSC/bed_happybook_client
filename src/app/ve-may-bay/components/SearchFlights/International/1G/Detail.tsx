"use client";
import Image from "next/image";
import React, { Fragment } from "react";
import {
  formatNumberToHoursAndMinutesFlight,
  formatTime,
  formatTimeZone,
} from "@/lib/formatters";
import _ from "lodash";
import DisplayImage from "@/components/base/DisplayImage";
import { useTranslation } from "@/hooks/useTranslation";
import FlightInfo from "@/components/FlightInfo";

const FlightInternational1GDetail = ({
  journey,
  onSelectFlight,
  setFlightDetail,
  fareData,
  airports,
}: any) => {
  const { t } = useTranslation();

  const [expandedFlightIndex, setExpandedFlightIndex] = React.useState<number | null>(null);

  const handleSelectFlight = (
    flightSelected: any,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fareDataClone = _.cloneDeep(fareData);
    fareDataClone.selectedTicketClass = flightSelected;
    onSelectFlight(_.cloneDeep(fareDataClone), fareData?.hpb_id, e);
  };
  return (
    <Fragment>
      {journey.length > 0 && (
        <div className="h-fit p-2 pb-0">
          {journey.map((flight: any, key: number) => (
            <div
              key={key}
              className="grid grid-cols-8 mb-2 last:mb-0 items-center justify-between rounded-lg bg-white p-2 md:py-2 md:px-4 border border-gray-200"
            >
              <div className="col-span-2">
                <div className="flex flex-row items-center gap-2 md:gap-4 text-left">
                  <DisplayImage
                    imagePath={`assets/images/airline/${flight.airline.toLowerCase()}.gif`}
                    width={80}
                    height={24}
                    alt={flight.airline}
                    classStyle={"max-w-16 md:max-w-20 max-h-10"}
                  />
                  <div>
                    <h3 className="text-xs md:text-18 font-semibold mb-1">
                      {flight.airline}
                    </h3>
                    <p className="text-[10px] md:text-sm text-gray-500 break-words">
                      {flight?.segments?.[0]?.flightNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-4 text-center flex justify-between">
                <div className="flex items-center justify-between gap-1 md:gap-4 w-full pl-1 md:px-6">
                  <div className="flex flex-col items-center">
                    <span className="text-xs md:text-lg font-semibold">
                      {formatTimeZone(
                        flight.departure.at,
                        flight.departure.timezone
                      )}
                    </span>
                    <span className="bg-gray-100 px-1 md:px-2 py-0.5 md:py-1 rounded md:rounded-lg text-[10px] md:text-sm">
                      {flight.departure.IATACode}
                    </span>
                  </div>

                  <div className="flex items-center w-full space-x-1 md:space-x-3">
                    <Image
                      src="/icon/fa-solid_plane.svg"
                      width={20}
                      height={20}
                      alt="Máy bay"
                      className="w-3 h-3 md:w-5 md:h-5 block"
                    />
                    <div className="flex flex-col items-center w-full">
                      <span className="text-[10px] md:text-sm text-gray-700 mb-1 md:mb-2">
                        {flight.duration
                          ? formatNumberToHoursAndMinutesFlight(flight.duration)
                          : formatNumberToHoursAndMinutesFlight(
                            flight.segments[0].duration ?? 0
                          )}
                      </span>
                      <div className="relative flex items-center w-full">
                        <div className="flex-grow h-px bg-gray-700"></div>
                        <div className="flex-shrink-0 w-2 h-2 md:w-4 md:h-4 bg-white border md:border-2 border-gray-400 rounded-full absolute left-1/2 -translate-x-1/2"></div>
                      </div>
                      <span
                        className="text-[10px] md:text-sm text-gray-700 mt-1 md:mt-2"
                        data-translate
                      >
                        {flight.StopNum
                          ? `${flight.StopNum} ${t("diem_dung")}`
                          : t("bay_thang")}
                      </span>
                    </div>
                    <Image
                      src="/icon/map-pinned.svg"
                      width={20}
                      height={20}
                      alt="Điểm đến"
                      className="w-3 h-3 md:w-5 md:h-5 block"
                    />
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xs md:text-lg font-semibold">
                      {formatTimeZone(
                        flight.arrival.at,
                        flight.arrival.timezone
                      )}
                    </span>
                    <span className="bg-gray-100 px-1 md:px-2 py-0.5 md:py-1 rounded md:rounded-lg text-[10px] md:text-sm">
                      {flight.arrival.IATACode}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-span-2 w-full text-center flex flex-col items-center justify-center gap-1 md:gap-2">
                <div>
                  <input
                    name={`flight[${flight.sequence === 1 ? 0 : 1}]`}
                    onChange={(e) => handleSelectFlight(flight, e)}
                    type="radio"
                    className="w-4 h-4 md:w-5 md:h-5 cursor-pointer"
                  />
                </div>
                <button
                  className="inline-block text-blue-700 border-b border-blue-700 font-normal text-[10px] md:text-base"
                  onClick={() =>
                    setExpandedFlightIndex(expandedFlightIndex === key ? null : key)
                  }
                >
                  {expandedFlightIndex === key ? t("thu_gon") : t("xem_chi_tiet")}
                </button>
              </div>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${expandedFlightIndex === key ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  } col-span-full w-full`}
              >
                <div className="overflow-hidden">
                  <div className={`transition-opacity duration-300 ${expandedFlightIndex === key ? "opacity-100" : "opacity-0"}`}>
                    <div className="mt-4">
                      <FlightInfo flight={flight} airports={airports} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          ))}
        </div>
      )}
    </Fragment>
  );
};

export default FlightInternational1GDetail;
