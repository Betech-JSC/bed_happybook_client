import { FlightApi } from "@/api/Flight";
import FlightBookForm from "../components/FlightBookingForm";
import type { Metadata } from "next";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";

export const metadata: Metadata = formatMetadata({
  title: "Vé máy bay",
  description: "Happy Book | Vé máy bay",
  keywords: "TVé máy bay",
  alternates: {
    canonical: pageUrl("ve-may-bay/thong-tin-khach-hang", true),
  },
});
export default async function CustomerInfo() {
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
        <div className="base__content ">
          <FlightBookForm airportsData={airportsData} />
        </div>
      </main>
    </SeoSchema>
  );
}
