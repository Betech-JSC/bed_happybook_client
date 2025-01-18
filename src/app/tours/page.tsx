import Image from "next/image";
import type { Metadata } from "next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import TourItem from "@/components/product/components/tour-item";
import SeoSchema from "@/components/schema";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { formatMetadata } from "@/lib/formatters";
import { TourApi } from "@/api/Tour";
import SearchTour from "./components/Search";
import { BannerApi } from "@/api/Banner";
import TouristSuggest from "@/components/home/tourist-suggest";
import ContentByPage from "@/components/content-page/ContentByPage";
import { PageApi } from "@/api/Page";
import FAQ from "@/components/content-page/FAQ";

export const metadata: Metadata = formatMetadata({
  title: "Đặt Tour Du Lịch Gia Đình, Bạn Bè | Tour Giá Rẻ 2024",
  description:
    "Mời các bạn đặt tour du lịch gia đình, bạn bè, người thân trọn gói, tạo kỷ niệm đáng nhớ với các hoạt động vui chơi thú vị, an toàn tại HappyBook Travel. Ưu đãi hấp dẫn, thanh toán tiện lơi, xác nhận tức thì.",
  alternates: {
    canonical: pageUrl(BlogTypes.TOURS, true),
  },
});

const tourist: string[] = [];
for (let i = 1; i <= 8; i++) {
  tourist.push(`/tourist-suggest/${i}.png`);
}

export default async function Tours() {
  const res = (await TourApi.getAll()) as any;
  const data = res?.payload?.data;
  const touristSuggest = (await BannerApi.getBannerPage("home-dichoi"))?.payload
    ?.data as any;
  const contentPage = (await PageApi.getContent("tours"))?.payload?.data as any;
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
      <main>
        <div className="relative h-[400px] lg:h-[500px]">
          <div className="absolute inset-0">
            <Image
              priority
              src="/tour/bg-header.png"
              width={1900}
              height={600}
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
          {/* Search */}
          <SearchTour />
        </div>
        <div className="bg-white relative z-2 rounded-2xl top-[-12px] mt-10">
          <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
            {/* Tour nội địa */}
            {data?.tourDomestic?.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-[24px] lg:text-[32px] font-bold">
                      Tour trong nước
                    </h2>
                  </div>
                  <Link
                    href="/tours/noi-dia"
                    className="hidden lg:flex items-center bg-[#EFF8FF] hover:bg-blue-200 py-1 px-4 rounded-lg space-x-3 ease-in duration-300"
                  >
                    <span className="text-[#175CD3] font-medium">
                      Xem tất cả
                    </span>
                    <Image
                      className="hover:scale-110 ease-in duration-300"
                      src="/icon/chevron-right.svg"
                      alt="Icon"
                      width={20}
                      height={20}
                    />
                  </Link>
                </div>
                <p className="text-16 font-medium mt-3">
                  Chơi Hè Thả Ga, Không Lo Về Giá
                </p>
                <Link
                  href="/tours/noi-dia"
                  className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
                >
                  <span className="text-[#175CD3] font-medium">Xem tất cả</span>
                  <Image
                    className=" hover:scale-110 ease-in duration-300"
                    src="/icon/chevron-right.svg"
                    alt="Icon"
                    width={20}
                    height={20}
                  />
                </Link>
                <div className="mt-8 w-full">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {data.tourDomestic.map((tour: any, index: number) => (
                        <CarouselItem
                          key={index}
                          className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                        >
                          <TourItem tour={tour} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:inline-flex" />
                    <CarouselNext className="hidden lg:inline-flex" />
                  </Carousel>
                </div>
              </div>
            )}
            {/* Tour nước ngoài */}
            {data?.tourInternational?.length > 0 && (
              <div className="mt-12">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-[24px] lg:text-[32px] font-bold">
                      Tour Du Lịch Nước Ngoài Cao Cấp
                    </h2>
                  </div>
                  <Link
                    href="#"
                    className="hidden lg:flex items-center bg-[#EFF8FF] hover:bg-blue-200 py-1 px-4 rounded-lg space-x-3 ease-in duration-300"
                  >
                    <span className="text-[#175CD3] font-medium">
                      Xem tất cả
                    </span>
                    <Image
                      className="hover:scale-110 ease-in duration-300"
                      src="/icon/chevron-right.svg"
                      alt="Icon"
                      width={20}
                      height={20}
                    />
                  </Link>
                </div>
                <p className="text-16 font-medium mt-3">
                  Trải Nghiệm Thế Giới, Khám Phá Bản Thân
                </p>
                <Link
                  href="/tours/tour-quoc-te"
                  className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
                >
                  <span className="text-[#175CD3] font-medium">Xem tất cả</span>
                  <Image
                    className=" hover:scale-110 ease-in duration-300"
                    src="/icon/chevron-right.svg"
                    alt="Icon"
                    width={20}
                    height={20}
                  />
                </Link>
                <div className="mt-8 w-full">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {data.tourInternational.map(
                        (tour: any, index: number) => (
                          <CarouselItem
                            key={index}
                            className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                          >
                            <TourItem tour={tour} />
                          </CarouselItem>
                        )
                      )}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:inline-flex" />
                    <CarouselNext className="hidden lg:inline-flex" />
                  </Carousel>
                </div>
              </div>
            )}
            {/* Suggest Tour */}
            {touristSuggest?.length > 0 && (
              <div className="mt-6">
                <TouristSuggest data={touristSuggest}></TouristSuggest>
              </div>
            )}
            {/* Tour du thuyền */}
            {data?.tourYacht?.length > 0 && (
              <div className="mt-12">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-[24px] lg:text-[32px] font-bold">
                      Tour Du Thuyền
                    </h2>
                  </div>
                  <Link
                    href="/tours/tour-du-thuyen"
                    className="hidden lg:flex items-center bg-[#EFF8FF] hover:bg-blue-200 py-1 px-4 rounded-lg space-x-3 ease-in duration-300"
                  >
                    <span className="text-[#175CD3] font-medium">
                      Xem tất cả
                    </span>
                    <Image
                      className="hover:scale-110 ease-in duration-300"
                      src="/icon/chevron-right.svg"
                      alt="Icon"
                      width={20}
                      height={20}
                    />
                  </Link>
                </div>
                <p className="text-16 font-medium mt-3">
                  Trải nghiệm xu hướng du lịch mới và đẳng cấp
                </p>
                <Link
                  href="/tours/tour-du-thuyen"
                  className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
                >
                  <span className="text-[#175CD3] font-medium">Xem tất cả</span>
                  <Image
                    className=" hover:scale-110 ease-in duration-300"
                    src="/icon/chevron-right.svg"
                    alt="Icon"
                    width={20}
                    height={20}
                  />
                </Link>
                <div className="mt-8 w-full">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {data.tourYacht.map((tour: any, index: number) => (
                        <CarouselItem
                          key={index}
                          className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                        >
                          <TourItem tour={tour} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden lg:inline-flex" />
                    <CarouselNext className="hidden lg:inline-flex" />
                  </Carousel>
                </div>
              </div>
            )}
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
      </main>
    </SeoSchema>
  );
}
