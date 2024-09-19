"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const TableOfContents = () => {
  const [isOpen, setIsOpen] = useState(true);
  const icon = isOpen ? "close" : "menu-mb";
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.style.scrollBehavior = "smooth";
    return () => {
      htmlElement.style.scrollBehavior = "";
    };
  }, []);
  return (
    <div
      className={`px-6 py-3 overflow-hidden mt-8 border-l-4 h-auto border-[#F27145] bg-gray-50 rounded-r-xl lg:w-[520px] transition-all duration-700 ease-in-out 
        ${isOpen ? "max-h-96" : "max-h-12"}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mục lục</h2>
        <div className="relative w-5 h-5">
          <Image
            onClick={toggleMenu}
            className={`ease-in duration-300 cursor-pointer h-5 absolute top-0  ${
              isOpen ? "opacity-100 transform rotate-0" : "opacity-0 scale-0"
            }`}
            src={`/icon/menu-mb.svg`}
            alt="Icon"
            width={20}
            height={20}
          />
          <div
            onClick={toggleMenu}
            className={`ease-in duration-300 cursor-pointer absolute top-0 ${
              !isOpen ? "opacity-100 transform rotate-0" : "opacity-0 scale-0"
            }`}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="#101828"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <ul className="space-y-3 list-decimal px-6">
        <li className="pl-2">
          <Link
            href="#visa-tham-than-duc-la-gi"
            className="text-gray-900 text-base"
          >
            Visa thăm thân Đức là gì?
          </Link>
          <ul>
            <li className="mt-3">
              <Link href="#visa-tham-than-duc-co-thoi-han-bao-lau">
                1.1 Visa thăm thân Đức có thời hạn bao lâu?
              </Link>
            </li>
          </ul>
        </li>
        <li className="pl-2">
          <Link
            href="#thu-tuc-xin-visa-di-duc-tham-than"
            className="text-gray-900 text-base"
          >
            Thủ tục xin visa đi Đức thăm thân
          </Link>
        </li>
        <li className="pl-2">
          <a href="#" className="text-gray-900 text-base">
            Liên hệ làm visa Đức tại Happy Book qua
          </a>
        </li>
      </ul>
    </div>
  );
};

export default TableOfContents;
