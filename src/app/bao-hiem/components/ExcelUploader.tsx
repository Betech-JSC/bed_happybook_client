"use client";

import { ProductInsurance } from "@/api/ProductInsurance";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { toastMessages } from "@/lib/messages";
import { isEmpty } from "lodash";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ExcelUploader({
  onSuccess,
}: {
  onSuccess: (data: any[]) => void;
}) {
  const [fileNameUpload, setFileNameUpload] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, number[]>>({});
  const { language } = useLanguage();
  const toaStrMsg = toastMessages[language as "vi" | "en"];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const selectedFile = input.files?.[0];
    if (!selectedFile) return;
    setFileNameUpload(selectedFile.name);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      toast.dismiss();
      // onSuccess([]);
      const res = await ProductInsurance.import(formData);
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 422) {
          setErrors(data.errors || {});
          toast.error("Danh sách không hợp lệ");
        } else {
          throw new Error("Upload thất bại");
        }
      } else {
        onSuccess(data.data);
        setErrors({});
        toast.success(toaStrMsg.sendSuccess);
      }
    } catch (err: any) {
      toast.error(toaStrMsg.error);
    } finally {
      input.value = "";
    }
  };

  const handleDownload = async () => {
    const res = await ProductInsurance.downLoadSampleExcel();
    if (!res.ok) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ISR-EXAMPLE.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <Fragment>
      <div className="flex flex-wrap items-center p-4 rounded-lg bg-gray-100">
        <div className="w-full lg:w-[62%]">
          <p>
            Để thuận tiện việc nhập Danh sách khách đoàn, Quý khách có thể tải
            mẫu Excel, điền thông tin và tải lên.
          </p>
        </div>
        <div className="w-full flex gap-2 lg:gap-4 flex-wrap lg:flex-nowrap mt-3 lg:mt-0 lg:w-[38%] justify-end">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full hover:border-primary duration-300 lg:w-auto flex gap-2 py-[10px] px-4 border border-gray-300 rounded-lg bg-white"
          >
            <Image src="/icon/download.svg" alt="Icon" width={20} height={20} />
            <p>Tải danh sách mẫu</p>
          </button>
          <label
            htmlFor="chooseFile"
            className="hover:border-primary duration-300 w-full lg:w-auto cursor-pointer flex gap-2 py-[10px] px-4 border border-gray-300 rounded-lg bg-white"
          >
            <input
              type="file"
              accept=".xlsx"
              id="chooseFile"
              onChange={handleFileChange}
              className="hidden"
            />
            <Image src="/icon/download.svg" alt="Icon" width={20} height={20} />
            <p>Chọn danh sách</p>
          </label>
        </div>
        {/* {!isEmpty(fileNameUpload) && (
          <p className="w-full text-right mt-2">
            Danh sách đã chọn: {fileNameUpload}
          </p>
        )} */}
      </div>
      {Object.keys(errors).length > 0 && (
        <div className="text-red-600 my-3">
          ❌ Dữ liệu không hợp lệ
          <ul className="list-disc ml-6">
            {Object.entries(errors).map(([field, rows]) => (
              <li key={field}>
                <strong>{field}</strong>: dòng {rows.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Fragment>
  );
}
