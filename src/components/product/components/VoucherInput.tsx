"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function VoucherInput() {
  const [code, setCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [appliedVouchers, setAppliedVouchers] = useState<string[]>([]);

  const handleApplyVoucher = async (code: string): Promise<boolean> => {
    setIsApplying(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        if (code.toLowerCase() === "giam50k") {
          resolve(true);
        } else {
          resolve(false);
        }
        setIsApplying(false);
      }, 1000);
    });
  };

  const handleApply = async () => {
    const trimmedCode = code.trim();

    setErrorMessage("");

    if (!trimmedCode) {
      setErrorMessage("Vui lòng nhập mã.");
      return;
    }

    if (appliedVouchers.includes(trimmedCode)) {
      setErrorMessage("Mã đã được áp dụng.");
      return;
    }

    setIsApplying(true);
    const success = await handleApplyVoucher(trimmedCode);

    if (success) {
      setAppliedVouchers([...appliedVouchers, trimmedCode]);
      toast.success(`Đã áp dụng mã "${trimmedCode}".`);
      setCode("");
    } else {
      setErrorMessage("Mã không hợp lệ hoặc đã hết hạn.");
    }

    setIsApplying(false);
  };

  const handleRemove = (removedCode: string) => {
    setAppliedVouchers(appliedVouchers.filter((c) => c !== removedCode));
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold mb-2" data-translate="true">
        Mã khuyến mãi
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nhập mã tại đây..."
          className="border p-2 flex-1 rounded outline-primary w-full"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setErrorMessage("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApply();
            }
          }}
          disabled={isApplying}
        />

        <button
          onClick={handleApply}
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-[96px]"
          disabled={isApplying}
        >
          <span
            className={`${
              isApplying ? "loader_spiner block" : "hidden invisible"
            }`}
          ></span>
          <span
            data-translate
            className={`${isApplying ? "hidden invisible" : "block"}`}
          >
            Áp dụng
          </span>
        </button>
      </div>
      {errorMessage && (
        <p className="text-red-500 font-medium text-sm mt-2">{errorMessage}</p>
      )}
      {appliedVouchers.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Mã đã áp dụng:</h4>
          <ul className="mt-2">
            {appliedVouchers.map((voucher) => (
              <li
                key={voucher}
                className="flex justify-between items-center text-sm bg-gray-100 px-3 pl-4 py-2 rounded"
              >
                <span>{voucher}</span>
                <button
                  onClick={() => handleRemove(voucher)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
