"use client";
import LoadingButton from "@/components/base/LoadingButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  QuestionAndAnswerBody,
  QuestionAndAnswerType,
} from "@/schemaValidations/questionAndAnswer.schema";
import { useState } from "react";

export default function QuestionAndAnswer() {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionAndAnswerType>({
    resolver: zodResolver(QuestionAndAnswerBody),
  });

  const onSubmit = async (data: QuestionAndAnswerType) => {
    try {
      setLoading(true);
      // const response = await contactApi.send(data);
      // if (response?.status === 200) {
      //   reset();
      //   toast.dismiss();
      //   toast.success("Gửi thành công!");
      // }
    } catch (error: any) {
      toast.error("Có lỗi xảy ra. Vui lòng tải lại trang!");
    } finally {
      setLoading(false);
    }
  };
  const data = [
    {
      id: 1,
      full_name: "Natasia",
      created_at: "19/04/2024",
      question: "Khoảng giữa T11/2024 có tour này ko a ?",
      answer:
        "Dạ chào anh Tháng 10 đang là mùa lá đỏ bên Hàn Quốc rồi ạ. HappyBook sẽ liên hệ với anh qua sđt cung cấp để tư vấn tour chi tiết ạ. Cảm ơn anh.",
    },
    {
      id: 2,
      full_name: "Natasia 2",
      created_at: "19/04/2024",
      question: "Khoảng giữa T11/2024 có tour này ko a ?",
      answer:
        "Dạ chào anh Tháng 10 đang là mùa lá đỏ bên Hàn Quốc rồi ạ. HappyBook sẽ liên hệ với anh qua sđt cung cấp để tư vấn tour chi tiết ạ. Cảm ơn anh.",
    },
    {
      id: 3,
      full_name: "Natasia 3",
      created_at: "19/04/2024",
      question: "Khoảng giữa T11/2024 có tour này ko a ?",
      answer: "",
    },
  ];
  return (
    <div className="rounded-2xl bg-white p-6">
      <h3 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
        Hỏi đáp
      </h3>
      <form
        className="p-3 mt-8 border border-gray-300 rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <textarea
            className="w-full outline-none"
            rows={4}
            {...register("question")}
            placeholder="Mời bạn nhập thắc mắc hoặc ý kiến của bạn"
          ></textarea>{" "}
          {errors.question && (
            <p className="text-red-600 my-2">{errors.question.message}</p>
          )}
        </div>
        <div className="bg-gray-50 rounded-2xl flex flex-wrap items-start lg:flex-nowrap space-y-4 lg:space-y-0 lg:space-x-3 p-5 lg:p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl w-full lg:w-[80%]">
            <div className="rounded-2xl">
              <div className="border-gray-300 border rounded-lg">
                <input
                  className="outline-none w-full px-4 py-[10px] max-h-11 rounded-lg"
                  style={{
                    boxShadow: "0px 1px 2px 0px #1018280D",
                  }}
                  type="text"
                  {...register("full_name")}
                  placeholder="Tên của bạn *"
                />
              </div>
              {errors.full_name && (
                <p className="text-red-600">{errors.full_name.message}</p>
              )}
            </div>
            <div className="rounded-2xl">
              <div className="border border-gray-300 rounded-lg">
                <input
                  className="outline-none w-full px-4 py-[10px] max-h-11 rounded-lg"
                  style={{
                    boxShadow: "0px 1px 2px 0px #1018280D",
                  }}
                  type="text"
                  {...register("email")}
                  placeholder="Email *"
                />
              </div>
              {errors.email && (
                <p className="text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="rounded-2xl">
              <div className="border border-gray-300 rounded-lg">
                <input
                  className="outline-none w-full px-4 py-[10px] max-h-11 rounded-lg"
                  style={{
                    boxShadow: "0px 1px 2px 0px #1018280D",
                  }}
                  type="text"
                  {...register("website")}
                  placeholder="Website"
                />
              </div>
              {errors.website && (
                <p className="text-red-600">{errors.website.message}</p>
              )}
            </div>
          </div>
          <div className="w-full lg:w-[20%] bg-blue-600 max-h-11 text__default_hover p-[10px] text-white rounded-lg inline-flex items-center">
            <button className="mx-auto text-base font-medium">
              Gửi câu hỏi
            </button>
          </div>
        </div>
      </form>
      {/* Q & A */}
      <div className="mt-8">
        {data.map((item: any) => (
          <div key={item.id} className="mt-5">
            <div className="flex space-x-4">
              <div className="w-2/12 md:w-1/12 flex space-x-2">
                <div className="h-8 w-8 md:w-11 md:h-11 rounded-full bg-[#4E6EB3] text-white place-content-center text-center">
                  <p className="text-base md:text-2xl font-medium">Q</p>
                </div>
              </div>
              <div className="w-7/12 md:w-8/12">
                <div className="flex space-x-3 items-center">
                  <a
                    target="_blank"
                    href="#"
                    className="text-sm md:text-18 font-semibold"
                    rel="ugc external nofollow"
                  >
                    {item.full_name}
                  </a>
                  <p className="w-4 h-[2px] bg-gray-300"></p>
                  <p className="text-sm">{item.created_at}</p>
                </div>
                <div className="text-sm md:text-base mt-1">{item.question}</div>
              </div>
              {/* <div className="w-3/12">
              <button className="flex w-full justify-end space-x-2 items-center opacity-70">
                <Image
                  className=" cursor-pointer h-3 w-3 md:h-4 md:w-4"
                  src="/icon/corner-up-left.svg"
                  alt="Icon"
                  width={32}
                  height={32}
                />
                <p className="text-sm md:text-18 text-blue-700 font-semibold">
                  Trả lời
                </p>
              </button>
            </div> */}
            </div>
            {item.answer && (
              <div className="px-3 mt-4 border-l border-gray-300">
                <div className="flex space-x-4">
                  <div className="w-2/12 md:w-1/12 flex space-x-2">
                    <div className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-[#F27145] text-white place-content-center text-center">
                      <p className="text-base md:text-2xl font-medium">A</p>
                    </div>
                  </div>
                  <div className="w-8/12">
                    <p className="text-sm md:text-18 font-semibold">
                      HappyBook Travel
                    </p>
                    <div
                      className="text-sm md:text-base leading-6 mt-1"
                      dangerouslySetInnerHTML={{
                        __html: item?.answer,
                      }}
                    ></div>
                  </div>
                  {/* <div className="w-2/12 md:w-3/12">
                <button className="flex w-full justify-end space-x-2 items-center opacity-70">
                  <Image
                    className=" cursor-pointer h-4 w-4"
                    src="/icon/corner-up-left.svg"
                    alt="Icon"
                    width={32}
                    height={32}
                  />
                </button>
              </div> */}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="max-w-40 mx-auto mt-6">
        <LoadingButton isLoading={loading} text="Xem thêm" />
      </div>
    </div>
  );
}
