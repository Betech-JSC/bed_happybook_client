import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";

export default function NewsByPage({
  title,
  wrapperStyle = "pt-8 pb-12 bg-[#FCFCFD]",
  data,
}: any) {
  if (!data?.length) return;
  const [firstItem, ...news] = data;
  return (
    <div className={wrapperStyle}>
      <div className="flex justify-between">
        <div>
          <h2 className="text-[32px] font-bold">{title}</h2>
        </div>
        <Link
          href="/tin-tuc"
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
        </Link>
      </div>
      <Link
        href="/tin-tuc"
        className="lg:hidden inline-flex bg-[#EFF8FF] mt-2 py-3 px-4 rounded-lg space-x-3"
      >
        <button className="text-[#175CD3] font-medium"> Xem tất cả</button>
        <Image
          className="ease-in duration-300"
          src="/icon/chevron-right.svg"
          alt="Icon"
          width={20}
          height={20}
        />
      </Link>
      <div className="mt-8 w-full flex flex-col lg:flex-row lg:space-x-4 space-y-6 lg:space-y-0">
        <div className={`basis-1/2 cursor-pointer ${styles.travel_guide_item}`}>
          <Link
            href={`/tin-tuc/chi-tiet/${firstItem.alias}`}
            className="block relative group overflow-hidden rounded-xl w-full h-[360px] lg:h-[584px]"
          >
            <div className="absolute inset-0 transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110">
              <Image
                src={`${firstItem.image_url}/${firstItem.image_location}`}
                width={500}
                height={584}
                className="w-full h-[360px] md:h-[584px]"
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
                {firstItem.title}
              </h3>
            </div>
          </Link>
        </div>
        <div className="hidden lg:basis-1/2 md:grid grid-cols-2 gap-6">
          {news.length > 0 &&
            news.map((item: any) => (
              <Link
                href={`/tin-tuc/chi-tiet/${item.alias}`}
                key={item.id}
                className="block relative rounded-xl cursor-pointer group overflow-hidden w-full h-[280px]"
              >
                <div className="absolute inset-0 transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110">
                  <Image
                    src={`${item.image_url}/${item.image_location}`}
                    width={500}
                    height={280}
                    className="w-full h-[280px]"
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
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
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
              {news.length > 0 &&
                news.map((item: any) => (
                  <CarouselItem className="basis-9/12 h-[280px]" key={item.id}>
                    <Link
                      href={`/tin-tuc/chi-tiet/${item.alias}`}
                      className="block relative rounded-xl cursor-pointer h-full"
                    >
                      <div className="absolute inset-0 transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110">
                        <Image
                          src={`${item.image_url}/${item.image_location}`}
                          width={500}
                          height={280}
                          className="rounded-xl w-full h-[280px]"
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
                          {item.title}
                        </h3>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>
        </div>
        {/*  */}
      </div>
    </div>
  );
}
