"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { handleSessionStorage, renderTextContent } from "@/utils/Helper";
import { toast } from "react-hot-toast";
import { notFound, useRouter } from "next/navigation";
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
import { PaymentApi } from "@/api/Payment";
import { BookingProductApi } from "@/api/BookingProduct";
import { PageApi } from "@/api/Page";
import QRCodeDisplay from "@/components/Payment/QRCodeDisplay";
import { format } from "date-fns";

export default function BookingDetail() {
  const { t } = useTranslation();
  const router = useRouter();
  const { language } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isStickySideBar, setStickySideBar] = useState<boolean>(false);
  const messages = validationMessages[language as "vi" | "en"];
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const [isOpenBookingDetail, setIsOpenBookingDetail] = useState(true);
  const [loadingSubmitForm, setLoadingSubmitForm] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("onepay");
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [onePayFee, setOnePayFee] = useState<number>(0);
  const [isGeneratingPaymentUrl, setIsGeneratingPaymentUrl] = useState<boolean>(false);
  const [qrCodeGenerated, setQrCodeGenerated] = useState<boolean>(false);
  const [vietQrData, setVietQrData] = useState<any>({});
  const [transferInformation, setTransferInformation] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CheckOutBodyType>({
    resolver: zodResolver(CheckOutBody(messages)),
    mode: "onSubmit",
    defaultValues: {
      payment_method: "onepay",
    },
  });

  useEffect(() => {
    const bookingData = handleSessionStorage("get", "bookingFastTrack");
    setLoading(false);
    if (bookingData) {
      setData(bookingData);
      // Default payment method to onepay
      setValue("payment_method", "onepay");
      setSelectedPaymentMethod("onepay");
    }
  }, [setValue]);

  useEffect(() => {
    if (data?.code) {
      PaymentApi.checkPaymentStatus(data.code).then((response) => {
        if (response?.payload?.data?.paid === true) {
          setIsPaid(true);
        }
      });
    }
  }, [data?.code]);

  useEffect(() => {
    if (selectedPaymentMethod === "onepay") {
      const totalPrice = data?.total_price || 0;
      const totalDiscount = data?.total_discount || 0;
      setOnePayFee((totalPrice - totalDiscount) * 0.025);
    } else {
      setOnePayFee(0);
      if (selectedPaymentMethod === 'vietqr' && !qrCodeGenerated && data?.code) {
        // Sử dụng trực tiếp bookingData từ sessionStorage để tạo receipt
        const totalPrice = data?.total_price || 0;
        const totalDiscount = data?.total_discount || 0;
        const total = totalPrice - totalDiscount;
        // const total = 2000; => test case
        const orderCode = data?.code;

        if (total > 0 && orderCode) {
          PaymentApi.createReceipt({
            "payment_method_id": 5,
            "total_amount": total,
            "description": "Thu đơn hàng",
            "note": "KH chuyển khoản",
            "allocations": [
              {
                "ref_type": "order",
                "ref_code": orderCode,
                "amount": total
              }
            ]
          })
            .then((receiptResult: any) => {
              if (receiptResult?.data) {
                setQrCodeGenerated(true);
                setVietQrData(receiptResult?.data);
              } else {
                throw new Error("Không thể tạo receipt");
              }
            })
            .catch((error) => {
              console.error("Error creating receipt:", error);
              toast.error("Không thể tạo mã QR thanh toán. Vui lòng thử lại.");
            });
        }
      }
    }
  }, [selectedPaymentMethod, qrCodeGenerated, data]);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setStickySideBar(true);
    } else {
      setStickySideBar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    if (window.scrollY) setStickySideBar(true);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (selectedPaymentMethod !== "vietqr") {
      setQrCodeGenerated(false);
    }
  }, [selectedPaymentMethod]);

  const getTransferInformation = async () => {
    PageApi.getContent("thong-tin-chuyen-khoan").then((result: any) => {
      setTransferInformation(result?.payload?.data);
    });
  };

  useEffect(() => {
    getTransferInformation();
  }, []);

  const onSubmit = async (dataForm: CheckOutBodyType) => {
    if (!data?.code) {
      toast.error("Không tìm thấy mã đơn hàng");
      return;
    }

    if (!dataForm.payment_method) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    const finalData = {
      code: data.code,
      payment_method: dataForm.payment_method,
    };
    
    try {
      setLoadingSubmitForm(true);
      
      // Bước 1: Cập nhật phương thức thanh toán
      const respon = await BookingProductApi.updatePaymentMethod(finalData);
      
      if (respon?.status === 200) {
        reset();
        toast.success(toaStrMsg.sendSuccess);

        // Bước 2: Xử lý theo phương thức thanh toán
        if (selectedPaymentMethod === "onepay") {
          setIsGeneratingPaymentUrl(true);
          try {
            const paymentResult = await PaymentApi.onePayForProduct(data.code);
            
            if (paymentResult?.success && paymentResult?.payment_url) {
              // Redirect đến trang thanh toán OnePay
              window.location.href = paymentResult.payment_url;
            } else {
              setIsGeneratingPaymentUrl(false);
              toast.error(paymentResult?.message || "Không thể tạo link thanh toán. Vui lòng thử lại.");
            }
          } catch (paymentError: any) {
            setIsGeneratingPaymentUrl(false);
            console.error("Error generating payment URL:", paymentError);
            toast.error("Có lỗi xảy ra khi tạo link thanh toán. Vui lòng thử lại.");
          }
        } else if (selectedPaymentMethod === "vietqr") {
          // VietQR - QR code đã được generate trong useEffect, không cần xử lý gì thêm ở đây
          // Chỉ cần đảm bảo payment_method đã được cập nhật
        }
      } else {
        const errorMessage = respon?.payload?.message || respon?.payload?.errors || toaStrMsg.sendFailed;
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error updating payment method:", error);
      const errorMessage = error?.payload?.message || error?.message || toaStrMsg.error;
      toast.error(errorMessage);
    } finally {
      setLoadingSubmitForm(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`flex my-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center`}
      >
        <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
        <span className="text-18">Đang tải thông tin đặt chỗ...</span>
      </div>
    );
  }
  if (!data) notFound();

  const totalPrice = data?.total_price || 0;
  const totalDiscount = data?.total_discount || 0;
  const finalTotal = totalPrice + onePayFee - totalDiscount;

  return (
    <div className="flex flex-col-reverse items-start md:flex-row md:space-x-8 lg:mt-4 pb-8">
      <div className="w-full md:w-7/12 lg:w-8/12 mt-4 md:mt-0">
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

        {isPaid && (
          <div className="mt-6 bg-white text-green-700 font-bold px-4 py-3 rounded w-full text-base">
            <p data-translate="true">
              HappyBook đã nhận được khoản thanh toán thành công cho đơn hàng
              {data?.code && `: ${data.code}`}
            </p>
            <p data-translate="true">
              HappyBook sẽ gửi xác nhận đơn hàng trong thời gian không quá 24h.
            </p>
          </div>
        )}

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
                  <div className="w-3/4">
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
                {data?.note && (
                  <div className="flex space-x-2 mt-3">
                    <p className="w-1/4 text-gray-700">
                      {t("yeu_cau_dac_biet")}
                    </p>
                    <p className="w-3/4 font-medium">{data?.note}</p>
                  </div>
                )}

                {/* Thông tin khách hàng (customer type, guest list) */}
                {data?.booking?.customer_type && (
                  <div className="flex space-x-2 mt-3">
                    <p className="w-1/4 text-gray-700">Phân loại khách</p>
                    <p className="w-3/4 font-medium">
                      {data.booking.customer_type === "personal"
                        ? "Cá nhân"
                        : "Đoàn"}
                    </p>
                  </div>
                )}

                {data?.booking?.guest_list &&
                  Array.isArray(data.booking.guest_list) &&
                  data.booking.guest_list.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="w-full text-gray-700 font-semibold mb-2">
                        Danh sách khách
                      </p>
                      {data.booking.guest_list.map((guest: any, index: number) => (
                        <div
                          key={index}
                          className="mb-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <p className="font-medium text-sm mb-1">
                            Khách {index + 1}
                          </p>
                          {guest.name && (
                            <p className="text-sm">
                              <span className="text-gray-600">Họ tên: </span>
                              {guest.name}
                            </p>
                          )}
                          {guest.phone && (
                            <p className="text-sm">
                              <span className="text-gray-600">SĐT: </span>
                              {guest.phone}
                            </p>
                          )}
                          {guest.email && (
                            <p className="text-sm">
                              <span className="text-gray-600">Email: </span>
                              {guest.email}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                {/* Thông tin chuyến bay */}
                {(data?.booking?.flight_number ||
                  data?.booking?.flight_time ||
                  data?.booking?.flight_date ||
                  data?.booking?.flight_arrival_time) && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="w-full text-gray-700 font-semibold mb-2">
                      Thông tin chuyến bay
                    </p>
                    {data.booking.flight_number && (
                      <div className="flex space-x-2 mt-2">
                        <p className="w-1/4 text-gray-600 text-sm">
                          Số hiệu chuyến bay:
                        </p>
                        <p className="w-3/4 font-medium text-sm">
                          {data.booking.flight_number}
                        </p>
                      </div>
                    )}
                    {data.booking.flight_time && (
                      <div className="flex space-x-2 mt-2">
                        <p className="w-1/4 text-gray-600 text-sm">Giờ bay:</p>
                        <p className="w-3/4 font-medium text-sm">
                          {data.booking.flight_time}
                        </p>
                      </div>
                    )}
                    {data.booking.flight_arrival_time && (
                      <div className="flex space-x-2 mt-2">
                        <p className="w-1/4 text-gray-600 text-sm">Giờ đáp:</p>
                        <p className="w-3/4 font-medium text-sm">
                          {data.booking.flight_arrival_time}
                        </p>
                      </div>
                    )}
                    {data.booking.flight_date && (
                      <div className="flex space-x-2 mt-2">
                        <p className="w-1/4 text-gray-600 text-sm">Ngày bay:</p>
                        <p className="w-3/4 font-medium text-sm">
                          {data.booking.flight_date}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Thông tin vé đã chọn */}
                {data?.booking?.tickets &&
                  Array.isArray(data.booking.tickets) &&
                  data.booking.tickets.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="w-full text-gray-700 font-semibold mb-2">
                        Vé đã chọn
                      </p>
                      {data.booking.tickets.map((ticket: any, index: number) => (
                        <div key={index} className="mb-2 text-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-gray-600 font-medium">
                                {ticket.name || `Vé ${index + 1}`}:
                              </span>{" "}
                              <span className="font-medium">
                                {ticket.quantity} vé
                              </span>
                            </div>
                            {ticket.price && (
                              <DisplayPrice
                                className="!text-sm !font-semibold"
                                price={ticket.price * ticket.quantity}
                                currency={data?.product?.currency}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Phụ phí đã chọn */}
                {data?.booking?.additional_fees &&
                  Array.isArray(data.booking.additional_fees) &&
                  data.booking.additional_fees.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="w-full text-gray-700 font-semibold mb-2">
                        Phụ phí đã chọn
                      </p>
                      {data.booking.additional_fees.map(
                        (fee: any, index: number) => (
                          <div key={index} className="mb-2 text-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-gray-600 font-medium">
                                  {fee.name || `Phụ phí ${index + 1}`}
                                </span>
                                {fee.description && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {fee.description}
                                  </p>
                                )}
                              </div>
                              {fee.price && (
                                <DisplayPrice
                                  className="!text-sm !font-semibold"
                                  price={fee.price}
                                  currency={data?.product?.currency}
                                />
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {!isPaid  && (
          <form id="frmPayment" onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-6">
              <p className="font-bold text-18">
                {t("hinh_thuc_thanh_toan")}
              </p>
              <div className="bg-white rounded-xl p-3 md:p-6 mt-3">
              <div className="flex space-x-3 items-start ">
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
          
                <div className="flex space-x-3 md:items-center mt-4">
                  <input
                    type="radio"
                    value="onepay"
                    id="payment_onepay"
                    {...register("payment_method")}
                    className="w-5 h-5 mt-[2px]"
                    checked={selectedPaymentMethod === "onepay"}
                    onChange={(e) => {
                      setValue("payment_method", e.target.value);
                      setSelectedPaymentMethod(e.target.value);
                    }}
                  />
                  <label
                    htmlFor="payment_onepay"
                    className="flex md:items-center gap-1"
                  >
                    <div className="font-normal">
                      <Image
                        src="/payment-method/visa.svg"
                        alt="Icon"
                        width={48}
                        height={28}
                        className="md:mt-1"
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
                  <p className="text-red-600 mt-2">
                    {errors.payment_method.message}
                  </p>
                )}
              </div>
            </div>
            {!isEmpty(vietQrData) && selectedPaymentMethod === "vietqr" && (
              <QRCodeDisplay
                vietQrData={vietQrData}
                order={{
                  sku: data?.code,
                  total_price: data?.total_price,
                  total_discount: data?.total_discount,
                }}
                isPaid={isPaid}
                setIsPaid={(paid) => setIsPaid(paid)}
              />
            )}
            <LoadingButton
              style={
                loadingSubmitForm ||
                isGeneratingPaymentUrl ||
                !selectedPaymentMethod ||
                (selectedPaymentMethod === "vietqr" && !isPaid)
                  ? "mt-6 bg-gray-300 disabled:cursor-not-allowed"
                  : "mt-6"
              }
              isLoading={loadingSubmitForm || isGeneratingPaymentUrl}
              text={
                isGeneratingPaymentUrl
                  ? "Đang tạo link thanh toán..."
                  : selectedPaymentMethod === "vietqr" && !isPaid
                    ? "Đang chờ thanh toán"
                    : "Thanh toán"
              }
              disabled={
                loadingSubmitForm ||
                isGeneratingPaymentUrl ||
                !selectedPaymentMethod ||
                (selectedPaymentMethod === "vietqr" && !isPaid)
              }
            />
          </form>
        )}
      </div>
      <div
        className={`md:w-5/12 lg:w-4/12 bg-white rounded-3xl ${
          isStickySideBar
            ? "sticky top-[1%] shadow-lg border-gray-200 border md:border-0 md:shadow-[unset] z-[99] md:top-20 lg:top-[140px] right:80px w-fit"
            : "w-full"
        }`}
      >
        <div className="overflow-hidden rounded-t-2xl">
          {data?.product?.image_location && (
            <Image
              src={`${data?.product?.image_url}/${data?.product?.image_location}`}
              alt={data?.product?.name || "Fast Track"}
              width={600}
              height={450}
              className="w-full h-auto rounded-t-2xl hover:scale-110 ease-in duration-300"
            />
          )}
        </div>
        <div className="py-3 px-5">
          <h2 className="text-xl font-semibold" data-translate="true">
            {renderTextContent(data?.product?.name)}
          </h2>
          <div className="mt-4 pt-4 border-t border-t-gray-200">
            {onePayFee > 0 && (
              <div className="flex justify-between mb-1 text-red-600 font-semibold">
                <span className="text-sm" data-translate="true">
                  Phí xử lý giao dịch thẻ quốc tế (2.5%)
                </span>
                <DisplayPrice
                  price={onePayFee}
                  currency={data?.product?.currency}
                />
              </div>
            )}
            {totalDiscount > 0 ? (
              <DisplayPriceWithDiscount
                price={totalPrice}
                totalDiscount={totalDiscount}
                currency={data?.product?.currency}
              />
            ) : (
              totalPrice > 0 && (
                <div className="w-full flex justify-between">
                  <DisplayPrice
                    textPrefix={"Tổng cộng"}
                    price={finalTotal}
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

