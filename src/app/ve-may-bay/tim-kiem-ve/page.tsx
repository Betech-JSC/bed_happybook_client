import { Suspense } from "react";
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
import Link from "next/link";
import Partner from "../components/Partner";
import Search from "../components/Search";
import SideBar from "../components/SideBar";
import ListFilght from "../components/ListFilght";
import { AirportOption } from "@/types/flight";
import { getAirportsDefault } from "@/utils/Helper";

export const metadata: Metadata = {
  title: "Tìm kiếm Vé máy bay",
  description: "Happy Book | Tìm kiếm Vé máy bay",
  keywords: "Tìm kiếm Vé máy bay",
  alternates: {
    canonical: "/ve-may-bay/tim-kiem-ve",
  },
};

const airports = getAirportsDefault();
export default async function SearchTicket() {
  return (
    <Suspense>
      <div className="relative z-[1] h-max pb-12">
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
            <Search airports={airports} />
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
          <div className="min-h-40">
            <ListFilght airports={airports} />
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
    </Suspense>
  );
}
