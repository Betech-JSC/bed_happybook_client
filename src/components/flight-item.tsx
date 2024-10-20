import Image from "next/image";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";

export default function FlightItem({
  title = "",
  image = "",
  price = "",
  airlineName = "",
  airlineLogo = "",
  date = "",
  type = 0,
}) {
  return (
    <div className="rounded-2xl border-solid border-2 border-[#EAECF0] l bg-white">
      <div className="relative overflow-hidden rounded-t-2xl">
        <Link href="/ve-may-bay/chi-tiet">
          <Image
            className=" hover:scale-110 ease-in duration-300 cursor-pointer	"
            src={image}
            alt="Image"
            width={200}
            height={160}
            style={{ height: "100%", width: "100%" }}
          />
          {type == 1 && (
            <div className="absolute bottom-0 left-0 text-white px-3 py-1 bg-[#4E6EB3] rounded-tr-3xl">
              <span>Khứ hồi</span>
            </div>
          )}
        </Link>
      </div>
      <div className="py-3 px-4">
        <div className="flex text-sm h-5">
          <Image src={airlineLogo} alt="Airline logo" width={24} height={24} />
          <p className="ml-2">{airlineName}</p>
        </div>
        <Link
          href="/ve-may-bay/chi-tiet"
          className={`text-base min-h-6 font-semibold line-clamp-1 mt-2 ${styles.text_hover_default}`}
        >
          {title}
        </Link>
        <p className="flex space-x-2 mt-2">
          <span>{date}</span>
        </p>
        <div className="text-right mt-2">
          <span className="text-[#F27145] font-semibold text-base lg:text-xl">
            {" "}
            {price} vnđ
          </span>
        </div>
      </div>
    </div>
  );
}
