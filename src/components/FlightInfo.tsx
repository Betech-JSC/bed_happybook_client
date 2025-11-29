// components/FlightTicketCard.tsx
import Image from "next/image";
import { Briefcase, Clock } from "lucide-react";
import { format, parseISO, differenceInSeconds } from "date-fns";
import { vi } from "date-fns/locale";
import { formatNumberToHoursAndMinutesFlight, formatTimeZone } from "@/lib/formatters";
import DisplayImage from "@/components/base/DisplayImage";
import { isEmpty } from "lodash";
import { useTranslation } from "@/hooks/useTranslation";

export default function FlightInfo({ flight, airports }: { flight: any, airports: any[] }) {
    const { t } = useTranslation();
    if (!flight || !flight.segments || flight.segments.length === 0) return null;

    // Helper to find airport
    const getAirport = (code: string) => {
        return airports?.flatMap((country: any) => country.airports)
            .find((airport: any) => airport.code === code);
    };

    return (
        <div className="max-w-4xl mx-auto">
            {flight.segments.map((segment: any, index: number) => {
                const isLastSegment = index === flight.segments.length - 1;
                const departureAirport = getAirport(segment.departure.IATACode);
                const arrivalAirport = getAirport(segment.arrival.IATACode);
                const departureTime = parseISO(segment.departure.at);
                const arrivalTime = parseISO(segment.arrival.at);

                let duration = segment.duration;
                if (!duration) {
                    duration = differenceInSeconds(arrivalTime, departureTime) / 60;
                }

                const operatingAirline = !isEmpty(segment?.operating) ? segment?.operating : segment.airline;
                const flightNumber = segment.flightNumber;
                const bookingClass = flight.groupClass ? flight?.bookingClass : segment.bookingClass ?? "";

                // Baggage info extraction
                const flightCarryOnBaggage = flight.selectedTicketClass?.carryOnBaggage
                    ?? flight?.fareOptions?.[0]?.carryOnBaggage
                    ?? flight?.carryOnBaggage
                    ?? "";

                const flightCheckedBagge = flight.selectedTicketClass?.checkedBaggae
                    ?? flight?.fareOptions?.[0]?.checkedBaggae
                    ?? flight?.checkedBaggae
                    ?? "";

                // Transit calculation
                let transitDuration = 0;
                let transitAirport = null;
                let transitCode = "";
                if (!isLastSegment) {
                    const nextSegment = flight.segments[index + 1];
                    const nextDepartureTime = parseISO(nextSegment.departure.at);
                    transitDuration = differenceInSeconds(nextDepartureTime, arrivalTime) / 60;
                    transitAirport = arrivalAirport; // Transit happens at the arrival airport of current segment
                    transitCode = segment.arrival.IATACode;
                }

                return (
                    <div key={index}>
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden my-4">
                            <div className="grid grid-cols-2">
                                <div className="col-span-1 p-3 md:p-6 border-r border-gray-200 flex flex-col justify-between">
                                    <div className="">
                                        <div className="flex items-center gap-2 md:gap-3 flex-1">
                                            <div className="relative w-8 h-8 md:w-12 md:h-12 shrink-0">
                                                <DisplayImage
                                                    imagePath={`assets/images/airline/${operatingAirline.toLowerCase()}.gif`}
                                                    width={48}
                                                    height={48}
                                                    alt={operatingAirline}
                                                    classStyle="object-contain w-full h-full"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-xs md:text-base text-gray-900">
                                                    {segment.airline}
                                                    <div className="font-normal text-gray-700"> {flightNumber}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-2 md:mt-4">
                                        <div className="text-sm md:text-xl font-bold text-gray-900">
                                            {formatTimeZone(segment.departure.at, segment.departure.timezone)}
                                        </div>
                                        <div className="text-xs md:text-lg text-gray-600">
                                            <span className="font-medium">({segment.departure.IATACode})</span>
                                            <span className="ml-1 md:ml-2">{departureAirport?.name || departureAirport?.city}</span>
                                        </div>
                                        <div className="text-[10px] md:text-sm text-gray-500 mt-1">
                                            <span>{format(departureTime, "EEEE dd 'Tháng' MM yyyy", { locale: vi })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ==== PHẦN PHẢI - Đến nơi ==== */}
                                <div className="col-span-1 flex p-3 md:p-6 items-end text-right">
                                    <div className="w-full text-[10px] md:text-sm text-gray-600">
                                        <div>{formatNumberToHoursAndMinutesFlight(duration)} - {t("hang")} {bookingClass}</div>
                                        <div className=" flex justify-end mt-2">
                                            <div className="flex flex-col gap-1 items-end">
                                                {flightCarryOnBaggage && !isEmpty(flightCarryOnBaggage.trim()) && (
                                                    <div className="flex items-center gap-1 md:gap-2">
                                                        <Briefcase className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                                                        <span>{t("hanh_ly_xach_tay")}:</span> {flightCarryOnBaggage}
                                                    </div>
                                                )}
                                                {flightCheckedBagge && !isEmpty(flightCheckedBagge.trim()) && (
                                                    <div className="flex items-center gap-1 md:gap-2">
                                                        <Briefcase className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                                                        <span>{t("hanh_ly_ky_gui")}:</span> {flightCheckedBagge}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-2 md:mt-4">
                                            <div className="text-sm md:text-xl font-bold text-gray-900">
                                                {formatTimeZone(segment.arrival.at, segment.arrival.timezone)}
                                            </div>
                                            <div className="text-xs md:text-lg text-gray-600">
                                                <span className="font-medium">({segment.arrival.IATACode})</span>
                                                <span className="ml-1 md:ml-2">{arrivalAirport?.name || arrivalAirport?.city}</span>
                                            </div>
                                            <div className="text-[10px] md:text-sm text-gray-500 mt-1">
                                                <span>{format(arrivalTime, "EEEE dd 'Tháng' MM yyyy", { locale: vi })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!isLastSegment && (
                            <div className="flex items-center justify-center my-2">
                                <div className="bg-blue-50 text-blue-700 px-2 py-1 md:px-4 md:py-2 rounded-full flex items-center gap-1 md:gap-2 text-[10px] md:text-sm font-medium border border-blue-100">
                                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                    <span>
                                        Transfer in {transitAirport?.city ? `${transitAirport.city} (${transitCode})` : transitCode}
                                    </span>
                                    <span>•</span>
                                    <span>{formatNumberToHoursAndMinutesFlight(transitDuration)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}