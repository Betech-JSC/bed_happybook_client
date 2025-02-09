import QRCode from "qrcode";
import { useCallback, useEffect, useState } from "react";

interface QRCodeDisplayProps {
  value: string;
}

export default function QRCodeDisplay({ value }: QRCodeDisplayProps) {
  const [qrSVG, setQrSVG] = useState<string>("");

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

  return <div dangerouslySetInnerHTML={{ __html: qrSVG }} />;
}
