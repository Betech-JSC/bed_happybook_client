import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function TravelGuide() {
  return (
    <div className="pt-8 bg-[#FCFCFD]">
      <div className="flex justify-between">
        <div>
          <h3 className="text-[32px] font-bold">Cẩm nang du lịch</h3>
        </div>
      </div>
      <div className="mt-8 w-full flex flex-col lg:flex-row lg:space-x-4 space-y-6 lg:space-y-0">
        <div className="basis-1/2 cursor-pointer">
          <div
            className="relative rounded-xl w-full h-[468px] lg:h-[584px] "
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%), url('/travel-guide/1.png')",
              backgroundSize: "cover",
            }}
          >
            <span className="absolute bottom-3 left-5 right-5 text-xl text-white font-semibold">
              Cập Nhật Thông Tin Chi Tiết Cho Người Lần Đầu Xin Visa 462 Úc Tham
              Khảo
            </span>
          </div>
        </div>
        <div className="hidden lg:basis-1/2 md:grid grid-cols-2 gap-6">
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
              Hướng Dẫn Chi Tiết Gia Hạn Visa Việt Nam Cho Người Nước Ngoài
            </span>
          </div>
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
              Làm Thế Nào Để Đăng Ký E visa Cho Người Nước Ngoài Vào Việt Nam?
            </span>
          </div>
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
              Điểm Danh Những Khu Du Lịch Sinh Thái Bến Tre Được Nhiều Du Khách
              Chọn Lựa
            </span>
          </div>
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
              Cập Nhật Thông Tin Chi Tiết Cho Người Lần Đầu Xin Visa 462 Úc Tham
              Khảo
            </span>
          </div>
        </div>
        {/* Mobile */}
        <div className="lg:hidden">
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
