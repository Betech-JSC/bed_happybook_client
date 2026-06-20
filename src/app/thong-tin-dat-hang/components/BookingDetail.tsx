"use client";
import Image from "next/image";
import { useEffect, useState, useMemo, useRef } from "react";
import { getImageSrc, handleSessionStorage, renderTextContent } from "@/utils/Helper";
import { notFound, useRouter, useSearchParams } from "next/navigation";
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
import { PaymentApi } from "@/api/Payment";
import { BookingProductApi } from "@/api/BookingProduct";
import QRCodeDisplay from "@/components/Payment/QRCodeDisplay";
import { toast } from "react-hot-toast";

export default function BookingDetail() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isStickySideBar, setStickySideBar] = useState<boolean>(false);
  const messages = validationMessages[language as "vi" | "en"];
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const [isOpenBookingDetail, setIsOpenBookingDetail] = useState(true);

  // Payment State
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [onePayFee, setOnePayFee] = useState<number>(0);
  const [isGeneratingPaymentUrl, setIsGeneratingPaymentUrl] = useState<boolean>(false);
  const [qrCodeGenerated, setQrCodeGenerated] = useState<boolean>(false);
  const [vietQrData, setVietQrData] = useState<any>({});
  const [loadingSubmitForm, setLoadingSubmitForm] = useState<boolean>(false);
  const [pollingStatus, setPollingStatus] = useState<boolean>(false);
  const paymentWindowRef = useRef<Window | null>(null);
  const paidStatuses = useMemo(() => [
    "paid",
    "processing",
    "completed",
    "approved",
    "done",
    "price_confirmed",
    "issued",
    "issuing",
    "paid_book_failed",
    "pending_refund"
  ], []);
  const isPaidOrder = isPaid || paidStatuses.includes(data?.status?.toLowerCase() ?? "");

  // Lấy order_code từ URL
  const orderCodeFromUrl = searchParams.get("order_code");

  // Xác định phụ phí giờ bay thêm từ additional_fees
  const nightTimeSurchargeFee = useMemo(() => {
    if (!data?.booking?.additional_fees || !Array.isArray(data.booking.additional_fees)) {
      return null;
    }

    return data.booking.additional_fees.find(
      (fee: any) => fee.name === 'Phụ phí giờ bay thêm' ||
        fee.name?.toLowerCase().includes('phụ phí giờ bay thêm')
    );
  }, [data?.booking?.additional_fees]);

  // Lấy thông tin giờ bay để hiển thị giải thích
  const getNightTimeSurchargeInfo = useMemo(() => {
    if (!nightTimeSurchargeFee) return null;

    const flightTime = data?.booking?.flight_time;
    const flightArrivalTime = data?.booking?.flight_arrival_time;

    // Xác định giờ nào được dùng để tính phụ phí
    let timeInfo = '';
    if (flightArrivalTime) {
      timeInfo = `${t("gio_dap")}: ${flightArrivalTime}`;
    }
    if (flightTime) {
      if (timeInfo) {
        timeInfo += ` | ${t("gio_bay")}: ${flightTime}`;
      } else {
        timeInfo = `${t("gio_bay")}: ${flightTime}`;
      }
    }

    return {
      fee: nightTimeSurchargeFee,
      timeInfo: timeInfo || null,
    };
  }, [nightTimeSurchargeFee, data?.booking?.flight_time, data?.booking?.flight_arrival_time, t]);

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
      payment_method: "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    const fetchOrderData = async () => {
      // Ưu tiên đọc từ sessionStorage trước
      const bookingData = handleSessionStorage("get", "bookingData");
      if (bookingData) {
        setData(bookingData);
        setLoading(false);

        // Hậu cảnh: kiểm tra và xác thực lại trạng thái mới nhất từ server
        if (bookingData.code) {
          try {
            const response = await BookingProductApi.getByCode(bookingData.code);
            if (response?.payload?.data) {
              setData(response.payload.data);
              handleSessionStorage("set", "bookingData", response.payload.data);
            }
          } catch (error) {
            console.error("Error verifying order status in background:", error);
          }
        }
        return;
      }

      // Nếu không có sessionStorage, thử đọc từ URL
      if (orderCodeFromUrl) {
        try {
          const response = await BookingProductApi.getByCode(orderCodeFromUrl);
          if (response?.payload?.data) {
            setData(response.payload.data);
          } else {
            setData(null);
          }
        } catch (error) {
          console.error("Error fetching order:", error);
          setData(null);
        }
      } else {
        setData(null);
      }
      setLoading(false);
    };

    fetchOrderData();
  }, [orderCodeFromUrl]);

  const isFastTrack = data?.product?.product_type === "fast-track";
  const isEnglish = language === "en";
  const showPayPalOnly = isFastTrack && isEnglish;

  useEffect(() => {
    if (showPayPalOnly) {
      setValue("payment_method", "paypal");
      setSelectedPaymentMethod("paypal");
    } else {
      if (selectedPaymentMethod === "paypal") {
        setValue("payment_method", "");
        setSelectedPaymentMethod("");
      }
    }
  }, [showPayPalOnly, setValue]);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setStickySideBar(true);
    } else {
      setStickySideBar(false);
    }
  };

  // Payment Logic
  useEffect(() => {
    let interval: any;
    if (data?.code && !isPaid) {
      const checkStatus = () => {
        PaymentApi.checkPaymentStatus(data.code).then((response) => {
          if (response?.payload?.data?.paid === true) {
            setIsPaid(true);
            setPollingStatus(false);
          }
        });
      };

      // Check immediately
      checkStatus();

      // Set up polling if needed (e.g., when OnePay is opened)
      if (pollingStatus) {
        interval = setInterval(checkStatus, 5000);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [data?.code, isPaid, pollingStatus]);

  // Monitor payment window close to auto-cancel and release welcome voucher
  useEffect(() => {
    let interval: any;
    if (pollingStatus && !isPaidOrder && data?.code) {
      interval = setInterval(() => {
        if (paymentWindowRef.current && paymentWindowRef.current.closed) {
          clearInterval(interval);
          setPollingStatus(false);
          fetch("/api/auth/payment/cancel", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderCode: data.code }),
          })
            .then((res) => {
              if (res.ok) {
                toast.success(t("Thanh toán đã được hủy và giải phóng mã giảm giá."));
                router.refresh ? router.refresh() : window.location.reload();
              }
            })
            .catch((err) => {
              console.error("Error cancelling payment order status:", err);
            });
        }
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pollingStatus, isPaidOrder, data?.code, router, t]);

  useEffect(() => {
    if (selectedPaymentMethod === "onepay") {
      const totalPrice = Number(data?.total_price ?? 0);
      const totalDiscount = Number(data?.total_discount ?? 0);
      setOnePayFee((totalPrice - totalDiscount) * 0.025);
    } else {
      setOnePayFee(0);
      if (selectedPaymentMethod === 'vietqr' && !qrCodeGenerated && data?.code) {
        const totalPrice = Number(data?.total_price ?? 0);
        const totalDiscount = Number(data?.total_discount ?? 0);
        const total = totalPrice - totalDiscount;
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
              toast.error(t("khong_the_tao_ma_qr_thanh_toan"));
            });
        }
      }
    }
  }, [selectedPaymentMethod, qrCodeGenerated, data]);

  useEffect(() => {
    if (selectedPaymentMethod !== "vietqr") {
      setQrCodeGenerated(false);
    }
  }, [selectedPaymentMethod]);

  const onSubmit = async (dataForm: CheckOutBodyType) => {
    if (!data?.code) {
      toast.error(t("khong_tim_thay_ma_don_hang"));
      return;
    }

    if (!dataForm.payment_method) {
      toast.error(t("vui_long_chon_phuong_thuc_thanh_toan"));
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
              // Redirect đến trang thanh toán OnePay (Mở tab mới)
              const payWin = window.open(paymentResult.payment_url, '_blank');
              paymentWindowRef.current = payWin;
              setPollingStatus(true);
              toast.success(t("da_mo_trang_thanh_toan_o_tab_moi"));
            } else {
              setIsGeneratingPaymentUrl(false);
              toast.error(paymentResult?.message || t("khong_the_tao_link_thanh_toan"));
            }
          } catch (paymentError: any) {
            setIsGeneratingPaymentUrl(false);
            console.error("Error generating payment URL:", paymentError);
            toast.error(t("co_loi_xay_ra_khi_tao_link_thanh_toan"));
          }
        } else if (selectedPaymentMethod === "paypal") {
          setIsGeneratingPaymentUrl(true);
          try {
            const paymentResult = await BookingProductApi.paypalCreateOrder({
              order_code: data.code,
            });

            if (paymentResult?.payload?.success && paymentResult?.payload?.data?.approval_url) {
              // Redirect to PayPal
              window.location.href = paymentResult.payload.data.approval_url;
            } else {
              setIsGeneratingPaymentUrl(false);
              toast.error(paymentResult?.payload?.message || t("Không thể tạo link thanh toán PayPal."));
            }
          } catch (paymentError: any) {
            setIsGeneratingPaymentUrl(false);
            console.error("Error generating PayPal URL:", paymentError);
            toast.error(t("Có lỗi xảy ra khi tạo link thanh toán PayPal."));
          }
        } else if (selectedPaymentMethod === "vietqr") {
          // VietQR handled by useEffect
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

  const [isCancellingOrder, setIsCancellingOrder] = useState<boolean>(false);

  const handleCancelOrder = async () => {
    if (!data?.code) return;
    if (confirm(t("Bạn có chắc chắn muốn hủy đặt dịch vụ này không?"))) {
      try {
        setIsCancellingOrder(true);
        const res = await fetch("/api/auth/payment/cancel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderCode: data.code }),
        });
        if (res.ok) {
          toast.success(t("Hủy đơn hàng thành công và giải phóng mã giảm giá."));
          router.refresh ? router.refresh() : window.location.reload();
        } else {
          toast.error(t("Không thể hủy đặt dịch vụ. Vui lòng liên hệ hỗ trợ."));
        }
      } catch (err) {
        console.error("Error cancelling order:", err);
        toast.error(t("Có lỗi xảy ra khi hủy đặt dịch vụ."));
      } finally {
        setIsCancellingOrder(false);
      }
    }
  };

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

  const totalPrice = Number(data?.total_price ?? 0);
  const totalDiscount = Number(data?.total_discount ?? 0);
  const finalTotal = totalPrice + onePayFee - totalDiscount;
  const isYacht = data?.code?.startsWith("YACHT");



  const cancelledStatuses = ["failed", "cancelled"];
  const isCancelledOrFailedOrder = cancelledStatuses.includes(data?.status?.toLowerCase() ?? "");

  const getNewBookingUrl = (orderData: any) => {
    const type = orderData?.product?.product_type;
    switch (type) {
      case "business-lounge":
        return "/phong-cho-thuong-gia";
      case "fast-track":
        return "/fast-track";
      case "tour":
        return "/tours";
      case "hotel":
        return "/khach-san";
      case "visa":
        return "/visa";
      case "dinhcu":
        return "/dinh-cu";
      case "combo":
        return "/combo";
      case "ticket":
        return "/ve-vui-choi";
      case "yacht":
        return "/du-thuyen";
      default:
        return "/";
    }
  };

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

        {data?.isEmailRecovery && (
          <div className="mt-4 bg-amber-50 text-amber-800 font-medium px-4 py-3 rounded w-full text-base border border-amber-200">
            <p>Đang xem thông tin đơn hàng từ email. Một số thông tin có thể bị ẩn để bảo mật.</p>
          </div>
        )}

        {pollingStatus && !isPaidOrder && (
          <div className="mt-6 bg-blue-50 text-blue-700 font-bold px-4 py-3 rounded w-full text-base border border-blue-200 flex items-center space-x-3">
            <span className="loader_spiner !w-5 !h-5 !border-blue-500 !border-t-blue-200"></span>
            <p>{t("dang_cho_thanh_toan")}</p>
          </div>
        )}

        {isPaidOrder && (
          <div className="mt-6 bg-white text-green-700 font-bold px-4 py-3 rounded w-full text-base">
            <p>
              {t("happybook_da_nhan_duoc_khoan_thanh_toan_thanh_cong_cho_don_hang")}
              {data?.code && `: ${data.code}`}
            </p>
            <p>
              {t("happybook_se_gui_xac_nhan_don_hang_trong_thoi_gian_khong_qua_24_h")}
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
            className={`bg-white border-t transition-all duration-300 overflow-hidden ${isOpenBookingDetail
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
                    <p className="w-1/4 text-gray-700">{t("phan_loai_khach")}</p>
                    <p className="w-3/4 font-medium">
                      {data.booking.customer_type === "personal"
                        ? t("ca_nhan")
                        : t("doan")}
                    </p>
                  </div>
                )}

                {data?.booking?.guest_list &&
                  Array.isArray(data.booking.guest_list) &&
                  data.booking.guest_list.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="w-full text-gray-700 font-semibold mb-2">
                        {t("danh_sach_khach")}
                      </p>
                      {data.booking.guest_list.map((guest: any, index: number) => (
                        <div
                          key={index}
                          className="mb-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <p className="font-medium text-sm mb-1">
                            {t("khach")} {index + 1}
                          </p>
                          {guest.name && (
                            <p className="text-sm">
                              <span className="text-gray-600">{t("ho_va_ten")}: </span>
                              {guest.name}
                            </p>
                          )}
                          {guest.phone && (
                            <p className="text-sm">
                              <span className="text-gray-600">{t("so_dien_thoai")}: </span>
                              {guest.phone}
                            </p>
                          )}
                          {guest.email && (
                            <p className="text-sm">
                              <span className="text-gray-600">{t("email")}: </span>
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
                        {t("thong_tin_chuyen_bay")}
                      </p>
                      {data.booking.flight_number && (
                        <div className="flex space-x-2 mt-2">
                          <p className="w-1/4 text-gray-600 text-sm">
                            {t("so_hieu_chuyen_bay")}:
                          </p>
                          <p className="w-3/4 font-medium text-sm">
                            {data.booking.flight_number}
                          </p>
                        </div>
                      )}
                      {data.booking.flight_time && (
                        <div className="flex space-x-2 mt-2">
                          <p className="w-1/4 text-gray-600 text-sm">{t("gio_bay")}:</p>
                          <p className="w-3/4 font-medium text-sm">
                            {data.booking.flight_time}
                          </p>
                        </div>
                      )}
                      {data.booking.flight_arrival_time && (
                        <div className="flex space-x-2 mt-2">
                          <p className="w-1/4 text-gray-600 text-sm">{t("gio_dap")}:</p>
                          <p className="w-3/4 font-medium text-sm">
                            {data.booking.flight_arrival_time}
                          </p>
                        </div>
                      )}
                      {data.booking.flight_date && (
                        <div className="flex space-x-2 mt-2">
                          <p className="w-1/4 text-gray-600 text-sm">{t("ngay_bay")}:</p>
                          <p className="w-3/4 font-medium text-sm">
                            {data.booking.flight_date}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                {/* Tickets Info */}
                {data?.booking?.tickets && Array.isArray(data.booking.tickets) && data.booking.tickets.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="w-full text-gray-700 font-semibold mb-2">
                      {t("chi_tiet")}
                    </p>
                    {data.booking.tickets.map((ticket: any, index: number) => (
                      <div key={index} className="mb-2 text-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-gray-600 font-medium">
                              {ticket.name || `${t("ve")} ${index + 1}`}:
                            </span>{" "}
                            <span className="font-medium">
                              {ticket.quantity} {t("ve")}
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
                        {t("phu_phi_da_chon")}
                      </p>
                      {data.booking.additional_fees.map(
                        (fee: any, index: number) => {
                          const isNightTimeSurcharge = fee.name === 'Phụ phí giờ bay thêm' ||
                            fee.name?.toLowerCase().includes('phụ phí giờ bay thêm');

                          return (
                            <div key={index} className="mb-2 text-sm">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <span className="text-gray-600 font-medium">
                                    {fee.name || `${t("phu_phi")} ${index + 1}`}
                                  </span>
                                  {fee.description && (
                                    <p className="text-xs text-gray-500 mt-1" dangerouslySetInnerHTML={{ __html: fee.description }}>
                                    </p>
                                  )}
                                  {/* Hiển thị thông tin giải thích cho phụ phí giờ bay thêm */}
                                  {isNightTimeSurcharge && getNightTimeSurchargeInfo?.timeInfo && (
                                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                                      <p className="text-blue-800 font-medium mb-1">
                                        {t("luu_y_phu_phi_gio_bay_them")}
                                      </p>
                                      <p className="text-blue-700">
                                        {getNightTimeSurchargeInfo.timeInfo}
                                      </p>
                                      <ul className="text-blue-700 mt-1 ml-4 list-disc space-y-0.5">
                                        <li>{t("doi_voi_dich_vu_don_san_bay")}</li>
                                        <li>{t("doi_voi_dich_vu_tien_san_bay")}</li>
                                      </ul>
                                    </div>
                                  )}
                                </div>
                                {fee.price && (
                                  <DisplayPrice
                                    className="!text-sm !font-semibold ml-2"
                                    price={fee.price}
                                    currency={data?.product?.currency}
                                  />
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {!isPaidOrder && !isCancelledOrFailedOrder && !isYacht && (
          <form id="frmPayment" onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-6">
              <p className="font-bold text-18">
                {t("hinh_thuc_thanh_toan")}
              </p>
              <div className="bg-white rounded-xl p-3 md:p-6 mt-3">
                {showPayPalOnly ? (
                  <div className="flex space-x-3 items-start ">
                    <input
                      type="radio"
                      value="paypal"
                      id="payment_paypal"
                      {...register("payment_method")}
                      className="w-5 h-5 mt-[2px]"
                      checked={selectedPaymentMethod === "paypal"}
                      onChange={(e) => {
                        setValue("payment_method", e.target.value);
                        setSelectedPaymentMethod(e.target.value);
                      }}
                    />
                    <label
                      htmlFor="payment_paypal"
                      className=" flex space-x-1"
                    >
                      <div className="font-normal">
                        <Image
                          src="/payment-method/visa.svg"
                          alt="PayPal"
                          width={48}
                          height={28}
                          className="md:mt-1"
                        />
                      </div>
                      <div>
                        <span className="font-medium text-base max-width-[85%]">
                          {t("Thanh toán qua PayPal")}
                        </span>
                      </div>
                    </label>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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
                  total_price: Number(data?.total_price ?? 0),
                  total_discount: Number(data?.total_discount ?? 0),
                }}
                isPaid={isPaid}
                setIsPaid={(paid) => setIsPaid(paid)}
              />
            )}
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
              <div className="flex-1">
                <LoadingButton
                  style={
                    loadingSubmitForm ||
                      isGeneratingPaymentUrl ||
                      !selectedPaymentMethod ||
                      (selectedPaymentMethod === "vietqr" && !isPaid)
                      ? "w-full bg-gray-300 disabled:cursor-not-allowed"
                      : "w-full"
                  }
                  isLoading={loadingSubmitForm || isGeneratingPaymentUrl}
                  text={
                    isGeneratingPaymentUrl
                      ? t("dang_tao_link_thanh_toan")
                      : selectedPaymentMethod === "vietqr" && !isPaid
                        ? t("dang_cho_thanh_toan")
                        : t("thanh_toan")
                  }
                  disabled={
                    loadingSubmitForm ||
                    isGeneratingPaymentUrl ||
                    !selectedPaymentMethod ||
                    (selectedPaymentMethod === "vietqr" && !isPaid)
                  }
                />
              </div>
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={isCancellingOrder || loadingSubmitForm || isGeneratingPaymentUrl}
                className="flex-1 border border-red-500 text-red-500 hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 py-2.5 rounded-lg text-center font-semibold text-15 cursor-pointer transition-colors"
              >
                {isCancellingOrder ? t("dang_huy") : t("Hủy đặt dịch vụ")}
              </button>
            </div>
          </form>
        )}

        {isCancelledOrFailedOrder && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-bold text-red-800 text-lg">
                  {isEnglish ? "Booking Cancelled or Invalid" : "Đơn đặt chỗ đã bị hủy hoặc không hợp lệ"}
                </h3>
                <p className="text-red-700 mt-2 text-base leading-relaxed">
                  {isEnglish 
                    ? "This booking is no longer valid. This may happen if the applied promo voucher has been used in another transaction, or the booking has expired."
                    : "Đơn đặt chỗ này không còn hiệu lực. Điều này có thể xảy ra nếu mã giảm giá áp dụng đã được sử dụng ở giao dịch khác, hoặc đơn hàng đã hết hạn thanh toán."}
                </p>
                <Link
                  href={getNewBookingUrl(data)}
                  className="inline-block bg-[#F27145] text-white font-bold px-6 py-2.5 rounded-lg text-center cursor-pointer text__default_hover mt-4 transition-all duration-200 shadow-md hover:bg-[#d95a32]"
                >
                  {isEnglish ? "Book Again" : "Đặt chỗ mới"}
                </Link>
              </div>
            </div>
          </div>
        )}

        {isPaidOrder && (
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white py-2.5 rounded-lg text-center cursor-pointer text__default_hover mt-6"
          >
            {t("tro_ve_trang_chu")}
          </Link>
        )}
      </div>
      <div
        className={`md:w-5/12 lg:w-4/12 bg-white rounded-3xl ${isStickySideBar
          ? "sticky top-[1%] shadow-lg border-gray-200 border md:border-0 md:shadow-[unset] z-[99] md:top-20 lg:top-[140px] w-full md:w-5/12 lg:w-4/12"
          : "w-full"
          }`}
      >
        <div className="overflow-hidden rounded-t-2xl">
          {data?.product?.image_url && (
            <Image
              src={getImageSrc(data?.product?.image_url, data?.product?.image_location)}
              alt={data?.product?.name}
              width={600}
              height={450}
              className="w-full h-auto rounded-t-2xl hover:scale-110 ease-in duration-300"
            />
          )}
        </div>
        <div className="py-3 px-5">
          <h2 className="text-xl font-semibold">{data?.product?.name}</h2>
          <div className="mt-4 pt-4 border-t border-t-gray-200">
            {onePayFee > 0 && !isPaidOrder && (
              <div className="flex justify-between mb-1 text-red-600 font-semibold">
                <span className="text-sm">
                  {t("phi_xu_ly_giao_dich_the_quoc_te")}
                </span>
                <DisplayPrice
                  price={onePayFee}
                  currency={data?.product?.currency}
                />
              </div>
            )}
            {isPaidOrder ? (
              totalPrice > 0 && (
                <div className="w-full flex justify-between">
                  <DisplayPrice
                    textPrefix={"Tổng cộng"}
                    price={totalPrice}
                    currency={data?.product?.currency}
                  />
                </div>
              )
            ) : (((Number(data?.product?.discount_price) || 0) + totalDiscount) > 0 ? (
              <DisplayPriceWithDiscount
                price={finalTotal}
                originalPrice={totalPrice + (Number(data?.product?.discount_price) || 0) + onePayFee}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
