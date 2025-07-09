"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@/components/base/LoadingButton";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  CheckOutVisaSchema,
  CheckOutVisaType,
} from "@/schemaValidations/checkOutVisa.schema";
import { useRouter } from "next/navigation";
import { BookingProductApi } from "@/api/BookingProduct";
import { toastMessages, validationMessages } from "@/lib/messages";
import { useLanguage } from "@/contexts/LanguageContext";
import DisplayPrice from "@/components/base/DisplayPrice";
import { renderTextContent } from "@/utils/Helper";
import Image from "next/image";
import Link from "next/link";
import { isEmpty } from "lodash";
import VoucherProgram from "@/components/product/components/VoucherProgram";
import { useVoucherManager } from "@/hooks/useVoucherManager";
import { HttpError } from "@/lib/error";
import { useUser } from "@/contexts/UserContext";
import DisplayPriceWithDiscount from "@/components/base/DisplayPriceWithDiscount";

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
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const messages = validationMessages[language as "vi" | "en"];
  const [schemaForm, setSchemaForm] = useState(() =>
    CheckOutVisaSchema(messages, generateInvoice)
  );
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
  } = useVoucherManager("visa");

  useEffect(() => {
    setSchemaForm(CheckOutVisaSchema(messages, generateInvoice));
  }, [generateInvoice, messages]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckOutVisaType>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      full_name: userInfo?.name,
      phone: userInfo?.phone?.toString(),
      email: userInfo?.email,
      gender: userInfo && userInfo?.gender === 0 ? "female" : "male",
      checkBoxGenerateInvoice: false,
    },
  });
  const onSubmit = async (data: CheckOutVisaType) => {
    setLoading(true);
    try {
      const formatData = {
        is_invoice: generateInvoice,
        product_id: productId,
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
      const respon = await BookingProductApi.Visa(formatData);
      if (respon?.status === 200) {
        reset();
        toast.success(toaStrMsg.sendSuccess);
        setTimeout(() => {
          router.push("/visa");
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

  const finalPrice = useMemo(() => {
    return detail.price - detail.discount_price;
  }, [detail]);

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
                    <select
                      id="gender"
                      {...register("gender")}
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
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
                      <option value="other" data-translate="true">
                        Khác
                      </option>
                    </select>
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
                        <span data-translate="true">Số điện thoại </span>
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
                    data-translate
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
            className="text-xl lg:text-2xl font-bold hover:text-primary duration-300 transition-colors"
            data-translate="true"
          >
            {renderTextContent(detail.name)}
          </p>
          <div className="mt-6 mb-2">
            {!isEmpty(detail.product_visa.ma_visa) && (
              <div>
                <span className="font-semibold" data-translate="true">
                  Mã visa:
                </span>{" "}
                <span data-translate="true">
                  {renderTextContent(detail.product_visa.ma_visa)}
                </span>
              </div>
            )}
            <div className="mt-1">
              <span className="font-semibold" data-translate="true">
                Loại Visa:
              </span>{" "}
              <span data-translate="true">
                {renderTextContent(detail.product_visa.loai_visa)}
              </span>
            </div>
            <div className="mt-1">
              <span className="font-semibold" data-translate="true">
                Điểm Đến:
              </span>{" "}
              <span data-translate="true">
                {renderTextContent(detail.product_visa.diem_den)}
              </span>
            </div>
            <div className="mt-1">
              <span className="font-semibold" data-translate="true">
                Thời gian làm Visa:
              </span>{" "}
              <span data-translate="true">
                {renderTextContent(detail.product_visa.thoi_gian_lam_visa)}
              </span>
            </div>
            <div className="mt-1">
              <span className="font-semibold" data-translate="true">
                Thời gian lưu trú:
              </span>{" "}
              <span data-translate="true">
                {renderTextContent(detail.product_visa.thoi_gian_luu_tru)}
              </span>
            </div>
            <div className="mt-1">
              <span className="font-semibold" data-translate="true">
                Số lần nhập cảnh:
              </span>{" "}
              <span data-translate="true">
                {renderTextContent(detail.product_visa.so_lan_nhap_canh)}
              </span>
            </div>
          </div>
          <div className="pt-4 border-t">
            <VoucherProgram
              totalPrice={finalPrice}
              onApplyVoucher={handleApplyVoucher}
              vouchersData={vouchersData}
              voucherErrors={voucherErrors}
              currency={detail?.currency?.code ?? "VND"}
              onSearch={handleSearch}
              isSearching={searchingVouchers}
            />
          </div>
          <div className="bg-gray-50 text-end p-2 rounded-lg mt-2">
            {totalDiscount > 0 ? (
              <DisplayPriceWithDiscount
                price={detail.price - detail.discount_price}
                totalDiscount={totalDiscount}
                currency={detail?.currency}
              />
            ) : (
              <div className="w-full text-end">
                <DisplayPrice
                  textPrefix={""}
                  price={detail.price - detail.discount_price}
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
