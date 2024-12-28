import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import PostsItem from "./components/PostsItem";
import FormContact from "./components/FormContact";
import SeoSchema from "@/components/schema";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { formatMetadata } from "@/lib/formatters";

export const metadata: Metadata = formatMetadata({
  title: "Định Cư Lao Động, Di Trú Nước Ngoài | HappyBook Travel",
  description:
    "Định cư lao động, di trú nước ngoài là quá trình di cư và định cư tại một quốc gia khác với định hướng, mục tiêu sống và làm việc lâu dài. Khi làm việc ở nước ngoài, người lao động (NLĐ) thường không có quyền cư trí lâu dài và chỉ được hưởng các quyền lợi lao động Căn bản tại nước sở tại.",
  alternates: {
    canonical: pageUrl(BlogTypes.SETTLE, true),
  },
});
const arrPosts = [
  {
    title: "Bảo lãnh định cư Mỹ diện vợ chồng",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/1.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
  },
  {
    title: "Dịch vụ bảo lãnh định cư Mỹ diện hôn phu hôn thê",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/2.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
  },
  {
    title: "Bảo lãnh định cư Mỹ diện đoàn tụ gia đình",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/3.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
  },
  {
    title: "Dịch vụ tư vấn bảo lãnh trọn gói định cư Mỹ miễn phí",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/4.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
  },
  {
    title: "Bảo lãnh định cư Mỹ diện hôn nhân đồng giới",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/5.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
  },
  {
    title: "Bảo lãnh định cư Mỹ diện đoàn tụ gia đình",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/6.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
  },
  {
    title: "Dịch vụ bảo lãnh định cư Mỹ diện hôn phu hôn thê",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/7.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
  },
  {
    title: "Dịch vụ tư vấn bảo lãnh trọn gói định cư Mỹ miễn phí",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/8.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
  },
  {
    title: "Bảo lãnh định cư Mỹ diện vợ chồng",
    alias: "#",
    image_url: "",
    image_location: "/settle-service/posts/9.png",
    description:
      "Bảng giá làm visa các nước uy tín tùy mỗi nước khác nhau, nếu bạn không thành thạo việc xin visa ra nước ngoài, thì quá trình chuẩn bị giấy tờ xin visa sẽ rất dễ xảy ra thiếu sót.",
  },
];

