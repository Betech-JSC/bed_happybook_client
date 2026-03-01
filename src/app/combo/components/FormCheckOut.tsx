"use client";
import {
  CheckOutTourSchema,
  CheckOutTourType,
} from "@/schemaValidations/checkOutTour.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@/components/base/LoadingButton";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BookingProductApi } from "@/api/BookingProduct";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { toastMessages, validationMessages } from "@/lib/messages";
import { datePickerLocale } from "@/constants/language";
import Link from "next/link";
import { handleSessionStorage, renderTextContent } from "@/utils/Helper";
import { formatCurrency } from "@/lib/formatters";
import VoucherProgram from "@/components/product/components/VoucherProgram";
import { useUser } from "@/contexts/UserContext";
import { useVoucherManager } from "@/hooks/useVoucherManager";
import DisplayPriceWithDiscount from "@/components/base/DisplayPriceWithDiscount";
import DisplayPrice from "@/components/base/DisplayPrice";
import { HttpError } from "@/lib/error";
import GenerateInvoiceForm from "@/components/form/GenerateInvoiceForm";
import PhoneInput from "@/components/form/PhoneInput";

export default function FormCheckOut({
  productId,
  detail,
}: {
  productId: number | string;
  detail: any;
}) {
  const { userInfo } = useUser();
  const router = useRouter();
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { language } = useLanguage();
  const messages = validationMessages[language as "vi" | "en"];
  const [schemaForm, setSchemaForm] = useState(() =>
    CheckOutTourSchema(messages, generateInvoice)
  );
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
  } = useVoucherManager("combo");

  useEffect(() => {
    if (datePickerLocale[language]) {
      registerLocale(language, datePickerLocale[language]);
    }
  }, [language]);

  useEffect(() => {
    setSchemaForm(CheckOutTourSchema(messages, generateInvoice));
  }, [generateInvoice, messages]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CheckOutTourType>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      full_name: userInfo?.name,
      phone: userInfo?.phone?.toString(),
      email: userInfo?.email,
      gender: userInfo && userInfo?.gender === 0 ? "female" : "male",
      checkBoxGenerateInvoice: false,
    },
  });
  const onSubmit = async (data: CheckOutTourType) => {
    try {
      setLoading(true);
      const formatData = {
        is_invoice: generateInvoice,
        product_id: productId,
        booking: {
          departure_date: format(data.depart_date, "dd/MM/yyyy"),
          number_adult: data.atd,
          number_child: data.chd,
          number_baby: data.inf,
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
      const respon = await BookingProductApi.Combo(formatData);
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
      if (error instanceof HttpError) {
        if (error?.payload?.errors) {
          if (error?.payload?.errors?.["voucher_programs"]) {
            setVoucherErrors(error?.payload?.errors["voucher_programs"]);
          }
        }
        toast.error(error?.payload?.message ?? toaStrMsg.inValidVouchers);
      } else {
        toast.error(toaStrMsg.error);
      }
    } finally {
      setLoading(false);
    }
  };
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
                  <div className="flex items-center border border-gray-300 rounded-md pl-4 space-x-2">
                    <div>
                      <Image
                        src="/icon/calendar.svg"
                        alt="Lịch"
                        className="h-5"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="relative">
                      <label
                        htmlFor="depart_date"
                        className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                      >
                        <span data-translate="true"> Ngày khởi hành</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex justify-between items-end pt-6 pb-2 pr-2 w-full rounded-md">
                        <Controller
                          name={`depart_date`}
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              id={`depart_date`}
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
                              placeholderText="Chọn ngày khởi hành"
                              dateFormat="dd-MM-yyyy"
                              dropdownMode="select"
                              locale={language}
                              minDate={new Date()}
                              className="text-sm pl-4 w-full placeholder-gray-400 focus:outline-none border-none  focus:border-primary"
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
                <div>
                  <div className="flex items-center border border-gray-300 rounded-md pl-4 space-x-2">
                    <div>
                      <Image
                        src="/icon/place.svg"
                        alt="Địa điểm"
                        className="h-5"
                        width={20}
                        height={20}
                      />
                    </div>

                    <div className="flex items-center w-full relative">
                      <label
                        htmlFor="service"
                        className="absolute top-0 left-0 h-4 translate-y-1 font-medium text-xs "
                        data-translate="true"
                      >
                        Điểm khởi hành
                      </label>
                      <input
                        id="service"
                        type="input"
                        placeholder="Nhập điểm khởi hành"
                        {...register("depart_point")}
                        className="text-sm w-full rounded-lg pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary "
                      />
                    </div>
                  </div>
                  {errors.depart_point && (
                    <p className="text-red-600">
                      {errors.depart_point.message}
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
                    htmlFor="service"
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
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="relative">
                    <label
                      htmlFor="fullName"
                      className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-translate="true">Họ và tên </span>
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
                      <span data-translate="true">Giới tính </span>
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
                        {/* <option value="other" data-translate="true">
                          Khác
                        </option> */}
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
                      <div className="pt-6">
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
                    </div>
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
      </div>

      <div className="w-full md:w-5/12 lg:w-4/12 bg-white rounded-2xl">
        <div className="overflow-hidden rounded-t-2xl">
          <Image
            className="cursor-pointer w-full h-60 md:h-40 lg:h-[230px] rounded-t-2xl hover:scale-110 ease-in duration-300"
            src={`${detail.image_url}/${detail.image_location}`}
            alt={renderTextContent(detail.name)}
            width={410}
            height={230}
            sizes="100vw"
          />
        </div>
        <div className="py-4 px-3 lg:px-6">
          {" "}
          <p
            className="text-xl lg:text-2xl font-bold hover:text-primary duration-300 transition-colors"
            data-translate="true"
          >
            {renderTextContent(detail.name)}
          </p>
          <div className="flex space-x-2 mt-6 items-center">
            <Image
              className="w-4 h-4"
              src="/icon/clock.svg"
              alt="Thời gian"
              width={18}
              height={18}
            />
            <span data-translate="true">
              {`${detail.combo.day ? detail.combo.day : ""} ngày ${detail.combo.night ? detail.combo.night : ""
                } đêm`}
            </span>
          </div>
          <div className="flex space-x-2 mt-3 items-center">
            <Image
              className="w-4 h-4"
              src="/icon/marker-pin-01.svg"
              alt="Địa chỉ"
              width={18}
              height={18}
            />
            <span data-translate="true">
              {renderTextContent(detail.combo.address)}
            </span>
          </div>
          <div className="pt-4 border-t">
            <VoucherProgram
              totalPrice={detail.price}
              onApplyVoucher={handleApplyVoucher}
              vouchersData={vouchersData}
              voucherErrors={voucherErrors}
              currency={detail?.currency?.code ?? "VND"}
              onSearch={handleSearch}
              isSearching={searchingVouchers}
            />
          </div>
          <div className=" bg-gray-50 text-end p-2 rounded-lg mt-6">
            {totalDiscount > 0 ? (
              <DisplayPriceWithDiscount
                price={detail.price}
                totalDiscount={totalDiscount}
                currency={detail?.currency}
              />
            ) : (
              <div className="w-full text-end">
                <DisplayPrice
                  textPrefix={""}
                  price={detail.price}
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
