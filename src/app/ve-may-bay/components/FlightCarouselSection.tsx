import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import FlightItem from "@/components/product/components/flight-item";
import { isEmpty } from "lodash";
import { getCachedProductFlights } from "../utils/cached-api";
import { getServerT } from "@/lib/i18n/getServerT";

export default async function FlightCarouselSection() {
    const productFlights = await getCachedProductFlights();
    const t = await getServerT();

    if (isEmpty(productFlights)) return null;

    return (
        <>
            {Object.entries(productFlights as Record<string, any[]>).map(
                ([key, items], index) => {
                    if (items?.length > 0) {
                        return (
                            <div className="mt-6 py-6" key={index}>
                                <div>
                                    <div className="flex justify-between">
                                        <div>
                                            <h2
                                                className="text-[24px] lg:text-32 font-bold"
                                                data-translate
                                            >
                                                {key === "popular"
                                                    ? t("nhung_chuyen_bay_pho_bien")
                                                    : key === "oneWay"
                                                        ? t("ve_may_bay_mot_chieu_danh_cho_ban")
                                                        : t("ve_may_bay_khu_hoi_danh_cho_ban")}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="mt-8 w-full">
                                        <Carousel
                                            opts={{
                                                align: "start",
                                                loop: true,
                                            }}
                                        >
                                            <CarouselContent>
                                                {items.map((flight: any) => (
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
                        );
                    }
                    return null;
                }
            )}
        </>
    );
}
