import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import styles from "@/styles/styles.module.scss";

export default function TravelGuide() {
  return (
    <div className="pt-8 bg-[#FCFCFD]">
      <div className="flex justify-between">
        <div>
          <h3 className="text-[32px] font-bold">Cẩm nang du lịch</h3>
        </div>
        <div
          className="hidden lg:flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200"
          style={{ transition: "0.3s" }}
        >
          <button className="text-[#175CD3] font-medium"> Xem tất cả</button>
          <Image
            className="ease-in duration-300"
            src="/icon/chevron-right.svg"
            alt="Icon"
            width={20}
            height={20}
          />
        </div>
      </div>
      <div className="lg:hidden inline-flex bg-[#EFF8FF] mt-1 py-3 px-4 rounded-lg space-x-3">
        <button className="text-[#175CD3] font-medium"> Xem tất cả</button>
        <Image
          className="ease-in duration-300"
          src="/icon/chevron-right.svg"
          alt="Icon"
          width={20}
          height={20}
        />
      </div>
      <div className="mt-8 w-full flex flex-col lg:flex-row lg:space-x-4 space-y-6 lg:space-y-0">
        <div
          className={`basis-1/2 cursor-pointer ${styles.travel_guide_item} `}
        >
          <div className="relative group overflow-hidden rounded-xl w-full h-[468px] lg:h-[584px]">
            <div
              className="absolute inset-0 bg-cover transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%), url('/travel-guide/1.png')",
              }}
            ></div>
            <span className="absolute bottom-3 left-5 right-5 text-xl text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]">
              Cập Nhật Thông Tin Chi Tiết Cho Người Lần Đầu Xin Visa 462 Úc Tham
              Khảo
            </span>
          </div>
        </div>
        <div className="hidden lg:basis-1/2 md:grid grid-cols-2 gap-6">
          <div className="relative rounded-xl cursor-pointer group overflow-hidden w-full h-[280px]">
            <div
              className="absolute inset-0 bg-cover transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%), url('/travel-guide/2.png')",
              }}
            ></div>
            <span className="absolute bottom-3 left-5 right-5 text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]">
              Hướng Dẫn Chi Tiết Gia Hạn Visa Việt Nam Cho Người Nước Ngoài
            </span>
          </div>
          <div className="relative rounded-xl cursor-pointer group overflow-hidden w-full h-[280px]">
            <div
              className="absolute inset-0 bg-cover transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%), url('/travel-guide/3.png')",
              }}
            ></div>
            <span className="absolute bottom-3 left-5 right-5 text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]">
              Làm Thế Nào Để Đăng Ký E visa Cho Người Nước Ngoài Vào Việt Nam?
            </span>
          </div>
          <div className="relative rounded-xl cursor-pointer group overflow-hidden w-full h-[280px]">
            <div
              className="absolute inset-0 bg-cover transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%), url('/travel-guide/4.png')",
              }}
            ></div>
            <span className="absolute bottom-3 left-5 right-5 text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]">
              Điểm Danh Những Khu Du Lịch Sinh Thái Bến Tre Được Nhiều Du Khách
              Chọn Lựa
            </span>
          </div>
          <div className="relative rounded-xl cursor-pointer group overflow-hidden w-full h-[280px]">
            <div
              className="absolute inset-0 bg-cover transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%), url('/travel-guide/5.png')",
              }}
            ></div>
            <span className="absolute bottom-3 left-5 right-5 text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]">
              Cập Nhật Thông Tin Chi Tiết Cho Người Lần Đầu Xin Visa 462 Úc Tham
              Khảo
            </span>
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
              <CarouselItem className="basis-9/12">
                <div
                  className="relative rounded-xl cursor-pointer"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%), url('/travel-guide/2.png')",
                    backgroundSize: "cover",
                    width: "100%",
                    height: "280px",
                  }}
                >
                  <span className="absolute bottom-3 left-5 right-5 text-white font-semibold">
                    Hướng Dẫn Chi Tiết Gia Hạn Visa Việt Nam Cho Người Nước
                    Ngoài
                  </span>
                </div>
              </CarouselItem>
              <CarouselItem className="basis-9/12">
                <div
                  className="relative rounded-xl cursor-pointer"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%), url('/travel-guide/4.png')",
                    backgroundSize: "cover",
                    width: "100%",
                    height: "280px",
                  }}
                >
                  <span className="absolute bottom-3 left-5 right-5 text-white font-semibold">
                    Điểm Danh Những Khu Du Lịch Sinh Thái Bến Tre Được Nhiều Du
                    Khách Chọn Lựa
                  </span>
                </div>
              </CarouselItem>
              <CarouselItem className="basis-9/12">
                <div
                  className="relative rounded-xl cursor-pointer"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%), url('/travel-guide/5.png')",
                    backgroundSize: "cover",
                    width: "100%",
                    height: "280px",
                  }}
                >
                  <span className="absolute bottom-3 left-5 right-5 text-white font-semibold">
                    Cập Nhật Thông Tin Chi Tiết Cho Người Lần Đầu Xin Visa 462
                    Úc Tham Khảo
                  </span>
                </div>
              </CarouselItem>
              <CarouselItem className="basis-9/12">
                <div
                  className="relative rounded-xl cursor-pointer"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%), url('/travel-guide/3.png')",
                    backgroundSize: "cover",
                    width: "100%",
                    height: "280px",
                  }}
                >
                  <span className="absolute bottom-3 left-5 right-5 text-white font-semibold">
                    Làm Thế Nào Để Đăng Ký E visa Cho Người Nước Ngoài Vào Việt
                    Nam?
                  </span>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
        {/*  */}
      </div>
    </div>
  );
}
