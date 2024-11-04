import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const tourist: string[] = [];
for (let i = 1; i <= 8; i++) {
  tourist.push(`/tourist-suggest/${i}.png`);
}
export default function TouristSuggest() {
  return (
    <div className="py-8 bg-[#FCFCFD] hidden lg:block">
      <div className="flex justify-between">
        <div>
          <h2 className="text-[32px] font-bold">Bạn muốn đi đâu chơi?</h2>
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
            {tourist.map((place, index) => (
              <CarouselItem key={index} className="basis-1/6">
                <div>
                  <Image
                    src={place}
                    alt="Tourist Destination"
                    width={194}
                    height={295}
                    className="rounded-xl cursor-pointer"
                  />
                </div>
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
