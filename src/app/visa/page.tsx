import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import VisaItem from "./components/VisaItem";
import TravelGuide from "./components/TravelGuide";
import VisaSteps from "@/components/home/visa-steps";
import SeoSchema from "@/components/schema";
import { formatMetadata } from "@/lib/formatters";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { VisaApi } from "@/api/Visa";
import SearchForm from "./components/SeachForm";
import NewsByPage from "@/components/content-page/NewsByPage";
import { newsApi } from "@/api/news";
import FooterMenu from "@/components/content-page/footer-menu";

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
  const optionsFilter = (await VisaApi.getOptionsFilter())?.payload
    ?.data as any;
  const newsByPage = (await newsApi.getLastedNewsByPage())?.payload
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
              <SearchForm optionsFilter={optionsFilter} />
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
            {newsByPage.length > 0 && (
              <div className="mt-6">
                <NewsByPage title={"Cẩm nang visa"} data={newsByPage} />
              </div>
            )}
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
        <FooterMenu page="visa" />
      </main>
    </SeoSchema>
  );
}
