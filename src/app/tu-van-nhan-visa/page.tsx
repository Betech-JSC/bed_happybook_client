import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import VisaApplicationForm from "./form";
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
      canonical: data?.canonical_link || pageUrl("tu-van-nhan-visa", true),
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
  const contentPage = (await PageApi.getContent("tu-van-nhan-visa"))?.payload
    ?.data as any;

  return getMetadata(contentPage);
}

export default async function VisaConsulting() {
  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("tu-van-nhan-visa", language))
    ?.payload?.data as any;
  const metadata = getMetadata(contentPage);

  return (
    <SeoSchema
      metadata={metadata}
      breadscrumbItems={[
        {
          url: metadata.alternates?.canonical as string,
          name: metadata.title as string,
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
            <h4 className="text-32 text-white font-bold" data-translate>
              Tư vấn nhận Visa
            </h4>
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
