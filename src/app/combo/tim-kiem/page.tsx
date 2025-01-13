import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import TourStyle from "@/styles/tour.module.scss";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Compo Nha Trang",
  description: "Happy Book",
};
type dataSideBarType = {
  title: string;
  values: {
    id: number;
    title: string;
    rating?: number;
  }[];
}[];
const dataSideBar: dataSideBarType = [
  {
    title: "Theo điểm đến",
    values: [
      {
        id: 1,
        title: "Côn Đảo",
      },
      {
        id: 2,
        title: "Phan Thiết",
      },
      {
        id: 3,
        title: "Nha Trang",
      },
      {
        id: 4,
        title: "Quy Nhơn",
      },
    ],
  },
  {
    title: "Hạng sao",
    values: [
      { id: 1, title: "5 sao", rating: 5 },
      { id: 2, title: "4 sao", rating: 4 },
    ],
  },
  {
    title: "Thời gian",
    values: [
      {
        id: 1,
        title: "4 ngày 3 đêm",
      },
      {
        id: 2,
        title: "3 ngày 2 đêm",
      },
      {
        id: 3,
        title: "2 ngày 1 đêm",
      },
    ],
  },
  {
    title: "Loại hình combo",
    values: [
      {
        id: 1,
        title: "Vé máy bay + Khách sạn",
      },
      {
        id: 2,
        title: "Nghỉ dưỡng",
      },
    ],
  },
];

type compoItem = {
  title: string;
  image: number;
  rating: number;
  totalReview: number;
  days: string;
  place: string;
  price: string;
  tags?: { title: string }[];
};
const arrTours: compoItem[] = [];
const compo: compoItem = {
  title:
    "Combo 3N2Đ Vinpearl Resort Nha Trang 5* + Vui chơi Vinwonders + Vé máy bay từ Hồ Chí Minh",
  image: 0,
  rating: 9.8,
  totalReview: 234,
  days: "2 ngày 1 đêm",
  place: "Thị Trấn An Thới, Huyện Phú Quốc, Tỉnh Kiên Giang, Việt Nam",
  price: "7.004.927",
  tags: [
    { title: "Hiện đại" },
    { title: "Miễn phí minibar" },
    { title: "Đồ uống chào mừng miễn phí" },
    { title: "Bãi biển riêng" },
    { title: "Thương hiệu quốc tế" },
  ],
};
for (var i = 1; i <= 7; i++) {
  const tourItem = { ...compo };
  tourItem.image = i;
  if (i == 2 || i == 5) {
    tourItem.title = "JW Marriott Hotel Hanoi";
  }
  arrTours.push(tourItem);
}
export default function SearchCompo({
  params,
}: {
  params: { category: string };
}) {
  return (
    <Fragment>
      <div className="bg-gray-100">
        <div className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
          <Breadcrumb className="pt-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="text-blue-700">
                    Trang chủ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/compo" className="text-blue-700">
                    Compo
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/compo/nha-trang" className="text-gray-700">
                    Combo Nha Trang
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* Section Tour */}
          <div className="flex mt-6 md:space-x-4 items-start">
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
                          <div className="flex space-x-1">
                            {value.rating !== undefined && (
                              <Fragment>
                                {Array.from({ length: 5 }, (_, index) =>
                                  value.rating !== undefined &&
                                  index < value.rating ? (
                                    <Image
                                      key={index}
                                      className="w-auto"
                                      src="/icon/starFull.svg"
                                      alt="Icon"
                                      width={10}
                                      height={10}
                                    />
                                  ) : (
                                    <Image
                                      key={index}
                                      className="w-auto"
                                      src="/icon/star.svg"
                                      alt="Icon"
                                      width={10}
                                      height={10}
                                    />
                                  )
                                )}
                              </Fragment>
                            )}
                          </div>
                          <span>{value.title}</span>
                        </div>
                      )
                    );
                  })}
                  {item.values.length > 3 && (
                    <button className="mt-3 flex items-center rounded-lg space-x-3 ">
                      <span className="text-[#175CD3] font-medium">
                        Xem thêm
                      </span>
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
                <h1 className="text-32 font-bold">Combo Nha Trang</h1>
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
                {arrTours.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col lg:flex-row lg:space-x-6 rounded-3xl bg-white mt-4"
                  >
                    <div className="w-full lg:w-5/12 relative overflow-hidden rounded-l-2xl">
                      <Link href="/compo/chi-tiet/compo-3n2d-vinpearl-resort-nha-trang">
                        <Image
                          className="hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full rounded-2xl lg:rounded-none lg:rounded-l-2xl"
                          src={`/compo/search/${item.image}.png`}
                          alt="Image"
                          width={360}
                          height={270}
                          sizes="100vw"
                        />
                      </Link>
                    </div>
                    <div className="w-full px-3 lg:px-0 lg:w-7/12 mt-4 lg:mt-0 flex flex-col justify-between">
                      <div className="my-4 mr-6">
                        <div className="flex flex-col lg:flex-row space-x-0 space-y-2 lg:space-y-0 lg:space-x-2">
                          <Link
                            href="/compo/chi-tiet/compo-3n2d-vinpearl-resort-nha-trang"
                            className="w-[80%] text-18 font-semibold hover:text-primary duration-300 transition-colors line-clamp-3"
                          >
                            <h2>{item.title}</h2>
                          </Link>
                          <div className="flex w-[20%] space-x-1">
                            {Array.from({ length: 5 }, (_, index) => (
                              <Image
                                key={index}
                                className="w-4 h-4"
                                src="/icon/starFull.svg"
                                alt="Icon"
                                width={16}
                                height={16}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-2 items-center">
                          <Image
                            className="w-4 h-4"
                            src="/icon/marker-pin-01.svg"
                            alt="Icon"
                            width={20}
                            height={20}
                          />
                          <span className="text-sm">
                            Thị Trấn An Thới, Huyện Phú Quốc, Tỉnh Kiên Giang,
                            Việt Nam
                          </span>
                        </div>
                        <div className="flex flex-wrap">
                          {item.tags &&
                            item.tags.map((item, index) => (
                              <span
                                className="mr-2 mt-2 py-[2px] px-[6px] border border-gray-300 rounded-sm"
                                key={index}
                              >
                                {item.title}
                              </span>
                            ))}
                        </div>
                      </div>
                      <div className="flex space-x-2 p-2 lg:mr-6 mt-8 mb-4 items-center justify-between bg-gray-50 rounded-lg">
                        <div className="flex space-x-1">
                          <span className="w-9 h-6 rounded-xl rounded-tr bg-primary text-white font-semibold text-center">
                            {item.rating}
                          </span>
                          <div className="flex flex-col space-y-1">
                            <span className="text-primary text-sm font-semibold">
                              Xuất sắc
                            </span>
                            <span className="text-gray-500 text-xs">
                              {item.totalReview} đánh giá
                            </span>
                          </div>
                        </div>
                        <div className="text-base md:text-xl text-primary font-semibold text-end">
                          <span className="text-gray-500 text-sm md:text-base mr-2">
                            chỉ từ
                          </span>
                          {item.price} vnđ
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 mb-8">
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
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
