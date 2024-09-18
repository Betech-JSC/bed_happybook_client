import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Liên Hệ",
  description: "Happy Book",
};

export default function Login() {
  return (
    <main className="relative h-400px">
      <div className="absolute md:h-[700px] w-full -z-[1]">
        <Image
          priority
          src="/login/background.png"
          alt="Background"
          width={1440}
          height={810}
          sizes="100vw"
          className="h-[700px] lg:h-[810px] w-full"
        />
      </div>
      <div className="base__content h-[373px] place-content-center">
        <h4 className="text-32 text-white font-bold">
          Đăng ký làm CTV bán vé máy bay.
        </h4>
      </div>
      <div className="h-auto pb-6 w-full bg-gray-100 rounded-t-2xl top-[-12px]">
        <div className="px-3 pt-10 lg:px-[80px] lg:pt-16">
          <div className="mx-auto p-8 lg:w-[920px] h-auto bg-white rounded-2xl  ">
            <div>
              <h3 className="text-2xl font-semibold">
                Form đăng ký làm CTV bán vé máy bay.
              </h3>
              <p className="mt-4">
                Quý khách vui lòng điền đầy đủ thông tin bên dưới.
              </p>
              <p className="mt-4">
                Nhân viên của chúng tôi sẽ liên hệ lại ngay sau khi nhận được
                thông tin
              </p>
            </div>
            <div className="mt-4 rounded-xl">
              <div className="relative">
                <input
                  id="full_name"
                  type="text"
                  placeholder="Nhập Tên người đại diện"
                  className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                />
                <label
                  htmlFor="full_name"
                  className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                >
                  Tên người đại diện
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="relative">
                  <input
                    id="phone"
                    type="text"
                    placeholder="Nhập số điện thoại liên hệ"
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                  />
                  <label
                    htmlFor="phone"
                    className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    Số điện thoại liên hệ
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="email"
                    type="text"
                    placeholder="Nhập email"
                    className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                  />
                  <label
                    htmlFor="email"
                    className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                  >
                    Email
                  </label>
                </div>
              </div>
              <div className="relative mt-3">
                <input
                  id="address"
                  type="text"
                  placeholder="Nhập địa chỉ liên hệ"
                  className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                />
                <label
                  htmlFor="address"
                  className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                >
                  Địa chỉ liên hệ
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div className="relative">
                <input
                  id="ID"
                  type="number"
                  placeholder="Nhập số chứng minh thư"
                  className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                />
                <label
                  htmlFor="ID"
                  className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                >
                  Số chứng minh thư
                </label>
              </div>
              <div className="relative">
                <input
                  id="issue_date"
                  type="text"
                  placeholder="mm/dd/yy"
                  className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                />
                <label
                  htmlFor="issue_date"
                  className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                >
                  Ngày cấp
                </label>
              </div>
              <div className="relative">
                <input
                  id="issue_place"
                  type="text"
                  placeholder="Nhập nơi cấp"
                  className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                />
                <label
                  htmlFor="issue_place"
                  className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                >
                  Nơi cấp
                </label>
              </div>
            </div>
            <div className="mt-4">
              <textarea
                name=""
                id=""
                placeholder="Yêu Cầu Đặc Biệt"
                className="w-full border border-gray-300 rounded-lg h-28 focus:outline-none focus:border-primary indent-3.5 pt-2.5"
              ></textarea>
            </div>
            <div className="mt-2 bg-blue-600 text-white py-2.5 rounded-lg text-center cursor-pointer text__default_hover">
              <button>Gửi</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
