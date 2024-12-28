"use client";
import Image from "next/image";
import React, { Fragment } from "react";
import {
  formatNumberToHoursAndMinutesFlight,
  formatTime,
} from "@/lib/formatters";
import _ from "lodash";
import { FlightDetailInternationalProps } from "@/types/flight";
import DisplayImage from "@/components/DisplayImage";

const FlightInternationalDetail = ({
  FareData,
  onSelectFlight,
  setFlightDetail,
  leg,
}: FlightDetailInternationalProps) => {
  const flights = FareData.ListFlight ?? [];

  const handleSelectFlight = (indexFlight: number) => {
    let FareDataSelect = _.cloneDeep(FareData);
    const flightSelected = FareDataSelect.ListFlight[indexFlight];
    FareDataSelect.ListFlight = [flightSelected];
    FareDataSelect.Leg = flightSelected.Leg;
    onSelectFlight(FareDataSelect);
  };
  return (
    <Fragment>
      {flights.length > 0 && (
        <div className="h-fit p-2 pb-0">
          {flights.map((flight: any, key: number) => {
            if (flight.Leg === leg)
              return (
                <div
                  key={key}
                  className="grid grid-cols-8 mb-2 last:mb-0 items-start md:items-center justify-between rounded-lg bg-white p-3 md:py-6 md:px-8 border border-gray-200"
                >
                  <div className="col-span-2 border-r border-gray-200">
                    <div className="flex flex-col md:flex-row item-start md:items-center gap-2 md:gap-4 text-center md:text-left mb-3">
                      <DisplayImage
                        imagePath={`assets/images/airline/${flight.Airline.toLowerCase()}.gif`}
                        width={80}
                        height={24}
                        alt={"AirLine"}
                        classStyle={
                          "max-w-16 md:max-w-20 max-h-10 mx-auto md:mx-0"
                        }
                      />
                      <div>
                        <h3 className="text-sm md:text-18 font-semibold mb-1">
                          {flight.Airline}
                        </h3>
                        <p className="text-sm text-gray-500 break-words">
                          {flight.FlightNumber}
                        </p>
                      </div>
                    </div>
                    <button
                      className="hidden md:inline-block text-blue-700 border-b border-blue-700 font-normal"
                      onClick={() => setFlightDetail(FareData, key)}
                    >
                      Xem chi tiết
                    </button>
                  </div>

                  <div className="col-span-6 md:col-span-4 text-center flex justify-between">
                    <div className="flex items-center justify-between gap-4 w-full pl-3 md:px-6">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold">
                          {formatTime(flight.StartDate)}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm">
                          {flight.StartPoint}
                        </span>
                      </div>

                      <div className="flex items-center w-full space-x-3">
                        <Image
                          src="/icon/fa-solid_plane.svg"
                          width={20}
                          height={20}
                          alt="Icon"
                          className="w-5 h-5 hidden md:block"
                        />
                        <div className="flex flex-col items-center w-full">
                          <span className="text-sm text-gray-700 mb-2">
                            {flight.Duration
                              ? formatNumberToHoursAndMinutesFlight(
                                  flight.Duration
                                )
                              : formatNumberToHoursAndMinutesFlight(
                                  flight.ListSegment[0].Duration ?? 0
                                )}
                          </span>
                          <div className="relative flex items-center w-full">
                            <div className="flex-grow h-px bg-gray-700"></div>
                            <div className="flex-shrink-0 w-4 h-4 bg-white border-2 border-gray-400 rounded-full absolute left-1/2 -translate-x-1/2"></div>
                          </div>
                          <span className="text-sm text-gray-700 mt-2">
                            {flight.StopNum
                              ? `${flight.StopNum} điểm dừng`
                              : "Bay thẳng"}
                          </span>
                        </div>
                        <Image
                          src="/icon/map-pinned.svg"
                          width={20}
                          height={20}
                          alt="Icon"
                          className="w-5 h-5 hidden md:block"
                        />
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold">
                          {formatTime(flight.EndDate)}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm">
                          {flight.EndPoint}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col items-center absolute right-[24%] h-fit">
                    <div className="relative h-fit w-px my-2 overflow-hidden">
                      <div className="h-20 w-1 bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="col-span-8 w-full md:col-span-2 text-center md:text-right xl:pr-8">
                    <input
                      name={`flight[${leg}]`}
                      onChange={() => handleSelectFlight(key)}
                      type="radio"
                      className="w-7 h-7"
                    />
                  </div>
                </div>
              );
          })}
        </div>
      )}
    </Fragment>
  );
};

export default FlightInternationalDetail;
