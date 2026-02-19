import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import { getServerT } from "@/lib/i18n/getServerT";
import { toSnakeCase } from "@/utils/Helper";
import { newsApi } from "@/api/news";
import clsx from "clsx";

export default async function NewsByPage({
  title,
  wrapperStyle = "pt-8 pb-12 bg-[#FCFCFD]",
  page,
}: {
  title: string;
  wrapperStyle?: string;
  page?: string;
}) {
  const data =
    ((await newsApi.getLastedNewsByPage(page))?.payload?.data as any) ?? [];
  if (!data?.length) return;
  const [firstItem, ...news] = data;
  const t = await getServerT();
  return (
    <div className={clsx("pt-8 pb-12 bg-[#FCFCFD]", wrapperStyle)}>
      <div className="flex justify-between">
        <div>
          <h2 className="text-[32px] font-bold" data-translate="true">
            {t(toSnakeCase(title))}
          </h2>
        </div>
        <Link
          href="/tin-tuc"
          className="hidden lg:flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200"
          style={{ transition: "0.3s" }}
        >
          <button className="text-[#175CD3] font-medium">
            {" "}
            {t("xem_tat_ca")}
          </button>
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
        <button className="text-[#175CD3] font-medium">
          {" "}
          {t("xem_tat_ca")}
        </button>
        <Image
          className="ease-in duration-300"
          src="/icon/chevron-right.svg"
          alt="Xem thêm"
          width={20}
          height={20}
        />
      </Link>
      <div className="mt-8 w-full flex flex-col lg:flex-row lg:space-x-4 space-y-6 lg:space-y-0">
        <div className={`basis-1/2 cursor-pointer`}>
          <Link
            href={`/${firstItem.alias}`}
            className="block relative group overflow-hidden rounded-xl w-full h-[360px] lg:h-[584px]"
          >
            <div className="absolute inset-0 transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110">
              <Image
                src={`${firstItem.image_url}/${firstItem.image_location}`}
                width={500}
                height={584}
                className="w-full h-[280px] md:h-[500px] object-cover"
                alt={firstItem.title}
              />
            </div>
            <div
              className="absolute bottom-0 w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%)",
              }}
            >
              <h3
                data-translate="true"
                className="line-clamp-3 absolute bottom-3 left-5 right-5 text-xl text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]"
              >
                {firstItem.title}
              </h3>
            </div>
          </Link>
        </div>
        <div className="hidden lg:basis-1/2 md:grid grid-cols-2 gap-6">
          {news.length > 0 &&
            news.map((item: any) => (
              <Link
                href={`/${item.alias}`}
                key={item.id}
                className="block relative rounded-xl cursor-pointer group overflow-hidden w-full h-[280px]"
              >
                <div className="absolute inset-0 transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110">
                  <Image
                    src={`${item.image_url}/${item.image_location}`}
                    width={500}
                    height={280}
                    className="w-full h-[220px] object-cover"
                    alt={item.title}
                  />
                </div>
                <div
                  className="absolute bottom-0 w-full h-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%)",
                  }}
                >
                  <h3
                    data-translate="true"
                    className="line-clamp-2 absolute bottom-3 left-5 right-5 text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]"
                  >
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
                  <CarouselItem className="basis-9/12 h-[200px]" key={item.id}>
                    <Link
                      href={`/${item.alias}`}
                      className="block relative rounded-xl cursor-pointer h-full"
                    >
                      <div className="absolute inset-0 transition-transform duration-500 ease-in-out scale-100 group-hover:scale-110">
                        <Image
                          src={`${item.image_url}/${item.image_location}`}
                          width={500}
                          height={280}
                          className="rounded-xl w-full h-[200px] object-cover"
                          alt={item.title}
                        />
                      </div>
                      <div
                        className="absolute bottom-0 w-full h-full rounded-xl"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom, rgba(23, 92, 211, 0) 63.83%, #175CD3 83.7%)",
                        }}
                      >
                        <h3
                          data-translate="true"
                          className="line-clamp-2 absolute bottom-3 left-5 right-5 text-white font-semibold transition-colors duration-500 group-hover:text-[#f27145]"
                        >
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
