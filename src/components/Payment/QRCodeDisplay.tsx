import { PaymentApi } from "@/api/Payment";
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
  const [qrSVG, setQrSVG] = useState<string>("");
  useEffect(() => {
    const generateQR = async () => {
      try {
        const svg = await QRCode.toString(vietQrData.qrCode, {
          type: "svg",
          margin: 0,
        });
        setQrSVG(svg);
        translatePage("#wrapper-payment-transfer", 10);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };
    generateQR();
  }, [vietQrData.qrCode]);

  useEffect(() => {
    if (order.sku && !isPaid) {
      let interval = setInterval(async () => {
        const response = await PaymentApi.checkPaymentStatus(order.sku);
        if (response?.payload?.data?.paid === true) {
          setIsPaid(true);
          toast.success("Chuyển khoản thành công");
          clearInterval(interval);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [order.sku, isPaid, setIsPaid]);

  return (
    <div
      id="wrapper-payment-transfer"
      className="bg-white py-4 md:px-6 px-3 mt-6 rounded-2xl"
    >
      <p className="text-22 font-bold" data-translate={true}>
        Quét mã QR để thanh toán
      </p>
      <div className="mt-3 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-5 justify-between items-start lg:p-2">
        <div className="w-[250px] lg:w-1/3 mx-auto">
          <div className="mx-auto">
            <Image
              src={`/payment-method/viet-qr-code.png`}
              width={200}
              height={100}
              alt="Icon"
              className="w-32 h-auto mx-auto"
            />
          </div>
          <div className="relative mt-2 border border-gray-700 p-1">
            <div dangerouslySetInnerHTML={{ __html: qrSVG }} />
            <span className="bg-white rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-gray-200 dark:border-gray-600">
              <Image
                src="/payment-method/vietqr.jpeg"
                alt="Icon"
                width={40}
                height={40}
                className="w-7 h-7 rounded-full"
              />
            </span>
          </div>
          <div className="mt-2">
            <Image
              src={`/payment-method/nas247.png`}
              width={200}
              height={100}
              alt="Icon"
              className="w-20 h-auto mx-auto"
            />
          </div>
        </div>
        <div className="lg:w-2/3 bg-gray-50 p-2 text-sm rounded-xl">
          <div className="flex space-x-2">
            <span className="w-1/3" data-translate={true}>
              Số tài khoản
            </span>
            <span className="w-2/3 font-medium">{`${vietQrData.bankAccount}`}</span>
          </div>
          <div className="flex mt-3 space-x-2">
            <span className="w-1/3" data-translate={true}>
              Chủ tài khoản
            </span>
            <span className="w-2/3 font-medium">{vietQrData.userBankName}</span>
          </div>
          <div className="flex mt-3 space-x-2">
            <span className="w-1/3" data-translate={true}>
              Ngân hàng
            </span>
            <span className="w-2/3 font-medium">{vietQrData.bankName}</span>
          </div>
          <div className="flex mt-3 space-x-2">
            <span className="w-1/3" data-translate={true}>
              Nội dung chuyển khoản
            </span>
            <span className="w-2/3 font-medium">{vietQrData.content}</span>
          </div>
        </div>
      </div>
      <div className="flex text-sm md:text-base space-x-2 mt-3">
        <span className="text-gray-700 w-1/2 md:w-fit" data-translate={true}>
          Trạng thái thanh toán{"  "}
        </span>
        <span
          className={`font-bold  ${isPaid === true ? "text-green-700" : ""}`}
          data-translate={true}
        >
          {isPaid === true ? "Chuyển khoản thành công" : "Đang chờ thanh toán"}
        </span>
      </div>
      {isPaid === true && (
        <div className="grid grid-cols-2 mt-4 gap-4">
          <div className="py-[10px] border border-gray-300 rounded-lg text-center text__default_hover">
            <button type="button" data-translate={true} disabled={true}>
              Gửi lại email
            </button>
          </div>
          <div className="py-[10px] border border-gray-300 rounded-lg text-center text__default_hover">
            <button type="button" data-translate={true} disabled={true}>
              Xuất hóa đơn
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
