import { VoucherProgramApi } from "@/api/VoucherProgram";
import { VoucherType } from "@/types/voucher";
import { useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { useUser } from "@/contexts/UserContext";

export interface InvalidVoucher {
  id: number;
  message: string;
}

export function useVoucherManager(productType: string) {
  const { userInfo } = useUser();
  const customerId = userInfo?.id;

  const [voucherProgramIds, setVoucherProgramIds] = useState<number[]>([]);
  const [voucherErrors, setVoucherErrors] = useState<InvalidVoucher[]>([]);
  const [vouchersData, setVouchersData] = useState<VoucherType[]>([]);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [searchingVouchers, setSearchingVouchers] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await VoucherProgramApi.list(productType, customerId);
      const data = response?.payload?.data ?? [];
      setVouchersData(data);
    };
    fetchData();
  }, [productType, customerId]);

  const handleInvalidVouchers = (invalidList: InvalidVoucher[]) => {
    const invalidIds = invalidList.map((v) => v.id);
    setVouchersData((prev) =>
      prev.filter((v) => !invalidIds.includes(v.voucher_id))
    );
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
      
      const hasChanged =
        programIds.length !== voucherProgramIds.length ||
        programIds.some((id, idx) => id !== voucherProgramIds[idx]);

      setVoucherProgramIds(programIds);

      if (hasChanged) {
        handleInvalidVouchers(voucherErrors);
      }
    },
    [voucherErrors, voucherProgramIds]
  );

  const productTypeRef = useRef(productType);
  const customerIdRef = useRef(customerId);

  useEffect(() => {
    productTypeRef.current = productType;
    customerIdRef.current = customerId;
  }, [productType, customerId]);

  const debouncedSearchRef = useRef(
    debounce(async (code: string) => {
      setSearchingVouchers(true);
      const res = await VoucherProgramApi.search(productTypeRef.current, code, customerIdRef.current);

      setVouchersData((prev) => {
        const newData = res?.payload?.data ?? [];

        const uniqueById = Array.from(
          new Map(
            [...newData, ...prev].map((item) => [item.voucher_id, item])
          ).values()
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
