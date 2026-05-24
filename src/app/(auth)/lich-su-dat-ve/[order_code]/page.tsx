import type { Metadata } from "next";
import { FlightApi } from "@/api/Flight";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";
import { PageApi } from "@/api/Page";
import { getServerLang, getSession } from "@/lib/session";
import OrderFlightDetail from "./components/OrderFlightDetail";
import { isEmpty } from "lodash";
import { notFound, redirect } from "next/navigation";
import { isBefore } from "date-fns";

function getMetadata(data: any) {
  return formatMetadata({
    title: data?.meta_title || data?.page_name,
    description: data?.meta_description,
    robots: data?.meta_robots,
    keywords: data?.keywords,
    alternates: {
      canonical:
        data?.canonical_link || pageUrl("ve-may-bay/thong-tin-dat-cho", true),
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
  const contentPage = (await PageApi.getContent("thong-tin-dat-cho"))?.payload
    ?.data as any;

  return getMetadata(contentPage);
}

export default async function BookingFlight({
  params,
}: {
  params: { order_code: string };
}) {
  const orderCode = params.order_code;
  const session = await getSession();
  const token = session.access_token;
  if (isEmpty(token)) {
    redirect("/dang-nhap");
  }

  const language = await getServerLang();
  const contentPage = (await PageApi.getContent("thong-tin-dat-cho", language))
    ?.payload?.data as any;
  const metadata = getMetadata(contentPage);
  const response = await FlightApi.bookingDetail(token, orderCode);
  if (response?.status === 401) {
    redirect("/dang-nhap");
  }
  const detail = response?.payload?.data;

  if (
    !detail ||
    detail?.status !== "new" ||
    !isEmpty(detail?.payment_method) ||
    isBefore(detail.booking_deadline, new Date())
  ) {
    notFound();
  }

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
          <OrderFlightDetail detail={detail} />
        </div>
      </main>
    </SeoSchema>
  );
}
