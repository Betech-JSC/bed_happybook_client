import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import VisaStyle from "@/styles/visaService.module.scss";
import VisaItem from "./components/VisaItem";
import TravelGuide from "./components/TravelGuide";
import VisaSteps from "@/components/home/visa-steps";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { VisaApi } from "@/api/Visa";

export const metadata: Metadata = formatMetadata({
  title: "Dịch Vụ Làm Visa Trọn Gói Giá Rẻ Tại TPHCM | Tỷ Lệ Đậu 90%",
  description:
    "Dịch vụ làm visa trọn gói giá rẻ và uy tín tại TPHCM của đơn vị Happy Book Travel. Chúng tôi hỗ trợ làm visa ĐẬU CAO cho tất cả các quốc gia trên thế giới với thời gian nhanh nhất và chi phí rẻ nhất. Đảm bảo giúp bạn có được visa một cách nhanh chóng và dễ dàng. Liên hệ với chúng tôi để được tư vấn miễn phí!",
  alternates: {
    canonical: pageUrl(BlogTypes.VISA, true),
  },
});

export default async function Visa() {
  const res = (await VisaApi.getAll()) as any;
  const data = res?.payload?.data;
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
      <main>
        <div className="relative h-[400px] lg:h-[500px]">
          <div className="absolute inset-0">
            <Image
              priority
              src="/visa-service/bg-header.png"
              width={1900}
              height={600}
              className="object-cover w-full h-full"
              alt="Background"
            />
          </div>
          <div
            className="absolute w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #04349A 0%, rgba(23, 85, 220, 0.5) 100%)",
            }}
          ></div>
          {/* Search */}
          <div className="base__content h-full relative place-content-center">
            <div className="bg-white rounded-2xl p-3 md:p-6 w-full lg:w-3/5">
              <h1 className="text-18 font-semibold">
                Tìm Visa theo địa danh, điểm đến
              </h1>
              <div className="mt-4 md:mt-6 flex flex-col md:flex-row md:space-x-2 space-y-3 items-end justify-between">
                <div className="relative w-full md:w-1/2">
                  <div className="absolute left-4 top-1/2 translate-y-1/4">
                    <Image
                      src="/icon/place.svg"
                      alt="Icon"
                      className="h-10"
                      width={20}
                      height={20}
                      style={{ width: 20, height: 20 }}
                    ></Image>
                  </div>
                  <label htmlFor="searchInput" className="font-medium block">
                    Theo địa danh, điểm đến
                  </label>
                  <input
                    type="text"
                    id="searchInput"
                    placeholder="Tìm theo điểm đến, hoạt động"
                    className={`mt-2 w-full ${VisaStyle.input} h-12 indent-10`}
                  />
                </div>
                <div className="w-full md:w-[30%]">
                  <label htmlFor="typeVisa" className="font-medium block">
                    Theo địa danh, điểm đến
                  </label>
                  <div
                    className="mt-2 border border-gray-300 rounded-lg h-12"
                    style={{
                      boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                    }}
                  >
                    <select
                      id="typeVisa"
                      className={`px-3 py-3 w-[90%] outline-none rounded-lg h-full ${VisaStyle.select_custom}`}
                    >
                      <option value="" disabled selected hidden>
                        Loại Visa
                      </option>
                      <option value="visa-phap">Visa Pháp</option>
                      <option value="visa-duc">Visa Đức</option>
                      <option value="visa-canada">Visa Cananda</option>
                    </select>
                  </div>
                </div>
                <div className="w-full md:w-1/5 text-center border rounded-lg px-2 h-12 bg-primary hover:bg-orange-600 duration-300">
                  <button className="ml-2 inline-flex items-center space-x-2 h-12 text-white">
                    <Image
                      src="/icon/search.svg"
                      alt="Search icon"
                      className="h-10 mr-2"
                      width={20}
                      height={20}
                      style={{ width: 20, height: 20 }}
                    ></Image>
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white relative z-2 rounded-2xl top-[-12px] mt-10">
          <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
            {data?.visaOutstanding?.length > 0 && (
              <div className="">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-[24px] lg:text-[32px] font-bold">
                      Dịch vụ Visa nổi bật
                    </h2>
                  </div>
                  {/* <Link
                  href="/visa/visa-nhat-ban"
                  className="hidden lg:flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200"
                  style={{ transition: "0.3s" }}
                >
                  <button className="text-[#175CD3] font-medium">
                    Xem tất cả
                  </button>
                  <Image
                    className=" hover:scale-110 ease-in duration-300"
                    src="/icon/chevron-right.svg"
                    alt="Icon"
                    width={20}
                    height={20}
                  />
                </Link> */}
                </div>
                <p className="text-sm lg:text-16 font-medium mt-3">
                  Dịch vụ làm visa nhanh chóng, uy tín, hỗ trợ 24/7. Tỷ lệ đậu
                  cao!
                </p>
                {/* <Link
                  href="/visa/visa-nhat-ban"
                  className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
                >
                  <button className="text-[#175CD3] font-medium">
                    {" "}
                    Xem tất cả
                  </button>
                  <Image
                    className=" hover:scale-110 ease-in duration-300"
                    src="/icon/chevron-right.svg"
                    alt="Icon"
                    width={20}
                    height={20}
                  />
                </Link> */}
                <VisaItem data={data.visaOutstanding} />
              </div>
            )}
            <div className="mt-6">
              <TravelGuide />
            </div>
            {data?.visaByCategory?.length > 0 &&
              data.visaByCategory.map((parentCategory: any, index: number) => (
                <div className="mt-6" key={index}>
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-[24px] lg:text-[32px] font-bold">
                        {parentCategory.name}
                      </h2>
                    </div>
                    <Link
                      href={`/visa/${parentCategory.alias}`}
                      className="hidden lg:flex bg-[#EFF8FF] py-1 px-4 rounded-lg space-x-3 hover:bg-blue-200"
                      style={{ transition: "0.3s" }}
                    >
                      <button className="text-[#175CD3] font-medium">
                        Xem tất cả
                      </button>
                      <Image
                        className=" hover:scale-110 ease-in duration-300"
                        src="/icon/chevron-right.svg"
                        alt="Icon"
                        width={20}
                        height={20}
                      />
                    </Link>
                  </div>
                  <Link
                    href={`/visa/${parentCategory.alias}`}
                    className="lg:hidden inline-flex bg-[#EFF8FF] mt-3 py-3 px-4 rounded-lg space-x-3"
                  >
                    <button className="text-[#175CD3] font-medium">
                      Xem tất cả
                    </button>
                    <Image
                      className=" hover:scale-110 ease-in duration-300"
                      src="/icon/chevron-right.svg"
                      alt="Icon"
                      width={20}
                      height={20}
                    />
                  </Link>
                  <VisaItem data={parentCategory.children} />
                </div>
              ))}
          </div>
        </div>
        <div className="mt-8">
          <VisaSteps />
        </div>
        <div className="hidden lg:block py-12 px-3 lg:px-[50px] xl:px-[80px] max__screen">
          <div>
            <h2 className="text-[22px] pb-2 font-semibold border-b-2 border-b-[#2E90FA]">
              Dịch vụ visa nổi bật
            </h2>
            <div className="grid grid-cols-5 gap-4 mt-3">
              {[
                "Visa đi Mỹ",
                "Visa đi Canada",
                "Visa đi Úc",
                "Visa đi Hàn Quốc",
                "Visa đi Nhật Bản",
                "Visa du lịch châu Âu",
                "Visa định cư",
                "Visa công tác",
              ].map((item, index) => (
                <h3
                  key={index}
                  className={`text-gray-700 font-medium text__default_hover`}
                >
                  {item}
                </h3>
              ))}
            </div>
          </div>
        </div>
      </main>
    </SeoSchema>
  );
}
