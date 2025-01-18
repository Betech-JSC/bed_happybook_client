"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import LoadingButton from "@/components/base/LoadingButton";
import Image from "next/image";
import {
  SignUpReceiveCheapTicketsBody,
  SignUpReceiveCheapTicketsBodyType,
} from "@/schemaValidations/signUpReceiveCheapTickets.schema";

type FormData = SignUpReceiveCheapTicketsBodyType;

export default function SignUpReceiveCheapTickets() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SignUpReceiveCheapTicketsBody),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Gửi thành công");
      setLoading(false);
      reset();
    }, 1500);
  };
  return (
    <div className="flex flex-col md:flex-row mt-8 space-y-4 md:space-x-6 md:space-y-0 p-4 md:p-8 bg-white rounded-3xl">
      <div className="w-full md:w-[60%] pr-0 md:pr-8">
        <div className="bg-white">
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Đăng ký nhận vé giá rẻ
          </h2>
          <div className="mt-4 rounded-xl">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-3 rounded-xl "
            >
              <div className="relative">
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
                <LoadingButton
                  isLoading={loading}
                  text="Gửi"
                  disabled={false}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[40%] pl-0 md:pl-12 border-l-none md:border-l border-l-gray-300">
        <div className="bg-white rounded-xl">
          <h3 className="text-18 font-semibold">Đặt vé nhanh tại Happy Book</h3>
        </div>
        <div className="mt-4">
          <div className="flex space-x-4">
            <div>
              <Image
                src="/icon/AirplaneTiltBlack.svg"
                alt="Icon"
                width={32}
                height={32}
                style={{ width: "32px", height: "32px" }}
              />
            </div>
            <div className="w-3/4">
              <p className="text-sm font-semibold">Hotline vé máy bay</p>
              <p className="text-base mt-2 text-primary">
                0983.488.937 (Nội địa) - 0367.008.027 (Quốc tế)
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div className="w-3/4">
              <p className="text-sm font-semibold">Chat với chúng tôi qua</p>
              <div className="flex space-x-4 mt-4">
                <Image
                  src="/social/fb.svg"
                  alt="Icon"
                  width={32}
                  height={32}
                  style={{ width: "32px", height: "32px" }}
                />
                <Image
                  src="/social/ytb.svg"
                  alt="Icon"
                  width={32}
                  height={32}
                  style={{ width: "32px", height: "32px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
