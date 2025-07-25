import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import styles from "@/styles/styles.module.scss";
import FlightItem from "@/components/product/components/flight-item";
import { ProductFlightApi } from "@/api/ProductFlight";
import { getServerT } from "@/lib/i18n/getServerT";

export default async function Flight() {
  const t = await getServerT();
  const data =
    (await ProductFlightApi.getFlights("popular"))?.payload?.data?.popular ??
    ([] as any);

  if (!data?.length) return;
  return (
    <div className="px-3 lg:px-[50px] xl:px-[80px] max__screen ">
      <div className="relative lg:mt-12 lg:px-6 py-6 lg:py-8 hidden lg:block">
        {/* Background */}
        <div
          className="rounded-3xl absolute inset-0"
          style={{
            background: "#FCFCFD",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1,
          }}
        ></div>
        {/* Background Image */}
        <div className="absolute inset-0 z-[2]">
          <Image
            src="/bg-img/flight.png"
            width={1280}
            height={500}
            alt="Background"
            sizes="100vw"
            className="w-full h-full rounded-3xl "
          />
        </div>
        {/* Content */}
        <div className={`relative z-10 ${styles.hide__background_mb}`}>
          <div>
            <div className="flex justify-between">
              <div>
                <h2 className="text-[24px] lg:text-[32px] font-bold">
                  {t("nhung_chuyen_bay_pho_bien")}
                </h2>
              </div>
              {/* <div
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
              </div> */}
            </div>
            <p className="text-16 font-medium mt-3" data-translate>
              {/* Trải nghiệm sắc vàng và khám phá văn hóa mùa thu! */}
            </p>
            {/* <div className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3">
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
            </div> */}
            <div className="mt-8 w-full">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {data.map((flight: any) => (
                    <CarouselItem
                      key={flight.id}
                      className="basis-10/12 md:basis-5/12 lg:basis-1/4 "
                    >
                      <FlightItem data={flight} />
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
    </div>
  );
}
