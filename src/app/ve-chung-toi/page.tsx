import Image from "next/image";
import Members from "./components/members";
import Partner from "./components/partner";
import Service from "./components/service";
import AosAnimate from "@/components/aos-animate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description: "Happy Book",
};
export default function AboutUs() {
  return (
    <main className="bg-white mt-[68px] lg:mt-[132px]">
      {/* <AosAnimate> */}
      <div>
        <Image
          priority
          src="/about-us/banner.svg"
          alt="Happy Book Logo"
          width={100}
          height={100}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      {/* </AosAnimate> */}
      {/* <AosAnimate> */}
      <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
        <div className="mt-8">
          <p className="text-black text-center font-bold text-2xl">
            HappyBook tự hào là đối tác tin cậy
          </p>
          <p className="font-medium text-black-700 text-center w-[836px] mx-auto mt-3  max-w-full">
            HappyBook luôn đặt chữ TÍN lên hàng đầu. Với sự phát triển không
            ngừng, chúng tôi đã xây dựng một đội ngũ chuyên viên năng động, giàu
            kinh nghiệm và luôn tận tâm phục vụ quý khách. Sự hài lòng của khách
            hàng là kim chỉ nam cho mọi hoạt động của chúng tôi.
          </p>
        </div>
        <div className="mt-12">
          <Image
            priority
            src="/about-us/members.svg"
            alt="Happy Book Logo"
            width={100}
            height={100}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-16 items-center ">
          <div>
            <h4 className="text-black font-bold text-2xl">
              10 năm hình thành và phát triển
            </h4>
            <p className="font-medium">
              HappyBook đã khẳng định vị thế của mình là đại lý cấp 1 chuyên
              cung cấp vé máy bay trong nước và quốc tế. Chúng tôi hiện là đối
              tác uy tín của nhiều hãng hàng không lớn tại Việt Nam và trên thế
              giới, mang đến cho khách hàng những lựa chọn đa dạng và phù hợp
              nhất.
            </p>
          </div>
          <div>
            <Image
              priority
              src="/about-us/1.svg"
              alt="Happy Book Logo"
              width={100}
              height={100}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
      {/* </AosAnimate> */}
      {/* <AosAnimate> */}
      <Partner></Partner>
      {/* </AosAnimate> */}
      {/* <AosAnimate> */}
      <Members></Members>
      {/* </AosAnimate> */}
      {/* <AosAnimate> */}
      <Service></Service>
      {/* </AosAnimate> */}
      {/* <AosAnimate> */}
      <div className="bg-[#F9FAFB]">
        <div className="py-12 px-3 lg:px-[50px] xl:px-[80px] max__screen">
          <p className="text-[32px] leading-[38.4px] font-bold text-center">
            Cam Kết Của Chúng Tôi
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="px-3 py-8 bg-white rounded-xl text__default_hover">
              <div>
                <Image
                  src="/about-us/fi_8898827.svg"
                  alt="Icon"
                  width={48}
                  height={48}
                  className="mx-auto"
                />
              </div>
              <p className="text-[18px] leading-[26.1px] text-center font-semibold mt-6">
                Tư vấn chuyên nghiệp về các thủ tục và dịch vụ.
              </p>
            </div>
            <div className="px-3 py-8 bg-white rounded-xl text__default_hover">
              <div>
                <Image
                  src="/about-us/fi_11345966.svg"
                  alt="Icon"
                  width={48}
                  height={48}
                  className="mx-auto"
                  style={{ height: "48px", width: "48px" }}
                />
              </div>
              <p className="text-[18px] leading-[26.1px] text-center font-semibold mt-6">
                Giao vé theo yêu cầu, đảm bảo đúng hạn.
              </p>
            </div>
            <div className="px-3 py-8 bg-white rounded-xl text__default_hover">
              <div>
                <Image
                  src="/about-us/fi_5806908.svg"
                  alt="Icon"
                  width={48}
                  height={48}
                  className="mx-auto"
                />
              </div>
              <p className="text-[18px] leading-[26.1px] text-center font-semibold mt-6">
                Phương thức thanh toán đơn giản, nhanh chóng và tiện lợi.
              </p>
            </div>
            <div className="px-3 py-8 bg-white rounded-xl text__default_hover">
              <div>
                <Image
                  src="/about-us/fi_8898825.svg"
                  alt="Icon"
                  width={48}
                  height={48}
                  className="mx-auto"
                />
              </div>
              <p className="text-[18px] leading-[26.1px] text-center font-semibold mt-6">
                Mang đến sự hài lòng tối đa cho khách hàng.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* </AosAnimate> */}
      {/* <AosAnimate> */}
      <div>
        <Image
          priority
          src="/about-us/contact.svg"
          alt="Happy Book Logo"
          width={1440}
          height={360}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      {/* </AosAnimate> */}
    </main>
  );
}
