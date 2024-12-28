import type { Metadata } from "next";
import BookingDetail2 from "../components/BookingDetail2";
import { FlightApi } from "@/api/Flight";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";

export const metadata: Metadata = formatMetadata({
  title: "Thông tin đặt chỗ",
  description: "Happy Book | Thông tin đặt chỗ",
  keywords: "Thông tin đặt chỗ",
  alternates: {
    canonical: pageUrl("ve-may-bay/thong-tin-dat-cho", true),
  },
});

export default async function BookingFlight() {
  const airportsReponse = await FlightApi.airPorts();
  const airportsData = airportsReponse?.payload.data ?? [];
  return (
    <SeoSchema
      metadata={metadata}
      breadscrumbItems={[
        {
          url: pageUrl("ve-may-bay", true),
          name: "Vé máy bay",
        },
        {
          url: metadata.alternates?.canonical as string,
          name: metadata.title as string,
        },
      ]}
    >
      <main className="bg-gray-100 mt-10">
        <div className="base__content pb-12">
          <BookingDetail2 airports={airportsData} />
        </div>
      </main>
    </SeoSchema>
  );
}
