import { VoucherProgramApi } from "@/api/VoucherProgram";
import { VoucherType } from "@/types/voucher";
import { useCallback, useEffect, useState } from "react";

export interface InvalidVoucher {
  id: number;
  message: string;
}

export function useVoucherManager() {
  const [voucherProgramIds, setVoucherProgramIds] = useState<number[]>([]);
  const [voucherErrors, setVoucherErrors] = useState<InvalidVoucher[]>([]);
  const [vouchersData, setVouchersData] = useState<VoucherType[]>([]);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await VoucherProgramApi.list();
      const data = response?.payload?.data ?? [];
      setVouchersData(data);
    };
    fetchData();
  }, []);

  const handleInvalidVouchers = (invalidList: InvalidVoucher[]) => {
    const invalidIds = invalidList.map((v) => v.id);
    setVouchersData((prev) => prev.filter((v) => !invalidIds.includes(v.id)));
    setVoucherErrors([]);
  };

  const handleApplyVoucher = useCallback(
    ({
      discountAmount,
      programIds,
    }: {
      discountAmount: number;
      programIds: number[];
    }) => {
      setTotalDiscount(discountAmount);
      setVoucherProgramIds(programIds);
      handleInvalidVouchers(voucherErrors);
    },
    [voucherErrors]
  );

  return {
    totalDiscount,
    voucherProgramIds,
    voucherErrors,
    vouchersData,
    setVoucherErrors,
    handleApplyVoucher,
  };
}
