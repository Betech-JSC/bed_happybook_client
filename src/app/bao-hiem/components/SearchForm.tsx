"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, isValid } from "date-fns";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { isNumber } from "lodash";
import { Location as InsuranceLocation, SearchForm } from "@/types/insurance";
import { ProductInsurance } from "@/api/ProductInsurance";
import { vi, enUS } from "date-fns/locale";

export default function SearchFormInsurance() {
  const today = new Date();
  const router = useRouter();
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const departDateRef = useRef<DatePicker | null>(null);
  const returnDateRef = useRef<DatePicker | null>(null);
  const [mounted, setMounted] = useState(false);
  const [departure, setDeparture] = useState<InsuranceLocation[]>([]);
  const [locationData, setLocationData] = useState<any>([]);
  const [destination, setDestination] = useState<InsuranceLocation[]>([]);
  const [totalGuests, setTotalGuests] = useState<number>(1);
  const [areaType, setAreaType] = useState<string>("");
  const [formData, setFormData] = useState<SearchForm>({
    departurePlace: "",
    destinationPlace: "",
    departureDate: null,
    returnDate: null,
    guests: 1,
    type: "",
  });

  useEffect(() => {
    const getOptions = async () => {
      const response = await ProductInsurance.location();
      if (response?.payload?.data?.departure?.length) {
        const departure = response?.payload?.data?.departure.map(
          (item: any) => ({
            label: item.name,
            value: item.id,
          })
        );
        setDeparture(departure);
      }
      if (response?.payload?.data?.destination?.length) {
        const destination = response?.payload?.data?.destination.map(
          (item: any) => ({
            label: item.name,
            value: item.id,
          })
        );
        setDestination(destination);
      }
      setLocationData(response?.payload?.data ?? []);
    };
    getOptions();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleIncrement = () => {
    if (totalGuests < 100) {
      setTotalGuests((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (totalGuests > 1) {
      setTotalGuests((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const departDate = parse(
      searchParams.get("departDate") ?? "",
      "ddMMyyyy",
      new Date()
    );
    const returnDate = parse(
      searchParams.get("returnDate") ?? "",
      "ddMMyyyy",
      new Date()
    );
    setFormData({
      departurePlace: searchParams.get("departure") ?? "",
      destinationPlace: searchParams.get("destination") ?? "",
      departureDate: isValid(departDate) ? departDate : null,
      returnDate: isValid(returnDate) ? returnDate : null,
      guests: isNumber(parseInt(searchParams.get("guests") ?? "1"))
        ? parseInt(searchParams.get("guests") ?? "1")
        : 1,
      type: searchParams.get("type") ?? "",
    });
  }, [searchParams]);

  const handleFocusNextDate = (nextRef: React.RefObject<DatePicker | null>) => {
    if (nextRef.current) {
      nextRef.current.setFocus();
    }
  };

  const handleDepartDateChange = (date: Date | null) => {
    if (!formData.returnDate) {
      handleFocusNextDate(returnDateRef);
    }
    if (formData.returnDate && date && date > formData.returnDate) {
      formData.returnDate = date;
    }
    setFormData((prev) => ({
      ...prev,
      departureDate: date,
    }));
  };

  const handleReturnDateChange = (date: Date | null) => {
    if (formData.departureDate && date && date < formData.departureDate) {
      date = formData.departureDate;
    }
    setFormData((prev) => ({
      ...prev,
      returnDate: date,
    }));
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      guests: totalGuests,
    }));
  }, [totalGuests]);

  const handleSearch = () => {
    const {
      departurePlace,
      destinationPlace,
      departureDate,
      returnDate,
      guests,
    } = formData;
    if (
      departurePlace &&
      destinationPlace &&
      departureDate &&
      returnDate &&
      guests > 0
    ) {
      const formattedDate = departureDate
        ? format(departureDate, "ddMMyyyy")
        : "";
      const formattedReturndate = returnDate
        ? format(returnDate, "ddMMyyyy")
        : "";
      const queryString = `/bao-hiem?departure=${departurePlace}&destination=${destinationPlace}&departDate=${formattedDate}&returnDate=${formattedReturndate}&guests=${guests}&type=${areaType}`;
      router.push(queryString);
    } else {
      toast.dismiss();
      toast.error("Vui lòng chọn đầy đủ thông tin");
    }
  };

  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-4 lg:gap-2">
      <div className="w-full xl:w-[40%] flex flex-wrap md:flex-nowrap gap-3">
        <div className="w-full md:w-1/2">
          <label
            className="block text-gray-700 mb-2 lg:mb-1"
            data-translate="true"
          >
            Điểm đi
          </label>
          <div className="flex h-12 items-center border rounded-lg px-2">
            <Image
              src="/icon/place.svg"
              alt="Icon"
              className="h-10"
              width={18}
              height={18}
            ></Image>
            {mounted && (
              <Select
                value={departure.find(
                  (opt) => opt.label === formData.departurePlace
                )}
                options={departure}
                placeholder={`${
                  language === "en" ? "Select insurance" : "Chọn địa điểm"
                }`}
                className="w-full flex-1 focus:outline-none text-black appearance-none"
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "none",
                    boxShadow: "none",
                    cursor: "pointer",
                  }),
                  menu: (base) => ({
                    ...base,
                    width: "260px",
                  }),
                }}
                onChange={(selectedOption) =>
                  setFormData((prev) => ({
                    ...prev,
                    departurePlace: selectedOption ? selectedOption.label : "",
                  }))
                }
                components={{
                  IndicatorSeparator: () => null,
                  DropdownIndicator: () => null,
                }}
              />
            )}
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <label
            className="block text-gray-700 mb-2 lg:mb-1"
            data-translate="true"
          >
            Điểm đến
          </label>
          <div className="flex h-12 items-center border rounded-lg px-2">
            <Image
              src="/icon/place.svg"
              alt="Icon"
              className="h-10"
              width={18}
              height={18}
            ></Image>
            {mounted && (
              <Select
                value={destination.find(
                  (opt) => opt.label === formData.destinationPlace
                )}
                options={destination}
                placeholder={`${
                  language === "en" ? "Select insurance" : "Chọn địa điểm"
                }`}
                className="w-full flex-1 focus:outline-none text-black appearance-none"
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "none",
                    boxShadow: "none",
                    cursor: "pointer",
                  }),
                  menu: (base) => ({
                    ...base,
                    width: "260px",
                  }),
                }}
                onChange={(selectedOption) => {
                  setFormData((prev) => ({
                    ...prev,
                    destinationPlace: selectedOption
                      ? selectedOption.label
                      : "",
                  }));
                  const destinationLocation = locationData?.destination ?? [];
                  const region = destinationLocation.find(
                    (item: any) => item.id === selectedOption?.value
                  );
                  if (region?.region?.type === "domestic") {
                    setAreaType("domestic");
                  } else {
                    setAreaType("international");
                  }
                }}
                components={{
                  IndicatorSeparator: () => null,
                  DropdownIndicator: () => null,
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="w-full xl:w-[50%] flex flex-wrap md:flex-nowrap gap-2 md:gap-3">
        <div className="w-full md:w-1/2 lg:w-[55%]">
          <label
            className="block text-gray-700 mb-2 lg:mb-1"
            data-translate="true"
          >
            Ngày đi - Ngày về
          </label>
          <div className="flex gap-3 h-12 items-center border rounded-lg px-2 text-black">
            <div className="w-[45%] flex justify-between items-center	">
              <Image
                src="/icon/calendar.svg"
                alt="Phone icon"
                className="h-10"
                width={18}
                height={18}
              ></Image>
              <div className="w-full [&>div]:w-full border-none">
                <DatePicker
                  id="insurance_start_date"
                  ref={departDateRef}
                  selected={formData.departureDate}
                  onChange={handleDepartDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Ngày đi"
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
            <div className="w-[12px] xl:w-[20px]">
              <Image
                src="/icon/line.png"
                alt="Icon"
                className="h-[1px] max-w-[12px] xl:max-w-[20px] mx-auto"
                width={280}
                height={1}
              ></Image>
            </div>
            <div className="w-[45%] [&>div]:w-full border-none">
              <DatePicker
                id="insurance_return_date"
                ref={returnDateRef}
                selected={formData.returnDate}
                onChange={handleReturnDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Ngày về"
                popperPlacement="bottom-start"
                locale={language === "vi" ? vi : enUS}
                autoComplete="off"
                minDate={
                  formData.departureDate && isValid(formData.departureDate)
                    ? formData.departureDate
                    : today
                }
                openToDate={
                  formData.departureDate && isValid(formData.departureDate)
                    ? formData.departureDate
                    : today
                }
                onFocus={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                className="z-20 lg:pl-3 w-full outline-none text-center"
              />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-[45%]">
          <label
            className="block text-gray-700 mb-2 lg:mb-1"
            data-translate="true"
          >
            Số lượng khách
          </label>
          <div className="flex items-center border rounded-lg px-2 h-12">
            <Image
              src="/icon/user-circle.svg"
              alt="Icon"
              className="h-10"
              width={18}
              height={18}
            ></Image>
            <div className="w-full justify-center flex items-center gap-5 md:gap-3">
              <button
                onClick={() => handleDecrement()}
                className={`w-8 h-8 md:w-6 md:h-6 rounded-full bg-gray-200 flex items-center justify-center`}
              >
                <span>-</span>
              </button>
              <span className="text-base">{totalGuests} hành khách</span>
              <button
                onClick={() => handleIncrement()}
                className={`w-8 h-8 md:w-6 md:h-6 rounded-full bg-blue-500 text-white flex items-center justify-center `}
              >
                <span>+</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[10%]" onClick={handleSearch}>
        <label className="hidden lg:block text-gray-700 mb-1 h-6"></label>
        <div className="text-center cursor-pointer w-full items-center border rounded-lg px-2 h-12 bg-orange-500 hover:bg-orange-600  ">
          <Image
            src="/icon/search.svg"
            alt="Phone icon"
            className="h-10 inline-block"
            width={18}
            height={18}
            style={{ width: 18, height: 18 }}
          ></Image>
          <button
            className="ml-2 inline-block h-12 text-white rounded-lg focus:outline-none"
            data-translate="true"
          >
            Tra cứu
          </button>
        </div>
      </div>
    </div>
  );
}
