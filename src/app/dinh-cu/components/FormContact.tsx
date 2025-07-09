"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  ContactSchema,
  ContactBodyType,
} from "@/schemaValidations/contact.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { contactApi } from "@/api/contact";
import LoadingButton from "@/components/base/LoadingButton";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { validationMessages } from "@/lib/messages";

export default function FormContact() {
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const messages = validationMessages[language as "vi" | "en"];
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactBodyType>({
    resolver: zodResolver(ContactSchema(messages)),
  });

  const onSubmit = async (data: ContactBodyType) => {
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
    <div className="flex flex-col md:flex-row space-y-4 md:space-x-8 md:space-y-0">
      <div className="w-full md:w-[40%]">
        <div className="bg-white rounded-xl px-4 py-3">
          <h3 className="text-28 font-bold" data-translate>
            Liên hệ tư vấn
          </h3>
          <p className="mt-3" data-translate>
            Nếu bạn có bất kỳ câu hỏi nào hoặc cần thêm thông tin về các chương
            trình định cư, hãy liên hệ ngay với chúng tôi để được tư vấn miễn
            phí và chi tiết nhất.
          </p>
        </div>
        <div className="bg-white rounded-xl px-4 py-3 mt-3 border-l-[6px] border-l-blue-700">
          <div className="flex space-x-4">
            <div>
              <Image
                src="/icon/contact/passport-outline.svg"
                alt="Icon"
                width={32}
                height={32}
                style={{ width: "32px", height: "32px" }}
              />
            </div>
            <div className="w-3/4">
              <p className="text-sm font-semibold" data-translate>
                Hotline Visa - hộ chiếu
              </p>
              <p className="text-base mt-2">0708.628.791 - 0904.221.293</p>
            </div>
          </div>
          <div className="flex space-x-4 mt-3">
            <div>
              <Image
                src="/icon/contact/mail-01.svg"
                alt="Icon"
                width={32}
                height={32}
                style={{ width: "32px", height: "32px" }}
              />
            </div>
            <div className="w-3/4">
              <p className="text-sm font-semibold" data-translate>
                Email visa - hộ chiếu
              </p>
              <p className="text-base mt-2 break-all">
                visaonline@happybook.com.vn
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[60%]">
        <div className="bg-white rounded-2xl p-6">
          <p className="text-sm" data-translate>
            Hãy để lại thông tin của bạn bên dưới, chúng tôi sẽ liên hệ với bạn
            trong thời gian sớm nhất.
          </p>
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
                  <span data-translate>Họ và tên </span>
                  <span className="text-red-500">*</span>
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
                      <span data-translate>Số điện thoại </span>
                      <span className="text-red-500">*</span>
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
              <div className="relative mt-4">
                <label
                  htmlFor="service"
                  className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                >
                  <span data-translate>Diện VISA </span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="service"
                  type="text"
                  placeholder="VISA"
                  {...register("service")}
                  className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                />
                {errors.service && (
                  <p className="text-red-600">{errors.service.message}</p>
                )}
              </div>
              <div className="mt-4">
                <textarea
                  {...register("note")}
                  placeholder="Nội dung lời nhắn"
                  className="w-full border border-gray-300 rounded-lg h-28 focus:outline-none focus:border-primary indent-3.5 pt-2.5"
                ></textarea>
              </div>
              <LoadingButton isLoading={loading} text="Gửi" disabled={false} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
