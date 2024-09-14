"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import SearchMobile from "./search-mobile";
import styles from "@/styles/styles.module.scss";

export default function HeaderMobile() {
  const [isMenuMbOpen, setIsMenuMbOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState("0px");
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (dropdownRef.current) {
      if (isMenuMbOpen) {
        console.log(dropdownRef.current);
        setMenuHeight(`${dropdownRef.current.scrollHeight}px`);
      } else {
        setMenuHeight("0px");
      }
    }
  }, [isMenuMbOpen]);
  const menuIcon = isMenuMbOpen ? "/icon/close.svg" : "/icon/menu-mb.svg";
  return (
    <div className="text-white relative lg:hidden block bg-white">
      <div className="h-[68px] fixed w-full top-0 z-[99] bg-white mx-auto flex justify-between items-center py-3 px-3">
        {/* Logo */}
        <div>
          <Image
            priority
            src="/logo-mobile.png"
            alt="Happy Book Logo"
            width={160}
            height={40}
          ></Image>
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
      <div className="mt-[68px]">
        <SearchMobile />
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
            <p className="mt-4 cursor-pointer hover:text-[#F27145]">
              Tour nội địa
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Tour quốc tế
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Tour du thuyền
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Vé máy bay nội địa
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Vé máy bay quốc tế
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Dịch vụ làm Visa
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">Định cư</p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Khách sạn
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">Combo</p>
          </div>
          <div className="mt-6">
            <p>
              <strong>Về Happy Book</strong>
            </p>
            <p className="mt-4 hover:text-[#F27145] cursor-pointer">
              Về chúng tôi
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">Tin tức</p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Liên hệ chúng tôi
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Đăng ký CTV
            </p>
          </div>
          <div className="my-6">
            <p>
              <strong>Khác</strong>
            </p>
            <p className="mt-4 hover:text-[#F27145] cursor-pointer">
              Tư vấn visa
            </p>
            <p className="mt-3 hover:text-[#F27145] cursor-pointer">
              Hướng dẫn thanh toán
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
          </div>
        </div>
      </div>
    </div>
  );
}
