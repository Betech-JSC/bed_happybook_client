"use client";
import Image from "next/image";
import VisaStyle from "@/styles/visaService.module.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export default function SearchForm({ optionsFilter }: any) {
  const { t } = useTranslation();

  const router = useRouter();

  const [formData, setFormData] = useState<any>([]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(formData).toString();
    router.push(`/visa/tim-kiem?${params}`);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  return (
    <form
      className="mt-4 md:mt-6 flex flex-col md:flex-row md:space-x-2 space-y-3 items-end justify-between"
      onSubmit={handleSubmit}
    >
      <div className="relative w-full md:w-1/2">
        <div className="absolute left-4 top-1/2 translate-y-1/4">
          <Image
            src="/icon/place.svg"
            alt="Icon"
            className="h-10"
            width={20}
            height={20}
            style={{ width: 20, height: 20 }}
          ></Image>
        </div>
        <label htmlFor="searchInput" className="font-medium block">
          {t("theo_dia_danh_diem_den")}
        </label>
        <input
          type="text"
          id="searchInput"
          defaultValue={formData.text ? formData.text : ""}
          onChange={handleChange}
          name="text"
          placeholder={t("tim_theo_diem_den_hoat_dong")}
          className={`mt-2 w-full ${VisaStyle.input} h-12 indent-10`}
        />
      </div>
      <div className="w-full md:w-[30%]">
        <label htmlFor="typeVisa" className="font-medium block">
          {t("loai_visa")}
        </label>
        <div
          className="mt-2 border border-gray-300 rounded-lg h-12"
          style={{
            boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
          }}
        >
          <select
            id="typeVisa"
            className={`px-3 py-3 w-[90%] outline-none rounded-lg h-full ${VisaStyle.select_custom}`}
            name="loai_visa[]"
            onChange={handleChange}
            defaultValue={""}
          >
            <option value="" hidden>
              {t("chon_loai_visa")}
            </option>
            {optionsFilter[0]?.option?.length > 0 &&
              optionsFilter[0]?.option?.map((option: any, index: number) => {
                if (option) {
                  return (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  );
                }
              })}
          </select>
        </div>
      </div>
      <div className="w-full md:w-1/5 text-center border rounded-lg px-2 h-12 bg-primary hover:bg-orange-600 duration-300">
        <button className="ml-1 inline-flex items-center space-x-2 h-12 text-white">
          <Image
            src="/icon/search.svg"
            alt="Search icon"
            className="h-10 mr-1"
            width={20}
            height={20}
            style={{ width: 20, height: 20 }}
          ></Image>
          <span>{t("tim_kiem")}</span>
        </button>
      </div>
    </form>
  );
}
