"use client";
import Image from "next/image";
import Search from "@/components/search";
import { useState } from "react";
import styles from "@/styles/styles.module.scss";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuIcon = isMenuOpen ? "/icon/x-close.svg" : "/icon/menu-icon.svg";
  return (
    <header
      className="text-white relative hidden lg:block"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%), url(/bg-image.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={styles.header__menu}>
        <div className="mx-auto flex justify-between items-center py-4 relative lg:px-[30px] xl:px-[80px] sm:px-3">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              priority
              src="/logo.svg"
              alt="Happy Book Logo"
              width={240}
              height={64}
            ></Image>
          </div>

          {/* Search Bar */}
          <div className="hidden xl:flex items-center xl:w-[25%]">
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
              ></Image>
            </button>
          </div>

          {/* <div className="flex items-center space-x-6"> */}
          <div>
            <a
              href="#"
              className="h-8 hover:border-b-[3px] hover:border-[#F27145]"
            >
              Về chúng tôi
            </a>
          </div>
          <div>
            <a
              href="#"
              className="h-8 hover:border-b-[3px] hover:border-[#F27145]"
            >
              Liên hệ
            </a>
          </div>
          <div>
            <a
              href="#"
              className="h-8 hover:border-b-[3px] hover:border-[#F27145]"
            >
              Tin tức
            </a>
          </div>

          <div className="relative">
            <button className="flex items-center space-x-1">
              <Image
                src="/icon/VN flag.svg"
                alt="Phone icon"
                className="h-10"
                width={22}
                height={20}
                style={{ width: 22, height: 20 }}
              ></Image>
              <span>VN</span>
              <Image
                src="/icon/chevron-down.svg"
                alt="Phone icon"
                className="h-10"
                width={22}
                height={20}
              ></Image>
            </button>
          </div>

          <a
            href="tel:0983-488-937"
            className="flex lg:max-h-10 items-center space-x-2 border border-white px-3 py-2 rounded-3xl hover:bg-blue-600"
          >
            <Image
              src="/icon/phone.svg"
              alt="Phone icon"
              className="h-10"
              width={20}
              height={20}
              style={{ width: 20, height: 20 }}
            ></Image>
            <span>0983-488-937</span>
          </a>
          <a
            className={`bg-[#1570EF] lg:max-h-10 hover:bg-white cursor-pointer flex items-center space-x-2 py-2 px-4 rounded-3xl outline-none ${styles.text_hover_default}`}
          >
            <span>Đăng nhập</span>
          </a>
          {/* Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Image
              src={menuIcon}
              alt="Menu icon"
              className="h-10"
              width={30}
              height={40}
            ></Image>
          </button>
          {/* </div> */}
        </div>
        {/* Bottom Navigation */}
        <div className="mx-auto relative lg:px-[50px] xl:px-[80px] sm:px-3">
          <nav className="flex h-[26px] space-x-3">
            <a
              href="#"
              className="hover:border-b-[3px] hover:border-[#F27145] px-[18px]"
            >
              Tours
            </a>
            <a
              href="#"
              className="hover:border-b-[3px] hover:border-[#F27145] px-[18px]"
            >
              Vé máy bay
            </a>
            <a
              href="#"
              className="hover:border-b-[3px] hover:border-[#F27145] px-[18px] "
            >
              Visa
            </a>
            <a
              href="#"
              className="hover:border-b-[3px] hover:border-[#F27145] px-[18px]"
            >
              Định cư
            </a>
            <a
              href="#"
              className="hover:border-b-[3px] hover:border-[#F27145] px-[18px]"
            >
              Khách sạn
            </a>
            <a
              href="#"
              className="hover:border-b-[3px] hover:border-[#F27145] ml-3 px-[18px]"
            >
              Khác
            </a>
          </nav>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="relative z-1 bg-blue-800">
          <nav className="flex flex-col py-2 space-y-2 absolute right-0 w-[210px] h-[228px] bg-white text-black px-4 rounded-sm">
            <a href="#" className={styles.text_hover_default}>
              Đăng ký CTV
            </a>
            <a href="#" className={styles.text_hover_default}>
              Tư vấn visa
            </a>
            <a href="#" className={styles.text_hover_default}>
              Hướng dẫn thanh toán
            </a>
            <a href="#" className={styles.text_hover_default}>
              Hướng dẫn đặt vé
            </a>
            <a href="#" className={styles.text_hover_default}>
              Thông tin chuyển khoản
            </a>
            <a href="#" className={styles.text_hover_default}>
              Điều khoản sử dụng
            </a>
          </nav>
        </div>
      )}
      <div className="lg:px-[50px] xl:px-[80px] sm:px-3">
        <Search />
      </div>
    </header>
  );
}
