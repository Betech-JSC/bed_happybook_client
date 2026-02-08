import TourItem from "@/components/product/components/tour-item";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { getServerT } from "@/lib/i18n/getServerT";
import { getCachedHomeIndex } from "@/app/utils/home-cached-api";

export default async function TourHot() {
  const data =
    ((await getCachedHomeIndex("tour-hot"))?.payload?.data as any) ?? [];
  if (!data?.length) return;
  const t = await getServerT();
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
              <h2 className="text-[24px] lg:text-[32px] font-bold">
                {t("tour_hot")}
              </h2>
            </div>
            <Link
              href="/tours"
              className="hidden lg:flex bg-[#EFF8FF] hover:bg-blue-200 py-1 px-4 rounded-lg space-x-3"
              style={{ transition: "0.3s" }}
            >
              <button className="text-[#175CD3] font-medium">
                {" "}
                {t("xem_tat_ca")}
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
            {t("trai_nghiem_sac_vang_va_kham_pha_van_hoa_mua_thu")}
          </p>
          <Link
            href="/tours"
            className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
          >
            <button className="text-[#175CD3] font-medium">
              {" "}
              {t("xem_tat_ca")}
            </button>
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
                {data.map((tour: any, index: number) => (
                  <CarouselItem
                    key={index}
                    className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                  >
                    <TourItem tour={tour} />
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
