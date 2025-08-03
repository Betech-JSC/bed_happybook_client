import type { Metadata } from "next";
import { formatMetadata } from "@/lib/formatters";
import BookingDetail from "./components/BookingDetail";
import { settingApi } from "@/api/Setting";
import { siteUrl } from "@/constants";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const seo = await settingApi.getCachedMetaSeo();

  return formatMetadata({
    robots: "index, follow",
    title: seo?.seo_title,
    description: seo?.seo_description,
    keywords: seo?.seo_keywords,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      images: [
        {
          url: seo?.image,
          alt: seo?.seo_title,
        },
      ],
    },
  });
}

export default async function BookingFlight() {
  return (
    <main className="bg-gray-100 mt-10">
      <div className="base__content pb-12">
        <BookingDetail />
      </div>
    </main>
  );
}
