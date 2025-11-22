// components/FlightTicketCard.tsx
import Image from "next/image";
import { Briefcase } from "lucide-react";

export default function FlightInfo({ flight }) {
    console.log(flight);

    return (
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden my-8">
            <div className="grid grid-cols-2">
                <div className="col-span-1 p-6 border-right lg:border-r lg:border-gray-200 flex flex-col justify-between">
                    <div className="">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative w-12 h-12 shrink-0">
                                <Image
                                    src="/airline/VJ.svg"
                                    alt="Vietravel Airlines"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">
                                    Vietravel Airlines
                                    <div className="font-normal text-gray-700"> VU131</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <div className="text-xl font-bold text-gray-900">12:05</div>
                        <div className="text-lg text-gray-600">
                            <span className="font-medium">(SGN)</span>
                            <span className="ml-2 max-lg:hidden">Sân bay Tân Sơn Nhất</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            <span className="max-lg:hidden">Chủ Nhật 23 Tháng Mười Một 2025</span>
                            <span className="lg:hidden">CN 23/11/2025</span>
                        </div>
                    </div>
                </div>

                {/* ==== PHẦN PHẢI - Đến nơi ==== */}
                <div className="col-span-1 flex p-6 items-end text-right">
                    <div className="w-full text-sm text-gray-600">
                        <div>1h 35m - Hạng đặt chỗ: Q - A320-100/200</div>
                        <div className=" flex justify-end">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-gray-500" />
                                    <span className="max-sm:hidden">Hành lý xách tay:</span> 7 kg
                                </div>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-gray-500" />
                                    <span className="max-sm:hidden">Hành lý ký gửi:</span>7 kg
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-xl font-bold text-gray-900">13:40</div>
                            <div className="text-lg text-gray-600">
                                <span className="font-medium">(BKK)</span>
                                <span className="ml-2 max-lg:hidden">Sân bay Suvarnabhumi</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                <span className="max-lg:hidden">Chủ Nhật 23 Tháng Mười Một 2025</span>
                                <span className="lg:hidden">CN 23/11/2025</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}