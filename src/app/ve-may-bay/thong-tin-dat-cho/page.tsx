import { FlightApi } from "@/api/Flight";
import BookingDetail from "../components/BookingDetail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thông tin đặt chỗ",
  description: "Happy Book | Thông tin đặt chỗ",
  keywords: "Thông tin đặt chỗ",
};
export default async function BookingFlight() {
  const airportsReponse = await FlightApi.airPorts(
    "danh-sach-diem-di-den-ve-may-bay"
  );
  const airportsData = airportsReponse?.payload.data ?? [];
  return (
    <main className="bg-gray-100 mt-10">
      <div className="base__content pb-12">
        <BookingDetail airports={airportsData} />
      </div>
    </main>
  );
}
