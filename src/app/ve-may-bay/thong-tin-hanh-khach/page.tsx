import { FlightApi } from "@/api/Flight";
import FlightBookForm from "../components/FlightBookingForm";
import type { Metadata } from "next";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";
import { PageApi } from "@/api/Page";
import { getServerLang } from "@/lib/session";

function getMetadata(data: any) {
  return formatMetadata({
    title: data?.meta_title || data?.page_name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical:
        data?.canonical_link ||
        pageUrl("ve-may-bay/thong-tin-hanh-khach", true),
    },
    openGraph: {
      images: [
        {
          url: data?.meta_image
            ? data.meta_image
            : `${data?.image_url}/${data?.image_location}`,
          alt: data?.meta_title,
        },
      ],
    },
  });
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const contentPage = (await PageApi.getContent("thong-tin-hanh-khach"))
    ?.payload?.data as any;

  return getMetadata(contentPage);
}

export default async function CustomerInfo() {
  const airportsReponse = await FlightApi.airPorts();
  const airportsData = airportsReponse?.payload.data ?? [];
  const language = await getServerLang();
  const contentPage = (
    await PageApi.getContent("thong-tin-hanh-khach", language)
  )?.payload?.data as any;
  const metadata = getMetadata(contentPage);

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
