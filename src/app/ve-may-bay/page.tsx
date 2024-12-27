import { Fragment } from "react";
import type { Metadata } from "next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import FlightItem from "@/components/flight-item";
import styles from "@/styles/styles.module.scss";
import Image from "next/image";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import Search from "./components/Search";
import { Suspense } from "react";
import { FlightApi } from "@/api/Flight";
import { formatMetadata } from "@/lib/formatters";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";

export const metadata: Metadata = formatMetadata({
  title: "Vé máy bay",
  description: "Happy Book",
  alternates: {
    canonical: pageUrl("ve-may-bay"),
  },
});

const tours = [
  {
    title: "Hà Nội - Hồ Chí Minh",
    image: "/flight/1.png",
    price: "800.000",
    airlineName: "Vietjet Air",
    airlineLogo: "/airline/VJ.svg",
    date: "15/09/2024",
    type: 0,
  },
  {
    title: "Hà Nội - Đà Lạt",
    image: "/flight/2.png",
    price: "800.000",
    airlineName: "Vietnam Airlines",
    airlineLogo: "/airline/VN.svg",
    date: "15/09/2024",
    type: 0,
  },
  {
    title: "Hồ Chí Minh - Nha Trang",
    image: "/flight/3.png",
    price: "800.000",
    airlineName: "Vietjet Air",
    airlineLogo: "/airline/VJ.svg",
    date: "15/09/2024",
    type: 0,
  },
  {
    title: "Hồ Chí Minh - Hà Nội",
    image: "/flight/4.png",
    price: "800.000",
    airlineName: "Vietjet Air",
    airlineLogo: "/airline/VJ.svg",
    date: "15/09/2024",
    type: 0,
  },
  {
    title: "Hà Nội - Hồ Chí Minh",
    image: "/flight/1.png",
    price: "800.000",
    airlineName: "Vietjet Air",
    airlineLogo: "/airline/VJ.svg",
    date: "15/09/2024",
    type: 0,
  },
];
export default async function AirlineTicket() {
  const airportsReponse = await FlightApi.airPorts();
  const airportsData = airportsReponse?.payload.data ?? [];
  return (
    <SeoSchema
      {...(metadata as any)}
      url={metadata.alternates?.canonical as string}
      breadscrumbItems={[
        {
          name: metadata.alternates?.canonical as string,
          item: metadata.title as string,
        },
      ]}
    >
      <div className="relative h-max pb-14">
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
            <Suspense>
              <Search airportsData={airportsData} />
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
          {/* Flight */}
          <div className="mt-6 py-6">
            <div>
              <div className="flex justify-between">
                <div>
                  <h2 className="text-[24px] lg:text-32 font-bold">
                    Những chuyến bay phổ biến
                  </h2>
                </div>
              </div>
              <div className="mt-8 w-full">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {tours.map((tour, index) => (
                      <CarouselItem
                        key={index}
                        className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                      >
                        <FlightItem {...tour} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden lg:inline-flex" />
                  <CarouselNext className="hidden lg:inline-flex" />
                </Carousel>
              </div>
            </div>
          </div>
          <div className="mt-6 py-6">
            <div>
              <div className="flex justify-between">
                <div>
                  <h2 className="text-[24px] lg:text-32 font-bold">
                    Vé Máy Bay Một Chiều Dành Cho Bạn
                  </h2>
                </div>
              </div>
              <div className="mt-8 w-full">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {tours.map((flight, index) => (
                      <CarouselItem
                        key={index}
                        className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                      >
                        <div className="px-4 py-3 border border-gray-200 rounded-2xl">
                          <div className="flex text-sm h-5">
                            <Image
                              src={flight.airlineLogo}
                              alt="Airline logo"
                              width={24}
                              height={24}
                            />
                            <p className="ml-2">{flight.airlineName}</p>
                          </div>
                          <Link
                            href="/ve-may-bay/chi-tiet"
                            className="mt-2 font-semibold block"
                          >
                            <h3> {flight.title}</h3>
                          </Link>
                          <div className="mt-2 text-sm font-normal">
                            {flight.date}
                          </div>
                          <div className="mt-3 text-right text-xl font-semibold text-primary">
                            {flight.price ?? "800.000"} vnđ
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden lg:inline-flex" />
                  <CarouselNext className="hidden lg:inline-flex" />
                </Carousel>
              </div>
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
              <h2 className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
                Vé máy bay phổ biến
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-3">
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  Vietnam Airlines
                </p>
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  VietJetAir
                </p>
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  Bamboo Airways
                </p>
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  Jetstar Pacific
                </p>
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  Vé máy bay giá rẻ
                </p>
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  Vé máy bay quốc tế
                </p>
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  Vé máy bay nội địa
                </p>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
                Điểm đến được yêu thích
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-3">
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  Hà Nội
                </p>
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  Đà Nẵng
                </p>
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  TP. Hồ Chí Minh
                </p>
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  Phú Quốc
                </p>
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  Nha Trang
                </p>
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  Đà Lạt
                </p>
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  Bangkok
                </p>
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  Singapore
                </p>
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  Tokyo
                </p>
                <p
                  className={`text-gray-700 font-medium ${styles.text_hover_default}`}
                >
                  Seoul
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SeoSchema>
  );
}
