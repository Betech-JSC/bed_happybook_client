"use client";
import { formatCurrency, formatTime, formatTimeZone } from "@/lib/formatters";
import Image from "next/image";
import { Fragment, useCallback, useEffect, useState } from "react";
import { differenceInSeconds, format, parse, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { handleSessionStorage } from "@/utils/Helper";
import { toast } from "react-hot-toast";
import { notFound, useRouter } from "next/navigation";
import { BookingDetailProps } from "@/types/flight";
import LoadingButton from "@/components/base/LoadingButton";
import { FlightApi } from "@/api/Flight";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckOutBody,
  CheckOutBodyType,
} from "@/schemaValidations/checkOut.schema";
import CountDownCheckOut from "./CountDownCheckOut";
import DisplayImage from "@/components/base/DisplayImage";
import QRCodeDisplay from "@/components/Payment/QRCodeDisplay";
import { isEmpty } from "lodash";
import { PaymentApi } from "@/api/Payment";
import { PageApi } from "@/api/Page";
import { useLanguage } from "@/contexts/LanguageContext";
import { toastMessages, validationMessages } from "@/lib/messages";
import { translateText } from "@/utils/translateApi";
import { useTranslation } from "@/hooks/useTranslation";

export default function BookingDetail2({ airports }: BookingDetailProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [data, setData] = useState<any>(null);
  const [totalBaggages, setTotalBaggages] = useState<{
    price: number;
    quantity: number;
  }>({ price: 0, quantity: 0 });
  const [isLoadingRules, setIsLoadingRules] = useState<boolean>(false);
  const [showRuleTicket, setShowRuleTicket] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSubmitForm, setLoadingSubmitForm] = useState<boolean>(false);
  const [ticketPaymentTimeout, setTicketPaymentTimeout] =
    useState<boolean>(false);
  const [qrCodeGenerated, setQrCodeGenerated] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const toggleDropdown = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const [isStickySideBar, setStickySideBar] = useState<boolean>(true);
  const [showTransferInfor, setShowTransferInfor] = useState<boolean>(false);
  const [vietQrData, setVietQrData] = useState<any>({});
  const [transferInformation, setTransferInformation] = useState<any>(null);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const messages = validationMessages[language as "vi" | "en"];
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const [onePayTriggered, setOnePayTriggered] = useState(false);
  const [isOpenBookingDetail, setIsOpenBookingDetail] = useState(false);
  const [onePayFee, setOnePayFee] = useState<number>(0);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CheckOutBodyType>({
    resolver: zodResolver(CheckOutBody(messages)),
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
          toast.success(toaStrMsg.sendSuccess);

          if (selectedPaymentMethod === "onepay") {
            PaymentApi.onePay(data.orderInfo.sku).then((result: any) => {
              if (result?.payment_url) {
                window.location.href = result.payment_url;
              }
            });
          } else {
            handleSessionStorage("remove", ["bookingFlight"]);
            setTimeout(() => {
              router.push("/ve-may-bay");
            }, 1000);
          }
        } else {
          toast.error(toaStrMsg.sendFailed);
        }
      } catch (error: any) {
        toast.error(toaStrMsg.error);
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
  if (data?.flights?.length) {
    data.flights.map((flightItem: any, index: number) => {
      fareData.push(flightItem);
      const item = flightItem.selectedTicketClass;
      totalPrice += item.totalPrice;
      totalAdt = flightItem.numberAdt;
      totalChd = flightItem.numberChd;
      totalInf = flightItem.numberInf;
      totalPriceAdt += item.totalPriceAdt;
      totalPriceChd += item.totalPriceChd;
      totalPriceInf += item.totalPriceInf;
      totalPriceTicketAdt += item.fareAdultFinal;
      totalPriceTicketChd += item.fareChildFinal;
      totalPriceTicketInf += item.fareInfantFinal;
      totalTaxAdt += item.totalTaxAdt;
      totalTaxChd += item.totalTaxChd;
      totalTaxInf += item.totalTaxInf;
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

  const fetchFareRules = useCallback(
    async (flight: any) => {
      try {
        setIsLoadingRules(true);
        const params = {
          source: flight.source,
          clientId: flight.clientId,
          itinerary: {
            airline: flight.airline,
            departDate: format(parseISO(flight.departure.at), "yyyy-MM-dd"),
            departure: flight.departure.IATACode,
            arrival: flight.arrival.IATACode,
            fareBasisCode: flight.selectedTicketClass.fareBasisCode,
          },
          fareValue: flight.selectedTicketClass.fareValue,
        };
        const response = await FlightApi.getFareRules(params);
        return response?.payload?.data ?? [];
      } catch (error: any) {
        const fareRules = await translateText(
          ["Xin vui lòng liên hệ với Happy Book để nhận thông tin chi tiết."],
          language
        );
        return fareRules;
      } finally {
        setIsLoadingRules(false);
      }
    },
    [language]
  );

  useEffect(() => {
    if (data?.orderInfo?.sku) {
      PaymentApi.checkPaymentStatus(data?.orderInfo?.sku).then((response) => {
        if (response?.payload?.data?.paid === true) {
          setIsPaid(true);
        }
      });
    }
  }, [data?.orderInfo?.sku]);

  const toggleShowRuleTicket = useCallback(
    async (FareData: any) => {
      setShowRuleTicket(
        showRuleTicket === FareData.flightCode ? null : FareData.flightCode
      );
      if (!FareData.ListRulesTicket) {
        FareData.ListRulesTicket = await fetchFareRules(FareData);
      }
    },
    [showRuleTicket, fetchFareRules]
  );

  const handleTicketPaymentTimeout = () => {
    setTicketPaymentTimeout(true);
  };

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

  useEffect(() => {
    if (selectedPaymentMethod === "onepay") {
      setOnePayFee(
        (totalPrice + totalBaggages.price - data?.orderInfo?.total_discount) *
          0.025
      );
    } else {
      setOnePayFee(0);
      if (
        selectedPaymentMethod === "vietqr" &&
        !qrCodeGenerated &&
        data?.orderInfo?.sku
      ) {
        PaymentApi.generateQrCodeAirlineTicket(data.orderInfo.sku).then(
          (result: any) => {
            setQrCodeGenerated(true);
            setVietQrData(result?.data);
          }
        );
      }
    }
  }, [selectedPaymentMethod, qrCodeGenerated, data, totalPrice, totalBaggages]);

  // useEffect(() => {
  //   if (
  //     selectedPaymentMethod === "onepay" &&
  //     data?.orderInfo?.sku &&
  //     !onePayTriggered
  //   ) {
  //     setOnePayTriggered(true);
  //     PaymentApi.onePay(data.orderInfo.sku).then((result: any) => {
  //       if (result?.payment_url) {
  //         window.location.href = result.payment_url;
  //       }
  //     });
  //   }
  // }, [selectedPaymentMethod, data?.orderInfo?.sku, onePayTriggered]);

  useEffect(() => {
    // if (selectedPaymentMethod !== "onepay") {
    //   setOnePayTriggered(false);
    // }
    if (selectedPaymentMethod !== "vietqr") {
      setQrCodeGenerated(false);
    }
  }, [selectedPaymentMethod]);

  const getTransferInformation = async () => {
    PageApi.getContent("thong-tin-chuyen-khoan").then((result: any) => {
      setTransferInformation(result?.payload?.data);
    });
  };

  useEffect(() => {
    getTransferInformation();
  }, []);

  if (loading) {
    return (
      <div
        className={`flex my-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
      >
        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
        <span className="text-18">Loading...</span>
      </div>
    );
  }
  if (!data) notFound();
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
            {!isPaid ? (
              <Fragment>
                <p className="text-22 font-bold text-white">
                  {t("hoan_tat_don_hang_cua_ban_de_giu_gia_tot_nhat")}{" "}
                </p>
                {!ticketPaymentTimeout && data.orderInfo.booking_deadline ? (
                  <CountDownCheckOut
                    timeCountDown={data.orderInfo.booking_deadline}
                    handleTicketPaymentTimeout={handleTicketPaymentTimeout}
                  />
                ) : (
                  <div className="mt-3 lg:mt-0 flex space-x-2 items-center text-22 font-bold text-[#FF9258]">
                    <p>00:00:00</p>
                    <Image
                      src={`/icon/clock-stopwatch.svg`}
                      width={20}
                      height={20}
                      alt="Icon"
                      className="w-5 h-5"
                    />
                  </div>
                )}
              </Fragment>
            ) : (
              <p className="text-22 font-bold text-white">
                {t("thong_tin_don_hang")}
              </p>
            )}
          </div>
        </div>
        {isPaid && (
          <div className="mt-6 bg-white text-green-700 font-bold px-4 py-3 rounded w-full text-base">
            <p data-translate="true">
              HappyBook đã nhận được khoản thanh toán thành công cho đơn hàng
              {data?.orderInfo?.sku && `: ${data.orderInfo.sku}`}
            </p>
            <p data-translate="true">
              HappyBook sẽ gửi xác nhận đơn hàng trong thời gian không quá 24h.
            </p>
          </div>
        )}
        <div className="mt-6">
          <button
            onClick={() => setIsOpenBookingDetail(!isOpenBookingDetail)}
            className="bg-white text-gray-700 font-bold px-4 py-3 rounded flex justify-between w-full text-xl"
          >
            {t("chi_tiet_don_hang")}
            <svg
              width="22"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${isOpenBookingDetail ? "rotate-180" : "rotate-0"}`}
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="#283448"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div
            className={`bg-white border-t transition-all duration-300 overflow-hidden ${
              isOpenBookingDetail
                ? "max-h-[2500px] opacity-100 p-4"
                : "max-h-0 opacity-0 p-0"
            }`}
          >
            <div>
              <p className="font-bold text-18">{t("tom_tat_chuyen_bay")}</p>
              {fareData.map((flight: any, indexFlight: number) => {
                const fromOption = airports
                  .flatMap((country) => country.airports)
                  .find(
                    (airport) => airport.code === flight.departure.IATACode
                  );
                const toOption = airports
                  .flatMap((country) => country.airports)
                  .find((airport) => airport.code === flight.arrival.IATACode);
                return (
                  <div
                    key={indexFlight}
                    className="bg-white rounded-xl p-3 md:p-6 mt-3 border"
                  >
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
                          <p data-translate="true">{`${flight.departure.IATACode} - ${flight.arrival.IATACode}`}</p>
                        )}
                      </div>
                    </div>
                    {flight.segments.map(
                      (segment: any, segmentIndex: number) => {
                        const fromSegmenOption = airports
                          .flatMap((country) => country.airports)
                          .find(
                            (airport) =>
                              airport.code === flight.departure.IATACode
                          );
                        const toSegmentOption = airports
                          .flatMap((country) => country.airports)
                          .find(
                            (airport) =>
                              airport.code === flight.arrival.IATACode
                          );
                        const durationFlight =
                          differenceInSeconds(
                            new Date(segment.arrival.at),
                            new Date(segment.departure.at)
                          ) / 60;
                        return (
                          <div
                            key={segmentIndex}
                            className="flex flex-col-reverse lg:flex-row items-start justify-between mt-4 lg:space-x-3"
                          >
                            <div className="w-full lg:w-2/12 mt-5 lg:mt-0">
                              <div className="flex flex-row lg:flex-col justify-between lg:justify-normal items-center md:items-baseline w-full text-left mb-3">
                                <div>
                                  <DisplayImage
                                    imagePath={`assets/images/airline/${segment.airline.toLowerCase()}.gif`}
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
                                    {segment.flightNumber}
                                  </h3>
                                  <div className="text-sm text-gray-500">
                                    <span> {t("hang")} </span>
                                    <span>
                                      {flight.selectedTicketClass.bookingClass}
                                    </span>
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
                                      new Date(segment.departure.at),
                                      "EEEE, d 'tháng' M yyyy",
                                      { locale: vi }
                                    )}
                                  </span>
                                  <span className="mt-2 text-lg font-bold w-full">
                                    {formatTimeZone(
                                      segment.departure.at,
                                      segment.departure.timezone
                                    )}
                                  </span>
                                  <span className="mt-2 text-sm text-gray-500 w-full">
                                    {fromSegmenOption ? (
                                      <p data-translate="true">
                                        {`${fromSegmenOption?.city} (${segment.departure.IATACode})`}
                                      </p>
                                    ) : (
                                      <p>{segment.departure.IATACode}</p>
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
                                    {flight.legs < 1 && (
                                      <span className="text-sm text-gray-500">
                                        {t("bay_thang")}
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
                                      new Date(segment.arrival.at),
                                      "EEEE, d 'tháng' M yyyy",
                                      { locale: vi }
                                    )}
                                  </span>
                                  <span className="mt-2 text-lg font-bold w-full">
                                    {formatTimeZone(
                                      segment.arrival.at,
                                      segment.arrival.timezone
                                    )}
                                  </span>
                                  <span className="mt-2 text-sm text-gray-500 w-full">
                                    {toSegmentOption ? (
                                      <p data-translate="true">{`${toSegmentOption?.city} (${segment.arrival.IATACode})`}</p>
                                    ) : (
                                      <p>{segment.arrival.IATACode}</p>
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
                      {/* <button
                    className=" text-blue-700 border-b border-blue-700 font-medium mb-2"
                    onClick={() => toggleShowRuleTicket(flight)}
                    disabled={isLoadingRules}
                    data-translate="true"
                  >
                    Điều kiện vé
                  </button> */}

                      <div>
                        {showRuleTicket === flight.flightCode &&
                          isLoadingRules && (
                            <span className="loader_spiner mt-2"></span>
                          )}
                        {showRuleTicket === flight.flightCode &&
                          !isLoadingRules && (
                            <div className="text-gray-700 list-disc list-inside [&_li]:mb-2 [&_li:last-child]:mb-0">
                              {Array.isArray(flight.ListRulesTicket) &&
                              flight.ListRulesTicket.length > 0 ? (
                                (() => {
                                  const isFareRulesOfStrings =
                                    Array.isArray(flight.ListRulesTicket) &&
                                    typeof flight.ListRulesTicket[0] ===
                                      "string";

                                  return (
                                    <div>
                                      {isFareRulesOfStrings ? (
                                        <ul
                                          className="mt-4 pl-6"
                                          style={{ listStyle: "circle" }}
                                        >
                                          {flight.ListRulesTicket.map(
                                            (text: any, indexRule: number) => (
                                              <li key={indexRule}>{text}</li>
                                            )
                                          )}
                                        </ul>
                                      ) : (
                                        <div>
                                          {flight.ListRulesTicket.map(
                                            (item: any, indexRule: number) => (
                                              <div
                                                key={indexRule}
                                                className="mb-4"
                                              >
                                                {item.key && (
                                                  <p className="font-semibold text-18">
                                                    {item.key}
                                                  </p>
                                                )}
                                                <ul
                                                  className="mt-4 pl-6"
                                                  style={{
                                                    listStyle: "circle",
                                                  }}
                                                >
                                                  {item?.value?.length > 0 &&
                                                    item.value.map(
                                                      (
                                                        ruleText: string,
                                                        indexRuleText: number
                                                      ) =>
                                                        ruleText && (
                                                          <li
                                                            key={indexRuleText}
                                                          >
                                                            {ruleText}
                                                          </li>
                                                        )
                                                    )}
                                                </ul>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()
                              ) : (
                                <div className="mb-4">
                                  Xin vui lòng liên hệ với Happy Book để nhận
                                  thông tin chi tiết.
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <p className="font-bold text-18">{t("thong_tin_lien_he")}</p>
              <div className="bg-white rounded-xl p-3 md:p-6 mt-3 break-words border">
                <div className="flex space-x-2 pb-3 border-b border-gray-300">
                  <p className="w-1/4 text-gray-700">{t("ma_don_hang")}</p>
                  <p className="w-3/4 font-medium">{data.orderInfo.sku}</p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <div className="w-1/4 text-gray-700">{t("ho_va_ten")}</div>
                  <div className="w-3/4 ">
                    <p className="font-bold" data-translate="true">
                      {data?.contact?.full_name}
                    </p>
                    {/* <p className="text-sm mt-1">7 KG Hành lý xách tay</p> */}
                  </div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <p className="w-1/4 text-gray-700">{t("gioi_tinh")}</p>
                  <p className="w-3/4 font-medium" data-translate="true">
                    {data.contact.gender ? "Nam" : "Nữ"}
                  </p>
                </div>
                {/* <div className="flex space-x-2 mt-3">
              <p className="w-1/4 text-gray-700">Năm sinh</p>
              <p className="w-3/4 font-medium">08/09/1995</p>
            </div> */}
                <div className="flex space-x-2 mt-3">
                  <p className="w-1/4 text-gray-700">{t("email")}</p>
                  <p className="w-3/4 font-medium" data-translate="true">
                    {data.contact.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="font-bold text-18">{t("thong_tin_hanh_khach")}</p>
              {data.passengers.map((passenger: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-3 md:p-6 mt-3 break-words border"
                >
                  <div className="flex space-x-2 mt-3">
                    <div className="w-1/4 text-gray-700">{t("ho_va_ten")}</div>
                    <div className="w-3/4 ">
                      <p className="font-bold" data-translate="true">
                        {passenger.first_name.toUpperCase()}{" "}
                        {passenger.last_name.toUpperCase()}
                      </p>
                      {/* <p className="text-sm mt-1">7 KG Hành lý xách tay</p> */}
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <p className="w-1/4 text-gray-700">{t("gioi_tinh")}</p>
                    <p className="w-3/4 font-medium" data-translate="true">
                      {passenger.gender ? "Nam" : "Nữ"}
                    </p>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <p className="w-1/4 text-gray-700">{t("nam_sinh")}</p>
                    <p className="w-3/4 font-medium">
                      {format(
                        parse(passenger.birthday, "yyyy-MM-dd", new Date()),
                        "dd/MM/yyyy"
                      )}
                    </p>
                  </div>
                  {passenger?.baggages?.length > 0 && (
                    <div className="flex space-x-2 mt-3">
                      <p className="w-1/4 text-gray-700">
                        {t("dich_vu_mua_them")}
                      </p>
                      <div className="w-3/4 font-semibold">
                        {passenger.baggages.map(
                          (baggage: any, index: number) => (
                            <div key={index} className="mb-2">
                              <span data-translate="true">
                                {baggage.leg ? "Chiều về" : "Chiều đi"}
                              </span>
                              <span>{" - "}</span>
                              <span data-translate="true">{baggage.name} </span>
                              <span>
                                ({baggage.price.toLocaleString("vi-VN")}{" "}
                                {baggage.currency})
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {!isPaid && (
          <form id="frmPayment" onSubmit={handleSubmit(onSubmit)}>
            {!ticketPaymentTimeout && (
              <>
                <div className="mt-6">
                  <p className="font-bold text-18">
                    {t("hinh_thuc_thanh_toan")}
                  </p>
                  <div className="bg-white rounded-xl p-3 md:p-6 mt-3">
                    <div className="flex space-x-3 items-start">
                      <input
                        type="radio"
                        value="cash"
                        id="payment_cash"
                        {...register("payment_method")}
                        className="w-5 h-5 mt-[2px]"
                        onChange={(e) => {
                          setValue("payment_method", e.target.value);
                          setSelectedPaymentMethod(e.target.value);
                        }}
                      />
                      <label
                        htmlFor="payment_cash"
                        className="flex space-x-1 w-full"
                      >
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
                            {t("thanh_toan_sau")}
                          </span>
                          <p className="text-gray-500">
                            {t(
                              "quy_khach_vui_long_giu_lien_lac_de_doi_ngu_cskh_lien_he_xac_nhan"
                            )}
                          </p>
                        </div>
                      </label>
                    </div>
                    <div className="flex space-x-3 items-start mt-4">
                      <input
                        type="radio"
                        value="vietqr"
                        id="payment_vietqr"
                        {...register("payment_method")}
                        className="w-5 h-5 mt-[2px]"
                        onChange={(e) => {
                          setValue("payment_method", e.target.value);
                          setSelectedPaymentMethod(e.target.value);
                        }}
                      />
                      <label
                        htmlFor="payment_vietqr"
                        className=" flex space-x-1"
                      >
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
                          <span className="font-medium text-base max-width-[85%]">
                            {t("thanh_toan_quet_ma_qr_ngan_hang")}
                          </span>
                        </div>
                      </label>
                    </div>
                    <div className="flex space-x-3 md:items-center mt-4">
                      <input
                        type="radio"
                        value="onepay"
                        id="payment_onepay"
                        {...register("payment_method")}
                        className="w-5 h-5 mt-[2px]"
                        onChange={(e) => {
                          setValue("payment_method", e.target.value);
                          setSelectedPaymentMethod(e.target.value);
                        }}
                      />
                      <label
                        htmlFor="payment_onepay"
                        className="flex md:items-center gap-1"
                      >
                        <div className="font-normal">
                          <Image
                            src="/payment-method/visa.svg"
                            alt="Icon"
                            width={48}
                            height={28}
                            className="md:mt-1"
                          />
                        </div>
                        <div>
                          <span className="font-medium text-base max-width-[85%]">
                            {t("thanh_toan_visa_master_card_jcb")}
                          </span>
                        </div>
                      </label>
                    </div>
                    {/* <div className="flex space-x-3 items-start mt-4">
                    <input
                      type="radio"
                      value="international_card"
                      id="international_card"
                      {...register("payment_method")}
                      className="w-5 h-5 mt-[2px]"
                      onChange={(e) => {
                        setValue("payment_method", e.target.value);
                        setSelectedPaymentMethod(e.target.value);
                      }}
                    />
                    <label
                      htmlFor="international_card"
                      className=" flex space-x-1"
                    >
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
                        <span
                          className="block text-base font-medium"
                          data-translate="true"
                        >
                          Thanh Toán Visa
                        </span>
                      </div>
                    </label>
                  </div> */}
                    {errors.payment_method && (
                      <p className="text-red-600">
                        {errors.payment_method.message}
                      </p>
                    )}
                  </div>
                </div>
                {!isEmpty(vietQrData) && selectedPaymentMethod === "vietqr" && (
                  <QRCodeDisplay
                    vietQrData={vietQrData}
                    order={data?.orderInfo}
                    isPaid={isPaid}
                    setIsPaid={(paid) => setIsPaid(paid)}
                  />
                )}
              </>
            )}
            <div className="mt-4">
              <LoadingButton
                isLoading={loadingSubmitForm}
                text={
                  ticketPaymentTimeout
                    ? "Đã hết thời gian thanh toán"
                    : isPaid
                    ? "Hoàn tất thanh toán"
                    : "Xác nhận thanh toán"
                }
                disabled={
                  ticketPaymentTimeout ||
                  !selectedPaymentMethod ||
                  (selectedPaymentMethod === "vietqr" && !isPaid)
                    ? true
                    : false
                }
                style={
                  ticketPaymentTimeout ||
                  !selectedPaymentMethod ||
                  (selectedPaymentMethod === "vietqr" && !isPaid)
                    ? "bg-gray-300 disabled:cursor-not-allowed"
                    : ""
                }
              />
            </div>
          </form>
        )}
      </div>
      <div
        className={`md:w-5/12 lg:w-4/12 bg-white rounded-3xl p-3 lg:p-6  ${
          isStickySideBar
            ? "sticky top-[1%] shadow-lg border-gray-200 border md:border-0 md:shadow-[unset] z-[99] md:top-20 lg:top-[140px] right:80px w-fit"
            : "w-full"
        }`}
      >
        <div className="p-3 lg:py-4 lg:px-4">
          <p className="text-22 font-bold mb-2" data-translate="true">
            Giá chi tiết
          </p>
          {dropdown.map((item: any, index: number) => (
            <div key={index} className="mb-4">
              <button
                type="button"
                onClick={() => toggleDropdown(index)}
                className="flex justify-between text-sm items-start space-x-3 w-full text-left outline-none"
              >
                <div className="flex w-8/12">
                  <span data-translate="true">
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
                  {formatCurrency(item.totalPrice)} x {item.quantity}
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
                  <span data-translate="true">Vé</span>
                  <span>
                    {formatCurrency(item.totalPriceTicket)} x {item.quantity}
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex justify-between mt-1">
                  <span data-translate="true">Thuế và phí</span>
                  <span>
                    {formatCurrency(item.totalTax)} x {item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {onePayFee > 0 && (
            <div className="flex justify-between mb-1 text-red-600 font-semibold">
              <span className="text-sm " data-translate="true">
                Phí xử lý giao dịch thẻ quốc tế (2.5%)
              </span>
              <p>{formatCurrency(onePayFee)}</p>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm text-gray-500" data-translate="true">
              Hành lý bổ sung
            </span>
            <p className="font-semibold">
              {totalBaggages.price && totalBaggages.quantity
                ? `${formatCurrency(totalBaggages.price)} x ${
                    totalBaggages.quantity
                  }`
                : "0đ"}
            </p>
          </div>
          {data?.orderInfo?.total_discount > 0 && (
            <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-t-gray-200">
              <div className="flex justify-between">
                <span
                  className="text-gray-700 font-semibold"
                  data-translate="true"
                >
                  Giá gốc
                </span>
                <p className="font-semibold">
                  {formatCurrency(totalPrice + totalBaggages.price)}
                </p>
              </div>
              <div className="flex justify-between">
                <span
                  className="text-gray-700 font-semibold"
                  data-translate="true"
                >
                  Giá giảm
                </span>
                <p className="font-semibold">
                  {formatCurrency(data?.orderInfo?.total_discount)}
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-between gap-2 mt-4 pt-4 md:pb-6 border-t border-t-gray-200">
            <span className="text-gray-700 font-bold">{t("tong_cong")}</span>
            <p className="font-bold text-primary">
              {formatCurrency(
                totalPrice +
                  onePayFee +
                  totalBaggages.price -
                  data?.orderInfo?.total_discount
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
