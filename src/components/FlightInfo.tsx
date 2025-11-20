import DisplayImage from "./base/DisplayImage";

export default function FlightInfo({ flight }: { flight: any }) {
    if (!flight) return null;

    const fare = flight.fareOptions?.[0];

    return (
        <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-stretch w-full relative">
                {/* LEFT */}
                <div className="w-1/2 p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-14 h-6">
                            <DisplayImage
                                imagePath={`assets/images/airline/${flight.airline.toLowerCase()}.gif`}
                                alt="Airline logo"
                                classStyle="w-full h-full object-contain"
                                width={82}
                                height={24}
                            />
                        </div>
                        <div className="font-semibold text-gray-800 text-sm">
                            {flight.airline}, {flight.segments?.[0]?.flightNumber}
                        </div>
                    </div>

                    <div className="text-3xl font-bold text-gray-800">{flight.departureTime}</div>

                    <div className="text-gray-700 text-sm">
                        ({flight.departure.IATACode}) {flight.departureAirportName}
                    </div>

                    <div className="text-gray-500 text-sm">{flight.departureDateFormatted}</div>
                </div>

                {/* MIDDLE CUT DESIGN */}
                <div className="flex flex-col items-center justify-center relative px-4">
                    <div className="h-full border-l-2 border-dashed border-blue-300"></div>
                    <div className="absolute top-0 bg-white w-6 h-6 rounded-full border border-gray-300"></div>
                    <div className="absolute bottom-0 bg-white w-6 h-6 rounded-full border border-gray-300"></div>
                    <div className="absolute text-blue-500 text-xl">✈️</div>
                </div>

                {/* RIGHT */}
                <div className="w-1/2 p-4 flex flex-col gap-2 text-right">
                    <div className="text-gray-800 text-sm">
                        {flight.durationFormatted} - Hạng đặt chỗ: {fare?.bookingClass || "N/A"}
                    </div>

                    <div className="text-sm text-gray-700 flex flex-col items-end gap-1">
                        <div>
                            🧳 Hành lý xách tay: {fare?.carryOn ?? "7 kg"} |
                            <span className="ml-1">📦 Hành lý ký gửi: {fare?.baggage ?? "20 kg"}</span>
                        </div>
                    </div>

                    <div className="text-3xl font-bold text-gray-800">{flight.arrivalTime}</div>

                    <div className="text-gray-700 text-sm">
                        ({flight.arrival.IATACode}) {flight.arrivalAirportName}
                    </div>

                    <div className="text-gray-500 text-sm">{flight.arrivalDateFormatted}</div>
                </div>
            </div>
        </div>
    );
}