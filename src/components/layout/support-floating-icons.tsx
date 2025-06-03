import Image from "next/image";
import Link from "next/link";

export default function SupportFloatingIcons() {
  return (
    <div className="fixed bottom-1/4 -translate-y-1/4 right-4 z-[100]">
      <div className="flex flex-col gap-6">
        <Link
          href="https://www.facebook.com/happybooktravel"
          target="_blank"
          className="hover:scale-125 duration-300"
        >
          <Image src="/social/fb.svg" width={40} height={40} alt="FB" />
        </Link>
        <Link
          href="https://zalo.me/2451421179976954585/"
          target="_blank"
          className="hover:scale-125 duration-300"
        >
          <Image
            src="/social/icon-zalo.svg"
            width={40}
            height={40}
            alt="Zalo"
          />
        </Link>
      </div>
    </div>
  );
}
