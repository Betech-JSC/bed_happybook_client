import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tư vấn nhận Visa",
  description: "Happy Book",
};

export default function VisaConsulting() {
  return (
    <main className="relative h-400px">
      <div
        className="h-[500px] md:h-[700px] w-full -z-[1] absolute"
        style={{
          backgroundImage: "linear-gradient(180deg, #04349A 0%, #1755DC 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="base__content h-80 md:h-[405px] lg:pr-[200px]">
        <div className="flex justify-between items-center h-full">
          <h4 className="text-32 text-white font-bold">Tư vấn nhận Visa</h4>
          <div>
            <Image
              priority
              src="/bg-tu-van-visa.png"
              alt="Background"
              width={273}
              height={273}
              className="w-full h-full md:w-[273px]"
            />
          </div>
        </div>
      </div>
      <div className="h-auto pb-6 w-full bg-gray-100 rounded-t-2xl top-[-12px]">
        <div className="px-3 pt-10 lg:px-[80px] lg:pt-16">
          <div className="mx-auto p-8 lg:w-[980px] h-auto bg-white rounded-2xl  ">
            <div>
              <h3 className="text-2xl font-semibold">
                PHIẾU TIẾP NHẬN THÔNG TIN XIN THỊ THỰC (VISA)
              </h3>
            </div>
            <div className="mt-6">
              <div className="relative">
                <input
                  id="country"
                  type="text"
                  placeholder="Nhập tên quốc gia muốn xin thị thực"
                  className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                />
                <label
                  htmlFor="country"
                  className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                >
                  QUỐC GIA MUỐN XIN THỊ THỰC
                </label>
              </div>
              <div className="mt-6">
                <p className="text-base text-gray-700">
                  ĐÃ TỪNG TRƯỢT VISA TẠI NƯỚC MUỐN XIN VISA BAO GIỜ CHƯA? *
                </p>
                <div className="mt-2">
                  <div className="flex space-x-6">
                    <div className="flex space-x-3">
                      <input type="radio" name="pass" />
                      <label htmlFor="">Đã từng</label>
                    </div>
                    <div className="flex space-x-3">
                      <input type="radio" name="pass" />
                      <label htmlFor="">Chưa từng</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Nhập Họ và Tên"
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                  />
                  <label
                    htmlFor="fullName"
                    className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs text-gray-700"
                  >
                    HỌ VÀ TÊN NGƯỜI XIN VISA
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="birthDay"
                    type="text"
                    placeholder="Nhập năm sinh"
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                  />
                  <label
                    htmlFor="birthDay"
                    className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs text-gray-700"
                  >
                    NĂM SINH NGƯỜI XIN VISA
                  </label>
                </div>
              </div>
            </div>
            <div className="relative mt-6">
              <input
                id="ID"
                type="number"
                placeholder="Nhập số điện thoại"
                className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
              />
              <label
                htmlFor="ID"
                className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs text-gray-700"
              >
                SỐ ĐIỆN THOẠI NGƯỜI XIN VISA
              </label>
            </div>
            <div className="relative mt-6">
              <input
                id="ID"
                type="number"
                placeholder="Nhập ĐỊA CHỈ THƯỜNG TRÚ NGƯỜI XIN VISA"
                className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
              />
              <label
                htmlFor="ID"
                className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs text-gray-700"
              >
                ĐỊA CHỈ THƯỜNG TRÚ NGƯỜI XIN VISA *
              </label>
              <p className="mt-1 text-xs text-gray-700">
                Yêu cầu ghi đầy đủ: XÃ/ PHƯỜNG - QUẬN/ HUYỆN - TỈNH/ THÀNH PHỐ
              </p>
            </div>
            <div className="relative mt-6">
              <input
                id="ID"
                type="number"
                placeholder="Nhập ĐỊA CHỈ TẠM TRÚ NGƯỜI XIN VISA"
                className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
              />
              <label
                htmlFor="ID"
                className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs text-gray-700"
              >
                ĐỊA CHỈ TẠM TRÚ NGƯỜI XIN VISA *
              </label>
              <p className="mt-1 text-xs text-gray-700">
                1. Nếu không có địa chỉ tạm chú, ghi &quot;KHÔNG&quot;
              </p>
              <p className="mt-1 text-xs text-gray-700">
                2. Nếu có địa chỉ tạm trú, yêu cầu ghi đầy đủ: XÃ/ PHƯỜNG -
                QUẬN/ HUYỆN - TỈNH/ THÀNH PHỐ
              </p>
            </div>
            <div className="mt-6">
              <p className="text-base text-gray-900 font-semibold">
                CÓ NGƯỜI THÂN ĐANG HỌC TẬP, LÀM VIỆC BẤT HỢP PHÁP TẠI NƯỚC MUỐN
                XIN VISA KHÔNG? *
              </p>
              <div className="mt-2">
                <div className="flex space-x-6">
                  <div className="flex space-x-3">
                    <input type="radio" name="family" />
                    <label htmlFor="">Có</label>
                  </div>
                  <div className="flex space-x-3">
                    <input type="radio" name="family" />
                    <label htmlFor="">Không</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-base text-gray-900 font-semibold">
                TRÌNH ĐỘ HỌC VẤN CAO NHẤT *
              </p>
              <div className="mt-2">
                <div className="inline-block mr-6">
                  <input type="radio" name="education" />
                  <label htmlFor="" className="ml-3">
                    TIỂU HỌC (CẤP 1)
                  </label>
                </div>
                <div className="inline-block mr-6">
                  <input type="radio" name="education" />
                  <label htmlFor="" className="ml-3">
                    TRUNG HỌC CƠ SỞ (CẤP 2)
                  </label>
                </div>
                <div className="inline-block mr-6">
                  <input type="radio" name="education" />
                  <label htmlFor="" className="ml-3">
                    TRUNG HỌC PHỔ THÔNG (CẤP 3)
                  </label>
                </div>
                <div className="mt-3">
                  <div className="inline-block mr-6">
                    <input type="radio" name="education" />
                    <label htmlFor="" className="ml-3">
                      TRUNG CẤP
                    </label>
                  </div>
                  <div className="inline-block mr-6">
                    <input type="radio" name="education" />
                    <label htmlFor="" className="ml-3">
                      CAO ĐẲNG
                    </label>
                  </div>
                  <div className="inline-block mr-6">
                    <input type="radio" name="education" />
                    <label htmlFor="" className="ml-3">
                      ĐẠI HỌC
                    </label>
                  </div>
                  <div className="inline-block mr-6">
                    <input type="radio" name="education" />
                    <label htmlFor="" className="ml-3">
                      CAO HỌC
                    </label>
                  </div>
                  <div className="inline-block mr-6">
                    <input type="radio" name="education" />
                    <label htmlFor="" className="ml-3">
                      TRÌNH ĐỘ KHÁC
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-base text-gray-900 font-semibold">
                MỤC ĐÍCH XIN VISA *
              </p>
              <div className="mt-2">
                <div className="inline-block mr-6">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" name="family" className="w-5 h-5" />
                    <label
                      htmlFor=""
                      className="text-base text-gray-700  font-medium"
                    >
                      Du lịch
                    </label>
                  </div>
                </div>
                <div className="inline-block mr-6">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" name="family" className="w-5 h-5" />
                    <label
                      htmlFor=""
                      className="text-base text-gray-700  font-medium"
                    >
                      THĂM THÂN
                    </label>
                  </div>
                </div>
                <div className="inline-block mr-6">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" name="family" className="w-5 h-5" />
                    <label
                      htmlFor=""
                      className="text-base text-gray-700  font-medium"
                    >
                      CÔNG TÁC
                    </label>
                  </div>
                </div>
                <div className="inline-block mr-6">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" name="family" className="w-5 h-5" />
                    <label
                      htmlFor=""
                      className="text-base text-gray-700  font-medium"
                    >
                      DU HỌC
                    </label>
                  </div>
                </div>
                <div className="inline-block mr-6">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" name="family" className="w-5 h-5" />
                    <label
                      htmlFor=""
                      className="text-base text-gray-700  font-medium"
                    >
                      LAO ĐỘNG
                    </label>
                  </div>
                </div>
                <div className="inline-block mr-6">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" name="family" className="w-5 h-5" />
                    <label
                      htmlFor=""
                      className="text-base text-gray-700  font-medium"
                    >
                      MỤC ĐÍCH KHÁC
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-base text-gray-900 font-semibold">
                LỊCH SỬ ĐI LẠI *
              </p>
              <p className="mt-2 text-base text-gray-700">
                1. Nếu không có địa chỉ tạm chú, ghi &quot;KHÔNG&quot;
              </p>
              <p className="mt-2 text-base text-gray-700">
                2. Nếu có địa chỉ tạm trú, yêu cầu ghi đầy đủ: XÃ/ PHƯỜNG -
                QUẬN/ HUYỆN - TỈNH/ THÀNH PHỐ
              </p>
              <input
                type="text"
                name="family"
                placeholder="Thông tin đi lại"
                className="w-full h-11 border border-gray-300 rounded-lg mt-2 indent-3.5"
              />
            </div>
            <div className="mt-6">
              <p className="text-base text-gray-900 font-semibold">
                CÔNG VIỆC HIỆN TẠI *
              </p>
              <div className="mt-2">
                {/* <div className="flex space-x-6"> */}
                <div className="inline-block mr-6">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" name="family" className="w-5 h-5" />
                    <label
                      htmlFor=""
                      className="text-base text-gray-700  font-medium"
                    >
                      NGƯỜI LAO ĐỘNG
                    </label>
                  </div>
                </div>
                <div className="inline-block mr-6">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" name="family" className="w-5 h-5" />
                    <label
                      htmlFor=""
                      className="text-base text-gray-700  font-medium"
                    >
                      CHỦ DOANH NGHIỆP
                    </label>
                  </div>
                </div>
                <div className="inline-block mr-6">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" name="family" className="w-5 h-5" />
                    <label
                      htmlFor=""
                      className="text-base text-gray-700  font-medium"
                    >
                      HỌC SINH/ SINH VIÊN
                    </label>
                  </div>
                </div>
                <div className="inline-block mr-6">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" name="family" className="w-5 h-5" />
                    <label
                      htmlFor=""
                      className="text-base text-gray-700  font-medium"
                    >
                      HƯU TRÍ
                    </label>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" name="family" className="w-5 h-5" />
                    <label
                      htmlFor=""
                      className="text-base text-gray-700  font-medium"
                    >
                      CÔNG VIỆC TỰ DO
                    </label>
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-base text-gray-900 font-semibold">
                MÔ TẢ CHI TIẾT CÔNG VIỆC HIỆN TẠI *
              </p>
              <p className="mt-2 text-base text-gray-700">
                1. NGƯỜI LAO ĐỘNG: Làm việc tại cơ quan từ thời gian nào - Lương
                trung bình hàng tháng bao nhiêu, chuyển khoản hay tiền mặt - Có
                tham gia bảo hiểm xã hội không?
              </p>
              <p className="mt-2 text-base text-gray-700">
                2. CHỦ DOANH NGHIỆP: Giấy phép đăng ký là Hộ kinh doanh hay Công
                ty, thành lập từ thời gian nào - Có đóng thuế đầy đủ không - Có
                tham gia bảo hiểm xã hội không?
              </p>
              <p className="mt-2 text-base text-gray-700">
                3. HỌC SINH/ SINH VIÊN: Nêu rõ tên trường đang theo học?
              </p>
              <p className="mt-2 text-base text-gray-700">
                4. HƯU TRÍ: Có quyết định hưu trí từ thời gian nào - Lương hưu
                chuyển khoản hay tiền mặt?
              </p>
              <p className="mt-2 text-base text-gray-700">
                5. CÔNG VIỆC TỰ DO: Mô tả chi tiết công việc tự do?
              </p>
              <input
                type="text"
                name="family"
                placeholder="Thông tin công việc"
                className="w-full h-11 border border-gray-300 rounded-lg mt-2 indent-3.5"
              />
            </div>
            <div className="mt-6">
              <p className="text-base text-gray-900 font-semibold">
                SỔ TIẾT KIỆM TỐI ĐA CÓ THỂ MỞ *
              </p>
              <div className="mt-2">
                <div className="inline-block mr-6">
                  <input type="radio" name="education" />
                  <label htmlFor="" className="ml-3">
                    100 TRIỆU
                  </label>
                </div>
                <div className="inline-block mr-6">
                  <input type="radio" name="education" />
                  <label htmlFor="" className="ml-3">
                    150 TRIỆU
                  </label>
                </div>
                <div className="inline-block mr-6">
                  <input type="radio" name="education" />
                  <label htmlFor="" className="ml-3">
                    200 TRIỆU
                  </label>
                </div>
                <div className="inline-block mr-6">
                  <input type="radio" name="education" />
                  <label htmlFor="" className="ml-3">
                    250 TRIỆU
                  </label>
                </div>
                <div className="inline-block mr-6">
                  <input type="radio" name="education" />
                  <label htmlFor="" className="ml-3">
                    TRÊN 250 TRIỆU
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-base text-gray-900 font-semibold">
                SỔ ĐỎ/ SỔ HỒNG CHÍNH CHỦ *
              </p>
              <div className="mt-2">
                <div className="flex space-x-6">
                  <div className="flex space-x-3">
                    <input type="radio" name="family" />
                    <label htmlFor="">Có</label>
                  </div>
                  <div className="flex space-x-3">
                    <input type="radio" name="family" />
                    <label htmlFor="">Không</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-base text-gray-900 font-semibold">
                ĐĂNG KÝ XE Ô TÔ CHÍNH CHỦ *
              </p>
              <div className="mt-2">
                <div className="flex space-x-6">
                  <div className="flex space-x-3">
                    <input type="radio" name="family" />
                    <label htmlFor="">Có</label>
                  </div>
                  <div className="flex space-x-3">
                    <input type="radio" name="family" />
                    <label htmlFor="">Không</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-base text-gray-900 font-semibold">
                CÁC TÀI SẢN KHÁC *
              </p>
              <p className="mt-2 text-base text-gray-700">
                1. Nếu không có bất kỳ tài sản nào khác, ghi &quot;KHÔNG&quot;
              </p>
              <p className="mt-2 text-base text-gray-700">
                2. Nếu có tài sản khác như: cổ phiếu, trái phiếu, góp vốn,...
                yêu cầu ghi đầy đủ
              </p>
              <input
                type="text"
                name="family"
                placeholder="Thông tin tài sản khác"
                className="w-full h-11 border border-gray-300 rounded-lg mt-2 indent-3.5"
              />
            </div>
            <div className="mt-6 bg-blue-600 text-white py-2.5 rounded-lg text-center cursor-pointer text__default_hover">
              <button>Gửi</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
