import Image from "next/image";
import { Fragment, use, useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { vi, enUS } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ProductTicket } from "@/api/ProductTicket";
import { format, parse, isValid } from "date-fns";
import toast from "react-hot-toast";

type Option = {
  name: string;
  id: number | string;
  slug: string;
};

export default function SearchForm() {
  const router = useRouter();
  const today = new Date();
  const { language } = useLanguage();
  const [locationSelected, setLocationSelected] = useState<any>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(today);
  const [locations, setLocations] = useState<Option[]>([]);
  const [mounted, setMounted] = useState(false);

  const handleSearch = () => {
    if (locationSelected && isValid(departureDate)) {
      const date = format(
        isValid(departureDate ?? undefined) ? departureDate! : new Date(),
        "yyyy-MM-dd"
      );
      router.push(
        `/ve-vui-choi/chi-tiet/${locationSelected.value}?departDate=${date}`
      );
    } else {
      toast.dismiss();
      toast.error("Vui lòng chọn đầy đủ thông tin");
    }

    return;
  };
  useEffect(() => {
    setMounted(true);
  }, []);
  const fetchData = useCallback(async () => {
    try {
      const date = format(
        isValid(departureDate ?? undefined) ? departureDate! : new Date(),
        "yyyy-MM-dd"
      );

      const res = await ProductTicket.search(`?departDate=${date}`);
      const data = res?.payload?.data ?? [];
      setLocations(
        data.map((item: Option) => ({
          label: item.name,
          value: item.slug,
        }))
      );
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }, [departureDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setLocationSelected(null);
  }, [locations]);
  return (
    <Fragment>
      <div className="flex space-x-12 mb-3 mt-2">
        <label className="flex items-center space-x-2">
          <span
            className="text-[18px] font-semibold text-black"
            data-translate="true"
          >
            Tìm vé vui chơi
          </span>
        </label>
      </div>

      <div className="flex flex-wrap lg:flex-nowrap gap-2">
        <div className="w-full lg:w-5/12">
          <label className="block text-gray-700 mb-1" data-translate="true">
            Nơi đi
          </label>
          <div className="flex h-12 items-center border rounded-lg px-2">
            <Image
              src="/icon/place.svg"
              alt="Phone icon"
              className="h-10"
              width={18}
              height={18}
            ></Image>
            {mounted && (
              <Select
                options={locations}
                value={locationSelected}
                placeholder={`${
                  language === "en" ? "Select destination" : "Chọn điểm đến"
                }`}
                className="w-full"
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "none",
                    boxShadow: "none",
                    cursor: "pointer",
                  }),
                }}
                onChange={(selectedOption) =>
                  setLocationSelected(selectedOption)
                }
                components={{
                  IndicatorSeparator: () => null,
                  DropdownIndicator: () => null,
                }}
              />
            )}
          </div>
        </div>
        <div className="w-full lg:w-5/12">
          <label className="block text-gray-700 mb-1" data-translate="true">
            Ngày đi
          </label>
          <div className="flex h-12 items-center border rounded-lg px-2">
            <Image
              src="/icon/calendar.svg"
              alt="Phone icon"
              className="h-10"
              width={18}
              height={18}
            ></Image>
            <div className="w-full [&>div]:w-full border-none">
              <DatePicker
                // ref={departDateRef}
                selected={departureDate}
                onChange={(date) => setDepartureDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày"
                popperPlacement="bottom-start"
                minDate={today}
                locale={language === "vi" ? vi : enUS}
                onFocus={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                className="z-20 pl-3 w-full outline-none"
              />
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/12">
          <label className="block text-gray-700 mb-1 h-6"></label>
          <div
            onClick={() => handleSearch()}
            className="text-center cursor-pointer w-full items-center border rounded-lg px-2 h-12 bg-orange-500 hover:bg-orange-600  "
          >
            <Image
              src="/icon/search.svg"
              alt="Phone icon"
              className="h-10 inline-block"
              width={18}
              height={18}
              style={{ width: 18, height: 18 }}
            ></Image>
            <button
              type="button"
              className="ml-2 inline-block h-12 text-white rounded-lg focus:outline-none"
              data-translate="true"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
