"use client";
import { useState, useRef, useEffect } from "react";
import "swiper/css";
import { formatCurrency } from "@/lib/formatters";
import CustomerRating from "@/components/product/CustomerRating";
import { formatDate } from "@/lib/formatters";
import { isEmpty } from "lodash";
import { renderTextContent } from "@/utils/Helper";

export default function Tabs({ detail }: any) {
  console.log(detail);
  const [activeTab, setActiveTab] = useState(0);
  const [currentTabWidth, setCurrentTabWidth] = useState(0);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(0);
  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      setCurrentTabWidth(tabRefs.current[activeTab].offsetWidth);
    }
  }, [activeTab]);
  return (
    <div className="w-full mt-6">
      <div
        className="flex flex-wrap md:justify-between mb-8 bg-white p-3 rounded-xl relative"
        ref={tabContainerRef}
      >
        {[
          "Tổng quan",
          "Lịch trình",
          "Bảng giá",
          "Quy định dịch vụ",
          "Đánh giá",
        ].map((tab, index) => (
          <button
            key={index}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            className={`px-3 md:px-5 py-[10px] duration-300 font-semibold text__default_hover  ${
              activeTab === index ? "text-primary" : ""
            }`}
            onClick={() => setActiveTab(index)}
            data-translate="true"
          >
            {tab}
          </button>
        ))}
        <div
          className="hidden md:block absolute bottom-3 left-0 h-0.5 bg-primary transition-transform duration-300"
          style={{
            width: `${currentTabWidth}px`,
            transform: `translateX(${tabRefs.current[activeTab]?.offsetLeft}px)`,
          }}
        ></div>
      </div>
      <div className="mt-4 transition-all duration-300">
        <div
          className={`bg-white rounded-2xl p-6 ${
            activeTab === 0 ? "block" : "hidden"
          }`}
        >
          <h2
            className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
            data-translate="true"
          >
            Tổng quan
          </h2>
          <div
            className="mt-4 text-base"
            dangerouslySetInnerHTML={{
              __html: renderTextContent(detail?.overview),
            }}
          ></div>
        </div>

        <div
          className={`bg-white rounded-2xl p-6  ${
            activeTab === 1 ? "block" : "hidden"
          } `}
        >
          <h2
            className="pl-2 border-l-4 mb-5 border-[#F27145] text-22 font-bold"
            data-translate
          >
            Lịch trình
          </h2>
          {detail.schedule.length > 0 ? (
            detail.schedule.map((schedule: any, key: number) => (
              <div className={`border-l border-l-gray-300 pb-3 `} key={key}>
                <div
                  className="cursor-pointer"
                  onClick={() => toggleDropdown(key)}
                >
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
                <div
                  className={`mt-3 ml-5 transition-[max-height] ease-in-out duration-500 overflow-hidden 
                      border-b border-b-gray-200 leading-6
                      ${
                        openDropdown === key ? "max-h-[5000px] pb-4" : "max-h-0"
                      }`}
                  dangerouslySetInnerHTML={{
                    __html: renderTextContent(schedule?.content),
                  }}
                ></div>
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

        <div
          className={`bg-white rounded-2xl p-6  ${
            activeTab === 2 ? "block" : "hidden"
          }`}
        >
          <h2
            className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
            data-translate
          >
            Bảng giá
          </h2>
          <div className="mt-4 overflow-auto">
            {detail.prices.length > 0 ? (
              <table className="w-max min-w-[700px] lg:min-w-[100%] text-left align-middle ">
                <tbody>
                  <tr className="bg-[#FEF8F5] text-primary">
                    <th
                      className="py-4 px-2 border border-gray-200"
                      data-translate
                    >
                      Ngày khởi hành
                    </th>
                    {/* <th
                      className="py-4 px-2  border border-gray-200"
                      data-translate
                    >
                      Mã Tour
                    </th> */}
                    <th
                      className="py-4 px-2  border border-gray-200"
                      data-translate
                    >
                      Giá người lớn
                    </th>
                    <th
                      className="py-4 px-2  border border-gray-200"
                      data-translate
                    >
                      Giá trẻ em
                    </th>
                    <th
                      className="py-4 px-2  border border-gray-200"
                      data-translate
                    >
                      Giá em bé
                    </th>
                  </tr>
                  {detail.prices.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="w-1/5 py-3 font-me px-[10px] border-[0.5px] border-gray-200">
                        {formatDate(detail.start_date)}
                      </td>
                      <td className="w-1/5 py-3 font-me px-[10px] border-[0.5px] border-gray-200">
                        {item.price_tour > 0
                          ? formatCurrency(item.price_tour)
                          : "Liên hệ"}
                      </td>
                      <td className="w-1/5 py-3 font-me px-[10px] border-[0.5px] border-gray-200">
                        {item.price_child > 0
                          ? formatCurrency(item.price_child)
                          : "Liên hệ"}
                      </td>
                      <td className="w-1/5 py-3 font-me px-[10px] border-[0.5px] border-gray-200">
                        {item.price_baby > 0
                          ? formatCurrency(item.price_baby)
                          : "Liên hệ"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-base" data-translate>
                Nội dung đang cập nhật....
              </p>
            )}
          </div>
        </div>

        <div
          className={`bg-white rounded-2xl p-6  ${
            activeTab === 3 ? "block" : "hidden"
          }`}
        >
          <h2
            className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
            data-translate
          >
            Quy định dịch vụ
          </h2>
          <div
            className="mt-4 text-base"
            dangerouslySetInnerHTML={{
              __html: renderTextContent(detail?.service_regulation),
            }}
          ></div>
        </div>
        <div
          className={`bg-white rounded-2xl p-6  ${
            activeTab === 4 ? "block" : "hidden"
          }`}
        >
          <CustomerRating
            product_id={detail.id}
            total_rating={detail.total_rating}
            average_rating={detail.average_rating}
            average_tour_guide_rating={detail.average_tour_guide_rating}
            average_route_rating={detail.average_route_rating}
            average_transportation_rating={detail.average_transportation_rating}
            average_price_rating={detail.average_price_rating}
          />
        </div>
      </div>
    </div>
  );
}
