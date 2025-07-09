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

const tourist: string[] = [];
for (let i = 1; i <= 8; i++) {
  tourist.push(`/tourist-suggest/${i}.png`);
}
export default async function TouristSuggest({ data }: any) {
  const t = await getServerT();
  return (
    <div className="py-8 bg-[#FCFCFD] hidden lg:block">
      <div className="flex justify-between">
        <div>
          <h2 className="text-[32px] font-bold">{t("ban_muon_di_dau_choi")}</h2>
        </div>
      </div>
      <div className="mt-4 w-full">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {data.map((item: any) => (
              <CarouselItem key={item.id} className="basis-1/6">
                <Link href={item.url}>
                  <Image
                    src={`${item.image_url}/${item.image_location}`}
                    alt="Image"
                    width={194}
                    height={295}
                    className="rounded-xl cursor-pointer w-full h-[240px]"
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
