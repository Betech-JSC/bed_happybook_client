import type { Metadata } from "next";
import Image from "next/image";
import LoadingButton from "@/components/LoadingButton";

export const metadata: Metadata = {
  title: "Thông tin đặt chỗ",
  description: "Happy Book | Thông tin đặt chỗ",
  keywords: "Thông tin đặt chỗ",
};
export default async function BookingFlight() {
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
              <div className="flex space-x-4 justify-center py-4">
                <p className="text-22 font-bold text-white">
                  Hoàn tất đơn hàng của bạn, để giữ giá tốt nhất{" "}
                </p>
                <div className="flex space-x-2 items-center text-22 font-bold text-[#FF9258]">
                  <p>00:29:59</p>
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
              <div className="bg-white rounded-xl p-6 mt-3">
                <div className="flex pb-3 border-b border-gray-300">
                  <p className="w-1/4 text-sm text-gray-700">Chuyến bay</p>
                  <p className="w-3/4 font-bold">
                    Hồ Chí Minh (SGN) - Hà Nội(HAN)
                  </p>
                </div>
                <div className="flex mt-3">
                  {/* <div>
                    <Image
                      src={`/airline/VJ.svg`}
                      width={40}
                      height={40}
                      alt="Airline"
                      className="w-10 h-10"
                    />
                    <p className="mt-2 text-sm">VJ168</p>
                    <p className="mt-2 text-sm text-gray-500">Hạng: Eco</p>
                  </div> */}
                  <div className="flex items-center justify-between  p-4 rounded-lg shadow-sm w-full">
                    <div className="flex flex-col items-start">
                      <Image
                        src={`/airline/VJ.svg`}
                        width={40}
                        height={40}
                        alt="Airline"
                        className="w-10 h-10"
                      />
                      <p className="text-sm font-medium text-gray-500">VJ168</p>
                      <p className="text-xs text-gray-400">Hạng: Eco</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-500">123</p>
                      <p className="text-xl font-bold">123</p>
                      <p className="text-gray-500 text-sm">123</p>
                    </div>

                    <div className="text-center">
                      <div className="relative flex items-center justify-center">
                        <div className="w-12 border-t border-gray-300"></div>
                        <span className="absolute text-gray-500 bg-white px-2 text-sm">
                          ✈
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">123</p>
                      <p className="text-xs text-gray-500">Bay thẳng</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-500">123</p>
                      <p className="text-xl font-bold">123</p>
                      <p className="text-gray-500 text-sm">123</p>
                    </div>
                  </div>
                </div>
                <button className="mt-3 text-blue-700 border-b border-blue-700 font-medium">
                  Điều kiện vé
                </button>
              </div>
            </div>
            <div className="mt-6">
              <p className="font-bold text-18">Thông tin liên hệ</p>
              <div className="bg-white rounded-xl p-6 mt-3">
                <div className="flex pb-3 border-b border-gray-300">
                  <p className="w-1/4 text-gray-700">Mã đơn hàng</p>
                  <p className="w-3/4 font-medium">#VJA20212121</p>
                </div>
                <div className="flex mt-3">
                  <div className="w-1/4 text-gray-700">Họ và tên</div>
                  <div className="w-3/4 ">
                    <p className="font-bold">Nguyễn Thanh Phong</p>
                    <p className="text-sm mt-1">7 KG Hành lý xách tay</p>
                  </div>
                </div>
                <div className="flex mt-3">
                  <p className="w-1/4 text-gray-700">Giới tính</p>
                  <p className="w-3/4 font-medium">Nam</p>
                </div>
                <div className="flex mt-3">
                  <p className="w-1/4 text-gray-700">Năm sinh</p>
                  <p className="w-3/4 font-medium">08/09/1995</p>
                </div>
                <div className="flex mt-3">
                  <p className="w-1/4 text-gray-700">Email</p>
                  <p className="w-3/4 font-medium">
                    nguyenthanhphong@gmail.com
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="font-bold text-18">Thông tin hành khách</p>
              <div className="bg-white rounded-xl p-6 mt-3">
                <div className="flex mt-3">
                  <div className="w-1/4 text-gray-700">Họ và tên</div>
                  <div className="w-3/4 ">
                    <p className="font-bold">NGUYEN THANH PHONG</p>
                    <p className="text-sm mt-1">7 KG Hành lý xách tay</p>
                  </div>
                </div>
                <div className="flex mt-3">
                  <p className="w-1/4 text-gray-700">Giới tính</p>
                  <p className="w-3/4 font-medium">Nam</p>
                </div>
                <div className="flex mt-3">
                  <p className="w-1/4 text-gray-700">Năm sinh</p>
                  <p className="w-3/4 font-medium">08/09/1995</p>
                </div>
                <div className="flex mt-3">
                  <p className="w-1/4 text-gray-700">Dịch vụ mua thêm</p>
                  <p className="w-3/4 font-semibold">
                    Hành lý ký gửi +20kg (216,000 vnđ)
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="font-bold text-18">Hình thức thanh toán</p>
              <div className="bg-white rounded-xl p-6 mt-3">
                <div className="flex space-x-3 items-start">
                  <input
                    type="radio"
                    value="cash"
                    id="payment_cash"
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
                    id="payment_transfer"
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
          <div className="w-full md:w-5/12 lg:w-4/12 bg-white rounded-3xl p-6">
            <p className="text-22 font-bold">Giá chi tiết</p>
            <div className="pb-4 border-b border-b-gray-200">
              <div className="flex justify-between mt-2 text-sm">
                <div>
                  <p>Vé người lớn (hành khách 1)</p>
                </div>
                <p className="font-bold">1,436,000đ x 1</p>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <div>
                  <p>Vé trẻ em (hành khách 2)</p>
                </div>
                <p className="font-bold">1,436,000đ x 1</p>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <p>Hành lý bổ sung</p>
                <p className="font-bold">216,000đ x 1</p>
              </div>
            </div>
            <div className="flex font-bold justify-between mt-4">
              <p>Tổng cộng</p>
              <p className="text-primary">3,088,000 đ</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
