"use client";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, Fragment } from "react";

export default function HotelDetailTabs({ data }: any) {
  const [activeTab, setActiveTab] = useState(0);
  const [currentTabWidth, setCurrentTabWidth] = useState(0);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  console.log(data);
  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      setCurrentTabWidth(tabRefs.current[activeTab].offsetWidth);
    }
  }, [activeTab]);

  return (
    <div className="w-full mt-6 pb-12">
      <div
        className="flex flex-wrap md:justify-between mb-4 bg-white p-3 rounded-xl relative"
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
      <div className={`w-full ${activeTab === 0 ? "block" : "hidden"}`}>
        <div className="bg-white rounded-2xl p-6">
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Tổng quan
          </h2>
          <h3 className="mt-4 text-22 font-semibold">{data.name ?? ""}</h3>
          <div
            className="mt-3 leading-6"
            dangerouslySetInnerHTML={{
              __html: data.hotel.about ?? "Nội dung đang cập nhật",
            }}
          ></div>

          {/* <div className="w-full mt-4 text-center">
              <button className="py-3 px-12  text-[#175CD3] font-medium bg-blue-50 rounded-lg">
                Xem thêm
              </button>
            </div> */}
        </div>
      </div>

      <div className={`${activeTab === 1 ? "block" : "hidden"}`}>
        <div>
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Phòng
          </h2>
        </div>
        <div className="rounded-2xl mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.hotel.rooms.length > 0 ? (
            data.hotel.rooms.map((item: any, index: number) => (
              <div key={index} className="bg-white rounded-xl">
                <div className="p-3 flex flex-col justify-between h-full">
                  <div className="flex-grow">
                    <Link href="#" className="block overflow-hidden rounded-xl">
                      <Image
                        className="cursor-pointer rounded-lg hover:scale-110 ease-in duration-300"
                        src={`${data.image_url}/${item.image_location}`}
                        alt="Image"
                        width={416}
                        height={256}
                        style={{ height: 275, width: "100%" }}
                      />
                    </Link>
                    <Link
                      href="#"
                      className="mt-2 text-18 font-semibold line-clamp-3 text__default_hover"
                    >
                      <h3>{item.name}</h3>
                    </Link>
                    {item.description && (
                      <div className="mt-3 p-2 rounded-lg bg-gray-100">
                        {item.description}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="mt-4 text-right">
                      <p className="text-gray-500">
                        {formatCurrency(item.discount_price)}
                      </p>
                      <p>
                        <span className="text-gray-500">Tổng:</span>{" "}
                        <span className="mt-2 text-22 font-semibold text-primary">
                          {formatCurrency(item.price)}
                        </span>
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        bao gồm thuế phí
                      </p>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/khach-san/dat-phong/${data.slug}/${item.id}`}
                        className="bg-gray-50 text__default_hover py-3 border border-gray-300 rounded-lg inline-flex w-full items-center"
                      >
                        <button className="mx-auto text-base font-medium">
                          Yêu cầu đặt
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-18 font-medium">Nội dung đang cập nhật...</div>
          )}
        </div>
      </div>

      <div className={`${activeTab === 2 ? "block" : "hidden"}`}>
        <div className="bg-white p-6 rounded-2xl">
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Địa điểm
          </h2>
          <div className="mt-4 flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="font-bold text-2xl">{data.name}</h3>
              <div className="flex space-x-2 items-center mt-3">
                <Image
                  className="w-4 h-4"
                  src="/icon/marker-pin-01.svg"
                  alt="Icon"
                  width={18}
                  height={18}
                />
                <span className="text-sm">{data.hotel.address}</span>
              </div>
            </div>
            <div className="flex mt-3 md:mt-0 space-x-1">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-[18px] rounded-tr bg-primary text-white font-semibold">
                {data.hotel.rating ?? 0}
              </span>

              <div className="flex flex-col space-y-1">
                <span className="text-primary text-sm font-semibold">
                  {data.hotel.rating_text ?? ""}
                </span>

                <span className="text-gray-500 text-xs">
                  {data.hotel.review ?? 0} đánh giá
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-18 font-semibold">Tiện nghi dịch vụ</p>
            <ul
              className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 list-disc pl-4 leading-6"
              key=""
            >
              {data.hotel.amenities.length > 0 ? (
                data.hotel.amenities.map((item: any) => (
                  <li key={item.hotel_amenity.id}>{item.hotel_amenity.name}</li>
                ))
              ) : (
                <div className="text-18">Nội dung đang cập nhật...</div>
              )}
            </ul>
          </div>
        </div>
        {data.hotel.reside_information && (
          <div className="w-full mt-6">
            <div className="bg-white rounded-2xl p-6">
              <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
                Thông tin về nơi lưu trú này
              </h2>
              <div
                className="mt-4 leading-6"
                dangerouslySetInnerHTML={{
                  __html: data.hotel.reside_information,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className={`w-full ${activeTab === 3 ? "block" : "hidden"}`}>
        <div className="bg-white rounded-2xl p-6">
          <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Tiện nghi, dịch vụ
          </h2>
          {data.hotel.amenity_service.length > 0 ? (
            <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 list-disc pl-4 leading-6">
              {data.hotel.amenity_service.map((item: any) => (
                <li key={item.id}>{item.hotel_amenity_service.name}</li>
              ))}
            </ul>
          ) : (
            <div className="text-18">Nội dung đang cập nhật...</div>
          )}

          {/* <div className="w-full mt-4 text-center">
                <button className="py-3 px-12  text-[#175CD3] font-medium bg-blue-50 rounded-lg">
                  Xem thêm
                </button>
              </div> */}
        </div>
      </div>

      <div className={`w-full ${activeTab === 4 ? "block" : "hidden"}`}>
        <div className="w-full">
          <div className="bg-white rounded-2xl p-6">
            <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
              Chính sách
            </h2>
            <div
              className="mt-4 leading-6"
              dangerouslySetInnerHTML={{
                __html: data.hotel.policy ?? "Nội dung đang cập nhật",
              }}
            ></div>
          </div>
        </div>
        {data.hotel.information && (
          <div className="w-full mt-6">
            <div className="bg-white rounded-2xl p-6">
              <h2 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
                Thông tin quan trọng
              </h2>
              <div
                className="mt-4 leading-6"
                dangerouslySetInnerHTML={{
                  __html: data.hotel.information,
                }}
              ></div>
              {/* <p className="text-18 font-semibold mt-4">Tùy chọn</p>
              <ul className="mt-2 list-disc  pl-4">
                <li className="mt-2">
                  Phụ phí bữa sáng buffet (ước tính): người lớn - 57 USD; trẻ em
                  - 29 USD
                </li>
                <li className="mt-2">
                  Phí dịch vụ xe đưa đón sân bay: 171 USD mỗi xe (một chiều, số
                  khách tối đa 3)
                </li>
                <li className="mt-2">
                  Phí dịch vụ xe đưa đón sân bay / 1 trẻ: 171 USD
                </li>
                <li className="mt-2">Phí giường gấp: 155.0 USD mỗi đêm</li>
              </ul>
              <p className="mt-2">
                Danh sách trên có thể không đầy đủ. Phí và đặt cọc có thể không
                bao gồm thuế và có thể thay đổi.
              </p>
              <p className="text-18 font-semibold mt-4">Cần biết</p>
              <ul className="mt-2 list-disc  pl-4">
                <li className="mt-2">
                  Có thể thu phí thêm người với mức phí khác nhau, tùy chính
                  sách riêng
                </li>
                <li className="mt-2">
                  Có thể cần giấy tờ tùy thân hợp pháp có ảnh và cần đặt cọc
                  bằng thẻ tín dụng, thẻ ghi nợ hoặc tiền mặt (cho các chi phí
                  phát sinh - nếu có) khi làm thủ tục nhận phòng
                </li>
                <li className="mt-2">
                  Tùy thuộc vào tình hình thực tế khi nhận phòng mà các yêu cầu
                  đặc biệt có được đáp ứng hay không và có thể thu phụ phí.
                  Không đảm bảo đáp ứng mọi yêu cầu đặc biệt
                </li>
                <li className="mt-2">
                  Tên trên thẻ tín dụng sử dụng khi nhận phòng để trả cho các
                  khoản phí phát sinh phải trùng tên với khách lưu trú chính
                  trong đặt phòng
                </li>
                <li className="mt-2">
                  Nơi lưu trú này nhận thanh toán bằng thẻ tín dụng, thẻ ghi nợ
                  và tiền mặt
                </li>
                <li className="mt-2">
                  Hệ thống an toàn tại nơi lưu trú gồm bình cứu hỏa, hệ thống an
                  ninh, hộp sơ cứu và thanh chắn cửa sổ
                </li>
                <li className="mt-2">
                  Nơi lưu trú xác nhận đang áp dụng biện pháp vệ sinh và khử
                  trùng theo quy định của ALLSAFE (Accor Hotels).
                </li>
                <li className="mt-2">
                  Vui lòng lưu ý các chuẩn mực về văn hóa và chính sách khách có
                  thể khác nhau theo từng quốc gia và nơi lưu trú. Thông tin về
                  chính sách do nơi lưu trú cung cấp.
                </li>
              </ul>
              <p className="text-18 font-semibold mt-4">Lưu ý</p>
              <ul className="mt-2 list-disc  pl-4">
                <li className="mt-2">Giờ sử dụng hồ bơi: 6:00 đến 21:30.</li>
                <li className="mt-2">
                  Cần đặt trước dịch vụ massage và dịch vụ spa. Vui lòng liên hệ
                  khách sạn qua các phương thức liên lạc được cung cấp trong xác
                  nhận đặt phòng trước khi đến để đặt các dịch vụ này.
                </li>
                <li className="mt-2">
                  1 trẻ 11 tuổi trở xuống được ở miễn phí cùng cha mẹ hoặc người
                  giám hộ nếu sử dụng giường có sẵn.
                </li>
                <li className="mt-2">
                  Có phòng thông nhau - có thể đáp ứng tùy thuộc tình trạng
                  phòng thực tế - khách có thể liên hệ trực tiếp qua thông tin
                  được cung cấp trong xác nhận đặt phòng để yêu cầu.
                </li>
                <li className="mt-2">
                  Khách không được phép mang vật nuôi, bao gồm cả vật nuôi hỗ
                  trợ người khuyết tật, vào nơi lưu trú này.
                </li>
                <li className="mt-2">
                  Khách nên có xe hơi để đến và rời khỏi nơi lưu trú này.
                </li>
                <li className="mt-2">
                  Có nhận phòng không tiếp xúc và trả phòng không tiếp xúc.
                </li>
                <li className="mt-2">
                  Nơi lưu trú này chào đón khách thuộc mọi xu hướng tính dục và
                  nhận dạng giới (thân thiện với cộng đồng LGBTQ+).
                </li>
              </ul> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
