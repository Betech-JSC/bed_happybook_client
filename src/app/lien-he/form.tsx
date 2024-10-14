"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  ContactBody,
  ContactBodyType,
} from "@/schemaValidations/contact.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Fragment } from "react";
import LoadingButton from "@/components/LoadingButton";
import { contactApi } from "@/api/contact";

type FormData = ContactBodyType;

export default function FormContact() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ContactBody),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const respon = await contactApi.send(data);
    setLoading(false);
    if (respon?.status === 200) {
      reset();
      toast.dismiss();
      toast.success("Gửi thành công!");
    }
  };
  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3 rounded-xl ">
        <div className="relative">
          <label
            htmlFor="service"
            className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
          >
            Tên dịch vụ <span className="text-red-500">*</span>
          </label>
          <input
            id="service"
            type="text"
            placeholder="Nhập tên dịch vụ"
            title="Nhập tên dịch vụ"
            {...register("service")}
            className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
          />
          {errors.service && (
            <p className="text-red-600">{errors.service.message}</p>
          )}
        </div>
        <div className="relative mt-4">
          <label
            htmlFor="fullName"
            className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
          >
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Nhập họ và tên"
            title="Nhập họ và tên"
            {...register("full_name")}
            className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
          />
          {errors.full_name && (
            <p className="text-red-600">{errors.full_name.message}</p>
          )}
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label
                htmlFor="phone"
                className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
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
                className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="text"
                {...register("email")}
                title="Nhập email"
                placeholder="Nhập email"
                className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
              />
              {errors.email && (
                <p className="text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <textarea
            {...register("note")}
            placeholder="Hãy chia sẻ nhu cầu của bạn"
            className="w-full border border-gray-300 rounded-lg h-28 focus:outline-none focus:border-primary indent-3.5 pt-2.5"
          ></textarea>
        </div>
        <LoadingButton isLoading={loading} text="Gửi" disabled={false} />
      </form>
    </Fragment>
  );
}
