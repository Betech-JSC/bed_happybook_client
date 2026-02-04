"use client";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import {
  ContactSchema,
  ContactBodyType,
} from "@/schemaValidations/contact.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Fragment } from "react";
import LoadingButton from "@/components/base/LoadingButton";
import { contactApi } from "@/api/contact";
import { toastMessages, validationMessages } from "@/lib/messages";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import PhoneInput from "@/components/form/PhoneInput";

export default function FormContact() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const messages = validationMessages[language as "vi" | "en"];
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ContactBodyType>({
    resolver: zodResolver(ContactSchema(messages)),
  });

  const onSubmit = async (data: ContactBodyType) => {
    try {
      console.log("Form data being submitted:", data);

      // Strip country code from phone number for backend
      let cleanPhone = data.phone.replace(/^\+?\d{1,3}/, '').trim(); // Remove country code prefix

      // Add leading 0 if needed (Vietnamese phone numbers start with 0)
      if (cleanPhone && !cleanPhone.startsWith('0') && cleanPhone.length === 9) {
        cleanPhone = '0' + cleanPhone;
      }

      const cleanedData = {
        ...data,
        phone: cleanPhone,
      };

      console.log("Cleaned data for API:", cleanedData);

      setLoading(true);
      const response = await contactApi.send(cleanedData);
      console.log("API Response:", response);
      if (response?.status === 200) {
        reset();
        toast.dismiss();
        toast.success(toaStrMsg.sendSuccess);
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      console.error("Error response:", error?.response?.data);
      toast.error(toaStrMsg.sendFailed);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3 rounded-xl ">
        <div className="relative">
          <label
            htmlFor="service"
            className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
          >
            <span>{t("ten_dich_vu")}</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            id="service"
            type="text"
            placeholder={`${t("nhap")} ${t("ten_dich_vu")}`}
            title={`${t("nhap")} ${t("ten_dich_vu")}`}
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
            className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs"
          >
            <span>{t("ho_va_ten")}</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            placeholder={`${t("nhap")} ${t("ho_va_ten")}`}
            title={`${t("nhap")} ${t("ho_va_ten")}`}
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
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    id="phone"
                    value={value}
                    onChange={onChange}
                    label={t("so_dien_thoai")}
                    placeholder={`${t("nhap")} ${t("so_dien_thoai")}`}
                    error={errors.phone?.message}
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
                title={`${t("nhap")} ${t("email")}`}
                placeholder={`${t("nhap")} ${t("email")}`}
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
            placeholder={t("hay_chia_se_nhu_cau_cua_ban")}
            className="w-full border border-gray-300 rounded-lg h-28 focus:outline-none focus:border-primary indent-3.5 pt-2.5"
          ></textarea>
        </div>
        <LoadingButton isLoading={loading} text={t("gui")} disabled={false} />
      </form>
    </Fragment>
  );
}
