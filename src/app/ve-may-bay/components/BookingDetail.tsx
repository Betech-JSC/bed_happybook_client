"use client";
import {
  formatDate,
  formatNumberToHoursAndMinutesFlight,
  formatTime,
} from "@/lib/formatters";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { getAirportsDefault, handleSessionStorage } from "@/utils/Helper";
import { toast } from "react-hot-toast";
import { abort } from "process";
import { notFound } from "next/navigation";

const airports = getAirportsDefault();

export default function BookingDetail() {
  let priceAdt = 0;
  let priceChd = 0;
  let priceInf = 0;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  toast.dismiss();
  useEffect(() => {
    const bookingData = handleSessionStorage("get", "bookingFlight");
    setLoading(false);
    if (bookingData) {
      setData(bookingData);
    }
  }, []);
  if (loading) {
    return (
      <div
        className={`flex my-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
      >
        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
        <span className="text-18">Đang tải thông tin đặt chỗ...</span>
      </div>
    );
  }

  if (!data || !data.ListBooking) notFound();

  const mergeArraysPassenger = (bookings: any) => {
    const map = new Map<number, any>();
    bookings.forEach((booking: any) => {
      booking.ListPassenger.forEach((passenger: any) => {
        switch (passenger.Type) {
          case "ADT":
            passenger.totalPrice = priceAdt;
            break;
          case "CHD":
            passenger.totalPrice = priceChd;
            break;
          case "INF":
            passenger.totalPrice = priceInf;
            break;
        }
        if (!map.has(passenger.Index)) {
          map.set(passenger.Index, { ...passenger });
        }
      });
    });

    return Array.from(map.values());
  };
  if (data?.ListBooking) {
    data.ListBooking.map((item: any) => {
      item.ListFareData.map((fareData: any) => {
        priceAdt += fareData.FareAdt + fareData.TaxAdt;
        priceChd += fareData.FareChd + fareData.TaxChd;
        priceChd += fareData.FareInf + fareData.TaxInf;
      });
    });
  }
  const ListPassenger: any[] = data
    ? mergeArraysPassenger(data.ListBooking)
    : [];
  const ExpiryDatePayment = data ? data.ListBooking[0].ExpiryDt : "";
  const bookingData = data ? data.ListBooking : [];
  const contact = data ? data.contact : [];
  return (
    <div>
      <Fragment>
        <div className="bg-white rounded-2xl p-6 text-center">
          <h2 className="pl-2 text-22 font-bold">
            <p className="text-green-600">
              Xin chúc mừng. Quý Khách đã đặt chỗ thành công!
            </p>
          </h2>
        </div>
        <div className="bg-white rounded-2xl mt-6">
          <div className="p-3 md:p-6 md:pb-0">
            <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
              Chi tiết chuyến bay
            </h2>
          </div>
          {bookingData.map((booking: any) => {
            const fareData: any[] = booking ? booking.ListFareData : [];
            return (
              <div className="p-3 md:p-6" key={booking.BookingCode}>
                {fareData &&
                  fareData.map((item, index) => {
                    const flight = item.ListFlight[0];
                    const fromOption = airports
                      .flatMap((country) => country.airports)
                      .find((airport) => airport.code === flight.StartPoint);
                    const toOption = airports
                      .flatMap((country) => country.airports)
                      .find((airport) => airport.code === flight.EndPoint);
                    return (
                      <Fragment key={index}>
                        <div
                          className="flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-3 md:space-y-0 justify-between text-white p-4 rounded-t-2xl shadow-md items-start"
                          style={{
                            background:
                              " linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                          }}
                        >
                          <div className="flex space-x-3">
                            <div className="w-10 self-center h-10 p-2 bg-primary rounded-lg inline-flex items-center justify-center">
                              <Image
                                src="/icon/AirplaneTilt.svg"
                                width={20}
                                height={20}
                                alt="Icon"
                                className="w-5 h-5"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {`${fromOption?.city} - ${toOption?.city}`}
                              </h3>
                            </div>
                          </div>

                          <div>
                            Mã đặt chỗ:{" "}
                            <span className=" font-bold text-xl">
                              {booking.BookingCode}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 md:p-6 rounded-lg bg-white border border-gray-300">
                          {flight.ListSegment.map(
                            (segment: any, index: number) => {
                              const airPortStartPoint =
                                airports
                                  .flatMap((country) => country.airports)
                                  .find(
                                    (airport) =>
                                      airport.code === segment.StartPoint
                                  ) || null;
                              const airPortEndPoint =
                                airports
                                  .flatMap((country) => country.airports)
                                  .find(
                                    (airport) =>
                                      airport.code === segment.EndPoint
                                  ) || null;
                              return (
                                <div
                                  className={`grid grid-cols-12 items-center gap-6 ${
                                    index > 0
                                      ? "border-t-gray-300 border-t pt-4 mt-4"
                                      : ""
                                  }`}
                                  key={index}
                                >
                                  <div className="col-span-12 md:col-span-2 flex flex-col">
                                    <div className="flex items-center justify-center gap-4">
                                      <Image
                                        src={`/airline/${flight.Airline}.svg`}
                                        width={72}
                                        height={72}
                                        alt="Logo"
                                        className="w-20 h-20"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-span-12 md:col-span-10 h-full w-full">
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
                                            {`${
                                              airPortStartPoint?.city ?? ""
                                            } (${segment.StartPoint})`}
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
                                          <p className="text-sm">
                                            Máy bay: {segment.Plane}
                                          </p>
                                          <p className="text-sm mt-1">
                                            Chuyến bay: {segment.FlightNumber}
                                          </p>
                                          <p className="text-sm mt-1">
                                            Hạng chỗ: {segment.Class ?? ""}
                                          </p>
                                          <p className="text-sm mt-1">
                                            Hành lý xách tay:{" "}
                                            {segment.HandBaggage ?? ""}
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
                            }
                          )}
                        </div>
                      </Fragment>
                    );
                  })}
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-2xl p-6 mt-6">
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Thông tin hành khách và giá vé
          </h2>
          <div className="mt-6 overflow-y-auto">
            <table className="w-full border-collapse mt-4 text-center">
              <thead>
                <tr className="bg-[#FEF8F5]">
                  <th className="border-b border-r text-primary font-semibold rounded-t-lg border-gray-200 py-4 px-4 lg:px-12">
                    STT
                  </th>
                  <th className="border-b border-r text-primary font-semibold rounded-t-lg border-gray-200 py-4 px-4 lg:px-12">
                    Hành khách
                  </th>
                  <th className="border-b border-r text-primary font-semibold rounded-t-lg border-gray-200 py-4 px-4 lg:px-12">
                    Giới tính
                  </th>
                  <th className="border-b border-r text-primary font-semibold rounded-t-lg border-gray-200 py-4 px-4 lg:px-12">
                    Năm sinh
                  </th>
                  <th className="border-b border-r text-primary font-semibold rounded-t-lg border-gray-200 py-4 px-4 lg:px-12">
                    Tổng
                  </th>
                </tr>
              </thead>
              <tbody>
                {ListPassenger.map((passenger, index) => (
                  <tr key={index}>
                    <td className="border-b border-r border-gray-200 py-3 px-4 lg:px-12">
                      {passenger.Index + 1}
                    </td>
                    <td className="border-b border-r border-gray-200 py-3 px-4 lg:px-12">
                      {`${passenger.FirstName} ${passenger.LastName}`}
                    </td>
                    <td className="border-b border-r border-gray-200 py-3 px-4 lg:px-12">
                      {passenger.Gender ? "Nam" : "Nữ"}
                    </td>
                    <td className="border-b border-r border-gray-200 py-3 px-4 lg:px-12">
                      {format(
                        parse(passenger.Birthday, "ddMMyyyy", new Date()),
                        "dd-MM-yyyy"
                      )}
                    </td>
                    <td className="border-b border-r border-gray-200 py-3 px-4 lg:px-12">
                      {passenger.totalPrice.toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-base mt-4">
            Hạn thanh toán:{" "}
            <span className="text-[red]">
              Quý khách vui lòng thanh toán, đặt chỗ sẽ hết hạn nếu quý khách
              không thanh toán trước thời gian:{" "}
              {format(
                parse(ExpiryDatePayment, "ddMMyyyy HH:mm:ss", new Date()),
                "HH:mm, 'ngày' dd-MM-yyyy"
              )}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 mt-6">
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Thông tin liên hệ
          </h2>
          <div className="grid gap-4 mt-6">
            <div className="flex space-x-4 items-center">
              <p className="font-semibold md:w-56">Họ & Tên:</p>
              <p>{`${contact.first_name} ${contact.last_name}`}</p>
            </div>
            <div className="flex space-x-4 items-center">
              <p className="font-semibold md:w-56">Email:</p>
              <p>{contact.email}</p>
            </div>
            <div className="flex space-x-4 items-center">
              <p className="font-semibold md:w-56">Điện thoại:</p>
              <p>{contact.phone}</p>
            </div>
          </div>
        </div>
      </Fragment>
    </div>
  );
}
