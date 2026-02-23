"use client";
import { Fragment, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import SelectMenu from "./Passenger/Menu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { buildSearch } from "@/utils/Helper";
import { format } from "date-fns";
import { useTranslation } from "@/hooks/useTranslation";

type LocationType = {
  id: number;
  name: string;
};
type PropsType = {
  locations: LocationType[];
};
export default function Search() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname: string = usePathname();

  const searchParams = useSearchParams();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [totalGuests, setTotalGuests] = useState<number>(1);
  const [totalRooms, setTotalRooms] = useState<number>(1);
  const [queryText, setQueryText] = useState<string>("");
  const handleSubmit = (e: React.FormEvent) => {
    if (pathname !== "/khach-san/tim-kiem") {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        ["text"]: queryText,
      }));
      router.push(`/khach-san/tim-kiem?text=${queryText}`);
    }
  };
  const [formData, setFormData] = useState<{
    text?: string;
  }>({});
  // const handleGuestChange = (key: string, value: number) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [key]: value,
  //   }));
  // };

  // const handleRoomChange = (key: string, value: number) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [key]: value,
  //   }));
  // };

  // const handleDateChange = (dates: [Date | null, Date | null]) => {
  //   const [start, end] = dates;
  //   setStartDate(start || undefined);
  //   setEndDate(end || undefined);
  // };

  // useEffect(() => {
  //   setTotalGuests(formData.adt + formData.chd + formData.inf);
  //   setTotalRooms(formData.room);
  // }, [formData]);

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <div className="w-full flex flex-wrap md:flex-nowrap lg:space-x-2 relative">
          <div className="w-full md:w-9/12">
            <label className="block text-gray-700 mb-1">
              {t("thanh_pho_dia_diem_hoac_ten_khach_san")}
            </label>
            <div className="mt-3 flex h-12 items-center border rounded-lg px-2">
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
                // required
                placeholder={`${t("tim_kiem")}...`}
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

          <div className="mt-3 w-full md:w-3/12">
            <label className="block text-gray-700  h-6"></label>
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
                {t("tim_kiem")}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
}
