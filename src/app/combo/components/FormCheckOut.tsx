"use client";
import {
  CheckOutTourBody,
  CheckOutTourType,
} from "@/schemaValidations/checkOutTour.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@/components/LoadingButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { toast } from "react-hot-toast";

export default function FormCheckOut() {
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [schemaForm, setSchemaForm] = useState(() =>
    CheckOutTourBody(generateInvoice)
  );

  useEffect(() => {
    setSchemaForm(CheckOutTourBody(generateInvoice));
  }, [generateInvoice]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CheckOutTourType>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      checkBoxGenerateInvoice: false,
    },
  });
  const onSubmit = (data: CheckOutTourType) => {
    reset();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Gửi yêu cầu thành công");
    }, 1500);
  };
  return (
    <form className="rounded-xl" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white py-4 px-6 rounded-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
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
              <div className="relative">
                <label
                  htmlFor="depart_date"
                  className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
                >
                  Ngày khởi hành<span className="text-red-500">*</span>
                </label>
                <div className="flex justify-between items-end pt-6 pb-2 pr-2 w-full rounded-md">
                  <Controller
                    name={`depart_date`}
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        id={`depart_date`}
                        selected={field.value || null}
                        onChange={(date: Date | null) => field.onChange(date)}
                        placeholderText="Chọn ngày khởi hành"
                        dateFormat="dd-MM-yyyy"
                        dropdownMode="select"
                        locale={vi}
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
                  alt="Icon"
                  className="h-5"
                  width={20}
                  height={20}
                />
              </div>

              <div className="flex items-center w-full relative">
                <label
                  htmlFor="service"
                  className="absolute top-0 left-0 h-4 translate-y-1 font-medium text-xs "
                >
                  Điểm khởi hành
                </label>
                <input
                  id="service"
                  type="input"
                  placeholder="Hồ Chí Minh"
                  {...register("depart_point")}
                  className="text-sm w-full rounded-lg pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary "
                />
              </div>
            </div>
            {errors.depart_point && (
              <p className="text-red-600">{errors.depart_point.message}</p>
            )}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="relative">
            <label
              htmlFor="atd"
              className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
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
            {errors.atd && <p className="text-red-600">{errors.atd.message}</p>}
          </div>
          <div className="relative">
            <label
              htmlFor="chd"
              className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
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
            {errors.chd && <p className="text-red-600">{errors.chd.message}</p>}
          </div>
          <div className="relative">
            <label
              htmlFor="service"
              className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
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
            {errors.inf && <p className="text-red-600">{errors.inf.message}</p>}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-18 font-bold">Thông tin liên hệ</p>
        <div className="mt-4 bg-white py-4 px-6 rounded-xl">
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <label
                htmlFor="fullName"
                className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
              >
                Họ và tên <span className="text-red-500">*</span>
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
                Giới tính <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                {...register("gender")}
                className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
              >
                <option value="">Vui lòng chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
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
                  Số điện thoại <span className="text-red-500">*</span>
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
        <LoadingButton
          style="mt-6"
          isLoading={loading}
          text="Gửi yêu cầu"
          disabled={loading}
        />
      </div>
    </form>
  );
}
