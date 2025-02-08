import React from "react";
import QRCode from "qrcode";

interface QRCodeDisplayProps {
  value: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value }) => {
  const [qrSVG, setQrSVG] = React.useState<string>("");

  React.useEffect(() => {
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
};

export default QRCodeDisplay;
