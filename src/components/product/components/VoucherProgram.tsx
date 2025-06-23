"use client";

import { formatCurrency } from "@/lib/formatters";
import { VoucherType } from "@/types/voucher";
import { useCallback, useEffect, useState } from "react";
import Select, { MultiValue, ActionMeta } from "react-select";

const CustomOption = (props: any) => {
  const { data, innerRef, innerProps } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex flex-col gap-2 p-2 hover:bg-gray-100 cursor-pointer border-b border-b-gray-300"
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApplyVoucher = useCallback(
    (
      newValue: MultiValue<VoucherType>,
      _actionMeta: ActionMeta<VoucherType>
    ) => {
      const voucherSelected = [...newValue];
      setSelectedVouchers(voucherSelected);
      const discount = voucherSelected.reduce((sum: number, v: any) => {
        return (
          sum +
          (v.discount_type === "amount"
            ? v.discount_value
            : (totalPrice * v.discount_value) / 100)
        );
      }, 0);
      const programIds = voucherSelected.map((v) => v.id);

      onApplyVoucher({
        discountAmount: Math.floor(discount),
        programIds,
      });
    },
    [totalPrice, onApplyVoucher]
  );

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
              onChange={handleApplyVoucher}
              placeholder="Chọn mã khuyến mãi..."
              className="w-full"
              noOptionsMessage={() => "Không tìm thấy mã khuyến mãi phù hợp"}
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
