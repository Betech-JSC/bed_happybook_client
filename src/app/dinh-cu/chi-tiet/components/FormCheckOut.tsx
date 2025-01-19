"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@/components/base/LoadingButton";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  CheckOutDinhCuBody,
  CheckOutDinhCuType,
} from "@/schemaValidations/checkOutDinhCu.schema";

export default function FormCheckOut() {
  const [generateInvoice, setGenerateInvoice] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [schemaForm, setSchemaForm] = useState(() =>
    CheckOutDinhCuBody(generateInvoice)
  );

  useEffect(() => {
    setSchemaForm(CheckOutDinhCuBody(generateInvoice));
  }, [generateInvoice]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckOutDinhCuType>({
    resolver: zodResolver(schemaForm),
    defaultValues: {
      checkBoxGenerateInvoice: false,
    },
  });
  const onSubmit = (data: CheckOutDinhCuType) => {
    reset();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Gửi yêu cầu thành công");
    }, 1500);
  };
  return (
    <form className="rounded-xl" onSubmit={handleSubmit(onSubmit)}>
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
