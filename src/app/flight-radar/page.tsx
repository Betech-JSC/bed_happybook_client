import type { Metadata } from "next";
import FlightTracker from "@/components/FlightTracker";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";
import { pageUrl } from "@/utils/Urls";
import Image from "next/image";

export const metadata: Metadata = formatMetadata({
  title: "Flight Radar VN - Theo dõi chuyến bay thời gian thực | Happy Book",
  description: "Tra cứu thông tin, lịch trình bay, cổng khởi hành và thời tiết sân bay trực tuyến cho các hãng bay nội địa và quốc tế.",
  alternates: {
    canonical: pageUrl("flight-radar", true),
  },
});

export default function FlightRadarPage() {
  const canonicalUrl = pageUrl("flight-radar", true);

  return (
    <SeoSchema
      metadata={metadata}
      breadscrumbItems={[
        {
          url: canonicalUrl,
          name: "Flight Radar VN",
        },
      ]}
    >
      {/* Brand Header Banner Section */}
      <div className="relative h-max pb-20 lg:pb-28">
        <div className="absolute inset-0">
          <Image
            priority
            src="/bg-image-2.webp"
            fill
            sizes="100vw"
            className="object-cover animate-fadeIn"
            alt="Flight Radar Background"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
          }}
        ></div>
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-[130px] lg:pt-[180px] max__screen relative text-center text-white pb-12 lg:pb-16">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight uppercase mb-3 drop-shadow-sm">
            Flight Radar VN
          </h1>
          <p className="text-sm lg:text-base text-slate-100 font-medium max-w-xl mx-auto opacity-90 leading-relaxed">
            Theo dõi, tra cứu trạng thái chuyến bay, giờ khởi hành/hạ cảnh, số hiệu cổng và thời tiết sân bay trực tuyến thời gian thực.
          </p>
        </div>
      </div>

      {/* Main Content overlapping the banner */}
      <main className="w-full bg-white relative z-2 rounded-2xl top-[-12px]">
        <div className="px-3 lg:px-[50px] xl:px-[80px] py-12 max__screen">
          <FlightTracker />
        </div>
      </main>
    </SeoSchema>
  );
}
