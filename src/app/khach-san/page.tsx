import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import Search from "./components/Search";
import HotelTabs from "./components/HotelTabs";
import SeoSchema from "@/components/schema";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { formatMetadata } from "@/lib/formatters";
import { HotelApi } from "@/api/Hotel";
import FooterMenu from "@/components/content-page/footer-menu";
import ContentByPage from "@/components/content-page/ContentByPage";
import { PageApi } from "@/api/Page";
import FAQ from "@/components/content-page/FAQ";
import { BannerApi } from "@/api/Banner";
import Link from "next/link";

export const metadata: Metadata = formatMetadata({
  title: "Khách Sạn | Happy Book ????️ Đại Lý Đặt Vé Máy Bay Giá Rẻ #1",
  description:
    "Khi đặt khách sạn tại HappyBook Travel với hơn 2.000 khách sạn và hơn 30.000 khách sạn Quốc tế. Quý khách liên hệ đặc online hoặc gọi Hotline 0904.221.293. XÁC NHẬN qua Gmail và SMS.k",
  alternates: {
    canonical: pageUrl(BlogTypes.HOTEL, true),
  },
});

export default async function Hotel() {
  // const locations = (await HotelApi.getLocations())?.payload?.data as any;
  const hotelData = (await HotelApi.getAll())?.payload?.data as any;
  const contentPage = (await PageApi.getContent("khach-san"))?.payload
    ?.data as any;
  const provincePopular =
    ((await BannerApi.getBannerPage("hotel-tpphobien"))?.payload
      ?.data as any) ?? [];
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
      <div className="relative pb-12 h-[400px] lg:h-[450px] place-content-center">
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
          <div className="mt-0 lg:mt-28 lg:mb-10 p-6 bg-white rounded-lg shadow-lg relative lg:w-1/2 ">
            <Suspense>
              <Search />
            </Suspense>
          </div>
        </div>
      </div>
      <main className="w-full bg-white relative z-2 rounded-2xl top-[-12px]">
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
          <div className="py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-3 h-20">
              <Image
                src="/tour/globe-gradient.svg"
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
                src="/tour/Travel-gradient-icon.svg"
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
                src="/tour/sun-icon.svg"
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
              {provincePopular.map((item: any) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-200"
                >
                  <div className="overflow-hidden rounded-t-2xl">
                    <Link href={item.url ?? "#"}>
                      <Image
                        className="hover:scale-110 ease-in duration-300 cursor-pointer w-full rounded-t-2xl"
                        src={`${item.image_url}/${item.image_location}`}
                        alt="Image"
                        width={250}
                        height={260}
                        style={{ height: 245 }}
                      />
                    </Link>
                  </div>
                  <Link href={item.url ?? "#"}>
                    <h3 className="py-3 px-4 text-18 font-semibold text__default_hover">
                      {item.name}
                    </h3>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          {/* Blog */}
          {contentPage?.content && (
            <div className="mt-8 rounded-2xl bg-gray-50 p-8">
              <ContentByPage data={contentPage} />
            </div>
          )}
          {/* Faq */}
          <div className="my-8">
            <FAQ />
          </div>
        </div>
        <FooterMenu page="hotel" />
      </main>
    </SeoSchema>
  );
}
