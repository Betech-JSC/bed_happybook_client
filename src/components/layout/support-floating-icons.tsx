import Image from "next/image";
import Link from "next/link";

export default function SupportFloatingIcons() {
  return (
    <div className="fixed bottom-[22%] right-2 md:bottom-1/4 -translate-y-1/4 z-[100]">
      <div className="flex flex-col items-center">
        <a href="tel:1900633437">
          <Image
            src="/gif/phone.gif"
            width={60}
            height={60}
            alt="1900633437"
            unoptimized={true}
          />
        </a>
        <Link
          href="https://www.facebook.com/happybooktravel"
          target="_blank"
          className="mt-4 transition-transform hover:scale-100 md:hover:scale-125 duration-300"
        >
          <Image src="/social/fb.svg" width={40} height={40} alt="FB" />
        </Link>
        <Link
          href="https://zalo.me/2451421179976954585/"
          target="_blank"
          className="mt-6 transition-transform hover:scale-100 md:hover:scale-125 duration-300"
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
