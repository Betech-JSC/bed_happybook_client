import Image from "next/image";
import styles from "@/styles/styles.module.scss";

export default function TourItem({
  category = "",
  title = "",
  price = "",
  duration = "",
  image = "",
  hot = 0,
  vehicle = "",
}) {
  const vehicleIcon = ["AirplaneTilt-2", "bus"];
  if (vehicle === "fly" || !vehicle) {
    vehicleIcon.splice(1, 1);
  } else if (vehicle === "bus") {
    vehicleIcon.splice(0, 1);
  }

  return (
    <div className="rounded-2xl border-solid border-2 border-[#EAECF0] l bg-white">
      <div className="relative overflow-hidden rounded-t-2xl">
        <Image
          className=" hover:scale-110 ease-in duration-300 cursor-pointer	"
          src={image}
          alt="Banner"
          width={200}
          height={160}
          sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
          style={{ height: "100%", width: "100%" }}
        />
        <div className="absolute bottom-0 left-0 text-white px-3 py-1 bg-[#4E6EB3] rounded-tr-3xl">
          <span>{category}</span>
        </div>
        {hot ? (
          <div className="absolute top-3 left-3 text-white px-3 py-1 bg-[#F27145] rounded-md">
            <span>Hot tour</span>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="py-3 px-4">
        <p
          className={`text-base text-gray-900 min-h-12 font-semibold line-clamp-2 ${styles.text_hover_default}`}
        >
          {title}
        </p>
        <p className="flex space-x-2 mt-2">
          <Image
            src="/icon/clock-check.svg"
            alt="Time"
            width={20}
            height={20}
          />
          <span>{duration}</span>
        </p>
        <div className="flex justify-between mt-[14px]">
          <div className="flex space-x-2">
            {vehicleIcon.map((item, index) => (
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
            <span>chỉ từ</span>
            <span className="text-[#F27145] font-semibold text-base lg:text-xl">
              {" "}
              {price} vnđ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
