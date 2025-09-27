"use client";
import { formatCurrency, formatTime, formatTimeZone } from "@/lib/formatters";
import Image from "next/image";
import { Fragment, useCallback, useEffect, useState } from "react";
import { differenceInSeconds, format, parse, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { handleSessionStorage } from "@/utils/Helper";
import { toast } from "react-hot-toast";
import { notFound, useRouter } from "next/navigation";
import { BookingDetailProps } from "@/types/flight";
import LoadingButton from "@/components/base/LoadingButton";
import { FlightApi } from "@/api/Flight";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckOutBody,
  CheckOutBodyType,
} from "@/schemaValidations/checkOut.schema";
import QRCodeDisplay from "@/components/Payment/QRCodeDisplay";
import { isEmpty } from "lodash";
import { PaymentApi } from "@/api/Payment";
import { useLanguage } from "@/contexts/LanguageContext";
import { toastMessages, validationMessages } from "@/lib/messages";
import { useTranslation } from "@/hooks/useTranslation";
import CountDownCheckOut from "@/app/ve-may-bay/components/CountDownCheckOut";

export default function OrderFlightDetail({ detail }: any) {
  const { t } = useTranslation();
  const router = useRouter();
  const { language } = useLanguage();
  const [loadingSubmitForm, setLoadingSubmitForm] = useState<boolean>(false);
  const [ticketPaymentTimeout, setTicketPaymentTimeout] =
    useState<boolean>(false);
  const [qrCodeGenerated, setQrCodeGenerated] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [vietQrData, setVietQrData] = useState<any>({});
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const messages = validationMessages[language as "vi" | "en"];
  const toaStrMsg = toastMessages[language as "vi" | "en"];

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
  const onSubmit = (dataForm: CheckOutBodyType) => {
    const finalData = {
      ...dataForm,
      sku: detail.sku,
    } as CheckOutBodyType & { sku: string };
    const updatePaymentMethod = async () => {
      try {
        setLoadingSubmitForm(true);
        const respon = await FlightApi.updatePaymentMethod(finalData);
        if (respon?.status === 200) {
          reset();
          toast.success(toaStrMsg.sendSuccess);

          if (selectedPaymentMethod === "onepay") {
            PaymentApi.onePay(detail.sku).then((result: any) => {
              if (result?.payment_url) {
                window.location.href = result.payment_url;
              }
            });
          } else {
            setTimeout(() => {
              router.push("/ve-may-bay");
            }, 1000);
          }
        } else {
          toast.error(toaStrMsg.sendFailed);
        }
      } catch (error: any) {
        toast.error(toaStrMsg.error);
      } finally {
        setLoadingSubmitForm(false);
      }
    };
    if (finalData) {
      updatePaymentMethod();
    }
  };

  useEffect(() => {
    if (detail?.sku) {
      PaymentApi.checkPaymentStatus(detail?.sku).then((response) => {
        if (response?.payload?.data?.paid === true) {
          setIsPaid(true);
        }
      });
    }
  }, [detail?.sku]);

  const handleTicketPaymentTimeout = () => {
    setTicketPaymentTimeout(true);
  };


  useEffect(() => {
    if (selectedPaymentMethod !== "vietqr") {
      setQrCodeGenerated(false);
    }
  }, [selectedPaymentMethod]);

  return (
    <div className="flex flex-col-reverse items-start md:flex-row md:space-x-8 lg:mt-4 pb-8">
      <div className="w-full mt-4 md:mt-0 ">
        <div
          className="rounded-2xl"
          style={{
            background:
              "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:space-x-4 justify-center px-4 lg:px-0 py-4">
            {!isPaid ? (
              <Fragment>
                <p className="text-22 font-bold text-white">
                  {t("hoan_tat_don_hang_cua_ban_de_giu_gia_tot_nhat")}{" "}
                </p>
                {!ticketPaymentTimeout && detail.booking_deadline ? (
                  <CountDownCheckOut
                    timeCountDown={detail.booking_deadline}
                    handleTicketPaymentTimeout={handleTicketPaymentTimeout}
                  />
                ) : (
                  <div className="mt-3 lg:mt-0 flex space-x-2 items-center text-22 font-bold text-[#FF9258]">
                    <p>00:00:00</p>
                    <Image
                      src={`/icon/clock-stopwatch.svg`}
                      width={20}
                      height={20}
                      alt="Icon"
                      className="w-5 h-5"
                    />
                  </div>
                )}
              </Fragment>
            ) : (
              <p className="text-22 font-bold text-white">
                {t("da_thanh_toan")}
              </p>
            )}
          </div>
        </div>

        {!isPaid && (
          <form
            className="mt-6"
            id="frmPayment"
            onSubmit={handleSubmit(onSubmit)}
          >
            {!ticketPaymentTimeout && (
              <>
                <div className="mt-6">
                  <p className="font-bold text-18">
                    {t("hinh_thuc_thanh_toan")}
                  </p>
                  <div className="bg-white rounded-xl p-3 md:p-6 mt-3">
                    <div className="flex space-x-3 items-start">
                      <input
                        type="radio"
                        value="cash"
                        id="payment_cash"
                        {...register("payment_method")}
                        className="w-5 h-5 mt-[2px]"
                        onChange={(e) => {
                          setValue("payment_method", e.target.value);
                          setSelectedPaymentMethod(e.target.value);
                        }}
                      />
                      <label
                        htmlFor="payment_cash"
                        className="flex space-x-1 w-full"
                      >
                        <div className="font-normal">
                          <Image
                            src="/payment-method/cash.svg"
                            alt="Icon"
                            width={24}
                            height={24}
                            className="w-6 h-6"
                          />
                        </div>
                        <div className="max-w-[85%]">
                          <span className="font-medium text-base">
                            {t("thanh_toan_sau")}
                          </span>
                          <p className="text-gray-500">
                            {t(
                              "quy_khach_vui_long_giu_lien_lac_de_doi_ngu_cskh_lien_he_xac_nhan"
                            )}
                          </p>
                        </div>
                      </label>
                    </div>
                    <div className="flex space-x-3 items-start mt-4">
                      <input
                        type="radio"
                        value="vietqr"
                        id="payment_vietqr"
                        {...register("payment_method")}
                        className="w-5 h-5 mt-[2px]"
                        onChange={(e) => {
                          setValue("payment_method", e.target.value);
                          setSelectedPaymentMethod(e.target.value);
                        }}
                      />
                      <label
                        htmlFor="payment_vietqr"
                        className=" flex space-x-1"
                      >
                        <div className="font-normal">
                          <Image
                            src="/payment-method/transfer.svg"
                            alt="Icon"
                            width={24}
                            height={24}
                            className="w-6 h-6"
                          />
                        </div>
                        <div>
                          <span className="font-medium text-base max-width-[85%]">
                            {t("thanh_toan_quet_ma_qr_ngan_hang")}
                          </span>
                        </div>
                      </label>
                    </div>
                    <div className="flex space-x-3 items-start mt-4">
                      <input
                        type="radio"
                        value="onepay"
                        id="payment_onepay"
                        {...register("payment_method")}
                        className="w-5 h-5 mt-[2px]"
                        onChange={(e) => {
                          setValue("payment_method", e.target.value);
                          setSelectedPaymentMethod(e.target.value);
                        }}
                      />
                      <label
                        htmlFor="payment_onepay"
                        className=" flex items-center gap-1"
                      >
                        <div className="font-normal">
                          <Image
                            src="/payment-method/onepay.svg"
                            alt="Icon"
                            width={64}
                            height={64}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <span className="font-medium text-base max-width-[85%]">
                            {t("thanh_toan_visa_master_card_jcb")}
                          </span>
                        </div>
                      </label>
                    </div>

                    {errors.payment_method && (
                      <p className="text-red-600">
                        {errors.payment_method.message}
                      </p>
                    )}
                  </div>
                </div>
                {!isEmpty(vietQrData) && selectedPaymentMethod === "vietqr" && (
                  <QRCodeDisplay
                    vietQrData={vietQrData}
                    order={detail}
                    isPaid={isPaid}
                    setIsPaid={(paid) => setIsPaid(paid)}
                  />
                )}
              </>
            )}
            <div className="mt-4">
              <LoadingButton
                isLoading={loadingSubmitForm}
                text={
                  ticketPaymentTimeout
                    ? "Đã hết thời gian thanh toán"
                    : isPaid
                      ? "Hoàn tất thanh toán"
                      : "Xác nhận thanh toán"
                }
                disabled={
                  ticketPaymentTimeout ||
                    !selectedPaymentMethod ||
                    (selectedPaymentMethod === "vietqr" && !isPaid)
                    ? true
                    : false
                }
                style={
                  ticketPaymentTimeout ||
                    !selectedPaymentMethod ||
                    (selectedPaymentMethod === "vietqr" && !isPaid)
                    ? "bg-gray-300 disabled:cursor-not-allowed"
                    : ""
                }
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
