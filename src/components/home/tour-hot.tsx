import TourItem from "@/components/tour-item";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";

const tours = [
  {
    category: "Du lịch miền Nam",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/tour-hot/1.png",
    hot: 1,
  },
  {
    category: "Du lịch miền Bắc",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/tour-hot/2.png",
  },
  {
    category: "Du lịch miền Trung",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/tour-hot/3.png",
  },
  {
    category: "Du lịch miền Trung",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/tour-hot/4.png",
  },
  {
    category: "Du lịch miền Bắc",
    title: "Sài Gòn - Mỹ Tho - Bến Tre - Châu Đốc - Cần Thơ - Sóc Trăng ....",
    price: "800.000",
    duration: "3 ngày 2 đêm",
    image: "/tour-hot/2.png",
  },
];
export default function TourHot() {
  // const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen">
      <div className="relative lg:mt-12 py-6 lg:px-6 lg:py-8 rounded-3xl">
        {/* Background */}
        <div
          className="rounded-3xl absolute inset-0 hidden lg:block"
          style={{
            background: "#FCFCFD",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1,
          }}
        ></div>
        {/* Background Image */}
        <div className="absolute inset-0 z-[2] hidden lg:block">
          <Image
            src="/bg-img/tour-hot.png"
            width={1280}
            height={500}
            alt="Background"
            sizes="100vw"
            className="w-full h-full rounded-3xl "
          />
        </div>
        {/* Content */}
        <div className="relative z-10">
          <div className="flex justify-between">
            <div>
              <h3 className="text-[24px] lg:text-[32px] font-bold">Tour Hot</h3>
            </div>
            <Link
              href="/tours/tour-noi-dia"
              className="hidden lg:flex bg-[#EFF8FF] hover:bg-blue-200 py-1 px-4 rounded-lg space-x-3"
              style={{ transition: "0.3s" }}
            >
              <button className="text-[#175CD3] font-medium">
                {" "}
                Xem tất cả
              </button>
              <Image
                className=" hover:scale-110 ease-in duration-300"
                src="/icon/chevron-right.svg"
                alt="Icon"
                width={20}
                height={20}
              />
            </Link>
          </div>
          <p className="text-16 font-medium mt-3">
            Trải nghiệm sắc vàng và khám phá văn hóa mùa thu!
          </p>
          <Link
            href="/tours/tour-noi-dia"
            className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
          >
            <button className="text-[#175CD3] font-medium"> Xem tất cả</button>
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
              // plugins={[plugin.current]}
              // onMouseEnter={plugin.current.stop}
              // onMouseLeave={plugin.current.reset}
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
      </div>
    </div>
  );
}
