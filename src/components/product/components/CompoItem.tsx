import Image from "next/image";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import DisplayPrice from "@/components/base/DisplayPrice";

export default function CompoItem({ data }: any) {
  const vehicleIcon = ["AirplaneTilt-2", "bus"];
  if (data?.transportation === 1) {
    vehicleIcon.splice(1, 1);
  } else if (data?.transportation === 2) {
    vehicleIcon.splice(0, 1);
  }
  return (
    <div className="rounded-2xl border-solid border-2 border-[#EAECF0] l bg-white pointer-events-none">
      <div className="relative overflow-hidden rounded-t-2xl">
        <Link href={`/combo/${data.slug}`}>
          <Image
            className="hover:scale-110 ease-in duration-300 cursor-pointer object-cover"
            src={`${data.image_url}/${data.image_location}`}
            alt={data.name}
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
          href={`/combo/${data.slug}`}
          className={`text-base text-gray-900 pointer-events-none min-h-12 font-semibold line-clamp-2 ${styles.text_hover_default}`}
        >
          <h3 data-translate="true">{data.name}</h3>
        </Link>
        <p className="flex space-x-2 mt-2">
          <Image
            src="/icon/clock-check.svg"
            alt="Time"
            width={20}
            height={20}
          />
          <span data-translate="true">
            {`${data?.combo?.day ? data?.combo.day : ""} ngày ${data?.combo?.night ? data?.combo?.night : ""
              } đêm`}
          </span>
        </p>
        <div className="flex justify-between mt-[14px]">
          <div className="flex space-x-2">
            {data?.transportation > 0 &&
              vehicleIcon.map((item, index) => (
                <Image
                  key={index}
                  src={`/icon/${item}.svg`}
                  alt={item}
                  width={20}
                  height={20}
                />
              ))}
          </div>
          <div>
            <DisplayPrice
              price={data.price - data.discount_price}
              textPrefix={`${data.discount_price > 0 ? "giá ưu đãi" : "chỉ từ"
                }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
