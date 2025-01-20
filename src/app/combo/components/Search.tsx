"use client";
import { Fragment, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { LocationType } from "@/types/location";
import "react-datepicker/dist/react-datepicker.css";
import { buildSearch } from "@/utils/Helper";

export default function Search({ locations }: { locations: LocationType[] }) {
  const router = useRouter();
  const [query, setQuery] = useState<{
    from: string;
    to: string;
  }>({
    from: "",
    to: "",
  });
  const handleSearch = () => {
    const querySearch = buildSearch(query);
    router.push(`/combo/tim-kiem${querySearch}`);
  };
  return (
    <Fragment>
      <div className="base__content h-full relative place-content-center my-12 lg:my-16">
        <div className="bg-white rounded-2xl p-3 md:p-6 w-full lg:w-[850px]">
          <h1 className="text-18 font-semibold">Tìm Combo du lịch</h1>
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
                Khởi hành từ
              </label>
              <select
                id="from"
                defaultValue={""}
                onChange={(e) => {
                  setQuery({
                    ...query,
                    from: e.target.value,
                  });
                }}
                className={`mt-2 w-full rounded-lg p-2 border border-gray-300 h-12 indent-10 outline-none`}
              >
                <option value="">Chọn điểm đi</option>
                {locations.map((location) => (
                  <option
                    key={location.id}
                    value={location.name}
                    disabled={query.to === location.name}
                  >
                    {location.name}
                  </option>
                ))}
              </select>
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
                Điểm đến
              </label>
              <select
                id="to"
                onChange={(e) => {
                  setQuery({
                    ...query,
                    to: e.target.value,
                  });
                }}
                className={`mt-2 w-full rounded-lg p-2 border border-gray-300 h-12 indent-10 outline-none`}
              >
                <option value="">Chọn điểm đến</option>
                {locations.map((location) => (
                  <option
                    key={location.id}
                    value={location.name}
                    disabled={query.from === location.name}
                  >
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="w-full lg:w-[30%] relative">
              <div className="absolute left-4 top-1/2 translate-y-1/4 z-10">
                <Image
                  src="/icon/calendar.svg"
                  alt="Icon"
                  className="h-10"
                  width={20}
                  height={20}
                  style={{ width: 20, height: 20 }}
                ></Image>
              </div>
              <label htmlFor="typeVisa" className="font-medium block">
                Ngày khởi hành
              </label>
              <div className="w-full  [&>div]:w-full border-none">
                <DatePicker
                  selectsRange
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn ngày khởi hành"
                  minDate={new Date()}
                  locale={vi}
                  className={`mt-2 w-full rounded-lg p-2 border border-gray-300 h-12 indent-10 outline-none`}
                />
              </div>
            </div> */}
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
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
