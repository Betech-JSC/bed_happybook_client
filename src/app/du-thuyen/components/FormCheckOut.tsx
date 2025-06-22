"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@/components/base/LoadingButton";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { BookingProductApi } from "@/api/BookingProduct";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { toastMessages, validationMessages } from "@/lib/messages";
import {
  checkOutAmusementTicketSchema,
  checkOutAmusementTicketType,
} from "@/schemaValidations/checkOutAmusementTicket";
import { renderTextContent } from "@/utils/Helper";
import DatePicker, { registerLocale } from "react-datepicker";
import { datePickerLocale } from "@/constants/language";
import { isEmpty } from "lodash";
import { format, parse } from "date-fns";
import DisplayPrice from "@/components/base/DisplayPrice";

interface Ticket {
  id: number;
  title: string;
  description: string;
  price: number;
  name: string;
  minQty: number;
  quantity: number;
}

export default function CheckOutForm({
  product,
  ticketOptionId,
}: {
  product: any;
  ticketOptionId: number;
}) {
  const router = useRouter();
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const messages = validationMessages[language as "vi" | "en"];
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [errTicketOption, setErrTicketOption] = useState<string>("");
  const [schemaForm, setSchemaForm] = useState(() =>
    checkOutAmusementTicketSchema(messages, generateInvoice)
  );
  const dayMap: Record<string, string> = {
    monday: "Thứ Hai",
    tuesday: "Ba",
    wednesday: "Tư",
    thursday: "Năm",
    friday: "Sáu",
    saturday: "Bảy",
    sunday: "Chủ nhật",
  };
  const daysOpeningRaw = product?.yacht?.opening_days;
  const daysOpening = Array.isArray(daysOpeningRaw)
    ? daysOpeningRaw
    : typeof daysOpeningRaw === "string"
    ? JSON.parse(daysOpeningRaw)
    : [];
  const isFullWeek = daysOpening.length === 7;
  const displayDaysOpening = isFullWeek
    ? "Mỗi ngày"
    : daysOpening
        .map((day: any) => dayMap[day])
        .filter(Boolean)
        .join(", ");
  const parsedTimeOpening = parse(
    product?.yacht?.opening_time,
    "HH:mm:ss",
    new Date()
  );
  const displayTimeOpening = format(parsedTimeOpening, "HH:mm");

  useEffect(() => {
    if (product?.ticket_prices) {
      const initialTickets: Ticket[] = [...product.ticket_prices]
        .sort((a, b) => {
          return (b?.day_price || 0) - (a?.day_price || 0);
        })
        .map((item: any, index: number) => ({
          id: item.id,
          title: item?.type?.name || "",
          description: item?.type?.description || "",
          price: item?.day_price || 0,
          name: `number_${item.id}`,
          minQty: 0,
          quantity: index ? 0 : 1,
        }));

      setTickets(initialTickets);
    }
  }, [product?.ticket_prices]);

  useEffect(() => {
    setSchemaForm(checkOutAmusementTicketSchema(messages, generateInvoice));
  }, [generateInvoice, messages]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<checkOutAmusementTicketType>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      checkBoxGenerateInvoice: false,
      depart_date: searchParams.get("departDate")
        ? new Date(searchParams.get("departDate") ?? "")
        : new Date(),
    },
  });

  const onSubmit = async (data: checkOutAmusementTicketType) => {
    const isSelectedTicketOption = tickets.find(
      (item: any) => item.quantity > 0
    );
    if (isEmpty(isSelectedTicketOption)) {
      setErrTicketOption("Vui lòng chọn ít nhất 1 loại vé");
      toast.error(toaStrMsg.formNotValid);
      return;
    } else {
      setErrTicketOption("");
    }
    try {
      setLoading(true);
      const ticketsBooking = tickets.map((item: any, index: number) => ({
        id: item.id,
        quantity: item.quantity,
      }));
      const formatData = {
        is_invoice: generateInvoice,
        product_id: product?.id,
        booking: {
          departure_date: format(data.depart_date, "yyyy-MM-dd"),
          ticket_option_id: ticketOptionId,
          tickets: ticketsBooking,
        },
        contact: {
          email: data.email,
          full_name: data.full_name,
          gender: data.gender,
          phone: data.phone,
          note: data.note ? data.note : "",
        },
        invoice: data.invoice,
      };
      if (!generateInvoice) {
        delete formatData.invoice;
      }
      const respon = await BookingProductApi.Yacht(formatData);
      if (respon?.status === 200) {
        reset();
        toast.success(toaStrMsg.sendSuccess);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        toast.error(toaStrMsg.sendFailed);
      }
    } catch (error: any) {
      toast.error(toaStrMsg.error);
    } finally {
      setLoading(false);
    }
  };

  const updateCount = (id: number, delta: number) => {
    setErrTicketOption("");
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === id) {
          const newQty = Math.max(ticket.minQty, ticket.quantity + delta);
          return { ...ticket, quantity: newQty };
        }
        return ticket;
      })
    );
  };

  const totalPrice = tickets.reduce(
    (sum, ticket) => sum + ticket.quantity * ticket.price,
    0
  );
  return (
    <div className="flex flex-col-reverse items-start lg:flex-row lg:space-x-8 lg:mt-4 pb-8">
      <div className="w-full lg:w-8/12 mt-4 lg:mt-0 rounded-2xl">
        <div
          className="rounded-t-xl"
          style={{
            background:
              "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
          }}
        >
          <h3
            className="text-22 py-4 px-8 font-semibold text-white"
            data-translate="true"
          >
            Thông tin đơn hàng
          </h3>
        </div>

        <form className="rounded-xl mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white p-4 rounded-xl">
            <div className="w-full mb-3">
              <div className="flex items-center border border-gray-300 rounded-md pl-4 space-x-2">
                <div>
                  <Image
                    src="/icon/calendar.svg"
                    alt="Icon"
                    className="h-5"
                    width={20}
                    height={20}
                  />
                </div>
                <div className="relative w-full">
                  <label
                    htmlFor="depart_date"
                    className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    <span data-translate="true">Ngày tham quan</span>
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  {/* <div className="w-1/2 pt-6 pb-2 pr-2 rounded-md">
                    <input
                      type="text"
                      {...register("depart_date")}
                      className="indent-4 outline-none"
                      readOnly
                    />
                  </div> */}
                  <div className="[&>div]:w-full pt-6 pb-2 pr-2 w-full rounded-md">
                    <Controller
                      name={`depart_date`}
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          id={`depart_date`}
                          selected={field.value || null}
                          onChange={() => {}}
                          // onChange={(date: Date | null) => field.onChange(date)}
                          // onChangeRaw={(event) => {
                          //   if (event) {
                          //     const target = event.target as HTMLInputElement;
                          //     if (target.value) {
                          //       target.value = target.value
                          //         .trim()
                          //         .replace(/\//g, "-");
                          //     }
                          //   }
                          // }}
                          readOnly
                          placeholderText="Chọn ngày khởi hành"
                          dateFormat="dd-MM-yyyy"
                          dropdownMode="select"
                          minDate={new Date()}
                          className="text-sm pl-4 !w-full placeholder-gray-400 focus:outline-none border-none focus:border-primary"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              {errors.depart_date && (
                <p className="text-red-600">{errors.depart_date.message}</p>
              )}
            </div>
            <p
              className="text-blue-700 text-base font-medium"
              data-translate="true"
            >
              {product?.name}
            </p>
            <div className="mt-1">
              {tickets.map(
                (ticket, index: number) =>
                  ticket.price > 0 && (
                    <div
                      key={index}
                      className="flex space-x-2 justify-between items-start py-4 border-b last:border-none"
                    >
                      <div>
                        <div
                          className="font-semibold text-base"
                          data-translate="true"
                        >
                          {renderTextContent(ticket.title)}
                        </div>
                        <div
                          className="text-sm text-gray-500 mt-1"
                          data-translate="true"
                        >
                          {!isEmpty(ticket.description)
                            ? renderTextContent(ticket.description)
                            : ""}
                        </div>
                      </div>
                      <div className="flex items-start md:w-[30%] justify-between">
                        <div>
                          <DisplayPrice
                            className={`!text-base mr-4 text-black !font-normal`}
                            price={ticket.price}
                            currency={product?.currency}
                          />

                          <p
                            className="text-sm text-gray-500 mt-1"
                            data-translate="true"
                          >
                            Giá / Khách
                          </p>
                        </div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className={`w-6 h-6 font-medium text-xl rounded-sm border text-blue-700 bg-white border-blue-700 flex items-center justify-center
                          ${
                            ticket.quantity <= ticket.minQty
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          } `}
                            onClick={() => updateCount(ticket.id, -1)}
                            disabled={ticket.quantity <= ticket.minQty}
                          >
                            <span className="mb-1">-</span>
                          </button>
                          <span className="w-8 outline-none text-center text-18 text-blue-700 font-bold">
                            {ticket.quantity}
                          </span>

                          <button
                            type="button"
                            className={`w-6 h-6 text-xl font-medium rounded-sm border text-blue-700 bg-white border-blue-700 flex items-center justify-center 
                           ${
                             ticket.quantity >= 20
                               ? "cursor-not-allowed opacity-50"
                               : ""
                           }`}
                            onClick={() => updateCount(ticket.id, 1)}
                            disabled={ticket.quantity >= 20}
                          >
                            <span className="mb-1">+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )}
              {errTicketOption && (
                <p className="text-red-600 mt-2">{errTicketOption}</p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <p className="text-18 font-bold" data-translate="true">
              Thông tin liên hệ
            </p>
            <div className="mt-4 bg-white py-4 px-6 rounded-xl">
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="relative">
                  <label
                    htmlFor="fullName"
                    className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    <span data-translate="true">Họ và tên</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    {...register("full_name")}
                    placeholder="Nhập họ và tên"
                    title="Nhập họ và tên"
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                  />
                  {errors.full_name && (
                    <p className="text-red-600">{errors.full_name.message}</p>
                  )}
                </div>
                <div className="relative">
                  <label
                    htmlFor="gender"
                    className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    <span data-translate="true">Giới tính</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                    <select
                      id="gender"
                      className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                      {...register("gender")}
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
                  {errors.gender && (
                    <p className="text-red-600">{errors.gender.message}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                      {...register("phone")}
                      title="Nhập số điện thoại"
                      placeholder="Nhập số điện thoại"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                    />
                    {errors.phone && (
                      <p className="text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-tranlsate={true}>Email</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="text"
                      title="Nhập email"
                      {...register("email")}
                      placeholder="Nhập email"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                    />{" "}
                    {errors.email && (
                      <p className="text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <textarea
                  placeholder="Yêu cầu đặc biệt"
                  {...register("note")}
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
                  data-translate="true"
                >
                  Tôi muốn xuất hóa đơn
                </span>
              </div>
              {/* generateInvoice */}
              <div
                className={`mt-4   ${
                  generateInvoice ? "visible" : "invisible hidden"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label
                      htmlFor="GenerateInvoice_company_name"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-translate="true">Tên công ty </span>
                      <span className="text-red-500">*</span>
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
                      <span data-translate="true">Địa chỉ </span>
                      <span className="text-red-500">*</span>
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
                      <span data-translate="true">Thành phố </span>
                      <span className="text-red-500">*</span>
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
                      <span data-translate="true">Mã số thuế </span>
                      <span className="text-red-500">*</span>
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
                      <span data-translate="true">Người nhận hóa đơn </span>
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
                      <span data-translate="true">Số điện thoại </span>
                      <span className="text-red-500">*</span>
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
            </div>
            <LoadingButton
              style="mt-6"
              isLoading={loading}
              text="Gửi yêu cầu"
              disabled={loading}
            />
          </div>
        </form>
      </div>
      <div className="w-full lg:w-4/12 bg-white rounded-2xl">
        <div className="py-4 px-3 lg:px-6">
          <div className="pb-4 border-b border-gray-200">
            <h1
              className="text-2xl font-bold hover:text-primary duration-300 transition-colors"
              data-translate="true"
            >
              {product?.name}
            </h1>
            <div className="flex space-x-2 mt-2 items-start">
              <Image
                className="w-4 h-4 mt-1"
                src="/icon/clock.svg"
                alt="Icon"
                width={18}
                height={18}
              />
              <span data-translate="true">
                Mở {displayTimeOpening} | {displayDaysOpening}
              </span>
            </div>
            <div className="flex space-x-2 mt-3 items-start">
              <Image
                className="w-4 h-4 mt-1"
                src="/icon/marker-pin-01.svg"
                alt="Icon"
                width={18}
                height={18}
              />
              <span data-translate="true">
                {renderTextContent(product?.yacht?.address)}
              </span>
            </div>
            {tickets?.map((item: any) => (
              <div key={item.id} className="mt-2 flex justify-between">
                <span data-translate="true">{item.title}</span>
                <div className="font-bold text-sm flex gap-1">
                  <DisplayPrice
                    className={`!font-bold !text-sm text-black`}
                    price={item.price}
                    currency={product?.currency}
                  />
                  <span>{` x ${item.quantity}`}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <span data-translate="true">Tổng cộng</span>
            {totalPrice > 0 && (
              <DisplayPrice price={totalPrice} currency={product?.currency} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
