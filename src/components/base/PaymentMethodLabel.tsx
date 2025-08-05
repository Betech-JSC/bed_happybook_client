"use client";
import { useTranslation } from "@/hooks/useTranslation";
import { toSnakeCase } from "@/utils/Helper";
import React from "react";

type MethodType = "cash" | "vietqr" | "onepay";

interface StatusLabelProps {
  method: MethodType;
  label?: string;
}

const methodTexts: Record<MethodType, string> = {
  cash: "Thanh toán tiền mặt",
  vietqr: "Thanh toán quét mã QR ngân hàng",
  onepay: "Thanh toán Visa, MasterCard, JCB",
};

export const PaymentMethodLabel: React.FC<StatusLabelProps> = ({
  method,
  label,
}) => {
  const { t } = useTranslation();
  const text = method
    ? label || methodTexts[method]
    : "Chưa chọn phương thức thanh toán";

  return (
    <span
      className={`font-medium inline-block px-3 py-2 text-xs rounded-full  ${
        method ? "text-green-700 bg-green-100" : "bg-red-100 text-red-700"
      }`}
    >
      {t(toSnakeCase(text))}
    </span>
  );
};
