"use client";

import { useLanguage } from "@/app/contexts/LanguageContext";
import LoadingButton from "@/components/base/LoadingButton";
import { validationMessages } from "@/lib/messages";
import {
  checkOutInsuranceSchema,
  checkOutInsuranceType,
} from "@/schemaValidations/checkOutInsurance.schema";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function FormCheckOut() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const messages = validationMessages[language as "vi" | "en"];
  const [schemaForm, setSchemaForm] = useState(() =>
    checkOutInsuranceSchema(messages, generateInvoice)
  );
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<checkOutInsuranceType>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      checkBoxGenerateInvoice: false,
    },
  });

  useEffect(() => {
    setSchemaForm(checkOutInsuranceSchema(messages, generateInvoice));
  }, [generateInvoice, messages]);

  const onSubmit = async (data: checkOutInsuranceType) => {
    try {
      // setLoading(true);
      console.log(data);
      // const respon = await BookingProductApi.Combo(formatData);
      // if (respon?.status === 200) {
      //   reset();
      //   toast.success(toaStrMsg.sendSuccess);
      //   setTimeout(() => {
      //     router.push("/combo");
      //   }, 1500);
      // } else {
      //   toast.error(toaStrMsg.sendFailed);
      // }
    } catch (error: any) {
      // toast.error(toaStrMsg.error);
    } finally {
      setLoading(false);
    }
  };
  const insuredUser = [
    {
      gender: "male",
      fullName: "",
      birthday: "",
      citizenId: "",
      buyFor: "self",
      address: "",
      phone: "",
      email: "",
    },
  ];
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-3 gap-4">
        <div className="relative">
          <label className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs">
            <span data-translate="true">Nơi đi</span>
          </label>
          <input
            type="text"
            placeholder="Nhập nơi đi"
            {...register("departurePoint")}
            className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
          />
          {errors.departurePoint && (
            <p className="text-red-600">{errors.departurePoint.message}</p>
          )}
        </div>
        <div className="relative">
          <label className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs">
            <span data-translate="true">Nơi đến</span>
          </label>
          <input
            type="text"
            placeholder="Nhập nơi đến"
            {...register("destination")}
            className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
          />
          {errors.destination && (
            <p className="text-red-600">{errors.destination.message}</p>
          )}
        </div>
        <div className="relative">
          <label className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs">
            <span data-translate="true">Số lượng</span>
          </label>
          <input
            type="text"
            placeholder="Nhập số lượng"
            {...register("qty")}
            className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
          />
          {errors.qty && <p className="text-red-600">{errors.qty.message}</p>}
        </div>
      </div>
      <div className="mt-6">
        <p className="text-22 font-bold">Thông tin người mua bảo hiểm</p>
        <div className="mt-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                {...register(`insuranceBuyer.fullName`)}
                className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
              />
              {errors.insuranceBuyer?.fullName && (
                <p className="text-red-600">
                  {errors.insuranceBuyer?.fullName?.message}
                </p>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Ngày sinh"
                {...register(`insuranceBuyer.birthday`)}
                className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
              />
              {errors.insuranceBuyer?.birthday && (
                <p className="text-red-600">
                  {errors.insuranceBuyer?.birthday?.message}
                </p>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Số CCCD"
                {...register(`insuranceBuyer.citizenId`)}
                className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
              />{" "}
              {errors.insuranceBuyer?.citizenId && (
                <p className="text-red-600">
                  {errors.insuranceBuyer?.citizenId?.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4">
            <div className="col-span-2 relative">
              <input
                type="text"
                placeholder="Địa chỉ"
                {...register(`insuranceBuyer.address`)}
                className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
              />{" "}
              {errors.insuranceBuyer?.address && (
                <p className="text-red-600">
                  {errors.insuranceBuyer?.address?.message}
                </p>
              )}
            </div>
            <div className="col-span-1 relative">
              <input
                type="text"
                placeholder="Số điện thoại"
                {...register(`insuranceBuyer.phone`)}
                className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
              />
              {errors.insuranceBuyer?.phone && (
                <p className="text-red-600">
                  {errors.insuranceBuyer?.phone?.message}
                </p>
              )}
            </div>
            <div className="col-span-1 relative">
              <input
                type="text"
                placeholder="Email"
                {...register(`insuranceBuyer.email`)}
                className="text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
              />
              {errors.insuranceBuyer?.email && (
                <p className="text-red-600">
                  {errors.insuranceBuyer?.email?.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div className="flex items-center space-x-2 cursor-pointer">
              <input
                id="informationBySelf"
                type="checkbox"
                className="w-4 h-4"
                name="insurance_buyer_infor"
              />
              <label htmlFor="informationBySelf" className="text-sm">
                Bản thân
              </label>
            </div>
            <div className="flex space-x-2 cursor-pointer">
              <input
                id="informationByBuyer"
                type="checkbox"
                className="w-4 h-4"
                name="insurance_buyer_infor"
              />
              <label htmlFor="informationByBuyer" className="text-sm">
                Thông tin liên hệ theo người mua
              </label>
            </div>
            <div className="flex space-x-2 cursor-pointer">
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
          </div>
          {/* generateInvoice */}
          <div
            className={`mt-6 ${
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
                  htmlFor="GenerateInvoice_tax_code"
                  className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
                >
                  <span data-translate="true">Mã số thuế </span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="GenerateInvoice_tax_code"
                  type="text"
                  placeholder="Nhập mã số thuế công ty"
                  {...register(`invoice.mst`)}
                  className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                />
                {errors.invoice?.mst && (
                  <p className="text-red-600">{errors.invoice?.mst?.message}</p>
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
            </div>
            <div className="grid grid-cols-3 mt-4 gap-4">
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
          <div className="mt-6">
            <div className="flex items-center p-4 rounded-lg bg-gray-100">
              <div className="w-[62%]">
                <p>
                  Để thuận tiện việc nhập Danh sách khách đoàn, Quý khách có thể
                  tải mẫu Excel, điền thông tin và tải lên.
                </p>
              </div>
              <div className="w-[38%] flex gap-4 justify-end">
                <button className="flex gap-2 py-[10px] px-4 border border-gray-300 rounded-lg bg-white">
                  <Image
                    src="/icon/download.svg"
                    alt="Icon"
                    width={20}
                    height={20}
                  />
                  <p>Tải danh sách mẫu</p>
                </button>
                <button className="flex gap-2 py-[10px] px-4 border border-gray-300 rounded-lg bg-white">
                  <Image
                    src="/icon/download.svg"
                    alt="Icon"
                    width={20}
                    height={20}
                  />
                  <p>Chọn danh sách</p>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-22 font-bold">Thông tin người hưởng bảo hiểm</p>
            {insuredUser.map((item, index) => (
              <Fragment key={index}>
                <div className="mt-6 grid grid-cols-4 gap-4">
                  <div className="relative">
                    <label
                      htmlFor="service"
                      className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-translate="true">Giới tính</span>{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                      <select
                        className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-2.5"
                        {...register(`insuredUser.${index}.gender`)}
                        defaultValue={item.gender}
                      >
                        <option value="male" data-translate="true">
                          Nam
                        </option>
                        <option value="female" data-translate="true">
                          Nữ
                        </option>
                      </select>
                    </div>
                    {errors.insuredUser?.[index]?.gender && (
                      <p className="text-red-600">
                        {errors.insuredUser[index].gender?.message}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue={item.fullName}
                      placeholder="Nguyễn Văn A"
                      {...register(`insuredUser.${index}.fullName`)}
                      className="h-full text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                    />{" "}
                    {errors.insuredUser?.[index]?.fullName && (
                      <p className="text-red-600">
                        {errors.insuredUser[index].fullName?.message}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ngày sinh"
                      defaultValue={item.birthday}
                      {...register(`insuredUser.${index}.birthday`)}
                      className="h-full text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                    />{" "}
                    {errors.insuredUser?.[index]?.birthday && (
                      <p className="text-red-600">
                        {errors.insuredUser[index].birthday?.message}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Số CCCD"
                      defaultValue={item.citizenId}
                      {...register(`insuredUser.${index}.citizenId`)}
                      className="h-full text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                    />{" "}
                    {errors.insuredUser?.[index]?.citizenId && (
                      <p className="text-red-600">
                        {errors.insuredUser[index].citizenId?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-4 gap-4">
                  <div className="relative">
                    <label
                      htmlFor="service"
                      className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      <span data-translate="true">Mua cho</span>
                    </label>
                    <div className="flex justify-between items-end pt-6 pb-2 pr-2 border border-gray-300 rounded-md">
                      <select
                        className="text-sm w-full rounded-md  placeholder-gray-400 outline-none indent-2.5"
                        {...register(`insuredUser.${index}.buyFor`)}
                        defaultValue={item.buyFor}
                      >
                        <option value="self" data-translate="true">
                          Bản thân
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Địa chỉ"
                      className="h-full text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Số điện thoại"
                      className="h-full text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nhập Email"
                      className="h-full text-sm w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-400 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        name="termsOfUse"
                        id="termsOfUse"
                      />
                      <label className="text-sm" htmlFor="termsOfUse">
                        Tôi xác nhận thông tin trên và chấp nhận các của{" "}
                        <Link
                          className="text-blue-700 font-bold"
                          href="/thong-tin-chung/dieu-khoan-su-dung"
                          target="_blank"
                        >
                          Điều khoản sử dụng
                        </Link>{" "}
                        website
                      </label>
                    </div>
                    <div className="w-[300px]">
                      <LoadingButton
                        text="Đặt đơn bảo hiểm"
                        isLoading={false}
                      />
                    </div>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
