import React from "react";

type StatusType = "new" | "paid" | "done" | "close";

interface StatusLabelProps {
  status: StatusType;
  label?: string;
}

const statusStyles: Record<StatusType, string> = {
  paid: "bg-green-700 text-white",
  done: "bg-green-700 text-white",
  new: "bg-yellow-500 text-white",
  close: "bg-red-700 text-white",
};

const statusTexts: Record<StatusType, string> = {
  paid: "Đã thanh toán",
  done: "Hoàn thành",
  new: "Chờ xử lý",
  close: "Đã hủy",
};

export const StatusLabel: React.FC<StatusLabelProps> = ({ status, label }) => {
  const style = statusStyles[status];
  const text = label || statusTexts[status];
  return (
    <span
      className={`inline-block px-3 py-2 text-xs font-medium rounded-full ${style}`}
    >
      {text}
    </span>
  );
};
