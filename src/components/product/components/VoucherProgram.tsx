"use client";

import { VoucherProgramApi } from "@/api/VoucherProgram";
import { formatCurrency } from "@/lib/formatters";
import { VoucherType } from "@/types/voucher";
import { debounce, isEqual } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Select, { MultiValue, ActionMeta } from "react-select";

const CustomOption = (isCurrencyVnd: boolean) => {
  const Component = (props: any) => {
    const { data, innerRef, innerProps, isDisabled } = props;
    const minOrderAmount = isCurrencyVnd
      ? data.min_order_amount
      : data.min_order_amount_dollar;
    const discountValue = isCurrencyVnd
      ? data.discount_value
      : data.discount_value_dollar;
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
              : `${discountValue}%`}
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
  const isCurrencyVnd = useMemo(() => {
    return currency.toLowerCase() === "vnd";
  }, [currency]);
  const [mounted, setMounted] = useState(false);
  const [selectedVouchers, setSelectedVouchers] = useState<VoucherType[]>([]);
  const prevPayload = useRef<{
    discountAmount: number;
    programIds: number[];
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectChange = useCallback(
    (newValue: MultiValue<VoucherType>, _meta: ActionMeta<VoucherType>) => {
      setSelectedVouchers([...newValue]);
    },
    []
  );

  useEffect(() => {
    const programIds = selectedVouchers.map((v) => v.id);
    const discount = selectedVouchers.reduce((sum, v) => {
      if (isCurrencyVnd) {
        return (
          sum +
          (v.discount_type === "amount"
            ? v.discount_value
            : (totalPrice * v.discount_value) / 100)
        );
      } else {
        return (
          sum +
          (v.discount_type === "amount"
            ? v.discount_value_dollar
            : (totalPrice * v.discount_value_dollar) / 100)
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
  }, [selectedVouchers, totalPrice, onApplyVoucher, isCurrencyVnd]);

  useEffect(() => {
    if (!selectedVouchers.length) return;

    const validVouchers = isCurrencyVnd
      ? selectedVouchers.filter((v) => totalPrice >= v.min_order_amount)
      : selectedVouchers.filter((v) => totalPrice >= v.min_order_amount_dollar);

    const sameIds =
      validVouchers.length === selectedVouchers.length &&
      validVouchers.every((v, i) => v.id === selectedVouchers[i].id);

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

  const handleInputChange = (input: string) => {
    onSearch(input);
  };
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold mb-2" data-translate="true">
        Mã khuyến mãi
      </h3>
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
              placeholder="Chọn mã khuyến mãi..."
              className="w-full"
              noOptionsMessage={() => "Không tìm thấy mã khuyến mãi phù hợp"}
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
            <p key={index} className="text-red-500 font-medium text-sm">
              {error.message}
            </p>
          ))}
      </div>
    </div>
  );
}
