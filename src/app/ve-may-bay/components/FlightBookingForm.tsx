"use client";
import { FlightApi } from "@/api/Flight";
import { differenceInSeconds, format } from "date-fns";
import LoadingButton from "@/components/base/LoadingButton";
import {
  formatNumberToHoursAndMinutesFlight,
  formatTime,
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/flightBooking.scss";
import { vi } from "date-fns/locale";
import { handleSessionStorage } from "@/utils/Helper";
import FlightDetailPopup from "./FlightDetailPopup";
import DisplayImage from "@/components/base/DisplayImage";

export default function FlightBookForm({ airportsData }: any) {
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [flights, setFlights] = useState<any[]>([]);
  const [flightsDetail, setFlightsDetail] = useState<any[]>([]);
  const [flightType, setFlightType] = useState<string>("");
  const [listBaggage, setListBaggage] = useState<any[]>([]);
  const [listBaggagePassenger, setListBaggagePassenger] = useState<any>([]);
  const [totalBaggages, setTotalBaggages] = useState<{
    price: number;
    quantity: number;
  }>({ price: 0, quantity: 0 });
  const [flightSession, setFlightSession] = useState<string | null>(null);
  const [documentReady, setDocumentReady] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [showFlightDetail, setShowFlightDetail] = useState<boolean>(false);

  const toggleDropdown = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const [schemaForm, setSchemaForm] = useState(() =>
    FlightBookingInforBody(generateInvoice)
  );
  const router = useRouter();

  useEffect(() => {
    setSchemaForm(FlightBookingInforBody(generateInvoice));
  }, [generateInvoice]);

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
      checkBoxGenerateInvoice: false,
    },
  });

  const onSubmit = (data: FlightBookingInforType) => {
    setLoading(true);
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
    if (flightType === "international") {
      fare_data.push({
        session: flightSession,
        fare_data_id_api: flights[0].FareDataId,
        AutoIssue: false,
        flights: [],
      });
      let ListFlightObj: any = [];
      flights.map((item, _) => {
        ListFlightObj.push({ flight_value: item.ListFlight[0].FlightValue });
      });
      if (ListFlightObj.length) {
        fare_data[0].flights = ListFlightObj;
      }
    } else {
      flights.map((item, _) => {
        fare_data.push({
          session: flightSession,
          fare_data_id_api: item.FareDataId,
          AutoIssue: false,
          flights: [{ flight_value: item.ListFlight[0].FlightValue }],
        });
      });
    }

    formatData.contact.gender =
      formatData.contact.gender === "male" ? true : false;
    let finalData = {
      ...formatData,
      passengers,
      fare_data,
      is_invoice: generateInvoice,
      flightType: flightType,
    };
    const bookFlight = async () => {
      try {
        setLoading(true);
        const respon = await FlightApi.bookFlight("book-flight", finalData);
        if (respon?.status === 200) {
          reset();
          toast.success("Gửi yêu cầu thành công!");
          handleSessionStorage("save", "bookingFlight", respon?.payload);
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
          toast.error("Gửi yêu cầu thất bại!");
        }
      } catch (error: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau");
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
    const flightType = handleSessionStorage("get", "flightType") ?? "";
    if (departFlight) {
      flightData.push(departFlight);
      flightDetailData.push(departFlight.ListFlight[0]);
    }
    if (returnFlight) {
      flightData.push(returnFlight);
      flightDetailData.push(returnFlight.ListFlight[0]);
    }
    if (
      !flightData.length ||
      !flightSession ||
      !["domestic", "international"].includes(flightType)
    ) {
      router.push("/ve-may-bay");
    }

    if (departFlight && returnFlight) setIsRoundTrip(true);
    setFlights(flightData);
    setFlightType(flightType);
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
  let FareAdt: any = [];
  let FareChd: any = [];
  let FareInf: any = [];
  let keyLoopPassenger = 1;
  let keyLoopDropdown = 1;
  let totalPriceTicketAdt = 0;
  let totalPriceTicketChd = 0;
  let totalPriceTicketInf = 0;
  let totalTaxAdt = 0;
  let totalTaxChd = 0;
  let totalTaxInf = 0;
  let dropdown: any = [];

  let shouldStopMapFlights = false;

  flights.map((item, index) => {
    if (shouldStopMapFlights) return;
    totalPrice += item.TotalPrice;
    totalAdt = item.Adt > totalAdt ? item.Adt : totalAdt;
    totalChd = item.Chd > totalChd ? item.Chd : totalChd;
    totalInf = item.Inf > totalInf ? item.Inf : totalInf;
    totalPriceAdt += item.FareAdt + item.TaxAdt + item.ServiceFeeAdt;
    totalPriceChd += item.FareChd + item.TaxChd + item.ServiceFeeChd;
    totalPriceInf += item.FareInf + item.TaxInf + item.ServiceFeeInf;
    FareAdt[index] = item.FareAdt + item.TaxAdt;
    FareChd[index] = item.FareChd + item.TaxChd;
    FareInf[index] = item.FareInf + item.TaxInf;
    totalPriceTicketAdt += item.FareAdt;
    totalPriceTicketChd += item.FareChd;
    totalPriceTicketInf += item.FareInf;
    totalTaxAdt += item.TaxAdt;
    totalTaxChd += item.TaxChd;
    totalTaxInf += item.TaxInf;
    if (flightType === "international") shouldStopMapFlights = true;
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
          if (item.Code === code && item.Leg === leg) {
            let finalPriceTmp = finalPrice + item.Price;
            const baggageObj = {
              airline: item.Airline,
              leg: item.Leg,
              route: item.Route,
              code: item.Code,
              currency: item.Currency,
              name: item.Name,
              price: item.Price,
              value: item.Value,
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
      try {
        let params: any = {
          ListFareData: [],
        };
        if (flightSession) {
          flights.map((flight) => {
            params["ListFareData"].push({
              Session: flightSession,
              FareDataId: flight.FareDataId,
              ListFlight: [
                {
                  FlightValue: flight.ListFlight[0].FlightValue,
                },
              ],
            });
          });
          const response = await FlightApi.getBaggage(
            "flights/getbaggage",
            params
          );
          setListBaggage(response?.payload.ListBaggage ?? []);
        }
      } catch (error: any) {
        setListBaggage([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [flightSession, flights]);

  const handleClosePopupFlightDetail = () => {
    setShowFlightDetail(false);
  };

  if (!documentReady) {
    return (
      <div
        className={`flex my-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
      >
        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
        <span className="text-18">Đang tải...</span>
      </div>
    );
  }
  return (
    <form className="mt-0 md:mt-4 rounded-xl" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col-reverse items-start md:flex-row md:space-x-8 lg:mt-4 pb-8">
        <div className="w-full md:w-7/12 lg:w-8/12 mt-4 md:mt-0 ">
          <div
            className="rounded-2xl"
            style={{
              background:
                "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
            }}
          >
            <h3 className="text-22 py-4 px-8 font-semibold text-white">
              Thông tin đặt hàng
            </h3>
          </div>
          <div className="mt-6">
            <p className="font-bold text-18">Thông tin liên hệ</p>
            <div className="bg-white rounded-xl py-4 px-6 mt-3">
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="relative">
                    <label
                      htmlFor="FirstName"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      Họ <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="FirstName"
                      type="text"
                      {...register("contact.first_name")}
                      placeholder="Nhập Họ"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                    />
                    {errors.contact?.first_name && (
                      <p className="text-red-600">
                        {errors.contact?.first_name.message}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="LastName"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      Tên đệm & Tên <span className="text-red-500">*</span>
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
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="gender_person_contact"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      Giới tính <span className="text-red-500">*</span>
                    </label>

                    <select
                      id="gender_person_contact"
                      {...register("contact.gender")}
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                    >
                      <option value="" className="text-gray-300">
                        Vui lòng chọn giới tính
                      </option>
                      <option value="male">Quý ông</option>
                      <option value="female">Quý bà</option>
                    </select>
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
                      Số điện thoại <span className="text-red-500">*</span>
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
                      Email <span className="text-red-500">*</span>
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
                <div className="mt-2 flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("checkBoxGenerateInvoice")}
                    checked={generateInvoice}
                    onChange={(e) => {
                      setGenerateInvoice(e.target.checked);
                    }}
                    className="w-4 h-4"
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
                {/* generateInvoice */}
                {generateInvoice && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label
                          htmlFor="GenerateInvoice_company_name"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          Tên công ty <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="GenerateInvoice_company_name"
                          type="text"
                          {...register(`invoice.company_name`)}
                          placeholder="Nhập tên công ty"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        {errors.invoice?.company_name && (
                          <p className="text-red-600">
                            {errors.invoice?.company_name?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="GenerateInvoice_company_address"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="GenerateInvoice_company_address"
                          type="text"
                          placeholder="Nhập địa chỉ công ty"
                          {...register(`invoice.address`)}
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                        />
                        {errors.invoice?.address && (
                          <p className="text-red-600">
                            {errors.invoice?.address?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="GenerateInvoice_city"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          Thành phố <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="GenerateInvoice_city"
                          type="text"
                          placeholder="Nhập thành phố"
                          {...register(`invoice.city`)}
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                        />
                        {errors.invoice?.city && (
                          <p className="text-red-600">
                            {errors.invoice?.city?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="GenerateInvoice_tax_code"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          Mã số thuế <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="GenerateInvoice_tax_code"
                          type="text"
                          placeholder="Nhập mã số thuế"
                          {...register(`invoice.mst`)}
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                        />
                        {errors.invoice?.mst && (
                          <p className="text-red-600">
                            {errors.invoice?.mst?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="GenerateInvoice_recipient_name"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          Người nhận hóa đơn
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="GenerateInvoice_recipient_name"
                          type="text"
                          placeholder="Nhập họ và tên người nhận"
                          {...register(`invoice.contact_name`)}
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                        />
                        {errors.invoice?.contact_name && (
                          <p className="text-red-600">
                            {errors.invoice?.contact_name?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="GenerateInvoice_phone"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="GenerateInvoice_phone"
                          type="text"
                          placeholder="Nhập số điện thoại người nhận"
                          {...register(`invoice.phone`)}
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                        />
                        {errors.invoice?.phone && (
                          <p className="text-red-600">
                            {errors.invoice?.phone?.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="GenerateInvoice_email"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="GenerateInvoice_email"
                          type="text"
                          placeholder="Nhập Email"
                          {...register(`invoice.email`)}
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                        />
                        {errors.invoice?.email && (
                          <p className="text-red-600">
                            {errors.invoice?.email?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <p className="font-bold text-18">Thông tin hành khách</p>
            <div>
              {totalAdt > 0 &&
                Array.from({ length: totalAdt }, (_, index) => (
                  <div
                    key={keyLoopPassenger++}
                    className="bg-white rounded-xl py-4 px-6 mt-3"
                  >
                    <div className="py-1 px-2 bg-gray-100 rounded-lg">
                      <span className="text-18 font-bold">
                        Hành khách {keyLoopPassenger}
                      </span>
                      <span className="text-base ml-4">(vé người lớn)</span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          Họ <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`atd.${index}.firstName`)}
                          placeholder="Nhập họ"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span className="text-xs text-gray-500">
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
                          Tên đệm & Tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`atd.${index}.lastName`)}
                          placeholder="Nhập tên đệm và tên"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span className="text-xs text-gray-500">
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
                          Giới tính <span className="text-red-500">*</span>
                        </label>
                        <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          <select
                            className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                            {...register(`atd.${index}.gender`)}
                          >
                            <option value="">Vui lòng chọn giới tính</option>
                            <option value="male">Quý ông</option>
                            <option value="female">Quý bà</option>
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
                          Ngày sinh <span className="text-red-500">*</span>
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
                                placeholderText="Nhập ngày sinh"
                                dateFormat="dd-MM-yyyy"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                locale={vi}
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
                      <div className="relative">
                        <label
                          id={`atd.${index}.cccd`}
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          CCCD <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`atd.${index}.cccd`}
                          type="text"
                          {...register(`atd.${index}.cccd`)}
                          placeholder="Nhập số CCCD"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        {errors.atd?.[index]?.cccd && (
                          <p className="text-red-600">
                            {errors.atd?.[index]?.cccd.message}
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          id={`atd.${index}.cccd_date`}
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          Ngày hết hạn <span className="text-red-500">*</span>
                        </label>
                        <div className="booking-form-birthday flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          <Controller
                            name={`atd.${index}.cccd_date`}
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                id={`atd.${index}.cccd_date`}
                                selected={field.value || null}
                                onChange={(date: Date | null) =>
                                  field.onChange(date)
                                }
                                placeholderText="Nhập ngày hết hạn"
                                dateFormat="dd-MM-yyyy"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                locale={vi}
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
                        {errors.atd?.[index]?.cccd_date && (
                          <p className="text-red-600">
                            {errors.atd?.[index]?.cccd_date.message}
                          </p>
                        )}
                      </div>
                      {listBaggage.length > 0 && (
                        <div className="relative">
                          <label
                            htmlFor="service"
                            className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                          >
                            Hành lý chiều đi
                          </label>
                          <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                            <select
                              onChange={(event) => {
                                handleChooseBaggage(
                                  0,
                                  event.target.value,
                                  "atd",
                                  index
                                );
                              }}
                              className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                            >
                              <option value="">Chọn gói hành lý</option>
                              {listBaggage.map((baggage, key) => {
                                if (baggage.Leg === 0) {
                                  return (
                                    <option key={key} value={baggage.Code}>
                                      {baggage.Name} {" / "}
                                      {baggage.Price.toLocaleString(
                                        "vi-VN"
                                      )}{" "}
                                      {baggage.Currency}
                                    </option>
                                  );
                                }
                              })}
                            </select>
                          </div>
                        </div>
                      )}
                      {isRoundTrip && listBaggage.length > 0 && (
                        <div className="relative">
                          <label
                            htmlFor="service"
                            className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                          >
                            Hành lý chiều về
                          </label>
                          <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                            <select
                              onChange={(event) => {
                                handleChooseBaggage(
                                  1,
                                  event.target.value,
                                  "atd",
                                  index
                                );
                              }}
                              className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                            >
                              <option value="">Chọn gói hành lý</option>
                              {listBaggage.map((baggage, key) => {
                                if (baggage.Leg === 1) {
                                  return (
                                    <option key={key} value={baggage.Code}>
                                      {baggage.Name} {" / "}
                                      {baggage.Price.toLocaleString(
                                        "vi-VN"
                                      )}{" "}
                                      {baggage.Currency}
                                    </option>
                                  );
                                }
                              })}
                            </select>
                          </div>
                        </div>
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
                      <span className="text-18 font-bold">
                        Hành khách {keyLoopPassenger}
                      </span>
                      <span className="text-base ml-4">( vé trẻ em)</span>
                    </div>
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          Họ <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`chd.${index}.firstName`)}
                          placeholder="Nhập họ"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span className="text-xs text-gray-500">
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
                          Tên đệm & Tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`chd.${index}.lastName`)}
                          placeholder="Nhập tên đệm và tên"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span className="text-xs text-gray-500">
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
                          Giới tính <span className="text-red-500">*</span>
                        </label>
                        <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          <select
                            className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                            {...register(`chd.${index}.gender`)}
                          >
                            <option value="">Vui lòng chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
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
                          Ngày sinh <span className="text-red-500">*</span>
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
                                placeholderText="Nhập ngày sinh"
                                dateFormat="dd-MM-yyyy"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                locale={vi}
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
                      {listBaggage.length > 0 && (
                        <div className="relative">
                          <label
                            htmlFor="service"
                            className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                          >
                            Hành lý chiều đi
                          </label>
                          <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                            <select
                              onChange={(event) => {
                                handleChooseBaggage(
                                  0,
                                  event.target.value,
                                  "chd",
                                  index
                                );
                              }}
                              className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                            >
                              <option value="">Chọn gói hành lý</option>
                              {listBaggage.map((baggage, key) => {
                                if (baggage.Leg === 0) {
                                  return (
                                    <option key={key} value={baggage.Code}>
                                      {baggage.Name} {" / "}
                                      {baggage.Price.toLocaleString(
                                        "vi-VN"
                                      )}{" "}
                                      {baggage.Currency}
                                    </option>
                                  );
                                }
                              })}
                            </select>
                          </div>
                        </div>
                      )}
                      {isRoundTrip && listBaggage.length > 0 && (
                        <div className="relative">
                          <label
                            htmlFor="service"
                            className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                          >
                            Hành lý chiều về
                          </label>
                          <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                            <select
                              onChange={(event) => {
                                handleChooseBaggage(
                                  1,
                                  event.target.value,
                                  "chd",
                                  index
                                );
                              }}
                              className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                            >
                              <option value="">Chọn gói hành lý</option>
                              {listBaggage.map((baggage, key) => {
                                if (baggage.Leg === 1) {
                                  return (
                                    <option key={key} value={baggage.Code}>
                                      {baggage.Name} {" / "}
                                      {baggage.Price.toLocaleString(
                                        "vi-VN"
                                      )}{" "}
                                      {baggage.Currency}
                                    </option>
                                  );
                                }
                              })}
                            </select>
                          </div>
                        </div>
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
                      <span className="text-18 font-bold">
                        Hành khách {keyLoopPassenger}
                      </span>
                      <span className="text-base ml-4">( vé em bé)</span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="relative">
                        <label
                          htmlFor="fullName"
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                        >
                          Họ <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`inf.${index}.firstName`)}
                          placeholder="Nhập họ"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span className="text-xs text-gray-500">
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
                          Tên đệm & Tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          {...register(`inf.${index}.lastName`)}
                          placeholder="Nhập tên đệm và tên"
                          className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                        />
                        <span className="text-xs text-gray-500">
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
                          Giới tính <span className="text-red-500">*</span>
                        </label>
                        <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                          <select
                            className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                            {...register(`inf.${index}.gender`)}
                          >
                            <option value="">Vui lòng chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
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
                          Ngày sinh <span className="text-red-500">*</span>
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
                                placeholderText="Nhập ngày sinh"
                                dateFormat="dd-MM-yyyy"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                locale={vi}
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
            <div className="flex justify-between">
              <span className="text-22 font-semibold">Thông tin đặt chỗ</span>
              <button
                type="button"
                className="underline underline-offset-8	 text-blue-700 pb-1 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setShowFlightDetail(true);
                }}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
          {/* Flight */}
          <div>
            {flights.map((item, index) => {
              const flight = item.ListFlight[0];
              const durationFlight =
                differenceInSeconds(
                  new Date(flight.EndDate),
                  new Date(flight.StartDate)
                ) / 60;
              const startDateLocale = format(
                new Date(flight.StartDate),
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
                    <p className="font-bold">
                      {item.Leg ? "Chiều về" : "Chiều đi"}
                    </p>
                    <p className="text-sm text-gray-500">{startDateLocale}</p>
                  </div>
                  <div className="flex my-3 item-start items-center text-left space-x-3">
                    <DisplayImage
                      imagePath={`assets/images/airline/${flight.Airline.toLowerCase()}.gif`}
                      width={80}
                      height={24}
                      alt={"AirLine"}
                      classStyle={"max-w-16 md:max-w-20 max-h-10"}
                    />
                    <div>
                      <h3 className="text-sm md:text-18 font-semibold mb-1">
                        {flight.Airline}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {flight.FlightNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-center mt-3 flex justify-between">
                    <div className="flex items-center justify-between gap-4 w-full">
                      <div className="flex flex-col items-center">
                        <span className="text-sm">
                          {formatTime(flight.StartDate)}
                        </span>
                        <span className="bg-gray-200 px-2 py-[2px] rounded-sm text-sm mt-1">
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
                            {formatNumberToHoursAndMinutesFlight(
                              durationFlight
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
                        <span className="text-sm">
                          {formatTime(flight.EndDate)}
                        </span>
                        <span className="bg-gray-200 px-2 py-[2px] rounded-sm text-sm mt-1">
                          {flight.EndPoint}
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
                      {item.totalPrice.toLocaleString("vi-VN")}đ x{" "}
                      {item.quantity}
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
                        {item.totalTax.toLocaleString("vi-VN")}đ x{" "}
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between pb-4">
                <span className="text-sm text-gray-500 ">Hành lý bổ sung</span>
                <p className="font-semibold">
                  {totalBaggages.price && totalBaggages.quantity
                    ? `${totalBaggages.price.toLocaleString("vi-VN")}đ x ${
                        totalBaggages.quantity
                      }`
                    : "0đ"}
                </p>
              </div>
              <div className="flex pt-4 justify-between border-t border-t-gray-200">
                <span className=" text-gray-700 font-bold">Tổng cộng</span>
                <p className="font-bold text-primary">
                  {finalPrice.toLocaleString("vi-VN")} vnđ
                </p>
              </div>
            </div>
          </div>
          {/* <div className="hidden md:block pb-0 py-4 px-3 lg:px-6">
            <LoadingButton
              isLoading={loading}
              text="Thanh toán"
              disabled={false}
            />
          </div> */}
        </div>
      </div>
      {flightsDetail.length > 0 && (
        <FlightDetailPopup
          airports={airportsData}
          tabs={[{ id: 1, name: "Chi tiết hành trình" }]}
          flights={flightsDetail}
          isOpen={showFlightDetail}
          onClose={handleClosePopupFlightDetail}
        />
      )}
    </form>
  );
}
