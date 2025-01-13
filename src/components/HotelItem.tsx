import { formatCurrency } from "@/lib/formatters";
import { calculatorDiscountPercent } from "@/utils/Helper";
import Image from "next/image";
import Link from "next/link";

export default function HotelItem({ hotel }: any) {
  return (
    <div className="border-solid border-2 border-[#EAECF0] rounded-2xl bg-white h-full">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="overflow-hidden rounded-t-2xl relative h-52">
            <Link href={`/khach-san/chi-tiet/${hotel.slug}`}>
              <Image
                className="hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full"
                src={`${hotel.image_url}/${hotel.image_location}`}
                alt="Hotel Image"
                width={320}
                height={320}
                sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw"
                style={{ height: 220, width: "100%" }}
              />
            </Link>
            {hotel.discount_price > 0 && (
              <div className="absolute bottom-0 left-0 text-white px-3 py-1 bg-[#F27145] rounded-tr-3xl">
                <span>
                  Tiết kiệm{" "}
                  {calculatorDiscountPercent(hotel.discount_price, hotel.price)}
                </span>
              </div>
            )}
          </div>
          <Link
            href={`/khach-san/chi-tiet/${hotel.slug}`}
            className="block text-base font-semibold line-clamp-2 text__default_hover mt-3 px-4"
          >
            <h3> {hotel.name}</h3>
          </Link>
        </div>
        <div className="mt-2 px-4">
          <div className="flex">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <Image
                  src="/icon/start-icon.svg"
                  alt="start icon"
                  width={16}
                  height={16}
                />
              </div>
            ))}
            <div>
              <Image
                src="/icon/start.svg"
                alt="start icon"
                width={16}
                height={16}
                style={{ width: "16px", height: "16px" }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="line-through text-[#667085] font-semibold h-6">
              {hotel.discount_price ? formatCurrency(hotel.price) : ""}
            </p>

            <p className="text-[#F27145] text-xl font-semibold">
              {hotel.discount_price
                ? formatCurrency(hotel.price - hotel.discount_price)
                : formatCurrency(hotel.price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
