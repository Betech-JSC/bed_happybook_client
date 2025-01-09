"use client";

import { Fragment, useState } from "react";
import TourStyle from "@/styles/tour.module.scss";
import Image from "next/image";
import Link from "next/link";

type dataSideBarType = {
  title: string;
  values: {
    id: number;
    title: string;
  }[];
}[];

const dataSideBar: dataSideBarType = [
  {
    title: "Theo điểm đến",
    values: [
      {
        id: 1,
        title: "Du lịch Miền Bắc",
      },
      {
        id: 2,
        title: "Du lịch Sapa",
      },
      {
        id: 3,
        title: "Du lịch Cần Thơ",
      },
      {
        id: 4,
        title: "Du lịch Hà Giang",
      },
      {
        id: 5,
        title: "Du lịch Vĩnh Phúc",
      },
      {
        id: 6,
        title: "Du lịch Vũng Tàu",
      },
    ],
  },
  {
    title: "Theo điểm đến quốc tế",
    values: [
      {
        id: 1,
        title: "Du lịch Miền Bắc",
      },
      {
        id: 2,
        title: "Du lịch Sapa",
      },
      {
        id: 3,
        title: "Du lịch Cần Thơ",
      },
      {
        id: 4,
        title: "Du lịch Hà Giang",
      },
      {
        id: 5,
        title: "Du lịch Vĩnh Phúc",
      },
      {
        id: 6,
        title: "Du lịch Vũng Tàu",
      },
    ],
  },
  {
    title: "Theo loại hình tour",
    values: [
      {
        id: 1,
        title: "Tour Nội Địa",
      },
      {
        id: 2,
        title: "Tou Quốc Tế",
      },
      {
        id: 3,
        title: "Tour Du Thuyền",
      },
    ],
  },
];

export default function ListTour({ data, titlePage }: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<{
    page?: number;
    [key: string]: string | number | boolean | undefined | any;
  }>({
    page: 1,
  });
  if (!data) return;
  return (
    <div className="flex mt-6 md:space-x-4 items-start pb-8">
      <div className="hidden md:block md:w-4/12 lg:w-3/12 p-4 bg-white rounded-2xl">
        {dataSideBar.map((item, index) => (
          <div
            key={index}
            className="pb-3 mb-3 border-b border-gray-200 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none"
          >
            <p className="font-semibold">{item.title}</p>
            {item.values.map((value) => {
              return (
                value.id < 6 && (
                  <div
                    key={value.id}
                    className="mt-3 flex space-x-2 items-center"
                  >
                    <input
                      type="checkbox"
                      className={TourStyle.custom_checkbox}
                    />
                    <span>{value.title}</span>
                  </div>
                )
              );
            })}
            {item.values.length > 5 && (
              <button className="mt-3 flex items-center rounded-lg space-x-3 ">
                <span className="text-[#175CD3] font-medium">Xem thêm</span>
                <Image
                  className="hover:scale-110 ease-in duration-300 rotate-90"
                  src="/icon/chevron-right.svg"
                  alt="Icon"
                  width={20}
                  height={20}
                />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="md:w-8/12 lg:w-9/12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-32 font-bold">{titlePage}</h1>
          <div className="flex my-4 md:my-0 space-x-3 items-center">
            <span>Sắp xếp</span>
            <div className="w-40 bg-white border border-gray-200 rounded-lg">
              <select
                className="px-4 py-2 rounded-lg w-[90%] outline-none bg-white"
                name=""
                id=""
              >
                <option value="">Mới nhất</option>
                <option value="">Cũ nhất</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mb-4">
          {data.total > 0 &&
            data.tours.map((tour: any, index: number) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row lg:space-x-6 rounded-3xl bg-white p-5 mt-4"
              >
                <div className="w-full lg:w-5/12 relative overflow-hidden rounded-xl">
                  <Link href={`/tours/chi-tiet/${tour.slug}`}>
                    <Image
                      className=" hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full"
                      src={`${tour.image_url}/${tour.image_location}`}
                      alt="Image"
                      width={360}
                      height={270}
                      sizes="100vw"
                      style={{ height: 270 }}
                    />
                  </Link>
                  <div className="absolute bottom-0 left-0 text-white px-3 py-1 bg-[#4E6EB3] rounded-tr-3xl">
                    <span>{tour.category_name}</span>
                  </div>
                  {tour.is_hot > 0 && (
                    <div className="absolute top-3 left-3 text-white px-3 py-1 bg-[#F27145] rounded-md">
                      <span>Hot tour</span>
                    </div>
                  )}
                </div>
                <div className="w-full lg:w-7/12 mt-4 lg:mt-0 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/tours/chi-tiet/${tour.slug}`}
                      className="text-18 font-semibold hover:text-primary duration-300 transition-colors"
                    >
                      <h2>{tour.product_name}</h2>
                    </Link>
                    <div className="flex space-x-2 mt-2">
                      {tour.rating && (
                        <Fragment>
                          <span className="w-9 h-6 rounded-xl rounded-tr bg-primary text-white font-semibold text-center">
                            {tour.rating}
                          </span>

                          <span className="text-primary font-semibold">
                            Xuất sắc
                          </span>
                        </Fragment>
                      )}
                      <span className="text-gray-500">
                        {tour.totalReview ?? 0} đánh giá
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-2 items-center">
                      <Image
                        className="w-4 h-4"
                        src="/icon/clock.svg"
                        alt="Icon"
                        width={18}
                        height={18}
                      />
                      <span>
                        {tour.day && tour.night
                          ? tour.day && tour.night
                          : "Trong ngày"}
                      </span>
                    </div>
                    {tour.placeFrom && (
                      <div className="flex space-x-2 mt-2 items-center">
                        <Image
                          className="w-4 h-4"
                          src="/icon/flag.svg"
                          alt="Icon"
                          width={18}
                          height={18}
                        />
                        <span>{tour.placeFrom}</span>
                      </div>
                    )}
                    {tour.placeTo && (
                      <div className="flex space-x-2 mt-2 items-center">
                        <Image
                          className="w-4 h-4"
                          src="/icon/marker-pin-01.svg"
                          alt="Icon"
                          width={18}
                          height={18}
                        />
                        <span>{tour.placeTo}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-2xl text-primary font-bold text-end mt-3">
                    {tour.price.toLocaleString()} vnđ
                  </div>
                </div>
              </div>
            ))}
        </div>
        {data.last_page !== query.page && (
          <div className="mt-4">
            <button
              className="flex mx-auto group w-40 py-3 rounded-lg px-4 bg-white mt-6 space-x-2 border duration-300 text__default_hover
            justify-center items-center hover:border-primary"
            >
              <span className="font-medium">Xem thêm</span>
              <svg
                className="group-hover:stroke-primary stroke-gray-700 duration-300"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
