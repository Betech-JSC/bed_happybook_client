"use client";
import { renderTextContent } from "@/utils/Helper";
import { useState } from "react";
import "@/styles/ckeditor-content.scss";

export default function Schedule({ schedule }: any) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(0);
  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };
  return (
    <div className={`bg-white rounded-2xl p-6`}>
      <h2
        className="pl-2 border-l-4 mb-5 border-[#F27145] text-22 font-bold"
        data-translate
      >
        Lịch trình
      </h2>
      {schedule.length > 0 ? (
        schedule.map((schedule: any, key: number) => (
          <div className={`border-l border-l-gray-300 pb-3`} key={key}>
            <div className="cursor-pointer" onClick={() => toggleDropdown(key)}>
              <div className="flex space-x-2 justify-between items-start">
                <div className="relative bottom-1">
                  <span
                    className={`absolute left-[-8px] top-1 bg-white  inline-block w-4 h-4 rounded-full border-2 ${
                      openDropdown === key
                        ? "border-[#F27145]"
                        : "border-[#4E6EB3]"
                    }`}
                  ></span>
                  <h3
                    className={`ml-5 font-18 font-semibold text-gray-900`}
                    data-translate
                  >
                    {schedule.title}
                  </h3>
                </div>
                <button
                  className={`duration-300 ${
                    openDropdown === key ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#175CD3"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="ckeditor_container">
              <div
                className={`ml-5 transition-[max-height] ease-in-out duration-500 overflow-hidden 
                    border-b border-b-gray-200 leading-6 pb-3
                    ${openDropdown === key ? "max-h-[5000px]" : "max-h-0"}`}
              >
                <div
                  className="cke_editable mt-2"
                  dangerouslySetInnerHTML={{
                    __html: renderTextContent(schedule?.content),
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="mt-4">
          <p className="text-base font-semibold" data-translate>
            Nội dung đang cập nhật....
          </p>
        </div>
      )}
    </div>
  );
}
