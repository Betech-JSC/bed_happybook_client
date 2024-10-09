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
import TourItem from "@/components/tour-item";
import TourStyle from "@/styles/tour.module.scss";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Tours",
  description: "Happy Book",
};
const tours = [
  {
    category: "Du lịch miền Nam",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/tour-noi-dia/1.png",
  },
  {
    category: "Du lịch miền Bắc",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/tour-noi-dia/2.png",
    hot: 1,
  },
  {
    category: "Du lịch miền Trung",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/tour-noi-dia/3.png",
    hot: 1,
  },
  {
    category: "Du lịch miền Trung",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/tour-noi-dia/4.png",
    vehicle: "aa",
  },
  {
    category: "Du lịch miền Nam",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/tour-noi-dia/1.png",
  },
];
const tourist: string[] = [];
for (let i = 1; i <= 8; i++) {
  tourist.push(`/tourist-suggest/${i}.png`);
}

export default function Tour() {
  return (
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
        <div className="base__content h-full relative place-content-center">
          <span className="text-32 font-bold text-white mb-6 block">
            Tour & Trải nghiệm
          </span>
          <div className="flex items-center w-full lg:w-1/2 relative">
            <div className="absolute left-4">
              <Image
                src="/icon/place.svg"
                alt="Icon"
                className="h-10"
                width={20}
                height={20}
                style={{ width: 20, height: 20 }}
              ></Image>
            </div>
            <input
              type="text"
              placeholder="Tìm theo điểm đến, hoạt động"
              className={TourStyle.search_input}
            />
            <button className="bg-blue-500 px-3 rounded-r-lg w-16 h-16">
              <Image
                src="/icon/search.svg"
                alt="Search icon"
                className="h-10 mx-auto"
                width={20}
                height={20}
                style={{ width: 20, height: 20 }}
              ></Image>
            </button>
          </div>
        </div>
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
          <div className="mt-6">
            <div className="flex justify-between">
              <div>
                <h3 className="text-[24px] lg:text-[32px] font-bold">
                  Tour trong nước
                </h3>
              </div>
              <Link
                href="/tours/noi-dia"
                className="hidden lg:flex items-center bg-[#EFF8FF] hover:bg-blue-200 py-1 px-4 rounded-lg space-x-3 ease-in duration-300"
              >
                <span className="text-[#175CD3] font-medium">Xem tất cả</span>
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
              href="#"
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
                  {tours.map((tour, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                    >
                      <TourItem {...tour} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden lg:inline-flex" />
                <CarouselNext className="hidden lg:inline-flex" />
              </Carousel>
            </div>
          </div>
          {/* Tour nước ngoài */}
          <div className="mt-12">
            <div className="flex justify-between">
              <div>
                <h3 className="text-[24px] lg:text-[32px] font-bold">
                  Tour Du Lịch Nước Ngoài Cao Cấp
                </h3>
              </div>
              <Link
                href="#"
                className="hidden lg:flex items-center bg-[#EFF8FF] hover:bg-blue-200 py-1 px-4 rounded-lg space-x-3 ease-in duration-300"
              >
                <span className="text-[#175CD3] font-medium">Xem tất cả</span>
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
              href="#"
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
                  {tours.map((tour, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                    >
                      <TourItem {...tour} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden lg:inline-flex" />
                <CarouselNext className="hidden lg:inline-flex" />
              </Carousel>
            </div>
          </div>
          {/* Suggest Tour */}
          <div className="py-8 bg-[#FCFCFD] hidden lg:block">
            <div className="flex justify-between">
              <div>
                <h3 className="text-[32px] font-bold">Bạn muốn đi đâu chơi?</h3>
              </div>
            </div>
            <div className="mt-4 w-full">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {tourist.map((place, index) => (
                    <CarouselItem key={index} className="basis-1/6">
                      <div>
                        <Image
                          src={place}
                          alt="Tourist Destination"
                          width={194}
                          height={295}
                          className="rounded-xl cursor-pointer"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
          {/* Tour du thuyền */}
          <div className="mt-12">
            <div className="flex justify-between">
              <div>
                <h3 className="text-[24px] lg:text-[32px] font-bold">
                  Tour Du Thuyền
                </h3>
              </div>
              <Link
                href="#"
                className="hidden lg:flex items-center bg-[#EFF8FF] hover:bg-blue-200 py-1 px-4 rounded-lg space-x-3 ease-in duration-300"
              >
                <span className="text-[#175CD3] font-medium">Xem tất cả</span>
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
              href="#"
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
                  {tours.map((tour, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                    >
                      <TourItem {...tour} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden lg:inline-flex" />
                <CarouselNext className="hidden lg:inline-flex" />
              </Carousel>
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
  );
}
