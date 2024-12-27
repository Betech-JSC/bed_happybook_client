import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import VisaApplicationForm from "./form";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";

export const metadata: Metadata = formatMetadata({
  title: "Tư vấn nhận Visa",
  description: "Happy Book",
  alternates: {
    canonical: pageUrl("tu-van-nhan-visa", true),
  },
});

export default function VisaConsulting() {
  return (
    <SeoSchema
      {...(metadata as any)}
      url={metadata.alternates?.canonical as string}
      breadscrumbItems={[
        {
          name: metadata.alternates?.canonical as string,
          item: metadata.title as string,
        },
      ]}
    >
      <main className="relative h-400px">
        <div
          className="h-[500px] md:h-[700px] w-full -z-[1] absolute"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #04349A 0%, #1755DC 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="base__content h-80 md:h-[405px] lg:pr-[200px]">
          <div className="flex justify-between items-center h-full">
            <h4 className="text-32 text-white font-bold">Tư vấn nhận Visa</h4>
            <div>
              <Image
                priority
                src="/bg-tu-van-visa.png"
                alt="Background"
                width={273}
                height={273}
                className="w-full h-full md:w-[273px]"
              />
            </div>
          </div>
        </div>
        <VisaApplicationForm />
      </main>
    </SeoSchema>
  );
}
