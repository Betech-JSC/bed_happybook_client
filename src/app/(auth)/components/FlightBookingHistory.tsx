import { AirportsCountry } from "@/types/flight";
import { Fragment } from "react";
import { differenceInSeconds, format, parseISO } from "date-fns";
import DisplayImage from "@/components/base/DisplayImage";
import { formatTime } from "@/lib/formatters";
import Image from "next/image";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { getServerT } from "@/lib/i18n/getServerT";
import { StatusLabel } from "@/components/base/StatusLabel";
import { PaymentMethodLabel } from "@/components/base/PaymentMethodLabel";
import { isBefore } from "date-fns";

export default async function FlightBookingHistory({
  flights,
  airports,
}: {
  flights: any;
  airports: AirportsCountry[];
}) {
  const t = await getServerT();
  return (
    <Fragment>
      <p className="mb-6 text-xl md:text-2xl font-semibold">
        {t("lich_su_dat_ve_may_bay")}
      </p>
      {flights?.length > 0 ? (
        flights.map((flight: any, indexFlight: number) =>
          flight.fare_datas.map((fareData: any) => {
            const flightData = fareData.flights[0];
            const fromOption = airports
              .flatMap((country) => country.airports)
              .find((airport) => airport.code === flightData.StartPoint);
            const toOption = airports
              .flatMap((country) => country.airports)
              .find((airport) => airport.code === flightData.EndPoint);
            const isOverTimeOrder = isBefore(
              flight.booking_deadline,
              new Date()
            );
            return (
              <div
                key={indexFlight}
                className="bg-white rounded-xl p-3 md:p-6 border border-gray-300 mb-6 last:mb-0"
              >
                <div className="flex flex-col md:flex-row gap-3 justify-between mb-5 ">
                  <p className="text-18 font-medium">
                    {t("ngay_dat")}{" "}
                    {format(parseISO(flight.created_at), "HH:mm dd-MM-yyyy")}
                  </p>
                  <Link
                    href={`${
                      flight.status === "new" &&
                      !isOverTimeOrder &&
                      !flight.payment_method
                        ? `/lich-su-dat-ve/${flight.sku}`
                        : "#"
                    }`}
                    className="flex flex-col gap-3 md:gap-2 items-start md:items-end"
                  >
                    <StatusLabel
                      status={
                        isOverTimeOrder &&
                        !["done", "paid"].includes(flight.status)
                          ? "close"
                          : flight.status
                      }
                      label={`${
                        isOverTimeOrder &&
                        !["done", "paid", "close"].includes(flight.status)
                          ? "Quá hạn thanh toán"
                          : ""
                      }`}
                    />
                    <PaymentMethodLabel method={flight.payment_method} />
                  </Link>
                </div>
                <div className="flex flex-col lg:flex-row pb-3 border-b border-gray-300 lg:space-x-3">
                  <p className="lg:w-2/12 text-sm text-gray-700">
                    {t("chuyen_bay")}
                  </p>
                  <div className="lg:w-10/12 font-bold">
                    {fromOption && toOption ? (
                      <p data-translate="true">
                        {`${fromOption?.city} (${fromOption.code}) - ${toOption?.city} (${toOption.code}) `}
                      </p>
                    ) : (
                      <p data-translate="true">{`${flightData.StartPoint} - ${flightData.EndPoint}`}</p>
                    )}
                  </div>
                </div>
                {flightData.segments.map(
                  (segment: any, segmentIndex: number) => {
                    const fromSegmenOption = airports
                      .flatMap((country) => country.airports)
                      .find((airport) => airport.code === segment.StartPoint);
                    const toSegmentOption = airports
                      .flatMap((country) => country.airports)
                      .find((airport) => airport.code === segment.EndPoint);
                    const durationFlight =
                      differenceInSeconds(
                        new Date(segment.EndTime),
                        new Date(segment.StartTime)
                      ) / 60;
                    return (
                      <div
                        key={segment.datacom_segment_id}
                        className="flex flex-col-reverse lg:flex-row items-start justify-between mt-4 lg:space-x-3"
                      >
                        <div className="w-full lg:w-2/12 mt-5 lg:mt-0">
                          <div className="flex flex-row lg:flex-col justify-between lg:justify-normal items-center md:items-baseline w-full text-left mb-3">
                            <div>
                              <DisplayImage
                                imagePath={`assets/images/airline/${segment.Airline.toLowerCase()}.gif`}
                                width={80}
                                height={24}
                                alt={"AirLine"}
                                classStyle={"max-w-16 md:max-w-20 max-h-10"}
                              />
                            </div>
                            <div className="">
                              <h3
                                className="text-sm my-2"
                                style={{ wordBreak: "break-word" }}
                              >
                                {segment.FlightNumber}
                              </h3>
                              <div className="text-sm text-gray-500">
                                <span> {t("hang")} </span>
                                <span>{segment.Class}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="lg:w-10/12 text-center flex justify-between">
                          <div className="flex gap-6 w-full">
                            <div className="w-[30%] flex flex-col items-center md:items-start justify-start text-left">
                              <span
                                className="text-sm w-full"
                                data-translate="true"
                              >
                                {format(
                                  new Date(segment.StartTime),
                                  "EEEE, d 'tháng' M yyyy",
                                  { locale: vi }
                                )}
                              </span>
                              <span className="mt-2 text-lg font-bold w-full">
                                {formatTime(segment.StartTime)}
                              </span>
                              <span className="mt-2 text-sm text-gray-500 w-full">
                                {fromSegmenOption ? (
                                  <p data-translate="true">
                                    {`${fromSegmenOption?.city} (${segment.StartPoint})`}
                                  </p>
                                ) : (
                                  <p>{segment.StartPoint}</p>
                                )}
                              </span>
                            </div>

                            <div className="w-[30%] flex items-center space-x-3">
                              <div className="flex flex-col space-y-2 items-center w-full">
                                <span className="text-sm text-gray-700 ">
                                  <Image
                                    src={`/icon/AirplaneTilt-2.svg`}
                                    width={20}
                                    height={20}
                                    alt="Icon"
                                    className="w-5 h-5"
                                  />
                                </span>
                                <div className="relative flex items-center w-full">
                                  <div className="flex-shrink-0 w-1 h-1 bg-white border-2 border-gray-700 rounded-full"></div>
                                  <div className="flex-grow h-px bg-gray-500"></div>
                                  <div className="flex-shrink-0 w-1 h-1 bg-white border-2 border-gray-700 rounded-full"></div>
                                </div>
                                <span
                                  className="text-sm text-gray-700"
                                  data-translate="true"
                                >
                                  {durationFlight
                                    ? `${Math.floor(
                                        durationFlight / 60
                                      )} giờ ${Math.floor(
                                        durationFlight % 60
                                      )} phút`
                                    : ""}
                                </span>
                                {flightData.legs < 1 && (
                                  <span
                                    className="text-sm text-gray-500"
                                    data-translate="true"
                                  >
                                    Bay thẳng
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="w-[30%] flex flex-col items-center md:items-start justify-start text-left">
                              <span
                                className="text-sm w-full"
                                data-translate="true"
                              >
                                {format(
                                  new Date(segment.EndTime),
                                  "EEEE, d 'tháng' M yyyy",
                                  { locale: vi }
                                )}
                              </span>
                              <span className="mt-2 text-lg font-bold w-full">
                                {formatTime(segment.EndTime)}
                              </span>
                              <span className="mt-2 text-sm text-gray-500 w-full">
                                {toSegmentOption ? (
                                  <p data-translate="true">{`${toSegmentOption?.city} (${segment.EndPoint})`}</p>
                                ) : (
                                  <p>{segment.EndPoint}</p>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
                <div></div>
              </div>
            );
          })
        )
      ) : (
        <div className="text-center">
          <p data-translate="true">Bạn chưa đặt vé trên hệ thống...</p>
          <Link href="/ve-may-bay" className="block mt-1 text-blue-700">
            Đặt ngay
          </Link>
        </div>
      )}
    </Fragment>
  );
}
