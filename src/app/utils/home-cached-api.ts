import { BannerApi } from "@/api/Banner";
import { HomeApi } from "@/api/Home";
import { ProductFlightApi } from "@/api/ProductFlight";
import { unstable_cache } from "next/cache";

export const getCachedBanner = unstable_cache(
    async (page: string) => {
        return await BannerApi.getBannerPage(page);
    },
    ["cached-banner-home"],
    {
        revalidate: 3600, // 1 hour
    }
);

export const getCachedHomeIndex = unstable_cache(
    async (productType: string) => {
        return await HomeApi.index(productType);
    },
    ["cached-home-index"],
    {
        revalidate: 3600, // 1 hour
    }
);

export const getCachedProductFlights = unstable_cache(
    async (flightType: string, categoryId?: number) => {
        return await ProductFlightApi.getFlights(flightType, categoryId);
    },
    ["cached-product-flights"],
    {
        revalidate: 3600,
    }
);
