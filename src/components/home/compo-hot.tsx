import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import CompoItem from "../product/components/CompoItem";
import { getServerT } from "@/lib/i18n/getServerT";
import { getCachedHomeIndex } from "@/app/utils/home-cached-api";

export default async function CompoHot() {
  const data =
    ((await getCachedHomeIndex("combo"))?.payload?.data as any) ?? [];
  if (!data?.length) return;
  const t = await getServerT();
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
                {t("combo_sieu_hot_hom_nay")}
              </h2>
              <p className="text-16 font-medium text-white mt-3">
                {t("dat_ngay_hom_nay_keo_lo_co_hoi")}
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
                    <CompoItem data={combo} />
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
