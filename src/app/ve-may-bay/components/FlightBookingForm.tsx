"use client";
import { FlightApi } from "@/api/Flight";
import { differenceInSeconds, format } from "date-fns";
import LoadingButton from "@/components/base/LoadingButton";
import {
  formatCurrency,
  formatNumberToHoursAndMinutesFlight,
  formatTime,
  formatTimeZone,
} from "@/lib/formatters";
import {
  FlightBookingInforBody,
  FlightBookingInforType,
} from "@/schemaValidations/flightBookingInfor.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/flightBooking.scss";
import { vi } from "date-fns/locale";
import { getCurrentLanguage, handleSessionStorage } from "@/utils/Helper";
import FlightDetailPopup from "./FlightDetailPopup";
import DisplayImage from "@/components/base/DisplayImage";
import { translateText } from "@/utils/translateApi";
import { flightStaticText } from "@/constants/staticText";
import { formatTranslationMap, translatePage } from "@/utils/translateDom";
import { useLanguage } from "@/contexts/LanguageContext";
import { datePickerLocale } from "@/constants/language";
import { toastMessages, validationMessages } from "@/lib/messages";
import { useUser } from "@/contexts/UserContext";
import { isEmpty, isNumber } from "lodash";
import VoucherProgram from "@/components/product/components/VoucherProgram";
import { HttpError } from "@/lib/error";
import { useVoucherManager } from "@/hooks/useVoucherManager";
import GenerateInvoiceForm from "@/components/form/GenerateInvoiceForm";

