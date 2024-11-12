import BookingDetail from "../components/BookingDetail";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thông tin đặt chỗ",
  description: "Happy Book | Thông tin đặt chỗ",
  keywords: "Thông tin đặt chỗ",
};
export default function BookingFlight() {
  return (
    <main className="bg-gray-100 mt-10">
      <div className="base__content pb-12">
        <BookingDetail />
      </div>
    </main>
  );
}
