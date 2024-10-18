"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  AuthRegisterBody,
  AuthRegisterBodyType,
} from "@/schemaValidations/authRegister.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import LoadingButton from "@/components/LoadingButton";
import http from "@/lib/http";
import { useRouter } from "next/navigation";

type FormData = AuthRegisterBodyType;

export default function FormRegister() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(AuthRegisterBody),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await http.post<any>(`auth/register`, data);
      if (response?.status === 200) {
        reset();
        toast.dismiss();
        toast.success("Đăng ký thành công!");
        setTimeout(() => {
          router.push("/dang-nhap");
        }, 2000);
      } else if (response?.status === 201) {
        toast.error(
          response?.payload.message ?? "Có lỗi xảy ra. Vui lòng tải lại trang!"
        );
      }
    } catch (error: any) {
      toast.error("Có lỗi xảy ra. Vui lòng tải lại trang!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-3 rounded-xl ">
      <div className="mt-6 pb-6 border-b-[1px] border-gray-300">
        <div className="mt-3">
          <p>Email</p>
          <input
            type="text"
            {...register("email")}
            placeholder="Nhập địa chỉ email"
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
            placeholder="Nhập mật khẩu"
            {...register("password")}
            className="mt-2 h-11 border-[1px] border-gray-300 rounded-lg w-full indent-3.5"
          />
          {errors.password && (
            <p className="text-red-600">{errors.password.message}</p>
          )}
        </div>
        <div className="mt-3">
          <p>Nhập lại mật khẩu</p>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            {...register("password_confirmation")}
            className="mt-2 h-11 border-[1px] border-gray-300 rounded-lg w-full indent-3.5"
          />
          {errors.password_confirmation && (
            <p className="text-red-600">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>
        <div className="mt-6">
          <LoadingButton isLoading={loading} text="Đăng ký" disabled={false} />
        </div>
      </div>
    </form>
  );
}
