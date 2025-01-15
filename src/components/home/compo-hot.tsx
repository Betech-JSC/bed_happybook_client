import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";

export default function CompoHot({ data }: any) {
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
          <div className="flex lg:w-1/4 flex-col justify-between lg:items-center">
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
          <div className="lg:w-3/4 mt-8 lg:mt-0 lg:ml-8 lg:mr-3 overflow-hidden">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {data.map((combo: any, index: number) => (
                  <CarouselItem
                    key={index}
                    className="basis-10/12 md:basis-5/12 lg:basis-1/3"
                  >
                    <div className="rounded-2xl border-solid border-2 border-[#EAECF0] l bg-white">
                      <div className="relative overflow-hidden rounded-t-2xl">
                        <Link href={`/combo/chi-tiet/${combo.slug}`}>
                          <Image
                            className=" hover:scale-110 ease-in duration-300 cursor-pointer	"
                            src={`${combo.image_url}/${combo.image_location}`}
                            alt="Combo Image"
                            width={320}
                            height={320}
                            sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                            style={{ height: 220, width: "100%" }}
                          />
                        </Link>
                        {combo.category_name && (
                          <div className="absolute bottom-0 left-0 text-white px-3 py-1 bg-[#4E6EB3] rounded-tr-3xl">
                            <span>{combo.category_name}</span>
                          </div>
                        )}
                      </div>
                      <div className="py-3 px-4">
                        <Link
                          href={`/combo/chi-tiet/${combo.slug}`}
                          className={`text-base text-gray-900 min-h-12 font-semibold line-clamp-2 ${styles.text_hover_default}`}
                        >
                          <h3>{combo.name ?? ""}</h3>
                        </Link>
                        <p className="flex space-x-2 mt-2">
                          <Image
                            src="/icon/clock-check.svg"
                            alt="Time"
                            width={20}
                            height={20}
                          />
                          <span>{`${combo.day ? combo.day : ""} ngày ${
                            combo.night ? combo.night : ""
                          } đêm`}</span>
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
                              {formatCurrency(combo.price)}
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
