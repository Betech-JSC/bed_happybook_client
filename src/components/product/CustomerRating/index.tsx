"use client";
import Image from "next/image";
import { Fragment, useCallback, useEffect, useState } from "react";
import RatingCriteria from "./RatingCriteria";
import LoadingButton from "@/components/base/LoadingButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  CustomerRatingSchema,
  CustomerRatingType,
} from "@/schemaValidations/customerRating.schema";
import { labelsRating } from "@/constants/product";
import { ProductRating } from "@/api/ProductRating";
import { buildSearch, getLabelRatingProduct } from "@/utils/Helper";
import { format, isValid } from "date-fns";
import { HttpError } from "@/lib/error";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { translateText } from "@/utils/translateApi";
import { labelRatingStaticText } from "@/constants/staticText";
import { formatTranslationMap } from "@/utils/translateDom";
import { toastMessages, validationMessages } from "@/lib/messages";

export default function CustomerRating({
  product_id,
  total_rating,
  average_rating,
  average_tour_guide_rating,
  average_route_rating,
  average_transportation_rating,
  average_price_rating,
}: {
  product_id: number;
  total_rating: number;
  average_rating: number;
  average_tour_guide_rating: number;
  average_route_rating: number;
  average_transportation_rating: number;
  average_price_rating: number;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [tooManyRequestsErr, setTooManyRequestsErr] = useState<string>("");
  const [translatedStaticText, setTranslatedStaticText] = useState<{}>({});
  const { language } = useLanguage();
  const messages = validationMessages[language as "vi" | "en"];
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const criteria = [
    { id: 2, name: "Hướng dẫn viên" },
    { id: 3, name: "Lộ trình" },
    { id: 4, name: "Phương tiện đưa đón" },
    { id: 5, name: "Giá cả" },
  ];

  useEffect(() => {
    translateText(labelRatingStaticText, language).then((translated) => {
      const translationMap = formatTranslationMap(
        labelRatingStaticText,
        translated
      );
      setTranslatedStaticText(translationMap);
    });
  }, [language]);

  const [ratings, setRatings] = useState(Array(criteria.length).fill(5));
  const [hover, setHover] = useState(Array(criteria.length).fill(0));

  const handleRating = (index: number, value: number) => {
    const newRatings = [...ratings];
    newRatings[index] = value;
    setRatings(newRatings);
  };

  const handleHover = (index: number, value: number) => {
    const newHover = [...hover];
    newHover[index] = value;
    setHover(newHover);
  };

  const calculateAverageRating = () => {
    const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
    return Math.round(totalRating / criteria.length);
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CustomerRatingType>({
    resolver: zodResolver(CustomerRatingSchema(messages)),
  });

  const onSubmit = async (data: CustomerRatingType) => {
    try {
      setLoading(true);
      setTooManyRequestsErr("");
      const enrichedData = {
        ...data,
        product_id: product_id,
        ratings: ratings,
      };
      const response = await ProductRating.send(enrichedData);
      if (response?.status === 200) {
        reset();
        toast.dismiss();
        toast.success(toaStrMsg.sendSuccess);
        setOpenModal(false);
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
  const [dataRating, setDataRating] = useState<any>([]);
  const loadData = useCallback(async () => {
    try {
      setLoadingLoadMore(true);
      const search = buildSearch(query);
      const res = await ProductRating.list(
        `/product/rating/list/${product_id}${search}`
      );
      console.log("12121", res);
      const result = res?.payload?.data;
      setDataRating((prevData: any) => [...prevData, ...result.items]);
      if (result?.last_page === query.page) {
        setIsLastPage(true);
      }
    } catch (error) {
      console.log("Error search: " + error);
    } finally {
      setLoadingLoadMore(false);
    }
  }, [query, product_id]);

  useEffect(() => {
    loadData();
  }, [query, loadData]);

  return (
    <Fragment>
      <h2
        className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
        data-translate
      >
        Đánh giá
      </h2>
      <div className="mt-4 flex flex-col md:flex-row md:space-x-6 bg-gray-50 p-6 rounded-xl items-center">
        <div className="w-full md:w-[30%] text-center px-9 flex flex-col mb-5 md:mb-0">
          <p className="text-primary font-semibold mt-1">
            {getLabelRatingProduct(average_rating, language)}
          </p>
          <div className="w-[106px] mt-1 h-9 mx-auto rounded-2xl rounded-tr bg-primary text-white font-semibold flex items-center justify-center">
            <p className="text-[26px] leading-[39px] mr-1">{average_rating}</p>
            <p className="text-xl opacity-50">/10</p>
          </div>
          <div className="text-gray-500 mt-1">
            <span>{total_rating} </span>
            <span data-translate>đánh giá</span>
          </div>
          <div
            onClick={() => setOpenModal(true)}
            className="mt-3 bg-blue-600 text__default_hover p-[10px] text-white rounded-lg inline-flex w-full items-center"
          >
            <button className="mx-auto text-sm font-medium" data-translate>
              Gửi đánh giá
            </button>
          </div>
        </div>
        <div className="w-full md:w-[70%]">
          <div className="grid grid-grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p data-translate>Hướng dẫn viên</p>
              <div className="flex space-x-2 items-center h-6">
                <div className="w-full bg-gray-200 rounded-3xl">
                  <p
                    className="h-3 rounded-3xl"
                    style={{
                      background:
                        "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                      width: `${average_tour_guide_rating * 10}%`,
                    }}
                  ></p>
                </div>
                <p className="w-6">
                  {average_tour_guide_rating > 0
                    ? average_tour_guide_rating
                    : ""}
                </p>
              </div>
            </div>
            <div>
              <p data-translate>Lộ trình</p>
              <div className="flex space-x-2 items-center h-6">
                <div className="w-full bg-gray-200 rounded-3xl">
                  <p
                    className="h-3 rounded-3xl"
                    style={{
                      background:
                        "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                      width: `${average_route_rating * 10}%`,
                    }}
                  ></p>
                </div>
                <p className="w-6">
                  {average_route_rating > 0 ? average_route_rating : ""}
                </p>
              </div>
            </div>
            <div>
              <p data-translate>Phương tiện đưa đón</p>
              <div className="flex space-x-2 items-center h-6">
                <div className="w-full bg-gray-200 rounded-3xl">
                  <p
                    className="h-3 rounded-3xl"
                    style={{
                      background:
                        "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                      width: `${average_transportation_rating * 10}%`,
                    }}
                  ></p>
                </div>
                <p className="w-6">
                  {average_transportation_rating > 0
                    ? average_transportation_rating
                    : ""}
                </p>
              </div>
            </div>
            <div>
              <p data-translate>Giá cả</p>
              <div className="flex space-x-2 items-center h-6">
                <div className="w-full bg-gray-200 rounded-3xl">
                  <p
                    className="h-3 rounded-3xl"
                    style={{
                      background:
                        "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                      width: `${average_price_rating * 10}%`,
                    }}
                  ></p>
                </div>
                <p className="w-6">
                  {average_price_rating > 0 ? average_price_rating : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {dataRating.map((item: any) => (
        <div className="mt-5" key={item.id}>
          <div className="flex space-x-4">
            <div className="w-11 h-11 rounded-full bg-gray-50 place-content-center text-center">
              <p className="">OR</p>
            </div>
            <div>
              <div className="flex space-x-4 items-center">
                <p className="text-sm md:text-18 font-semibold" data-translate>
                  {item?.full_name}
                </p>
                <p className="w-4 h-1 bg-gray-300"></p>
                <div className="text-sm md:text-base flex space-x-1 md:space-x-2 bg-gray-100 rounded-sm p-2 items-center">
                  <p className="text-sm md:text-base text-blue-900 font-semibold">
                    {item.average_rating}{" "}
                    <span className="font-semibold opacity-50 text-black">
                      /10
                    </span>
                  </p>
                  <p className="text-sm text-blue-900 font-semibold">
                    {getLabelRatingProduct(item.average_rating, language)}
                  </p>
                </div>
              </div>
              <p className="text-sm">
                {isValid(new Date(item.created_at))
                  ? format(item.created_at, "dd/MM/yyyy")
                  : ""}
              </p>
            </div>
          </div>
          <div
            data-translate
            className="text-sm md:text-base mt-3"
            dangerouslySetInnerHTML={{
              __html: item?.message ? item?.message : "",
            }}
          ></div>
        </div>
      ))}
      {dataRating?.length > 0 && !isLastPage && (
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
      {/* Popup */}
      <div
        className={`fixed transition-opacity visible duration-300 px-3 md:px-0 inset-0  bg-black bg-opacity-50 flex justify-center items-center ${
          openModal ? "visible z-[9999]" : "invisible z-[-1]"
        }`}
        style={{
          opacity: openModal ? "100" : "0",
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white h-max p-6 max-w-[680px] max-h-[500px] md:max-h-[680px] overflow-y-auto rounded-2xl text-base"
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-22 font-bold" data-translate>
              Đánh giá
            </p>
            <button
              className="text-xl"
              onClick={() => setOpenModal(false)}
              type="button"
            >
              <Image
                src="/icon/close.svg"
                alt="Icon"
                className="h-10"
                width={20}
                height={20}
              />
            </button>
          </div>
          <p className="text-gray-700 mb-4" data-translate>
            Chúng tôi rất mong nhận được ý kiến của bạn để nâng cao chất lượng
            dịch vụ.
          </p>

          <RatingCriteria
            index={20}
            criterion={"Đánh giá chung"}
            rating={calculateAverageRating()}
            labelsRating={labelsRating}
            translatedStaticText={translatedStaticText}
          />
          <div className="mt-4 rounded-xl">
            <div className="mt-3 rounded-xl">
              <div className="relative">
                <label
                  htmlFor="fullName"
                  className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                  data-translate
                >
                  Họ và tên <span className="text-red-500">*</span>
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
                      data-translate
                    >
                      Số điện thoại <span className="text-red-500">*</span>
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
                      data-translate
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
                <textarea
                  id="message"
                  rows={1}
                  {...register("message")}
                  placeholder="Hãy chia sẻ đánh giá của bạn"
                  className="text-sm w-full border border-gray-300 rounded-md p-3 placeholder-gray-400 outline-none focus:border-primary"
                />
                {errors.message && (
                  <p className="text-red-600">{errors.message.message}</p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="mb-4" data-translate>
              Về các tiêu chí sau:
            </p>
            {criteria.map((criterion, index) => (
              <RatingCriteria
                key={criterion.id}
                index={index}
                criterion={criterion.name}
                labelsRating={labelsRating}
                rating={ratings[index]}
                hover={hover[index + 2]}
                onRate={handleRating}
                onHover={handleHover}
                translatedStaticText={translatedStaticText}
              />
            ))}
          </div>
          <div className="flex flex-wrap space-y-2">
            <LoadingButton isLoading={loading} text={"Gửi"} data-translate />
          </div>
          <p className="text-red-600 my-2 text-center">{tooManyRequestsErr}</p>
        </form>
      </div>
    </Fragment>
  );
}
