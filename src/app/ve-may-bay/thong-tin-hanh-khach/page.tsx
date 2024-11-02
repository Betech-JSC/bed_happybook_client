import FlightBookForm from "../components/FlightBookingForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vé máy bay",
  description: "Happy Book | Vé máy bay",
  keywords: "TVé máy bay",
  alternates: {
    canonical: "/ve-may-bay/thong-tin-hanh-khach",
  },
};
export default function CustomerInfo() {
  return (
    <main className="bg-gray-100 mt-10">
      <div className="base__content ">
        <FlightBookForm />
      </div>
    </main>
  );
}
