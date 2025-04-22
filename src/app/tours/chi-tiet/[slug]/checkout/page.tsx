import Image from "next/image";
import Link from "next/link";
import CheckOutTourForm from "../../../components/FormCheckOut";
import { TourApi } from "@/api/Tour";
import { notFound } from "next/navigation";
import { formatCurrency, formatMoney } from "@/lib/formatters";
import { Span } from "next/dist/trace";
import { renderTextContent } from "@/utils/Helper";

const defaultImage = "https://www.vietnamtourism.gov.vn/uploads/images/2024/04/22/1716556565_1716556565_1716556565_1716556565.jpghttps://storage.googleapis.com/gst-nhanhtravel-com/upload/tour/20241018151946.webp?GoogleAccessId=firebase-adminsdk-1qkmx%40nhanhtravel-129e6.iam.gserviceaccount.com&Expires=2229239586&Signature=ekTzZpKt9mPRSsSIJbaQZHkJNO5V9fOtdBZy2DfQSLSEBejWt%2BG5wp4Odh3tGw%2FS%2BzF1CW4EXR2zyny5LwAeU%2Bvgd2x8Z0gS%2B0qDk%2B%2BkFU2LJem6c1l7zc%2F%2FS2kDKXhHgwIUh6%2B0yc27lKzPOR47fYPBbuC4eHRmGaZMVCAI2P3Mi03whRqNniEvAvs7b%2BG85L9czdurKtfEvv%2FaQafrALjNQ6IiZDZEL96S%2FbzpD4pkKqHMGXM3PJmz2CElrG0sGc%2BfnvUIrM3n7t6lSXACA8EcMEUKgXVVIe1xXlAmd4OX8bO%2Bq7QpTo0yw8vzWLx7U7eDXaVIoBheYQUP7wvASA%3D%3D";
export default async function TourCheckout({
  params,
}: {
  params: { slug: string };
}) {
  const res = (await TourApi.getDetailBySlug(params.slug)) as any;
  console.log("res", res);
  const detail = res?.payload?.data;
  if (!detail) {
    notFound();
  }
  return (
    <main className="bg-gray-100 mt-10">
      <div className="base__content ">
        <div className="flex flex-col-reverse items-start md:flex-row md:space-x-8 lg:mt-4 pb-8">
          <div className="w-full md:w-7/12 lg:w-8/12 mt-4 md:mt-0 rounded-2xl">
            <div
              className="rounded-t-xl"
              style={{
                background:
                  "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
              }}
            >
              <h3
                className="text-22 py-4 px-8 font-semibold text-white"
                data-translate="true"
              >
                Thông tin đơn hàng
              </h3>
            </div>

            <div className="mt-4">
              <CheckOutTourForm productId={detail.tour_open_id} />
            </div>
          </div>
          <div className="w-full md:w-5/12 lg:w-4/12 bg-white rounded-2xl">
            <div className="overflow-hidden rounded-t-2xl">
              <Image
                className="cursor-pointer w-full h-60 md:h-40 lg:h-[230px] rounded-t-2xl hover:scale-110 ease-in duration-300"
                src={detail.tour_image || defaultImage}
                alt="Image"
                width={410}
                height={230}
                sizes="100vw"
              />
            </div>
            <div className="py-4 px-3 lg:px-6">
              <Link
                href="#"
                className="text-xl lg:text-2xl font-bold hover:text-primary duration-300 transition-colors"
                data-translate="true"
              >
                {renderTextContent(detail?.tour_name)}
              </Link>
              <div className="flex mt-4 space-x-2 items-center">
                <Image
                  className="w-4 h-4"
                  src="/icon/clock.svg"
                  alt="Icon"
                  width={18}
                  height={18}
                />
                <span data-translate="true">
                  {detail?.duration}
                </span>
              </div>
              <div className="flex space-x-2 mt-3 items-start">
                <Image
                  className="w-4 h-4 mt-1"
                  src="/icon/flag.svg"
                  alt="Icon"
                  width={18}
                  height={18}
                />
                <span data-translate="true">
                  {renderTextContent(detail?.place_start)}
                </span>
              </div>
              <div className="flex space-x-2 mt-3 items-start">
                <Image
                  className="w-4 h-4 mt-1"
                  src="/icon/marker-pin-01.svg"
                  alt="Icon"
                  width={18}
                  height={18}
                />
                <span data-translate="true">
                  {renderTextContent(detail?.place_end)}
                </span>
              </div>
              <div className=" bg-gray-50 text-end p-2 rounded-lg mt-6">
                <span className="text-xl lg:text-2xl text-primary font-bold">
                  {detail.price ? (
                    <span>
                      {formatCurrency(detail.price.replace(/,/g, ""))}
                    </span>
                  ) : (
                    <span data-translate="true">Liên hệ</span>
                  )}
                </span>
                {/* <span>/ khách</span> */}
                {/* <p className="text-blue-700 mt-3">+ 40 điểm</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
