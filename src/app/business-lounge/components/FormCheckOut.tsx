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
import { useLanguage } from "@/contexts/LanguageContext";
import { toastMessages, validationMessages } from "@/lib/messages";
import { handleSessionStorage, renderTextContent } from "@/utils/Helper";
import DatePicker, { registerLocale } from "react-datepicker";
import { datePickerLocale } from "@/constants/language";
import { isEmpty } from "lodash";
import { format, parse } from "date-fns";
import DisplayPrice from "@/components/base/DisplayPrice";
import { useUser } from "@/contexts/UserContext";
import { useVoucherManager } from "@/hooks/useVoucherManager";
import VoucherProgram from "@/components/product/components/VoucherProgram";
import { HttpError } from "@/lib/error";
import DisplayPriceWithDiscount from "@/components/base/DisplayPriceWithDiscount";
import { vi, enUS } from "date-fns/locale";
import { useTranslation } from "@/hooks/useTranslation";
import GenerateInvoiceForm from "@/components/form/GenerateInvoiceForm";
import PhoneInput from "@/components/form/PhoneInput";
import {
  CheckOutYachtSchema,
  CheckOutYachtType,
} from "@/schemaValidations/checkOutYacht";

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
  const { t } = useTranslation();
  const { userInfo } = useUser();
  const router = useRouter();
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const messages = validationMessages[language as "vi" | "en"];
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [errTicketOption, setErrTicketOption] = useState<string>("");

  const {
    totalDiscount,
    voucherProgramIds,
    voucherErrors,
    vouchersData,
    searchingVouchers,
    setVoucherErrors,
    handleApplyVoucher,
    handleSearch,
  } = useVoucherManager("business-lounge");

  const yachtOptionSelected = useMemo(() => {
    return product?.business_lounge?.options.find(
      (item: any) => item.id === ticketOptionId,
    );
  }, [product, ticketOptionId]);

  const [schemaForm, setSchemaForm] = useState(() =>
    CheckOutYachtSchema(messages, generateInvoice),
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
  const daysOpeningRaw = product?.business_lounge?.opening_days;
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
  const rawOpeningTime = product?.business_lounge?.opening_time;
  let displayTimeOpening = rawOpeningTime ?? "";
  if (rawOpeningTime) {
    try {
      let parsed = parse(rawOpeningTime, "HH:mm:ss", new Date());
      if (isNaN(parsed.getTime())) {
        parsed = parse(rawOpeningTime, "HH:mm", new Date());
      }
      if (!isNaN(parsed.getTime())) {
        displayTimeOpening = format(parsed, "HH:mm");
      }
    } catch {
      displayTimeOpening = rawOpeningTime;
    }
  }

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
    setSchemaForm(CheckOutYachtSchema(messages, generateInvoice));
  }, [generateInvoice, messages]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CheckOutYachtType>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      full_name: userInfo?.name,
      phone: userInfo?.phone?.toString(),
      email: userInfo?.email,
      gender: userInfo && userInfo?.gender === 0 ? "female" : "male",
      checkBoxGenerateInvoice: false,
      depart_date: searchParams.get("departDate")
        ? new Date(searchParams.get("departDate") ?? "")
        : new Date(),
    },
  });

  const onSubmit = async (data: CheckOutYachtType) => {
    const isSelectedTicketOption = tickets.find(
      (item: any) => item.quantity > 0,
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
      const ticketsBooking = tickets.map((item: any) => ({
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
        customer_id: userInfo?.id,
        voucher_program_ids: voucherProgramIds,
      };
      if (!generateInvoice) {
        delete formatData.invoice;
      }
      const respon = await BookingProductApi.BusinessLounge(formatData);
      if (respon?.status === 200) {
        reset();
        toast.success(toaStrMsg.sendSuccess);

        const responseData = respon?.payload?.data || {};
        const enrichedData = {
          ...responseData,
          full_name: responseData.full_name || data.full_name,
          phone: responseData.phone || data.phone,
          email: responseData.email || data.email,
          gender: responseData.gender || data.gender,
          note: responseData.note || data.note || "",
          booking: {
            ...responseData.booking,
            tickets: tickets
              .filter((t: Ticket) => t.quantity > 0)
              .map((t: Ticket) => ({
                id: t.id,
                quantity: t.quantity,
                name: t.title,
                price: t.price,
              })),
          },
          product: responseData.product || {
            id: product?.id,
            name: product?.name,
            image_url: product?.image_url,
            image_location:
              product?.image_location || product?.gallery?.[0]?.image_location,
            currency: product?.currency,
          },
        };

        handleSessionStorage("save", "bookingData", enrichedData);

        setTimeout(() => {
          router.push("/thong-tin-dat-hang");
        }, 1500);
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

  const updateCount = (id: number, delta: number) => {
    setErrTicketOption("");
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === id) {
          const newQty = Math.max(ticket.minQty, ticket.quantity + delta);
          return { ...ticket, quantity: newQty };
        }
        return ticket;
      }),
    );
  };

  const totalPrice = tickets.reduce(
    (sum, ticket) => sum + ticket.quantity * ticket.price,
    0,
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
          <h3 className="text-22 py-4 px-8 font-semibold text-white">
            {t("Thông tin đơn hàng")}
          </h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-b-2xl p-4 lg:p-8">
            <div>
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/icon/calendar.svg"
                      alt="Lịch"
                      width={18}
                      height={18}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800" data-translate="true">
                    {t("Ngày sử dụng")}
                  </h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Controller
                    name="depart_date"
                    control={control}
                    render={({ field }) => (
                      <div className="relative group">
                        <label
                          className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs text-gray-500"
                          htmlFor="depart_date"
                        >
                          <span data-translate={true}>
                            {t("Chọn ngày")}
                          </span>
                          <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <DatePicker
                          id="depart_date"
                          dateFormat={"dd/MM/yyyy"}
                          className="text-sm w-full border border-gray-200 rounded-xl pt-6 pb-2.5 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 indent-3.5 transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                          selected={field.value}
                          onChange={(date: Date | null) => {
                            if (date) {
                              field.onChange(date);
                            }
                          }}
                          minDate={new Date()}
                          locale={
                            datePickerLocale[
                            language as keyof typeof datePickerLocale
                            ]
                          }
                        />
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="my-5 border-t border-dashed border-gray-200" />

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 9.5V7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V9.5C20.6193 9.5 19.5 10.6193 19.5 12C19.5 13.3807 20.6193 14.5 22 14.5V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V14.5C3.38071 14.5 4.5 13.3807 4.5 12C4.5 10.6193 3.38071 9.5 2 9.5Z" stroke="#F27145" strokeWidth="1.5" />
                      <path d="M10 5V19" stroke="#F27145" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800" data-translate="true">
                    {t("Chọn loại vé")}
                  </h3>
                </div>

                {errTicketOption && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-red-600 text-sm font-medium">{errTicketOption}</p>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  {tickets.map((ticket: Ticket) => (
                    <div
                      key={ticket.id}
                      className={`relative flex items-center justify-between border rounded-xl p-4 transition-all duration-200 ${ticket.quantity > 0
                        ? "border-blue-400 bg-blue-50/40 shadow-sm"
                        : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-white"
                        }`}
                    >
                      {/* Left side: ticket info */}
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-800" data-translate="true">
                            {ticket.title}
                          </p>
                          {ticket.quantity > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              ✓ {t("Đã chọn")}
                            </span>
                          )}
                        </div>
                        {ticket.description && (
                          <p
                            className="text-gray-500 text-sm mt-1 line-clamp-2"
                            data-translate="true"
                          >
                            {ticket.description}
                          </p>
                        )}
                        <div className="mt-2">
                          <DisplayPrice
                            className="!font-bold !text-base text-primary"
                            price={ticket.price}
                            currency={product?.currency}
                          />
                          <span className="text-xs text-gray-400 ml-1" data-translate="true">/ {t("khách")}</span>
                        </div>
                      </div>

                      {/* Right side: quantity controls */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          disabled={ticket.quantity <= ticket.minQty}
                          onClick={() => updateCount(ticket.id, -1)}
                          className={`w-9 h-9 flex items-center justify-center rounded-xl text-lg font-medium transition-all duration-200 ${ticket.quantity > ticket.minQty
                            ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:scale-95 shadow-sm"
                            : "bg-gray-100 border border-gray-200 text-gray-300 cursor-not-allowed"
                            }`}
                        >
                          −
                        </button>
                        <span className={`w-10 text-center font-bold text-lg ${ticket.quantity > 0 ? "text-blue-600" : "text-gray-400"
                          }`}>
                          {ticket.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCount(ticket.id, 1)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-600 text-white text-lg font-medium hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-dashed border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="#16A34A" strokeWidth="1.5" />
                    <path d="M20 20C20 17.7909 16.4183 16 12 16C7.58172 16 4 17.7909 4 20" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800" data-translate="true">
                  {t("Thông tin liên hệ")}
                </h3>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="relative">
                    <label
                      htmlFor="full_name"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-translate={true}>{t("Họ và tên")}</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="full_name"
                      type="text"
                      title="Nhập họ và tên"
                      {...register("full_name")}
                      placeholder="Nhập họ và tên"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
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
                      <span data-translate={true}>{t("Giới tính")}</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      {...register("gender")}
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 focus:outline-none focus:border-primary indent-3.5 bg-white"
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
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          id="phone"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Nhập số điện thoại"
                          error={errors.phone?.message}
                          defaultCountry="VN"
                          label="Số điện thoại"
                          required
                        />
                      )}
                    />
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
              <GenerateInvoiceForm
                register={register}
                errors={errors}
                generateInvoice={generateInvoice}
                setGenerateInvoice={setGenerateInvoice}
              />
            </div>
            <LoadingButton
              style="mt-6"
              isLoading={loading}
              text="Thanh toán"
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
                alt="Thời gian"
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
                alt="Địa điểm"
                width={18}
                height={18}
              />
              <span data-translate="true">
                {renderTextContent(product?.business_lounge?.address)}
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
          <div className="pt-4 border-t">
            <VoucherProgram
              totalPrice={totalPrice}
              onApplyVoucher={handleApplyVoucher}
              vouchersData={vouchersData}
              voucherErrors={voucherErrors}
              currency={product?.currency?.code ?? "VND"}
              onSearch={handleSearch}
              isSearching={searchingVouchers}
            />
          </div>
          <div className="mt-4">
            {totalDiscount > 0 ? (
              <DisplayPriceWithDiscount
                price={totalPrice}
                totalDiscount={totalDiscount}
                currency={product?.currency}
              />
            ) : (
              totalPrice > 0 && (
                <div className="w-full flex justify-between">
                  <DisplayPrice
                    textPrefix={"Tổng cộng"}
                    price={totalPrice}
                    currency={product?.currency}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
