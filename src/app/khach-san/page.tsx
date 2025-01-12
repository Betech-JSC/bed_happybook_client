import { Fragment } from "react";
import type { Metadata } from "next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import styles from "@/styles/styles.module.scss";
import Image from "next/image";
import FAQ from "@/components/FAQ";
import { Suspense } from "react";
import Search from "./components/Search";
import HotelTabs from "./components/HotelTabs";
import SeoSchema from "@/components/schema";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { formatMetadata } from "@/lib/formatters";
import { HotelApi } from "@/api/Hotel";

export const metadata: Metadata = formatMetadata({
  title: "Khách Sạn | Happy Book ????️ Đại Lý Đặt Vé Máy Bay Giá Rẻ #1",
  description:
    "Khi đặt khách sạn tại HappyBook Travel với hơn 2.000 khách sạn và hơn 30.000 khách sạn Quốc tế. Quý khách liên hệ đặc online hoặc gọi Hotline 0904.221.293. XÁC NHẬN qua Gmail và SMS.k",
  alternates: {
    canonical: pageUrl(BlogTypes.HOTEL, true),
  },
});
const province = [
  { id: 1, title: "TP Hồ Chí Minh" },
  { id: 2, title: "Hà Nội" },
  { id: 3, title: "Đà Nẵng" },
  { id: 4, title: "Nha Trang" },
  { id: 5, title: "Phú Quốc" },
];
export default async function Hotel() {
  const locations = (await HotelApi.getLocations())?.payload?.data as any;
  const hotelData = (await HotelApi.getAll())?.payload?.data as any;
  return (
    <SeoSchema
      metadata={metadata}
      breadscrumbItems={[
        {
          url: metadata.alternates?.canonical as string,
          name: metadata.title as string,
        },
      ]}
    >
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
      <main className="w-full bg-white relative z-2 rounded-2xl top-[-12px]">
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
          <div className="py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-3 h-20">
              <Image
                src="/tour/globe-gradient.png"
                alt="Icon"
                className="h-11 w-11"
                width={44}
                height={44}
              ></Image>
              <div>
                <p className="text-18 text-gray-700 font-semibold mb-1">
                  Lựa Chọn Không Giới Hạn
                </p>
                <p>Vô vàn hành trình, triệu cảm hứng</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 h-20">
              <Image
                src="/tour/Travel-gradient-icon.png"
                alt="Icon"
                className="h-11 w-11"
                width={44}
                height={44}
              ></Image>
              <div>
                <p className="text-18 text-gray-700 font-semibold mb-1">
                  Dịch Vụ Cá Nhân Hóa
                </p>
                <p>Chăm sóc đặc biệt, trải nghiệm độc đáo</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 h-20">
              <Image
                src="/tour/sun-icon.png"
                alt="Icon"
                className="h-11 w-11"
                width={44}
                height={44}
              ></Image>
              <div>
                <p className="text-18 text-gray-700 font-semibold mb-1">
                  Giá Trị Vượt Trội
                </p>
                <p>Chất lượng đỉnh, đảm bảo giá tốt nhất</p>
              </div>
            </div>
          </div>
          {/* Hotel */}
          {hotelData?.length > 0 && (
            <div className="mt-6 py-6">
              <div>
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-[24px] lg:text-32 font-bold">
                      Khách Sạn Phổ Biến tại Việt Nam
                    </h2>
                  </div>
                </div>
                <div className="mt-8 w-full">
                  <HotelTabs data={hotelData} />
                </div>
              </div>
            </div>
          )}
          {/* Province */}
          <div className="mt-6 ">
            <h2 className="text-[24px] lg:text-32 font-bold">
              Thành Phố Phổ Biến tại Việt Nam
            </h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {province.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-200"
                >
                  <div className="overflow-hidden rounded-t-2xl">
                    <Image
                      className="hover:scale-110 ease-in duration-300 cursor-pointer w-full h-[236px]"
                      src={`/hotel/province/${item.id}.png`}
                      alt="Image"
                      width={250}
                      height={260}
                    />
                  </div>
                  <div className="py-3 px-4 text-18 font-semibold text__default_hover">
                    <h3>{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Blog */}
          <div className="mt-8 rounded-2xl bg-gray-50 p-8">
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
          <div className="mt-8 py-12">
            <div>
              <h2 className="text-22 pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
                Thành phố đang hot
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-3">
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Các khách sạn ở Hồ Chí Minh
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Các khách sạn ở Hà Nội
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Các khách sạn ở Hồ Chí Minh
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Các khách sạn ở Hà Nội
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Các khách sạn ở Hồ Chí Minh
                </h3>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-22 pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
                Khách sạn phổ biến
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-3">
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Hà Nội
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Đà Nẵng
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  TP. Hồ Chí Minh
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Phú Quốc
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Nha Trang
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Đà Lạt
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Bangkok
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Singapore
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Tokyo
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Seoul
                </h3>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-22 pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
                Khám phá thêm
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-3">
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Khách sạn 5 sao
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Resort ven biển
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Khách sạn trung tâm
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Homestay đẹp
                </h3>
                <h3 className={`text-gray-700 font-medium text__default_hover`}>
                  Khách sạn tiện nghi
                </h3>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SeoSchema>
  );
}
