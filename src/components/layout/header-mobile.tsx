import Image from "next/image";
import Link from "next/link";
import HeaderMobileMenu from "./header-mobile-menu";
import { Fragment } from "react";

export default function HeaderMobile() {
  return (
    <Fragment>
      <div className="text-white relative lg:hidden block bg-white">
        <div className="h-[68px] fixed w-full top-0 z-[99] bg-white mx-auto flex justify-between items-center py-3 px-3">
          {/* Logo */}
          <div>
            <Link href="/">
              <Image
                priority
                src="/logo-mobile.png"
                alt="Happy Book Logo"
                width={160}
                height={40}
              />
            </Link>
          </div>
          {/* Menu */}
          <HeaderMobileMenu />
        </div>
      </div>
    </Fragment>
  );
}
