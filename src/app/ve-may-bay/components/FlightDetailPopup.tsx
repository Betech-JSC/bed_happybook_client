"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { differenceInSeconds, format } from "date-fns";
import {
  formatNumberToHoursAndMinutesFlight,
  formatTime,
} from "@/lib/formatters";
import { FlightDetailPopupProps } from "@/types/flight";
import DisplayImage from "@/components/DisplayImage";

export default function FlightDetailPopup({
  isOpen,
  tabs = [
    { id: 1, name: "Chi tiết chuyến bay" },
    { id: 2, name: "Điều kiện vé" },
  ],
  airports,
  flights,
  onClose,
}: FlightDetailPopupProps) {
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
  return (
    <div
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
          <div className="bg-white max-h-[90vh] min-h-[60vh] overflow-y-auto py-6 px-4 md:px-8 pb-8 md:max-w-[680px] md:min-w-[680px] rounded-lg">
            {tabs.length > 1 && (
              <div className="flex justify-between items-end">
                <p className="text-22 font-bold">Chi tiết</p>
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
              className={`flex ${
                tabs.length > 1 ? "mt-3" : "justify-between"
              } `}
            >
              {tabs.map((tab: any, index: number) => (
                <div key={index} onClick={() => setActiveTab(tab.id)}>
                  <button
                    className={`py-2 font-bold duration-150 transition-colors pb-2 outline-none 
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
                  >
                    {tab.name}
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
                flights.map((flight: any, key: number) => (
                  <div
                    key={key}
                    className={` bg-white ${
                      key > 0 ? "pt-6 border-t border-t-gray-300" : "mt-4 pb-6"
                    }`}
                  >
                    <h2
                      className="text-xl py-1 px-4 font-semibold text-white mb-6 max-w-fit rounded-lg"
                      style={{
                        background:
                          "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                      }}
                    >
                      {flight.Leg ? "Chiều về" : " Chiều đi"}
                    </h2>
                    {flight.ListSegment.map((segment: any, index: number) => {
                      const durationFlight =
                        differenceInSeconds(
                          new Date(segment.EndTime),
                          new Date(segment.StartTime)
                        ) / 60;
                      const airPortStartPoint =
                        airports
                          .flatMap((country: any) => country.airports)
                          .find(
                            (airport: any) =>
                              airport.code === segment.StartPoint
                          ) || null;
                      const airPortEndPoint =
                        airports
                          .flatMap((country: any) => country.airports)
                          .find(
                            (airport: any) => airport.code === segment.EndPoint
                          ) || null;
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
                                    {formatTime(segment.StartTime)}
                                  </p>
                                  <p className="text-gray-500">
                                    {format(
                                      new Date(segment.StartTime),
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
                                    {formatTime(segment.EndTime)}
                                  </p>
                                  <p className="text-gray-500">
                                    {format(
                                      new Date(segment.EndTime),
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
                                  <div className="text-22 font-bold">
                                    {airPortStartPoint
                                      ? `${airPortStartPoint?.city ?? ""} (${
                                          segment.StartPoint
                                        })`
                                      : `${segment.StartPoint}`}
                                  </div>
                                  <p className="text-gray-500 mt-1 h-6"></p>
                                </div>
                                <div className="rounded-lg py-3 px-4 bg-gray-50">
                                  <div className="flex space-x-3">
                                    <DisplayImage
                                      imagePath={`assets/images/airline/${segment.Airline.toLowerCase()}.gif`}
                                      width={82}
                                      height={24}
                                      alt={"AirLine"}
                                      classStyle={
                                        "max-w-20 md:max-w-24 max-h-10"
                                      }
                                    />
                                    <p className="font-bold">
                                      {segment.Airline}
                                    </p>
                                  </div>
                                  <div className="mt-3 flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0 text-sm font-medium">
                                    <p>{segment.FlightNumber}</p>
                                    <p className="hidden md:block">-</p>
                                    <p>Hạng: {flight.GroupClass ?? ""}</p>
                                  </div>
                                  <div className="mt-3 flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0 text-sm font-medium">
                                    <p>{`Hành lý xách tay: ${
                                      segment.HandBaggage
                                        ? segment.HandBaggage
                                        : ""
                                    }`}</p>
                                    {segment.AllowanceBaggage && (
                                      <p>{`Hành lý ký gửi: ${segment.AllowanceBaggage}`}</p>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-gray-500 mt-1 h-6"></p>
                                  <p className="text-22 font-bold">
                                    {airPortEndPoint
                                      ? `${airPortEndPoint?.city ?? ""} (${
                                          segment.EndPoint
                                        })`
                                      : `${segment.EndPoint}`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              {activeTab === 2 && (
                <div>
                  {flights[0].ListRulesTicket ? (
                    <div
                      className="text-sm text-gray-600 mt-1 list-disc list-inside"
                      dangerouslySetInnerHTML={{
                        __html: flights[0].ListRulesTicket,
                      }}
                    ></div>
                  ) : (
                    <p>
                      Xin vui lòng liên hệ với Happy Book để nhận thông tin chi
                      tiết.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
