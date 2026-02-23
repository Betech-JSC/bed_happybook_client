"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@/components/base/LoadingButton";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  CheckOutHotelSchema,
  CheckOutHotelType,
} from "@/schemaValidations/CheckOutHotel.schema";
import Image from "next/image";
import DatePicker, { registerLocale } from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import { BookingProductApi } from "@/api/BookingProduct";
import { useRouter } from "next/navigation";
import {
  decodeHtml,
  handleSessionStorage,
  renderTextContent,
} from "@/utils/Helper";
import { translateText } from "@/utils/translateApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { datePickerLocale } from "@/constants/language";
import { toastMessages, validationMessages } from "@/lib/messages";
import DisplayPriceWithDiscount from "@/components/base/DisplayPriceWithDiscount";
import DisplayPrice from "@/components/base/DisplayPrice";
import VoucherProgram from "@/components/product/components/VoucherProgram";
import { useUser } from "@/contexts/UserContext";
import { useVoucherManager } from "@/hooks/useVoucherManager";
import { HttpError } from "@/lib/error";
import GenerateInvoiceForm from "@/components/form/GenerateInvoiceForm";
import PhoneInput from "@/components/form/PhoneInput";

export default function FormCheckOut({ data, room, detail }: any) {
  const { userInfo } = useUser();
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabledForm, setDisabledForm] = useState<boolean>(true);
  const router = useRouter();
  const [translatedContent, setTranslatedContent] = useState<any>([]);
  const { language } = useLanguage();
  const messages = validationMessages[language as "vi" | "en"];
  const toaStrMsg = toastMessages[language as "vi" | "en"];
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
  } = useVoucherManager("hotel");

  const [schemaForm, setSchemaForm] = useState(() =>
    CheckOutHotelSchema(messages, generateInvoice)
  );

  useEffect(() => {
    if (datePickerLocale[language]) {
      registerLocale(language, datePickerLocale[language]);
    }
  }, [language]);

  useEffect(() => {
    translateText(
      [
        renderTextContent(data?.hotel?.policy),
        renderTextContent(data?.hotel?.information),
      ],
      language
    ).then((data) => {
      data.map((text: string, index: number) => {
        data[index] = decodeHtml(text);
      });
      setTranslatedContent(data);
    });
  }, [data, language]);

  useEffect(() => {
    setSchemaForm(CheckOutHotelSchema(messages, generateInvoice));
  }, [generateInvoice, messages]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<CheckOutHotelType>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      full_name: userInfo?.name,
      phone: userInfo?.phone?.toString(),
      email: userInfo?.email,
      checkBoxGenerateInvoice: false,
    },
  });

  const onSubmit = async (dataForm: CheckOutHotelType) => {
    try {
      setLoading(true);

      const formatData = {
        is_invoice: generateInvoice,
        product_id: data.id,
        booking: {
          checkin_date: format(dataForm.check_in_date, "dd/MM/yyyy"),
          checkout_date: format(dataForm.check_out_date, "dd/MM/yyyy"),
          number_adult: dataForm.atd,
          number_child: dataForm.chd,
          number_baby: dataForm.inf,
          room_id: room.id,
        },
        contact: {
          email: dataForm.email,
          full_name: dataForm.full_name,
          gender: "male",
          phone: dataForm.phone,
          note: dataForm.note ? dataForm.note : "",
        },
        invoice: dataForm.invoice,
        customer_id: userInfo?.id,
        voucher_program_ids: voucherProgramIds,
      };
      if (!generateInvoice) {
        delete formatData.invoice;
      }
      const respon = await BookingProductApi.Hotel(formatData);
      if (respon?.status === 200) {
        reset();
        toast.success(toaStrMsg.sendSuccess);
        handleSessionStorage("save", "bookingData", respon?.payload?.data);

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

  const checkInDate = watch("check_in_date");
  const checkOutDate = watch("check_out_date");
  return (
    <Fragment>
      <div className="w-full md:w-7/12 lg:w-8/12 mt-4 md:mt-0 rounded-2xl">
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
        <div className="mt-4">
          <form className="rounded-xl" onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white py-4 px-6 rounded-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center border border-gray-300 rounded-md pl-4">
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
                        htmlFor="check_in_date"
                        className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                      >
                        <span data-translate="true">Ngày nhận phòng</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="pt-6 pb-2 pr-2 w-full">
                        <Controller
                          name={`check_in_date`}
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              id={`check_in_date`}
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
                              placeholderText="Chọn ngày nhận phòng"
                              dateFormat="dd-MM-yyyy"
                              dropdownMode="select"
                              minDate={new Date()}
                              maxDate={
                                checkOutDate
                                  ? new Date(checkOutDate.getTime() - 86400000)
                                  : undefined
                              }
                              locale={language}
                              wrapperClass="w-full"
                              className="text-sm pl-4 w-full placeholder-gray-400 focus:outline-none border-none focus:border-primary"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  {errors.check_in_date && (
                    <p className="text-red-600">
                      {errors.check_in_date.message}
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex items-center border border-gray-300 rounded-md pl-4 space-x-2">
                    <div>
                      <Image
                        src="/icon/place.svg"
                        alt="Icon"
                        className="h-5"
                        width={20}
                        height={20}
                      />
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="check_out_date"
                        className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                      >
                        <span data-translate="true">Ngày trả phòng</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex justify-between items-end pt-6 pb-2 pr-2 w-full rounded-md">
                        <Controller
                          name={`check_out_date`}
                          control={control}
                          render={({ field }) => (
                            <DatePicker
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
                              placeholderText="Chọn ngày trả phỏng"
                              dateFormat="dd-MM-yyyy"
                              dropdownMode="select"
                              minDate={
                                checkInDate
                                  ? new Date(checkInDate.getTime() + 86400000)
                                  : new Date()
                              }
                              locale={language}
                              className="text-sm pl-4 w-full placeholder-gray-400 focus:outline-none border-none  focus:border-primary"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  {errors.check_out_date && (
                    <p className="text-red-600">
                      {errors.check_out_date.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="relative">
                  <label
                    htmlFor="atd"
                    className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                    data-translate="true"
                  >
                    Người lớn
                  </label>
                  <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                    <input
                      {...register("atd")}
                      id="atd"
                      type="number"
                      defaultValue={1}
                      placeholder="Nhập số lượng người lớn"
                      className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-3.5"
                    ></input>
                  </div>
                  {errors.atd && (
                    <p className="text-red-600">{errors.atd.message}</p>
                  )}
                </div>
                <div className="relative">
                  <label
                    htmlFor="chd"
                    className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                    data-translate="true"
                  >
                    Trẻ em (2-12 tuổi)
                  </label>
                  <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                    <input
                      {...register("chd")}
                      id="chd"
                      type="number"
                      defaultValue={0}
                      placeholder="Nhập số lượng trẻ em"
                      className="text-sm w-full rounded-md placeholder-gray-400 outline-none indent-3.5"
                    ></input>
                  </div>
                  {errors.chd && (
                    <p className="text-red-600">{errors.chd.message}</p>
                  )}
                </div>
                <div className="relative">
                  <label
                    htmlFor="inf"
                    className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                    data-translate="true"
                  >
                    Em bé {"(< 2 tuổi)"}
                  </label>
                  <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                    <input
                      {...register("inf")}
                      id="inf"
                      type="number"
                      defaultValue={0}
                      placeholder="Nhập số lượng em bé"
                      className="text-sm w-full rounded-md placeholder-gray-400 outline-none indent-3.5"
                    ></input>
                  </div>
                  {errors.inf && (
                    <p className="text-red-600">{errors.inf.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-18 font-bold" data-translate="true">
                Thông tin liên hệ
              </p>
              <div className="mt-4 bg-white py-4 px-6 rounded-xl">
                <div className="mt-4 w-full">
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
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                            />
                          )}
                        />
                    <div className="relative">
                      <label
                        htmlFor="email"
                        className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                      >
                        Email <span className="text-red-500">*</span>
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
                {translatedContent?.[0] && (
                  <div className="mt-6 py-4 px-6 bg-gray-100 rounded-lg">
                    <p
                      className="text-18 text-blue-700 font-bold"
                      data-translate="true"
                    >
                      Chính sách
                    </p>
                    <div
                      className="mt-2"
                      dangerouslySetInnerHTML={{
                        __html: translatedContent[0],
                      }}
                    ></div>
                  </div>
                )}
                {translatedContent?.[1] && (
                  <div className="mt-6 py-4 px-6 bg-gray-100 rounded-lg">
                    <p
                      className="text-18 text-blue-700 font-bold"
                      data-translate="true"
                    >
                      Thông tin quan trọng
                    </p>
                    <div
                      className="mt-2"
                      dangerouslySetInnerHTML={{
                        __html: translatedContent[1],
                      }}
                    ></div>
                  </div>
                )}

                <div className="flex space-x-2 mt-3 items-center">
                  <input
                    type="checkbox"
                    id="checkbox1"
                    className="w-4 h-4"
                    onClick={() => {
                      setDisabledForm(!disabledForm);
                    }}
                  />
                  <div>
                    <label
                      htmlFor="checkbox1"
                      className="text-sm"
                      data-translate="true"
                    >
                      Tôi xác nhận đã đọc và chấp nhận.{" "}
                    </label>
                    <Link
                      href="/thong-tin-chung/dieu-khoan-su-dung"
                      target="_blank"
                      className="text-blue-700 font-bold"
                      data-translate="true"
                    >
                      Điều khoản sử dụng
                    </Link>
                  </div>
                </div>
              </div>
              <LoadingButton
                style={`mt-6 ${
                  disabledForm ? "bg-gray-400 !cursor-not-allowed" : ""
                }`}
                isLoading={loading}
                text="Gửi yêu cầu"
                disabled={disabledForm}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="w-full md:w-5/12 lg:w-4/12 bg-white rounded-2xl">
        <div className="overflow-hidden rounded-t-2xl">
          <Image
            className="cursor-pointer w-full h-60 md:h-40 lg:h-[230px] rounded-t-2xl hover:scale-110 ease-in duration-300"
            src={`${detail.image_url}/${detail.image_location}`}
            alt="Image"
            width={410}
            height={230}
            sizes="100vw"
          />
        </div>

        <div className="py-4 px-3 lg:px-6">
          <p
            data-translate="true"
            className="text-xl lg:text-2xl font-bold hover:text-primary duration-300 transition-colors text-blue-700 "
          >
            {renderTextContent(detail.name)}
          </p>
          <div className="mt-2 flex space-x-1">
            {Array.from({ length: 5 }, (_, index) =>
              detail.rating !== undefined && index < detail.rating ? (
                <Image
                  key={index}
                  className="w-4 h-4"
                  src="/icon/starFull.svg"
                  alt="Icon"
                  width={10}
                  height={10}
                />
              ) : (
                <Image
                  key={index}
                  className="w-4 h-4"
                  src="/icon/star.svg"
                  alt="Icon"
                  width={10}
                  height={10}
                />
              )
            )}
          </div>
          <p className="mt-4 text-18 font-bold leading-6" data-translate="true">
            {renderTextContent(room.name)}
          </p>
          {detail.hotel.amenity_service.length > 0 && (
            <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 list-disc pl-4 leading-6">
              {detail.hotel.amenity_service.map((item: any) => (
                <li key={item.id} data-translate="true">
                  {renderTextContent(item.hotel_amenity_service.name)}
                </li>
              ))}
            </ul>
          )}
          <div className="pt-4 border-t">
            <VoucherProgram
              totalPrice={room.price - room.discount_price}
              onApplyVoucher={handleApplyVoucher}
              vouchersData={vouchersData}
              voucherErrors={voucherErrors}
              currency={detail?.currency?.code ?? "VND"}
              onSearch={handleSearch}
              isSearching={searchingVouchers}
            />
          </div>
          <div className="border-t border-solid border-gray-200 text-end pt-4 rounded-lg mt-5">
            {totalDiscount > 0 ? (
              <DisplayPriceWithDiscount
                price={room.price - room.discount_price}
                totalDiscount={totalDiscount}
                currency={detail?.currency}
              />
            ) : (
              <div className="w-full flex justify-between text-end">
                <span className="font-medium">Tổng cộng</span>
                <DisplayPrice
                  textPrefix={""}
                  price={room.price - room.discount_price}
                  currency={detail?.currency}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
