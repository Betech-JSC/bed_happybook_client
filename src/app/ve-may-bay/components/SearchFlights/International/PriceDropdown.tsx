"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function PriceDropdown({
  totalPrice,
  totalPriceAdt,
  totalPriceChd,
  totalPriceInf,
  numberAdt,
  numberChd,
  numberInf,
}: any) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-max border border-orange-300 rounded-md bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-end px-2 py-2 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex gap-2 items-center">
          <p className="font-medium">{t("tong_gia")}: </p>
          <p className="text-xl font-bold text-primary">
            {" "}
            {totalPrice.toLocaleString("vi-VN")} đ
          </p>
          <ChevronDown
            className={`size-5 text-gray-500 transition-transform duration-300 ${open ? "rotate-180" : ""
              }`}
          />
        </div>
      </button>

      {/* Dropdown*/}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${open
          ? "max-h-40 opacity-100 scale-y-100"
          : "max-h-0 opacity-0 scale-y-95"
          } origin-top`}
      >
        <div className="p-4 text-sm space-y-2">
          {numberAdt > 0 && (
            <div className="flex justify-between">
              <p className="text-sm text-gray-900 font-normal mb-2">
                {t("nguoi_lon")}: {totalPriceAdt.toLocaleString("vi-VN")}
                {" đ "}x {numberAdt}{" "}
              </p>
            </div>
          )}
          {numberChd > 0 && (
            <div className="flex justify-between">
              <p className="text-sm text-gray-900 font-normal mb-2">
                {t("tre_em")}: {totalPriceChd.toLocaleString("vi-VN")}
                {" đ "}x {numberChd}{" "}
              </p>
            </div>
          )}
          {numberInf > 0 && (
            <div className="flex justify-between">
              <p className="text-sm text-gray-900 font-normal mb-2">
                {t("em_be")}: {totalPriceInf.toLocaleString("vi-VN")}
                {" đ "}x {numberInf}{" "}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
