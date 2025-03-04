"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  AuthRegisterSchemaType,
  getAuthRegisterSchema,
} from "@/schemaValidations/authRegister.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import LoadingButton from "@/components/base/LoadingButton";
import http from "@/lib/http";
import { useRouter } from "next/navigation";
import { toastMessages, validationMessages } from "@/lib/messages";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { AuthApi } from "@/api/Auth";
import { HttpError } from "@/lib/error";

export default function FormRegister() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const messages = validationMessages[language as "vi" | "en"];
  const schema = getAuthRegisterSchema(messages);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthRegisterSchemaType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: AuthRegisterSchemaType) => {
    try {
      setLoading(true);
      const response = await AuthApi.register(data);
      if (response?.status === 200) {
        reset();
        toast.dismiss();
        toast.success(toaStrMsg.successRegister);
        setTimeout(() => router.push("/dang-nhap"), 2000);
      } else if (response?.status === 201) {
        toast.error(toaStrMsg.error);
      }
    } catch (error: any) {
      if (error instanceof HttpError) {
        toast.error(error?.payload?.message ?? toaStrMsg.error);
      } else {
        toast.error(toaStrMsg.error);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-3 rounded-xl ">
      <div className="mt-6 pb-6 border-b-[1px] border-gray-300">
        <div className="mt-3">
          <p data-translate="true">Họ & Tên</p>
          <input
            type="text"
            {...register("name")}
            placeholder="Nhập họ & tên"
            className="mt-2 h-11 border-[1px] border-gray-300 rounded-lg w-full indent-3.5 outline-primary"
          />
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}
        </div>
        <div className="mt-3">
          <p data-translate="true">Email</p>
          <input
            type="text"
            {...register("email")}
            placeholder="Nhập địa chỉ email"
            className="mt-2 h-11 border-[1px] border-gray-300 rounded-lg w-full indent-3.5 outline-primary"
          />
          {errors.email && (
            <p className="text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="mt-3">
          <p data-translate="true">Mật khẩu</p>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            {...register("password")}
            className="mt-2 h-11 border-[1px] border-gray-300 rounded-lg w-full indent-3.5 outline-primary"
          />
          {errors.password && (
            <p className="text-red-600">{errors.password.message}</p>
          )}
        </div>
        <div className="mt-3">
          <p data-translate="true">Nhập lại mật khẩu</p>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            {...register("password_confirmation")}
            className="mt-2 h-11 border-[1px] border-gray-300 rounded-lg w-full indent-3.5 outline-primary"
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
