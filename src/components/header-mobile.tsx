"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import SearchMobile from "./search-mobile";
import styles from "@/styles/styles.module.scss";
import Link from "next/link";

export default function HeaderMobile() {
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
  return (
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
        {/* Menu Button */}
        <div
          className={`${styles.nav_icon} ${isMenuMbOpen ? styles.open : ""} `}
          onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
        >
          <span className="!bg-black"></span>
          <span className="!bg-black"></span>
          <span className="!bg-black"></span>
        </div>
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
              onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
              className="block mt-4 cursor-pointer hover:text-[#F27145]"
            >
              Tour nội địa
            </Link>
            <Link
              href="/tours/tour-quoc-te"
              onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              Tour quốc tế
            </Link>
            <Link
              href="/tours/tour-du-thuyen"
              onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              Tour du thuyền
            </Link>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Vé máy bay nội địa
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Vé máy bay quốc tế
            </p>
            <Link
              href="/visa"
              onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              Dịch vụ làm Visa
            </Link>
            <Link
              href="/dinh-cu"
              onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
              className="block mt-3 hover:text-[#F27145] cursor-pointer"
            >
              Định cư
            </Link>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Khách sạn
            </p>
            <Link
              href="/compo"
              onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
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
              <Link
                href="/ve-chung-toi"
                onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
              >
                Về chúng tôi
              </Link>
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              <Link
                href="/tin-tuc"
                onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
              >
                Tin tức
              </Link>
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              <Link
                href="/lien-he"
                onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
              >
                Liên hệ chúng tôi
              </Link>
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              <Link
                href="/dang-ky-ctv"
                onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
              >
                Đăng ký CTV
              </Link>
            </p>
          </div>
          <div className="my-6">
            <p>
              <strong>Khác</strong>
            </p>
            <p className="mt-4 hover:text-[#F27145] cursor-pointer">
              <Link
                href="/tu-van-nhan-visa"
                onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
              >
                Tư vấn visa
              </Link>
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              <Link
                href="/huong-dan-thanh-toan"
                onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
              >
                Hướng dẫn thanh toán
              </Link>
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Hướng dẫn đặt vé
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Thông tin chuyển khoản
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Điều khoản sử dụng
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              <Link
                href="/chinh-sach-bao-mat"
                onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}
              >
                Chính sách bảo mật
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
