import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import FormCtv from "./form";

export const metadata: Metadata = {
  title: "Đăng ký làm CTV bán vé máy bay.",
  description: "Happy Book",
};

export default function SignUpCollaborator() {
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
          <h4 className="text-32 text-white font-bold">
            Đăng ký làm CTV bán vé máy bay.
          </h4>
          <div>
            <Image
              priority
              src="/ctv/bg.png"
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
            <FormCtv />
          </div>
        </div>
      </div>
    </main>
  );
}
