import { FlightApi } from "@/api/Flight";
import FlightBookForm from "../components/FlightBookingForm";
import type { Metadata } from "next";
import Script from "next/script";
import { pageUrl } from "@/utils/Urls";
import { siteUrl } from "@/constants";
import SeoSchema from "@/components/schema";

export const metadata: Metadata = {
  title: "Vé máy bay",
  description: "Happy Book | Vé máy bay",
  keywords: "TVé máy bay",
  alternates: {
    canonical: pageUrl("ve-may-bay/thong-tin-khach-hang", true),
  },
};
export default async function CustomerInfo() {
  const airportsReponse = await FlightApi.airPorts();
  const airportsData = airportsReponse?.payload.data ?? [];
  return (
    <SeoSchema
      {...(metadata as any)}
      url={metadata.alternates?.canonical as string}
      breadscrumbItems={[
        {
          name: pageUrl("ve-may-bay", true),
          item: "Vé máy bay",
        },
        {
          name: metadata.alternates?.canonical as string,
          item: metadata.title as string,
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
