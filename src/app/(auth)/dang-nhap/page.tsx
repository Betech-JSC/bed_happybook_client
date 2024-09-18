import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Happy Book",
};

export default function Login() {
  return (
    <main className="relative h-[700px] lg:h-[810px]">
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
      <div className="base__content">
        <div className="mx-auto mt-[74px] px-4 md:px-12 py-6 md:w-[520px] h-[500px] bg-white rounded-2xl  ">
          <h3 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Đăng nhập
          </h3>
          <div className="mt-6 pb-6 border-b-[1px] border-gray-300">
            <div>
              <p>Tên tài khoản hoặc địa chỉ email</p>
              <input
                type="text"
                placeholder="Tên tài khoản hoặc địa chỉ email"
                className="mt-2 h-11 border-[1px] border-gray-300 rounded-lg w-full indent-3.5"
              />
            </div>
            <div className="mt-3">
              <p>Mật khẩu</p>
              <input
                type="text"
                placeholder="Mật khẩu"
                className="mt-2 h-11 border-[1px] border-gray-300 rounded-lg w-full indent-3.5"
              />
            </div>
            <div className="bg-blue-600 text__default_hover text-white rounded-lg h-11 mt-6 inline-flex w-full items-center">
              <button className="mx-auto text-base font-medium">
                Đăng nhập
              </button>
            </div>
            <div className="mt-3 text-right text-base text-blue-700 font-medium">
              <Link href="#">Quên mật khẩu ?</Link>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-center text-18 text-gray-900 font-semibold">
              Bạn chưa có tài khoản?
            </p>
            <div className="bg-primary border-primary border-[1px] text__default_hover hover:bg-inherit text-white rounded-lg h-11 mt-6 inline-flex w-full items-center">
              <button className="mx-auto text-base font-medium">
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
