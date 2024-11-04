"use client";
import { useState } from "react";

interface DropdownProps {
  id: number;
  question: string;
  answer: string;
}

const dropdowns: DropdownProps[] = [
  {
    id: 1,
    question: "Làm thế nào để đặt vé máy bay trên HappyBook?",
    answer:
      "Có, bạn có thể hủy hoặc thay đổi chuyến bay sau khi đã đặt, tuy nhiên điều này phụ thuộc vào điều kiện vé của từng hãng hàng không và thời gian bạn yêu cầu. Vui lòng liên hệ với đội ngũ hỗ trợ của HappyBook để được tư vấn chi tiết về các khoản phí và thủ tục liên quan.",
  },
  {
    id: 2,
    question: "Tôi có thể hủy hoặc thay đổi chuyến bay sau khi đã đặt không?",
    answer:
      "Có, bạn có thể hủy hoặc thay đổi chuyến bay sau khi đã đặt, tuy nhiên điều này phụ thuộc vào điều kiện vé của từng hãng hàng không và thời gian bạn yêu cầu. Vui lòng liên hệ với đội ngũ hỗ trợ của HappyBook để được tư vấn chi tiết về các khoản phí và thủ tục liên quan.",
  },
  {
    id: 3,
    question: "Chính sách hoàn tiền của HappyBook là gì?",
    answer:
      "Có, bạn có thể hủy hoặc thay đổi chuyến bay sau khi đã đặt, tuy nhiên điều này phụ thuộc vào điều kiện vé của từng hãng hàng không và thời gian bạn yêu cầu. Vui lòng liên hệ với đội ngũ hỗ trợ của HappyBook để được tư vấn chi tiết về các khoản phí và thủ tục liên quan.",
  },
  {
    id: 4,
    question: "Phương thức thanh toán nào được chấp nhận?",
    answer:
      "Có, bạn có thể hủy hoặc thay đổi chuyến bay sau khi đã đặt, tuy nhiên điều này phụ thuộc vào điều kiện vé của từng hãng hàng không và thời gian bạn yêu cầu. Vui lòng liên hệ với đội ngũ hỗ trợ của HappyBook để được tư vấn chi tiết về các khoản phí và thủ tục liên quan.",
  },
  {
    id: 5,
    question: "Làm thế nào để đặt vé máy bay trên HappyBook?",
    answer:
      "Có, bạn có thể hủy hoặc thay đổi chuyến bay sau khi đã đặt, tuy nhiên điều này phụ thuộc vào điều kiện vé của từng hãng hàng không và thời gian bạn yêu cầu. Vui lòng liên hệ với đội ngũ hỗ trợ của HappyBook để được tư vấn chi tiết về các khoản phí và thủ tục liên quan.",
  },
  {
    id: 6,
    question: "HappyBook có hỗ trợ làm visa không?",
    answer:
      "Có, bạn có thể hủy hoặc thay đổi chuyến bay sau khi đã đặt, tuy nhiên điều này phụ thuộc vào điều kiện vé của từng hãng hàng không và thời gian bạn yêu cầu. Vui lòng liên hệ với đội ngũ hỗ trợ của HappyBook để được tư vấn chi tiết về các khoản phí và thủ tục liên quan.",
  },
];
export default function FAQ() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div className="rounded-2xl bg-gray-50 p-8">
      <h2 className="text-32 font-bold mb-10">Câu Hỏi Thường Gặp</h2>
      {dropdowns.map((item) => (
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
          >
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  );
}
