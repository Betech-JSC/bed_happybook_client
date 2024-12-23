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
  formatNumberToHoursAndMinutesFlight,
  formatTime,
} from "@/lib/formatters";
import { FlightDetailDomesticProps } from "@/types/flight";

const FlightDomesticDetail = ({
  FareData,
  onSelectFlight,
  selectedFlight,
  filters,
  setFlightDetail,
  totalPassengers,
}: FlightDetailDomesticProps) => {
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | string>(0);
  const [hasHeight, setHasHeight] = useState<boolean>(false);

  if (selectedFlight) {
    FareData = selectedFlight;
  }
  let flight = FareData.ListFlight ? FareData.ListFlight[0] : null;
  if (flight) flight.Leg = FareData.Leg;
  const ticketClasses = FareData.ticketClasses ? FareData.ticketClasses : [];

  const toggleShowDetails = useCallback(
    (id: number, flightSelected: any) => {
      if (flightSelected) {
        onSelectFlight(flightSelected);
      } else {
        setShowDetails(showDetails === id ? null : id);
      }
    },
    [showDetails, onSelectFlight]
  );

  useEffect(() => {
    if (!contentRef.current) return;

    setHeight(showDetails ? 0 : contentRef.current.scrollHeight + 60);
    setHasHeight(true);
  }, [showDetails]);

  return (
    <Fragment>
      {flight && (
        <div className="h-fit">
          <div className="grid grid-cols-8 items-start md:items-center justify-between bg-white p-3 md:p-6 rounded-lg mt-4 relative">
            <div className="col-span-2 border-r border-gray-200">
              <div className="flex flex-col md:flex-row item-start md:items-center gap-2 md:gap-4 text-center md:text-left mb-3">
                <Image
                  src={`http://cms.happybooktravel.com/assets/images/airline/${flight.Airline.toLowerCase()}.gif`}
                  width={80}
                  height={24}
                  alt="AirLine"
                  className="max-w-16 md:max-w-20 max-h-10 mx-auto md:mx-0"
                />
                <div>
                  <h3 className="text-sm md:text-18 font-semibold mb-1">
                    {flight.Airline}
                  </h3>
                  <p className="text-sm text-gray-500">{flight.FlightNumber}</p>
                </div>
              </div>
              <button
                type="button"
                className="hidden md:inline-block text-blue-700 border-b border-blue-700 font-normal"
                onClick={() =>
                  setFlightDetail(flight, [
                    { id: 1, name: "Chi tiết hành trình" },
                  ])
                }
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
                        ? formatNumberToHoursAndMinutesFlight(flight.Duration)
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
              <div className="w-11 h-11 bg-gray-100 rounded-full"></div>
              <div className="relative h-fit w-px my-2 overflow-hidden">
                <div className="h-20 w-1 bg-gradient-to-b from-[#4E6EB3] to-[#4E6EB3] via-transparent bg-[length:2px_16px] bg-repeat-y"></div>
              </div>
              <div className="w-11 h-11 bg-gray-100 rounded-full"></div>
            </div>
            <div className="col-span-8 w-full md:col-span-2 text-center md:text-right md:pl-8 xl:pr-8">
              <div className="mt-3 md:mt-0 flex justify-between">
                <button
                  type="button"
                  className="inline-block md:hidden text-blue-700 border-b border-blue-700 font-normal"
                  onClick={() =>
                    setFlightDetail(flight, [
                      { id: 1, name: "Chi tiết hành trình" },
                    ])
                  }
                >
                  Xem chi tiết
                </button>
                <p className="text-primary text-18 font-bold text-right">
                  {filters.priceWithoutTax === "1"
                    ? FareData.TotalPriceWithOutTax.toLocaleString("vi-VN")
                    : FareData.TotalPrice.toLocaleString("vi-VN")}{" "}
                  {FareData.Currency}
                </p>
              </div>

              <button
                onClick={() => toggleShowDetails(flight.id, selectedFlight)}
                className="block text-center mt-5 md:mt-3 w-full bg-blue-50 text-blue-700 font-medium py-2 rounded-lg hover:text-primary duration-300"
              >
                {selectedFlight && selectedFlight.FareDataId
                  ? "Thay đổi"
                  : "Chọn"}
              </button>
            </div>
          </div>
          {ticketClasses.length > 0 && (
            <div
              ref={contentRef}
              style={{
                maxHeight: showDetails === flight.id ? height : "0px",
              }}
              className={`bg-gray-100 border-2 rounded-2xl relative transition-[opacity,max-height,transform] ease-out duration-500 overflow-hidden ${
                showDetails === flight.id && hasHeight
                  ? `opacity-1 border-blue-500 translate-y-0 mt-4 p-4 `
                  : "opacity-0 border-none -translate-y-6 invisible mt-0 pt-0"
              }`}
            >
              <div className="overflow-x-auto rounded-lg">
                <div
                  className={`inline-grid w-max gap-3`}
                  style={{
                    gridTemplateColumns: `repeat(${ticketClasses.length}, minmax(0, 1fr)`,
                  }}
                >
                  {ticketClasses.map((ticket: any, index: number) => {
                    const ticketFlight = ticket.ListFlight[0];
                    const priceTicket =
                      ticket.FareAdt * ticket.Adt +
                      ticket.FareChd * ticket.Chd +
                      ticket.FareInf * ticket.Inf;
                    return (
                      <div
                        key={index}
                        className="py-3 px-4 md:px-6 bg-white rounded-lg min-w-[250px] max-w-[250px] md:min-w-[296px] md:max-w-[296px]"
                      >
                        <p className="text-gray-900 text-18 font-bold">
                          {ticketFlight.GroupClass}
                        </p>
                        <div className="my-4 pb-4 border-b border-gray-200">
                          <div className="flex justify-between items-end lg:w-11/12">
                            <p className="text-sm text-gray-700">Hạng vé</p>
                            <p className="font-medium text-sm">
                              {ticketFlight.FareClass}
                            </p>
                          </div>
                          <div className="flex justify-between items-end lg:w-11/12 mt-3">
                            <p className="text-sm text-gray-700">
                              Hành lý xách tay
                            </p>
                            <p className="font-medium text-sm">
                              {ticketFlight.ListSegment[0].HandBaggage}
                            </p>
                          </div>
                          <div className="flex justify-between items-end lg:w-11/12 mt-3">
                            <p className="text-sm text-gray-700">
                              Hành lý ký gửi
                            </p>
                            <p className="font-medium text-sm">
                              {ticketFlight.ListSegment[0].AllowanceBaggage
                                ? ticketFlight.ListSegment[0].AllowanceBaggage
                                : "Chưa bao gồm"}
                            </p>
                          </div>
                          <button
                            className="mt-3 text-blue-700 border-b border-blue-700 font-medium"
                            onClick={() =>
                              setFlightDetail(
                                ticket,
                                [{ id: 2, name: "Điều kiện vé" }],
                                true
                              )
                            }
                          >
                            Chi tiết
                          </button>
                        </div>
                        <div>
                          {totalPassengers > 1 ? (
                            <div>
                              <p className="text-primary text-22 font-bold">
                                {`${priceTicket.toLocaleString("vi-VN")} ${
                                  ticket.Currency
                                }`}
                              </p>
                              <p className="text-sm text-gray-700">
                                Tổng :{" "}
                                {`${ticket.TotalPrice.toLocaleString(
                                  "vi-VN"
                                )} ${ticket.Currency}`}
                              </p>
                            </div>
                          ) : (
                            <p className="text-primary text-22 font-bold">
                              {`${ticket.TotalPrice.toLocaleString("vi-VN")} ${
                                ticket.Currency
                              }`}
                            </p>
                          )}
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={() => onSelectFlight(ticket)}
                            className="text-center w-full border border-blue-600 bg-blue-600 text-white font-medium py-2 rounded-lg hover:text-primary duration-300"
                          >
                            Đặt vé
                          </button>
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
