import Image from "next/image";

export default function Banner() {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2  gap-[24px] justify-between mt-0 lg:mt-3"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <Image
        src="/images/banner.svg"
        alt="Banner"
        width={200}
        height={160}
        style={{ height: "100%", width: "100%" }}
      />
      <Image
        src="/images/banner-1.svg"
        className="hidden lg:block"
        alt="Banner"
        width={200}
        height={160}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
