"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import LoadingButton from "@/components/base/LoadingButton";
import Image from "next/image";
import {
  SignUpReceiveCheapTicketSchema,
  SignUpReceiveCheapTicketType,
} from "@/schemaValidations/signUpReceiveCheapTickets.schema";
import { contactApi } from "@/api/contact";
import { useLanguage } from "@/contexts/LanguageContext";
import { toastMessages, validationMessages } from "@/lib/messages";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import PhoneInput from "@/components/form/PhoneInput";
import { Controller } from "react-hook-form";

export default function SignUpReceiveCheapTickets() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const messages = validationMessages[language as "vi" | "en"];
  const schema = SignUpReceiveCheapTicketSchema(messages);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SignUpReceiveCheapTicketType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SignUpReceiveCheapTicketType) => {
    try {
      setLoading(true);

      const enrichedData = {
        ...data,
        service: "Đăng ký nhận vé giá rẻ",
      };

      const response = await contactApi.send(enrichedData);
      if (response?.status === 200) {
        reset();
        toast.dismiss();
        toast.success(toaStrMsg.sendSuccess);
      }
    } catch (error: any) {
      toast.error(toaStrMsg.sendFailed);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col md:flex-row mt-8 space-y-4 md:space-x-6 md:space-y-0 p-4 md:p-8 bg-white rounded-3xl">
      <div className="w-full md:w-[60%] pr-0 md:pr-8">
        <div className="bg-white">
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            {t("dang_ky_nhan_ve_gia_re")}
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
                  <span>{t("ho_va_ten")}</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder={t("ho_va_ten")}
                  title={t("ho_va_ten")}
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
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          id="phone"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t("so_dien_thoai")}
                          error={errors.phone?.message}
                          defaultCountry="VN"
                          label={t("so_dien_thoai")}
                          required
                        />
                      )}
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      {t("email")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="text"
                      {...register("email")}
                      title={t("email")}
                      placeholder={t("email")}
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
                  text={t("gui")}
                  disabled={false}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[40%] pl-0 md:pl-12 border-l-none md:border-l border-l-gray-300">
        <div className="bg-white rounded-xl">
          <h3 className="text-18 font-semibold">
            {/* Đặt vé nhanh tại Happy Book */}
            {t("dat_ve_nhanh_tai_happy_book")}
          </h3>
        </div>
        <div className="mt-4">
          <div className="flex space-x-4">
            <div>
              <Image
                src="/icon/AirplaneTiltBlack.svg"
                alt="Máy bay"
                width={32}
                height={32}
                style={{ width: "32px", height: "32px" }}
              />
            </div>
            <div className="w-3/4">
              <p className="text-sm font-semibold">{t("hotline_ve_may_bay")}</p>
              <div className="text-base mt-2 text-primary">
                <a href="tel:1900633437" className="inline-block">
                  1900.633.437 - {t("nhan_phim_1")}
                </a>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="w-3/4">
              <p className="text-sm font-semibold">
                {t("chat_voi_chung_toi_qua")}
              </p>
              <div className="flex space-x-4 mt-4">
                <Link
                  href="https://www.facebook.com/happybooktravel"
                  target="_blank"
                >
                  <Image
                    src="/social/fb.svg"
                    alt="Facebook Happy Book"
                    width={32}
                    height={32}
                  />
                </Link>
                <Link
                  href="https://zalo.me/2451421179976954585/"
                  target="_blank"
                >
                  <Image
                    src="/social/ytb.svg"
                    alt="Zalo Happy Book"
                    width={32}
                    height={32}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
