import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import FormRegister from "./form";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Happy Book",
};

export default function Login() {
  return (
    <main className="relative h-max pb-10">
      <div className="absolute h-full w-full -z-[1]">
        <Image
          priority
          src="/login/background.png"
          alt="Background"
          width={1440}
          height={810}
          sizes="100vw"
          className="h-full w-full"
        />
      </div>
      <div className="base__content">
        <div className="mx-auto mt-[74px] px-4 md:px-12 py-6 md:w-[520px] h-full bg-white rounded-2xl  ">
          <h1 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            Đăng ký
          </h1>
          <div>
            <FormRegister />
          </div>
          <div className="mt-3">
            <p className="text-center text-18 text-gray-900 font-semibold">
              Bạn đã có tài khoản?
            </p>
            <div className="bg-primary border-primary border-[1px] text__default_hover hover:bg-inherit text-white rounded-lg h-11 mt-6 inline-flex w-full items-center">
              <Link
                href="/dang-nhap"
                className="text-center w-full text-base font-medium"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
