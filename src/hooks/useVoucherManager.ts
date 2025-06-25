import { VoucherProgramApi } from "@/api/VoucherProgram";
import { VoucherType } from "@/types/voucher";
import { useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";

export interface InvalidVoucher {
  id: number;
  message: string;
}

export function useVoucherManager(productType: string) {
  const [voucherProgramIds, setVoucherProgramIds] = useState<number[]>([]);
  const [voucherErrors, setVoucherErrors] = useState<InvalidVoucher[]>([]);
  const [vouchersData, setVouchersData] = useState<VoucherType[]>([]);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [searchingVouchers, setSearchingVouchers] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await VoucherProgramApi.list(productType);
      const data = response?.payload?.data ?? [];
      setVouchersData(data);
    };
    fetchData();
  }, [productType]);

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

  const debouncedSearchRef = useRef(
    debounce(async (code: string) => {
      setSearchingVouchers(true);
      const res = await VoucherProgramApi.search(productType, code);

      setVouchersData((prev) => {
        const newData = res?.payload?.data ?? [];

        const uniqueById = Array.from(
          new Map([...newData, ...prev].map((item) => [item.id, item])).values()
        );
        return uniqueById;
      });
      setSearchingVouchers(false);
    }, 600)
  );

  useEffect(() => {
    const debounceFn = debouncedSearchRef.current;
    return () => {
      debounceFn.cancel();
    };
  }, [debouncedSearchRef]);

  const handleSearch = (code: string) => {
    if (!code) return;
    const codeExists = vouchersData.some(
      (item) => item.code?.toLowerCase() === code.toLowerCase()
    );
    if (codeExists) return;

    setSearchingVouchers(true);
    debouncedSearchRef.current(code);
  };
  return {
    totalDiscount,
    voucherProgramIds,
    voucherErrors,
    vouchersData,
    searchingVouchers,
    setVoucherErrors,
    handleApplyVoucher,
    handleSearch,
  };
}
