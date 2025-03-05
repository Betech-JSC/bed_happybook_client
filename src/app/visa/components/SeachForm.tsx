"use client";
import Image from "next/image";
import VisaStyle from "@/styles/visaService.module.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchForm({ optionsFilter }: any) {
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
        <label
          htmlFor="searchInput"
          className="font-medium block"
          data-translate
        >
          Theo địa danh, điểm đến
        </label>
        <input
          type="text"
          id="searchInput"
          defaultValue={formData.text ? formData.text : ""}
          onChange={handleChange}
          name="text"
          placeholder="Tìm theo điểm đến, hoạt động"
          className={`mt-2 w-full ${VisaStyle.input} h-12 indent-10`}
        />
      </div>
      <div className="w-full md:w-[30%]">
        <label htmlFor="typeVisa" className="font-medium block" data-translate>
          Loại Visa
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
            <option value="" hidden data-translate="true">
              Chọn loại Visa
            </option>
            {optionsFilter[0]?.option?.length > 0 &&
              optionsFilter[0]?.option?.map((value: any, index: number) => {
                if (value) {
                  return (
                    <option key={index} value={value} data-translate>
                      {value}
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
          <span data-translate>Tìm kiếm</span>
        </button>
      </div>
    </form>
  );
}
