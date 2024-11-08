"use client";
import { FlightApi } from "@/api/Flight";
import { differenceInSeconds } from "date-fns";
import LoadingButton from "@/components/LoadingButton";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HttpError } from "@/lib/error";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datePicker.scss";
import { vi } from "date-fns/locale";

export default function FlightBookForm() {
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<any[]>([]);
  const [flightSession, setFlightSession] = useState<string | null>(null);
  const [documentReady, setDocumentReady] = useState<boolean>(false);
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
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FlightBookingInforType>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      atd: [{ gender: "", firstName: "", lastName: "" }],
      PaymentMethod: "",
      checkBoxGenerateInvoice: false,
    },
  });

  const onSubmit = (data: FlightBookingInforType) => {
    setLoading(true);
    const adtArr = data.atd.map((item) => ({ value: item, Type: "ATD" }));
    const chdArr = data.chd
      ? data.chd.map((item) => ({ value: item, Type: "CHD" }))
      : [];
    const infArr = data.inf
      ? data.inf.map((item) => ({ value: item, Type: "INF" }))
      : [];
    const passengers = [...adtArr, ...chdArr, ...infArr].reduce(
      (acc: any, item, index) => {
        acc.push({
          index: index,
          first_name: item.value.firstName,
          last_name: item.value.lastName,
          gender: item.value.gender === "male" ? true : false,
          type: item.Type,
          birthday: "1990-12-10",
          baggages: item.value.baggage,
        });
        return acc;
      },
      []
    );
    data.book_type = "book-normal";
    data.trip = flights.length > 1 ? "round_trip" : "one_way";
    const { atd, chd, inf, checkBoxGenerateInvoice, ...formatData } = data;
    let flightValueParams: any = [];
    flights.map((item, index) => {
      flightValueParams.push({ flight_value: item.ListFlight[0].FlightValue });
    });
    const fare_data = [
      {
        session: flightSession,
        fare_data_id_api: flights[0].FareDataId,
        AutoIssue: false,
        flights: flightValueParams,
      },
    ];
    formatData.contact.gender =
      formatData.contact.gender === "male" ? true : false;
    let finalData = {
      ...formatData,
      passengers,
      fare_data,
    };
    const bookFlight = async () => {
      try {
        setLoading(true);
        const respon = await FlightApi.bookFlight("book-flight", finalData);
        reset();
        toast.success("Gửi yêu cầu thành công!");
        setTimeout(() => {
          router.push("/ve-may-bay");
        }, 1500);
      } catch (error: any) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau");
      } finally {
        setLoading(false);
      }
    };
    if (finalData) {
      bookFlight();
    }

    // setTimeout(() => {
    //   // reset();
    //   toast.success("Gửi thành công!");
    //   setLoading(false);
    //   setTimeout(() => {
    //     router.push("/ve-may-bay");
    //   }, 1500);
    // }, 2000);
  };
  useEffect(() => {
    let flightData = [];
    const departFlight = sessionStorage.getItem("departFlight")
      ? JSON.parse(sessionStorage.getItem("departFlight") ?? "")
      : null;
    const returnFlight = sessionStorage.getItem("returnFlight")
      ? JSON.parse(sessionStorage.getItem("returnFlight") ?? "")
      : null;

    const flightSession = sessionStorage.getItem("flightSession") ?? null;
    if (departFlight) flightData.push(departFlight);
    if (returnFlight) flightData.push(returnFlight);

    if (!flightData.length || !flightSession) {
      router.push("/ve-may-bay");
    }

    setFlights(flightData);
    setFlightSession(flightSession);
    setDocumentReady(true);
  }, [router]);

  let totalPrice = 0;
  let totalAdt = 1;
  let totalChd = 0;
  let totalInf = 0;
  let totalPriceAdt = 1;
  let totalPriceChd = 0;
  let totalPriceInf = 0;
  let FareAdt: any = [];
  let FareChd: any = [];
  let FareInf: any = [];

  flights.map((item, index) => {
    totalPrice += item.TotalPrice;
    totalAdt = item.Adt > totalAdt ? item.Adt : totalAdt;
    totalChd = item.Chd > totalChd ? item.Chd : totalChd;
    totalInf = item.Inf > totalInf ? item.Inf : totalInf;
    totalPriceAdt += (item.FareAdt + item.TaxAdt) * item.Adt;
    totalPriceChd += (item.FareChd + item.TaxChd) * item.Chd;
    totalPriceInf += (item.FareInf + item.TaxInf) * item.Inf;
    FareAdt[index] = item.FareAdt + item.TaxAdt;
    FareChd[index] = item.FareChd + item.TaxChd;
    FareInf[index] = item.FareInf + item.TaxInf;
  });
  // Fetch and Handle Data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const params = {
  //         ListFareData: [
  //           {
  //             Session: flightSession,
  //             FareDataId: flights[0].FareDataId,
  //             ListFlight: [
  //               {
  //                 FlightValue: flights[0].ListFlight[0].FlightValue,
  //               },
  //             ],
  //           },
  //         ],
  //       };
  //       console.log(params);
  //       const response = await FlightApi.getBaggage(
  //         "flights/getbaggage",
  //         params
  //       );

  //       const listFareData = response?.payload.data.ListFareData ?? [];
  //     } catch (error: any) {
  //       if (error instanceof HttpError) {
  //         if (error.payload.code === 400) {
  //           // alert("");
  //           // router.push("/ve-may-bay");
  //         }
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [flightSession, flights]);

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
            {totalAdt > 0 &&
              Array.from({ length: totalAdt }, (_, index) => (
                <div key={index} className="mb-3">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <span className="text-22 font-semibold px-4">
                      {index + 1}. người lớn
                    </span>
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
                      {errors.atd?.[index]?.lastName && (
                        <p className="text-red-600">
                          {errors.atd[index].lastName?.message}
                        </p>
                      )}
                    </div>
                    {/* <div className="relative">
                      <label
                        htmlFor="service"
                        className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                      >
                        Ngày sinh <span className="text-red-500">*</span>
                      </label>
                      <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                        <DatePicker
                          selected={
                            getValues(`atd.${index}.birthday`)
                              ? new Date(getValues(`atd.${index}.birthday`))
                              : null
                          }
                          onChange={(date: Date | null) => {
                            if (date) {
                              const formattedDate = date
                                .toISOString()
                                .split("T")[0];
                              setValue(`atd.${index}.birthday`, formattedDate); // Cập nhật giá trị ngày trong form
                            } else {
                              setValue(`atd.${index}.birthday`, ""); // Nếu người dùng xóa, đặt thành chuỗi rỗng
                            }
                          }}
                          locale={vi}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Chọn ngày sinh"
                        />
                        <input
                          type="hidden"
                          {...register(`atd.${index}.birthday`)}
                        />
                      </div>
                      {errors.atd?.[index]?.birthday && (
                        <p className="text-red-600">
                          {errors.atd[index].birthday?.message}
                        </p>
                      )}
                    </div> */}
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
                        htmlFor="service"
                        className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                      >
                        Hành lý
                      </label>
                      <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                        <select
                          className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                          // {...register(`atd.${index}.baggage`)}
                        >
                          <option value="">Vui lòng chọn gói hành lý</option>
                          {/* <option value="male">Quý ông</option> */}
                          {/* <option value="female">Quý bà</option> */}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {totalChd > 0 &&
              Array.from({ length: totalChd }, (_, index) => (
                <div key={index} className="mb-3">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <span className="text-22 font-semibold px-4">
                      {index + 1}. trẻ em
                    </span>
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
                        htmlFor="service"
                        className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                      >
                        Hành lý
                      </label>
                      <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                        <select
                          // {...register(`chd.${index}.baggage`)}
                          className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                        >
                          <option value="">Vui lòng chọn gói hành lý</option>
                          {/* <option value="male">Quý ông</option> */}
                          {/* <option value="female">Quý bà</option> */}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {totalInf > 0 &&
              Array.from({ length: totalInf }, (_, index) => (
                <div key={index} className="mb-3">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <span className="text-22 font-semibold px-4">
                      {index + 1}. em bé
                    </span>
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
                        htmlFor="service"
                        className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                      >
                        Hành lý
                      </label>
                      <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                        <select
                          // {...register(`inf.${index}.baggage`)}
                          className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                        >
                          <option>Vui lòng chọn gói hành lý</option>
                          {/* <option value="male">Quý ông</option> */}
                          {/* <option value="female">Quý bà</option> */}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            <div className="mt-6 rounded-xl">
              <div className="text-22 font-semibold">Thông tin liên hệ</div>
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                        {...register(`GenerateInvoice.company_name`)}
                        placeholder="Nhập tên công ty"
                        className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                      />
                      {errors.GenerateInvoice?.company_name && (
                        <p className="text-red-600">
                          {errors.GenerateInvoice?.company_name?.message}
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
                        {...register(`GenerateInvoice.company_address`)}
                        className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                      />
                      {errors.GenerateInvoice?.company_address && (
                        <p className="text-red-600">
                          {errors.GenerateInvoice?.company_address?.message}
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
                        {...register(`GenerateInvoice.city`)}
                        className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                      />
                      {errors.GenerateInvoice?.city && (
                        <p className="text-red-600">
                          {errors.GenerateInvoice?.city?.message}
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
                        {...register(`GenerateInvoice.tax_code`)}
                        className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                      />
                      {errors.GenerateInvoice?.tax_code && (
                        <p className="text-red-600">
                          {errors.GenerateInvoice?.tax_code?.message}
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
                        {...register(`GenerateInvoice.recipient_name`)}
                        className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                      />
                      {errors.GenerateInvoice?.recipient_name && (
                        <p className="text-red-600">
                          {errors.GenerateInvoice?.recipient_name?.message}
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
                        {...register(`GenerateInvoice.phone`)}
                        className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                      />
                      {errors.GenerateInvoice?.phone && (
                        <p className="text-red-600">
                          {errors.GenerateInvoice?.phone?.message}
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
                        {...register(`GenerateInvoice.email`)}
                        className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                      />
                      {errors.GenerateInvoice?.email && (
                        <p className="text-red-600">
                          {errors.GenerateInvoice?.email?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-6">
                <span className="text-22 font-semibold">
                  Phương thức thanh toán
                </span>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex space-x-3 items-center">
                    <input
                      type="radio"
                      value="cash"
                      id="payment_cash"
                      {...register("PaymentMethod")}
                    />
                    <label htmlFor="payment_cash" className="flex space-x-3">
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
                    </label>
                  </div>
                  <div className="flex space-x-3 items-center">
                    <input
                      type="radio"
                      value="vnpay"
                      id="payment_vnpay"
                      {...register("PaymentMethod")}
                    />
                    <label htmlFor="payment_vnpay" className=" flex space-x-3">
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
                    </label>
                  </div>
                  <div className="flex space-x-3 items-center">
                    <input
                      type="radio"
                      value="bank_transfer"
                      id="payment_transfer"
                      {...register("PaymentMethod")}
                    />
                    <label
                      htmlFor="payment_transfer"
                      className=" flex space-x-3"
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
                        <span className="block">Chuyển khoản</span>
                        <button className="text-blue-700 underline">
                          Thông tin chuyển khoản
                        </button>
                      </div>
                    </label>
                  </div>
                  {errors.PaymentMethod && (
                    <p className="text-red-600">
                      {errors.PaymentMethod.message}
                    </p>
                  )}
                </div>
              </div>
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
            {flights.map((item, index) => {
              const flight = item.ListFlight[0];
              const durationFlight =
                differenceInSeconds(
                  new Date(flight.EndDate),
                  new Date(flight.StartDate)
                ) / 60;

              return (
                <div className="pb-0 py-4 px-3 lg:px-6" key={index}>
                  <div className="flex my-3 item-start items-center text-left space-x-3">
                    <Image
                      src={`/airline/${flight.Airline}.svg`}
                      width={48}
                      height={48}
                      alt="AirLine"
                      className="w-12 h-12"
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
                        <span className="text-lg font-semibold">
                          {formatTime(flight.EndDate)}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm">
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
              <p className="text-22 font-semibold">Thông tin thanh toán</p>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-500 ">
                  Người lớn (
                  {`${FareAdt.reduce(
                    (total: number, num: number) => total + num,
                    0
                  ).toLocaleString("vi-VN")} x ${totalAdt}`}
                  )
                </span>
                <p className="font-semibold">
                  {totalPriceAdt.toLocaleString("vi-VN")} vnđ
                </p>
              </div>
              {totalChd > 0 && (
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500 ">
                    Trẻ em (
                    {`${FareChd.reduce(
                      (total: number, num: number) => total + num,
                      0
                    ).toLocaleString("vi-VN")} x ${totalChd}`}
                    )
                  </span>
                  <p className="font-semibold">
                    {totalPriceChd.toLocaleString("vi-VN")} vnđ
                  </p>
                </div>
              )}
              {totalInf > 0 && (
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500 ">
                    Em bé (
                    {`${FareInf.reduce(
                      (total: number, num: number) => total + num,
                      0
                    ).toLocaleString("vi-VN")} x ${totalInf}`}
                    )
                  </span>
                  <p className="font-semibold">
                    {totalPriceInf.toLocaleString("vi-VN")} vnđ
                  </p>
                </div>
              )}
              <div className="flex justify-between mt-3">
                <span className="text-sm text-gray-500 ">Hành lý bổ sung</span>
                <p className="font-semibold">0 vnđ</p>
              </div>
              <div className="flex mt-4 pt-4 pb-6 justify-between border-t border-t-gray-200">
                <span className="text-sm text-gray-500 ">Tổng cộng</span>
                <p className="font-semibold text-primary">
                  {totalPrice.toLocaleString("vi-VN")} vnđ
                </p>
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
