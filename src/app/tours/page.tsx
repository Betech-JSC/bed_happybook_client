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
import { getServerLang } from "@/lib/session";
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
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("tours", language))?.payload
    ?.data as any;
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
                  src="/tour/globe-gradient.svg"
                  alt="Icon"
                  className="h-11 w-11"
                  width={44}
                  height={44}
                ></Image>
                <div>
                  <p
                    className="text-18 text-gray-700 font-semibold mb-1"
                    data-translate
                  >
                    Lựa Chọn Không Giới Hạn
                  </p>
                  <p data-translate>Vô vàn hành trình, triệu cảm hứng</p>
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
                  <p
                    className="text-18 text-gray-700 font-semibold mb-1"
                    data-translate
                  >
                    Dịch Vụ Cá Nhân Hóa
                  </p>
                  <p data-translate>Chăm sóc đặc biệt, trải nghiệm độc đáo</p>
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
                  <p
                    className="text-18 text-gray-700 font-semibold mb-1"
                    data-translate
                  >
                    Giá Trị Vượt Trội
                  </p>
                  <p data-translate>Chất lượng đỉnh, đảm bảo giá tốt nhất</p>
                </div>
              </div>
            </div>
            {(() => {
              const elements = [];
              interface TourType {
                title: string;
                data: any[];
                link: string;
              }
              
              const tourTypes: Record<string, TourType> = {
                domestic: {
                  title: "Tour trong nước",
                  data: data.tourDomestic || [],
                  link: "/tours/tour-trong-nuoc"
                },
                international: {
                  title: "Tour quốc tế",
                  data: data.tourInternational || [],
                  link: "/tours/tour-nuoc-ngoai"  
                },
          
              };

              for (const [key, tourType] of Object.entries(tourTypes)) {
                if (tourType.data?.length > 0) {
                  elements.push(
                    <div key={key} className="mt-6">
                      <div className="flex justify-between">
                        <div>
                          <h2 className="text-[24px] lg:text-[32px] font-bold" data-translate>
                            {tourType.title}
                          </h2>
                        </div>
                        <Link
                          href={tourType.link}
                          className="hidden lg:flex items-center bg-[#EFF8FF] hover:bg-blue-200 py-1 px-4 rounded-lg space-x-3 ease-in duration-300"
                        >
                          <span className="text-[#175CD3] font-medium" data-translate>
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
                      <p className="text-16 font-medium mt-3" data-translate>
                        Chơi Hè Thả Ga, Không Lo Về Giá
                      </p>
                      <Link
                        href={tourType.link}
                        className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
                      >
                        <span className="text-[#175CD3] font-medium" data-translate>
                          Xem tất cả
                        </span>
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
                            {tourType.data.map((tour: any, index: number) => (
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
                  );
                }
              }
              return elements;
            })()}
           
           
            {/* Suggest Tour */}
            {touristSuggest?.length > 0 && (
              <div className="mt-6">
                <TouristSuggest data={touristSuggest}></TouristSuggest>
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
              <h3 className="text-32 font-bold text-center" data-translate>
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
                      <p
                        className="text-18 font-semibold mb-1 text-gray-900"
                        data-translate
                      >
                        Đội ngũ Happybook tư vấn
                      </p>
                      <p
                        className="text-18 font-semibold mb-1 text-gray-900"
                        data-translate
                      >
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
                      <p
                        className="text-18 font-semibold mb-1 text-gray-900"
                        data-translate
                      >
                        Đơn vị hơn 8 năm kinh nghiệm.
                      </p>
                      <p
                        className="text-18 font-semibold text-gray-900"
                        data-translate
                      >
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
                      <p
                        className="text-18 font-semibold mb-1 text-gray-900"
                        data-translate
                      >
                        Sản phẩm đa dạng,
                      </p>
                      <p
                        className="text-18 font-semibold text-gray-900"
                        data-translate
                      >
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
