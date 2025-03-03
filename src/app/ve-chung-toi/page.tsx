import Image from "next/image";
import Members from "./components/members";
import Service from "./components/service";
import type { Metadata } from "next";
import { pageUrl } from "@/utils/Urls";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";
import { BannerApi } from "@/api/Banner";
import Partner from "@/components/home/partner";

export const metadata: Metadata = formatMetadata({
  title: "Về chúng tôi - Tầm Nhìn Sứ Mệnh HappyBook Travel ✈️",
  description:
    "Giới thiệu về Happy Book là một trong những đại lý cung cấp nhiều dịch vụ vé máy bay nội địa, vé máy bay quốc tế, dịch vụ làm visa trọn gói giá rẻ và tour du lịch trên khắp thế giời và định cư nước ngoài. Khi bạn có nhu cầu trông 4 dịch vụ trên có thể liên hệ với Happy Book ngay để được hỗ trợ nhé!",
  alternates: {
    canonical: pageUrl("ve-chung-toi", true),
  },
});
export default async function AboutUs() {
  const members = (await BannerApi.getBannerPage("home-doingu"))?.payload
    ?.data as any;
  const partners = (await BannerApi.getBannerPage("home-doitac"))?.payload
    ?.data as any;
  return (
    <SeoSchema
      metadata={metadata}
      breadscrumbItems={[
        {
          url: metadata.alternates?.canonical as string,
          name: metadata.title as string,
        },
      ]}
    >
      <main className="bg-white mt-[68px] lg:mt-[132px]">
        {/* <AosAnimate> */}
        <div>
          <Image
            src="/about-us/banner.png"
            alt="Happy Book Logo"
            width={1900}
            height={500}
            sizes="100vw"
          />
        </div>
        {/* </AosAnimate> */}
        {/* <AosAnimate> */}
        <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
          <div className="mt-8">
            <h1
              className="text-black text-center font-bold text-2xl"
              data-translate
            >
              HappyBook tự hào là đối tác tin cậy
            </h1>
            <p
              className="font-medium text-black-700 text-center w-[836px] mx-auto mt-3  max-w-full"
              data-translate
            >
              HappyBook luôn đặt chữ TÍN lên hàng đầu. Với sự phát triển không
              ngừng, chúng tôi đã xây dựng một đội ngũ chuyên viên năng động,
              giàu kinh nghiệm và luôn tận tâm phục vụ quý khách. Sự hài lòng
              của khách hàng là kim chỉ nam cho mọi hoạt động của chúng tôi.
            </p>
          </div>
          <div className="mt-12">
            <Image
              priority
              src="/about-us/members.png"
              alt="Members"
              width={1280}
              height={562}
              sizes="100vw"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-16 items-center ">
            <div>
              <h2 className="text-black font-bold text-2xl" data-translate>
                10 năm hình thành và phát triển
              </h2>
              <p className="font-medium" data-translate>
                HappyBook đã khẳng định vị thế của mình là đại lý cấp 1 chuyên
                cung cấp vé máy bay trong nước và quốc tế. Chúng tôi hiện là đối
                tác uy tín của nhiều hãng hàng không lớn tại Việt Nam và trên
                thế giới, mang đến cho khách hàng những lựa chọn đa dạng và phù
                hợp nhất.
              </p>
            </div>
            <div>
              <Image
                priority
                src="/about-us/1.png"
                alt="Image"
                width={623}
                height={492}
                sizes="100vw"
                // style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
        {partners?.length > 0 && <Partner data={partners}></Partner>}
        {members?.length > 0 && <Members data={members}></Members>}
        <Service></Service>

        <div className="bg-[#F9FAFB]">
          <div className="py-12 px-3 lg:px-[50px] xl:px-[80px] max__screen">
            <p
              className="text-[32px] leading-[38.4px] font-bold text-center"
              data-translate
            >
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
                <p
                  className="text-[18px] leading-[26.1px] text-center font-semibold mt-6"
                  data-translate
                >
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
                <p
                  className="text-[18px] leading-[26.1px] text-center font-semibold mt-6"
                  data-translate
                >
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
                <p
                  className="text-[18px] leading-[26.1px] text-center font-semibold mt-6"
                  data-translate
                >
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
                <p
                  className="text-[18px] leading-[26.1px] text-center font-semibold mt-6"
                  data-translate
                >
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
            src="/about-us/Contact.png"
            alt="Happy Book Logo"
            width={1900}
            height={500}
            sizes="100vw"
            // style={{ width: "100%", height: "100%" }}
          />
        </div>
        {/* </AosAnimate> */}
      </main>
    </SeoSchema>
  );
}
