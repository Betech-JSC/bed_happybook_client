"use client";
import { smoothScrollTo } from "@/utils/Helper";
import { isEmpty } from "lodash";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  toc: string;
};
const TableOfContents = ({ toc }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const icon = isOpen ? "close" : "menu-mb";
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const tocContainer = document.getElementById("toc-content-wrapper");
    if (!tocContainer) return;

    const offset = 140;
    const links = tocContainer.querySelectorAll("a[href^='#']");
    const handleClick = (e: Event) => {
      e.preventDefault();
      const targetId = (e.currentTarget as HTMLAnchorElement)
        .getAttribute("href")
        ?.substring(1);
      if (!targetId) return;
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const topPos =
          targetElement.getBoundingClientRect().top + window.scrollY - offset;
        smoothScrollTo(topPos, 1000);
      }
    };

    links.forEach((link) => link.addEventListener("click", handleClick));

    return () => {
      links.forEach((link) => link.removeEventListener("click", handleClick));
    };
  }, []);
  return (
    <div
      className={`px-6 py-3 overflow-hidden my-8 border-l-4 h-auto border-[#F27145] bg-gray-50 rounded-r-xl lg:w-[520px] transition-all duration-700 ease-in-out 
        ${isOpen ? "max-h-[3000px]" : "max-h-12"}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold" data-translate>
          Mục lục
        </h3>
        <div className="relative w-5 h-5">
          <Image
            onClick={toggleMenu}
            className={`ease-in duration-300 cursor-pointer h-5 absolute top-0  ${
              !isOpen ? "opacity-100 transform rotate-0" : "opacity-0 scale-0"
            }`}
            src={`/icon/menu-mb.svg`}
            alt="Icon"
            width={20}
            height={20}
          />
          <div
            onClick={toggleMenu}
            className={`ease-in duration-300 cursor-pointer absolute top-0 ${
              isOpen ? "opacity-100 transform rotate-0" : "opacity-0 scale-0"
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
      {!isEmpty(toc) && (
        <div
          id="toc-content-wrapper"
          dangerouslySetInnerHTML={{
            __html: toc,
          }}
        ></div>
      )}
    </div>
  );
};

export default TableOfContents;
