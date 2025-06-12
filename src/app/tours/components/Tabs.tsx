"use client";
import { useState, useRef, useEffect } from "react";
import "swiper/css";
import { formatCurrency } from "@/lib/formatters";
import CustomerRating from "@/components/product/CustomerRating";
import { formatDate } from "@/lib/formatters";
import { isEmpty } from "lodash";
import { renderTextContent } from "@/utils/Helper";
import { decodeHtml } from "@/utils/Helper";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import DisplayContentEditor from "@/components/base/DisplayContentEditor";

export default function Tabs({ detail }: any) {
  const [activeTab, setActiveTab] = useState(0);
  const [currentTabWidth, setCurrentTabWidth] = useState(0);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(0);
  const [isExporting, setIsExporting] = useState(false);
  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      setCurrentTabWidth(tabRefs.current[activeTab].offsetWidth);
    }
  }, [activeTab]);

  const exportScheduleToPDF = async () => {
    setIsExporting(true);
    const doc = new jsPDF();

    // Font hỗ trợ tiếng Việt / Trung
    doc.addFont(
      "https://cdn.jsdelivr.net/npm/noto-sans-sc@1.0.1/NotoSansSC-Regular.otf",
      "NotoSansSC",
      "normal"
    );
    doc.setFont("NotoSansSC");

    // Tạo headerDiv cho tiêu đề chính
    const headerDiv = document.createElement("div");
    headerDiv.innerHTML = "<strong>Lịch trình tour</strong>";
    Object.assign(headerDiv.style, {
      padding: "10px",
      fontWeight: "bold",
      fontFamily: "'Roboto', 'Arial', 'Noto Sans', sans-serif",
      background: "#fff",
      fontSize: "42px",
      lineHeight: "1.2",
      color: "#F27145",
    });
    document.body.appendChild(headerDiv);

    try {
      const headerCanvas = await html2canvas(headerDiv, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#fff",
      });

      const headerImgData = headerCanvas.toDataURL("image/png");
      const headerImgWidth = 180;
      const headerImgHeight =
        (headerCanvas.height * headerImgWidth) / headerCanvas.width;

      doc.addImage(
        headerImgData,
        "PNG",
        20,
        20,
        headerImgWidth,
        headerImgHeight
      );
      let yPosition = 20 + headerImgHeight + 10;

      for (let i = 0; i < detail.schedule.length; i++) {
        const schedule = detail.schedule[i];

        // --- Tạo titleDiv ---
        const titleDiv = document.createElement("div");
        titleDiv.innerHTML = `<strong>${schedule.title}</strong>`;
        Object.assign(titleDiv.style, {
          padding: "10px 10px 18px 10px",
          fontWeight: "bold",
          fontFamily: "'Roboto', 'Arial', 'Noto Sans', sans-serif",
          background: "#fff",
          fontSize: "30px",
          lineHeight: "1.4",
        });
        document.body.appendChild(titleDiv);

        let titleImgHeight = 0;
        try {
          const titleCanvas = await html2canvas(titleDiv, {
            scale: 3,
            useCORS: true,
            backgroundColor: "#fff",
          });

          const titleImgData = titleCanvas.toDataURL("image/png");
          const titleImgWidth = 180;
          titleImgHeight =
            (titleCanvas.height * titleImgWidth) / titleCanvas.width;

          if (yPosition + titleImgHeight > 270) {
            doc.addPage();
            yPosition = 20;
          }

          doc.addImage(
            titleImgData,
            "PNG",
            20,
            yPosition,
            titleImgWidth,
            titleImgHeight
          );
          yPosition += titleImgHeight + 5;
        } finally {
          document.body.removeChild(titleDiv);
        }

        // --- Tạo contentDiv ---
        const contentDiv = document.createElement("div");
        contentDiv.innerHTML = renderTextContent(schedule.content);
        Object.assign(contentDiv.style, {
          padding: "10px",
          fontFamily: "'Roboto', 'Arial', 'Noto Sans', sans-serif",
          background: "#fff",
          color: "#000",
          fontSize: "32px",
          lineHeight: "1.4",
          margin: "0",
          textIndent: "0",
        });

        // Reset margin/padding cho các thẻ con
        ["p", "ul", "ol", "li", "blockquote"].forEach((tag) => {
          contentDiv.querySelectorAll(tag).forEach((el) => {
            (el as HTMLElement).style.margin = "0";
            (el as HTMLElement).style.padding = "0";
            (el as HTMLElement).style.textIndent = "0";
            (el as HTMLElement).style.listStylePosition = "inside";
          });
        });

        document.body.appendChild(contentDiv);

        try {
          const canvas = await html2canvas(contentDiv, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#fff",
          });

          const imgWidth = 180;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          const pageHeight = 270 - 20;
          let renderedHeight = 0;

          while (renderedHeight < imgHeight) {
            if (
              yPosition + Math.min(pageHeight, imgHeight - renderedHeight) >
              270
            ) {
              doc.addPage();
              yPosition = 20;
            }

            // Tạo canvas phụ để crop phần cần vẽ
            const cropHeight = Math.min(pageHeight, imgHeight - renderedHeight);
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = canvas.width;
            tempCanvas.height = (cropHeight * canvas.width) / imgWidth;
            const ctx = tempCanvas.getContext("2d");
            ctx?.drawImage(
              canvas,
              0,
              (renderedHeight * canvas.width) / imgWidth,
              canvas.width,
              tempCanvas.height,
              0,
              0,
              canvas.width,
              tempCanvas.height
            );
            const croppedImgData = tempCanvas.toDataURL("image/png");

            doc.addImage(
              croppedImgData,
              "PNG",
              20,
              yPosition,
              imgWidth,
              cropHeight
            );
            yPosition += cropHeight + 5;
            renderedHeight += cropHeight;
          }
        } finally {
          document.body.removeChild(contentDiv);
        }
      }

      doc.save("lich-trinh-tour.pdf");
    } finally {
      document.body.removeChild(headerDiv);
      setIsExporting(false);
    }
  };

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

          <div className="mt-4">
            <DisplayContentEditor content={detail?.overview} />
          </div>
        </div>

        <div
          className={`bg-white rounded-2xl p-6  ${
            activeTab === 1 ? "block" : "hidden"
          }`}
        >
          <div className="flex justify-between items-center mb-5">
            <h2
              className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
              data-translate
            >
              Lịch trình
            </h2>
            <button
              onClick={exportScheduleToPDF}
              disabled={isExporting}
              className={`flex items-center gap-2 px-4 py-2 bg-[#F27145] text-white rounded-lg border-2 border-transparent hover:border-[#F27145] hover:bg-[#F27145] transition-all
                ${isExporting ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              {isExporting ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 13.3333L10 3.33333M10 13.3333L6.66667 10M10 13.3333L13.3333 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.33333 16.6667H16.6667"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {isExporting ? "Đang xuất..." : "Xuất PDF"}
            </button>
          </div>
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
                >
                  <DisplayContentEditor content={schedule?.content} />
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
          <div className="mt-4">
            <div
              className="ckeditor_content_container"
              dangerouslySetInnerHTML={{
                __html: decodeHtml(
                  renderTextContent(detail?.service_regulation)
                ).replace(/ü/g, ""),
              }}
            ></div>
          </div>
          <div></div>
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
