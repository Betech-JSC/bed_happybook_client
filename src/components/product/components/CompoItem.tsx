import Image from "next/image";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import DisplayPrice from "@/components/base/DisplayPrice";
const defaultImage =
  "https://storage.googleapis.com/gst-nhanhtravel-com/upload/tour/20241018151946.webp?GoogleAccessId=firebase-adminsdk-1qkmx%40nhanhtravel-129e6.iam.gserviceaccount.com&Expires=2229239586&Signature=ekTzZpKt9mPRSsSIJbaQZHkJNO5V9fOtdBZy2DfQSLSEBejWt%2BG5wp4Odh3tGw%2FS%2BzF1CW4EXR2zyny5LwAeU%2Bvgd2x8Z0gS%2B0qDk%2B%2BkFU2LJem6c1l7zc%2F%2FS2kDKXhHgwIUh6%2B0yc27lKzPOR47fYPBbuC4eHRmGaZMVCAI2P3Mi03whRqNniEvAvs7b%2BG85L9czdurKtfEvv%2FaQafrALjNQ6IiZDZEL96S%2FbzpD4pkKqHMGXM3PJmz2CElrG0sGc%2BfnvUIrM3n7t6lSXACA8EcMEUKgXVVIe1xXlAmd4OX8bO%2Bq7QpTo0yw8vzWLx7U7eDXaVIoBheYQUP7wvASA%3D%3D";
export default function CompoItem({ data }: any) {
  const vehicleIcon = ["AirplaneTilt-2", "bus"];
  if (data?.transportation === 1) {
    vehicleIcon.splice(1, 1);
  } else if (data?.transportation === 2) {
    vehicleIcon.splice(0, 1);
  }
  return (
    <div className="rounded-2xl border-solid border-2 border-[#EAECF0] l bg-white">
      <div className="relative overflow-hidden rounded-t-2xl">
        <Link href={`/tours/chi-tiet/${data.slug}`}>
          <Image
            className="hover:scale-110 ease-in duration-300 cursor-pointer"
            src={data.tour_image ?? defaultImage}
            alt="Banner"
            width={200}
            height={160}
            sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
            style={{ height: 220, width: "100%" }}
          />
        </Link>
        <div className="absolute bottom-0 left-0 text-white px-3 py-1 bg-[#4E6EB3] rounded-tr-3xl">
          <span data-translate>Du lịch nội địa</span>
        </div>
        {data.is_hot && (
          <div className="absolute top-3 left-3 text-white px-3 py-1 bg-[#F27145] rounded-md">
            <span data-translate>Hot tour</span>
          </div>
        )}
      </div>
      <div className="py-3 px-4">
        <Link
          href={`/tours/chi-tiet/${data.slug}`}
          className={`text-base text-gray-900 min-h-12 font-semibold line-clamp-2 ${styles.text_hover_default}`}
        >
          <h3 data-translate>{data.tour_name}</h3>
        </Link>
        <p className="flex space-x-2 mt-2">
          <Image
            src="/icon/clock-check.svg"
            alt="Time"
            width={20}
            height={20}
          />
          <span data-translate>
            {data.duration}
          </span>
        </p>
        <div className="flex justify-between mt-[14px]">
          <div className="flex space-x-2">
            {data?.transportation > 0 &&
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
              price={data.price ? data.price.replace(/,/g, "") : 0}
              textPrefix="chỉ từ"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
