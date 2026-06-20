"use client";

import { VoucherProgramApi } from "@/api/VoucherProgram";
import { useTranslation } from "@/hooks/useTranslation";
import { formatCurrency } from "@/lib/formatters";
import { VoucherType } from "@/types/voucher";
import { debounce, isEqual } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Select, { MultiValue, ActionMeta } from "react-select";
import { toast } from "react-hot-toast";

const CustomOption = (isCurrencyVnd: boolean) => {
  const Component = (props: any) => {
    const { data, innerRef, innerProps, isDisabled } = props;
    const minOrderAmount = isCurrencyVnd
      ? data.min_order_amount
      : data.min_order_amount_dollar;
    const discountValue = isCurrencyVnd
      ? data.discount_value
      : data.discount_value_dollar;
    const maxDiscountValue = isCurrencyVnd
      ? data.max_discount_value
      : data.max_discount_value_dollar;
    const lang = isCurrencyVnd ? "vi" : "en";
    return (
      <div
        ref={innerRef}
        {...innerProps}
        className={`flex flex-col gap-2 p-2 hover:bg-gray-100 border-b border-b-gray-300  ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        title={
          isDisabled
            ? `Áp dụng cho đơn hàng từ ${formatCurrency(minOrderAmount, lang)}`
            : ""
        }
      >
        <div className="font-medium" data-traslate="true">
          {data.label}
        </div>
        <div className="text-sm text-gray-500">{data.value}</div>
        <div className="text-sm text-gray-500">
          <span data-translate="true">Giảm </span>
          <span>
            {data.discount_type === "amount"
              ? formatCurrency(discountValue, lang)
              : `${discountValue}% - Tối đa ${formatCurrency(
                  maxDiscountValue,
                  lang
                )}`}
          </span>
        </div>
        {minOrderAmount > 0 && (
          <div className="text-sm text-gray-500">
            <span data-translate="true">Đơn tối thiểu: </span>
            <span>{formatCurrency(minOrderAmount, lang)}</span>
          </div>
        )}
      </div>
    );
  };
  Component.displayName = "CustomOptionWithCurrency";
  return Component;
};

export default function VoucherProgram({
  totalPrice,
  voucherErrors,
  vouchersData,
  currency,
  isSearching,
  onApplyVoucher,
  onSearch,
}: {
  totalPrice: number;
  voucherErrors: any;
  vouchersData: VoucherType[];
  currency: string;
  isSearching: boolean;
  onApplyVoucher: (payload: {
    discountAmount: number;
    programIds: number[];
  }) => void;
  onSearch: (code: string) => void;
}) {
  const { t } = useTranslation();
  const isCurrencyVnd = useMemo(() => {
    return currency.toLowerCase() === "vnd";
  }, [currency]);
  const [mounted, setMounted] = useState(false);
  const [selectedVouchers, setSelectedVouchers] = useState<VoucherType[]>([]);
  const prevPayload = useRef<{
    discountAmount: number;
    programIds: number[];
  } | null>(null);
  const hasAutoApplied = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-apply pending welcome voucher from promo banner
  useEffect(() => {
    if (!vouchersData || vouchersData.length === 0 || hasAutoApplied.current) return;
    const programCode = sessionStorage.getItem("applied_welcome_program");
    if (programCode) {
      // Find matching voucher from vouchersData
      const match = vouchersData.find((v) =>
        v.code?.toUpperCase().startsWith(programCode.toUpperCase())
      );
      if (match) {
        setSelectedVouchers([match]);
        hasAutoApplied.current = true;
      }
    }
  }, [vouchersData]);

  const handleSelectChange = useCallback(
    (newValue: MultiValue<VoucherType>, _meta: ActionMeta<VoucherType>) => {
      if (Array.isArray(newValue) && newValue.length > 0) {
        setSelectedVouchers([newValue[newValue.length - 1]]);
      } else {
        setSelectedVouchers([]);
      }
    },
    []
  );

  useEffect(() => {
    const programIds = selectedVouchers.map((v) => v.voucher_id);
    let discount = selectedVouchers.reduce((sum, v) => {
      // Check if this voucher has a pending error in voucherErrors
      const hasError = voucherErrors?.some((err: any) => err.id === v.voucher_id);
      if (hasError) return sum;

      if (isCurrencyVnd) {
        return (
          sum +
          (v.discount_type === "amount"
            ? v.discount_value
            : (totalPrice * v.discount_value) / 100 < v.max_discount_value
            ? (totalPrice * v.discount_value) / 100
            : v.max_discount_value)
        );
      } else {
        return (
          sum +
          (v.discount_type === "amount"
            ? v.discount_value_dollar
            : (totalPrice * v.discount_value_dollar) / 100 <
              v.max_discount_value_dollar
            ? (totalPrice * v.discount_value_dollar) / 100
            : v.max_discount_value_dollar)
        );
      }
    }, 0);

    const payload = {
      discountAmount: Math.floor(discount),
      programIds,
    };

    const isSame =
      prevPayload.current &&
      prevPayload.current.discountAmount === payload.discountAmount &&
      isEqual(prevPayload.current.programIds, payload.programIds);

    if (!isSame) {
      prevPayload.current = payload;
      onApplyVoucher(payload);
    }
  }, [selectedVouchers, totalPrice, onApplyVoucher, isCurrencyVnd, voucherErrors]);

  useEffect(() => {
    if (!selectedVouchers.length) return;

    const validVouchers = isCurrencyVnd
      ? selectedVouchers.filter((v) => totalPrice >= v.min_order_amount)
      : selectedVouchers.filter((v) => totalPrice >= v.min_order_amount_dollar);

    const sameIds =
      validVouchers.length === selectedVouchers.length &&
      validVouchers.every(
        (v, i) => v.voucher_id === selectedVouchers[i].voucher_id
      );

    if (!sameIds) {
      setSelectedVouchers(validVouchers);
    }
  }, [totalPrice, selectedVouchers, isCurrencyVnd]);

  const filteredVouchers = vouchersData.filter((voucher) => {
    if (isCurrencyVnd) {
      return voucher.discount_value > 0;
    } else {
      return voucher.discount_value_dollar > 0;
    }
  });

  const handleCancelPendingOrder = async (orderCode: string) => {
    if (confirm(t("Bạn có chắc chắn muốn hủy đơn hàng đang chờ thanh toán trước đó không?"))) {
      try {
        const res = await fetch("/api/auth/payment/cancel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderCode }),
        });
        if (res.ok) {
          toast.success(t("Hủy đơn hàng thành công. Hãy thử áp dụng lại mã giảm giá."));
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          toast.error(t("Không thể hủy đơn hàng. Vui lòng liên hệ hỗ trợ."));
        }
      } catch (err) {
        console.error("Error cancelling pending order:", err);
        toast.error(t("Có lỗi xảy ra khi hủy đơn hàng."));
      }
    }
  };

  const handleInputChange = (input: string) => {
    onSearch(input);
  };
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold mb-2">{t("ma_khuyen_mai")}</h3>
      <div className="flex flex-col gap-2">
        <div className="flex-1 rounded outline-primary w-full">
          {mounted && (
            <Select
              isMulti
              options={filteredVouchers}
              value={selectedVouchers}
              components={{
                Option: CustomOption(isCurrencyVnd),
                IndicatorSeparator: () => null,
                DropdownIndicator: () => null,
              }}
              formatOptionLabel={(option, { context }) => {
                if (context === "menu") {
                  return <div>{option.name}</div>;
                }
                return <span>{option.code}</span>;
              }}
              onChange={handleSelectChange}
              onInputChange={handleInputChange}
              placeholder={t("chon_ma_khuyen_mai")}
              className="w-full"
              noOptionsMessage={() => t("khong_tim_thay_ma_khuyen_mai_phu_hop")}
              isOptionDisabled={(option) =>
                isCurrencyVnd
                  ? totalPrice < option.min_order_amount
                  : totalPrice < option.min_order_amount_dollar
              }
              isLoading={isSearching}
            />
          )}
        </div>
        {voucherErrors?.length > 0 &&
          voucherErrors.map((error: any, index: number) => (
            <div key={index} className="text-red-500 font-medium text-sm flex flex-col gap-1 mt-1">
              <span>{error.message}</span>
              {error.pending_order_code && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCancelPendingOrder(error.pending_order_code);
                  }}
                  className="text-blue-600 underline font-semibold text-left hover:text-blue-800 transition-colors mt-0.5"
                >
                  {t("Hủy đơn hàng chờ thanh toán trước đó để áp dụng mã mới")}
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
