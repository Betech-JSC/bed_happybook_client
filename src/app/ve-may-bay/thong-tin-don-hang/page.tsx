import type { Metadata } from "next";
import BookingDetail2 from "../components/BookingDetail2";
import { FlightApi } from "@/api/Flight";

export const metadata: Metadata = {
  title: "Thông tin đặt chỗ",
  description: "Happy Book | Thông tin đặt chỗ",
  keywords: "Thông tin đặt chỗ",
};

export default async function BookingFlight() {
  const airportsReponse = await FlightApi.airPorts();
  const airportsData = airportsReponse?.payload.data ?? [];
  return (
    <main className="bg-gray-100 mt-10">
      <div className="base__content pb-12">
        <BookingDetail2 airports={airportsData} />
      </div>
    </main>
  );
}