export default function CompoTour() {
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
              src="/settle-service/bg-header.png"
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
        </div>
        <div className="bg-white relative z-2 rounded-2xl top-[-12px] mt-10">
          <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h2 className="text-32 font-bold">Dịch vụ định cư</h2>
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
            <div className="grid grid-cols-2 gap-4 md:flex md:space-x-2 md:flex-wrap mt-3">
              {["Định cư Pháp", "Định cư Đức", "Định cư Anh", "Định cư Mỹ"].map(
                (title, index) => (
                  <Link href="/dinh-cu/dinh-cu-my" key={index}>
                    <button
                      className="mx-auto group w-40 py-3 rounded-lg px-4 bg-white border duration-300 text__default_hover
                  justify-center items-center hover:border-primary"
                    >
                      <span className="font-medium">{title}</span>
                    </button>
                  </Link>
                )
              )}
            </div>
            <div className="mt-8 grid md:grid-cols-3 lg:grid-cols-3 gap-6 w-full">
              {arrPosts.map((item, index) => (
                <div key={index}>
                  <PostsItem {...item} />
                </div>
              ))}
            </div>
            <div className="my-8">
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
          <div className=" border-y border-y-gray-300 mt-8 ">
            <div className="lg:px-[50px] xl:px-[80px] py-12 px-3 max__screen">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <h3 className="text-32 font-bold">
                  Tại sao nên chọn Happy Book ?
                </h3>
                <div>
                  HappyBook cung cấp dịch vụ tư vấn định cư chuyên nghiệp, hỗ
                  trợ bạn từ giai đoạn chuẩn bị hồ sơ đến khi hoàn thành mọi thủ
                  tục pháp lý để đạt được giấc mơ định cư tại các quốc gia phát
                  triển như Mỹ, Canada, Úc, Châu Âu,...
                </div>
              </div>
              <div className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  <div className="flex items-start space-x-3 h-20">
                    <Image
                      src="/icon/settle-service/adviser.svg"
                      alt="Icon"
                      className="h-11 w-11"
                      width={44}
                      height={44}
                    ></Image>
                    <div>
                      <p className="text-18 font-semibold mb-1 text-gray-900">
                        Chuyên Nghiệp & Tận Tâm
                      </p>
                      <p>
                        Đội ngũ chuyên gia giàu kinh nghiệm, hỗ trợ tận tình từ
                        A-Z.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 h-20">
                    <Image
                      src="/icon/settle-service/icon-quy-trinh.svg"
                      alt="Icon"
                      className="h-11 w-11"
                      width={44}
                      height={44}
                    ></Image>
                    <div>
                      <p className="text-18 font-semibold mb-1 text-gray-900">
                        Quy Trình Minh Bạch
                      </p>
                      <p>
                        Thông tin rõ ràng, quy trình minh bạch, giúp bạn an tâm.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 h-20">
                    <Image
                      src="/tour/product-icon.svg"
                      alt="Icon"
                      className="h-11 w-11"
                      width={44}
                      height={44}
                    ></Image>
                    <div>
                      <p className="text-18 font-semibold mb-1 text-gray-900">
                        Giải Pháp Tối Ưu
                      </p>
                      <p>
                        Tư vấn chương trình định cư phù hợp với từng cá nhân.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-100">
            <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
              <div className="pt-8 pb-6">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-[32px] font-bold">Tin tức</h2>
                  </div>
                </div>
                <div className="mt-8 w-full flex flex-col lg:flex-row lg:space-x-4 space-y-6 lg:space-y-0">
                  <div className="basis-1/2 cursor-pointer ${styles.travel_guide_item">
                    <div className="relative group overflow-hidden rounded-xl w-full h-[468px] lg:h-[584px]">
                      <div className="absolute inset-0 transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110">
                        <Image
                          src="/travel-guide/1.png"
                          width={500}
                          height={584}
                          style={{ width: "100%", height: "584px" }}
                          alt="blog"
                        />
                      </div>
                      <div
                        className="absolute bottom-0 w-full h-full"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%)",
                        }}
                      >
                        <h3 className="absolute bottom-3 left-5 right-5 text-xl text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]">
                          Cập Nhật Thông Tin Chi Tiết Cho Người Lần Đầu Xin Visa
                          462 Úc Tham Khảo
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:basis-1/2 md:grid grid-cols-2 gap-6">
                    <div className="relative rounded-xl cursor-pointer group overflow-hidden w-full h-[280px]">
                      <div className="absolute inset-0 transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110">
                        <Image
                          src="/travel-guide/2.png"
                          width={500}
                          height={280}
                          style={{ width: "100%", height: "280px" }}
                          alt="blog"
                        />
                      </div>
                      <div
                        className="absolute bottom-0 w-full h-full"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%)",
                        }}
                      >
                        <h3 className="absolute bottom-3 left-5 right-5 text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]">
                          Hướng Dẫn Chi Tiết Gia Hạn Visa Việt Nam Cho Người
                          Nước Ngoài
                        </h3>
                      </div>
                    </div>
                    <div className="relative rounded-xl cursor-pointer group overflow-hidden w-full h-[280px]">
                      <div className="absolute inset-0 transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110">
                        <Image
                          src="/travel-guide/3.png"
                          width={500}
                          height={280}
                          style={{ width: "100%", height: "280px" }}
                          alt="blog"
                        />
                      </div>
                      <div
                        className="absolute bottom-0 w-full h-full"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%)",
                        }}
                      >
                        <h3 className="absolute bottom-3 left-5 right-5 text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]">
                          Làm Thế Nào Để Đăng Ký E visa Cho Người Nước Ngoài Vào
                          Việt Nam?
                        </h3>
                      </div>
                    </div>
                    <div className="relative rounded-xl cursor-pointer group overflow-hidden w-full h-[280px]">
                      <div className="absolute inset-0 transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110">
                        <Image
                          src="/travel-guide/4.png"
                          width={500}
                          height={280}
                          style={{ width: "100%", height: "280px" }}
                          alt="blog"
                        />
                      </div>
                      <div
                        className="absolute bottom-0 w-full h-full"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%)",
                        }}
                      >
                        <h3 className="absolute bottom-3 left-5 right-5 text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]">
                          Điểm Danh Những Khu Du Lịch Sinh Thái Bến Tre Được
                          Nhiều Du Khách Chọn Lựa
                        </h3>
                      </div>
                    </div>
                    <div className="relative rounded-xl cursor-pointer group overflow-hidden w-full h-[280px]">
                      <div className="absolute inset-0 transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110">
                        <Image
                          src="/travel-guide/5.png"
                          width={500}
                          height={280}
                          style={{ width: "100%", height: "280px" }}
                          alt="blog"
                        />
                      </div>
                      <div
                        className="absolute bottom-0 w-full h-full"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%)",
                        }}
                      >
                        <h3 className="absolute bottom-3 left-5 right-5 text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]">
                          Cập Nhật Thông Tin Chi Tiết Cho Người Lần Đầu Xin Visa
                          462 Úc Tham Khảo
                        </h3>
                      </div>
                    </div>
                  </div>
                  {/* Mobile */}
                  <div className="md:hidden">
                    <Carousel
                      opts={{
                        align: "start",
                        loop: true,
                      }}
                    >
                      <CarouselContent>
                        <CarouselItem className="basis-9/12 h-[280px]">
                          <div className="relative rounded-xl cursor-pointer h-full">
                            <div className="absolute inset-0 transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110">
                              <Image
                                src="/travel-guide/2.png"
                                width={500}
                                height={280}
                                className="rounded-xl w-full h-full"
                                alt="Blog image"
                              />
                            </div>
                            <div
                              className="absolute bottom-0 w-full h-full rounded-xl"
                              style={{
                                backgroundImage:
                                  "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%)",
                              }}
                            >
                              <h3 className="absolute bottom-3 left-5 right-5 text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]">
                                Hướng Dẫn Chi Tiết Gia Hạn Visa Việt Nam Cho
                                Người Nước Ngoài
                              </h3>
                            </div>
                          </div>
                        </CarouselItem>
                        <CarouselItem className="basis-9/12">
                          <div className="relative rounded-xl cursor-pointer h-full">
                            <div className="absolute inset-0 transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110">
                              <Image
                                src="/travel-guide/3.png"
                                width={500}
                                height={280}
                                className="rounded-xl w-full h-full"
                                alt="Blog image"
                              />
                            </div>
                            <div
                              className="absolute bottom-0 w-full h-full rounded-xl"
                              style={{
                                backgroundImage:
                                  "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%)",
                              }}
                            >
                              <h3 className="absolute bottom-3 left-5 right-5 text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]">
                                Làm Thế Nào Để Đăng Ký E visa Cho Người Nước
                                Ngoài Vào Việt Nam?
                              </h3>
                            </div>
                          </div>
                        </CarouselItem>
                        <CarouselItem className="basis-9/12">
                          <div className="relative rounded-xl cursor-pointer h-full">
                            <div className="absolute inset-0 transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110">
                              <Image
                                src="/travel-guide/4.png"
                                width={500}
                                height={280}
                                className="rounded-xl w-full h-full"
                                alt="Blog image"
                              />
                            </div>
                            <div
                              className="absolute bottom-0 w-full h-full rounded-xl"
                              style={{
                                backgroundImage:
                                  "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%)",
                              }}
                            >
                              <h3 className="absolute bottom-3 left-5 right-5 text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]">
                                Điểm Danh Những Khu Du Lịch Sinh Thái Bến Tre
                                Được Nhiều Du Khách Chọn Lựa
                              </h3>
                            </div>
                          </div>
                        </CarouselItem>
                        <CarouselItem className="basis-9/12">
                          <div className="relative rounded-xl cursor-pointer h-full">
                            <div className="absolute inset-0 transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110">
                              <Image
                                src="/travel-guide/5.png"
                                width={500}
                                height={280}
                                className="rounded-xl w-full h-full"
                                alt="Blog image"
                              />
                            </div>
                            <div
                              className="absolute bottom-0 w-full h-full rounded-xl"
                              style={{
                                backgroundImage:
                                  "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%)",
                              }}
                            >
                              <h3 className="absolute bottom-3 left-5 right-5 text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]">
                                Cập Nhật Thông Tin Chi Tiết Cho Người Lần Đầu
                                Xin Visa 462 Úc Tham Khảo
                              </h3>
                            </div>
                          </div>
                        </CarouselItem>
                      </CarouselContent>
                    </Carousel>
                  </div>
                  {/*  */}
                </div>
              </div>
              {/* Form contact */}
              <div className="py-6">
                <FormContact />
              </div>
            </div>
          </div>
        </div>
      </main>
    </SeoSchema>
  );
}
