"use client";

import Image from "next/image";
import { useState } from "react";
import SearchMobile from "./search-mobile";

export default function HeaderMobile() {
  const [isMenuMbOpen, setIsMenuMbOpen] = useState(false);
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
        <div>
          {/* Menu Button */}
          <button onClick={() => setIsMenuMbOpen(!isMenuMbOpen)}>
            <Image
              src={menuIcon}
              alt="Menu icon"
              width={20}
              height={20}
            ></Image>
          </button>
        </div>
      </div>
      <div className="mt-[68px]">
        <SearchMobile />
      </div>
      {/* Mobile Menu */}
      {isMenuMbOpen && (
        <div className="fixed inset-[-1px] flex items-center justify-center z-50 top-[69px] b">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white text-black overflow-scroll p-3 shadow-lg z-10 w-full h-full">
            <div>
              <p>
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
              <p className="mt-3 hover:text-[#F27145] cursor-pointer">
                Định cư
              </p>
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
              <p className="mt-3 hover:text-[#F27145] cursor-pointer">
                Tin tức
              </p>
              <p className="mt-3 hover:text-[#F27145] cursor-pointer">
                Liên hệ chúng tôi
              </p>
              <p className="mt-3 hover:text-[#F27145] cursor-pointer">
                Đăng ký CTV
              </p>
            </div>
            <div className="mt-6">
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
      )}
    </div>
  );
}
