"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  VisaApplicationBody,
  VisaApplicationBodyType,
} from "@/schemaValidations/visaApplication.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Fragment } from "react";
import LoadingButton from "@/components/LoadingButton";
import http from "@/lib/http";

type FormData = VisaApplicationBodyType;

export default function VisaApplicationForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(VisaApplicationBody),
    defaultValues: {
      is_relatives_abroad_not_legal: "",
      education: "",
      purpose_visa_application: [],
      job: [],
      max_savings_book: "",
      assets_home: "",
      assets_car: "",
      is_visa_rejected: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await http.post<FormData>(`visa-application`, data);
      if (response?.status === 200) {
        reset();
        toast.dismiss();
        toast.success("Gửi thành công!");
      }
    } catch (error: any) {
      toast.error("Có lỗi xảy ra. Vui lòng tải lại trang!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="h-auto pb-6 w-full bg-gray-100 rounded-t-2xl top-[-12px]">
          <div className="px-3 pt-10 lg:px-[80px] lg:pt-16">
            <div className="mx-auto p-8 lg:w-[980px] h-auto bg-white rounded-2xl  ">
              <div>
                <h3 className="text-2xl font-semibold">
                  PHIẾU TIẾP NHẬN THÔNG TIN XIN THỊ THỰC (VISA)
                </h3>
              </div>
              <div className="mt-6">
                <div className="relative">
                  <label
                    htmlFor="country"
                    className="absolute h-4 top-0 left-0 translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    QUỐC GIA MUỐN XIN THỊ THỰC{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="country"
                    type="text"
                    {...register("country")}
                    placeholder="Nhập tên quốc gia muốn xin thị thực"
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                  />
                  {errors.country && (
                    <p className="text-red-600">{errors.country.message}</p>
                  )}
                </div>
                <div className="mt-6">
                  <p className="text-base text-gray-700">
                    ĐÃ TỪNG TRƯỢT VISA TẠI NƯỚC MUỐN XIN VISA BAO GIỜ CHƯA?{" "}
                    <span className="text-red-500">*</span>
                  </p>
                  <div className="mt-2">
                    <div className="flex space-x-6">
                      <div className="flex space-x-3">
                        <input
                          type="radio"
                          value={1}
                          id="is_visa_rejected_1"
                          {...register("is_visa_rejected")}
                        />
                        <label htmlFor="is_visa_rejected_1">Đã từng</label>
                      </div>
                      <div className="flex space-x-3">
                        <input
                          type="radio"
                          value={0}
                          id="is_visa_rejected_2"
                          {...register("is_visa_rejected")}
                        />
                        <label htmlFor="is_visa_rejected_2">Chưa từng</label>
                      </div>
                    </div>
                    {errors.is_visa_rejected && (
                      <p className="text-red-600">
                        {errors.is_visa_rejected.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label
                      htmlFor="fullName"
                      className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs text-gray-700"
                    >
                      HỌ VÀ TÊN NGƯỜI XIN VISA{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      {...register("full_name")}
                      placeholder="Nhập Họ và Tên"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                    />
                    {errors.full_name && (
                      <p className="text-red-600">{errors.full_name.message}</p>
                    )}
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="birth_year"
                      className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs text-gray-700"
                    >
                      NĂM SINH NGƯỜI XIN VISA{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="birth_year"
                      type="text"
                      placeholder="Nhập năm sinh"
                      {...register("birth_year")}
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                    />
                    {errors.birth_year && (
                      <p className="text-red-600">
                        {errors.birth_year.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="relative mt-6">
                <label
                  htmlFor="phone"
                  className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs text-gray-700"
                >
                  SỐ ĐIỆN THOẠI NGƯỜI XIN VISA{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="text"
                  placeholder="Nhập số điện thoại"
                  {...register("phone")}
                  className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                />
                {errors.phone && (
                  <p className="text-red-600">{errors.phone.message}</p>
                )}
              </div>
              <div className="relative mt-6">
                <label
                  htmlFor="address"
                  className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs text-gray-700"
                >
                  ĐỊA CHỈ THƯỜNG TRÚ NGƯỜI XIN VISA{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="address"
                  type="text"
                  {...register("address")}
                  placeholder="Nhập ĐỊA CHỈ THƯỜNG TRÚ NGƯỜI XIN VISA"
                  className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                />
                {errors.address && (
                  <p className="text-red-600">{errors.address.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-700">
                  Yêu cầu ghi đầy đủ: XÃ/ PHƯỜNG - QUẬN/ HUYỆN - TỈNH/ THÀNH PHỐ
                </p>
              </div>
              <div className="relative mt-6">
                <label
                  htmlFor="temporary_address"
                  className="absolute top-0 left-0 h-4 translate-y-1 translate-x-4 font-medium text-xs text-gray-700"
                >
                  ĐỊA CHỈ TẠM TRÚ NGƯỜI XIN VISA{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="temporary_address"
                  type="text"
                  {...register("temporary_address")}
                  placeholder="Nhập ĐỊA CHỈ TẠM TRÚ NGƯỜI XIN VISA"
                  className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                />
                {errors.temporary_address && (
                  <p className="text-red-600">
                    {errors.temporary_address.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-700">
                  1. Nếu không có địa chỉ tạm chú, ghi &quot;KHÔNG&quot;
                </p>
                <p className="mt-1 text-xs text-gray-700">
                  2. Nếu có địa chỉ tạm trú, yêu cầu ghi đầy đủ: XÃ/ PHƯỜNG -
                  QUẬN/ HUYỆN - TỈNH/ THÀNH PHỐ
                </p>
              </div>
              <div className="mt-6">
                <p className="text-base text-gray-900 font-semibold">
                  CÓ NGƯỜI THÂN ĐANG HỌC TẬP, LÀM VIỆC BẤT HỢP PHÁP TẠI NƯỚC
                  MUỐN XIN VISA KHÔNG? <span className="text-red-500">*</span>
                </p>
                <div className="mt-2">
                  <div className="flex space-x-6">
                    <div className="flex space-x-3">
                      <input
                        type="radio"
                        id="is_relatives_abroad_not_legal_option_yes"
                        value={1}
                        {...register("is_relatives_abroad_not_legal")}
                      />
                      <label htmlFor="is_relatives_abroad_not_legal_option_yes">
                        Có
                      </label>
                    </div>
                    <div className="flex space-x-3">
                      <input
                        type="radio"
                        id="is_relatives_abroad_not_legal_option_no"
                        value={0}
                        {...register("is_relatives_abroad_not_legal")}
                      />
                      <label htmlFor="is_relatives_abroad_not_legal_option_no">
                        Không
                      </label>
                    </div>
                  </div>
                  {errors.is_relatives_abroad_not_legal && (
                    <p className="text-red-600">
                      {errors.is_relatives_abroad_not_legal.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <p className="text-base text-gray-900 font-semibold">
                  TRÌNH ĐỘ HỌC VẤN CAO NHẤT{" "}
                  <span className="text-red-500">*</span>
                </p>
                <div className="mt-2">
                  <div className="inline-block mr-6">
                    <input
                      id="education_1"
                      type="radio"
                      value={1}
                      {...register("education")}
                    />
                    <label htmlFor="education_1" className="ml-3">
                      TIỂU HỌC (CẤP 1)
                    </label>
                  </div>
                  <div className="inline-block mr-6">
                    <input
                      id="education_2"
                      type="radio"
                      value={2}
                      {...register("education")}
                    />
                    <label htmlFor="education_2" className="ml-3">
                      TRUNG HỌC CƠ SỞ (CẤP 2)
                    </label>
                  </div>
                  <div className="inline-block mr-6">
                    <input
                      id="education_3"
                      type="radio"
                      value={3}
                      {...register("education")}
                    />
                    <label htmlFor="education_3" className="ml-3">
                      TRUNG HỌC PHỔ THÔNG (CẤP 3)
                    </label>
                  </div>
                  <div className="mt-3">
                    <div className="inline-block mr-6">
                      <input
                        type="radio"
                        value={4}
                        id="education_4"
                        {...register("education")}
                      />
                      <label htmlFor="education_4" className="ml-3">
                        TRUNG CẤP
                      </label>
                    </div>
                    <div className="inline-block mr-6">
                      <input
                        type="radio"
                        value={5}
                        id="education_5"
                        {...register("education")}
                      />
                      <label htmlFor="education_5" className="ml-3">
                        CAO ĐẲNG
                      </label>
                    </div>
                    <div className="inline-block mr-6">
                      <input
                        type="radio"
                        value={6}
                        id="education_6"
                        {...register("education")}
                      />
                      <label htmlFor="education_6" className="ml-3">
                        ĐẠI HỌC
                      </label>
                    </div>
                    <div className="inline-block mr-6">
                      <input
                        type="radio"
                        value={7}
                        id="education_7"
                        {...register("education")}
                      />
                      <label htmlFor="education_7" className="ml-3">
                        CAO HỌC
                      </label>
                    </div>
                    <div className="inline-block mr-6">
                      <input
                        type="radio"
                        value={8}
                        id="education_8"
                        {...register("education")}
                      />
                      <label htmlFor="education_8" className="ml-3">
                        TRÌNH ĐỘ KHÁC
                      </label>
                    </div>
                  </div>
                </div>
                {errors.education && (
                  <p className="text-red-600">{errors.education.message}</p>
                )}
              </div>
              <div className="mt-6">
                <p className="text-base text-gray-900 font-semibold">
                  MỤC ĐÍCH XIN VISA <span className="text-red-500">*</span>
                </p>
                <div className="mt-2">
                  <div className="inline-block mr-6">
                    <div className="flex items-center space-x-3">
                      <label
                        htmlFor="purpose_visa_application_1"
                        className="text-base text-gray-700  font-medium"
                      >
                        Du lịch
                      </label>
                      <input
                        type="checkbox"
                        value={1}
                        id="purpose_visa_application_1"
                        {...register("purpose_visa_application")}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                  <div className="inline-block mr-6">
                    <div className="flex items-center space-x-3">
                      <label
                        htmlFor="purpose_visa_application_2"
                        className="text-base text-gray-700  font-medium"
                      >
                        THĂM THÂN
                      </label>
                      <input
                        type="checkbox"
                        value={2}
                        id="purpose_visa_application_2"
                        {...register("purpose_visa_application")}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                  <div className="inline-block mr-6">
                    <div className="flex items-center space-x-3">
                      <label
                        htmlFor="purpose_visa_application_3"
                        className="text-base text-gray-700  font-medium"
                      >
                        CÔNG TÁC
                      </label>
                      <input
                        type="checkbox"
                        value={3}
                        id="purpose_visa_application_3"
                        {...register("purpose_visa_application")}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                  <div className="inline-block mr-6">
                    <div className="flex items-center space-x-3">
                      <label
                        htmlFor="purpose_visa_application_4"
                        className="text-base text-gray-700  font-medium"
                      >
                        DU HỌC
                      </label>
                      <input
                        type="checkbox"
                        value={4}
                        id="purpose_visa_application_4"
                        {...register("purpose_visa_application")}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                  <div className="inline-block mr-6">
                    <div className="flex items-center space-x-3">
                      <label
                        htmlFor="purpose_visa_application_5"
                        className="text-base text-gray-700  font-medium"
                      >
                        LAO ĐỘNG
                      </label>
                      <input
                        type="checkbox"
                        value={5}
                        id="purpose_visa_application_5"
                        {...register("purpose_visa_application")}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                  <div className="inline-block mr-6">
                    <div className="flex items-center space-x-3">
                      <label
                        htmlFor="purpose_visa_application_6"
                        className="text-base text-gray-700  font-medium"
                      >
                        MỤC ĐÍCH KHÁC
                      </label>
                      <input
                        type="checkbox"
                        value={6}
                        id="purpose_visa_application_6"
                        {...register("purpose_visa_application")}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                </div>
                {errors.purpose_visa_application && (
                  <p className="text-red-600">
                    {errors.purpose_visa_application.message}
                  </p>
                )}
              </div>
              <div className="mt-6">
                <p className="text-base text-gray-900 font-semibold">
                  LỊCH SỬ ĐI LẠI <span className="text-red-500">*</span>
                </p>
                <p className="mt-2 text-base text-gray-700">
                  1. Nếu không có địa chỉ tạm chú, ghi &quot;KHÔNG&quot;
                </p>
                <p className="mt-2 text-base text-gray-700">
                  2. Nếu có địa chỉ tạm trú, yêu cầu ghi đầy đủ: XÃ/ PHƯỜNG -
                  QUẬN/ HUYỆN - TỈNH/ THÀNH PHỐ
                </p>
                <input
                  type="text"
                  placeholder="Thông tin đi lại"
                  {...register("travel_history")}
                  className="w-full h-11 border border-gray-300 rounded-lg mt-2 indent-3.5"
                />
                {errors.travel_history && (
                  <p className="text-red-600">
                    {errors.travel_history.message}
                  </p>
                )}
              </div>
              <div className="mt-6">
                <p className="text-base text-gray-900 font-semibold">
                  CÔNG VIỆC HIỆN TẠI <span className="text-red-500">*</span>
                </p>
                <div className="mt-2">
                  <div className="inline-block mr-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        value={1}
                        id="job_1"
                        {...register("job")}
                        className="w-5 h-5"
                      />
                      <label
                        htmlFor="job_1"
                        className="text-base text-gray-700  font-medium"
                      >
                        NGƯỜI LAO ĐỘNG
                      </label>
                    </div>
                  </div>
                  <div className="inline-block mr-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        value={2}
                        id="job_2"
                        {...register("job")}
                        className="w-5 h-5"
                      />
                      <label
                        htmlFor="job_2"
                        className="text-base text-gray-700  font-medium"
                      >
                        CHỦ DOANH NGHIỆP
                      </label>
                    </div>
                  </div>
                  <div className="inline-block mr-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        value={3}
                        id="job_3"
                        {...register("job")}
                        className="w-5 h-5"
                      />
                      <label
                        htmlFor="job_3"
                        className="text-base text-gray-700  font-medium"
                      >
                        HỌC SINH/ SINH VIÊN
                      </label>
                    </div>
                  </div>
                  <div className="inline-block mr-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        value={4}
                        id="job_4"
                        {...register("job")}
                        className="w-5 h-5"
                      />
                      <label
                        htmlFor="job_4"
                        className="text-base text-gray-700  font-medium"
                      >
                        HƯU TRÍ
                      </label>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        value={5}
                        id="job_5"
                        {...register("job")}
                        className="w-5 h-5"
                      />
                      <label
                        htmlFor="job_5"
                        className="text-base text-gray-700  font-medium"
                      >
                        CÔNG VIỆC TỰ DO
                      </label>
                    </div>
                  </div>
                </div>
                {errors.job && (
                  <p className="text-red-600">{errors.job.message}</p>
                )}
              </div>
              <div className="mt-6">
                <p className="text-base text-gray-900 font-semibold">
                  MÔ TẢ CHI TIẾT CÔNG VIỆC HIỆN TẠI{" "}
                  <span className="text-red-500">*</span>
                </p>
                <p className="mt-2 text-base text-gray-700">
                  1. NGƯỜI LAO ĐỘNG: Làm việc tại cơ quan từ thời gian nào -
                  Lương trung bình hàng tháng bao nhiêu, chuyển khoản hay tiền
                  mặt - Có tham gia bảo hiểm xã hội không?
                </p>
                <p className="mt-2 text-base text-gray-700">
                  2. CHỦ DOANH NGHIỆP: Giấy phép đăng ký là Hộ kinh doanh hay
                  Công ty, thành lập từ thời gian nào - Có đóng thuế đầy đủ
                  không - Có tham gia bảo hiểm xã hội không?
                </p>
                <p className="mt-2 text-base text-gray-700">
                  3. HỌC SINH/ SINH VIÊN: Nêu rõ tên trường đang theo học?
                </p>
                <p className="mt-2 text-base text-gray-700">
                  4. HƯU TRÍ: Có quyết định hưu trí từ thời gian nào - Lương hưu
                  chuyển khoản hay tiền mặt?
                </p>
                <p className="mt-2 text-base text-gray-700">
                  5. CÔNG VIỆC TỰ DO: Mô tả chi tiết công việc tự do?
                </p>
                <input
                  type="text"
                  {...register("job_description")}
                  placeholder="Thông tin công việc"
                  className="w-full h-11 border border-gray-300 rounded-lg mt-2 indent-3.5"
                />
                {errors.job_description && (
                  <p className="text-red-600">
                    {errors.job_description.message}
                  </p>
                )}
              </div>
              <div className="mt-6">
                <p className="text-base text-gray-900 font-semibold">
                  SỔ TIẾT KIỆM TỐI ĐA CÓ THỂ MỞ{" "}
                  <span className="text-red-500">*</span>
                </p>
                <div className="mt-2">
                  <div className="inline-block mr-6">
                    <input
                      type="radio"
                      value={1}
                      id="max_savings_book_1"
                      {...register("max_savings_book")}
                    />
                    <label htmlFor="max_savings_book_1" className="ml-3">
                      100 TRIỆU
                    </label>
                  </div>
                  <div className="inline-block mr-6">
                    <input
                      type="radio"
                      value={2}
                      id="max_savings_book_2"
                      {...register("max_savings_book")}
                    />
                    <label htmlFor="max_savings_book_2" className="ml-3">
                      150 TRIỆU
                    </label>
                  </div>
                  <div className="inline-block mr-6">
                    <input
                      type="radio"
                      value={3}
                      id="max_savings_book_3"
                      {...register("max_savings_book")}
                    />
                    <label htmlFor="max_savings_book_3" className="ml-3">
                      200 TRIỆU
                    </label>
                  </div>
                  <div className="inline-block mr-6">
                    <input
                      type="radio"
                      value={4}
                      id="max_savings_book_4"
                      {...register("max_savings_book")}
                    />
                    <label htmlFor="max_savings_book_4" className="ml-3">
                      250 TRIỆU
                    </label>
                  </div>
                  <div className="inline-block mr-6">
                    <input
                      type="radio"
                      value={5}
                      id="max_savings_book_5"
                      {...register("max_savings_book")}
                    />
                    <label htmlFor="max_savings_book_5" className="ml-3">
                      TRÊN 250 TRIỆU
                    </label>
                  </div>
                </div>
                {errors.max_savings_book && (
                  <p className="text-red-600">
                    {errors.max_savings_book.message}
                  </p>
                )}
              </div>
              <div className="mt-6">
                <p className="text-base text-gray-900 font-semibold">
                  SỔ ĐỎ/ SỔ HỒNG CHÍNH CHỦ{" "}
                  <span className="text-red-500">*</span>
                </p>
                <div className="mt-2">
                  <div className="flex space-x-6">
                    <div className="flex space-x-3">
                      <input
                        type="radio"
                        value={1}
                        id="assets_home_1"
                        {...register("assets_home")}
                      />
                      <label htmlFor="assets_home_1">Có</label>
                    </div>
                    <div className="flex space-x-3">
                      <input
                        type="radio"
                        value={0}
                        id="assets_home_2"
                        {...register("assets_home")}
                      />
                      <label htmlFor="assets_home_2">Không</label>
                    </div>
                  </div>
                </div>
                {errors.assets_home && (
                  <p className="text-red-600">{errors.assets_home.message}</p>
                )}
              </div>
              <div className="mt-6">
                <p className="text-base text-gray-900 font-semibold">
                  ĐĂNG KÝ XE Ô TÔ CHÍNH CHỦ{" "}
                  <span className="text-red-500">*</span>
                </p>
                <div className="mt-2">
                  <div className="flex space-x-6">
                    <div className="flex space-x-3">
                      <input
                        type="radio"
                        value={1}
                        id="assets_car_1"
                        {...register("assets_car")}
                      />
                      <label htmlFor="assets_car_1">Có</label>
                    </div>
                    <div className="flex space-x-3">
                      <input
                        type="radio"
                        value={0}
                        id="assets_car_2"
                        {...register("assets_car")}
                      />
                      <label htmlFor="assets_car_2">Không</label>
                    </div>
                  </div>
                </div>
                {errors.assets_car && (
                  <p className="text-red-600">{errors.assets_car.message}</p>
                )}
              </div>
              <div className="mt-6">
                <p className="text-base text-gray-900 font-semibold">
                  CÁC TÀI SẢN KHÁC <span className="text-red-500">*</span>
                </p>
                <p className="mt-2 text-base text-gray-700">
                  1. Nếu không có bất kỳ tài sản nào khác, ghi &quot;KHÔNG&quot;
                </p>
                <p className="mt-2 text-base text-gray-700">
                  2. Nếu có tài sản khác như: cổ phiếu, trái phiếu, góp vốn,...
                  yêu cầu ghi đầy đủ
                </p>
                <input
                  type="text"
                  {...register("other_assets")}
                  placeholder="Thông tin tài sản khác"
                  className="w-full h-11 border border-gray-300 rounded-lg mt-2 indent-3.5"
                />
                {errors.other_assets && (
                  <p className="text-red-600">{errors.other_assets.message}</p>
                )}
              </div>
              <LoadingButton isLoading={loading} text="Gửi" disabled={false} />
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
}
