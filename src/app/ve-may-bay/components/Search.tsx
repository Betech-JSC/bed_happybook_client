"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<string>(
    searchParams.get("ticket") || ""
  );
  const [flightPassenger, setFlightPassenger] = useState<string>("");
  const [cheapest, setCheapest] = useState<string>(
    searchParams.get("cheapest") || "0"
  );
  const [departDate, setDepart] = useState<string>("");
  const [returnDate, setReturn] = useState<string>("");
  const handleCheckboxCheapest = () => {
    setCheapest(cheapest === "1" ? "0" : "1");
  };
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (ticket.trim()) params.append("ticket", ticket);
    if (flightPassenger.trim())
      params.append("flightPassenger", flightPassenger);
    if (cheapest.trim()) params.append("cheapest", cheapest.toString());
    if (departDate.trim()) params.append("departDate", departDate);
    if (returnDate.trim()) params.append("returnDate", returnDate);

    router.push(`/ve-may-bay/tim-kiem-ve?${params.toString()}`);
  };
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:flex lg:space-x-12 mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="ticket"
            className="form-radio"
            value="oneway"
            checked={ticket === "oneway"}
            onChange={(e) => setTicket(e.target.value)}
          />
          <span className="text-black">Một chiều</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="ticket"
            className="form-radio"
            value="roundtrip"
            checked={ticket === "roundtrip"}
            onChange={(e) => setTicket(e.target.value)}
          />
          <span className="text-black">Khứ hồi</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={cheapest === "1"}
            onChange={handleCheckboxCheapest}
          />
          <span className="text-black">Tìm vé rẻ</span>
        </label>
      </div>

      <div className="flex flex-wrap lg:flex-nowrap lg:space-x-1 xl:space-x-2 space-y-2 lg:space-y-0">
        <div className="w-full lg:w-[40%] flex flex-wrap md:flex-nowrap space-y-2 md:space-y-0 md:space-x-2 relative">
          <div className="w-full md:w-1/2">
            <label className="block text-gray-700 mb-1">Từ</label>
            <div className="flex h-12 items-center border rounded-lg px-2">
              <Image
                src="/icon/AirplaneTakeoff.svg"
                alt="Icon"
                className="h-10"
                width={18}
                height={18}
              ></Image>
              <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
                <option>TP.Hồ Chí Minh</option>
              </select>
            </div>
          </div>
          <div className="absolute right-0 md:right-[unset] top-[60%] md:top-3/4 md:left-[48%] md:-translate-x-[48%] -translate-y-3/4">
            <button className="border border-gray-300 p-2 rounded-full bg-white">
              <Image
                src="/icon/switch-horizontal.svg"
                alt="Icon"
                className="h-5"
                width={20}
                height={20}
              ></Image>
            </button>
          </div>
          <div className="w-full md:w-1/2">
            <label className="block text-gray-700 mb-1">Đến</label>
            <div className="flex h-12 items-center border rounded-lg px-2 pl-6">
              <Image
                src="/icon/AirplaneLanding.svg"
                alt="Icon"
                className="h-10"
                width={18}
                height={18}
              />
              <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
                <option>Hà Nội</option>
              </select>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[22.5%]">
          <label className="block text-gray-700 mb-1">Ngày đi</label>
          <div className="flex justify-between h-12 space-x-2 items-center border rounded-lg px-2 text-black">
            <div className="flex items-center	w-full">
              <Image
                src="/icon/calendar.svg"
                alt="Icon"
                className="h-10"
                width={18}
                height={18}
              ></Image>
              <span>14/08/2024</span>
            </div>
            <div className="block md:hidden border-t border-black w-1/2"></div>
            <div>
              <span> 22/08/2024</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[20%]">
          <label className="block text-gray-700 mb-1">Số lượng khách</label>
          <div className="flex items-center border rounded-lg px-2 h-12">
            <Image
              src="/icon/user-circle.svg"
              alt="Icon"
              className="h-10"
              width={18}
              height={18}
            ></Image>
            <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
              <option>1 người lớn</option>
            </select>
          </div>
        </div>

        <div className="w-full lg:w-[15%]" onClick={handleSearch}>
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
    </div>
  );
}
