import Image from "next/image";
import type { Metadata } from "next";
import FormContact from "./components/FormContact";
import SeoSchema from "@/components/schema";
import { BlogTypes, pageUrl } from "@/utils/Urls";
import { formatMetadata } from "@/lib/formatters";
import { newsApi } from "@/api/news";
import NewsByPage from "@/components/content-page/NewsByPage";
import ListItem from "./components/ListItem";
import { ProductCategoryApi } from "@/api/ProductCategory";
import { getServerLang } from "@/lib/session";

export const metadata: Metadata = formatMetadata({
  title: "Định Cư Lao Động, Di Trú Nước Ngoài | HappyBook Travel",
  description:
    "Định cư lao động, di trú nước ngoài là quá trình di cư và định cư tại một quốc gia khác với định hướng, mục tiêu sống và làm việc lâu dài. Khi làm việc ở nước ngoài, người lao động (NLĐ) thường không có quyền cư trí lâu dài và chỉ được hưởng các quyền lợi lao động Căn bản tại nước sở tại.",
  alternates: {
    canonical: pageUrl(BlogTypes.SETTLE, true),
  },
});

export default async function DinhCu() {
  const newsByPage = (await newsApi.getLastedNewsByPage())?.payload
    ?.data as any;
  const language = await getServerLang();
  const categories = (await ProductCategoryApi.listByType("dinhcu", language))
    ?.payload?.data as any;
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
              src="/settle-service/bg-header.png"
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
        </div>
        <div className="bg-white relative z-2 rounded-2xl top-[-12px] mt-10">
          <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
            <ListItem categories={categories} />
          </div>
          <div className="border-y border-y-gray-300 mt-8 ">
            <div className="lg:px-[50px] xl:px-[80px] py-12 px-3 max__screen">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <h3 className="text-32 font-bold" data-translate="true">
                  Tại sao nên chọn Happy Book ?
                </h3>
                <div data-translate="true">
                  HappyBook cung cấp dịch vụ tư vấn định cư chuyên nghiệp, hỗ
                  trợ bạn từ giai đoạn chuẩn bị hồ sơ đến khi hoàn thành mọi thủ
                  tục pháp lý để đạt được giấc mơ định cư tại các quốc gia phát
                  triển như Mỹ, Canada, Úc, Châu Âu,...
                </div>
              </div>
              <div className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  <div className="flex items-start space-x-3 h-20">
                    <Image
                      src="/icon/settle-service/adviser.svg"
                      alt="Icon"
                      className="h-11 w-11"
                      width={44}
                      height={44}
                    ></Image>
                    <div>
                      <p
                        className="text-18 font-semibold mb-1 text-gray-900"
                        data-translate="true"
                      >
                        Chuyên Nghiệp & Tận Tâm
                      </p>
                      <p data-translate="true">
                        Đội ngũ chuyên gia giàu kinh nghiệm, hỗ trợ tận tình từ
                        A-Z.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 h-20">
                    <Image
                      src="/icon/settle-service/icon-quy-trinh.svg"
                      alt="Icon"
                      className="h-11 w-11"
                      width={44}
                      height={44}
                    ></Image>
                    <div>
                      <p
                        className="text-18 font-semibold mb-1 text-gray-900"
                        data-translate="true"
                      >
                        Quy Trình Minh Bạch
                      </p>
                      <p data-translate="true">
                        Thông tin rõ ràng, quy trình minh bạch, giúp bạn an tâm.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 h-20">
                    <Image
                      src="/tour/product-icon.svg"
                      alt="Icon"
                      className="h-11 w-11"
                      width={44}
                      height={44}
                    ></Image>
                    <div>
                      <p
                        className="text-18 font-semibold mb-1 text-gray-900"
                        data-translate="true"
                      >
                        Giải Pháp Tối Ưu
                      </p>
                      <p data-translate="true">
                        Tư vấn chương trình định cư phù hợp với từng cá nhân.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-100">
            <div className="px-3 lg:px-[50px] xl:px-[80px] pt-3 max__screen">
              {newsByPage.length > 0 && (
                <NewsByPage
                  title={"Tin tức"}
                  wrapperStyle={"pt-8 pb-6 bg-none"}
                  data={newsByPage}
                />
              )}
              {/* Form contact */}
              <div className="py-6">
                <FormContact />
              </div>
            </div>
          </div>
        </div>
      </main>
    </SeoSchema>
  );
}
