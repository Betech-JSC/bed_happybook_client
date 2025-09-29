import { PaymentApi } from "@/api/Payment";
import { useLanguage } from "@/contexts/LanguageContext";
import { toastMessages } from "@/lib/messages";
import { translatePage } from "@/utils/translateDom";
import Image from "next/image";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface QRCodeDisplayProps {
  vietQrData: any;
  order: any;
  isPaid: boolean;
  setIsPaid: (paid: boolean) => void;
}

export default function QRCodeDisplay({
  vietQrData,
  order,
  isPaid,
  setIsPaid,
}: QRCodeDisplayProps) {
  const { language } = useLanguage();
  const toaStrMsg = toastMessages[language as "vi" | "en"];


  useEffect(() => {
    if (order.sku && !isPaid) {
      let interval = setInterval(async () => {
        const response = await PaymentApi.checkPaymentStatus(order.sku);
        if (response?.payload?.data?.paid === true) {
          setIsPaid(true);
          toast.success(`${toaStrMsg.transferSuccessful}`);
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          clearInterval(interval);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [order.sku, isPaid, setIsPaid, toaStrMsg]);

  useEffect(() => {
    if (isPaid) {
      translatePage("#wrapper-payment-transfer", 10);
    }
  }, [isPaid]);

  return (
    <div
      id="wrapper-payment-transfer"
      className="bg-white py-4 md:px-6 px-3 mt-6 rounded-2xl"
    >
      <p className="text-22 font-bold" data-translate="true">
        Quét mã QR để thanh toán
      </p>
      <div className="mt-3 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-5 justify-between items-start lg:p-2">
        <div className="w-[250px] lg:w-1/3">
          <Image
            src={vietQrData.qrcode_base64}
            alt="QR Code"
            width={200}
            height={200}
          />
        </div>
        <div className="lg:w-2/3 bg-gray-50 p-2 text-sm rounded-xl">
          <div className="flex space-x-2">
            <span className="w-1/3" data-translate="true">
              Số tài khoản
            </span>
            <span className="w-2/3 font-medium">{`${vietQrData.bank_account_number || ""
              }`}</span>
          </div>
          <div className="flex mt-3 space-x-2">
            <span className="w-1/3" data-translate="true">
              Chủ tài khoản
            </span>
            <span className="w-2/3 font-medium">{vietQrData.bank_account_name}</span>
          </div>
          <div className="flex mt-3 space-x-2">
            <span className="w-1/3" data-translate="true">
              Ngân hàng
            </span>
            <span className="w-2/3 font-medium">{vietQrData.bank_name}</span>
          </div>
          <div className="flex mt-3 space-x-2">
            <span className="w-1/3" data-translate="true">
              Nội dung chuyển khoản
            </span>
            <span className="w-2/3 font-medium">{vietQrData.transaction_note}</span>
          </div>
        </div>
      </div>
      <div className="flex text-sm md:text-base space-x-2 mt-3">
        <span className="text-gray-700 w-1/2 md:w-fit" data-translate="true">
          Trạng thái thanh toán{"  "}
        </span>
        <span
          className={`font-bold  ${isPaid === true ? "text-green-700" : ""}`}
          data-translate="true"
        >
          {isPaid === true ? "Chuyển khoản thành công" : "Đang chờ thanh toán"}
        </span>
      </div>
      {isPaid === true && (
        <div className="grid grid-cols-2 mt-4 gap-4">
          <div className="py-[10px] border border-gray-300 rounded-lg text-center text__default_hover">
            <button type="button" data-translate="true" disabled={true}>
              Gửi lại email
            </button>
          </div>
          <div className="py-[10px] border border-gray-300 rounded-lg text-center text__default_hover">
            <button type="button" data-translate="true" disabled={true}>
              Xuất hóa đơn
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
