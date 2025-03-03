import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PostsItem from "../components/PostsItem";
import FormContact from "../components/FormContact";
import ListItem from "../components/ListItem";
import { ProductCategoryApi } from "@/api/ProductCategory";
import { notFound } from "next/navigation";
import { getServerLang } from "@/lib/session";

export const metadata: Metadata = {
  title: "Dịch vụ định cư Mỹ",
  description: "Happy Book",
};

export default async function DinhCuByCategory({
  params,
}: {
  params: { category: string };
}) {
  const language = await getServerLang();
  const category = (
    await ProductCategoryApi.detail("dinhcu", params.category, language)
  )?.payload?.data as any;
  if (!category) notFound();
  return (
    <main>
      <div className="mt-[68px] px-3 lg:mt-0 lg:pt-[132px] lg:px-[80px] max__screen">
        <Breadcrumb className="pt-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-blue-700" data-translate>
                  Trang chủ
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dinh-cu" className="text-blue-700" data-translate>
                  Định cư
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/dinh-cu/${category.alias}`}
                  className="text-gray-700"
                >
                  {category.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-6">
          <ListItem categoryDetail={category} />
        </div>
      </div>
      <div className="border-y border-y-gray-300 mt-8 ">
        <div className="lg:px-[50px] xl:px-[80px] py-12 px-3 max__screen">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h3 className="text-32 font-bold" data-translate={true}>
              Tại sao nên chọn Happy Book ?
            </h3>
            <div data-translate={true}>
              HappyBook cung cấp dịch vụ tư vấn định cư chuyên nghiệp, hỗ trợ
              bạn từ giai đoạn chuẩn bị hồ sơ đến khi hoàn thành mọi thủ tục
              pháp lý để đạt được giấc mơ định cư tại các quốc gia phát triển
              như Mỹ, Canada, Úc, Châu Âu,...
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
                    data-translate={true}
                  >
                    Chuyên Nghiệp & Tận Tâm
                  </p>
                  <p data-translate={true}>
                    Đội ngũ chuyên gia giàu kinh nghiệm, hỗ trợ tận tình từ A-Z.
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
                    data-translate={true}
                  >
                    Quy Trình Minh Bạch
                  </p>
                  <p data-translate={true}>
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
                    data-translate={true}
                  >
                    Giải Pháp Tối Ưu
                  </p>
                  <p data-translate={true}>
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
          {/* Form contact */}
          <div className="py-6">
            <FormContact />
          </div>
        </div>
      </div>
    </main>
  );
}
