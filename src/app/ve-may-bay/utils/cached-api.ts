import { cache } from "react";
import { FlightApi } from "@/api/Flight";
import { PageApi } from "@/api/Page";
import { ProductFlightApi } from "@/api/ProductFlight";

export const getCachedAirports = cache(async () => {
    return (await FlightApi.airPorts())?.payload.data ?? [];
});

export const getCachedPageContent = cache(async (language: string = "vi") => {
    return (await PageApi.getContent("ve-may-bay", language))?.payload?.data as any;
});

export const getCachedProductFlights = cache(async (type: string = "all") => {
    return (await ProductFlightApi.getFlights(type))?.payload?.data as any;
});

export const getCachedFooterMenu = cache(async (page: string = "flight") => {
    return (await PageApi.footerMenu(page))?.payload as any;
});
