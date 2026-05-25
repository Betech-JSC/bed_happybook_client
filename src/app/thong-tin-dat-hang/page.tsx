import type { Metadata } from "next";
import { formatMetadata } from "@/lib/formatters";
import BookingDetail from "./components/BookingDetail";
import { settingApi } from "@/api/Setting";
import { siteUrl } from "@/constants";
import { Suspense } from "react";

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
        <Suspense fallback={
          <div className="flex my-20 w-full justify-center items-center space-x-3 p-4 mx-auto rounded-lg text-center">
            <span className="loader_spiner !border-blue-500 !border-t-blue-200"></span>
            <span className="text-18">Loading...</span>
          </div>
        }>
          <BookingDetail />
        </Suspense>
      </div>
    </main>
  );
}
