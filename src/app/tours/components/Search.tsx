"use client";
import Image from "next/image";
import TourStyle from "@/styles/tour.module.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchTour() {
  const router = useRouter();
  const [queryText, setQueryText] = useState<string>("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/tours/tim-kiem?text=${queryText}`);
  };

  return (
    <form
      className="base__content h-full relative place-content-center"
      onSubmit={handleSubmit}
    >
      <h1 className="text-32 font-bold text-white mb-6 block" data-translate>
        Tour & Trải nghiệm
      </h1>
      <div className="flex items-center w-full lg:w-1/2 relative">
        <div className="absolute left-4">
          <Image
            src="/icon/place.svg"
            alt="Icon"
            className="h-10"
            width={20}
            height={20}
            style={{ width: 20, height: 20 }}
          ></Image>
        </div>
        <input
          type="text"
          placeholder="Tìm theo điểm đến, hoạt động"
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
