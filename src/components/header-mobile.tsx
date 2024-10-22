import Image from "next/image";
import Link from "next/link";
import HeaderMobileMenu from "./header-mobile-menu";
import { Fragment } from "react";
import SearchMobile from "./search-mobile";

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
      {/* Search */}
      <div className="mt-[68px] block lg:hidden">
        <div className="mt-4 h-[828px]">
          <div className="absolute inset-0 h-[828px]">
            <Image
              priority
              src="/bg-image.png"
              width={500}
              height={584}
              className="object-cover w-full h-full"
              alt="Background"
            />
          </div>
          <div
            className="absolute w-full h-[828px]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
            }}
          ></div>
          <div className="relative z-[1]">
            <h3 className="pt-8 text-xl lg:text-2xl font-bold text-center text-white">
              Bắt đầu hành trình với HappyBook
            </h3>
            {/* Search Bar */}
            <div className="flex items-center px-3 my-4">
              <input
                type="text"
                placeholder="Tìm theo điểm đến, hoạt động"
                className="p-2 w-full rounded-l-lg text-gray-700 h-12"
              />
              <button className="bg-blue-500 px-3 rounded-r-lg w-12 h-12">
                <Image
                  src="/icon/search.svg"
                  alt="Search icon"
                  className="h-10"
                  width={20}
                  height={20}
                  style={{ width: 20, height: 20 }}
                />
              </button>
            </div>
            <SearchMobile />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
