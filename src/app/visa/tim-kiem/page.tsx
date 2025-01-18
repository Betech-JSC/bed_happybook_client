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
import SeoSchema from "@/components/schema";
import { VisaApi } from "@/api/Visa";
import { notFound } from "next/navigation";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import ListVisa from "../components/ListVisa";
import FAQ from "@/components/content-page/FAQ";

export default async function SearchVisa({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const optionsFilter = (await VisaApi.getOptionsFilter())?.payload
    ?.data as any;
  return (
    <>
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
                  <Link href="/visa" className="text-blue-700">
                    Dịch vụ Visa
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#" className="text-gray-700">
                    Tìm kiếm
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* Section Visa */}
          <ListVisa searchParams={searchParams} optionsFilter={optionsFilter} />
          {/* Section Before Footer */}
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
    </>
  );
}
