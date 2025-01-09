import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";

const tours = [
  {
    categor: "Du lịch miền Nam",
    title: "Bãi Dài + Khách Sạn 4* Sunkiss Nha Trang",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/compo-hot/1.png",
  },
  {
    category: "Du lịch miền Bắc",
    title: "Khách Sạn Melia Vinpearl Huế ",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/compo-hot/2.png",
  },
  {
    category: "Du lịch miền Trung",
    title: "Du Lịch Quy Nhơn - Máy Bay Khứ Hồi - Bữa Sáng Buffet ",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/compo-hot/3.png",
  },
  {
    category: "Du lịch miền Trung",
    title: "Du Lịch Quy Nhơn - Máy Bay Khứ Hồi - Bữa Sáng Buffet ",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/compo-hot/3.png",
  },
];
export default function CompoHot() {
  return (
    <div
      className="mt-6 px-3 py-6 lg:py-8 rounded-3xl"
      style={{
        backgroundImage:
          "radial-gradient(85.35% 42.91% at 13.4% 89%, #69A0FF 0%, #1E68E8 16.6%, #0A4CBE 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mt-0 lg:mt-5">
        <div className="mt-0 lg:mt-4 lg:flex">
          <div className="flex lg:w-[40%] flex-col justify-between lg:items-center">
            <div>
              <h2 className="text-2xl lg:text-[32px] leading-9 font-bold text-white">
                Combo siêu hot hôm nay
              </h2>
              <p className="text-16 font-medium text-white mt-3">
                Đặt ngay hôm nay, kẻo lỡ cơ hội!
              </p>
            </div>
            <Image
              className="hidden lg:block"
              src="/compo-hot/image.png"
              alt="Compo Hot"
              width={234}
              height={165}
              sizes="100vw"
            />
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8 lg:mr-3">
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
                    className="basis-10/12 md:basis-5/12 lg:basis-1/3"
                  >
                    <div className="rounded-2xl border-solid border-2 border-[#EAECF0] l bg-white">
                      <div className="relative overflow-hidden rounded-t-2xl">
                        <Link href="/tours/chi-tiet/hcm-ha-noi-sapa-lao-cai-ninh-binh-ha-long-5n-4d-tour-bao-gom-may-bay">
                          <Image
                            className=" hover:scale-110 ease-in duration-300 cursor-pointer	"
                            src={tour.image}
                            alt="Banner"
                            width={200}
                            height={160}
                            sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
                            style={{ height: "100%", width: "100%" }}
                          />
                        </Link>
                        <div className="absolute bottom-0 left-0 text-white px-3 py-1 bg-[#4E6EB3] rounded-tr-3xl">
                          <span>{tour.category}</span>
                        </div>
                      </div>
                      <div className="py-3 px-4">
                        <Link
                          href="/tours/chi-tiet/hcm-ha-noi-sapa-lao-cai-ninh-binh-ha-long-5n-4d-tour-bao-gom-may-bay"
                          className={`text-base text-gray-900 min-h-12 font-semibold line-clamp-2 ${styles.text_hover_default}`}
                        >
                          <h3>{tour.title}</h3>
                        </Link>
                        <p className="flex space-x-2 mt-2">
                          <Image
                            src="/icon/clock-check.svg"
                            alt="Time"
                            width={20}
                            height={20}
                          />
                          <span>{tour.duration}</span>
                        </p>
                        <div className="flex justify-between mt-[14px]">
                          <div className="flex space-x-2">
                            <Image
                              key={index}
                              src={`/icon/bus.svg`}
                              alt="Icon"
                              width={20}
                              height={20}
                            />
                          </div>
                          <div>
                            <span>chỉ từ </span>
                            <span className="text-[#F27145] font-semibold text-base lg:text-xl">
                              {tour.price} vnđ
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
