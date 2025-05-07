"use client";
import { useState, useEffect, useRef, Fragment } from "react";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GeneralInforPaths } from "@/constants/paths";
export default function HeaderMobileMenu() {
  const pathname = usePathname();
  const [isMenuMbOpen, setIsMenuMbOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState("0px");
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (dropdownRef.current) {
      if (isMenuMbOpen) {
        setMenuHeight(`${dropdownRef.current.scrollHeight}px`);
      } else {
        setMenuHeight("0px");
      }
    }
  }, [isMenuMbOpen]);
  useEffect(() => {
    setIsMenuMbOpen(false);
  }, [pathname]);
  return (
    <Fragment>
      <div
        className={`${styles.nav_icon} ${isMenuMbOpen ? styles.open : ""} `}
        onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
      >
        <span className="!bg-black"></span>
        <span className="!bg-black"></span>
        <span className="!bg-black"></span>
      </div>
      {/* Mobile Menu */}
      <div
        className={`fixed max-h-[600px] inset-[-1px] flex items-center justify z-50  top-[69px] duration-500 ease-in-out`}
        style={{
          height: menuHeight,
          opacity: isMenuMbOpen ? "1" : "0",
          zIndex: isMenuMbOpen ? "10" : "-1",
          transform: isMenuMbOpen ? "translateY(0)" : "translateY(-50px)",
        }}
      >
        <div
          ref={dropdownRef}
          className={`bg-white text-black overflow-y-scroll shadow-lg w-full h-full px-3`}
        >
          <div>
            <p className="mt-3">
              <strong>Dịch vụ</strong>
            </p>
            <Link
              href="/tours/tour-noi-dia"
              className="block mt-4 cursor-pointer hover:text-[#F27145]"
            >
              Tour nội địa
            </Link>
            <Link
              href="/tours/tour-quoc-te"
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              Tour quốc tế
            </Link>
            <Link
              href="/tours/tour-du-thuyen"
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              Tour du thuyền
            </Link>
            <Link
              href="/ve-may-bay"
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              Vé máy bay
            </Link>
            {/* <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Vé máy bay quốc tế
            </p> */}
            <Link
              href="/visa"
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              Dịch vụ làm Visa
            </Link>
            <Link
              href="/dinh-cu"
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              Định cư
            </Link>
            <Link
              href="/khach-san"
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              Khách sạn
            </Link>
            <Link
              href="/combo"
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              Combo
            </Link>
          </div>
          <div className="mt-6">
            <p>
              <strong>Về Happy Book</strong>
            </p>
            <p className="mt-4 hover:text-[#F27145] cursor-pointer">
              <Link href="/ve-chung-toi">Về chúng tôi</Link>
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              <Link href="/tin-tuc">Tin tức</Link>
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              <Link href="/lien-he">Liên hệ chúng tôi</Link>
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              <Link href="/dang-ky-ctv">Đăng ký CTV</Link>
            </p>
          </div>
          <div className="my-6">
            <p>
              <strong>Khác</strong>
            </p>
            <div className="mt-4 hover:text-[#F27145] cursor-pointer">
              <Link href="/tu-van-nhan-visa">Tư vấn Visa</Link>
            </div>
            {GeneralInforPaths.map(
              (
                item: { title: string; slug: string; url: string },
                index: number
              ) => (
                <div
                  key={index}
                  className="mt-4 hover:text-[#F27145] cursor-pointer"
                >
                  <Link href={item.url}>{item.title}</Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
