"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

const TableOfContents = () => {
  // const [headings, setHeadings] = useState<Heading[]>([]);

  // useEffect(() => {
  //   const headingElements = Array.from(
  //     document.querySelectorAll(".post__detail_content h1, h2, h3, h4, h5, h6")
  //   );
  //   const headingList = headingElements.map((heading, index) => ({
  //     id: heading.id,
  //     text: heading.textContent || "",
  //     level: parseInt(heading.tagName.replace("H", ""), 10),
  //   }));
  //   setHeadings(headingList);
  // }, []);

  return (
    <div className="px-6 py-3 mt-8 border-l-4 border-[#F27145] bg-gray-50 rounded-r-xl lg:w-[520px] h-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mục lục</h2>
        <Image
          className="ease-in duration-300"
          src="/icon/menu-mb.svg"
          alt="Tin tức"
          width={18}
          height={12}
        />
      </div>
      <ul className="space-y-3 list-decimal px-6">
        <li className="pl-2">
          <a href="#" className="text-gray-900 text-base">
            Visa thăm thân Đức là gì?
          </a>
          <ul>
            <li className="mt-3">
              <a href="#">1.1 Visa thăm thân Đức có thời hạn bao lâu?</a>
            </li>
          </ul>
        </li>
        <li className="pl-2">
          <a href="#" className="text-gray-900 text-base">
            Thủ tục xin visa đi Đức thăm thân
          </a>
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
