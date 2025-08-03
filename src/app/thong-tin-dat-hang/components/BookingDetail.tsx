"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { handleSessionStorage } from "@/utils/Helper";
import { notFound, useRouter } from "next/navigation";
import { BookingDetailProps } from "@/types/flight";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckOutBody,
  CheckOutBodyType,
} from "@/schemaValidations/checkOut.schema";
import { isEmpty } from "lodash";
import { useLanguage } from "@/contexts/LanguageContext";
import { toastMessages, validationMessages } from "@/lib/messages";
import { useTranslation } from "@/hooks/useTranslation";
import DisplayPriceWithDiscount from "@/components/base/DisplayPriceWithDiscount";
import DisplayPrice from "@/components/base/DisplayPrice";
import LoadingButton from "@/components/base/LoadingButton";
import Link from "next/link";

export default function BookingDetail() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isStickySideBar, setStickySideBar] = useState<boolean>(false);
  const messages = validationMessages[language as "vi" | "en"];
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const [isOpenBookingDetail, setIsOpenBookingDetail] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CheckOutBodyType>({
    resolver: zodResolver(CheckOutBody(messages)),
    mode: "onSubmit",
  });

  useEffect(() => {
    const bookingData = handleSessionStorage("get", "bookingData");
    setLoading(false);
    if (bookingData) {
      setData(bookingData);
    }
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setStickySideBar(true);
    } else {
      setStickySideBar(false);
    }
  };

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll, { passive: true });
  //   if (window.scrollY) setStickySideBar(true);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  if (loading) {
    return (
      <div
        className={`flex my-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
      >
        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
        <span className="text-18">Loading...</span>
      </div>
    );
  }
  if (!data) notFound();
  return (
    <div className="flex flex-col-reverse items-start md:flex-row md:space-x-8 lg:mt-4 pb-8">
      <div className="w-full md:w-7/12 lg:w-8/12 mt-4 md:mt-0 ">
        <div
          className="rounded-2xl"
          style={{
            background:
              "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:space-x-4 justify-center px-4 lg:px-0 py-4">
            <p className="text-22 font-bold text-white">
              {t("thong_tin_don_hang")}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => setIsOpenBookingDetail(!isOpenBookingDetail)}
            className="bg-white text-gray-700 font-bold px-4 py-3 rounded flex justify-between w-full text-xl"
          >
            {t("chi_tiet_don_hang")}
            <svg
              width="22"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${isOpenBookingDetail ? "rotate-180" : "rotate-0"}`}
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="#283448"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div
            className={`bg-white border-t transition-all duration-300 overflow-hidden ${
              isOpenBookingDetail
                ? "max-h-[2500px] opacity-100 p-4"
                : "max-h-0 opacity-0 p-0"
            }`}
          >
            <div>
              <p className="font-bold text-18">{t("thong_tin_lien_he")}</p>
              <div className="bg-white rounded-xl p-3 md:p-6 mt-3 break-words border">
                <div className="flex space-x-2 pb-3 border-b border-gray-300">
                  <p className="w-1/4 text-gray-700">{t("ma_don_hang")}</p>
                  <p className="w-3/4 font-medium">{data?.code}</p>
                </div>

                <div className="flex space-x-2 mt-3">
                  <div className="w-1/4 text-gray-700">{t("ho_va_ten")}</div>
                  <div className="w-3/4 ">
                    <p className="font-bold">{data?.full_name}</p>
                  </div>
                </div>
                {data?.gender && (
                  <div className="flex space-x-2 mt-3">
                    <p className="w-1/4 text-gray-700">{t("gioi_tinh")}</p>
                    <p className="w-3/4 font-medium" data-translate="true">
                      {data?.gender === "male" ? "Nam" : "Nữ"}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2 mt-3">
                  <p className="w-1/4 text-gray-700">{t("so_dien_thoai")}</p>
                  <p className="w-3/4 font-medium">{data?.phone}</p>
                </div>

                <div className="flex space-x-2 mt-3">
                  <p className="w-1/4 text-gray-700">{t("email")}</p>
                  <p className="w-3/4 font-medium">{data?.email}</p>
                </div>
                {data?.message_requirement && (
                  <div className="flex space-x-2 mt-3">
                    <p className="w-1/4 text-gray-700">
                      {t("yeu_cau_dac_biet")}
                    </p>
                    <p className="w-3/4 font-medium">
                      {data?.message_requirement}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Link
          href="/"
          className="block w-full bg-blue-600 text-white py-2.5 rounded-lg text-center cursor-pointer text__default_hover mt-6"
        >
          {t("tro_ve_trang_chu")}
        </Link>
      </div>
      <div
        className={`md:w-5/12 lg:w-4/12 bg-white rounded-3xl  ${
          isStickySideBar
            ? "sticky top-[1%] shadow-lg border-gray-200 border md:border-0 md:shadow-[unset] z-[99] md:top-20 lg:top-[140px] right:80px w-fit"
            : "w-full"
        }`}
      >
        <div className="overflow-hidden rounded-t-2xl">
          <Image
            src={`${data?.product?.image_url}/${data?.product?.image_location}`}
            alt={data?.product?.name}
            width={600}
            height={450}
            className="w-full h-auto rounded-t-2xl hover:scale-110 ease-in duration-300"
          />
        </div>
        <div className="py-3 px-5">
          <h2 className="text-xl font-semibold">{data?.product?.name}</h2>
          <div className="flex justify-between gap-2 mt-4 pt-4 border-t border-t-gray-200">
            {data?.total_discount > 0 ? (
              <DisplayPriceWithDiscount
                price={data.total_price}
                totalDiscount={data?.total_discount}
                currency={data?.product?.currency}
              />
            ) : (
              data?.total_price > 0 && (
                <div className="w-full flex justify-between">
                  <DisplayPrice
                    textPrefix={"Tổng cộng"}
                    price={data.total_price}
                    currency={data?.product?.currency}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
