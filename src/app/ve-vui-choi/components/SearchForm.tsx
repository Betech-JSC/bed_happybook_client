import Image from "next/image";
import { Fragment, useState } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { buildSearch } from "@/utils/Helper";

export default function SearchForm({ locations = [] }: { locations?: any[] }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });

  const handleSearch = () => {
    const querySearch = buildSearch(query);
    router.push(`/ve-vui-choi${querySearch}`);
  };

  const fromOptions = locations.filter((opt: any) => opt.label !== query?.to);
  const toOptions = locations.filter((opt: any) => opt.label !== query?.from);

  return (
    <Fragment>
      <div className="flex space-x-12 mb-3 mt-2">
        <label className="flex items-center space-x-2">
          <span className="text-[18px] font-semibold text-black">
            {t("tim_ve_vui_choi")}
          </span>
        </label>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-3 lg:space-y-0 items-end justify-between">
        <div className="relative w-full lg:w-[40%]">
          <label htmlFor="from" className="font-medium text-gray-700 block mb-1">
            {t("diem_di")}
          </label>
          <div className="w-full border border-gray-300 rounded-lg p-1.5 h-12 inline-flex items-center bg-white">
            <Image
              src="/icon/place.svg"
              alt="Địa điểm"
              className="h-5 mr-2"
              width={18}
              height={18}
            />
            <Select
              id="from"
              options={fromOptions}
              placeholder={t("chon_diem_di")}
              className="w-full text-sm"
              styles={{
                control: (base) => ({
                  ...base,
                  border: "none",
                  boxShadow: "none",
                  cursor: "pointer",
                  width: "100%",
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
          <label htmlFor="to" className="font-medium text-gray-700 block mb-1">
            {t("diem_den")}
          </label>
          <div className="w-full border border-gray-300 rounded-lg p-1.5 h-12 inline-flex items-center bg-white">
            <Image
              src="/icon/place.svg"
              alt="Địa điểm"
              className="h-5 mr-2"
              width={18}
              height={18}
            />
            <Select
              id="to"
              options={toOptions}
              placeholder={t("chon_diem_den")}
              className="w-full text-sm"
              styles={{
                control: (base) => ({
                  ...base,
                  border: "none",
                  boxShadow: "none",
                  cursor: "pointer",
                  width: "100%",
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

        <div className="w-full lg:w-[20%] text-center border rounded-lg px-2 h-12 bg-orange-700 hover:bg-orange-800 duration-300 flex items-center justify-center cursor-pointer">
          <button
            type="button"
            className="inline-flex items-center justify-center space-x-2 h-12 text-white w-full font-medium"
            onClick={handleSearch}
          >
            <Image
              src="/icon/search.svg"
              alt="Tìm kiếm"
              className="h-5"
              width={18}
              height={18}
            />
            <span>{t("tim_kiem")}</span>
          </button>
        </div>
      </div>
    </Fragment>
  );
}