export default function FlightBookForm({ airportsData }: any) {
  const router = useRouter();
  const [translatedStaticText, setTranslatedStaticText] = useState<{}>({});
  const { language } = useLanguage();
  const messages = validationMessages[language as "vi" | "en"];
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [flights, setFlights] = useState<any[]>([]);
  const [flightsDetail, setFlightsDetail] = useState<any[]>([]);
  const [flightType, setFlightType] = useState<string>("");
  const [listBaggage, setListBaggage] = useState<any[]>([]);
  const [listBaggageGrouped, setListBaggageGrouped] = useState<any[]>([]);
  const [listBaggagePassenger, setListBaggagePassenger] = useState<any>([]);
  const [totalBaggages, setTotalBaggages] = useState<{
    price: number;
    quantity: number;
  }>({ price: 0, quantity: 0 });
  const [flightSession, setFlightSession] = useState<string | null>(null);
  const [documentReady, setDocumentReady] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [showFlightDetail, setShowFlightDetail] = useState<boolean>(false);
  const { userInfo } = useUser();
  // Handle Voucher
  const {
    totalDiscount,
    voucherProgramIds,
    voucherErrors,
    vouchersData,
    searchingVouchers,
    setVoucherErrors,
    handleApplyVoucher,
    handleSearch,
  } = useVoucherManager("airline_ticket");
  // End Voucher
  const toggleDropdown = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const [schemaForm, setSchemaForm] = useState(() =>
    FlightBookingInforBody(messages, generateInvoice, flightType)
  );

  useEffect(() => {
    if (datePickerLocale[language]) {
      registerLocale(language, datePickerLocale[language]);
    }
  }, [language]);

  useEffect(() => {
    setSchemaForm(
      FlightBookingInforBody(messages, generateInvoice, flightType)
    );
  }, [flightType, generateInvoice, messages]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FlightBookingInforType>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      atd: [
        {
          gender: "",
          firstName: "",
          lastName: "",
        },
      ],
      contact: {
        full_name: userInfo?.name,
        phone: userInfo?.phone?.toString(),
        email: userInfo?.email,
        gender: userInfo && userInfo?.gender === 0 ? "female" : "male",
      },
      checkBoxGenerateInvoice: false,
    },
  });
  const onSubmit = (data: FlightBookingInforType) => {
    // setLoading(true);
    const adtArr = data.atd.map((item, index) => {
      if (listBaggagePassenger.atd && listBaggagePassenger.atd[index]) {
        item.baggages = listBaggagePassenger.atd[index];
      }
      return { value: item, Type: "ADT" };
    });
    const chdArr = data.chd
      ? data.chd.map((item, index) => {
          if (listBaggagePassenger.chd && listBaggagePassenger.chd[index]) {
            item.baggages = listBaggagePassenger.chd[index];
          }
          return { value: item, Type: "CHD" };
        })
      : [];
    const infArr = data.inf
      ? data.inf.map((item) => ({ value: item, Type: "INF" }))
      : [];

    const passengers = [...adtArr, ...chdArr, ...infArr].reduce(
      (acc: any, item: any, index) => {
        const passengerObj: any = {
          index: index,
          first_name: item.value.firstName,
          last_name: item.value.lastName,
          gender: item.value.gender === "male" ? true : false,
          type: item.Type,

          birthday: item.value.birthday
            ? format(new Date(item.value.birthday), "yyyy-MM-dd")
            : "",
        };
        if (item.Type === "ADT") {
          passengerObj.cccd = item.value.cccd ? item.value.cccd : "";
          passengerObj.cccd_date = item.value.cccd_date
            ? format(new Date(item.value.cccd_date), "yyyy-MM-dd")
            : "";
        }
        if (item.value.baggages && item.value.baggages.length > 0) {
          passengerObj.baggages = item.value.baggages;
        }
        acc.push(passengerObj);
        return acc;
      },
      []
    );
    data.book_type = "book-normal";
    data.trip = flights.length > 1 ? "round_trip" : "one_way";
    const { atd, chd, inf, checkBoxGenerateInvoice, ...formatData } = data;
    let fare_data: any = [];
    let total_price_net = 0;
    let total_tax = 0;
    let total_fee_service = 0;
    let total_price = 0;

    flights.map((item) => {
      total_price_net += item.selectedTicketClass.totalPriceWithOutTax;
      total_tax +=
        item.selectedTicketClass.totalTaxAdt +
        item.selectedTicketClass.totalTaxChd +
        item.selectedTicketClass.totalTaxInf;
      total_price += item.selectedTicketClass.totalPrice;
      total_fee_service += item.selectedTicketClass.totalServiceFee;
      fare_data.push({
        session: flightSession,
        fare_data_id_api: item.flightId,
        source: item.source,
        flights: [
          {
            flight_value: item.selectedTicketClass.fareValue,
            detail: item,
          },
        ],
      });
    });
    formatData.contact.gender =
      formatData.contact.gender === "male" ? true : false;
    if (!generateInvoice) {
      delete formatData.invoice;
    }
    let finalData = {
      ...formatData,
      ticket_object_list: dropdown,
      totalBaggages,
      passengers,
      fare_data,
      is_invoice: generateInvoice,
      flightType: flightType,
      total_price_net: total_price_net,
      total_tax: total_tax,
      total_fee_service: total_fee_service,
      total_price: total_price,
      customer_id: userInfo?.id,
      voucher_program_ids: voucherProgramIds,
    };
    const bookFlight = async () => {
      try {
        setLoading(true);
        const respon = await FlightApi.bookFlight(
          `/flights-v2/book-flight`,
          finalData
        );
        if (respon?.status === 200) {
          reset();
          const resData = respon?.payload?.data;
          resData.flights = flights;
          toast.success(toaStrMsg.sendSuccess);
          handleSessionStorage("save", "bookingFlight", resData);
          handleSessionStorage("remove", [
            "flightSession",
            "departFlight",
            "returnFlight",
            "flightType",
          ]);
          setTimeout(() => {
            router.push("/ve-may-bay/thong-tin-dat-cho");
          }, 1000);
        } else {
          toast.error(toaStrMsg.sendFailed);
        }
      } catch (error: any) {
        if (
          error instanceof HttpError &&
          error.payload?.errors?.voucher_programs
        ) {
          setVoucherErrors(error.payload.errors.voucher_programs);
          toast.error(toaStrMsg.inValidVouchers);
        } else {
          toast.error(toaStrMsg.error);
        }
      } finally {
        setLoading(false);
      }
    };
    if (finalData) {
      bookFlight();
    }
  };
  useEffect(() => {
    let flightData = [];
    let flightDetailData: any = [];
    const departFlight = handleSessionStorage("get", "departFlight");
    const returnFlight = handleSessionStorage("get", "returnFlight");
    const flightSession = handleSessionStorage("get", "flightSession");

    if (departFlight) {
      flightData.push(departFlight);
      flightDetailData.push(departFlight);
    }
    if (returnFlight) {
      flightData.push(returnFlight);
      flightDetailData.push(returnFlight);
    }
    if (!flightData.length) {
      router.push("/ve-may-bay");
      return;
    }

    if (departFlight && returnFlight) setIsRoundTrip(true);
    setFlights(flightData);
    setFlightType(departFlight.domestic ? "domestic" : "international");
    setFlightsDetail(flightDetailData);
    setFlightSession(flightSession);
    setDocumentReady(true);
  }, [router]);

  let totalPrice = 0;
  let totalAdt = 1;
  let totalChd = 0;
  let totalInf = 0;
  let totalPriceAdt = 0;
  let totalPriceChd = 0;
  let totalPriceInf = 0;
  let keyLoopPassenger = 1;
  let keyLoopDropdown = 1;
  let totalPriceTicketAdt = 0;
  let totalPriceTicketChd = 0;
  let totalPriceTicketInf = 0;
  let totalTaxAdt = 0;
  let totalTaxChd = 0;
  let totalTaxInf = 0;
  let dropdown: any = [];
  flights.map((item) => {
    const ticketClass = item.selectedTicketClass;
    totalAdt = item.numberAdt;
    totalChd = item.numberChd;
    totalInf = item.numberInf;
    totalPriceTicketAdt += ticketClass.fareAdultFinal;
    totalPriceTicketChd += ticketClass.fareChildFinal;
    totalPriceTicketInf += ticketClass.fareInfantFinal;
    totalTaxAdt += ticketClass.taxAdult;
    totalTaxChd += ticketClass.taxChild;
    totalTaxInf += ticketClass.taxInfant;
    totalPriceAdt += ticketClass.totalAdult;
    totalPriceChd += ticketClass.totalChild;
    totalPriceInf += ticketClass.totalInfant;
    totalPrice += ticketClass.totalPrice;
  });
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

  const calculateTotalBaggagePrice = (data: Record<string, any>) => {
    return Object.values(data)
      .flat(2)
      .reduce(
        (acc: { price: number; quantity: number }, item) => {
          const price = Number(item.price);
          acc.price += isNaN(price) ? 0 : price;
          acc.quantity++;
          return acc;
        },
        { price: 0, quantity: 0 }
      );
  };

  const handleChooseBaggage = (
    leg: number,
    code: string,
    typePassenger: string,
    passengerIndex: number
  ) => {
    if (listBaggage.length) {
      if (!listBaggagePassenger[typePassenger]) {
        listBaggagePassenger[typePassenger] = [];
      }
      if (!listBaggagePassenger[typePassenger][passengerIndex]) {
        listBaggagePassenger[typePassenger][passengerIndex] = [];
      }
      if (code) {
        listBaggage.find((item) => {
          if (item.code_uni === code && item.leg === leg) {
            let finalPriceTmp = finalPrice + item.price;
            const baggageObj = {
              airline: item.airline,
              leg: item.leg,
              route: item.route,
              currency: "VND",
              code: item.code,
              name: item.detail.weight + item.detail.unit,
              price: item.price,
              value: item.ssrValue || "unknown",
            };
            const index = listBaggagePassenger[typePassenger][
              passengerIndex
            ].findIndex((item: any) => {
              if (item.leg === leg) {
                finalPriceTmp -= item.price;
                return item;
              }
            });

            if (index >= 0) {
              listBaggagePassenger[typePassenger][passengerIndex][index] =
                baggageObj;
            } else {
              listBaggagePassenger[typePassenger][passengerIndex].push(
                baggageObj
              );
            }
            setFinalPrice(finalPriceTmp);
            setTotalBaggages(calculateTotalBaggagePrice(listBaggagePassenger));
          }
        });
      } else {
        listBaggagePassenger[typePassenger][passengerIndex].map(
          (item: any, index: number) => {
            if (item.leg === leg) {
              setFinalPrice(finalPrice - item.price);
              listBaggagePassenger[typePassenger][passengerIndex].splice(
                index,
                1
              );
            }
          }
        );
        setTotalBaggages(calculateTotalBaggagePrice(listBaggagePassenger));
      }
    }
  };
  useEffect(() => {
    setFinalPrice(totalPrice);
  }, [totalPrice]);
  // Fetch and Handle Data
  useEffect(() => {
    const fetchData = async () => {
      const defaultGroupedObj =
        flights.length > 1 ? { 0: [], 1: [] } : { 0: [] };
      try {
        let params: any = [];
        flights.map((flight) => {
          let baggeParams: any = {
            source: flight.source,
            paxList: [
              {
                type: "ADULT",
                count: 1,
              },
              {
                type: "CHILD",
                count: 1,
              },
            ],
            itineraries: [],
            flightLeg: flight.flightLeg,
          };
          flight.segments.map((segment: any) => {
            baggeParams.itineraries.push({
              airline: segment.airline,
              source: flight.source,
              departure: segment.departure.IATACode,
              arrival: segment.arrival.IATACode,
              departureDate: segment.departure.at,
              arrivalDate: segment.arrival.at,
              flightNumber: segment.flightNumber,
              flightNOP: segment.flightNOP
                ? segment.flightNOP
                : segment.flightNumber,
              fareBasisCode: segment.fareBasisCode,
              bookingClass: segment.bookingClass,
              groupClass: segment.groupClass,
              segmentId: segment.segmentId,
              fareValue: flight.selectedTicketClass.fareValue,
              itineraryId: flight.itineraryId
                ? flight.itineraryId.toString()
                : "1",
            });
            params.push(baggeParams);
          });
        });
        const promises = params.map((param: any) =>
          FlightApi.getBaggage(param)
        );
        const results = await Promise.all(promises);
        const bagsData: any[] = [];

        results.forEach((res) => {
          const bags = res?.payload?.data ?? [];
          if (bags.length) {
            bagsData.push(...bags);
          }
        });
        const groupedByLeg = bagsData.reduce((acc: any, item: any) => {
          acc[item.leg].push(item);
          return acc;
        }, defaultGroupedObj as { [key: number]: typeof bagsData });
        setListBaggage(bagsData);
        setListBaggageGrouped(groupedByLeg);
        translatePage("#wrapper-flight-booking-form", 100);
      } catch (error: any) {
        setListBaggage([]);
        setListBaggageGrouped([defaultGroupedObj]);
      } finally {
        setLoading(false);
      }
    };
    if (flights.length > 0) {
      fetchData();
    }
  }, [flights]);

  const handleClosePopupFlightDetail = () => {
    setShowFlightDetail(false);
  };
  useEffect(() => {
    translateText(flightStaticText, language).then((data) => {
      const translationMap = formatTranslationMap(flightStaticText, data);
      setTranslatedStaticText(translationMap);
    });
  }, [language]);

  if (!documentReady) {
    return (
      <div
        className={`flex my-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
      >
        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
        <span className="text-18">Loading...</span>
      </div>
    );
  }
  return (
    <form
      id="wrapper-flight-booking-form"
      className="mt-0 md:mt-4 rounded-xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col-reverse items-start md:flex-row md:space-x-8 lg:mt-4 pb-8">
        <div className="w-full md:w-7/12 lg:w-8/12 mt-4 md:mt-0 ">
          <div
            className="rounded-2xl"
            style={{
              background:
                "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
            }}
          >
            <h3
              className="text-22 py-4 px-8 font-semibold text-white"
              data-translate="true"
            >
              Thông tin đặt hàng
            </h3>
          </div>
          <div className="mt-6">
            <p className="font-bold text-18" data-translate="true">
              Thông tin liên hệ
            </p>
            <div className="bg-white rounded-xl py-4 px-6 mt-3">
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="relative">
                    <label
                      htmlFor="FirstName"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-translate="true">Họ và tên</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="FirstName"
                      type="text"
                      {...register("contact.full_name")}
                      placeholder="Nhập Họ và tên"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                    />
                    {errors.contact?.full_name && (
                      <p className="text-red-600">
                        {errors.contact?.full_name.message}
                      </p>
                    )}
                  </div>
                  {/* <div className="relative">
                    <label
                      htmlFor="LastName"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-translate="true">Tên đệm & Tên</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="LastName"
                      type="text"
                      {...register("contact.last_name")}
                      placeholder="Nhập tên đệm & tên"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                    />
                    {errors.contact?.last_name && (
                      <p className="text-red-600">
                        {errors.contact?.last_name.message}
                      </p>
                    )}
                  </div> */}
                  <div className="relative">
                    <label
                      htmlFor="gender_person_contact"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-translate="true">Giới tính</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                      <select
                        id="gender_person_contact"
                        className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                        {...register("contact.gender")}
                      >
                        <option value="" data-translate="true">
                          Vui lòng chọn giới tính
                        </option>
                        <option value="male" data-translate="true">
                          Quý ông
                        </option>
                        <option value="female" data-translate="true">
                          Quý bà
                        </option>
                      </select>
                    </div>
                    {errors.contact?.gender && (
                      <p className="text-red-600">
                        {errors.contact?.gender.message}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="phone"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-translate="true">Số điện thoại</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="text"
                      {...register("contact.phone")}
                      placeholder="Nhập số điện thoại"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                    />
                    {errors.contact?.phone && (
                      <p className="text-red-600">
                        {errors.contact?.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-translate="true">Email</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email_person_contact"
                      type="text"
                      placeholder="Nhập email"
                      {...register("contact.email")}
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                    />
                    {errors.contact?.email && (
                      <p className="text-red-600">
                        {errors.contact?.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <textarea
                    placeholder="Yêu cầu đặc biệt"
                    {...register("Note")}
                    className="w-full border border-gray-300 rounded-lg h-28 focus:outline-none focus:border-primary indent-3.5 pt-2.5"
                  ></textarea>
                </div>
                <GenerateInvoiceForm
                  register={register}
                  errors={errors}
                  generateInvoice={generateInvoice}
                  setGenerateInvoice={setGenerateInvoice}
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <p className="font-bold text-18" data-translate="true">
              Thông tin hành khách
            </p>
            <div>
              {totalAdt > 0 &&
                Array.from({ length: totalAdt }, (_, index) => (
                  <div
                    key={keyLoopPassenger++}
                    className="bg-white rounded-xl py-4 px-6 mt-3"
                  >
                    <div className="py-1 px-2 bg-gray-100 rounded-lg">
                      <span className="text-18 font-bold" data-translate="true">
                        Hành khách {keyLoopPassenger}
                      </span>
                      <span className="text-base ml-4" data-translate="true">
                        (vé người lớn)
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Họ</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`atd.${index}.firstName`)}
                          placeholder="Nhập họ"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span
                          className="text-xs text-gray-500"
                          data-translate="true"
                        >
                          Vui lòng nhập họ hợp lệ, đúng chính tả và như trên
                          giấy tờ tùy thân
                        </span>
                        {errors.atd?.[index]?.firstName && (
                          <p className="text-red-600">
                            {errors.atd[index].firstName?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Tên đệm & Tên</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`atd.${index}.lastName`)}
                          placeholder="Nhập tên đệm và tên"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span
                          className="text-xs text-gray-500"
                          data-translate="true"
                        >
                          Vui lòng nhập tên của hành khách đúng như trên giấy tờ
                          tùy thân
                        </span>
                        {errors.atd?.[index]?.lastName && (
                          <p className="text-red-600">
                            {errors.atd[index].lastName?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="service"
                          className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Giới tính</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          <select
                            className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                            {...register(`atd.${index}.gender`)}
                          >
                            <option value="" data-translate="true">
                              Vui lòng chọn giới tính
                            </option>
                            <option value="male" data-translate="true">
                              Quý ông
                            </option>
                            <option value="female" data-translate="true">
                              Quý bà
                            </option>
                          </select>
                        </div>
                        {errors.atd?.[index]?.gender && (
                          <p className="text-red-600">
                            {errors.atd[index].gender?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          id={`atd.${index}.birthday`}
                          className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Ngày sinh</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="booking-form-birthday flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          <Controller
                            name={`atd.${index}.birthday`}
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                id={`atd.${index}.birthday`}
                                selected={field.value || null}
                                onChange={(date: Date | null) =>
                                  field.onChange(date)
                                }
                                onChangeRaw={(event) => {
                                  if (event) {
                                    const target =
                                      event.target as HTMLInputElement;
                                    if (target.value) {
                                      target.value = target.value
                                        .trim()
                                        .replace(/\//g, "-");
                                    }
                                  }
                                }}
                                placeholderText="Nhập ngày sinh"
                                dateFormat="dd-MM-yyyy"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                locale={language}
                                maxDate={
                                  new Date(
                                    new Date().getFullYear() - 12,
                                    11,
                                    31
                                  )
                                }
                                minDate={
                                  new Date(
                                    new Date().getFullYear() - 100,
                                    11,
                                    31
                                  )
                                }
                                className="text-sm pl-4 w-full  placeholder-gray-400 focus:outline-none  focus:border-primary"
                              />
                            )}
                          />
                        </div>
                        {errors.atd?.[index]?.birthday && (
                          <p className="text-red-600">
                            {errors.atd[index].birthday?.message}
                          </p>
                        )}
                      </div>
                      {flightType === "international" && (
                        <>
                          <div className="relative">
                            <label
                              id={`atd.${index}.passport`}
                              className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                            >
                              <span data-translate="true">Số hộ chiếu</span>
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              id={`atd.${index}.passport`}
                              type="text"
                              {...register(`atd.${index}.passport`)}
                              placeholder="Nhập số hộ chiếu"
                              className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                            />
                            {errors.atd?.[index]?.passport && (
                              <p className="text-red-600">
                                {errors.atd?.[index]?.passport.message}
                              </p>
                            )}
                          </div>
                          <div className="relative">
                            <label
                              id={`atd.${index}.passport_expiry_date`}
                              className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                            >
                              <span data-translate="true">Ngày hết hạn</span>
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="booking-form-birthday flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                              <Controller
                                name={`atd.${index}.passport_expiry_date`}
                                control={control}
                                render={({ field }) => (
                                  <DatePicker
                                    id={`atd.${index}.passport_expiry_date`}
                                    selected={field.value || null}
                                    onChange={(date: Date | null) =>
                                      field.onChange(date)
                                    }
                                    onChangeRaw={(event) => {
                                      if (event) {
                                        const target =
                                          event.target as HTMLInputElement;
                                        if (target.value) {
                                          target.value = target.value
                                            .trim()
                                            .replace(/\//g, "-");
                                        }
                                      }
                                    }}
                                    placeholderText="Nhập ngày hết hạn"
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    locale={language}
                                    maxDate={
                                      new Date(
                                        new Date().getFullYear() + 50,
                                        11,
                                        31
                                      )
                                    }
                                    minDate={
                                      new Date(
                                        new Date().getFullYear(),
                                        new Date().getMonth(),
                                        new Date().getDate()
                                      )
                                    }
                                    className="text-sm pl-4 w-full  placeholder-gray-400 focus:outline-none  focus:border-primary"
                                  />
                                )}
                              />
                            </div>
                            {errors.atd?.[index]?.passport_expiry_date && (
                              <p className="text-red-600">
                                {
                                  errors.atd?.[index]?.passport_expiry_date
                                    .message
                                }
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {Object.keys(listBaggageGrouped).length > 0 &&
                        Object.entries(listBaggageGrouped).map(
                          ([flightLeg, items]) => {
                            const leg = parseInt(flightLeg);
                            const adtBaggages =
                              items.length > 0 &&
                              items.filter((bag: any) => {
                                return (
                                  bag.paxType === "ADULT" ||
                                  bag.paxType === "ALL"
                                );
                              });
                            const hasBaggage =
                              adtBaggages.length > 0 ? true : false;
                            return (
                              <div
                                id={`wrapper-baggage-atd-leg-${leg}`}
                                className={`relative ${
                                  !hasBaggage ? "cursor-not-allowed" : ""
                                }`}
                                key={leg}
                              >
                                <label
                                  data-translate="true"
                                  className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                                >
                                  Hành lý chiều {leg === 0 ? "đi" : "về"}
                                </label>
                                <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                                  <select
                                    onChange={(event) => {
                                      handleChooseBaggage(
                                        leg,
                                        event.target.value,
                                        "atd",
                                        index
                                      );
                                    }}
                                    disabled={!hasBaggage}
                                    className={`text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5 ${
                                      !hasBaggage
                                        ? "cursor-not-allowed appearance-none"
                                        : ""
                                    }`}
                                  >
                                    <option value="" data-translate="true">
                                      {hasBaggage
                                        ? "Chọn gói hành lý"
                                        : "Liên hệ Happybook"}
                                    </option>
                                    {hasBaggage &&
                                      adtBaggages.map(
                                        (baggage: any, key: any) => (
                                          <option
                                            key={key}
                                            value={baggage.code_uni}
                                            data-translate="true"
                                          >
                                            {`${baggage.detail.weight} ${baggage.detail.unit}`}{" "}
                                            {" / "}
                                            {formatCurrency(baggage.price)}{" "}
                                            {baggage.description
                                              ? `(${baggage.description})`
                                              : ""}
                                          </option>
                                        )
                                      )}
                                  </select>
                                </div>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </div>
                ))}
            </div>
            <div>
              {totalChd > 0 &&
                Array.from({ length: totalChd }, (_, index) => (
                  <div
                    key={keyLoopPassenger++}
                    className="bg-white rounded-xl py-4 px-6 mt-3"
                  >
                    <div className="py-1 px-2 bg-gray-100 rounded-lg">
                      <span className="text-18 font-bold" data-translate="true">
                        Hành khách {keyLoopPassenger}
                      </span>
                      <span className="text-base ml-4" data-translate="true">
                        ( vé trẻ em)
                      </span>
                    </div>
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Họ</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`chd.${index}.firstName`)}
                          placeholder="Nhập họ"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span
                          className="text-xs text-gray-500"
                          data-translate="true"
                        >
                          Vui lòng nhập họ hợp lệ, đúng chính tả và như trên
                          giấy tờ tùy thân
                        </span>
                        {errors.chd?.[index]?.firstName && (
                          <p className="text-red-600">
                            {errors.chd[index].firstName?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Tên đệm & Tên</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`chd.${index}.lastName`)}
                          placeholder="Nhập tên đệm và tên"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span
                          className="text-xs text-gray-500"
                          data-translate="true"
                        >
                          Vui lòng nhập tên của hành khách đúng như trên giấy tờ
                          tùy thân
                        </span>
                        {errors.chd?.[index]?.lastName && (
                          <p className="text-red-600">
                            {errors.chd[index].lastName?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="service"
                          className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Giới tính</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          <select
                            className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                            {...register(`chd.${index}.gender`)}
                          >
                            <option value="" data-translate="true">
                              Vui lòng chọn giới tính
                            </option>
                            <option value="male" data-translate="true">
                              Nam
                            </option>
                            <option value="female" data-translate="true">
                              Nữ
                            </option>
                          </select>
                        </div>
                        {errors.chd?.[index]?.gender && (
                          <p className="text-red-600">
                            {errors.chd[index].gender?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          id={`chd.${index}.birthday`}
                          className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Ngày sinh</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="booking-form-birthday flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          <Controller
                            name={`chd.${index}.birthday`}
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                id={`chd.${index}.birthday`}
                                selected={field.value || null}
                                onChange={(date: Date | null) =>
                                  field.onChange(date)
                                }
                                onChangeRaw={(event) => {
                                  if (event) {
                                    const target =
                                      event.target as HTMLInputElement;
                                    if (target.value) {
                                      target.value = target.value
                                        .trim()
                                        .replace(/\//g, "-");
                                    }
                                  }
                                }}
                                placeholderText="Nhập ngày sinh"
                                dateFormat="dd-MM-yyyy"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                locale={language}
                                maxDate={
                                  new Date(new Date().getFullYear() - 2, 11, 31)
                                }
                                minDate={
                                  new Date(new Date().getFullYear() - 12, 0, 1)
                                }
                                className="text-sm pl-4 w-full  placeholder-gray-400 focus:outline-none  focus:border-primary"
                              />
                            )}
                          />
                        </div>
                        {errors.chd?.[index]?.birthday && (
                          <p className="text-red-600">
                            {errors.chd[index].birthday?.message}
                          </p>
                        )}
                      </div>
                      {Object.keys(listBaggageGrouped).length > 0 &&
                        Object.entries(listBaggageGrouped).map(
                          ([flightLeg, items]) => {
                            const leg = parseInt(flightLeg);
                            const chdBaggages =
                              items.length > 0 &&
                              items.filter((bag: any) => {
                                return (
                                  bag.paxType === "CHILD" ||
                                  bag.paxType === "ALL"
                                );
                              });
                            const hasBaggage =
                              chdBaggages.length > 0 ? true : false;
                            return (
                              <div
                                className={`relative ${
                                  !hasBaggage ? "cursor-not-allowed" : ""
                                }`}
                                key={leg}
                              >
                                <label
                                  data-translate="true"
                                  className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                                >
                                  Hành lý chiều {leg === 0 ? "đi" : "về"}
                                </label>
                                <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                                  <select
                                    onChange={(event) => {
                                      handleChooseBaggage(
                                        leg,
                                        event.target.value,
                                        "chd",
                                        index
                                      );
                                    }}
                                    disabled={!hasBaggage}
                                    className={`text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5 ${
                                      !hasBaggage
                                        ? "cursor-not-allowed appearance-none"
                                        : ""
                                    }`}
                                  >
                                    <option value="" data-translate="true">
                                      {hasBaggage
                                        ? "Chọn gói hành lý"
                                        : "Liên hệ Happybook"}
                                    </option>
                                    {hasBaggage &&
                                      chdBaggages.map(
                                        (baggage: any, key: any) => (
                                          <option
                                            key={key}
                                            value={baggage.code_uni}
                                            data-translate="true"
                                          >
                                            {`${baggage.detail.weight} ${baggage.detail.unit}`}{" "}
                                            {" / "}
                                            {formatCurrency(baggage.price)}{" "}
                                            {baggage.description
                                              ? `(${baggage.description})`
                                              : ""}
                                          </option>
                                        )
                                      )}
                                  </select>
                                </div>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </div>
                ))}
            </div>
            <div>
              {totalInf > 0 &&
                Array.from({ length: totalInf }, (_, index) => (
                  <div
                    key={keyLoopPassenger++}
                    className="bg-white rounded-xl py-4 px-6 mt-3"
                  >
                    <div className="py-1 px-2 bg-gray-100 rounded-lg">
                      <span className="text-18 font-bold" data-translate="true">
                        Hành khách {keyLoopPassenger}
                      </span>
                      <span className="text-base ml-4" data-translate="true">
                        ( vé em bé)
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Họ</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`inf.${index}.firstName`)}
                          placeholder="Nhập họ"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span
                          className="text-xs text-gray-500"
                          data-translate="true"
                        >
                          Vui lòng nhập họ hợp lệ, đúng chính tả và như trên
                          giấy tờ tùy thân
                        </span>
                        {errors.inf?.[index]?.firstName && (
                          <p className="text-red-600">
                            {errors.inf[index].firstName?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Tên đệm & Tên</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`inf.${index}.lastName`)}
                          placeholder="Nhập tên đệm và tên"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span
                          className="text-xs text-gray-500"
                          data-translate="true"
                        >
                          Vui lòng nhập tên của hành khách đúng như trên giấy tờ
                          tùy thân
                        </span>
                        {errors.inf?.[index]?.lastName && (
                          <p className="text-red-600">
                            {errors.inf[index].lastName?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="service"
                          className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Giới tính</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          <select
                            className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                            {...register(`inf.${index}.gender`)}
                          >
                            <option value="" data-translate="true">
                              Vui lòng chọn giới tính
                            </option>
                            <option value="male" data-translate="true">
                              Nam
                            </option>
                            <option value="female" data-translate="true">
                              Nữ
                            </option>
                          </select>
                        </div>
                        {errors.inf?.[index]?.gender && (
                          <p className="text-red-600">
                            {errors.inf[index].gender?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          id={`inf.${index}.birthday`}
                          className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          <span data-translate="true">Ngày sinh</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="booking-form-birthday flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          <Controller
                            name={`inf.${index}.birthday`}
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                id={`inf.${index}.birthday`}
                                selected={field.value || null}
                                onChange={(date: Date | null) =>
                                  field.onChange(date)
                                }
                                onChangeRaw={(event) => {
                                  if (event) {
                                    const target =
                                      event.target as HTMLInputElement;
                                    if (target.value) {
                                      target.value = target.value
                                        .trim()
                                        .replace(/\//g, "-");
                                    }
                                  }
                                }}
                                placeholderText="Nhập ngày sinh"
                                dateFormat="dd-MM-yyyy"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                locale={language}
                                maxDate={
                                  new Date(new Date().getFullYear(), 11, 31)
                                }
                                minDate={
                                  new Date(new Date().getFullYear() - 2, 0, 1)
                                }
                                className="text-sm pl-4 w-full  placeholder-gray-400 focus:outline-none  focus:border-primary"
                              />
                            )}
                          />
                        </div>
                        {errors.inf?.[index]?.birthday && (
                          <p className="text-red-600">
                            {errors.inf[index].birthday?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-6">
              <LoadingButton
                isLoading={loading}
                text="Tiếp tục"
                disabled={false}
              />
            </div>
          </div>
        </div>
        <div className="w-full md:w-5/12 lg:w-4/12 bg-white rounded-2xl pb-0 ">
          <div className="pb-0 py-4 px-3 lg:px-6">
            <div className="flex flex-col space-y-2 items-start lg:items-center lg:space-y-0 lg:flex-row lg:justify-between">
              <span className="text-22 font-semibold" data-translate="true">
                Thông tin đặt chỗ
              </span>
              <button
                type="button"
                className="underline underline-offset-8	 text-blue-700 pb-1 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setShowFlightDetail(true);
                }}
                data-translate="true"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
          {/* Flight */}
          <div>
            {flights.map((item, index) => {
              const flight = item;
              const durationFlight = flight.duration
                ? flight.duration
                : differenceInSeconds(
                    new Date(flight.arrival.at),
                    new Date(flight.departure.at)
                  ) / 60;
              const startDateLocale = format(
                new Date(flight.departure.at),
                "EEEE dd/MM/yyyy",
                { locale: vi }
              );
              return (
                <div
                  className={`py-3 px-3 lg:px-6 mb-3 border-t-gray-300 ${
                    index > 0 ? "border-t" : "border-t-0"
                  }`}
                  key={index}
                >
                  <div className="flex justify-between">
                    <p className="font-bold" data-translate="true">
                      {index === 1 ? "Chiều về" : "Chiều đi"}
                    </p>
                    <p className="text-sm text-gray-500" data-translate="true">
                      {startDateLocale}
                    </p>
                  </div>
                  <div className="flex my-3 item-start items-center text-left space-x-3">
                    <DisplayImage
                      imagePath={`assets/images/airline/${flight.airLineCode.toLowerCase()}.gif`}
                      width={80}
                      height={24}
                      alt={"AirLine"}
                      classStyle={"max-w-16 md:max-w-20 max-h-10"}
                    />
                    <div>
                      <h3 className="text-sm md:text-18 font-semibold mb-1">
                        {flight.airline}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {flight.flightNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-center mt-3 flex justify-between">
                    <div className="flex items-center justify-between gap-4 w-full">
                      <div className="flex flex-col items-center">
                        <span className="text-sm">
                          {formatTimeZone(
                            flight.departure.at,
                            flight.departure.timezone
                          )}
                        </span>
                        <span className="bg-gray-200 px-2 py-[2px] rounded-sm text-sm mt-1">
                          {flight.departure.IATACode}
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
                            {formatNumberToHoursAndMinutesFlight(
                              durationFlight
                            )}
                          </span>
                          <div className="relative flex items-center w-full">
                            <div className="flex-grow h-px bg-gray-700"></div>
                            <div className="flex-shrink-0 w-4 h-4 bg-white border-2 border-gray-400 rounded-full absolute left-1/2 -translate-x-1/2"></div>
                          </div>
                          <span
                            className="text-sm text-gray-700 mt-2"
                            data-translate="true"
                          >
                            {flight.stopPoint
                              ? `${flight.stopPoint} điểm dừng`
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
                        <span className="text-sm">
                          {formatTimeZone(
                            flight.arrival.at,
                            flight.arrival.timezone
                          )}
                        </span>
                        <span className="bg-gray-200 px-2 py-[2px] rounded-sm text-sm mt-1">
                          {flight.arrival.IATACode}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Line process */}
            <div className="mt-6 flex flex-row items-center justify-between w-full overflow-hidden">
              <div className="w-8 h-8 bg-gray-100 rounded-full -ml-3"></div>
              <div className="relative w-full h-px mx-2 overflow-hidden">
                <div className="w-full h-1 bg-gradient-to-r from-[#4E6EB3] to-[#4E6EB3] via-transparent bg-[length:16px_2px] bg-repeat-x"></div>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full -mr-3"></div>
            </div>
            <div className="py-4 px-3 lg:px-6">
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
                        {formatCurrency(item.totalPriceTicket)} x{" "}
                        {item.quantity}
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

              <div className="flex justify-between pb-4">
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
              <div className="pt-4 border-t">
                <VoucherProgram
                  totalPrice={finalPrice}
                  onApplyVoucher={handleApplyVoucher}
                  vouchersData={vouchersData}
                  voucherErrors={voucherErrors}
                  currency={"VND"}
                  onSearch={handleSearch}
                  isSearching={searchingVouchers}
                />
              </div>
              <div className="border-t border-t-gray-200">
                {totalDiscount > 0 && (
                  <div>
                    <div className="flex pt-4 justify-between">
                      <span
                        className=" text-gray-700 font-bold"
                        data-translate="true"
                      >
                        Giá gốc
                      </span>
                      <p className="font-semibold">
                        {formatCurrency(finalPrice)}
                      </p>
                    </div>
                    <div className="flex py-4 justify-between">
                      <span
                        className=" text-gray-700 font-bold"
                        data-translate="true"
                      >
                        Giảm giá
                      </span>
                      <p className="font-semibold">
                        {formatCurrency(totalDiscount)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex pt-4 justify-between border-t border-t-gray-300 ">
                  <span
                    className=" text-gray-700 font-bold"
                    data-translate="true"
                  >
                    Tổng cộng
                  </span>
                  <p className="font-bold text-primary">
                    {formatCurrency(finalPrice - totalDiscount)}
                  </p>
                </div>
                {/* <div className="text-[#166987] font-semibold mt-1 text-sm leading-6 italic">
                  Bạn được tặng {totalAdt + totalChd + totalInf} bảo hiểm du
                  lịch.Sau khi đơn hàng được đặt sẽ có booker liên hệ để tư vấn
                  gói bảo hiểm phù hợp với bạn.
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {flightsDetail.length > 0 && (
        <FlightDetailPopup
          airports={airportsData}
          tabs={[{ id: 1, name: "Chi tiết hành trình" }]}
          flights={flightsDetail}
          isOpen={showFlightDetail}
          onClose={handleClosePopupFlightDetail}
          isLoadingFareRules={false}
        />
      )}
    </form>
  );
}
