"use client";
import { Fragment, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import SelectMenu from "./Passenger/Menu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";

type LocationType = {
  id: number;
  name: string;
};
type PropsType = {
  locations: LocationType[];
};
export default function Search({ locations }: PropsType) {
  const router = useRouter();
  const pathname: string = usePathname();

  const searchParams = useSearchParams();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [totalGuests, setTotalGuests] = useState<number>(1);
  const [queryText, setQueryText] = useState<string>("");
  const handleSubmit = (e: React.FormEvent) => {
    if (pathname !== "/khach-san/tim-kiem") {
      e.preventDefault();
      router.push(`/khach-san/tim-kiem?text=${queryText}`);
    }
  };
  const [formData, setFormData] = useState<{
    adt: number;
    chd: number;
    inf: number;
  }>({
    adt: 1,
    chd: 0,
    inf: 0,
  });
  const handleGuestChange = (key: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start || undefined);
    setEndDate(end || undefined);
  };

  useEffect(() => {
    setTotalGuests(formData.adt + formData.chd + formData.inf);
  }, [formData]);

  return (
    <Fragment>
      <form
        className="flex flex-wrap lg:flex-nowrap lg:space-x-1 xl:space-x-2 space-y-2 lg:space-y-0"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex flex-wrap lg:flex-nowrap space-y-2 lg:space-y-0 lg:space-x-2 relative">
          <div className="w-full lg:w-1/2">
            <label className="block text-gray-700 mb-1">
              Thành phố, địa điểm hoặc tên khách sạn:
            </label>
            <div className="flex h-12 items-center border rounded-lg px-2">
              <Image
                src="/icon/place.svg"
                alt="Icon"
                className="h-10"
                width={18}
                height={18}
              ></Image>
              <input
                className="pl-3 flex-1 focus:outline-none text-black appearance-none"
                name="text"
                placeholder="Tìm kiếm..."
                defaultValue={searchParams.get("text") ?? ""}
                onChange={(e) => {
                  setQueryText(e.target.value);
                }}
              >
                {/* {locations.length > 0 &&
                  locations.map((item: LocationType, index: number) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))} */}
              </input>
            </div>
          </div>
          <div className="w-full lg:w-[22.5%]">
            <label className="block text-gray-700 mb-1">
              Từ ngày - đến ngày
            </label>
            <div className="flex justify-between h-12 space-x-2 items-center border rounded-lg px-2 text-black">
              <div className="flex items-center	w-full">
                <Image
                  src="/icon/calendar.svg"
                  alt="Icon"
                  className="h-10"
                  width={18}
                  height={18}
                ></Image>
                <div className="w-full pl-3">
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    locale={vi}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn ngày"
                    minDate={new Date()}
                    className="w-full outline-none"
                  />
                </div>
              </div>
              {/* <div className="block md:hidden border-t border-black w-1/2"></div>
              <div>
                <span> 22/08/2024</span>
              </div> */}
            </div>
          </div>

          <div className="w-full lg:w-[20%]">
            <label className="block text-gray-700 mb-1">Khách</label>
            <div className="flex items-center border rounded-lg px-2 h-12">
              <Image
                src="/icon/user-circle.svg"
                alt="Icon"
                className="h-10"
                width={18}
                height={18}
              ></Image>
              <SelectMenu
                formData={formData}
                totalGuests={totalGuests}
                onGuestsChange={handleGuestChange}
              />
            </div>
          </div>

          <div className="w-full lg:w-[15%]">
            <label className="block text-gray-700 mb-1 h-6"></label>
            <div className="text-center cursor-pointer w-full items-center border rounded-lg px-2 h-12 bg-orange-500 hover:bg-orange-600">
              <Image
                src="/icon/search.svg"
                alt="Icon"
                className="h-10 inline-block"
                width={18}
                height={18}
                style={{ width: 18, height: 18 }}
              />
              <button className="ml-2 inline-block h-12 text-white rounded-lg focus:outline-none">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
}
