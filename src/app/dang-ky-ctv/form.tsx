"use client";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import {
  FormCtvBody,
  FormCtvBodyType,
} from "@/schemaValidations/formCtv.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Fragment } from "react";
import LoadingButton from "@/components/LoadingButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import http from "@/lib/http";

type FormData = FormCtvBodyType;

export default function FormCtv() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormCtvBody),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const response = await http.post<any>(`api/v1/register-collaborator`, data);
    setLoading(false);
    if (response?.status === 200) {
      reset();
      toast.dismiss();
      toast.success("Gửi thành công!");
    }
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3 rounded-xl ">
        <div className="mt-4 rounded-xl">
          <div className="relative">
            <label
              htmlFor="full_name"
              className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
            >
              Tên người đại diện
            </label>
            <input
              id="full_name"
              type="text"
              placeholder="Nhập Tên người đại diện"
              {...register("full_name")}
              className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
            />
            {errors.full_name && (
              <p className="text-red-600">{errors.full_name.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="relative">
              <label
                htmlFor="phone"
                className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
              >
                Số điện thoại liên hệ
              </label>
              <input
                id="phone"
                type="text"
                placeholder="Nhập số điện thoại liên hệ"
                {...register("phone")}
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
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder="Nhập email"
                {...register("email")}
                className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
              />
              {errors.email && (
                <p className="text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="relative mt-3">
            <label
              htmlFor="address"
              className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
            >
              Địa chỉ liên hệ
            </label>
            <input
              id="address"
              type="text"
              placeholder="Nhập địa chỉ liên hệ"
              {...register("address")}
              className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
            />
            {errors.address && (
              <p className="text-red-600">{errors.address.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div className="relative">
            <label
              htmlFor="ID"
              className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
            >
              Số chứng minh thư
            </label>
            <input
              id="ID"
              type="text"
              placeholder="Nhập số chứng minh thư"
              {...register("citizen_id")}
              className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
            />
            {errors.citizen_id && (
              <p className="text-red-600">{errors.citizen_id.message}</p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="citizen_id_date"
              className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs z-10"
            >
              Ngày cấp
            </label>
            <div className="w-full [&>div]:w-full">
              <Controller
                name="citizen_id_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="citizen_id_date"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="text-sm pl-4 w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary"
                  />
                )}
              />
            </div>
            {errors.citizen_id_date && (
              <p className="text-red-600">{errors.citizen_id_date.message}</p>
            )}
          </div>
          <div className="relative">
            <label
              htmlFor="issue_place"
              className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
            >
              Nơi cấp
            </label>
            <input
              id="issue_place"
              type="text"
              placeholder="Nhập nơi cấp"
              {...register("citizen_id_place")}
              className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
            />
            {errors.citizen_id_place && (
              <p className="text-red-600">{errors.citizen_id_place.message}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <textarea
            {...register("required")}
            placeholder="Yêu Cầu Đặc Biệt"
            className="w-full border border-gray-300 rounded-lg h-28 focus:outline-none focus:border-primary indent-3.5 pt-2.5"
          ></textarea>
        </div>
        <LoadingButton isLoading={loading} text="Gửi" disabled={false} />
      </form>
    </Fragment>
  );
}
