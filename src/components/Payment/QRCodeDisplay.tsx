import { PaymentApi } from "@/api/Payment";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface QRCodeDisplayProps {
  value: string;
  orderCode: string;
}

export default function QRCodeDisplay({
  value,
  orderCode,
}: QRCodeDisplayProps) {
  const router = useRouter();
  const [qrSVG, setQrSVG] = useState<string>("");
  const [isPaid, setIsPaid] = useState<boolean>(false);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const svg = await QRCode.toString(value, { type: "svg", margin: 0 });
        setQrSVG(svg);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };
    generateQR();
  }, [value]);

  useEffect(() => {
    if (orderCode) {
      let interval = setInterval(async () => {
        const response = await PaymentApi.checkPaymentStatus(orderCode);
        if (response?.payload?.data?.paid === true) {
          setIsPaid(true);
          clearInterval(interval);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [orderCode]);

  useEffect(() => {
    if (isPaid) {
      toast.success("Đã thanh toán!");
      setTimeout(() => {
        router.push("/ve-may-bay");
      }, 1000);
    }
  }, [router, isPaid]);
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: qrSVG }} />
      <div className="text-sm mt-3">
        <span>Trạng thái: </span>
        <span className="font-semibold">
          {isPaid === true ? "Đã thanh toán!" : "Chờ thanh toán..."}
        </span>
      </div>
    </>
  );
}
