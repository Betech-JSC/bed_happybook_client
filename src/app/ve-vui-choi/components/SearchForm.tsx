import Image from "next/image";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { vi, enUS } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ProductTicket } from "@/api/ProductTicket";
import { format, isValid } from "date-fns";
import toast from "react-hot-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { buildSearch } from "@/utils/Helper";

type Option = {
  label: string;
  value: string;
};

export default function SearchForm({ locations: propLocations = [] }: { locations?: any[] }) {
  const { t } = useTranslation();
  const router = useRouter();
  const today = new Date();
  const { language } = useLanguage();

  // Search mode state: "location" (from HEAD) or "route" (from master)
  const [searchMode, setSearchMode] = useState<"location" | "route">("location");

  // State for Location Mode (HEAD logic)
  const [locationSelected, setLocationSelected] = useState<any>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(today);
  const [fetchedLocations, setFetchedLocations] = useState<Option[]>([]);
  const [mounted, setMounted] = useState(false);
  const locationRef = useRef<Option | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isFetchedRef = useRef<boolean>(false);
  const lastFetchedDateRef = useRef<string | null>(null);
  const activeRequestRef = useRef<string | null>(null);
  const hasOpenedRef = useRef<boolean>(false);

  // State for Route Mode (Master logic)
  const [query, setQuery] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    const dateStr = format(
      isValid(departureDate) ? departureDate! : new Date(),
      "yyyy-MM-dd"
    );

    if (isFetchedRef.current && lastFetchedDateRef.current === dateStr) {
      return;
    }

    activeRequestRef.current = dateStr;
    setIsLoading(true);
    setFetchedLocations([]);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (activeRequestRef.current !== dateStr) {
        return;
      }

      const res = await ProductTicket.location(`?departDate=${dateStr}`, language);
      if (activeRequestRef.current !== dateStr) {
        return;
      }
      const data = res?.payload?.data ?? [];

      const newOptions: Option[] = data.map((item: any) => ({
        label: `${item.name} ${item?.ticket?.location?.name
          ? `(${item?.ticket?.location?.name})`
          : ""
          }`,
        value: `${item.slug}-${item.id}`,
      }));

      setFetchedLocations(newOptions);

      isFetchedRef.current = true;
      lastFetchedDateRef.current = dateStr;

      const current = locationRef.current;
      if (current) {
        const stillExists = newOptions.find(
          (opt) => opt.value === current.value
        );
        setLocationSelected(stillExists ?? null);
      }
    } catch (error) {
      if (activeRequestRef.current === dateStr) {
        console.error("Error fetching locations:", error);
      }
    } finally {
      if (activeRequestRef.current === dateStr) {
        setIsLoading(false);
      }
    }
  }, [departureDate, language]);

  useEffect(() => {
    if (hasOpenedRef.current) {
      fetchData();
    }
  }, [departureDate, fetchData]);

  useEffect(() => {
    locationRef.current = locationSelected;
  }, [locationSelected]);

  // Handle Search for Location Mode (HEAD)
  const handleSearchLocation = () => {
    if (locationSelected && isValid(departureDate)) {
      const date = format(
        isValid(departureDate ?? undefined) ? departureDate! : new Date(),
        "yyyy-MM-dd"
      );
      const lastDashIndex = locationSelected.value.lastIndexOf("-");
      const slug = locationSelected.value.substring(0, lastDashIndex);
      router.push(`/ve-vui-choi/${slug}?departDate=${date}`);
    } else {
      toast.dismiss();
      toast.error(t("vui_long_chon_day_du_thong_tin") || "Vui lòng chọn đầy đủ thông tin");
    }
  };

  // Handle Search for Route Mode (Master)
  const handleSearchRoute = () => {
    const querySearch = buildSearch(query);
    router.push(`/ve-vui-choi${querySearch}`);
  };

  // Options for Route Mode
  const fromOptions = propLocations.filter((opt: any) => opt.label !== query?.to);
  const toOptions = propLocations.filter((opt: any) => opt.label !== query?.from);

  return (
    <Fragment>
      {/* Title & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 mt-2 gap-3">
        <label className="flex items-center space-x-2">
          <span className="text-[18px] font-semibold text-black">
            {t("tim_ve_vui_choi")}
          </span>
        </label>
        
        {/* Toggle Mode buttons */}
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setSearchMode("location")}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
              searchMode === "location"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("tim_theo_dia_diem") || "Tìm theo địa điểm & ngày"}
          </button>
          <button
            type="button"
            onClick={() => setSearchMode("route")}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
              searchMode === "route"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("tim_theo_chang") || "Tìm theo chặng"}
          </button>
        </div>
      </div>

      {searchMode === "location" ? (
        /* Location Mode UI (HEAD style) */
        <div className="flex flex-wrap lg:flex-nowrap gap-2">
          <div className="w-full lg:w-5/12">
            <label className="block text-gray-700 mb-1">{t("diem_di")}</label>
            <div className="flex h-12 items-center border rounded-lg px-2 bg-white">
              <Image
                src="/icon/place.svg"
                alt="Place icon"
                className="h-10"
                width={18}
                height={18}
              />
              {mounted && (
                <Select
                  options={fetchedLocations}
                  value={locationSelected}
                  placeholder={`${
                    language === "en" ? "Select destination" : "Chọn điểm đến"
                  }`}
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
                  onChange={(selectedOption) =>
                    setLocationSelected(selectedOption)
                  }
                  components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator: () => null,
                  }}
                  onMenuOpen={() => {
                    if (!hasOpenedRef.current) {
                      hasOpenedRef.current = true;
                      fetchData();
                    }
                  }}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
          <div className="w-full lg:w-5/12">
            <label className="block text-gray-700 mb-1">{t("ngay_di")}</label>
            <div className="flex h-12 items-center border rounded-lg px-2 bg-white">
              <Image
                src="/icon/calendar.svg"
                alt="Calendar icon"
                className="h-10"
                width={18}
                height={18}
              />
              <div className="w-full [&>div]:w-full border-none">
                <DatePicker
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
              onClick={handleSearchLocation}
              className="text-center cursor-pointer w-full items-center border rounded-lg px-2 h-12 bg-orange-700 hover:bg-orange-800 duration-300 flex items-center justify-center"
            >
              <Image
                src="/icon/search.svg"
                alt="Search icon"
                className="h-10 inline-block"
                width={18}
                height={18}
                style={{ width: 18, height: 18 }}
              />
              <button
                type="button"
                className="ml-2 inline-block h-12 text-white rounded-lg focus:outline-none font-medium"
                disabled={isLoading}
              >
                {t("tim_kiem")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Route Mode UI (Master style) */
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
              onClick={handleSearchRoute}
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
      )}
    </Fragment>
  );
}
