"use client";
import { FlightApi } from "@/api/Flight";
import LoadingButton from "@/components/LoadingButton";
import { formatNumberToHoursAndMinutesFlight } from "@/lib/formatters";
import {
  FlightBookingInforBody,
  FlightBookingInforType,
} from "@/schemaValidations/flightBookingInfor.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function FlightBookForm() {
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FlightBookingInforType>({
    resolver: zodResolver(FlightBookingInforBody),
  });

  const onSubmit = async (data: FlightBookingInforType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  // Fetch and Handle Data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const params = {
  //         ListFareData: [
  //           {
  //             Session: "",
  //             FareDataId: 0,
  //             ListFlight: [
  //               {
  //                 FlightValue: "",
  //               },
  //             ],
  //           },
  //         ],
  //       };
  //       const response = await FlightApi.getBaggage(
  //         "flights/getbaggage",
  //         params
  //       );
  //       const listFareData = response?.payload.data.ListFareData ?? [];
  //     } catch (error: any) {
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);
  return (
    <form className="mt-4 rounded-xl" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col-reverse items-start md:flex-row md:space-x-8 lg:mt-4 pb-8">
        <div className="w-full md:w-7/12 lg:w-8/12 mt-4 md:mt-0 bg-white rounded-2xl">
          <div
            className="rounded-t-xl"
            style={{
              background:
                "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
            }}
          >
            <h3 className="text-22 py-4 px-8 font-semibold text-white">
              Thông tin khách hàng
            </h3>
          </div>

          <div className="mt-4 pt-4 pb-8 px-4 md:px-8">
            <div className="p-4 bg-gray-100 rounded-lg">
              <span className="text-22 font-semibold px-4">1 người lớn</span>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="relative">
                <label
                  htmlFor="service"
                  className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                >
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                  <select
                    className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                    {...register("atd_gender")}
                  >
                    <option value="" disabled selected>
                      Vui lòng chọn giới tính
                    </option>
                    <option value="male">Quý ông</option>
                    <option value="female">Quý bà</option>
                  </select>
                </div>
                {errors.atd_gender && (
                  <p className="text-red-600">{errors.atd_gender.message}</p>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="fullName"
                  className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  {...register("atd_name")}
                  placeholder="Nhập họ và tên"
                  title="Nhập họ và tên"
                  className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                />
                {errors.atd_name && (
                  <p className="text-red-600">{errors.atd_name.message}</p>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="service"
                  className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                >
                  Hành lý
                </label>
                <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                  <select className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5">
                    <option>Vui lòng chọn gói hành lý</option>
                    <option value="male">Quý ông</option>
                    <option value="female">Quý bà</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-xl">
              <div className="text-22 font-semibold">Thông tin liên hệ</div>
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="relative">
                  <label
                    htmlFor="gender_person_contact"
                    className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    Giới tính <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="gender_person_contact"
                    {...register("gender_person_contact")}
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                  >
                    <option
                      value=""
                      className="text-gray-300"
                      disabled
                      selected
                    >
                      Vui lòng chọn giới tính
                    </option>
                    <option value="male">Quý ông</option>
                    <option value="female">Quý bà</option>
                  </select>
                  {errors.gender_person_contact && (
                    <p className="text-red-600">
                      {errors.gender_person_contact.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label
                    htmlFor="fullName"
                    className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    {...register("fullname_person_contact")}
                    placeholder="Nhập họ và tên"
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                  />
                  {errors.fullname_person_contact && (
                    <p className="text-red-600">
                      {errors.fullname_person_contact.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label
                      htmlFor="phone"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="text"
                      {...register("phone_person_contact")}
                      placeholder="Nhập số điện thoại"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                    />
                    {errors.phone_person_contact && (
                      <p className="text-red-600">
                        {errors.phone_person_contact.message}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email_person_contact"
                      type="text"
                      placeholder="Nhập email"
                      {...register("email_person_contact")}
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                    />
                    {errors.email_person_contact && (
                      <p className="text-red-600">
                        {errors.email_person_contact.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <textarea
                  placeholder="Yêu cầu đặc biệt"
                  className="w-full border border-gray-300 rounded-lg h-28 focus:outline-none focus:border-primary indent-3.5 pt-2.5"
                ></textarea>
              </div>
              <div className="mt-2 flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="generateInvoice"
                  checked={generateInvoice}
                />
                <span
                  className="text-sm"
                  onClick={() => {
                    setGenerateInvoice(!generateInvoice);
                  }}
                >
                  Tôi muốn xuất hóa đơn
                </span>
              </div>
              {generateInvoice && (
                <div className="mt-6">
                  <span className="text-22 font-semibold">
                    Phương thức thanh toán
                  </span>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex space-x-3 items-center">
                      <input type="radio" />
                      <div className="flex space-x-3">
                        <div className="font-normal">
                          <Image
                            src="/payment-method/cash.svg"
                            alt="Icon"
                            width={24}
                            height={24}
                            className="w-6 h-6"
                          />
                        </div>
                        <div>
                          <span>Thanh toán tiền mặt</span>
                          <p className="text-gray-500">
                            Quý khách vui lòng giữ liên lạc để đội ngũ CSKH liên
                            hệ xác nhận
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3 items-center">
                      <input type="radio" />
                      <div className="flex space-x-3">
                        <div className="font-normal">
                          <Image
                            src="/payment-method/vnpay.svg"
                            alt="Icon"
                            width={24}
                            height={24}
                            className="w-6 h-6"
                          />
                        </div>
                        <div>
                          <span>Thanh toán bằng VNPAY</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3 items-center">
                      <input type="radio" />
                      <div className="flex space-x-3">
                        <div className="font-normal">
                          <Image
                            src="/payment-method/transfer.svg"
                            alt="Icon"
                            width={24}
                            height={24}
                            className="w-6 h-6"
                          />
                        </div>
                        <div>
                          <span className="block">Chuyển khoản</span>
                          <button className="text-blue-700 underline">
                            Thông tin chuyển khoản
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full md:w-5/12 lg:w-4/12 bg-white rounded-2xl pb-6">
          <div className="pb-0 py-4 px-3 lg:px-6">
            <div className="flex justify-between">
              <span className="text-22 font-semibold">Thông tin đặt chỗ</span>
              <Link href="/ve-may-bay" className="underline text-blue-700">
                Đổi chuyến
              </Link>
            </div>
          </div>
          {/* Flight */}
          <div>
            <div className="pb-0 py-4 px-3 lg:px-6">
              <div className="flex my-3 item-start items-center text-left space-x-3">
                <Image
                  src={`/airline/VJ.svg`}
                  width={48}
                  height={48}
                  alt="AirLine"
                  className="w-12 h-12"
                />
                <div>
                  <h3 className="text-sm md:text-18 font-semibold mb-1">
                    Viettjet Air
                  </h3>
                  <p className="text-sm text-gray-500">VJ123</p>
                </div>
              </div>
              <div className="text-center mt-3 flex justify-between">
                <div className="flex items-center justify-between gap-4 w-full">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold">
                      {/* {formatTime()} */}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm">
                      HAN
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
                        {formatNumberToHoursAndMinutesFlight(125)}
                      </span>
                      <div className="relative flex items-center w-full">
                        <div className="flex-grow h-px bg-gray-700"></div>
                        <div className="flex-shrink-0 w-4 h-4 bg-white border-2 border-gray-400 rounded-full absolute left-1/2 -translate-x-1/2"></div>
                      </div>
                      <span className="text-sm text-gray-700 mt-2">
                        Bay thẳng
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
                      {/* {formatTime(flight.EndDate)} */}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm">
                      SGN
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Line process */}
            <div className="mt-6 flex flex-row items-center justify-between w-full overflow-hidden">
              <div className="w-8 h-8 bg-gray-100 rounded-full -ml-3"></div>
              <div className="relative w-full h-px mx-2 overflow-hidden">
                <div className="w-full h-1 bg-gradient-to-r from-[#4E6EB3] to-[#4E6EB3] via-transparent bg-[length:16px_2px] bg-repeat-x"></div>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full -mr-3"></div>
            </div>
            <div className="py-4 px-3 lg:px-6">
              <p className="text-22 font-semibold">Thông tin thanh toán</p>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-500 ">
                  Người lớn (1,220,600 x 01)
                </span>
                <p className="font-semibold">1,220,600 vnđ</p>
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-sm text-gray-500 ">Hành lý bổ sung</span>
                <p className="font-semibold">216,000 vnđ</p>
              </div>
              <div className="flex mt-4 pt-4 pb-6 justify-between border-t border-t-gray-200">
                <span className="text-sm text-gray-500 ">Tổng cộng</span>
                <p className="font-semibold text-primary">1,436,600 vnđ</p>
              </div>
            </div>
          </div>
          <div className="pb-0 py-4 px-3 lg:px-6">
            <LoadingButton
              isLoading={loading}
              text="Thanh toán"
              disabled={false}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
