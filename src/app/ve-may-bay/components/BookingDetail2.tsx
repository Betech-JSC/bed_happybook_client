"use client";
import { formatTime } from "@/lib/formatters";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { differenceInSeconds, format, parse } from "date-fns";
import { vi } from "date-fns/locale";
import { handleSessionStorage } from "@/utils/Helper";
import { toast } from "react-hot-toast";
import { notFound, useRouter } from "next/navigation";
import { BookingDetailProps } from "@/types/flight";
import LoadingButton from "@/components/LoadingButton";
import { FlightApi } from "@/api/Flight";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckOutBody,
  CheckOutBodyType,
} from "@/schemaValidations/checkOut.schema";

export default function BookingDetail2({ airports }: BookingDetailProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [data, setData] = useState<any>(null);
  const [totalBaggages, setTotalBaggages] = useState<{
    price: number;
    quantity: number;
  }>({ price: 0, quantity: 0 });
  const [isLoadingRules, setIsLoadingRules] = useState<boolean>(false);
  const [showRuleTicket, setShowRuleTicket] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSubmitForm, setLoadingSubmitForm] = useState<boolean>(false);

  const toggleDropdown = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const [isStickySideBar, setStickySideBar] = useState<boolean>(true);
  const [showTransferInfor, setShowTransferInfor] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckOutBodyType>({
    resolver: zodResolver(CheckOutBody),
    mode: "onSubmit",
  });
  const onSubmit = (dataForm: CheckOutBodyType) => {
    const finalData = {
      ...dataForm,
      sku: data?.orderInfo.sku,
    } as CheckOutBodyType & { sku: string };
    const updatePaymentMethod = async () => {
      try {
        setLoadingSubmitForm(true);
        const respon = await FlightApi.updatePaymentMethod(finalData);
        if (respon?.status === 200) {
          reset();
          toast.success("Gửi yêu cầu thành công!");
          handleSessionStorage("remove", ["bookingFlight"]);
          setTimeout(() => {
            router.push("/ve-may-bay");
          }, 600);
        } else {
          toast.error("Gửi yêu cầu thất bại!");
        }
      } catch (error: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau");
      } finally {
        setLoadingSubmitForm(false);
      }
    };
    if (finalData) {
      updatePaymentMethod();
    }
  };

  let keyLoopDropdown = 1;
  let totalPrice = 0;
  let totalAdt = 1;
  let totalChd = 0;
  let totalInf = 0;
  let totalPriceAdt = 0;
  let totalPriceChd = 0;
  let totalPriceInf = 0;
  let totalPriceTicketAdt = 0;
  let totalPriceTicketChd = 0;
  let totalPriceTicketInf = 0;
  let totalTaxAdt = 0;
  let totalTaxChd = 0;
  let totalTaxInf = 0;
  let dropdown: any = [];
  let fareData: any = [];
  if (data?.datacom_data?.ListFareStatus.length) {
    data?.datacom_data?.ListFareStatus.map((fareStatus: any, index: number) => {
      const item = fareStatus.FareData;
      fareData.push(item);
      totalPrice += item.TotalPrice;
      totalAdt = item.Adt > totalAdt ? item.Adt : totalAdt;
      totalChd = item.Chd > totalChd ? item.Chd : totalChd;
      totalInf = item.Inf > totalInf ? item.Inf : totalInf;
      totalPriceAdt += (item.FareAdt + item.TaxAdt) * item.Adt;
      totalPriceChd += (item.FareChd + item.TaxChd) * item.Chd;
      totalPriceTicketAdt += item.FareAdt * item.Adt;
      totalPriceTicketChd += item.FareChd * item.Chd;
      totalPriceTicketInf += item.FareInf * item.Inf;
      totalTaxAdt += item.TaxAdt * item.Adt;
      totalTaxChd += item.TaxChd * item.Chd;
      totalTaxInf += item.TaxInf * item.Inf;
    });
  }

  if (totalAdt) {
    dropdown.push({
      totalPrice: totalPriceAdt,
      quantity: totalAdt,
      totalPriceTicket: totalPriceTicketAdt,
      totalTax: totalTaxAdt,
      type: "Adt",
      title: "Vé người lớn",
    });
  }
  if (totalChd) {
    dropdown.push({
      totalPrice: totalPriceChd,
      quantity: totalChd,
      totalPriceTicket: totalPriceTicketChd,
      totalTax: totalTaxChd,
      type: "Chd",
      title: "Vé trẻ em",
    });
  }
  if (totalInf) {
    dropdown.push({
      totalPrice: totalPriceInf,
      quantity: totalInf,
      totalPriceTicket: totalPriceTicketInf,
      totalTax: totalTaxInf,
      type: "Inf",
      title: "Vé em bé",
    });
  }

  //   toast.dismiss();
  useEffect(() => {
    const bookingData = handleSessionStorage("get", "bookingFlight");
    setLoading(false);
    if (bookingData) {
      setData(bookingData);
      if (bookingData.passengers.length) {
        const accumulated = bookingData.passengers.reduce(
          (acc: { price: number; quantity: number }, item: any) => {
            if (Array.isArray(item.baggages)) {
              item.baggages.forEach((bag: any) => {
                acc.price += bag.price;
                acc.quantity++;
              });
            }
            return acc;
          },
          { price: 0, quantity: 0 }
        );
        setTotalBaggages(accumulated);
      }
    }
  }, []);

  const calculateTargetTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now;
  };

  const calculateTimeLeft = (targetTime: Date) => {
    const difference = +targetTime - +new Date();
    let timeLeft = { minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  // const [targetTime] = useState(calculateTargetTime());
  // const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetTime));

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTimeLeft(calculateTimeLeft(targetTime));
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [targetTime]);

  const fetchFareRules = useCallback(async (FareData: any) => {
    try {
      setIsLoadingRules(true);
      const flight = FareData.ListFlight[0];
      const params = {
        FlightRequest: {
          ListFareData: [
            {
              Session: FareData.Session,
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
  }, []);

  const toggleShowRuleTicket = useCallback(
    async (FareData: any, indexFlight: number) => {
      setShowRuleTicket(
        showRuleTicket === FareData.ListFlight[indexFlight].FlightId
          ? null
          : FareData.ListFlight[indexFlight].FlightId
      );

      if (!FareData.ListFlight[indexFlight].ListRulesTicket) {
        FareData.ListFlight[indexFlight].ListRulesTicket = await fetchFareRules(
          FareData
        );
      }
    },
    [showRuleTicket, fetchFareRules]
  );

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setStickySideBar(true);
    } else {
      setStickySideBar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    if (window.scrollY) setStickySideBar(true);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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

  if (!data || !data.datacom_data) notFound();
  return (
    <div className="flex flex-col-reverse items-start md:flex-row md:space-x-8 lg:mt-4 pb-8">
      <div className="w-full md:w-7/12 lg:w-8/12 mt-4 md:mt-0 ">
        <div
          className="rounded-2xl"
          style={{
            background:
              "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:space-x-4 justify-center px-4 lg:px-0 py-4">
            <p className="text-22 font-bold text-white">
              Hoàn tất đơn hàng của bạn, để giữ giá tốt nhất{" "}
            </p>
            {/* <div className="mt-3 lg:mt-0 flex space-x-2 items-center text-22 font-bold text-[#FF9258]">
              <p>
                00:{String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </p>
              <Image
                src={`/icon/clock-stopwatch.svg`}
                width={20}
                height={20}
                alt="Icon"
                className="w-5 h-5"
              />
            </div> */}
          </div>
        </div>
        <div className="mt-6">
          <p className="font-bold text-18">Tóm tắt chuyến bay</p>
          {fareData.map((item: any, key: number) =>
            item.ListFlight.map((flight: any, indexFlight: number) => {
              const fromOption = airports
                .flatMap((country) => country.airports)
                .find((airport) => airport.code === flight.StartPoint);
              const toOption = airports
                .flatMap((country) => country.airports)
                .find((airport) => airport.code === flight.EndPoint);
              return (
                <div
                  key={indexFlight}
                  className="bg-white rounded-xl p-3 md:p-6 mt-3"
                >
                  <div className="flex flex-col lg:flex-row pb-3 border-b border-gray-300 lg:space-x-3">
                    <p className="lg:w-2/12 text-sm text-gray-700">
                      Chuyến bay
                    </p>
                    <div className="lg:w-10/12 font-bold">
                      {fromOption && toOption ? (
                        <p>
                          {`${fromOption?.city} (${flight.StartPoint}) - ${toOption?.city} (${flight.EndPoint}) `}
                        </p>
                      ) : (
                        <p>{`${flight.StartPoint} - ${flight.EndPoint}`}</p>
                      )}
                    </div>
                  </div>
                  {flight.ListSegment.map(
                    (segment: any, segmentIndex: number) => {
                      const fromSegmenOption = airports
                        .flatMap((country) => country.airports)
                        .find((airport) => airport.code === flight.StartPoint);
                      const toSegmentOption = airports
                        .flatMap((country) => country.airports)
                        .find((airport) => airport.code === flight.EndPoint);
                      const durationFlight =
                        differenceInSeconds(
                          new Date(segment.EndTime),
                          new Date(segment.StartTime)
                        ) / 60;
                      return (
                        <div
                          key={segmentIndex}
                          className="flex flex-col-reverse lg:flex-row items-start justify-between mt-4 lg:space-x-3"
                        >
                          <div className="w-full lg:w-2/12 mt-5 lg:mt-0">
                            <div className="flex flex-row lg:flex-col justify-between lg:justify-normal items-center md:items-baseline w-full text-left mb-3">
                              <div>
                                <Image
                                  src={`http://cms.happybooktravel.com/assets/images/airline/${segment.Airline.toLowerCase()}.gif`}
                                  width={80}
                                  height={24}
                                  alt="AirLine"
                                  className="max-w-16 md:max-w-20 max-h-10"
                                />
                              </div>
                              <div className="">
                                <h3
                                  className="text-sm my-2"
                                  style={{ wordBreak: "break-word" }}
                                >
                                  {segment.FlightNumber}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Hạng: {flight.FareClass}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="lg:w-10/12 text-center flex justify-between">
                            <div className="flex gap-6 w-full">
                              <div className="w-[30%] flex flex-col items-center md:items-start justify-start text-left">
                                <span className="text-sm w-full">
                                  {format(
                                    new Date(flight.StartDate),
                                    "EEEE, d 'tháng' M yyyy",
                                    { locale: vi }
                                  )}
                                </span>
                                <span className="mt-2 text-lg font-bold w-full">
                                  {formatTime(segment.StartTime)}
                                </span>
                                <span className="mt-2 text-sm text-gray-500 w-full">
                                  {fromSegmenOption ? (
                                    <p>
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
                                  <span className="text-sm text-gray-700">
                                    {durationFlight
                                      ? `${Math.floor(
                                          durationFlight / 60
                                        )} giờ ${Math.floor(
                                          durationFlight % 60
                                        )} phút`
                                      : ""}
                                  </span>
                                  {flight.ListSegment.length <= 1 && (
                                    <span className="text-sm text-gray-500">
                                      Bay thẳng
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="w-[30%] flex flex-col items-center md:items-start justify-start text-left">
                                <span className="text-sm w-full">
                                  {format(
                                    new Date(flight.EndDate),
                                    "EEEE, d 'tháng' M yyyy",
                                    { locale: vi }
                                  )}
                                </span>
                                <span className="mt-2 text-lg font-bold w-full">
                                  {formatTime(segment.EndTime)}
                                </span>
                                <span className="mt-2 text-sm text-gray-500 w-full">
                                  {toSegmentOption ? (
                                    <p>{`${toSegmentOption?.city} (${segment.EndPoint})`}</p>
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
                  <div>
                    <button
                      className=" text-blue-700 border-b border-blue-700 font-medium"
                      onClick={() => toggleShowRuleTicket(item, indexFlight)}
                      disabled={isLoadingRules}
                    >
                      Điều kiện vé
                    </button>

                    <div>
                      {showRuleTicket === flight.FlightId && isLoadingRules && (
                        <span className="loader_spiner mt-2"></span>
                      )}
                      {showRuleTicket === flight.FlightId &&
                        !isLoadingRules && (
                          <div
                            className="mt -2text-sm text-gray-600 mt-1 list-disc list-inside"
                            dangerouslySetInnerHTML={{
                              __html: flight.ListRulesTicket,
                            }}
                          ></div>
                        )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="mt-6">
          <p className="font-bold text-18">Thông tin liên hệ</p>
          <div className="bg-white rounded-xl p-3 md:p-6 mt-3 break-words">
            <div className="flex space-x-2 pb-3 border-b border-gray-300">
              <p className="w-1/4 text-gray-700">Mã đơn hàng</p>
              <p className="w-3/4 font-medium">{data.orderInfo.sku}</p>
            </div>
            <div className="flex space-x-2 mt-3">
              <div className="w-1/4 text-gray-700">Họ và tên</div>
              <div className="w-3/4 ">
                <p className="font-bold">
                  {data.contact.first_name} {data.contact.last_name}
                </p>
                {/* <p className="text-sm mt-1">7 KG Hành lý xách tay</p> */}
              </div>
            </div>
            <div className="flex space-x-2 mt-3">
              <p className="w-1/4 text-gray-700">Giới tính</p>
              <p className="w-3/4 font-medium">
                {data.contact.gender ? "Nam" : "Nữ"}
              </p>
            </div>
            {/* <div className="flex space-x-2 mt-3">
              <p className="w-1/4 text-gray-700">Năm sinh</p>
              <p className="w-3/4 font-medium">08/09/1995</p>
            </div> */}
            <div className="flex space-x-2 mt-3">
              <p className="w-1/4 text-gray-700">Email</p>
              <p className="w-3/4 font-medium">{data.contact.email}</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <p className="font-bold text-18">Thông tin hành khách</p>
          {data.passengers.map((passenger: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-xl p-3 md:p-6 mt-3 break-words"
            >
              <div className="flex space-x-2 mt-3">
                <div className="w-1/4 text-gray-700">Họ và tên</div>
                <div className="w-3/4 ">
                  <p className="font-bold">
                    {passenger.first_name.toUpperCase()}{" "}
                    {passenger.last_name.toUpperCase()}
                  </p>
                  {/* <p className="text-sm mt-1">7 KG Hành lý xách tay</p> */}
                </div>
              </div>
              <div className="flex space-x-2 mt-3">
                <p className="w-1/4 text-gray-700">Giới tính</p>
                <p className="w-3/4 font-medium">
                  {passenger.gender ? "Nam" : "Nữ"}
                </p>
              </div>
              <div className="flex space-x-2 mt-3">
                <p className="w-1/4 text-gray-700">Năm sinh</p>
                <p className="w-3/4 font-medium">
                  {format(
                    parse(passenger.birthday, "yyyy-MM-dd", new Date()),
                    "dd/MM/yyyy"
                  )}
                </p>
              </div>
              {passenger?.baggages?.length > 0 && (
                <div className="flex space-x-2 mt-3">
                  <p className="w-1/4 text-gray-700">Dịch vụ mua thêm</p>
                  <div className="w-3/4 font-semibold">
                    {passenger.baggages.map((baggage: any, index: number) => (
                      <div key={index} className="mb-2">
                        <span>{baggage.leg ? "Chiều về" : "Chiều đi"}</span>
                        <span>{" - "}</span>
                        <span>{baggage.name} </span>
                        <span>
                          ({baggage.price.toLocaleString("vi-VN")}{" "}
                          {baggage.currency})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-6">
            <p className="font-bold text-18">Hình thức thanh toán</p>
            <div className="bg-white rounded-xl p-3 md:p-6 mt-3">
              <div className="flex space-x-3 items-start">
                <input
                  type="radio"
                  value="cash"
                  id="payment_cash"
                  {...register("payment_method")}
                  className="w-5 h-5 mt-[2px]"
                />
                <label htmlFor="payment_cash" className="flex space-x-1 w-full">
                  <div className="font-normal">
                    <Image
                      src="/payment-method/cash.svg"
                      alt="Icon"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="max-w-[85%]">
                    <span className="font-medium text-base">
                      Thanh toán tiền mặt
                    </span>
                    <p className="text-gray-500">
                      Quý khách vui lòng giữ liên lạc để đội ngũ CSKH liên hệ
                      xác nhận
                    </p>
                  </div>
                </label>
              </div>
              <div className="flex space-x-3 items-start mt-4">
                <input
                  type="radio"
                  value="vnpay"
                  id="payment_vnpay"
                  {...register("payment_method")}
                  className="w-5 h-5 mt-[2px]"
                />
                <label htmlFor="payment_vnpay" className=" flex space-x-1">
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
                    <span className="font-medium text-base max-width-[85%]">
                      Thanh toán bằng VNPAY
                    </span>
                  </div>
                </label>
              </div>
              <div className="flex space-x-3 items-start mt-4">
                <input
                  type="radio"
                  value="international_card"
                  id="international_card"
                  {...register("payment_method")}
                  className="w-5 h-5 mt-[2px]"
                />
                <label htmlFor="international_card" className=" flex space-x-1">
                  <div className="font-normal">
                    <Image
                      src="/payment-method/transfer.svg"
                      alt="Icon"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="max-width-[85%]">
                    <span className="block text-base font-medium">
                      Thẻ quốc tế (Visa, Master, JCB)
                    </span>
                  </div>
                </label>
              </div>
              <div className="flex space-x-3 items-start mt-4">
                <div className="w-5 h-5">
                  <input
                    type="radio"
                    value="bank_transfer"
                    {...register("payment_method")}
                    id="bank_transfer"
                    className="w-5 h-5 mt-[2px]"
                  />
                </div>
                <label htmlFor="bank_transfer" className="flex space-x-1">
                  <div className="font-normal">
                    <Image
                      src="/payment-method/transfer.svg"
                      alt="Icon"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="max-width-[85%] w-fit">
                    <span className="block text-base font-medium">
                      Chuyển khoản
                    </span>
                    <button
                      type="button"
                      className="text-blue-700 underline flex items-end"
                      onClick={() => {
                        setShowTransferInfor(!showTransferInfor);
                      }}
                    >
                      Thông tin chuyển khoản{" "}
                      <span className="ml-1">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d={
                              showTransferInfor
                                ? "M15 12.5L10 7.5L5 12.5"
                                : "M5 7.5L10 12.5L15 7.5"
                            }
                            stroke="#175CD3"
                            strokeWidth="1.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                    {showTransferInfor && (
                      <div
                        className={`mt-4 pb-3 overflow-hidden bg-white rounded-2xl`}
                      >
                        <div>
                          <p>
                            Nội dung chuyển khoản quý khách hàng cần ghi rõ:MÃ
                            ĐẶT CHỖ/MÃ ĐƠN HÀNG
                          </p>
                          <p className="text-22 text-gray-900 font-semibold mt-4">
                            THÔNG TIN NGÂN HÀNG CỦA SỐ TÀI KHOẢN CÁ NHÂN
                          </p>
                          <p className="text-base text-gray-900">
                            Nội dung chuyển khoản quý khách hàng cần ghi rõ: MÃ
                            ĐẶT CHỖ/MÃ ĐƠN HÀNG
                          </p>
                          <p className="text-base text-gray-900 mt-3">
                            THÔNG TIN NGÂN HÀNG CỦA SỐ TÀI KHOẢN CÁ NHÂN
                          </p>
                          <p className="text-base text-gray-900 mt-3">
                            ACB - Ngân hàng TMCP Á Châu - CN PGD Phước Bình
                          </p>
                          <p className="text-base text-gray-900 mt-1">
                            Số tài khoản: 223.702.679
                          </p>
                          <p className="text-base text-gray-900 mt-1">
                            Chủ tài khoản: VŨ THỊ VĂN
                          </p>
                          <p className="text-base text-gray-900 mt-3">
                            Happy Book CAM KẾT những thông tin chuyển khoản bên
                            trên hoàn toàn của chính chủ, nhân viên của Happy
                            Book, nên bạn hoàn toàn có thể an tâm.
                          </p>
                          <p className="text-base text-gray-900 mt-3">
                            Happy Book xin chân thành cảm ơn sự đóng góp và đồng
                            hành của tất cả các quý khách hàng đã tin tưởng tại
                            chúng tôi. Happy Book đảm bảo sẽ mang cho bạn đến
                            những lựa chọn tốt nhất, trên cả sự mong đợi nhé.
                            Nếu có gặp khó khăn về vé máy bay hay làm visa, bạn
                            có thể liên hệ qua:
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
              {errors.payment_method && (
                <p className="text-red-600">{errors.payment_method.message}</p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <LoadingButton
              isLoading={loadingSubmitForm}
              text="Xác nhận thanh toán"
              disabled={false}
            />
          </div>
        </form>
      </div>
      <div
        className={`md:w-5/12 lg:w-4/12 bg-white rounded-3xl p-3 lg:p-6  ${
          isStickySideBar
            ? "sticky top-[1%] shadow-lg border-gray-200 border md:border-0 md:shadow-[unset] z-[99] md:top-20 lg:top-[140px] right:80px w-fit"
            : "w-full"
        }`}
      >
        <div className="p-3 lg:py-4 lg:px-6">
          <p className="text-22 font-bold mb-2">Giá chi tiết</p>
          {dropdown.map((item: any, index: number) => (
            <div key={index} className="mb-4">
              <button
                type="button"
                onClick={() => toggleDropdown(index)}
                className="flex justify-between text-sm items-start space-x-3 w-full text-left outline-none"
              >
                <div className="flex w-8/12">
                  <span>
                    {item.title} (
                    {Array.from({ length: item.quantity }, (_, key) => (
                      <span key={keyLoopDropdown++}>
                        hành khách {keyLoopDropdown}
                        {key < item.quantity - 1 && ", "}
                      </span>
                    ))}
                    )
                  </span>
                  <span className="ml-1">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d={
                          activeIndex === index
                            ? "M15 12.5L10 7.5L5 12.5"
                            : "M5 7.5L10 12.5L15 7.5"
                        }
                        stroke="#667085"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                <div className="text-gray-900 font-bold w-4/12 text-right">
                  {item.totalPrice.toLocaleString("vi-VN")}đ x {item.quantity}
                </div>
              </button>
              <div
                className={`rounded-lg transition-all delay-300 ease-in ${
                  activeIndex === index
                    ? "max-h-16 opacity-100 visible"
                    : "max-h-0 opacity-0 invisible"
                } `}
              >
                <div className="text-sm text-gray-500 flex justify-between mt-1">
                  <span>Vé</span>
                  <span>
                    {item.totalPriceTicket.toLocaleString("vi-VN")}đ x{" "}
                    {item.quantity}
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex justify-between mt-1">
                  <span>Thuế và phí</span>
                  <span>
                    {item.totalTax.toLocaleString("vi-VN")}đ x {item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <span className="text-sm text-gray-500 ">Hành lý bổ sung</span>
            <p className="font-semibold">
              {totalBaggages.price && totalBaggages.quantity
                ? `${totalBaggages.price.toLocaleString("vi-VN")}đ x ${
                    totalBaggages.quantity
                  }`
                : "0đ"}
            </p>
          </div>
          <div className="flex mt-4 pt-4 md:pb-6 justify-between border-t border-t-gray-200">
            <span className="text-gray-700 font-bold">Tổng cộng</span>
            <p className="font-bold text-primary">
              {totalPrice.toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
