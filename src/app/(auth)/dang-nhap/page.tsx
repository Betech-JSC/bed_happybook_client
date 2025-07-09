import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import FormLogin from "./form";
import { getServerT } from "@/lib/i18n/getServerT";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Happy Book",
};

export default async function Login() {
  const t = await getServerT();
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
        <div className="mx-auto mt-[74px] px-4 md:px-12 py-6 md:w-[520px] h-auto bg-white rounded-2xl  ">
          <h1 className="pl-2 border-l-4 border-[#F27145] text-22 font-bold">
            {t("dang_nhap")}
          </h1>
          <FormLogin />
          <div className="mt-3">
            <p className="text-center text-18 text-gray-900 font-semibold">
              {t("ban_chua_co_tai_khoan")}
            </p>
            <div className="bg-primary border-primary border-[1px] text__default_hover hover:bg-inherit text-white rounded-lg h-11 mt-6 inline-flex w-full items-center">
              <Link
                href="/dang-ky"
                className="text-base font-medium w-full text-center"
              >
                {t("dang_ky")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
