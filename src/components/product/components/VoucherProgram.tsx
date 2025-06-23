"use client";

import { formatCurrency } from "@/lib/formatters";
import { VoucherType } from "@/types/voucher";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Select, { MultiValue, ActionMeta } from "react-select";

const CustomOption = (props: any) => {
  const { data, innerRef, innerProps, isDisabled } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className={`flex flex-col gap-2 p-2 hover:bg-gray-100 border-b border-b-gray-300  ${
        isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      title={
        isDisabled
          ? `Áp dụng cho đơn hàng từ ${formatCurrency(data.min_order_amount)}`
          : ""
      }
    >
      <div className="font-medium">{data.label}</div>
      <div className="text-sm text-gray-500">{data.value}</div>
      <div className="text-sm text-gray-500">
        <span data-translate="true">Giảm </span>
        <span>
          {data.discount_type === "amount"
            ? formatCurrency(data.discount_value)
            : `${data.discount_value}%`}
        </span>
      </div>
      {data.min_order_amount > 0 && (
        <div className="text-sm text-gray-500">
          <span data-translate="true">Đơn tối thiểu: </span>
          <span>{formatCurrency(data.min_order_amount)}</span>
        </div>
      )}
    </div>
  );
};

export default function VoucherProgram({
  totalPrice,
  onApplyVoucher,
  voucherErrors,
  vouchersData,
}: {
  totalPrice: number;
  onApplyVoucher: (payload: {
    discountAmount: number;
    programIds: number[];
  }) => void;
  voucherErrors: any;
  vouchersData: VoucherType[];
}) {
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
      return (
        sum +
        (v.discount_type === "amount"
          ? v.discount_value
          : (totalPrice * v.discount_value) / 100)
      );
    }, 0);

    const payload = {
      discountAmount: Math.floor(discount),
      programIds,
    };

    const isSame =
      prevPayload.current &&
      prevPayload.current.discountAmount === payload.discountAmount &&
      JSON.stringify(prevPayload.current.programIds) ===
        JSON.stringify(payload.programIds);

    if (!isSame) {
      prevPayload.current = payload;
      onApplyVoucher(payload);
    }
  }, [selectedVouchers, totalPrice, onApplyVoucher]);

  useEffect(() => {
    if (!selectedVouchers.length) return;

    const validVouchers = selectedVouchers.filter(
      (v) => totalPrice >= v.min_order_amount
    );

    if (validVouchers.length !== selectedVouchers.length) {
      setSelectedVouchers(validVouchers);
    }
  }, [totalPrice, setSelectedVouchers, selectedVouchers]);

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
              options={vouchersData}
              value={selectedVouchers}
              components={{
                Option: CustomOption,
                IndicatorSeparator: () => null,
                DropdownIndicator: () => null,
              }}
              onChange={handleSelectChange}
              placeholder="Chọn mã khuyến mãi..."
              className="w-full"
              noOptionsMessage={() => "Không tìm thấy mã khuyến mãi phù hợp"}
              isOptionDisabled={(option) =>
                totalPrice < option.min_order_amount
              }
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
