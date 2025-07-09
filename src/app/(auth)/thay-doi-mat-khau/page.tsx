// components/UserProfile.tsx
"use client";

import { useUser } from "@/contexts/UserContext";
import AccountSidebar from "../components/AccountSidebar";
import { notFound } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { validationMessages } from "@/lib/messages";
import {
  AuthChangePasswordSchema,
  AuthChangePasswordType,
} from "@/schemaValidations/authChangePassword.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthApi } from "@/api/Auth";
import toast from "react-hot-toast";
import LoadingButton from "@/components/base/LoadingButton";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePassWord() {
  const { userInfo } = useUser();
  if (!userInfo) notFound();
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  const messages = validationMessages[language as "vi" | "en"];
  const [showPassword, setShowPassword] = useState(false);
  const schema = AuthChangePasswordSchema(messages);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthChangePasswordType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData: AuthChangePasswordType) => {
    toast.dismiss();
    try {
      setIsLoading(true);
      const response = await AuthApi.changePassword(formData);
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message);
      }
      reset();
      toast.success(resData.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-3 rounded-xl ">
      <main className="bg-white lg:pt-[132px] px-3 lg:px-[80px] pt-14 max__screen">
        <div className="my-8 flex flex-col lg:flex-row gap-4">
          <AccountSidebar userInfo={userInfo} />
          <div className="bg-white shadow rounded-2xl p-6 w-full border-[#AEBFFF] border">
            <h2 className="text-xl font-semibold mb-6">Thay đổi mật khẩu</h2>
            <div className="flex flex-wrap gap-4 text-base">
              <div className="w-full">
                <div className="w-full md:w-1/2 mx-auto ">
                  <p data-translate="true">Mật khẩu hiện tại</p>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password_old")}
                      placeholder="Nhập mật khẩu hiện tại"
                      className="mt-2 h-11 border-[1px] border-gray-300 rounded-lg w-full indent-3.5 outline-primary"
                    />
                    {errors.password_old && (
                      <p className="text-red-600">
                        {errors.password_old.message}
                      </p>
                    )}
                    <button
                      type="button"
                      className="absolute top-1/2 -translate-y-1/2 right-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="w-full md:w-1/2 mx-auto">
                  <p data-translate="true">Mật khẩu mới</p>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Nhập mật khẩu mới"
                    className="mt-2 h-11 border-[1px] border-gray-300 rounded-lg w-full indent-3.5 outline-primary"
                  />
                  {errors.password && (
                    <p className="text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </div>
              <div className="w-full">
                <div className="w-full md:w-1/2 mx-auto">
                  <p data-translate="true">Nhập lại mật khẩu mới</p>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password_confirmation")}
                    placeholder="Nhập lại mật khẩu mới"
                    className="mt-2 h-11 border-[1px] border-gray-300 rounded-lg w-full indent-3.5 outline-primary"
                  />
                  {errors.password_confirmation && (
                    <p className="text-red-600">
                      {errors.password_confirmation.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full">
                <div className="w-1/2 mx-auto">
                  <LoadingButton text={"Gửi"} isLoading={isLoading} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </form>
  );
}
