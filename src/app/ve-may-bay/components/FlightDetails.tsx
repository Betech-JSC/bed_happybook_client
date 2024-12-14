"use client";
import Image from "next/image";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import PassengerTable from "./PassengerTable";
import {
  formatDate,
  formatNumberToHoursAndMinutesFlight,
  formatTime,
} from "@/lib/formatters";
import { FlightDetailProps, PassengerType } from "@/types/flight";
import { FlightApi } from "@/api/Flight";

const FlightDetails = ({
  session,
  FareData,
  onSelectFlight,
  selectedFlight,
  filters,
  airports,
  displayType,
}: FlightDetailProps) => {
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [showRuleTicket, setShowRuleTicket] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | string>(0);
  const [hasHeight, setHasHeight] = useState<boolean>(false);
  const [isLoadingRules, setIsLoadingRules] = useState<boolean>(false);
  const passengers: PassengerType[] = [
    {
      type: "Adt",
      title: "Người lớn",
      quantity: FareData.Adt,
      price: FareData.FareAdt + FareData.TaxAdt,
      totalPrice: FareData.Adt * (FareData.FareAdt + FareData.TaxAdt),
      currency: FareData.Currency,
    },
    {
      type: "Chd",
      title: "Trẻ em",
      quantity: FareData.Chd,
      price: FareData.FareChd + FareData.TaxChd,
      totalPrice: FareData.Chd * (FareData.FareChd + FareData.TaxChd),
      currency: FareData.Currency,
    },
    {
      type: "Adt",
      title: "Em bé",
      quantity: FareData.Inf,
      price: FareData.FareInf + FareData.TaxInf,
      totalPrice: FareData.Inf * (FareData.FareInf + FareData.TaxInf),
      currency: FareData.Currency,
    },
  ];
  const flight = FareData.ListFlight ? FareData.ListFlight[0] : null;
  const fetchFareRules = useCallback(
    async (FareData: any, flight: any) => {
      try {
        setIsLoadingRules(true);
        const params = {
          FlightRequest: {
            ListFareData: [
              {
                Session: session,
                FareDataId: FareData.FareDataId,
                ListFlight: [
                  {
                    FlightValue: flight.FlightValue,
                  },
                ],
              },
            ],
          },
        };

        const response = await FlightApi.getFareRules(
          "flights/getfarerules",
          params
        );
        const fareRules =
          response?.payload.data.ListFareRules[0].ListRulesGroup[0]
            .ListRulesText[0] ??
          `Xin vui lòng liên hệ với Happy Book để nhận thông tin chi tiết.`;
        return fareRules;
      } catch (error: any) {
        return `Xin vui lòng liên hệ với Happy Book để nhận thông tin chi tiết.`;
      } finally {
        setIsLoadingRules(false);
      }
    },
    [session]
  );
  const toggleShowDetails = useCallback(
    async (id: number) => {
      setShowDetails(showDetails === id ? null : id);
    },
    [showDetails]
  );

  useEffect(() => {
    if (!contentRef.current) return;

    setHeight(showDetails ? 0 : contentRef.current.scrollHeight + 60);
    setHasHeight(true);
  }, [showDetails]);

  useEffect(() => {
    if (!contentRef.current) return;
    setHeight(showRuleTicket ? 0 : contentRef.current.scrollHeight + 60);
    setHasHeight(true);
  }, [showRuleTicket]);

  const toggleShowRuleTicket = useCallback(
    async (id: number) => {
      if (!flight.ListRulesTicket) {
        flight.ListRulesTicket = await fetchFareRules(FareData, flight);
      }
      setShowRuleTicket(showRuleTicket === id ? null : id);
    },
    [showRuleTicket, flight, FareData, fetchFareRules]
  );

  return (
    <Fragment>
      {flight && (
        <div className="h-fit">
          <div className="grid grid-cols-8 items-start md:items-center justify-between bg-white p-3 md:p-6 rounded-lg mt-4 relative">
            <div className="col-span-2 border-r border-gray-200">
              <div className="flex flex-col md:flex-row item-start md:items-center gap-2 md:gap-4 text-center md:text-left mb-3">
                <Image
                  src={`/airline/${flight.Airline}.svg`}
                  width={48}
                  height={48}
                  alt="AirLine"
                  className="w-8 h-7 md:w-12 md:h-12 mx-auto md:mx-0"
                />
                <div>
                  <h3 className="text-sm md:text-18 font-semibold mb-1">
                    {flight.Airline}
                  </h3>
                  <p className="text-sm text-gray-500">{flight.FlightNumber}</p>
                </div>
              </div>
              <button
                className="hidden md:inline-block text-blue-700 border-b border-blue-700 font-normal"
                onClick={() => toggleShowDetails(flight.id)}
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
              <div className="flex justify-between mt-3 md:mt-0">
                <button
                  className="inline-block md:hidden text-blue-700 border-b border-blue-700 font-normal"
                  onClick={() => toggleShowDetails(flight.id)}
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
                onClick={() => onSelectFlight(FareData)}
                className="block text-center mt-5 md:mt-3 w-full bg-blue-50 text-blue-700 font-medium py-2 rounded-lg hover:text-primary duration-300"
              >
                {selectedFlight?.FareDataId === FareData.FareDataId
                  ? "Thay đổi"
                  : "Chọn"}
              </button>
            </div>
          </div>
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
            <div className="rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="py-3 px-6 bg-white rounded-lg">
                  <p className="text-gray-900 text-18 font-bold">Economy</p>
                  <div className="my-4 pb-4 border-b border-gray-200">
                    <div className="flex justify-between items-end w-3/4">
                      <p className="text-sm text-gray-700">Hạng vé</p>
                      <p className="font-medium text-sm">01_ECO</p>
                    </div>
                    <div className="flex justify-between items-end w-3/4 mt-3">
                      <p className="text-sm text-gray-700">Hành lý xách tay</p>
                      <p className="font-medium text-sm">7 kg</p>
                    </div>
                    <div className="flex justify-between items-end w-3/4 mt-3">
                      <p className="text-sm text-gray-700">Hành lý ký gửi</p>
                      <p className="font-medium text-sm">20 kg</p>
                    </div>
                    <button
                      className="mt-3 text-blue-700 border-b border-blue-700 font-medium"
                      onClick={() => toggleShowRuleTicket(flight.id)}
                      disabled={isLoadingRules}
                    >
                      {isLoadingRules ? (
                        <span className="loader_spiner"></span>
                      ) : (
                        "Chi tiết"
                      )}
                    </button>
                    {showRuleTicket === flight.id && (
                      <div className="mt-3">
                        <p className="text-[#4E6EB3] font-semibold ">
                          Điều kiện vé
                        </p>
                        {flight.ListRulesTicket ? (
                          <div
                            className="text-sm text-gray-600 mt-1 list-disc list-inside"
                            dangerouslySetInnerHTML={{
                              __html: flight.ListRulesTicket,
                            }}
                          ></div>
                        ) : (
                          <p>
                            Xin vui lòng liên hệ với Happy Book để nhận thông
                            tin chi tiết.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-primary text-22 font-bold">
                      1,436,000 vnđ
                    </p>
                    <p className="text-sm text-gray-700">
                      Tổng : 2,872,000 vnđ
                    </p>
                  </div>
                  <div className="mt-4">
                    <button className="text-center w-full border border-blue-600 bg-blue-600 text-white font-medium py-2 rounded-lg hover:text-primary duration-300">
                      Đặt vé
                    </button>
                  </div>
                </div>
                <div className="py-3 px-6 bg-white rounded-lg">
                  <p className="text-gray-900 text-18 font-bold">Economy</p>
                  <div className="my-4 pb-4 border-b border-gray-200">
                    <div className="flex justify-between items-end w-3/4">
                      <p className="text-sm text-gray-700">Hạng vé</p>
                      <p className="font-medium text-sm">01_ECO</p>
                    </div>
                    <div className="flex justify-between items-end w-3/4 mt-3">
                      <p className="text-sm text-gray-700">Hành lý xách tay</p>
                      <p className="font-medium text-sm">7 kg</p>
                    </div>
                    <div className="flex justify-between items-end w-3/4 mt-3">
                      <p className="text-sm text-gray-700">Hành lý ký gửi</p>
                      <p className="font-medium text-sm">20 kg</p>
                    </div>
                    <button className="mt-3 text-blue-700 border-b border-blue-700 font-medium">
                      Chi tiết
                    </button>
                  </div>
                  <div>
                    <p className="text-primary text-22 font-bold">
                      1,436,000 vnđ
                    </p>
                    <p className="text-sm text-gray-700">
                      Tổng : 2,872,000 vnđ
                    </p>
                  </div>
                  <div className="mt-4">
                    <button className="text-center w-full border border-blue-600 bg-blue-600 text-white font-medium py-2 rounded-lg hover:text-primary duration-300">
                      Đặt vé
                    </button>
                  </div>
                </div>
                <div className="py-3 px-6 bg-white rounded-lg">
                  <p className="text-gray-900 text-18 font-bold">Economy</p>
                  <div className="my-4 pb-4 border-b border-gray-200">
                    <div className="flex justify-between items-end w-3/4">
                      <p className="text-sm text-gray-700">Hạng vé</p>
                      <p className="font-medium text-sm">01_ECO</p>
                    </div>
                    <div className="flex justify-between items-end w-3/4 mt-3">
                      <p className="text-sm text-gray-700">Hành lý xách tay</p>
                      <p className="font-medium text-sm">7 kg</p>
                    </div>
                    <div className="flex justify-between items-end w-3/4 mt-3">
                      <p className="text-sm text-gray-700">Hành lý ký gửi</p>
                      <p className="font-medium text-sm">20 kg</p>
                    </div>
                    <button className="mt-3 text-blue-700 border-b border-blue-700 font-medium">
                      Chi tiết
                    </button>
                  </div>
                  <div>
                    <p className="text-primary text-22 font-bold">
                      1,436,000 vnđ
                    </p>
                    <p className="text-sm text-gray-700">
                      Tổng : 2,872,000 vnđ
                    </p>
                  </div>
                  <div className="mt-4">
                    <button className="text-center w-full border border-blue-600 bg-blue-600 text-white font-medium py-2 rounded-lg hover:text-primary duration-300">
                      Đặt vé
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="bg-white p-4 rounded-lg">
              <PassengerTable passengers={passengers} />
            </div> */}
            {/* <div className="mt-6 rounded-lg p-3 md:p-6 bg-white">
              <h2 className="text-xl font-semibold text-orange-600 mb-4">
                Chi tiết hành trình
              </h2>
              {flight.ListSegment.map((segment: any, index: number) => {
                const airPortStartPoint =
                  airports
                    .flatMap((country) => country.airports)
                    .find((airport) => airport.code === segment.StartPoint) ||
                  null;
                const airPortEndPoint =
                  airports
                    .flatMap((country) => country.airports)
                    .find((airport) => airport.code === segment.EndPoint) ||
                  null;
                return (
                  <div
                    className={`grid grid-cols-12 items-start gap-6 ${
                      index > 0 ? "border-t-gray-300 border-t pt-4 mt-4" : ""
                    }`}
                    key={index}
                  >
                    <div className="col-span-12 md:col-span-3 flex flex-col border-r border-gray-200 pr-8">
                      <div className="flex gap-4">
                        <Image
                          src={`/airline/${flight.Airline}.svg`}
                          width={48}
                          height={48}
                          alt="Logo"
                          className="w-12 h-12"
                        />
                        <div>
                          <h3 className="text-18 font-semibold mb-1">
                            {segment.Airline}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {segment.FlightNumber}
                          </p>
                        </div>
                      </div>
                      <p className="text-[#4E6EB3] font-semibold mt-4">
                        Điều kiện vé
                      </p>
                      {flight.ListRulesTicket ? (
                        <div
                          className="text-sm text-gray-600 mt-1 list-disc list-inside md:min-h-36"
                          dangerouslySetInnerHTML={{
                            __html: flight.ListRulesTicket,
                          }}
                        ></div>
                      ) : (
                        <p>
                          Xin vui lòng liên hệ với Happy Book để nhận thông tin
                          chi tiết.
                        </p>
                      )}
                    </div>
                    <div className="col-span-12 md:col-span-9 h-full w-full">
                      <div className="flex h-full items-start gap-2">
                        <div className="w-4/12 md:w-2/12 flex h-full justify-between flex-col items-end">
                          <div className="text-center w-full">
                            <p className="text-22 font-bold">
                              {formatTime(segment.StartTime)}
                            </p>
                            <p className="text-gray-500">
                              {formatDate(segment.StartTime)}
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
                              {segment.Duration
                                ? formatNumberToHoursAndMinutesFlight(
                                    segment.Duration
                                  )
                                : formatNumberToHoursAndMinutesFlight(
                                    segment.StopTime
                                  )}
                            </p>
                          </div>
                          <div className="text-center w-full">
                            <p className="text-22 font-bold">
                              {formatTime(segment.EndTime)}
                            </p>
                            <p className="text-gray-500">
                              {formatDate(segment.EndTime)}
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
                            <p className="text-22 font-bold">
                              {`${airPortStartPoint?.city ?? ""} (${
                                segment.StartPoint
                              })`}
                            </p>
                            <p className="text-gray-500 mt-1 h-6"></p>
                          </div>
                          <div
                            className="rounded-lg text-white p-4"
                            style={{
                              background:
                                "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                            }}
                          >
                            <p className="text-sm">Máy bay: {segment.Plane}</p>
                            <p className="text-sm">
                              Chuyến bay: {segment.FlightNumber}
                            </p>
                            <p className="text-sm">
                              Hạng: {flight.GroupClass ?? ""}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 mt-1 h-6"></p>
                            <p className="text-22 font-bold">
                              {`${airPortEndPoint?.city ?? ""} (${
                                segment.EndPoint
                              })`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div> */}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default FlightDetails;
