"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  AuthLoginBody,
  AuthLoginBodyType,
} from "@/schemaValidations/authLogin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import LoadingButton from "@/components/LoadingButton";
import http from "@/lib/http";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormData = AuthLoginBodyType;

export default function FormLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(AuthLoginBody),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      reset();
      toast.success("Đăng nhập thành công!");
      setTimeout(() => {
        toast.dismiss();
        router.push("/");
      }, 1500);
    } catch (error: any) {
      setLoading(false);
      toast.error("Có lỗi xảy ra. Vui lòng tải lại trang!");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-3 rounded-xl ">
      <div className="mt-6 pb-6 border-b-[1px] border-gray-300">
        <div>
          <p>Tên tài khoản hoặc địa chỉ email</p>
          <input
            type="text"
            placeholder="Tên tài khoản hoặc địa chỉ email"
            {...register("email")}
            className="mt-2 h-11 border-[1px] border-gray-300 rounded-lg w-full indent-3.5"
          />
          {errors.email && (
            <p className="text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="mt-3">
          <p>Mật khẩu</p>
          <input
            type="password"
            placeholder="Mật khẩu"
            {...register("password")}
            className="mt-2 h-11 border-[1px] border-gray-300 rounded-lg w-full indent-3.5"
          />
          {errors.password && (
            <p className="text-red-600">{errors.password.message}</p>
          )}
        </div>
        <div className="mt-6">
          <LoadingButton
            isLoading={loading}
            text="Đăng nhập"
            disabled={false}
          />
        </div>
        <div className="mt-3 text-right text-base text-blue-700 font-medium">
          <Link href="#">Quên mật khẩu ?</Link>
        </div>
      </div>
    </form>
  );
}
