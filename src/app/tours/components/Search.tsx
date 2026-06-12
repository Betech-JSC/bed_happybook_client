"use client";
import Image from "next/image";
import TourStyle from "@/styles/tour.module.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

export default function SearchTour({ isHomePage = false }: { isHomePage?: boolean }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [queryText, setQueryText] = useState<string>("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/tours/tim-kiem?text=${queryText}`);
  };

  if (isHomePage) {
    return (
      <form onSubmit={handleSubmit}>
        <div className="w-full flex flex-wrap md:flex-nowrap lg:space-x-2 relative mt-4">
          <div className="w-full md:w-9/12">
            <label className="block text-gray-700 mb-1">
              {t("tour_trai_nghiem") || "Tour & Trải nghiệm"}
            </label>
            <div className="mt-3 flex h-12 items-center border rounded-lg px-2 bg-white">
              <Image
                src="/icon/place.svg"
                alt="Địa điểm"
                className="h-5"
                width={18}
                height={18}
              />
              <input
                className="pl-3 flex-1 focus:outline-none text-black appearance-none"
                type="text"
                placeholder={t("tim_theo_diem_den_hoat_dong") || "Tìm theo điểm đến, hoạt động"}
                name="text"
                onChange={(e) => setQueryText(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-3 w-full md:w-3/12">
            <label className="block text-gray-700 h-6"></label>
            <div
              onClick={handleSubmit}
              className="text-center cursor-pointer w-full items-center border rounded-lg px-2 h-12 bg-orange-700 hover:bg-orange-800 flex items-center justify-center"
            >
              <Image
                src="/icon/search.svg"
                alt="Tìm kiếm"
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
    );
  }

  return (
    <form
      className="base__content h-full relative place-content-center"
      onSubmit={handleSubmit}
    >
      <h1 className="text-32 font-bold text-white mb-6 block">
        {t("tour_trai_nghiem")}
      </h1>
      <div className="flex items-center w-full lg:w-1/2 relative">
        <div className="absolute left-4">
          <Image
            src="/icon/place.svg"
            alt="Địa điểm"
            className="h-10"
            width={20}
            height={20}
            style={{ width: 20, height: 20 }}
          ></Image>
        </div>
        <input
          type="text"
          placeholder={t("tim_theo_diem_den_hoat_dong")}
          name="text"
          className={TourStyle.search_input}
          onChange={(e) => {
            setQueryText(e.target.value);
          }}
        />
        <button className="bg-blue-500 px-3 rounded-r-lg w-16 h-16">
          <Image
            src="/icon/search.svg"
            alt="Search icon"
            className="h-10 mx-auto"
            width={20}
            height={20}
            style={{ width: 20, height: 20 }}
          ></Image>
        </button>
      </div>
    </form>
  );
}
