"use client";
import type { Metadata } from "next";
import Image from "next/image";
import LoadingButton from "@/components/LoadingButton";
import { useEffect, useState } from "react";

export default function BookingFlight() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const toggleDropdown = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  let keyLoopDropdown = 1;
  let dropdown: any = [
    {
      totalPrice: 1436000,
      quantity: 1,
      totalPriceTicket: 1000000,
      totalTax: 436000,
      type: "Chd",
      title: "Vé trẻ em",
    },
  ];

  const calculateTargetTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now;
  };

  const calculateTimeLeft = (targetTime: Date) => {
    const difference = +targetTime - +new Date();
    let timeLeft = { minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [targetTime] = useState(calculateTargetTime());
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  return (
    <main className="bg-gray-100 mt-10">
      <div className="base__content pb-12">
        <div className="flex flex-col-reverse items-start md:flex-row md:space-x-8 lg:mt-4 pb-8">
          <div className="w-full md:w-7/12 lg:w-8/12 mt-4 md:mt-0 ">
            <div
              className="rounded-2xl"
              style={{
                background:
                  "linear-gradient(97.39deg, #0C4089 2.42%, #1570EF 99.36%)",
              }}
            >
              <div className="flex flex-col lg:flex-row lg:space-x-4 justify-center px-4 lg:px-0 py-4">
                <p className="text-22 font-bold text-white">
                  Hoàn tất đơn hàng của bạn, để giữ giá tốt nhất{" "}
                </p>
                <div className="mt-3 lg:mt-0 flex space-x-2 items-center text-22 font-bold text-[#FF9258]">
                  <p>
                    00:{String(timeLeft.minutes).padStart(2, "0")}:
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </p>
                  <Image
                    src={`/icon/clock-stopwatch.svg`}
                    width={20}
                    height={20}
                    alt="Icon"
                    className="w-5 h-5"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="font-bold text-18">Tóm tắt chuyến bay</p>
              <div className="bg-white rounded-xl p-3 md:p-6 mt-3">
                <div className="flex flex-col lg:flex-row pb-3 border-b border-gray-300">
                  <p className="lg:w-2/12 text-sm text-gray-700">Chuyến bay</p>
                  <p className="lg:w-10/12 font-bold">
                    Hồ Chí Minh (SGN) - Hà Nội(HAN)
                  </p>
                </div>
                <div className="flex flex-col-reverse lg:flex-row items-start justify-between mt-4">
                  <div className="w-full lg:w-2/12 mt-5 lg:mt-0">
                    <div className="flex flex-row lg:flex-col justify-between lg:justify-normal items-center md:items-baseline w-full text-left mb-3">
                      <div>
                        <Image
                          src={`http://cms.happybooktravel.com/assets/images/airline/vj.gif`}
                          width={80}
                          height={24}
                          alt="AirLine"
                          className="max-w-16 md:max-w-20 max-h-10"
                        />
                      </div>
                      <div className="">
                        <h3 className="text-sm md:text-18 font-semibold my-2">
                          VJ168
                        </h3>
                        <p className="text-sm text-gray-500">Hạng: Eco</p>
                      </div>
                      <button className="mt-3 text-blue-700 border-b border-blue-700 font-medium">
                        Điều kiện vé
                      </button>
                    </div>
                  </div>
                  <div className="lg:w-10/12 text-center flex justify-between">
                    <div className="flex gap-6 w-full">
                      <div className="w-[25%] flex flex-col items-center md:items-start justify-start">
                        <span className="text-sm">Chủ Nhật, 8 thg 9 2024</span>
                        <span className="mt-2 text-lg font-bold">20:00</span>
                        <span className="mt-2 text-sm text-gray-500">
                          Hồ Chí Minh (SGN)
                        </span>
                      </div>

                      <div className="w-[30%] flex items-center space-x-3">
                        <div className="flex flex-col space-y-2 items-center w-full">
                          <span className="text-sm text-gray-700 mb-2">
                            <Image
                              src={`/icon/AirplaneTilt-2.svg`}
                              width={20}
                              height={20}
                              alt="Icon"
                              className="w-5 h-5"
                            />
                          </span>
                          <div className="relative flex items-center w-full">
                            <div className="flex-shrink-0 w-1 h-1 bg-white border-2 border-gray-700 rounded-full"></div>
                            <div className="flex-grow h-px bg-gray-500"></div>
                            <div className="flex-shrink-0 w-1 h-1 bg-white border-2 border-gray-700 rounded-full"></div>
                          </div>
                          <span className="text-sm text-gray-700">
                            2 giờ 10 phút
                          </span>
                          <span className="text-sm text-gray-500">
                            Bay thẳng
                          </span>
                        </div>
                      </div>

                      <div className="w-[25%] flex flex-col items-center md:items-start  justify-start">
                        <span className="text-sm">Chủ Nhật, 8 thg 9 2024</span>
                        <span className="mt-2 text-lg font-bold">22:10</span>
                        <span className="mt-2 text-sm text-gray-500">
                          Hà Nội(HAN)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="font-bold text-18">Thông tin liên hệ</p>
              <div className="bg-white rounded-xl p-3 md:p-6 mt-3 break-words">
                <div className="flex space-x-2 pb-3 border-b border-gray-300">
                  <p className="w-1/4 text-gray-700">Mã đơn hàng</p>
                  <p className="w-3/4 font-medium">#VJA20212121</p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <div className="w-1/4 text-gray-700">Họ và tên</div>
                  <div className="w-3/4 ">
                    <p className="font-bold">Nguyễn Thanh Phong</p>
                    <p className="text-sm mt-1">7 KG Hành lý xách tay</p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <p className="w-1/4 text-gray-700">Giới tính</p>
                  <p className="w-3/4 font-medium">Nam</p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <p className="w-1/4 text-gray-700">Năm sinh</p>
                  <p className="w-3/4 font-medium">08/09/1995</p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <p className="w-1/4 text-gray-700">Email</p>
                  <p className="w-3/4 font-medium">
                    nguyenthanhphong@gmail.com
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="font-bold text-18">Thông tin hành khách</p>
              <div className="bg-white rounded-xl p-3 md:p-6 mt-3 break-words">
                <div className="flex space-x-2 mt-3">
                  <div className="w-1/4 text-gray-700">Họ và tên</div>
                  <div className="w-3/4 ">
                    <p className="font-bold">NGUYEN THANH PHONG</p>
                    <p className="text-sm mt-1">7 KG Hành lý xách tay</p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <p className="w-1/4 text-gray-700">Giới tính</p>
                  <p className="w-3/4 font-medium">Nam</p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <p className="w-1/4 text-gray-700">Năm sinh</p>
                  <p className="w-3/4 font-medium">08/09/1995</p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <p className="w-1/4 text-gray-700">Dịch vụ mua thêm</p>
                  <p className="w-3/4 font-semibold">
                    Hành lý ký gửi +20kg (216,000 vnđ)
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="font-bold text-18">Hình thức thanh toán</p>
              <div className="bg-white rounded-xl p-3 md:p-6 mt-3">
                <div className="flex space-x-3 items-start">
                  <input
                    type="radio"
                    value="cash"
                    id="payment_cash"
                    name="payment_method"
                    className="w-5 h-5 mt-[2px]"
                  />
                  <label
                    htmlFor="payment_cash"
                    className="flex space-x-1 w-full"
                  >
                    <div className="font-normal">
                      <Image
                        src="/payment-method/cash.svg"
                        alt="Icon"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="max-w-[85%]">
                      <span className="font-medium text-base">
                        Thanh toán tiền mặt
                      </span>
                      <p className="text-gray-500">
                        Quý khách vui lòng giữ liên lạc để đội ngũ CSKH liên hệ
                        xác nhận
                      </p>
                    </div>
                  </label>
                </div>
                <div className="flex space-x-3 items-start mt-4">
                  <input
                    type="radio"
                    value="vnpay"
                    id="payment_vnpay"
                    name="payment_method"
                    className="w-5 h-5 mt-[2px]"
                  />
                  <label htmlFor="payment_vnpay" className=" flex space-x-1">
                    <div className="font-normal">
                      <Image
                        src="/payment-method/vnpay.svg"
                        alt="Icon"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </div>
                    <div>
                      <span className="font-medium text-base max-width-[85%]">
                        Thanh toán bằng VNPAY
                      </span>
                    </div>
                  </label>
                </div>
                <div className="flex space-x-3 items-start mt-4">
                  <input
                    type="radio"
                    value="bank_transfer"
                    id="payment_transfer"
                    name="payment_method"
                    className="w-5 h-5 mt-[2px]"
                  />
                  <label htmlFor="payment_transfer" className=" flex space-x-1">
                    <div className="font-normal">
                      <Image
                        src="/payment-method/transfer.svg"
                        alt="Icon"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="max-width-[85%]">
                      <span className="block text-base font-medium">
                        Thẻ quốc tế (Visa, Master, JCB)
                      </span>
                    </div>
                  </label>
                </div>
                <div className="flex space-x-3 items-start mt-4">
                  <input
                    type="radio"
                    value="bank_transfer"
                    name="payment_method"
                    id="bank_transfer"
                    className="w-5 h-5 mt-[2px]"
                  />
                  <label htmlFor="bank_transfer" className=" flex space-x-1">
                    <div className="font-normal">
                      <Image
                        src="/payment-method/transfer.svg"
                        alt="Icon"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="max-width-[85%]">
                      <span className="block text-base font-medium">
                        Chuyển khoản
                      </span>
                      <button type="button" className="text-blue-700 underline">
                        Thông tin chuyển khoản
                      </button>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <LoadingButton
                isLoading={false}
                text="Xác nhận thanh toán"
                disabled={false}
              />
            </div>
          </div>
          <div className="w-full md:w-5/12 lg:w-4/12 bg-white rounded-3xl p-3 lg:p-6">
            <div className="p-3 lg:py-4 lg:px-6">
              <p className="text-22 font-bold mb-2">Giá chi tiết</p>
              {dropdown.map((item: any, index: number) => (
                <div key={index} className="mb-4">
                  <button
                    type="button"
                    onClick={() => toggleDropdown(index)}
                    className="flex justify-between text-sm items-start space-x-3 w-full text-left outline-none"
                  >
                    <div className="flex w-8/12">
                      <span>
                        {item.title} (
                        {Array.from({ length: item.quantity }, (_, key) => (
                          <span key={keyLoopDropdown++}>
                            hành khách {keyLoopDropdown}
                            {key < item.quantity - 1 && ", "}
                          </span>
                        ))}
                        )
                      </span>
                      <span className="ml-1">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d={
                              activeIndex === index
                                ? "M15 12.5L10 7.5L5 12.5"
                                : "M5 7.5L10 12.5L15 7.5"
                            }
                            stroke="#667085"
                            strokeWidth="1.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>

                    <div className="text-gray-900 font-bold w-4/12 text-right">
                      {item.totalPrice.toLocaleString("vi-VN")}đ x{" "}
                      {item.quantity}
                    </div>
                  </button>
                  <div
                    className={`rounded-lg transition-all delay-300 ease-in ${
                      activeIndex === index
                        ? "max-h-16 opacity-100 visible"
                        : "max-h-0 opacity-0 invisible"
                    } `}
                  >
                    <div className="text-sm text-gray-500 flex justify-between mt-1">
                      <span>Vé</span>
                      <span>
                        {item.totalPriceTicket.toLocaleString("vi-VN")}đ x{" "}
                        {item.quantity}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex justify-between mt-1">
                      <span>Thuế và phí</span>
                      <span>
                        {item.totalTax.toLocaleString("vi-VN")}đ x{" "}
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between">
                <span className="text-sm text-gray-500 ">Hành lý bổ sung</span>
                <p className="font-semibold">216,000đ x 1</p>
              </div>
              <div className="flex mt-4 pt-4 pb-6 justify-between border-t border-t-gray-200">
                <span className="text-gray-700 font-bold">Tổng cộng</span>
                <p className="font-bold text-primary">3,088,000 vnđ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
