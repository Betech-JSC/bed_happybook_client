import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Liên Hệ",
  description: "Happy Book",
};

export default function Contact() {
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
            Liên Hệ Với HappyBook
          </h4>
          <div>
            <Image
              priority
              src="/about-us/bg.png"
              alt="Background"
              width={273}
              height={273}
              className="w-full h-full md:w-[273px]"
            />
          </div>
        </div>
      </div>
      <div className="h-auto pb-6 w-full bg-gray-100 rounded-2xl top-[-12px]">
        <div className="px-3 pt-10 lg:px-[80px] lg:pt-16">
          <div className="mx-auto p-8 lg:w-[980px] h-auto bg-white rounded-2xl  ">
            <h3 className="text-18 font-semibold">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Nếu có bất kỳ câu
              hỏi nào hoặc cần trợ giúp, đừng ngần ngại liên hệ với chúng tôi
              qua các kênh dưới đây:
            </h3>
            <div className="mt-3 p-[28px] border border-gray-200 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-4 border-b-[1px] border-gray-200">
                <div className="flex space-x-4">
                  <div>
                    <Image
                      src="/icon/contact/AirplaneTilt.svg"
                      alt="Icon"
                      width={32}
                      height={32}
                      style={{ width: "32px", height: "32px" }}
                    />
                  </div>
                  <div className="w-3/4">
                    <p className="text-sm font-semibold">Hotline vé máy bay</p>
                    <p className="text-base mt-2">
                      0983.488.937 (Nội địa) - 0367.008.027 (Quốc tế)
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div>
                    <Image
                      src="/icon/contact/passport-outline.svg"
                      alt="Icon"
                      width={32}
                      height={32}
                      style={{ width: "32px", height: "32px" }}
                    />
                  </div>
                  <div className="w-3/4">
                    <p className="text-sm font-semibold">
                      Hotline Visa - hộ chiếu
                    </p>
                    <p className="text-base mt-2">
                      0708.628.791 - 0904.221.293
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div>
                    <Image
                      src="/icon/contact/bus.svg"
                      alt="Icon"
                      width={32}
                      height={32}
                      style={{ width: "32px", height: "32px" }}
                    />
                  </div>
                  <div className="w-3/4">
                    <p className="text-sm font-semibold">
                      Hotline Tour du lịch
                    </p>
                    <p className="text-base mt-2">0708.628.791</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-4 mt-4 border-b-[1px] border-gray-200">
                <div className="flex space-x-4">
                  <div>
                    <Image
                      src="/icon/contact/mail-01.svg"
                      alt="Icon"
                      width={32}
                      height={32}
                      style={{ width: "32px", height: "32px" }}
                    />
                  </div>
                  <div className="w-3/4">
                    <p className="text-sm font-semibold">Email Chính thức</p>
                    <p className="text-base mt-2">
                      0983.488.937 (Nội địa) - 0367.008.027 (Quốc tế)
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div>
                    <Image
                      src="/icon/contact/user-square.svg"
                      alt="Icon"
                      width={32}
                      height={32}
                      style={{ width: "32px", height: "32px" }}
                    />
                  </div>
                  <div className="w-3/4">
                    <p className="text-sm font-semibold">
                      Email tuyển dụng - đăng ký CTV
                    </p>
                    <p className="text-base mt-2 break-all">
                      HR@happybook.com.vn
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div>
                    <Image
                      src="/icon/contact/mail-01.svg"
                      alt="Icon"
                      width={32}
                      height={32}
                      style={{ width: "32px", height: "32px" }}
                    />
                  </div>
                  <div className="w-3/4">
                    <p className="text-sm font-semibold">
                      Email visa - hộ chiếu
                    </p>
                    <p className="text-base mt-2 break-all">
                      visaonline@happybook.com.vn
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-2 flex space-x-3">
                  <div>
                    <Image
                      src="/icon/contact/place.svg"
                      alt="Icon"
                      width={32}
                      height={32}
                      style={{ width: "32px", height: "32px" }}
                    />
                  </div>
                  <div className="w-3/4">
                    <p className="text-sm font-semibold">Địa chỉ</p>
                    <p className="text-gray-900">
                      <span className="font-medium">Trụ sở chính:</span> Tầng 1,
                      Phong Phú Tower, 93/10 Quang Trung, KP.1, P.Hiệp Phú,
                      TP.Thủ Đức, TP.HCM
                    </p>
                    <p className="text-gray-900">
                      <span className="font-medium">Chi nhánh 1:</span> 124 Lê
                      Quang Định, P.14, Q.Bình Thạnh, TP.HCM
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">Theo dõi chúng tôi</p>
                  <div className="flex space-x-3 mt-4">
                    <button>
                      <Image
                        src="/social/fb.svg"
                        alt="Icon"
                        width={32}
                        height={32}
                        sizes="100vw"
                      />
                    </button>
                    <button>
                      <Image
                        src="/social/tiktok.svg"
                        alt="Icon"
                        width={32}
                        height={32}
                      />
                    </button>
                    <button>
                      <Image
                        src="/social/zalo.svg"
                        alt="Icon"
                        width={32}
                        height={32}
                      />
                    </button>
                    <button>
                      <Image
                        src="/social/ytb.svg"
                        alt="Icon"
                        width={32}
                        height={32}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto p-8 mt-8 lg:w-[920px] h-auto bg-white rounded-2xl  ">
            <h3 className="text-18 font-semibold">
              Bạn có thể gửi thông tin yêu cầu của mình qua mẫu liên hệ dưới
              đây, và chúng tôi sẽ phản hồi trong thời gian sớm nhất.
            </h3>
            <div className="mt-3 rounded-xl">
              <div className="relative">
                <input
                  id="serviceName"
                  type="text"
                  placeholder="Nhập tên dịch vụ"
                  className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                />
                <label
                  htmlFor="serviceName"
                  className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                >
                  Tên dịch vụ <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative mt-4">
                <input
                  id="fullName"
                  type="text"
                  placeholder="Nhập họ và tên"
                  className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                />
                <label
                  htmlFor="fullName"
                  className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      id="phone"
                      type="text"
                      placeholder="Nhập số điện thoại"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none  focus:border-primary indent-3.5"
                    />
                    <label
                      htmlFor="phone"
                      className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="email"
                      type="text"
                      placeholder="Nhập email"
                      className="text-sm w-full border border-gray-300 rounded-md pt-6 pb-2 placeholder-gray-400 focus:outline-none focus:border-primary indent-3.5"
                    />
                    <label
                      htmlFor="email"
                      className="absolute top-0 left-0 h-full translate-y-1 translate-x-4 font-medium text-xs"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <textarea
                  name=""
                  id=""
                  placeholder="Hãy chia sẻ nhu cầu của bạn"
                  className="w-full border border-gray-300 rounded-lg h-28 focus:outline-none focus:border-primary indent-3.5 pt-2.5"
                ></textarea>
              </div>
              <div className="mt-2 bg-blue-600 text-white py-2.5 rounded-lg text-center cursor-pointer text__default_hover">
                <button>Gửi</button>
              </div>
            </div>
          </div>
          {/* Iframe */}
          <div className="mt-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6352122210205!2d106.7706398107937!3d10.83920325798767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175218fe46ddd97%3A0x5f8c5b870fed6adf!2zxJDhuqFpIEzDvSBWw6kgTcOheSBCYXkgUXXhu5FjIFThur8gdsOgIE7hu5lpIMSQ4buLYSBHacOhIFLhursgfCBoYXBweWJvb2suY29tLnZu!5e0!3m2!1svi!2s!4v1726681819732!5m2!1svi!2s"
              width="600"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </div>
    </main>
  );
}
