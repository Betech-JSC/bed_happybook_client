import { Fragment } from "react";
import type { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import FAQ from "@/components/FAQ";
import Tabs from "../components/Tabs";
import FlightDetails from "../components/FlightDetails";
import PassengerTable from "../components/PassengerTable";
import Link from "next/link";
import Partner from "../components/Partner";

export const metadata: Metadata = {
  title: "Vé máy bay",
  description: "Happy Book",
};
const tours = [
  {
    title: "Hà Nội - Hồ Chí Minh",
    image: "/flight/1.png",
    price: "800.000",
    airlineName: "Vietjet Air",
    airlineLogo: "/airline/vietjet.svg",
    date: "15/09/2024",
    type: 0,
  },
  {
    title: "Hà Nội - Đà Lạt",
    image: "/flight/2.png",
    price: "800.000",
    airlineName: "Vietnam Airlines",
    airlineLogo: "/airline/Vietnam-Airlines.svg",
    date: "15/09/2024",
    type: 0,
  },
  {
    title: "Hồ Chí Minh - Nha Trang",
    image: "/flight/3.png",
    price: "800.000",
    airlineName: "Vietjet Air",
    airlineLogo: "/airline/vietjet.svg",
    date: "15/09/2024",
    type: 0,
  },
  {
    title: "Hồ Chí Minh - Hà Nội",
    image: "/flight/4.png",
    price: "800.000",
    airlineName: "Vietjet Air",
    airlineLogo: "/airline/vietjet.svg",
    date: "15/09/2024",
    type: 0,
  },
  {
    title: "Hà Nội - Hồ Chí Minh",
    image: "/flight/1.png",
    price: "800.000",
    airlineName: "Vietjet Air",
    airlineLogo: "/airline/vietjet.svg",
    date: "15/09/2024",
    type: 0,
  },
];
export default function Home() {
  return (
    <Fragment>
      <div className="relative z-[0] h-max pb-12">
        <div className="absolute inset-0">
          <Image
            priority
            src="/bg-image-2.png"
            width={500}
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
          <div className="mt-0 lg:mt-24 lg:mb-4 p-6 mx-auto  bg-white rounded-lg shadow-lg relative">
            <div>
              <div className="grid grid-cols-2 gap-4 lg:flex lg:space-x-12 mb-4">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="trip" className="form-radio" />
                  <span className="text-black">Một chiều</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="trip" className="form-radio" />
                  <span className="text-black">Khứ hồi</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="cheap-tickets"
                    className="form-checkbox"
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
                  <label className="block text-gray-700 mb-1">
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
                    <select className="ml-2 flex-1 focus:outline-none text-black appearance-none">
                      <option>1 người lớn</option>
                    </select>
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
            </div>
          </div>
        </div>
      </div>
      <main className="w-full bg-gray-100 relative z-2 rounded-2xl top-[-12px]">
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
          <Breadcrumb className="pt-6">
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
                  <Link href="#" className="text-gray-700">
                    Vé máy bay
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6 pb-12">
            {/* Sidebar */}
            <aside className="lg:col-span-3 bg-white p-4 rounded-2xl">
              <div className="pb-3 border-b border-gray-200">
                <h2 className="font-semibold">Sắp xếp</h2>
                <select
                  name=""
                  id=""
                  className="w-full p-3 mt-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Đề xuất</option>
                </select>
              </div>
              <div className="mt-3 pb-3 border-b border-gray-200">
                <h2 className="font-semibold">Hiển thị giá</h2>
                <div className="flex space-x-2 mt-3">
                  <input type="checkbox" name="price" id="price_1" />
                  <label htmlFor="price_1">Giá bao gồm thuế phí</label>
                </div>
                <div className="flex space-x-2 mt-3">
                  <input type="checkbox" name="price" id="price_2" />
                  <label htmlFor="price_2">Giá chưa bao gồm thuế phí</label>
                </div>
              </div>
              <div className="mt-3 pb-3 border-b border-gray-200">
                <h2 className="font-semibold">Sắp xếp</h2>
                <div className="flex space-x-2 mt-3">
                  <input type="checkbox" name="price" id="price_1" />
                  <label htmlFor="price_1">Giá thấp tới cao</label>
                </div>
                <div className="flex space-x-2 mt-3">
                  <input type="checkbox" name="price" id="price_2" />
                  <label htmlFor="price_2">Thời gian khởi hành</label>
                </div>
                <div className="flex space-x-2 mt-3">
                  <input type="checkbox" name="price" id="price_2" />
                  <label htmlFor="price_2">Hãng hàng không</label>
                </div>
              </div>
              <div className="mt-3 pb-3 border-b border-gray-200">
                <h2 className="font-semibold">Hãng hàng không</h2>
                <div className="flex space-x-2 mt-3">
                  <input type="checkbox" name="price" id="price_1" />
                  <label htmlFor="price_1">Bamboo Airline</label>
                </div>
                <div className="flex space-x-2 mt-3">
                  <input type="checkbox" name="price" id="price_2" />
                  <label htmlFor="price_2">Vietjet Air</label>
                </div>
                <div className="flex space-x-2 mt-3">
                  <input type="checkbox" name="price" id="price_2" />
                  <label htmlFor="price_2">Vietnam Airlines</label>
                </div>
                <div className="flex space-x-2 mt-3">
                  <input type="checkbox" name="price" id="price_2" />
                  <label htmlFor="price_2">Vietnam Airlines</label>
                </div>
              </div>
              <button className="w-full mt-3 py-3 bg-blue-600 text-white rounded-lg font-medium">
                Xóa bộ lọc
              </button>
            </aside>
            <div className="lg:col-span-9">
              <div className="max-w-5xl mx-auto">
                <div
                  className="flex text-white p-4 rounded-t-2xl shadow-md space-x-4 items-center"
                  style={{
                    background:
                      " linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                  }}
                >
                  <div className="w-10 h-10 p-2 bg-primary rounded-lg inline-flex items-center justify-center">
                    <Image
                      src="/icon/AirplaneTilt.svg"
                      width={20}
                      height={20}
                      alt="Icon"
                      className="w-5 h-5"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Hồ Chí Minh, Việt Nam (SGN) - Hà Nội, Việt Nam (HAN)
                    </h3>
                    <p className="text-sm">01 Khách - 30/08</p>
                  </div>
                </div>

                <Tabs />

                <div className="my-6">
                  <FlightDetails />
                </div>
                <div className="p-4 bg-gray-100 border-2 border-blue-500 rounded-2xl">
                  <div className="bg-white p-4 rounded-lg">
                    <PassengerTable />
                  </div>
                  <div className="mt-6 rounded-lg p-6 bg-white">
                    <h2 className="text-xl font-semibold text-orange-600 mb-4">
                      Chi tiết hành trình
                    </h2>
                    <div className="grid grid-cols-12 items-start gap-6">
                      <div className="col-span-3 flex flex-col border-r border-gray-200 pr-8">
                        <div className="flex gap-4">
                          <Image
                            src="/airline/vietjet.svg"
                            width={48}
                            height={48}
                            alt="Logo"
                            className="w-12 h-12"
                          />
                          <div>
                            <h3 className="text-18 font-semibold mb-1">
                              Vietjet Air
                            </h3>
                            <p className="text-sm text-gray-500">VJ168</p>
                          </div>
                        </div>
                        <p className="text-[#4E6EB3] font-semibold mt-4">
                          Điều kiện vé
                        </p>
                        <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                          <li>Hành lý xách tay: 7kg</li>
                          <li>
                            Thay đổi chuyến bay, ngày bay, chặng bay: thu phí +
                            chênh lệch giá vé nếu có /chặng/lần thay đổi
                          </li>
                          <li>Thay đổi tên: Không được phép</li>
                          <li>Hoàn vé: Không được phép</li>
                        </ul>
                      </div>
                      <div className="col-span-9 h-full w-full">
                        <div className="flex h-full items-start gap-2">
                          <div className="w-2/12 flex h-full justify-between flex-col items-end">
                            <div className="text-center">
                              <p className="text-22 font-bold">6:40</p>
                              <p className="text-gray-500">30/08/2024</p>
                            </div>
                            <div className="font-semibold text-center">
                              <Image
                                src="/icon/AirplaneTiltBlue.svg"
                                width={20}
                                height={20}
                                alt="Icon"
                                className="w-5 h-5 mx-auto"
                              />
                              <p className="mt-2 text-22 text-[#4E6EB3]">
                                02h10m
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-22 font-bold">6:40</p>
                              <p className="text-gray-500">30/08/2024</p>
                            </div>
                          </div>
                          <div className="w-1/12 relative h-full py-5 flex flex-col items-center">
                            <div className="w-[6px] h-[6px] bg-blue-700 rounded-full"></div>
                            <div className="w-px h-full bg-blue-700"></div>
                            <div className="w-[6px] h-[6px] bg-blue-700 rounded-full"></div>
                          </div>
                          <div className="w-9/12 flex justify-between flex-col h-full">
                            <div>
                              <p className="text-22 font-bold">
                                Hồ Chí Minh (SGN)
                              </p>
                              <p className="text-gray-500 mt-1">
                                Sân bay Tân Sơn Nhất
                              </p>
                            </div>
                            <div
                              className="rounded-lg text-white p-4"
                              style={{
                                background:
                                  "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
                              }}
                            >
                              <p className="text-sm">Máy bay: 330</p>
                              <p className="text-sm">Chuyến bay: VJ168</p>
                              <p className="text-sm">Hạng: Eco</p>
                            </div>
                            <div>
                              <p className="text-22 font-bold">Hà Nội (HAN)</p>
                              <p className="text-gray-500 mt-1">
                                Sân bay Nội Bài
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  {Array.from({ length: 7 }, (_, key) => {
                    return (
                      <div className="my-4" key={key}>
                        <FlightDetails />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Partner />
      </main>
      <div>
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
          {/* Blog */}
          <div className="mb-8 rounded-2xl bg-gray-50 p-8">
            <h3 className="text-2xl font-bold">
              Tour Trong Nước - Khám Phá Vẻ Đẹp Việt Nam
            </h3>
            <p className="mt-6 line-clamp-3	">
              Việt Nam, với thiên nhiên hùng vĩ và văn hóa đa dạng, là điểm đến
              lý tưởng cho những chuyến tour trong nước. Từ núi rừng Tây Bắc
              hùng vĩ, đồng bằng sông Cửu Long mênh mông, đến bãi biển miền
              Trung tuyệt đẹp, mỗi vùng đất đều mang đến trải nghiệm đáng nhớ.
              <span className="block mt-4">
                Khi lựa chọn tour du lịch trong nước cùng HappyBook, bạn sẽ được
                khám phá các địa điểm nổi tiếng như Hà Nội cổ kính, Đà Nẵng năng
                động, Nha Trang biển xanh, hay Phú Quốc thiên đường nhiệt đới.
                Ngoài ra, các dịch vụ hỗ trợ chuyên nghiệp của chúng tôi sẽ đảm
                bảo hành trình của bạn luôn trọn vẹn và thú vị.
              </span>
            </p>
            <button className="flex group mt-6 space-x-2 text-blue-700 mx-auto justify-center items-center">
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
            </button>
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
      </div>
    </Fragment>
  );
}
