"use client";
import LoadingButton from "@/components/base/LoadingButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  QuestionAndAnswerSchema,
  QuestionAndAnswerType,
} from "@/schemaValidations/questionAndAnswer.schema";
import { useCallback, useEffect, useState } from "react";
import { ProductFaqs } from "@/api/ProductFaqs";
import { buildSearch } from "@/utils/Helper";
import { format, isValid } from "date-fns";
import { HttpError } from "@/lib/error";
import { toastMessages, validationMessages } from "@/lib/messages";
import { useLanguage } from "@/contexts/LanguageContext";

export default function QuestionAndAnswer({
  productId,
}: {
  productId: number | string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [tooManyRequestsErr, setTooManyRequestsErr] = useState<string>("");
  const { language } = useLanguage();
  const messages = validationMessages[language as "vi" | "en"];
  const toaStrMsg = toastMessages[language as "vi" | "en"];

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<QuestionAndAnswerType>({
    resolver: zodResolver(QuestionAndAnswerSchema(messages)),
  });

  const onSubmit = async (data: QuestionAndAnswerType) => {
    try {
      setLoading(true);
      setTooManyRequestsErr("");
      const enrichedData = {
        ...data,
        product_id: productId,
      };
      const response = await ProductFaqs.send(enrichedData);
      if (response?.status === 200) {
        reset();
        toast.dismiss();
        toast.success(toaStrMsg.sendSuccess);
      }
    } catch (error: any) {
      if (error instanceof HttpError) {
        if (error.status === 429) {
          setTooManyRequestsErr(toaStrMsg.tooManyRequests);
        } else if (error?.payload?.errors) {
          Object.keys(error?.payload?.errors).forEach((field: any) => {
            setError(field, {
              type: "server",
              message: error?.payload?.errors[field][0],
            });
          });
        }
      } else {
        toast.error(toaStrMsg.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const [query, setQuery] = useState<{ page: number; locale: string }>({
    page: 1,
    locale: language,
  });
  const [loadingLoadMore, setLoadingLoadMore] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const loadData = useCallback(async () => {
    try {
      setLoadingLoadMore(true);
      const search = buildSearch(query);
      const res = await ProductFaqs.list(
        `/product/faqs/list/${productId}${search}`
      );
      const result = res?.payload?.data;
      setData((prevData: any) => [...prevData, ...result.items]);
      if (result?.last_page === query.page) {
        setIsLastPage(true);
      }
    } catch (error) {
      console.log("Error search: " + error);
    } finally {
      setLoadingLoadMore(false);
    }
  }, [query, productId]);

  useEffect(() => {
    loadData();
  }, [query, loadData]);

  return (
    <div className="rounded-2xl bg-white p-6">
      <h3
        className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
        data-translate
      >
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
            {...register("question_content")}
            placeholder="Mời bạn nhập thắc mắc hoặc ý kiến của bạn"
          ></textarea>{" "}
          {errors.question_content && (
            <p className="text-red-600 my-2">
              {errors.question_content.message}
            </p>
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
              <span
                className={`${loading ? "loader_spiner h-auto" : "h-0"}`}
              ></span>

              <span
                data-translate
                className={`${loading ? "hidden" : "inline-block w-max"}`}
              >
                Gửi câu hỏi
              </span>
            </button>
          </div>
        </div>
        <p className="text-red-600 my-2 text-center">{tooManyRequestsErr}</p>
      </form>
      {/* Q & A */}
      <div className="mt-8">
        {data.map((item: any, index: number) => (
          <div key={index} className="mt-5">
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
                    data-translate
                  >
                    {item.full_name}
                  </a>
                  <p className="w-4 h-[2px] bg-gray-300"></p>
                  <p className="text-sm">
                    {" "}
                    {isValid(new Date(item.created_at))
                      ? format(item.created_at, "dd/MM/yyyy")
                      : ""}
                  </p>
                </div>
                <div
                  data-translate
                  className="text-sm md:text-base mt-1"
                  dangerouslySetInnerHTML={{
                    __html: item?.question_content ?? "",
                  }}
                ></div>
              </div>
              {/* <div className="w-3/12">
              <button className="flex w-full justify-end space-x-2 items-center opacity-70">
                <Image
                  className=" cursor-pointer h-3 w-3 md:h-4 md:w-4"
                  src="/icon/corner-up-left.svg"
                  alt="Icon trả lời"
                  width={32}
                  height={32}
                />
                <p className="text-sm md:text-18 text-blue-700 font-semibold">
                  Trả lời
                </p>
              </button>
            </div> */}
            </div>
            {item.answer_content &&
              item.answer_content !== "Content is updating!" && (
                <div className="px-3 mt-4 border-l border-gray-300">
                  <div className="flex space-x-4">
                    <div className="w-2/12 md:w-1/12 flex space-x-2">
                      <div className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-[#F27145] text-white place-content-center text-center">
                        <p className="text-base md:text-2xl font-medium">A</p>
                      </div>
                    </div>
                    <div className="w-8/12">
                      <p className="text-sm md:text-18 font-semibold">
                        {"HappyBook Travel"}
                      </p>
                      <div
                        data-translate
                        className="text-sm md:text-base leading-6 mt-1"
                        dangerouslySetInnerHTML={{
                          __html: item?.answer_content,
                        }}
                      ></div>
                    </div>
                    {/* <div className="w-2/12 md:w-3/12">
                <button className="flex w-full justify-end space-x-2 items-center opacity-70">
                  <Image
                    className=" cursor-pointer h-4 w-4"
                    src="/icon/corner-up-left.svg"
                    alt="Icon trả lời"
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
      {data?.length > 0 && !isLastPage && (
        <div className="max-w-40 mx-auto mt-6">
          <button
            onClick={() => {
              setQuery({
                ...query,
                page: query.page + 1,
              });
            }}
            className="flex mx-auto group w-40 py-3 rounded-lg px-4 bg-white mt-6 space-x-2 border duration-300 text__default_hover
            justify-center items-center hover:border-primary"
          >
            {loadingLoadMore ? (
              <span className="loader_spiner"></span>
            ) : (
              <>
                <span data-translate>Xem thêm</span>
                <svg
                  className="group-hover:stroke-primary stroke-gray-700 duration-300"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
