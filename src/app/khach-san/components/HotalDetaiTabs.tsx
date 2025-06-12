"use client";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { formatCurrency } from "@/lib/formatters";
import { renderTextContent } from "@/utils/Helper";
import { translateText } from "@/utils/translateApi";
import { translatePage } from "@/utils/translateDom";
import { isEmpty } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, Fragment } from "react";
import "@/styles/ckeditor-content.scss";
import DisplayContentEditor from "@/components/base/DisplayContentEditor";

export default function HotelDetailTabs({ data }: any) {
  const [activeTab, setActiveTab] = useState(0);
  const [currentTabWidth, setCurrentTabWidth] = useState(0);
  const [translatedContent, setTranslatedContent] = useState<any>([]);
  const [translatedText, setTranslatedText] = useState<boolean>(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    translateText(
      [
        renderTextContent(data?.hotel?.about),
        renderTextContent(data?.hotel?.reside_information),
        renderTextContent(data.hotel.policy),
        renderTextContent(data?.hotel?.information),
      ],
      language
    ).then((data) => setTranslatedContent(data));
  }, [data, language]);

  useEffect(() => {
    setTranslatedText(false);
    if (tabRefs.current[activeTab]) {
      setCurrentTabWidth(tabRefs.current[activeTab].offsetWidth);
    }
    translatePage(`#hotel-content-tab-${activeTab}`).then(() =>
      setTranslatedText(true)
    );
  }, [activeTab]);

  return (
    <div className="w-full mt-6 pb-12">
      <div
        className="grid grid-cols-2 md:flex md:flex-wrap md:justify-between mb-4 bg-white p-3 rounded-xl relative"
        ref={tabContainerRef}
      >
        {[
          "Tổng quan",
          "Phòng",
          "Địa điểm",
          "Tiện nghi, dịch vụ",
          "Chính sách",
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
      <div
        id="hotel-content-tab-0"
        className={`w-full transition-opacity duration-700 ${
          activeTab === 0 ? "block" : "hidden"
        }  `}
      >
        <div className="bg-white rounded-2xl p-6">
          <h2
            className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
            data-translate="true"
          >
            Tổng quan
          </h2>
          <h3 className="mt-4 text-22 font-semibold" data-translate="true">
            {renderTextContent(data.name)}
          </h3>
          <div className="mt-3">
            <DisplayContentEditor content={translatedContent[0]} />
          </div>
          {/* <div className="w-full mt-4 text-center">
              <button className="py-3 px-12  text-[#175CD3] font-medium bg-blue-50 rounded-lg">
                Xem thêm
              </button>
            </div> */}
        </div>
      </div>

      <div
        id="hotel-content-tab-1"
        className={`${activeTab === 1 ? "block" : "hidden"}`}
      >
        <div>
          <h2
            className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
            data-translate="true"
          >
            Phòng
          </h2>
        </div>
        <div className="rounded-2xl mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.hotel.rooms.length > 0 ? (
            data.hotel.rooms.map((item: any, index: number) => (
              <div key={index} className="bg-white rounded-xl">
                <div className="p-3 flex flex-col justify-between h-full">
                  <div className="flex-grow">
                    <div className="block overflow-hidden rounded-xl">
                      <Image
                        className="cursor-pointer rounded-lg hover:scale-110 ease-in duration-300"
                        src={
                          item.image_location
                            ? `${data.image_url}/${item.image_location}`
                            : "/default-image.png"
                        }
                        alt="Image"
                        width={416}
                        height={256}
                        style={{ height: 275, width: "100%" }}
                      />
                    </div>
                    <Link
                      href="#"
                      className="mt-2 text-18 font-semibold line-clamp-3 text__default_hover"
                    >
                      <h3 data-translate="true">
                        {renderTextContent(item.name)}
                      </h3>
                    </Link>
                    <div
                      className="mt-3 p-2 rounded-lg bg-gray-100"
                      data-translate="true"
                    >
                      {renderTextContent(item.description)}
                    </div>
                  </div>
                  <div>
                    <div className="mt-4 text-right">
                      <div className="text-gray-500 h-6 text-sm">
                        {item.discount_price > 0 && (
                          <div>
                            <span data-translate="true">Giảm giá: </span>
                            <span>{formatCurrency(item.discount_price)}</span>
                          </div>
                        )}
                      </div>
                      <p>
                        <span className="text-gray-500" data-translate="true">
                          Tổng:
                        </span>{" "}
                        <span className="mt-2 text-22 font-semibold text-primary">
                          {formatCurrency(item.price - item.discount_price)}
                        </span>
                      </p>
                      <p
                        className="mt-2 text-sm text-gray-500"
                        data-translate="true"
                      >
                        bao gồm thuế phí
                      </p>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/khach-san/dat-phong/${data.slug}/${item.id}`}
                        className="bg-gray-50 text__default_hover py-3 border border-gray-300 rounded-lg inline-flex w-full items-center"
                      >
                        <button
                          className="mx-auto text-base font-medium"
                          data-translate="true"
                        >
                          Đặt phòng
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-18 font-medium" data-translate="true">
              Nội dung đang cập nhật...
            </div>
          )}
        </div>
      </div>

      <div
        id="hotel-content-tab-2"
        className={`${activeTab === 2 ? "block" : "hidden"}`}
      >
        <div className="bg-white p-6 rounded-2xl">
          <h2
            className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
            data-translate="true"
          >
            Địa điểm
          </h2>
          <div className="mt-4 flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="font-bold text-2xl" data-translate="true">
                {renderTextContent(data?.name)}
              </h3>
              <div className="flex space-x-2 items-center mt-3">
                <Image
                  className="w-4 h-4"
                  src="/icon/marker-pin-01.svg"
                  alt="Icon"
                  width={18}
                  height={18}
                />
                <span className="text-sm" data-translate="true">
                  {renderTextContent(data?.hotel?.address)}
                </span>
              </div>
            </div>
            <div className="flex mt-3 md:mt-0 space-x-1">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-[18px] rounded-tr bg-primary text-white font-semibold">
                {data.hotel.rating ?? 0}
              </span>

              <div className="flex flex-col space-y-1">
                {/* <span
                  className="text-primary text-sm font-semibold"
                  data-translate="true"
                >
                  {data.hotel.rating_text ?? ""}
                </span> */}

                <span className="text-gray-500 text-xs" data-translate="true">
                  {data.hotel.review ?? 0} đánh giá
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-18 font-semibold" data-translate="true">
              Tiện nghi khách sạn
            </p>
            <ul
              className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 list-disc pl-4 leading-6"
              key=""
            >
              {data.hotel.amenities.length > 0 ? (
                data.hotel.amenities.map((item: any) => {
                  if (!isEmpty(item?.hotel_amenity?.name))
                    return (
                      <li key={item.hotel_amenity.id} data-translate="true">
                        {item.hotel_amenity.name}
                      </li>
                    );
                })
              ) : (
                <div className="text-18" data-translate="true">
                  Nội dung đang cập nhật...
                </div>
              )}
            </ul>
          </div>
        </div>
        {data.hotel.reside_information && (
          <div className="w-full mt-6">
            <div className="bg-white rounded-2xl p-6">
              <h2
                className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
                data-translate="true"
              >
                Thông tin về nơi lưu trú này
              </h2>
              <div className="mt-4">
                <DisplayContentEditor content={translatedContent[1]} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        id="hotel-content-tab-3"
        className={`w-full ${activeTab === 3 ? "block" : "hidden"}`}
      >
        <div className="bg-white rounded-2xl p-6">
          <h2
            className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
            data-translate="true"
          >
            Tiện nghi, dịch vụ
          </h2>
          {data.hotel.amenity_service.length > 0 ? (
            <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 list-disc pl-4 leading-6">
              {data.hotel.amenity_service.map((item: any) => {
                if (!isEmpty(item?.hotel_amenity_service?.name))
                  return (
                    <li key={item.id} data-translate="true">
                      {item.hotel_amenity_service.name}
                    </li>
                  );
              })}
            </ul>
          ) : (
            <div className="text-18" data-translate="true">
              Nội dung đang cập nhật...
            </div>
          )}
        </div>
      </div>

      <div
        id="hotel-content-tab-4"
        className={`w-full ${activeTab === 4 ? "block" : "hidden"}`}
      >
        <div className="w-full">
          <div className="bg-white rounded-2xl p-6">
            <h2
              className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
              data-translate="true"
            >
              Chính sách
            </h2>
            <div className="mt-4">
              <DisplayContentEditor content={translatedContent[2]} />
            </div>
          </div>
        </div>
        {data.hotel.information && (
          <div className="w-full mt-6">
            <div className="bg-white rounded-2xl p-6">
              <h2
                className="pl-2 border-l-4 border-[#F27145] text-22 font-bold"
                data-translate="true"
              >
                Thông tin quan trọng
              </h2>
              <div className=" mt-4">
                <DisplayContentEditor content={translatedContent[3]} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
