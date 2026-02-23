import Image from "next/image";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/formatters";
import DisplayPrice from "@/components/base/DisplayPrice";

const defaultImage =
  "https://storage.googleapis.com/gst-nhanhtravel-com/upload/tour/20241018151946.webp?GoogleAccessId=firebase-adminsdk-1qkmx%40nhanhtravel-129e6.iam.gserviceaccount.com&Expires=2229239586&Signature=ekTzZpKt9mPRSsSIJbaQZHkJNO5V9fOtdBZy2DfQSLSEBejWt%2BG5wp4Odh3tGw%2FS%2BzF1CW4EXR2zyny5LwAeU%2Bvgd2x8Z0gS%2B0qDk%2B%2BkFU2LJem6c1l7zc%2F%2FS2kDKXhHgwIUh6%2B0yc27lKzPOR47fYPBbuC4eHRmGaZMVCAI2P3Mi03whRqNniEvAvs7b%2BG85L9czdurKtfEvv%2FaQafrALjNQ6IiZDZEL96S%2FbzpD4pkKqHMGXM3PJmz2CElrG0sGc%2BfnvUIrM3n7t6lSXACA8EcMEUKgXVVIe1xXlAmd4OX8bO%2Bq7QpTo0yw8vzWLx7U7eDXaVIoBheYQUP7wvASA%3D%3D";
export default function HotTourItem({ tour, isHot }: any) {
  const vehicleIcon = ["bus", "AirplaneTilt-2"];
  if (tour?.transportation === 1) {
    vehicleIcon.splice(1, 1);
  } else if (tour?.transportation === 2) {
    vehicleIcon.splice(0, 1);
  }
  if (!tour) return;
  return (
    <div className="rounded-2xl border-solid border-2 border-[#EAECF0] l bg-white">
      <div className="relative overflow-hidden rounded-t-2xl">
        <Link href={`/tours/${tour.slug}-${tour.id}`}>
          <Image
            className=" hover:scale-110 ease-in duration-300 cursor-pointer object-cover"
            src={tour.tour_image ?? defaultImage}
            alt="Tour Image"
            width={320}
            height={320}
            sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
            style={{ height: 220, width: "100%" }}
          />
        </Link>
        <div className="absolute bottom-0 left-0 text-white px-3 py-1 bg-[#4E6EB3] rounded-tr-3xl">
          <span data-translate>{tour.type_tour_price_id_name ?? ""}</span>
        </div>
        {isHot ? (
          <div className="absolute top-3 left-3 text-white px-3 py-1 bg-[#F27145] rounded-md">
            <span>Hot tour</span>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="py-3 px-4">
        <Link
          href={`/tours/${tour.slug}-${tour.id}`}
          className={`text-base text-gray-900 min-h-12 font-semibold line-clamp-2 ${styles.text_hover_default}`}
        >
          <h3 data-translate>{tour.tour_name ?? ""}</h3>
        </Link>
        <p className="flex space-x-2 mt-2">
          <Image
            src="/icon/clock-check.svg"
            alt="Time"
            width={20}
            height={20}
          />
          <span data-translate>{tour.duration ?? ""}</span>
        </p>
        <p className="flex space-x-2 mt-2">
          <Image src="/icon/clock.svg" alt="Time" width={20} height={20} />
          <span data-translate>
            {" "}
            Ngày khởi hành:{" "}
            {tour.date_start_tour ? formatDate(tour.date_start_tour) : ""}
          </span>
        </p>

        <p className="flex space-x-2 mt-2">
          <Image src="/icon/clock.svg" alt="Time" width={20} height={20} />
          <span data-translate>
            {" "}
            Ngày kết thúc:{" "}
            {tour.date_end_tour ? formatDate(tour.date_end_tour) : ""}
          </span>
        </p>
        <div className="flex justify-between mt-[14px]">
          <div className="flex space-x-2">
            {tour?.transportation > 0 &&
              vehicleIcon.map((item, index) => (
                <Image
                  key={index}
                  src={`/icon/${item}.svg`}
                  alt="Icon"
                  width={20}
                  height={20}
                />
              ))}
          </div>
          <div>
            <DisplayPrice
              price={tour.price ? tour.price.replace(/,/g, "") : 0}
              textPrefix="chỉ từ"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
