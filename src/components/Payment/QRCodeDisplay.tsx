import { PaymentApi } from "@/api/Payment";
import { useLanguage } from "@/contexts/LanguageContext";
import { toastMessages } from "@/lib/messages";
import { translatePage } from "@/utils/translateDom";
import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

interface QRCodeDisplayProps {
  vietQrData: any;
  order: any;
  isPaid: boolean;
  setIsPaid: (paid: boolean) => void;
}

type QrResolution = {
  src: string;
  payload: string;
};

const isLikelyImageBase64 = (value: string) =>
  value.startsWith("iVBOR") ||
  value.startsWith("/9j/") ||
  value.startsWith("R0lGOD") ||
  value.startsWith("PHN2Zy");

const normalizeQrSrc = (value?: string | null) => {
  if (!value) return "";

  const trimmed = value.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return "";

  if (trimmed.startsWith("//")) {
    return encodeURI(`https:${trimmed}`);
  }

  if (
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed.startsWith("data:image/") ? trimmed : encodeURI(trimmed);
  }

  return trimmed;
};

const resolveQrData = (vietQrData: any): QrResolution => {
  const candidates = [
    vietQrData?.qr_code_url,
    vietQrData?.image_url,
    vietQrData?.qrcode_base64,
    vietQrData?.qr_code,
    vietQrData?.qrcode,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;

    const trimmed = candidate.trim();
    if (!trimmed || trimmed === "undefined" || trimmed === "null") continue;

    if (
      trimmed.startsWith("data:image/") ||
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("//") ||
      trimmed.startsWith("/")
    ) {
      return { src: normalizeQrSrc(trimmed), payload: "" };
    }

    const compact = trimmed.replace(/\s+/g, "");
    if (
      compact.startsWith("<svg") ||
      compact.startsWith("<?xml") ||
      isLikelyImageBase64(compact)
    ) {
      if (compact.startsWith("<svg") || compact.startsWith("<?xml")) {
        return {
          src: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(trimmed)}`,
          payload: "",
        };
      }

      return { src: `data:image/png;base64,${compact}`, payload: "" };
    }

    return { src: "", payload: trimmed };
  }

  return { src: "", payload: "" };
};

export default function QRCodeDisplay({
  vietQrData,
  order,
  isPaid,
  setIsPaid,
}: QRCodeDisplayProps) {
  const { language } = useLanguage();
  const toaStrMsg = toastMessages[language as "vi" | "en"];
  const [imgSrc, setImgSrc] = useState("");
  const qrData = useMemo(() => resolveQrData(vietQrData), [vietQrData]);


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

  useEffect(() => {
    let active = true;

    const loadQr = async () => {
      if (qrData.src) {
        if (!active) return;
        setImgSrc(qrData.src);
        return;
      }

      if (qrData.payload) {
        try {
          const dataUrl = await QRCode.toDataURL(qrData.payload, {
            width: 240,
            margin: 1,
            errorCorrectionLevel: "M",
          });

          if (!active) return;
          setImgSrc(dataUrl);
          return;
        } catch (error) {
          console.error("Failed to generate QR image from payload:", error);
        }
      }

      if (active) {
        setImgSrc("");
      }
    };

    void loadQr();

    return () => {
      active = false;
    };
  }, [qrData]);

  const handleImgError = () => {
    if (imgSrc.startsWith("http://")) {
      setImgSrc((current) => current.replace(/^http:\/\//, "https://"));
      return;
    }

    if (qrData.payload && !imgSrc.startsWith("data:image/")) {
      QRCode.toDataURL(qrData.payload, {
        width: 240,
        margin: 1,
        errorCorrectionLevel: "M",
      })
        .then((dataUrl) => setImgSrc(dataUrl))
        .catch((error) => {
          console.error("Fallback QR generation failed:", error);
        });
    }
  };

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
          {imgSrc ? (
            // QR data may be a remote URL from the payment service, so use a plain image tag here.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgSrc} alt="QR Code" width={200} height={200} onError={handleImgError} />
          ) : (
            <div className="flex h-[200px] w-[200px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
              Đang tải mã QR...
            </div>
          )}
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
