"use client";
import { useEffect, useState } from "react";
import { FaqApi } from "@/api/Faq";
import FAQSchema from "../schema/FAQSchema";

export default function FAQ() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };
  const [data, setData] = useState<any[]>([]);
  const loadData = async () => {
    const faqData = (await FaqApi.list())?.payload?.data as any;
    setData(faqData);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data?.length) return;
  return (
    <FAQSchema data={data}>
      <div className="rounded-2xl bg-gray-50 p-8">
        <h2 className="text-32 font-bold mb-10">Câu Hỏi Thường Gặp</h2>
        {data.map((item) => (
          <div
            key={item.id}
            className="pb-4 mb-6 last-of-type:mb-0 last-of-type:pb-0 last-of-type:border-none border-b border-gray-200 cursor-pointer"
            onClick={() => toggleDropdown(item.id)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-18 font-semibold text-gray-900 max-w-[90%]">
                {item.question}
              </h3>
              <button
                className={`duration-300 ${
                  openDropdown === item.id ? "rotate-180" : "rotate-0"
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
            <div
              className={`mt-3 transition-[max-height] ease-in-out duration-500 overflow-hidden 
                ${openDropdown === item.id ? "max-h-screen" : "max-h-0"}`}
              dangerouslySetInnerHTML={{
                __html: item.answer,
              }}
            ></div>
          </div>
        ))}
      </div>
    </FAQSchema>
  );
}
