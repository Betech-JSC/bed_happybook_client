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
import FAQ from "@/components/FAQ";
import { Fragment, Suspense } from "react";
import Search from "../components/Search";
import { HotelApi } from "@/api/Hotel";

export const metadata: Metadata = {
  title: "Khách sạn",
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
    title: "Loại hình cư trú",
    values: [
      {
        id: 1,
        title: "Khách sạn",
      },
      {
        id: 2,
        title: "Khách sạn căn hộ",
      },
      {
        id: 3,
        title: "Du thuyền",
      },
      {
        id: 4,
        title: "Khách sạn con nhộng",
      },
      {
        id: 5,
        title: "Nhà khách",
      },
      {
        id: 6,
        title: "Căn hộ",
      },
      {
        id: 7,
        title: "Giường & bữa sáng",
      },
      {
        id: 8,
        title: "Hostel",
      },
      {
        id: 9,
        title: "Hostal",
      },
      {
        id: 10,
        title: "Khu căn hộ",
      },
      {
        id: 11,
        title: "Nhà nghỉ tư nhân",
      },
    ],
  },
  {
    title: "Xếp hạng sao khách sạn",
    values: [
      { id: 1, title: "5 sao", rating: 5 },
      { id: 2, title: "4 sao", rating: 4 },
      { id: 3, title: "3 sao", rating: 3 },
      { id: 4, title: "2 sao", rating: 2 },
      { id: 5, title: "1 sao", rating: 1 },
    ],
  },
  {
    title: "Tiện nghi dịch vụ",
    values: [
      {
        id: 1,
        title: "Bữa sáng miễn phí",
      },
      {
        id: 2,
        title: "Miễn phí wifi",
      },
      {
        id: 3,
        title: "Buffet sáng",
      },
      {
        id: 4,
        title: "Miễn phí đỗ xe có nhân viên",
      },
      { id: 5, title: "Đồ uống chào mừng miễn phí" },
      { id: 6, title: "Đồ uống chào mừng miễn phí" },
    ],
  },
  {
    title: "Tiện nghi khách sạn",
    values: [
      {
        id: 1,
        title: "Dịch vụ giặt khô / giặt ủi",
      },
      {
        id: 2,
        title: "Đưa đón sân bay (phụ phí)",
      },
      {
        id: 3,
        title: "Lối đi lại cho xe lăn - không",
      },
      {
        id: 4,
        title: "Gần bãi đậu xe",
      },
      {
        id: 5,
        title: "Trông giữ / bảo quản hành lí",
      },
      {
        id: 6,
        title: "Trông giữ / bảo quản hành lí",
      },
    ],
  },
  {
    title: "Đánh giá khách hàng",
    values: [
      {
        id: 1,
        title: "Bất kỳ",
      },
      {
        id: 2,
        title: "Tuyệt vời 9+",
      },
      {
        id: 3,
        title: "Rất tốt 8+",
      },
      {
        id: 4,
        title: "Tốt 7+",
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
  discount: number;
  refund: string;
  tags?: { title: string }[];
};
const arrTours: compoItem[] = [];
const compo: compoItem = {
  title: "Sofitel Legend Metropole Hà Nội",
  image: 0,
  rating: 9.8,
  totalReview: 234,
  days: "2 ngày 1 đêm",
  place: "15 Ngô Quyền, Hoàn Kiếm - Hà Nội",
  price: "7.004.927",
  discount: 20,
  refund: "",
  tags: [
    { title: "Miễn phí" },
    { title: "Đồ uống chào mừng miễn phí" },
    { title: "Buffet sáng " },
    { title: "Miễn phí minibar" },
  ],
};
for (var i = 1; i <= 7; i++) {
  const tourItem = { ...compo };
  tourItem.image = i;
  if (i == 2 || i == 5) {
    tourItem.title = "JW Marriott Hotel Hanoi";
  }
  if (i == 1 || i == 5) {
    tourItem.refund = "Hoàn tiền toàn bộ";
  }
  arrTours.push(tourItem);
}
export default async function SearchHotel({
  params,
}: {
  params: { category: string };
}) {
  const locations = (await HotelApi.getLocations())?.payload?.data as any;

  return (
    <Fragment>
      <div className="relative z-[0] h-max pb-12">
        <div className="absolute inset-0">
          <Image
            priority
            src="/hotel/bg-header.png"
            width={1600}
            height={584}
            className="object-cover w-full h-full"
            alt="Background"
          />
        </div>
        <div
          className="absolute w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
          }}
        ></div>
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-[100px] lg:pt-[132px] max__screen">
          <div className="mt-0 lg:mt-28 lg:mb-10 p-6 mx-auto  bg-white rounded-lg shadow-lg relative">
            <Suspense>
              <Search locations={locations} />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 relative z-2 rounded-2xl top-[-12px]">
        <div className="px-3 lg:px-[80px] max__screen">
          <Breadcrumb className="pt-4">
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
                  <Link href="/khach-san" className="text-gray-700">
                    Khách sạn
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* Section Hotel */}
          <div className="flex mt-6 md:space-x-4 items-start">
            <div className="hidden md:block md:w-4/12 lg:w-3/12 p-4 bg-white rounded-2xl">
              <div className="pb-3 mb-3 border-b border-gray-200 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none">
                <p className="font-semibold">Sắp xếp</p>
                <select
                  name=""
                  id=""
                  className="py-3 px-4 border border-gray-300 w-full rounded-lg mt-3 outline-none font-semibold"
                >
                  <option value="">Đề xuất</option>
                </select>
              </div>
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
                  {item.values.length > 5 && (
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
              <div className="mb-4">
                {arrTours.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col lg:flex-row lg:space-x-6 rounded-3xl bg-white mb-4"
                  >
                    <div className="w-full lg:w-5/12 relative overflow-hidden rounded-l-2xl">
                      <Link href="/khach-san/chi-tiet/sofitel-legend-metropole-ha-noi">
                        <Image
                          className="hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full rounded-2xl lg:rounded-none lg:rounded-l-2xl"
                          src={`/hotel/search/${item.image}.png`}
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
                            href="/khach-san/chi-tiet/sofitel-legend-metropole-ha-noi"
                            className="w-[80%] text-18 font-semibold hover:text-primary duration-300 transition-colors line-clamp-3"
                          >
                            {item.title}
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
                          {item.tags && (
                            <ul className="mt-2 list-[circle] grid grid-cols-2 items-start pl-4">
                              {item.tags.map((item, index) => (
                                <li key={index}>{item.title}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        {item.refund && (
                          <div className="mt-3 inline-flex py-[2px] px-[6px] rounded-sm text-white bg-blue-700">
                            {item.refund}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 p-2 lg:mr-6 mt-3 mb-4 items-end justify-between bg-gray-50 rounded-lg">
                        <div className="flex space-x-1">
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-[18px] rounded-tr bg-primary text-white font-semibold">
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
                        <div className="flex flex-col space-y-2">
                          <div>
                            {item.discount && (
                              <div className="text-sm mr-2 inline-flex py-[2px] px-[6px] rounded-sm text-white bg-blue-700">
                                <span> Giảm {item.discount}%</span>
                              </div>
                            )}
                            <span className="text-gray-500 line-through">
                              7.004.927 vnđ
                            </span>
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
      <div className="px-3 lg:px-[80px] max__screen">
        {/* Blog */}
        <div className="mt-8 rounded-2xl bg-gray-50 p-8">
          <h3 className="text-2xl font-bold">
            Tour Trong Nước - Khám Phá Vẻ Đẹp Việt Nam
          </h3>
          <p className="mt-6 line-clamp-3	">
            Việt Nam, với thiên nhiên hùng vĩ và văn hóa đa dạng, là điểm đến lý
            tưởng cho những chuyến tour trong nước. Từ núi rừng Tây Bắc hùng vĩ,
            đồng bằng sông Cửu Long mênh mông, đến bãi biển miền Trung tuyệt
            đẹp, mỗi vùng đất đều mang đến trải nghiệm đáng nhớ.
            <span className="block mt-4">
              Khi lựa chọn tour du lịch trong nước cùng HappyBook, bạn sẽ được
              khám phá các địa điểm nổi tiếng như Hà Nội cổ kính, Đà Nẵng năng
              động, Nha Trang biển xanh, hay Phú Quốc thiên đường nhiệt đới.
              Ngoài ra, các dịch vụ hỗ trợ chuyên nghiệp của chúng tôi sẽ đảm
              bảo hành trình của bạn luôn trọn vẹn và thú vị.
            </span>
          </p>
          <Link
            href="#"
            className="flex group mt-6 space-x-2 text-blue-700 mx-auto justify-center items-center"
          >
            <span className="font-medium group-hover:text-primary duration-300">
              Xem thêm
            </span>
            <svg
              className="group-hover:stroke-primary stroke-blue-700 duration-300"
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
          </Link>
        </div>
        {/* Faq */}
        <div className="my-8">
          <FAQ />
        </div>
        <div className="my-8 p-8 rounded-2xl bg-gray-50 ">
          <h3 className="text-32 font-bold text-center">
            Vì sao nên chọn HappyBook
          </h3>
          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <div className="flex items-center space-x-3 h-20">
                <Image
                  src="/tour/adviser.svg"
                  alt="Icon"
                  className="h-11 w-11"
                  width={44}
                  height={44}
                ></Image>
                <div>
                  <p className="text-18 font-semibold mb-1 text-gray-900">
                    Đội ngũ Happybook tư vấn
                  </p>
                  <p className="text-18 font-semibold mb-1 text-gray-900">
                    hỗ trợ nhiệt tình 24/7
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 h-20">
                <Image
                  src="/tour/developers.svg"
                  alt="Icon"
                  className="h-11 w-11"
                  width={44}
                  height={44}
                ></Image>
                <div>
                  <p className="text-18 font-semibold mb-1 text-gray-900">
                    Đơn vị hơn 8 năm kinh nghiệm.
                  </p>
                  <p className="text-18 font-semibold text-gray-900">
                    Lấy chữ tín làm đầu
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 h-20">
                <Image
                  src="/tour/product-icon.svg"
                  alt="Icon"
                  className="h-11 w-11"
                  width={44}
                  height={44}
                ></Image>
                <div>
                  <p className="text-18 font-semibold mb-1 text-gray-900">
                    Sản phẩm đa dạng,
                  </p>
                  <p className="text-18 font-semibold text-gray-900">
                    giá cả tốt nhất
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
