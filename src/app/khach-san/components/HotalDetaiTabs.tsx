"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, Fragment } from "react";
const rooms = [
  {
    id: 1,
    title: "Phòng Cao cấp, 1 giường cỡ queen (Heritage Wing)",
    price: "40.217.611 ₫",
    originalPrice: "11.693.130 ₫",
  },
  {
    id: 2,
    title:
      "Phòng 2 giường đơn Grand, 2 giường đơn, quyền sử dụng Business Lounge (Opera Wing)",
    price: "40.217.611 ₫",
    originalPrice: "11.693.130 ₫",
  },
  {
    id: 3,
    title: "Grand Luxury King Room, Club Metropole Access, Heritage Wing",
    price: "40.217.611 ₫",
    originalPrice: "11.693.130 ₫",
  },
  {
    id: 4,
    title: "Grand Luxury King Room, Club Metropole Access, Heritage Wing",
    price: "40.217.611 ₫",
    originalPrice: "11.693.130 ₫",
  },
  {
    id: 5,
    title: "Grand Luxury King Room, Club Metropole Access, Heritage Wing",
    price: "40.217.611 ₫",
    originalPrice: "11.693.130 ₫",
  },
  {
    id: 6,
    title: "Grand Luxury King Room, Club Metropole Access, Heritage Wing",
    price: "40.217.611 ₫",
    originalPrice: "11.693.130 ₫",
  },
];

