"use client";
import { Fragment, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { LocationType } from "@/types/location";
import "react-datepicker/dist/react-datepicker.css";
import { buildSearch } from "@/utils/Helper";
import Select from "react-select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

export default function Search({ locations }: { locations: any }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState<{
    from: string;
    to: string;
  }>({
    from: "",
    to: "",
  });
  const { language } = useLanguage();
  const handleSearch = () => {
    const querySearch = buildSearch(query);
    router.push(`/combo/tim-kiem${querySearch}`);
  };
  const fromOptions = locations.filter((opt: any) => opt.label !== query?.to);
  const toOptions = locations.filter((opt: any) => opt.label !== query?.from);

  return (
    <Fragment>
      <div className="base__content h-full relative place-content-center my-12 lg:my-16">
        <div className="bg-white rounded-2xl p-3 md:p-6 w-full lg:w-[850px]">
          <h1 className="text-18 font-semibold">{t("tim_combo_du_lich")}</h1>
          <div className="mt-4 md:mt-6 h-fit lg:h-20 flex flex-col lg:flex-row lg:space-x-2 space-y-3 items-end justify-between">
            <div className="relative w-full lg:w-[40%]">
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
              <label htmlFor="from" className="font-medium block">
                {t("diem_di")}
              </label>
              <div className="w-full border border-gray-300 rounded-lg p-2 mt-2 h-12 inline-flex items-center">
                <Select
                  id="from"
                  options={fromOptions}
                  placeholder={t("chon_diem_di")}
                  className="w-full pl-[10%]"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: "none",
                      boxShadow: "none",
                      cursor: "pointer",
                    }),
                    indicatorsContainer: (provided) => ({
                      ...provided,
                      display: "none",
                    }),
                  }}
                  onChange={(selectedOption: any) => {
                    setQuery({
                      ...query,
                      from: selectedOption?.label ?? "",
                    });
                  }}
                />
              </div>
            </div>
            <div className="w-full lg:w-[40%] relative">
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
              <label htmlFor="to" className="font-medium block">
                {t("diem_den")}
              </label>
              <div className="w-full border border-gray-300 rounded-lg p-2 mt-2 h-12 inline-flex items-center">
                <Select
                  id="to"
                  options={toOptions}
                  placeholder={t("chon_diem_den")}
                  className="w-full pl-[10%]"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: "none",
                      boxShadow: "none",
                      cursor: "pointer",
                    }),
                    indicatorsContainer: (provided) => ({
                      ...provided,
                      display: "none",
                    }),
                  }}
                  onChange={(selectedOption: any) => {
                    setQuery({
                      ...query,
                      to: selectedOption?.label ?? "",
                    });
                  }}
                />
              </div>
            </div>

            <div className="w-full lg:w-1/5 text-center border rounded-lg px-2 h-12 bg-primary hover:bg-orange-600 duration-300">
              <button
                type="button"
                className="ml-2 inline-flex items-center space-x-2 h-12 text-white"
                onClick={handleSearch}
              >
                <Image
                  src="/icon/search.svg"
                  alt="Search icon"
                  className="h-10 mr-2"
                  width={20}
                  height={20}
                  style={{ width: 20, height: 20 }}
                ></Image>
                {t("tim_kiem")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
