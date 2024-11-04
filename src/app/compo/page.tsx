import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import FAQ from "@/components/FAQ";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CompoItem from "@/components/CompoItem";
import Search from "./components/Search";

export const metadata: Metadata = {
  title: "Combo du lịch",
  description: "Happy Book",
};
type tourItem = {
  title: string;
  image: string;
  category: string;
  hot: number;
  duration: string;
  price: string;
  vehicle: string;
};
const arrTours: tourItem[] = [];
const tour: tourItem = {
  title: "COMBO 4N3Đ BÃI DÀI + KHÁCH SẠN 4* SUNKISS NHA TRANG",
  image: "",
  category: "Du lịch nội địa",
  hot: 0,
  duration: "3 ngày 2 đêm",
  price: "800.000",
  vehicle: "",
};
for (var i = 1; i < 15; i++) {
  const tourItem = { ...tour };
  if (i == 1 || i == 5 || i == 9 || i == 13) {
    tourItem.hot = 1;
    tourItem.vehicle = "bus";
  }
  if (i == 4 || i == 8 || i == 12) {
    tourItem.vehicle = "aboth";
  }
  tourItem.image = `/compo/tours/${i}.png`;
  arrTours.push(tourItem);
}
const compoHot = [
  {
    title: "Côn đảo",
  },
  {
    title: "Phan Thiết",
  },
  {
    title: "Nha Trang",
  },
  {
    title: "Quy Nhơn",
  },
  {
    title: "Côn đảo",
  },
  {
    title: "Phan Thiết",
  },
  {
    title: "Nha Trang",
  },
];
export default function CompoTour() {
  return (
    <main>
      <div className="relative h-max">
        <div className="absolute inset-0">
          <Image
            priority
            src={`/compo/bg-header.jpeg`}
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
        <div className="py-5">
          <Search />
        </div>
      </div>
      <div className="bg-white relative z-2 rounded-2xl top-[-12px] mt-10">
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
          {/* Tours */}
          <div className="w-full">
            <h2 className="text-32 font-bold">Khám phá các điểm đến HOT</h2>
            <div className="mt-8 overflow-hidden">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {compoHot.map((item, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-10/12 md:basis-5/12 lg:basis-[30%]"
                    >
                      <div className="overflow-hidden rounded-lg relative">
                        <Link href="/compo/chi-tiet/compo-3n2d-vinpearl-resort-nha-trang">
                          <Image
                            src={`/compo/hot/${index + 1}.png`}
                            width={365}
                            height={245}
                            className=" h-56 rounded-lg hover:scale-110 ease-in duration-300"
                            sizes="100vw"
                            alt="Image"
                          />
                        </Link>
                        <div className="absolute bottom-3 left-2 text-white px-3 py-1">
                          <Link href="/compo/chi-tiet/compo-3n2d-vinpearl-resort-nha-trang">
                            <h3>{item.title}</h3>
                          </Link>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
          <div className="flex flex-col md:flex-row mt-8 justify-between items-start md:items-center">
            <h2 className="text-32 font-bold">Combo du lịch nội địa</h2>
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
          <div className="mt-8 grid md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {arrTours.map((tour, index) => (
              <div key={index}>
                <CompoItem {...tour} />
              </div>
            ))}
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