export default function HotelDetailTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentTabWidth, setCurrentTabWidth] = useState(0);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
      {activeTab === 0 && (
        <div className="w-full mt-4">
          <div className="bg-white rounded-2xl p-6">
            <h3 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
              Thông tin về nơi lưu trú này
            </h3>
            <p className="mt-4 text-22 font-semibold">
              Sofitel Legend Metropole Hà Nội
            </p>
            <p className="mt-2">Gần Tràng Tiền Plaza</p>
            <div className="mt-3 line-clamp-5">
              Gần Tràng Tiền Plaza Hãy để mình được chăm sóc thật đặc biệt với
              các dịch vụ massage, trị liệu toàn thân chăm sóc da mặt ngay trong
              khuôn viên. Đừng bỏ qua cơ hội tận hưởng những dịch vụ, tiện nghi
              thể thao, giải trí như hộp đêm, câu lạc bộ sức khỏe hay hồ bơi
              ngoài trời. Các tiện ích, dịch vụ khác tại Khách sạn phong cách
              kiến trúc Thuộc địa này bao gồm quyền truy cập Internet không dây
              miễn phí, dịch vụ tư vấn/hỗ trợ khách và dịch vụ trông trẻ (phụ
              phí). Hãy tự thưởng cho mình những ngày nghỉ tại một trong 364
              phòng được trang bị lò sưởi. Giường nệm có lớp đệm bông đi cùng
              chăn bông và bộ đồ giường cao cấp
            </div>

            <div className="w-full mt-4 text-center">
              <button className="py-3 px-12  text-[#175CD3] font-medium bg-blue-50 rounded-lg">
                Xem thêm
              </button>
            </div>
          </div>
        </div>
      )}
      {activeTab === 1 && (
        <Fragment>
          <div className="rounded-2xl mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {rooms.map((item, index) => (
              <div key={index} className="bg-white rounded-xl">
                <div className="p-3 flex flex-col justify-between h-full">
                  <div className="flex-grow">
                    <Link
                      href="/khach-san/chi-tiet/sofitel-legend-metropole-ha-noi"
                      className="block overflow-hidden rounded-xl"
                    >
                      <Image
                        className="cursor-pointer rounded-lg hover:scale-110 ease-in duration-300"
                        src={`/compo/detail/hotel/1.png`}
                        alt="Image"
                        width={416}
                        height={256}
                      />
                    </Link>
                    <Link
                      href="/khach-san/chi-tiet/sofitel-legend-metropole-ha-noi"
                      className="mt-2 text-18 font-semibold line-clamp-3 text__default_hover"
                    >
                      {item.title}
                    </Link>
                    <div className="mt-3 p-2 rounded-lg bg-gray-100">
                      <p className="">Bữa sáng miễn phí</p>
                      <p className="mt-3">Miễn phí WiFi</p>
                      <p className="mt-3">
                        Miễn phí bữa sáng buffet cho 1 người mỗi ngày
                      </p>
                      <p className="mt-3">32 mét vuông</p>
                      <p className="mt-3">2 khách</p>
                      <p className="mt-3">1 giường cỡ queen</p>
                      <p className="mt-3">
                        46 USD dùng thanh toán thức ăn và đồ uống mỗi phòng, mỗi
                        lần lưu trú
                      </p>
                      <p className="mt-3">
                        Nhận phòng sớm miễn phí (sớm 2 giờ)
                      </p>
                      <p className="mt-3">
                        Trả phòng muộn miễn phí (muộn 2 giờ)
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="mt-4 text-right">
                      <p className="text-gray-500">11.693.130 ₫</p>
                      <p>
                        <span className="text-gray-500">Tổng:</span>{" "}
                        <span className="mt-2 text-22 font-semibold text-primary">
                          40.217.611 ₫
                        </span>
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        bao gồm thuế phí
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="bg-gray-50 text__default_hover py-3 border border-gray-300 rounded-lg inline-flex w-full items-center">
                        <button className="mx-auto text-base font-medium">
                          Yêu cầu đặt
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Fragment>
      )}
      {activeTab === 2 && (
        <div className="bg-white p-6 rounded-2xl">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="font-bold text-2xl">
                Sofitel Legend Metropole Hà Nội
              </h3>
              <div className="flex space-x-2 items-center mt-3">
                <Image
                  className="w-4 h-4"
                  src="/icon/marker-pin-01.svg"
                  alt="Icon"
                  width={18}
                  height={18}
                />
                <span className="text-sm">
                  15 Ngô Quyền, Hoàn Kiếm - Hà Nội
                </span>
              </div>
            </div>
            <div className="flex mt-3 md:mt-0 space-x-1">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-[18px] rounded-tr bg-primary text-white font-semibold">
                9.8
              </span>
              <div className="flex flex-col space-y-1">
                <span className="text-primary text-sm font-semibold">
                  Xuất sắc
                </span>
                <span className="text-gray-500 text-xs">234 đánh giá</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-18 font-semibold">Tiện nghi dịch vụ</p>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 list-disc pl-4">
              <li>Có gói dịch vụ lãng mạn/cầu hôn</li>
              <li>Trông/giữ trẻ (phụ phí)</li>
              <li>Bàn ghế ngoài trời</li>
              <li>Dốc cho xe lăn ở cửa trước</li>
              <li>Khu giải trí ngoài trời</li>
              <li>Internet có dây miễn phí</li>
            </ul>
          </div>
        </div>
      )}
      {activeTab == 3 && (
        <Fragment>
          <div className="w-full mt-6">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
                Tiện nghi, dịch vụ nơi lưu trú
              </h3>
              <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 list-disc pl-4">
                <li>Có gói dịch vụ lãng mạn/cầu hôn</li>
                <li>Số lượng hồ bơi ngoài trời: - 1</li>
                <li>Bóng đèn LED</li>
                <li>Trông/giữ trẻ (phụ phí)</li>
                <li>Dịch vụ hỗ trợ tour/vé du lịch</li>
                <li>Có lựa chọn thực đơn thuần chay</li>
                <li>Bàn ghế ngoài trời</li>
                <li>Sử dụng điện hoàn toàn từ nguồn năng lượng tái tạo</li>
                <li>Khu lounge phù hợp cho xe lăn</li>
                <li>Dốc cho xe lăn ở cửa trước</li>
                <li>Không có dịch vụ đưa đón phù hợp cho người khuyết tật</li>
              </ul>

              <div className="w-full mt-4 text-center">
                <button className="py-3 px-12  text-[#175CD3] font-medium bg-blue-50 rounded-lg">
                  Xem thêm
                </button>
              </div>
            </div>
          </div>
          <div className="w-full mt-6">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
                Tiện nghi phòng
              </h3>
              <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 list-disc pl-4">
                <li>Có gói dịch vụ lãng mạn/cầu hôn</li>
                <li>Nhân viên thông thạo nhiều ngôn ngữ</li>
                <li>Thực phẩm hữu cơ</li>
                <li>Trông/giữ trẻ (phụ phí)</li>
                <li>Trung tâm Hội nghị</li>
                <li>Nền tảng quảng bá nghệ sĩ địa phương</li>
                <li>Có xe lăn trong khuôn viên</li>
                <li>Phòng khiêu vũ</li>
                <li>Khu lounge phù hợp cho xe lăn</li>
                <li>Phục vụ bữa sáng (phụ phí)</li>
                <li>Bàn concierge phù hợp cho xe lăn</li>
              </ul>
              <div className="w-full mt-4 text-center">
                <button className="py-3 px-12  text-[#175CD3] font-medium bg-blue-50 rounded-lg">
                  Xem thêm
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
      {activeTab === 4 && (
        <Fragment>
          <div className="w-full mt-6">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
                Chính sách
              </h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-18 font-semibold">Nhận phòng</p>
                  <p className="mt-2">Giờ nhận phòng bắt đầu từ 14:00</p>
                  <p className="mt-2">Kết thúc mọi thời điểm </p>
                </div>
                <div>
                  <p className="text-18 font-semibold">Trả phòng</p>
                  <p className="mt-2">Trả phòng trước 12:00</p>
                </div>
              </div>
              <p className="text-18 font-semibold mt-4">
                Hướng dẫn nhận phòng đặc biệt
              </p>
              <p className="mt-2">
                Nơi lưu trú này có dịch vụ đón khách từ sân bay (có thể tính phụ
                phí). Để sử dụng dịch vụ, khách phải liên hệ nơi lưu trú qua
                thông tin liên hệ được cung cấp trong xác nhận đặt phòng 24 giờ
                trước khi đến. Nhân viên tiếp tân sẽ đón tiếp khách tại nơi lưu
                trú. Nơi lưu trú này cho phép tối đa 1 nôi/cũi (giường cho trẻ
                sơ sinh) hoặc 1 giường gấp/giường phụ trong một số phòng khách.
              </p>
              <p className="text-18 font-semibold mt-4">Vật nuôi</p>
              <ul className="mt-2 list-disc  pl-4">
                <li>Không được mang vật nuôi hỗ trợ người khuyết tật</li>
                <li>Không được phép mang vật nuôi</li>
              </ul>
            </div>
          </div>
          <div className="w-full mt-6">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
                Thông tin quan trọng
              </h3>
              <p className="text-18 font-semibold mt-4">Tùy chọn</p>
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
              </ul>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
