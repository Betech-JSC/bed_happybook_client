"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { UseFormRegister, FieldErrors, FieldError } from "react-hook-form";

interface GenerateInvoiceFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  generateInvoice: boolean;
  setGenerateInvoice: (value: boolean) => void;
}

interface InvoiceData {
  company_name: string;
  address: string;
  city: string;
  mst: string;
  contact_name: string;
  phone: string;
  email: string;
}

interface FormData {
  checkBoxGenerateInvoice: boolean;
  invoice: InvoiceData;
}

type InvoiceField = keyof FormData["invoice"];

const fields: { id: InvoiceField; label: string; placeholder: string }[] = [
  {
    id: "contact_name",
    label: "Người nhận hóa đơn",
    placeholder: "Nhập họ và tên người nhận",
  },
  { id: "mst", label: "Mã số thuế", placeholder: "Nhập mã số thuế" },
  { id: "address", label: "Địa chỉ", placeholder: "Nhập địa chỉ công ty" },
  //   { id: "company_name", label: "Tên công ty", placeholder: "Nhập tên công ty" },
  //   { id: "city", label: "Thành phố", placeholder: "Nhập thành phố" },
  //   {
  //     id: "phone",
  //     label: "Số điện thoại",
  //     placeholder: "Nhập số điện thoại người nhận",
  //   },
  //   { id: "email", label: "Email", placeholder: "Nhập Email" },
];

export default function GenerateInvoiceForm({
  register,
  errors,
  generateInvoice,
  setGenerateInvoice,
}: GenerateInvoiceFormProps) {
  const { t } = useTranslation();
  return (
    <>
      <div className="mt-2 flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          {...register("checkBoxGenerateInvoice")}
          checked={generateInvoice}
          onChange={(e) => setGenerateInvoice(e.target.checked)}
          className="w-4 h-4"
        />
        <span
          className="text-sm"
          onClick={() => setGenerateInvoice(!generateInvoice)}
        >
          {t("toi_muon_xuat_hoa_don")}
        </span>
      </div>

      <div
        className={`mt-4 ${generateInvoice ? "visible" : "invisible hidden"}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div
              className={`relative ${
                field.id === "address" ? "md:col-span-2" : ""
              }`}
              key={field.id}
            >
              <label
                htmlFor={`GenerateInvoice_${field.id}`}
                className="absolute top-0 left-0 h-5 translate-y-1 translate-x-4 font-medium text-xs"
              >
                <span data-translate="true">{field.label}</span>{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                id={`GenerateInvoice_${field.id}`}
                type="text"
                placeholder={field.placeholder}
                {...register(`invoice.${field.id}`)}
                className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
              />
              {(errors.invoice as Record<string, FieldError>)?.[field.id]
                ?.message && (
                <p className="text-red-600 text-sm mt-1">
                  {
                    (errors.invoice as Record<string, FieldError>)[field.id]
                      .message
                  }
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
