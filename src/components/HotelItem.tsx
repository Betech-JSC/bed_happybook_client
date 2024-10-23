import Image from "next/image";
import Link from "next/link";
interface HotelItemType {
  title: string;
  image: string;
  discountPercent: number;
}
interface Props {
  hotel: HotelItemType;
}
export default function HotelItem({ hotel }: Props) {
  return (
    <div className="border-solid border-2 border-[#EAECF0] rounded-2xl bg-white h-full">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="overflow-hidden rounded-t-2xl relative h-52">
            <Image
              className="hover:scale-110 ease-in duration-300 cursor-pointer h-full w-full"
              src={hotel.image}
              alt="Image"
              width={310}
              height={224}
            />
            <div className="absolute bottom-0 left-0 text-white px-3 py-1 bg-[#F27145] rounded-tr-3xl">
              <span>Tiết kiệm {hotel.discountPercent}%</span>
            </div>
          </div>
          <div className="text-base font-semibold line-clamp-2 text__default_hover mt-3 px-4">
            {hotel.title}
          </div>
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
            <p className="line-through text-[#667085] font-semibold">
              800.000 vnđ
            </p>
            <p className="text-[#F27145] text-xl font-semibold">
              1.200.000 vnđ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
